import { GraphQLError } from 'graphql';

import { OrganizationMemberRole, OrganizationResolvers } from '../../../types';

export const viewerRole: OrganizationResolvers['viewerRole'] = async (
  parent,
  _args,
  context,
) => {
  try {
    if (!context.authUser) {
      return null;
    }

    // Check if the user is a member of the organization
    const memberSnapshot = await context.db
      .collectionGroup('organizationMembers')
      .where('orgId', '==', parent.id)
      .where('userId', '==', context.authUser?.uid)
      .limit(1)
      .get();

    if (memberSnapshot.empty) {
      return null;
    }

    const member = memberSnapshot.docs[0].data();

    return member.role as OrganizationMemberRole;
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
