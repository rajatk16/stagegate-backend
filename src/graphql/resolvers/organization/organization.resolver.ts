import { Resolvers } from '../../types';

import { owner, members } from './fieldResolvers';
import { createOrganization } from './mutation';

export const resolvers: Resolvers = {
  Mutation: {
    createOrganization,
  },
  Organization: {
    owner,
    members,
  },
};
