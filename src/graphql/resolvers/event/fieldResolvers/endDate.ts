import { toISOString } from '../../../../utils';
import { EventResolvers } from '../../../types';

export const endDate: EventResolvers['endDate'] = (parent) =>
  parent.endDate ? toISOString(parent.endDate) : null;
