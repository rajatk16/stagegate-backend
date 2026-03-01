import { EventResolvers } from '../../../types';
import { toISOString } from '../../../../utils';

export const endDate: EventResolvers['endDate'] = (parent) =>
  parent.endDate ? toISOString(parent.endDate) : null;
