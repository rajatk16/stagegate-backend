import { GraphQLError } from 'graphql';
import { Timestamp } from 'firebase-admin/firestore';

import { generateUniqueSlug } from '../../../../utils';
import { EventMemberModel, EventModel } from '../../../models';
import {
  EventStatus,
  EventMemberRole,
  MutationResolvers,
  OrganizationMemberRole,
} from '../../../types';

export const createEvent: MutationResolvers['createEvent'] = async (
  _,
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
      throw new GraphQLError('Organization not found', {
        extensions: {
          code: 'NOT_FOUND',
          http: {
            status: 404,
          },
        },
      });
    }

    const orgMemberSnap = await orgRef.collection('members').doc(authUser.uid).get();

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

    const viewerOrgRole = orgMemberSnap.data()?.role as OrganizationMemberRole;

    if (
      viewerOrgRole !== OrganizationMemberRole.Admin &&
      viewerOrgRole !== OrganizationMemberRole.Owner
    ) {
      throw new GraphQLError(
        'You are not authorized to create an event for this organization',
        {
          extensions: {
            code: 'FORBIDDEN',
            http: {
              status: 403,
            },
          },
        },
      );
    }

    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      throw new GraphQLError('Start date must be before end date', {
        extensions: {
          code: 'BAD_USER_INPUT',
          http: {
            status: 400,
          },
        },
      });
    }

    const nameCheckSnap = await db
      .collection('events')
      .where('name', '==', name)
      .limit(1)
      .get();

    if (!nameCheckSnap.empty) {
      throw new GraphQLError('An event with this name already exists', {
        extensions: {
          code: 'BAD_USER_INPUT',
          http: {
            status: 400,
          },
        },
      });
    }

    const slug = generateUniqueSlug(name);

    const slugCheckSnap = await db
      .collection('events')
      .where('slug', '==', slug)
      .limit(1)
      .get();

    if (!slugCheckSnap.empty) {
      throw new GraphQLError('An event with this slug already exists', {
        extensions: {
          code: 'BAD_USER_INPUT',
          http: {
            status: 400,
          },
        },
      });
    }

    const eventRef = db.collection('events').doc();
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

    const orgMembersSnap = await orgRef.collection('members').get();

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

      batch.set(eventRef.collection('members').doc(), member);
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
