import { GraphQLError } from 'graphql';

import { adaptUser } from '../../../../utils';
import { MutationResolvers } from '../../../types';

export const deleteProfilePicture: MutationResolvers['deleteProfilePicture'] = async (
  _parent,
  _args,
  context,
) => {
  if (!context.authUser) {
    throw new GraphQLError('Unauthorized', {
      extensions: {
        code: 'UNAUTHORIZED',
        http: {
          status: 401,
        },
      },
    });
  }

  const userDocRef = context.db.collection('users').doc(context.authUser.uid);
  const userDoc = await userDocRef.get();

  if (!userDoc.exists) {
    throw new GraphQLError('User not found', {
      extensions: {
        code: 'NOT_FOUND',
        http: {
          status: 404,
        },
      },
    });
  }

  const user = userDoc.data();

  if (!user?.profilePicture) {
    throw new GraphQLError('Profile picture not found', {
      extensions: {
        code: 'NOT_FOUND',
        http: {
          status: 404,
        },
      },
    });
  }

  // Set the profile picture to an empty string
  await userDocRef.set({ profilePicture: '' }, { merge: true });

  // Delete the profile picture from the storage
  await context.storageBucket.file(`profilePictures/${context.authUser.uid}`).delete();

  const updatedUser = (await userDocRef.get()).data();

  return adaptUser(updatedUser ?? {});
};
