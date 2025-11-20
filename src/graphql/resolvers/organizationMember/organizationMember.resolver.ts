import { Resolvers } from '../../types';

import { role, user, organization } from './fieldResolvers';

export const resolvers: Resolvers = {
  OrganizationMember: {
    role,
    user,
    organization,
  },
};
