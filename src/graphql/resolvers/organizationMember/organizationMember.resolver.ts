import { Resolvers } from '../../types';

import { role, user, organization } from './fieldResolvers';
import { changeOrgMemberRole, joinOrganization, removeOrgMember } from './mutation';

export const resolvers: Resolvers = {
  Mutation: {
    removeOrgMember,
    joinOrganization,
    changeOrgMemberRole,
  },
  OrganizationMember: {
    role,
    user,
    organization,
  },
};
