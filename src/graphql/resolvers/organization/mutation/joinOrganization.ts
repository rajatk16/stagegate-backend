import { GraphQLError } from 'graphql';
import { Timestamp } from 'firebase-admin/firestore';

import { MutationResolvers, OrganizationMemberRole } from '../../../types';

export const joinOrganization: MutationResolvers['joinOrganization'] = async (
  _parent,
  args,
  context,
) => {
  const { organizationId } = args.input;
  const { authUser, db } = context;
  try {
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

    const { uid } = authUser;

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

    const orgData = orgSnap.data();

    if (!orgData?.isPublic) {
      throw new GraphQLError('Organization is not public', {
        extensions: {
          code: 'FORBIDDEN',
          http: {
            status: 403,
          },
        },
      });
    }

    const memberRef = orgRef.collection('members').doc(uid);
    const memberSnap = await memberRef.get();

    if (memberSnap.exists) {
      throw new GraphQLError('You are already a member of this organization', {
        extensions: {
          code: 'BAD_USER_INPUT',
          http: {
            status: 400,
          },
        },
      });
    }
    const now = Timestamp.now();

    await memberRef.set({
      joinedAt: now,
      orgId: organizationId,
      userId: uid,
      role: OrganizationMemberRole.Member.toString(),
    });

    return {
      role: OrganizationMemberRole.Member.toString(),
      userId: uid,
      orgId: organizationId,
      joinedAt: now,
    };
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
