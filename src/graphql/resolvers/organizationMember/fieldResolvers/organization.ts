import { GraphQLError } from 'graphql';
import { OrganizationMemberResolvers } from '../../../types';

export const organization: OrganizationMemberResolvers['organization'] = async (
  parent,
  _args,
  context,
) => {
  const snap = await context.db.collection('organizations').doc(parent.orgId).get();

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

  const data = snap.data();

  if (!data) {
    throw new GraphQLError('Organization not found', {
      extensions: {
        code: 'NOT_FOUND',
        http: {
          status: 404,
        },
      },
    });
  }

  return {
    id: snap.id,
    name: data.name,
    slug: data.slug,
    logo: data.logo,
    website: data.website,
    ownerId: data.ownerId,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    description: data.description,
  };
};
