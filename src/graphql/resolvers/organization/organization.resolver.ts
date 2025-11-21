import { Resolvers } from '../../types';
import { myOrganizations } from './queries';
import { createOrganization } from './mutation';
import { owner, members } from './fieldResolvers';

export const resolvers: Resolvers = {
  Query: {
    myOrganizations,
  },
  Mutation: {
    createOrganization,
  },
  Organization: {
    owner,
    members,
  },
};
