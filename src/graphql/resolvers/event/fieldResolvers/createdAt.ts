import { EventResolvers } from '../../../types';
import { toISOString } from '../../../../utils';

export const createdAt: EventResolvers['createdAt'] = (parent) => toISOString(parent.createdAt);
