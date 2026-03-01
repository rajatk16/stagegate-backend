import { GraphQLError } from 'graphql';
import { Timestamp } from 'firebase-admin/firestore';

import { EventMemberModel, EventModel } from '../../../models';
import {
  EventStatus,
  EventMemberRole,
  MutationResolvers,
  OrganizationMemberRole,
} from '../../../types';
import {
  notFoundError,
  forbiddenError,
  badUserInputError,
  unauthorizedError,
  generateUniqueSlug,
  internalServerError,
} from '../../../../utils';

export const createEvent: MutationResolvers['createEvent'] = async (
  _,
  { input },
  { authUser, db },
) => {
  if (!authUser) throw unauthorizedError();

  const {
    coverImage,
    description,
    endDate,
    eventType,
    format,
    location,
    name,
    organizationId,
    startDate,
    tagline,
    website,
  } = input;

  try {
    const orgRef = db.collection('organizations').doc(organizationId);
    const orgSnap = await orgRef.get();

    if (!orgSnap.exists) {
      throw notFoundError('Organization not found');
    }

    const orgMemberSnap = await orgRef
      .collection('organizationMembers')
      .doc(authUser.uid)
      .get();

    if (!orgMemberSnap.exists)
      throw forbiddenError('You are not a member of this organization');

    const viewerOrgRole = orgMemberSnap.data()?.role as OrganizationMemberRole;

    if (
      viewerOrgRole !== OrganizationMemberRole.Admin &&
      viewerOrgRole !== OrganizationMemberRole.Owner
    )
      throw forbiddenError('You are not authorized to create an event for this organization');

    if (startDate && endDate && new Date(startDate) > new Date(endDate))
      throw badUserInputError('Start date must be before end date');

    const nameCheckSnap = await db
      .collection('events')
      .where('name', '==', name)
      .limit(1)
      .get();

    if (!nameCheckSnap.empty) throw badUserInputError('An event with this name already exists');

    const slug = generateUniqueSlug(name);

    const slugCheckSnap = await db
      .collection('events')
      .where('slug', '==', slug)
      .limit(1)
      .get();

    if (!slugCheckSnap.empty) throw badUserInputError('An event with this slug already exists');

    const eventRef = orgRef.collection('events').doc();
    const eventId = eventRef.id;

    const now = Timestamp.now();

    const eventData: EventModel = {
      id: eventId,
      name,
      slug,
      eventType,
      description: description ?? null,
      tagline: tagline ?? null,
      startDate: startDate ? Timestamp.fromDate(new Date(startDate)) : null,
      endDate: endDate ? Timestamp.fromDate(new Date(endDate)) : null,
      location: {
        name: location?.name ?? null,
        address: location?.address ?? null,
        city: location?.city ?? null,
        country: location?.country ?? null,
      },
      website: website ?? null,
      coverImage: coverImage ?? null,
      organizationId,
      format,
      status: EventStatus.Draft,
      createdAt: now,
      updatedAt: now,
    };

    const orgMembersSnap = await orgRef.collection('organizationMembers').get();

    const batch = db.batch();

    batch.set(eventRef, eventData);

    orgMembersSnap.docs.forEach((doc) => {
      const { role } = doc.data() as { role: OrganizationMemberRole };

      const eventRole =
        role === OrganizationMemberRole.Owner || role === OrganizationMemberRole.Admin
          ? EventMemberRole.Organizer
          : EventMemberRole.Guest;

      const member: EventMemberModel = {
        eventId,
        joinedAt: now,
        userId: doc.id,
        role: eventRole,
        orgId: organizationId,
      };

      batch.set(eventRef.collection('eventMembers').doc(authUser.uid), member);
    });

    await batch.commit();

    return {
      event: eventData,
    };
  } catch (error) {
    console.log(error);
    if (error instanceof GraphQLError) {
      throw error;
    }

    throw internalServerError();
  }
};
