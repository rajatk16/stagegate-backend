import { Resolvers } from '../../types';

import { role, user, organization } from './fieldResolvers';
import {
  removeOrgMember,
  joinOrganization,
  leaveOrganization,
  changeOrgMemberRole,
} from './mutation';

export const resolvers: Resolvers = {
  Mutation: {
    removeOrgMember,
    joinOrganization,
    leaveOrganization,
    changeOrgMemberRole,
  },
  OrganizationMember: {
    role,
    user,
    organization,
  },
};
