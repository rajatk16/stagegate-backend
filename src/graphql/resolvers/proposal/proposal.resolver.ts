import { Resolvers } from '../../types';
import { eventProposals } from './queries';
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
  Query: {
    eventProposals,
  },
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
