import { GraphQLError } from 'graphql';
import { adaptUser } from '../../../../utils';
import { MutationResolvers } from '../../../types';

export const updateProfilePicture: MutationResolvers['updateProfilePicture'] = async (
  _parent,
  args,
  context,
) => {
  if (!context.authUser)
    throw new GraphQLError('Unauthorized', {
      extensions: {
        code: 'UNAUTHORIZED',
        http: {
          status: 401,
        },
      },
    });

  const { url } = args;

  if (typeof url !== 'string' || !url.startsWith('https://')) {
    throw new GraphQLError('Invalid profile picture URL', {
      extensions: {
        code: 'BAD_USER_INPUT',
        http: {
          status: 400,
        },
      },
    });
  }

  if (!url.includes('firebasestorage.googleapis.com')) {
    throw new GraphQLError('Invalid profile picture URL', {
      extensions: {
        code: 'BAD_USER_INPUT',
        http: {
          status: 400,
        },
      },
    });
  }

  const userDocRef = context.db.collection('users').doc(context.authUser.uid);

  await userDocRef.set({ profilePicture: url }, { merge: true });

  const updatedUser = (await userDocRef.get()).data();

  return adaptUser(updatedUser ?? {});
};
