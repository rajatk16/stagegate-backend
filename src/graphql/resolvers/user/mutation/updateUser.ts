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

  const userRef = context.db.collection('users').doc(context.authUser.uid);

  const updates = {
    ...input,
    updatedAt: new Date().toISOString(),
  };

  await userRef.set(updates, { merge: true });

  const updatedDoc = await userRef.get();

  return adaptUser(updatedDoc.data() ?? {});
};
