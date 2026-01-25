import { GraphQLError } from 'graphql';
import { MutationResolvers, OrganizationMemberRole } from '../../../types';

export const leaveOrganization: MutationResolvers['leaveOrganization'] = async (
  _parent,
  { input },
  { authUser, db },
) => {
  const { organizationId } = input;

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

    const memberSnap = await orgRef
      .collection('organizationMembers')
      .where('userId', '==', authUser.uid)
      .limit(1)
      .get();

    if (memberSnap.empty) {
      throw new GraphQLError('You are not a member of this organization', {
        extensions: {
          code: 'FORBIDDEN',
          http: {
            status: 403,
          },
        },
      });
    }

    const memberDoc = memberSnap.docs[0];
    const memberData = memberDoc.data();

    if (memberData?.role === OrganizationMemberRole.Owner) {
      throw new GraphQLError('Organization owner cannot leave the organization', {
        extensions: {
          code: 'FORBIDDEN',
          http: {
            status: 403,
          },
        },
      });
    }

    const membersCountSnap = await orgRef.collection('organizationMembers').count().get();

    if (membersCountSnap.data().count === 1) {
      throw new GraphQLError('Organization must have atleast one member', {
        extensions: {
          code: 'BAD_USER_INPUT',
          http: {
            status: 400,
          },
        },
      });
    }

    await memberDoc.ref.delete();

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
