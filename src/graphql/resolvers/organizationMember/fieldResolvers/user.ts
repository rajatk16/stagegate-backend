import { GraphQLError } from 'graphql';

import { adaptUser } from '../../../../utils';
import { OrganizationMemberResolvers } from '../../../types';

export const user: OrganizationMemberResolvers['user'] = async (parent, _args, context) => {
  const snap = await context.db.collection('users').doc(parent.userId).get();

  if (!snap.exists) {
    throw new GraphQLError('User not found', {
      extensions: {
        code: 'NOT_FOUND',
        http: {
          status: 404,
        },
      },
    });
  }

  return adaptUser(snap);
};
