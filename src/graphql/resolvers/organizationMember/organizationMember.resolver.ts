import { Resolvers } from '../../types';

import { role, user, organization } from './fieldResolvers';
import {
  changeOrgMemberRole,
  joinOrganization,
  removeOrgMember,
  leaveOrganization,
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
