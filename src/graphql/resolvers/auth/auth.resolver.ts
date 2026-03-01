import { signUp } from './mutation';
import { authStatus } from './query';
import { Resolvers } from '../../types';

export const resolvers: Resolvers = {
  Query: {
    authStatus,
  },
  Mutation: {
    signUp,
  },
};
