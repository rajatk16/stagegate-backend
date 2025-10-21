import { authStatus } from './query';
import { Resolvers } from '../../types';
import { signUp } from './mutation/signUp';

export const resolvers: Resolvers = {
  Mutation: {
    signUp,
  },
  Query: {
    authStatus,
  },
};
