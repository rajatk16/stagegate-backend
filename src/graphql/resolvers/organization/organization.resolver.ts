import { Resolvers } from '../../types';
import { createOrganization } from './mutation';
import { owner, members, viewerRole } from './fieldResolvers';
import { myOrganizations, searchOrganizations, organizationBySlug } from './queries';

export const resolvers: Resolvers = {
  Query: {
    myOrganizations,
    searchOrganizations,
    organizationBySlug,
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
