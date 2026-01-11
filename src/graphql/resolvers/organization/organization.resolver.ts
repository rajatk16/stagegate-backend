import { Resolvers } from '../../types';
import { createOrganization } from './mutation';
import { owner, members, viewerRole } from './fieldResolvers';
import { myOrganizations, searchOrganizations } from './queries';

export const resolvers: Resolvers = {
  Query: {
    myOrganizations,
    searchOrganizations,
  },
  Mutation: {
    createOrganization,
  },
  Organization: {
    owner,
    members,
    viewerRole,
  },
};
