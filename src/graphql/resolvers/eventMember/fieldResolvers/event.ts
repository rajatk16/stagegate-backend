import { GraphQLError } from 'graphql';

import { adaptEvent } from '../../../../utils';
import { EventMemberResolvers } from '../../../types';

export const event: EventMemberResolvers['event'] = async (parent, _args, context) => {
  try {
    const snap = await context.db
      .collection('organizations')
      .doc(parent.orgId)
      .collection('events')
      .doc(parent.eventId)
      .get();

    if (!snap.exists) {
      throw new GraphQLError('Event not found', {
        extensions: {
          code: 'NOT_FOUND',
          http: {
            status: 404,
          },
        },
      });
    }

    const data = snap.data();

    if (!data) {
      throw new GraphQLError('Event not found', {
        extensions: {
          code: 'NOT_FOUND',
          http: {
            status: 404,
          },
        },
      });
    }

    return adaptEvent(snap);
  } catch (error) {
    console.error(error);
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
