import { GraphQLError } from 'graphql';
import { Timestamp } from 'firebase-admin/firestore';

import { EventModel } from '../../../models';
import {
  EventStatus,
  EventMemberRole,
  MutationResolvers,
  OrganizationMemberRole,
} from '../../../types';
import {
  adaptEvent,
  notFoundError,
  forbiddenError,
  badUserInputError,
  unauthorizedError,
  internalServerError,
} from '../../../../utils';

export const updateEvent: MutationResolvers['updateEvent'] = async (
  _parent,
  { input },
  { authUser, db },
) => {
  if (!authUser) throw unauthorizedError();

  const { eventId, organizationId, ...updates } = input;

  if (Object.keys(updates).length === 0) throw badUserInputError('No updates provided.');

  try {
    const orgRef = db.collection('organizations').doc(organizationId);
    const orgSnap = await orgRef.get();

    if (!orgSnap.exists) throw notFoundError('Organization not found.');

    const eventRef = orgRef.collection('events').doc(eventId);
    const eventSnap = await eventRef.get();

    if (!eventSnap.exists) throw notFoundError('Event not found.');

    const event = eventSnap.data() as EventModel;

    const orgMemberSnap = await orgRef
      .collection('organizationMembers')
      .doc(authUser.uid)
      .get();

    if (!orgMemberSnap.exists)
      throw forbiddenError('You are not a member of this organization');

    const orgRole = orgMemberSnap.data()?.role as OrganizationMemberRole;

    const eventMemberSnap = await eventRef.collection('eventMembers').doc(authUser.uid).get();

    if (!eventMemberSnap.exists) throw forbiddenError('You are not a member of this event.');

    const eventRole = eventMemberSnap.data()?.role as EventMemberRole;

    const canEditEvent =
      orgRole === OrganizationMemberRole.Owner ||
      orgRole === OrganizationMemberRole.Admin ||
      eventRole === EventMemberRole.Organizer;

    if (!canEditEvent) throw forbiddenError('You are not authorized to update this event.');

    const start = updates.startDate ? new Date(updates.startDate) : event.startDate?.toDate();

    const end = updates.endDate ? new Date(updates.endDate) : event.endDate?.toDate();

    if (start && end && start > end)
      throw badUserInputError('Start date must be before end date.');

    if (event.status === EventStatus.Published && updates.startDate) {
      const oldStart = event.startDate?.toDate();
      if (start && oldStart && start < oldStart) {
        throw badUserInputError(
          'Start date cannot be moved to a past date for a published event.',
        );
      }
    }

    if (updates.status) {
      const transitions: Record<EventStatus, EventStatus[]> = {
        [EventStatus.Draft]: [EventStatus.Published],
        [EventStatus.Published]: [EventStatus.Archived],
        [EventStatus.Archived]: [],
      };

      const allowed = transitions[event.status as EventStatus] ?? [];

      if (!allowed.includes(updates.status))
        throw badUserInputError(
          `Invalid status transition from ${event.status} to ${updates.status}.`,
        );
    }

    const patch: Record<string, unknown> = {
      updatedAt: Timestamp.now(),
    };

    if (updates.description !== undefined) patch.description = updates.description;
    if (updates.endDate) patch.endDate = Timestamp.fromDate(new Date(updates.endDate));
    if (updates.eventType) patch.eventType = updates.eventType;
    if (updates.format) patch.format = updates.format;
    if (updates.location) patch.location = updates.location;
    if (updates.startDate) patch.startDate = Timestamp.fromDate(new Date(updates.startDate));
    if (updates.status) patch.status = updates.status;
    if (updates.tagline !== undefined) patch.tagline = updates.tagline;
    if (updates.website !== undefined) patch.website = updates.website;
    if (updates.coverImage !== undefined) patch.coverImage = updates.coverImage;

    await eventRef.update(patch);

    const updated = await eventRef.get();

    return adaptEvent(updated);
  } catch (error) {
    console.error(error);

    if (error instanceof GraphQLError) {
      throw error;
    }

    throw internalServerError();
  }
};
