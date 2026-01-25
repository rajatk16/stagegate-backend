import { GraphQLError } from 'graphql';

import { MutationResolvers, OrganizationMemberRole } from '../../../types';

export const changeOrgMemberRole: MutationResolvers['changeOrgMemberRole'] = async (
  _parent,
  { input },
  { authUser, db },
) => {
  const { organizationId, userId, role: newRole } = input;

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
    throw new GraphQLError('You cannot change your own role', {
      extensions: {
        code: 'BAD_USER_INPUT',
        http: {
          status: 400,
        },
      },
    });
  }

  try {
    const orgRef = db.collection('organizations').doc(organizationId);
    const orgSnap = await orgRef.get();

    if (!orgSnap.exists) {
      throw new GraphQLError('Organization not found', {
        extensions: {
          code: 'NOT_FOUND',
          http: {
            status: 404,
          },
        },
      });
    }

    const requesterRef = orgRef.collection('organizationMembers').doc(authUser.uid);
    const targetRef = orgRef.collection('organizationMembers').doc(userId);

    const [requesterSnap, targetSnap] = await Promise.all([
      requesterRef.get(),
      targetRef.get(),
    ]);

    if (!requesterSnap.exists) {
      throw new GraphQLError('You are not a member of this organization', {
        extensions: {
          code: 'FORBIDDEN',
          http: {
            status: 403,
          },
        },
      });
    }

    if (!targetSnap.exists) {
      throw new GraphQLError('User is not a member of this organization', {
        extensions: {
          code: 'NOT_FOUND',
          http: {
            status: 404,
          },
        },
      });
    }

    const requesterRole = requesterSnap.data()?.role as OrganizationMemberRole;
    const targetRole = targetSnap.data()?.role as OrganizationMemberRole;

    if (
      requesterRole !== OrganizationMemberRole.Owner &&
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

    if (targetRole === newRole) {
      throw new GraphQLError(`The user already has the role ${newRole}`, {
        extensions: {
          code: 'BAD_USER_INPUT',
          http: {
            status: 400,
          },
        },
      });
    }

    if (newRole === OrganizationMemberRole.Owner) {
      throw new GraphQLError('OWNER role cannot be assigned to another user', {
        extensions: {
          code: 'BAD_USER_INPUT',
          http: {
            status: 400,
          },
        },
      });
    }

    if (
      requesterRole === OrganizationMemberRole.Admin &&
      targetRole === OrganizationMemberRole.Owner
    ) {
      throw new GraphQLError('Admin users cannot change the role of an owner', {
        extensions: {
          code: 'FORBIDDEN',
          http: {
            status: 403,
          },
        },
      });
    }

    if (
      requesterRole === OrganizationMemberRole.Admin &&
      targetRole === OrganizationMemberRole.Admin
    ) {
      throw new GraphQLError('Admin users cannot change the role of another admin', {
        extensions: {
          code: 'FORBIDDEN',
          http: {
            status: 403,
          },
        },
      });
    }

    await targetRef.update({
      role: newRole,
    });

    return {
      userId,
      role: newRole,
      orgId: organizationId,
      joinedAt: targetSnap.data()?.joinedAt,
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
