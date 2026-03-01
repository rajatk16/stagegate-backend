import { Resolvers } from '../../types';
import { createEvent, updateEvent } from './mutations';
import { organizationEvents, eventBySlug } from './query';
import {
  endDate,
  members,
  createdAt,
  startDate,
  updatedAt,
  organization,
  viewerOrgRole,
  viewerEventRole,
} from './fieldResolvers';

export const resolvers: Resolvers = {
  Event: {
    endDate,
    members,
    createdAt,
    startDate,
    updatedAt,
    organization,
    viewerOrgRole,
    viewerEventRole,
  },
  Query: {
    eventBySlug,
    organizationEvents,
  },
  Mutation: {
    createEvent,
    updateEvent,
  },
};
