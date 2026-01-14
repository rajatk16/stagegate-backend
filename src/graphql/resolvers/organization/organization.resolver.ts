import { Resolvers } from '../../types';
import { owner, members, viewerRole } from './fieldResolvers';
import { createOrganization, joinOrganization } from './mutation';
import { myOrganizations, searchOrganizations, organizationBySlug } from './queries';

export const resolvers: Resolvers = {
  Query: {
    myOrganizations,
    searchOrganizations,
    organizationBySlug,
  },
  Mutation: {
    createOrganization,
    joinOrganization,
  },
  Organization: {
    owner,
    members,
    viewerRole,
  },
};
