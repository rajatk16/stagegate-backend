import { GraphQLError } from 'graphql';
import { Timestamp } from 'firebase-admin/firestore';

import { EventModel } from '../../../models';
import {
  EventStatus,
  EventMemberRole,
  MutationResolvers,
  OrganizationMemberRole,
} from '../../../types';
import { adaptEvent } from '../../../../utils';

export const updateEvent: MutationResolvers['updateEvent'] = async (
  _parent,
  { input },
  { authUser, db },
) => {
  if (!authUser) {
    throw new GraphQLError('Unauthorized', {
      extensions: {
        code: 'UNAUTHORIZED',
        http: {
          status: 401,
        },
      },
    });
  }

  const { eventId, organizationId, ...updates } = input;

  if (Object.keys(updates).length === 0) {
    throw new GraphQLError('No updates provided', {
      extensions: {
        code: 'BAD_USER_INPUT',
        http: {
          status: 400,
        },
      },
    });
  }

  try {
    const orgRef = db.collection('organizations').doc(organizationId);
    const orgSnap = await orgRef.get();

    if (!orgSnap.exists) {
      throw new GraphQLError('Organization not found', {
        extensions: {
          code: 'NOT_FOUND',
          http: {
            status: 404,
          },
        },
      });
    }

    const eventRef = orgRef.collection('events').doc(eventId);
    const eventSnap = await eventRef.get();

    if (!eventSnap.exists) {
      throw new GraphQLError('Event not found', {
        extensions: {
          code: 'NOT_FOUND',
          http: {
            status: 404,
          },
        },
      });
    }

    const event = eventSnap.data() as EventModel;

    const orgMemberSnap = await orgRef
      .collection('organizationMembers')
      .doc(authUser.uid)
      .get();

    if (!orgMemberSnap.exists) {
      throw new GraphQLError('You are not a member of this organization', {
        extensions: {
          code: 'FORBIDDEN',
          http: {
            status: 403,
          },
        },
      });
    }

    const orgRole = orgMemberSnap.data()?.role as OrganizationMemberRole;

    const eventMemberSnap = await eventRef.collection('eventMembers').doc(authUser.uid).get();

    if (!eventMemberSnap.exists) {
      throw new GraphQLError('You are not a member of this event', {
        extensions: {
          code: 'FORBIDDEN',
          http: {
            status: 403,
          },
        },
      });
    }

    const eventRole = eventMemberSnap.data()?.role as EventMemberRole;

    const canEditEvent =
      orgRole === OrganizationMemberRole.Owner ||
      orgRole === OrganizationMemberRole.Admin ||
      eventRole === EventMemberRole.Organizer;

    if (!canEditEvent) {
      throw new GraphQLError('You are not authorized to update this event', {
        extensions: {
          code: 'FORBIDDEN',
          http: {
            status: 403,
          },
        },
      });
    }

    const start = updates.startDate ? new Date(updates.startDate) : event.startDate?.toDate();

    const end = updates.endDate ? new Date(updates.endDate) : event.endDate?.toDate();

    if (start && end && start > end) {
      throw new GraphQLError('Start date must be before end date', {
        extensions: {
          code: 'BAD_USER_INPUT',
          http: {
            status: 400,
          },
        },
      });
    }

    if (event.status === EventStatus.Published && updates.startDate) {
      const oldStart = event.startDate?.toDate();
      if (start && oldStart && start < oldStart) {
        throw new GraphQLError(
          'Start date cannot be moved to a past date for a published event',
          {
            extensions: {
              code: 'BAD_USER_INPUT',
              http: {
                status: 400,
              },
            },
          },
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

      if (!allowed.includes(updates.status)) {
        throw new GraphQLError(
          `Invalid status transition from ${event.status} to ${updates.status}`,
          {
            extensions: {
              code: 'BAD_USER_INPUT',
              http: {
                status: 400,
              },
            },
          },
        );
      }
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

    throw new GraphQLError('Internal server error', {
      extensions: {
        code: 'INTERNAL_SERVER_ERROR',
        http: {
          status: 500,
        },
      },
    });
  }
};
