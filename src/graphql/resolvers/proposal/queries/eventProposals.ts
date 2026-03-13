import { GraphQLError } from 'graphql';

import { EventMemberRole, OrganizationMemberRole, QueryResolvers } from '../../../types';
import {
  adaptProposal,
  decodeCursor,
  DEFAULT_PAGINATION_LIMIT,
  encodeCursor,
  forbiddenError,
  internalServerError,
  unauthorizedError,
} from '../../../../utils';
import { EventMemberModel, OrganizationMemberModel } from '../../../models';

export const eventProposals: QueryResolvers['eventProposals'] = async (
  _,
  { organizationId, eventId, pagination },
  { authUser, db },
) => {
  if (!authUser) throw unauthorizedError();

  try {
    const orgRef = db.collection('organizations').doc(organizationId);
    const eventRef = orgRef.collection('events').doc(eventId);
    const proposalsRef = eventRef.collection('proposals');

    const totalSnapshot = await proposalsRef.count().get();
    const total = totalSnapshot.data().count;

    let hasAccess = false;

    const orgMemberSnap = await orgRef
      .collection('organizationMembers')
      .doc(authUser.uid)
      .get();

    if (orgMemberSnap.exists) {
      const orgRole = (orgMemberSnap.data() as OrganizationMemberModel)
        .role as OrganizationMemberRole;

      if (
        orgRole === OrganizationMemberRole.Owner ||
        orgRole === OrganizationMemberRole.Admin
      ) {
        hasAccess = true;
      }
    } else {
      throw forbiddenError('You are not a member of this organization');
    }

    if (!hasAccess) {
      const eventMemberSnap = await eventRef.collection('eventMembers').doc(authUser.uid).get();

      if (eventMemberSnap.exists) {
        const eventRole = (eventMemberSnap.data() as EventMemberModel).role as EventMemberRole;

        if (eventRole === EventMemberRole.Organizer) {
          hasAccess = true;
        }
      } else {
        throw forbiddenError('You are not a member of this event');
      }
    }

    if (!hasAccess) {
      return {
        proposals: null,
        pagination: {
          cursor: null,
          total,
        },
      };
    }

    let offset = 0;
    let limit = DEFAULT_PAGINATION_LIMIT;

    if (pagination?.cursor) {
      const decoded = decodeCursor(pagination.cursor);
      limit = decoded.limit;
      offset = decoded.offset;
    } else if (pagination?.limit) {
      limit = pagination.limit;
    }

    const snapshot = await proposalsRef
      .orderBy('createdAt', 'desc')
      .offset(offset)
      .limit(limit)
      .get();

    const proposals = snapshot.docs.map((doc) => adaptProposal(doc));

    const nextOffset = offset + proposals.length;
    const nextCursor = nextOffset < total ? encodeCursor(limit, nextOffset) : null;

    return {
      proposals,
      pagination: {
        cursor: nextCursor,
        total,
      },
    };
  } catch (error) {
    console.error(error);

    if (error instanceof GraphQLError) {
      throw error;
    }

    throw internalServerError();
  }
};
