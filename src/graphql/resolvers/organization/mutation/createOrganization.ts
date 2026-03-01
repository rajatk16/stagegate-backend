import { GraphQLError } from 'graphql';
import { Timestamp } from 'firebase-admin/firestore';

import { OrganizationModel } from '../../../models';
import { MutationResolvers, OrganizationMemberRole } from '../../../types';
import {
  badUserInputError,
  unauthorizedError,
  generateUniqueSlug,
  internalServerError,
} from '../../../../utils';

export const createOrganization: MutationResolvers['createOrganization'] = async (
  _,
  args,
  context,
) => {
  if (!context.authUser) throw unauthorizedError();

  try {
    const existingOrganizationSnap = await context.db
      .collection('organizations')
      .where('ownerId', '==', context.authUser.uid)
      .limit(1)
      .get();

    if (!existingOrganizationSnap.empty)
      throw badUserInputError(
        'You already own an organization. Only one organization ownership per user is allowed.',
      );

    const nameCheckSnap = await context.db
      .collection('organizations')
      .where('name', '==', args.input.name.trim())
      .limit(1)
      .get();

    if (!nameCheckSnap.empty)
      throw badUserInputError('An organization with this name already exists.');

    const slug = generateUniqueSlug(args.input.name.trim());

    const slugCheckSnap = await context.db
      .collection('organizations')
      .where('slug', '==', slug)
      .limit(1)
      .get();

    if (!slugCheckSnap.empty)
      throw badUserInputError('An organization with this slug already exists.');

    const orgRef = context.db.collection('organizations').doc();
    const orgId = orgRef.id;

    const now = Timestamp.now();

    const organizationData: OrganizationModel = {
      id: orgId,
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

    await orgRef.collection('organizationMembers').doc(context.authUser.uid).set({
      joinedAt: now,
      orgId,
      userId: context.authUser.uid,
      role: OrganizationMemberRole.Owner.toString(),
    });

    return organizationData;
  } catch (error) {
    console.log(error);
    if (error instanceof GraphQLError) {
      throw error;
    }

    throw internalServerError();
  }
};
