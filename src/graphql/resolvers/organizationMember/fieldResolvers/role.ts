import { OrganizationMemberResolvers, OrganizationMemberRole } from '../../../types';

export const role: OrganizationMemberResolvers['role'] = async (parent) =>
  parent.role as OrganizationMemberRole;
