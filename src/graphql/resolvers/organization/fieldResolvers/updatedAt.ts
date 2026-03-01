import { toISOString } from '../../../../utils';
import { OrganizationResolvers } from '../../../types';

export const updatedAt: OrganizationResolvers['updatedAt'] = (parent) =>
  toISOString(parent.updatedAt);
