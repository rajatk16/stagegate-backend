import { GraphQLError } from 'graphql';

import { adaptUser } from '../../../../utils';
import { OrganizationResolvers } from '../../../types';

export const owner: OrganizationResolvers['owner'] = async (parent, _args, context) => {
  const snap = await context.db.collection('users').doc(parent.ownerId).get();

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
