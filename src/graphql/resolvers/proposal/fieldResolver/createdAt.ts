import { toISOString } from '../../../../utils';
import { ProposalResolvers } from '../../../types';

export const createdAt: ProposalResolvers['createdAt'] = (parent) =>
  toISOString(parent.createdAt);
