import { GraphQLError } from 'graphql';

import { QueryResolvers } from '../../../types';
import { adaptEvent, adaptOrganization } from '../../../../utils';

export const eventBySlug: QueryResolvers['eventBySlug'] = async (_parent, args, context) => {
  const { authUser, db } = context;
  const { organizationSlug, eventSlug } = args;

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
    const orgSnap = await db
      .collection('organizations')
      .where('slug', '==', organizationSlug)
      .limit(1)
      .get();

    if (orgSnap.empty) {
      throw new GraphQLError('Organization not found', {
        extensions: {
          code: 'NOT_FOUND',
          http: {
            status: 404,
          },
        },
      });
    }

    const orgDoc = orgSnap.docs[0];
    const organization = adaptOrganization(orgDoc);

    const memberSnap = await db
      .collection('organizations')
      .doc(organization.id)
      .collection('organizationMembers')
      .where('userId', '==', authUser.uid)
      .limit(1)
      .get();

    if (memberSnap.empty) {
      throw new GraphQLError('You are not a member of this organization', {
        extensions: {
          code: 'FORBIDDEN',
          http: {
            status: 403,
          },
        },
      });
    }

    const eventSnap = await db
      .collection('organizations')
      .doc(organization.id)
      .collection('events')
      .where('slug', '==', eventSlug)
      .limit(1)
      .get();

    if (eventSnap.empty) {
      throw new GraphQLError('Event not found', {
        extensions: {
          code: 'NOT_FOUND',
          http: {
            status: 404,
          },
        },
      });
    }

    const eventDoc = eventSnap.docs[0];
    const event = adaptEvent(eventDoc);

    return event;
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
