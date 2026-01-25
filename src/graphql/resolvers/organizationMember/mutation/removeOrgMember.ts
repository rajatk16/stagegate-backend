import { GraphQLError } from 'graphql';

import { MutationResolvers, OrganizationMemberRole } from '../../../types';

export const removeOrgMember: MutationResolvers['removeOrgMember'] = async (
  _parent,
  { input },
  { authUser, db },
) => {
  const { organizationId, userId } = input;

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

  if (authUser.uid === userId) {
    throw new GraphQLError('You cannot remove yourself from the organization', {
      extensions: {
        code: 'FORBIDDEN',
        http: {
          status: 403,
        },
      },
    });
  }

  try {
    const orgRef = db.collection('organizations').doc(organizationId);
    const orgSnap = await orgRef.get();

    if (!orgSnap.exists) {
      throw new GraphQLError('Organization not found.', {
        extensions: {
          code: 'NOT_FOUND',
          http: {
            status: 404,
          },
        },
      });
    }

    const membersRef = orgRef.collection('organizationMembers');

    const [callerSnap, targetSnap] = await Promise.all([
      membersRef.where('userId', '==', authUser.uid).limit(1).get(),
      membersRef.where('userId', '==', userId).limit(1).get(),
    ]);

    if (callerSnap.empty) {
      throw new GraphQLError('You are not a member of this organization', {
        extensions: {
          code: 'FORBIDDEN',
          http: {
            status: 403,
          },
        },
      });
    }

    if (targetSnap.empty) {
      throw new GraphQLError('User is not a member of this organization', {
        extensions: {
          code: 'NOT_FOUND',
          http: {
            status: 404,
          },
        },
      });
    }

    const callerRole = callerSnap.docs[0].data()?.role as OrganizationMemberRole;
    const targetRole = targetSnap.docs[0].data()?.role as OrganizationMemberRole;

    if (
      callerRole !== OrganizationMemberRole.Owner &&
      targetRole !== OrganizationMemberRole.Admin
    ) {
      throw new GraphQLError('Insufficient permissions', {
        extensions: {
          code: 'FORBIDDEN',
          http: {
            status: 403,
          },
        },
      });
    }

    if (
      callerRole === OrganizationMemberRole.Admin &&
      targetRole === OrganizationMemberRole.Owner
    ) {
      throw new GraphQLError('Admin users cannot remove the owner of the organization', {
        extensions: {
          code: 'FORBIDDEN',
          http: {
            status: 403,
          },
        },
      });
    }

    if (
      callerRole === OrganizationMemberRole.Admin &&
      targetRole === OrganizationMemberRole.Admin
    ) {
      throw new GraphQLError('Admin users cannot remove another admin from the organization', {
        extensions: {
          code: 'FORBIDDEN',
          http: {
            status: 403,
          },
        },
      });
    }

    if (targetRole === OrganizationMemberRole.Owner) {
      throw new GraphQLError('Owner cannot be removed from the organization', {
        extensions: {
          code: 'FORBIDDEN',
          http: {
            status: 403,
          },
        },
      });
    }

    await targetSnap.docs[0].ref.delete();

    return {
      success: true,
    };
  } catch (error) {
    console.log(error);

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
