import { GraphQLError } from 'graphql';
import { Timestamp } from 'firebase-admin/firestore';

import { generateUniqueSlug } from '../../../../utils';
import { MutationResolvers, OrganizationMemberRole } from '../../../types';

export const createOrganization: MutationResolvers['createOrganization'] = async (
  _,
  args,
  context,
) => {
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

  const existingOrganizationSnap = await context.db
    .collection('organizations')
    .where('ownerId', '==', context.authUser.uid)
    .limit(1)
    .get();

  if (!existingOrganizationSnap.empty) {
    throw new GraphQLError(
      'You already own an organization. Only one organization ownership per user is allowed.',
      {
        extensions: {
          code: 'BAD_USER_INPUT',
          http: {
            status: 400,
          },
        },
      },
    );
  }

  const nameCheckSnap = await context.db
    .collection('organizations')
    .where('name', '==', args.input.name.trim())
    .limit(1)
    .get();

  if (!nameCheckSnap.empty) {
    throw new GraphQLError('An organization with this name already exists.', {
      extensions: {
        code: 'BAD_USER_INPUT',
        http: {
          status: 400,
        },
      },
    });
  }

  const slug = generateUniqueSlug(args.input.name.trim());

  const orgRef = context.db.collection('organizations').doc();
  const orgId = orgRef.id;

  const now = Timestamp.now();

  const organizationData = {
    name: args.input.name.trim(),
    description: args.input.description ?? null,
    website: args.input.website ?? null,
    logo: args.input.logo ?? null,
    slug,
    ownerId: context.authUser.uid,
    createdAt: now,
    updatedAt: now,
    isPublic: args.input.isPublic ?? false,
  };

  await orgRef.set(organizationData);

  await orgRef.collection('members').doc(context.authUser.uid).set({
    joinedAt: now,
    orgId,
    userId: context.authUser.uid,
    role: OrganizationMemberRole.Owner.toString(),
  });

  return {
    id: orgId,
    ...organizationData,
  };
};
