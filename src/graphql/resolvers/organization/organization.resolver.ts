import { Resolvers } from '../../types';
import { createOrganization, updateOrganization } from './mutation';
import { members, owner, viewerRole, createdAt, updatedAt } from './fieldResolvers';
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
    createdAt,
    updatedAt,
  },
};
