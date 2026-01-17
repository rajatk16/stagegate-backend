import { Resolvers } from '../../types';
import { owner, members, viewerRole } from './fieldResolvers';
import { myOrganizations, searchOrganizations, organizationBySlug } from './queries';
import { createOrganization, joinOrganization, changeOrgMemberRole } from './mutation';

export const resolvers: Resolvers = {
  Query: {
    myOrganizations,
    searchOrganizations,
    organizationBySlug,
  },
  Mutation: {
    createOrganization,
    joinOrganization,
    changeOrgMemberRole,
  },
  Organization: {
    owner,
    members,
    viewerRole,
  },
};
