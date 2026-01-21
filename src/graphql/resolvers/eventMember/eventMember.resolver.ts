import { Resolvers } from '../../types';
import { event, role, user } from './fieldResolvers';

export const resolvers: Resolvers = {
  EventMember: {
    role,
    user,
    event,
  },
};
