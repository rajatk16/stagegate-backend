import { OrganizationMemberResolvers, OrganizationMemberRole } from '../../../types';

export const role: OrganizationMemberResolvers['role'] = async (parent) => {
  return parent.role as OrganizationMemberRole;
};
