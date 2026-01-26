import { OrganizationResolvers } from '../../../types';
import { toISOString } from '../../../../utils';

export const createdAt: OrganizationResolvers['createdAt'] = (parent) =>
  toISOString(parent.createdAt);
