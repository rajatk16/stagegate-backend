import { toISOString } from '../../../../utils';
import { EventResolvers } from '../../../types';

export const startDate: EventResolvers['startDate'] = (parent) =>
  parent.startDate ? toISOString(parent.startDate) : null;
