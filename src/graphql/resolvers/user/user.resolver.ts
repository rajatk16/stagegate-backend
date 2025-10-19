import { me } from './query';
import { updateUser } from './mutation';
import { Resolvers } from '../../types';

export const resolvers: Resolvers = {
  Query: {
    me,
  },
  Mutation: {
    updateUser,
  },
};
