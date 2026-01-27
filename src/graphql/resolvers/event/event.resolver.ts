import { Resolvers } from '../../types';
import { createEvent } from './mutations';
import { organizationEvents, eventBySlug } from './query';
import {
  members,
  organization,
  viewerEventRole,
  viewerOrgRole,
  startDate,
  endDate,
  createdAt,
  updatedAt,
} from './fieldResolvers';

export const resolvers: Resolvers = {
  Event: {
    members,
    organization,
    viewerOrgRole,
    viewerEventRole,
    startDate,
    endDate,
    createdAt,
    updatedAt,
  },
  Query: {
    organizationEvents,
    eventBySlug,
  },
  Mutation: {
    createEvent,
  },
};
