import { Resolvers } from '../../types';
import { createEvent } from './mutations';
import { organizationEvents } from './query';
import { members, organization, viewerEventRole, viewerOrgRole } from './fieldResolvers';

export const resolvers: Resolvers = {
  Event: {
    members,
    organization,
    viewerOrgRole,
    viewerEventRole,
  },
  Query: {
    organizationEvents,
  },
  Mutation: {
    createEvent,
  },
};
