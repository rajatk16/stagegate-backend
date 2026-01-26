import { EventResolvers } from '../../../types';
import { toISOString } from '../../../../utils';

export const updatedAt: EventResolvers['updatedAt'] = (parent) => toISOString(parent.updatedAt);
