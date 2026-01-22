import { GraphQLError } from 'graphql';

import {
  EventStatus,
  QueryResolvers,
  EventMemberRole,
  OrganizationMemberRole,
} from '../../../types';
import { adaptEvent } from '../../../../utils';
import { EventMemberModel, EventModel, OrganizationMemberModel } from '../../../models';

export const organizationEvents: QueryResolvers['organizationEvents'] = async (
  _parent,
  { organizationId },
  { db, authUser },
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

  try {
    const orgSnap = await db.collection('organizations').doc(organizationId).get();

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

    const orgRef = orgSnap.ref;

    const orgMemberSnap = await orgRef.collection('members').doc(authUser.uid).get();

    const viewerOrgRole = orgMemberSnap.exists
      ? ((orgMemberSnap.data() as OrganizationMemberModel).role as OrganizationMemberRole)
      : null;

    const isOrgAdmin =
      viewerOrgRole === OrganizationMemberRole.Admin ||
      viewerOrgRole === OrganizationMemberRole.Owner;

    const eventsSnap = await orgRef.collection('events').orderBy('createdAt', 'desc').get();

    if (eventsSnap.empty || eventsSnap.docs.length === 0) {
      return [];
    }

    const visibleEvents = [];

    for (const eventDoc of eventsSnap.docs) {
      const eventData = eventDoc.data() as EventModel;
      const eventRef = eventDoc.ref;

      const status = eventData.status as EventStatus;
      const isPublic = eventData.isPublic;

      const eventMemberSnap = await eventRef.collection('members').doc(authUser.uid).get();

      const eventViewerRole = eventMemberSnap.exists
        ? ((eventMemberSnap.data() as EventMemberModel).role as EventMemberRole)
        : null;

      let canSee = false;

      if (isOrgAdmin) {
        canSee = true;
      } else if (status === EventStatus.Published) {
        if (isPublic) {
          canSee = true;
        } else if (viewerOrgRole) {
          canSee = true;
        }
      } else if (status === EventStatus.Draft) {
        if (
          eventViewerRole &&
          (eventViewerRole === EventMemberRole.Organizer ||
            eventViewerRole === EventMemberRole.Reviewer)
        ) {
          canSee = true;
        }
      } else if (status === EventStatus.Archived) {
        if (
          eventViewerRole &&
          (eventViewerRole === EventMemberRole.Organizer ||
            eventViewerRole === EventMemberRole.Reviewer)
        ) {
          canSee = true;
        }
      }

      if (!canSee) {
        continue;
      }

      visibleEvents.push(adaptEvent(eventDoc));
    }

    return visibleEvents;
  } catch (error) {
    console.error('error');

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
