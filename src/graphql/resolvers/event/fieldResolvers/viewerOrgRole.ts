import { GraphQLError } from 'graphql';
import { EventResolvers, OrganizationMemberRole } from '../../../types';

export const viewerOrgRole: EventResolvers['viewerOrgRole'] = async (
  parent,
  _args,
  { authUser, db },
) => {
  try {
    if (!authUser) {
      return null;
    }

    const memberSnapshot = await db
      .collectionGroup('organizationMembers')
      .where('orgId', '==', parent.organizationId)
      .where('userId', '==', authUser.uid)
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
