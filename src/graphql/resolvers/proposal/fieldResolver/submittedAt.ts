import { toISOString } from '../../../../utils';
import { ProposalResolvers } from '../../../types';

export const submittedAt: ProposalResolvers['submittedAt'] = (parent) =>
  parent.submittedAt ? toISOString(parent.submittedAt) : null;
