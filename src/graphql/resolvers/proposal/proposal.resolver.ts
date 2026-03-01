import { Resolvers } from '../../types';
import { bulkCreateProposals } from './mutation';
import {
  event,
  speaker,
  createdAt,
  updatedAt,
  submittedAt,
  viewerRoles,
  organization,
} from './fieldResolver';

export const resolvers: Resolvers = {
  Mutation: {
    bulkCreateProposals,
  },
  Proposal: {
    event,
    speaker,
    createdAt,
    updatedAt,
    submittedAt,
    viewerRoles,
    organization,
  },
};
