import { me } from './query';
import { Resolvers } from '../../types';
import { updateUser, deleteProfilePicture, updateProfilePicture } from './mutation';

export const resolvers: Resolvers = {
  Query: {
    me,
  },
  Mutation: {
    updateUser,
    deleteProfilePicture,
    updateProfilePicture,
  },
};
