import { GraphQLError } from 'graphql';

import { QueryResolvers } from '../../../types';
import { adaptEvent } from '../../../../utils';

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

    const eventsSnap = await orgRef.collection('events').orderBy('createdAt', 'desc').get();

    if (eventsSnap.empty || eventsSnap.docs.length === 0) {
      return [];
    }

    const visibleEvents = [];

    for (const eventDoc of eventsSnap.docs) {
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
