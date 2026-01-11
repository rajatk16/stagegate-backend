import { GraphQLError } from 'graphql';

import { QueryResolvers } from '../../../types';
import { adaptOrganization } from '../../../../utils';

export const myOrganizations: QueryResolvers['myOrganizations'] = async (
  _parent,
  _args,
  context,
) => {
  try {
    if (!context.authUser) {
      throw new GraphQLError('Unauthorized', {
        extensions: {
          code: 'UNAUTHORIZED',
          http: {
            status: 401,
          },
        },
      });
    }

    const userId = context.authUser.uid;

    const membershipSnapshot = await context.db
      .collectionGroup('members')
      .where('userId', '==', userId)
      .orderBy('joinedAt', 'desc')
      .get();

    if (membershipSnapshot.empty) return [];

    const orgIds = membershipSnapshot.docs
      .map((doc) => doc.ref.parent.parent?.id)
      .filter(Boolean);

    const organizationFetches = orgIds.map((orgId) =>
      context.db.collection('organizations').doc(orgId!).get(),
    );

    const orgDocs = await Promise.all(organizationFetches);

    return orgDocs.filter((d) => d.exists).map((doc) => adaptOrganization(doc));
  } catch (error) {
    console.error(error);
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
