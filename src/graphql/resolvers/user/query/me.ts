import { GraphQLError } from 'graphql';

import { adaptUser } from '../../../../utils';
import { QueryResolvers } from '../../../types';

export const me: QueryResolvers['me'] = async (_parent, _args, context) => {
  if (!context.authUser) return null;

  try {
    const doc = await context.db.collection('users').doc(context.authUser.uid).get();

    if (!doc.exists) throw new GraphQLError('User profile not found');

    return adaptUser(doc);
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
