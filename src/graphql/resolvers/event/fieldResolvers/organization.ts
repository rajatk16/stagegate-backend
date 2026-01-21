import { GraphQLError } from 'graphql';

import { EventResolvers } from '../../../types';
import { adaptOrganization } from '../../../../utils';

export const organization: EventResolvers['organization'] = async (parent, _args, { db }) => {
  try {
    const snap = await db.collection('organizations').doc(parent.organizationId).get();

    if (!snap.exists) {
      throw new GraphQLError('Organization not found', {
        extensions: {
          code: 'NOT_FOUND',
          http: {
            status: 404,
          },
        },
      });
    }

    return adaptOrganization(snap);
  } catch (error) {
    console.error(error);

    if (error instanceof GraphQLError) {
      throw error;
    }

    throw new GraphQLError('Internal server error', {
      extensions: {
        code: 'INTERNAL_SERVER_ERROR',
        http: {
          status: 500,
        },
      },
    });
  }
};
