import { Resolvers } from '../../types';
import { members, owner, viewerRole } from './fieldResolvers';
import { createOrganization, updateOrganization } from './mutation';
import { myOrganizations, organizationBySlug, searchOrganizations } from './queries';

export const resolvers: Resolvers = {
  Query: {
    myOrganizations,
    searchOrganizations,
    organizationBySlug,
  },
  Mutation: {
    createOrganization,
    updateOrganization,
  },
  Organization: {
    owner,
    members,
    viewerRole,
  },
};
