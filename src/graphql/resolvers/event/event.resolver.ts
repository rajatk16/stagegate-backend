import { Resolvers } from '../../types';
import { createEvent } from './mutations';
import { members, organization, viewerEventRole, viewerOrgRole } from './fieldResolvers';

export const resolvers: Resolvers = {
  Mutation: {
    createEvent,
  },
  Event: {
    members,
    organization,
    viewerOrgRole,
    viewerEventRole,
  },
};
