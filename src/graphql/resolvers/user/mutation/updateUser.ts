import { GraphQLError } from 'graphql';

import { adaptUser } from '../../../../utils';
import { MutationResolvers } from '../../../types';

export const updateUser: MutationResolvers['updateUser'] = async (_parent, args, context) => {
  if (!context.authUser)
    throw new GraphQLError('Unauthorized', {
      extensions: {
        code: 'UNAUTHORIZED',
        http: {
          status: 401,
        },
      },
    });

  const { input } = args;

  try {
    const userRef = context.db.collection('users').doc(context.authUser.uid);

    const updates = {
      ...input,
      updatedAt: new Date().toISOString(),
    };

    await userRef.set(updates, { merge: true });

    const updatedDoc = await userRef.get();

    return adaptUser(updatedDoc);
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
