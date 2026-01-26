import { OrganizationResolvers } from '../../../types';
import { toISOString } from '../../../../utils';

export const updatedAt: OrganizationResolvers['updatedAt'] = (parent) =>
  toISOString(parent.updatedAt);
