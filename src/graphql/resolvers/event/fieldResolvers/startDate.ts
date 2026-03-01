import { EventResolvers } from '../../../types';
import { toISOString } from '../../../../utils';

export const startDate: EventResolvers['startDate'] = (parent) =>
  parent.startDate ? toISOString(parent.startDate) : null;
