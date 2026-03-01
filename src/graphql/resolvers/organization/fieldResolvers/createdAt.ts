import { toISOString } from '../../../../utils';
import { OrganizationResolvers } from '../../../types';

export const createdAt: OrganizationResolvers['createdAt'] = (parent) =>
  toISOString(parent.createdAt);
