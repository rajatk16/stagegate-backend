import { Timestamp } from 'firebase-admin/firestore';
import { GraphQLError } from 'graphql';

import { adaptOrganization } from '../../../../utils';
import { MutationResolvers, OrganizationMemberRole } from '../../../types';

export const updateOrganization: MutationResolvers['updateOrganization'] = async (
  _,
  args,
  context,
) => {
  const { organizationId, description, logo, website, isPublic } = args.input;
  const { authUser, db } = context;

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
      throw new GraphQLError('Organization not found.', {
        extensions: {
          code: 'NOT_FOUND',
          http: {
            status: 404,
          },
        },
      });
    }

    const memberRef = orgRef.collection('organizationMembers').doc(authUser.uid);
    const memberSnap = await memberRef.get();

    if (!memberSnap.exists) {
      throw new GraphQLError('You are not a member of this organization', {
        extensions: {
          code: 'FORBIDDEN',
          http: {
            status: 403,
          },
        },
      });
    }

    const viewerRole = memberSnap.data()?.role as OrganizationMemberRole;
    const isOwner = viewerRole === OrganizationMemberRole.Owner;
    const isAdmin = viewerRole === OrganizationMemberRole.Admin;

    if (!isOwner && !isAdmin) {
      throw new GraphQLError('You are not authorized to update this organization', {
        extensions: {
          code: 'FORBIDDEN',
          http: {
            status: 403,
          },
        },
      });
    }

    const updates: Record<string, any> = {
      updatedAt: Timestamp.now(),
    };

    if (typeof description === 'string') {
      updates.description = description.trim() || null;
    }

    if (typeof website === 'string') {
      try {
        new URL(website.startsWith('http') ? website : `https://${website}`);
        updates.website = website.trim() || null;
      } catch (error) {
        console.log(error);
        throw new GraphQLError('Invalid website URL', {
          extensions: {
            code: 'BAD_USER_INPUT',
            http: {
              status: 400,
            },
          },
        });
      }
    }

    if (typeof logo === 'string') {
      if (!isOwner) {
        throw new GraphQLError('Only the owner of the organization can update the logo', {
          extensions: {
            code: 'FORBIDDEN',
            http: {
              status: 403,
            },
          },
        });
      }

      if (!logo.startsWith('https')) {
        throw new GraphQLError('Invalid logo URL', {
          extensions: {
            code: 'BAD_USER_INPUT',
            http: {
              status: 400,
            },
          },
        });
      }
      updates.logo = logo;
    }

    if (typeof isPublic === 'boolean') {
      if (!isOwner) {
        throw new GraphQLError(
          'Only the owner of the organization can update the public status',
          {
            extensions: {
              code: 'FORBIDDEN',
              http: {
                status: 403,
              },
            },
          },
        );
      }
      updates.isPublic = isPublic;
    }

    await orgRef.update(updates);

    const updatedOrg = await orgRef.get();
    return adaptOrganization(updatedOrg);
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
