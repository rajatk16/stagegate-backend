import { toISOString } from '../../../../utils';
import { ProposalResolvers } from '../../../types';

export const updatedAt: ProposalResolvers['updatedAt'] = (parent) =>
  toISOString(parent.updatedAt);
