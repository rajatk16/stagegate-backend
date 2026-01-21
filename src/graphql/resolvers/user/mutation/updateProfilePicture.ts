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

  try {
    const userDocRef = context.db.collection('users').doc(context.authUser.uid);

    await userDocRef.set(
      { profilePicture: url, updatedAt: new Date().toISOString() },
      { merge: true },
    );

    const updatedUser = await userDocRef.get();

    return adaptUser(updatedUser);
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
