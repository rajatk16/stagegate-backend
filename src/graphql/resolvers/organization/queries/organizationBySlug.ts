import { GraphQLError } from 'graphql';

import { QueryResolvers } from '../../../types';
import { adaptOrganization } from '../../../../utils';

export const organizationBySlug: QueryResolvers['organizationBySlug'] = async (
  _parent,
  args,
  context,
) => {
  const { authUser, db } = context;
  const { slug } = args;

  if (!authUser) {
    throw new GraphQLError('Unauthorized', {
      extensions: {
        code: 'UNAUTHORIZED',
        http: {
          status: 401,
        },
      },
    });
  }

  try {
    const snapshot = await db
      .collection('organizations')
      .where('slug', '==', slug)
      .limit(1)
      .get();

    if (snapshot.empty) {
      throw new GraphQLError('Organization not found', {
        extensions: {
          code: 'NOT_FOUND',
          http: {
            status: 404,
          },
        },
      });
    }

    const doc = snapshot.docs[0];

    // Check if the user is a member of the organization
    const membershipDoc = await db
      .collection('organizations')
      .doc(doc.id)
      .collection('organizationMembers')
      .doc(authUser.uid)
      .get();

    if (!membershipDoc.exists) {
      throw new GraphQLError('You are not a member of this organization', {
        extensions: {
          code: 'FORBIDDEN',
          http: {
            status: 403,
          },
        },
      });
    }

    return adaptOrganization(doc);
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
