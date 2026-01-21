import { EventMemberResolvers, EventMemberRole } from '../../../types';

export const role: EventMemberResolvers['role'] = async (parent) =>
  parent.role as EventMemberRole;
