import { Resolvers } from '../../types';
import { bulkCreateProposals } from './mutation';

export const resolvers: Resolvers = {
  Mutation: {
    bulkCreateProposals,
  },
};
