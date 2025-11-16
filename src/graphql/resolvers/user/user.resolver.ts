import { me } from './query';
import { updateUser, updateProfilePicture } from './mutation';
import { Resolvers } from '../../types';

export const resolvers: Resolvers = {
  Query: {
    me,
  },
  Mutation: {
    updateUser,
    updateProfilePicture,
  },
};
