import { GraphQLError } from 'graphql';

import { EventMemberResolvers } from '../../../types';
import { adaptUser } from '../../../../utils';

export const user: EventMemberResolvers['user'] = async (parent, _args, context) => {
  try {
    const snap = await context.db.collection('users').doc(parent.userId).get();

    if (!snap.exists) {
      throw new GraphQLError('User not found', {
        extensions: {
          code: 'NOT_FOUND',
          http: {
            status: 404,
          },
        },
      });
    }

    return adaptUser(snap);
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
