import { GraphQLError } from 'graphql';
import { Timestamp } from 'firebase-admin/firestore';

import { MutationResolvers, OrganizationMemberRole } from '../../../types';
import {
  notFoundError,
  forbiddenError,
  unauthorizedError,
  adaptOrganization,
  badUserInputError,
  internalServerError,
} from '../../../../utils';

export const updateOrganization: MutationResolvers['updateOrganization'] = async (
  _,
  args,
  context,
) => {
  const { authUser, db } = context;
  const { organizationId, description, logo, website, isPublic } = args.input;

  if (!authUser) throw unauthorizedError();

  try {
    const orgRef = db.collection('organizations').doc(organizationId);
    const orgSnap = await orgRef.get();

    if (!orgSnap.exists) throw notFoundError('Organization not found.');

    const memberRef = orgRef.collection('organizationMembers').doc(authUser.uid);
    const memberSnap = await memberRef.get();

    if (!memberSnap.exists) throw forbiddenError('You are not a member of this organization.');

    const viewerRole = memberSnap.data()?.role as OrganizationMemberRole;
    const isOwner = viewerRole === OrganizationMemberRole.Owner;
    const isAdmin = viewerRole === OrganizationMemberRole.Admin;

    if (!isOwner && !isAdmin)
      throw forbiddenError('You are not authorized to update this organization.');

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
        throw badUserInputError('Invalid website URL.');
      }
    }

    if (typeof logo === 'string') {
      if (!isOwner)
        throw forbiddenError('Only the owner of the organization can update the logo.');

      if (!logo.startsWith('https')) throw badUserInputError('Invalid logo URL.');

      updates.logo = logo;
    }

    if (typeof isPublic === 'boolean') {
      if (!isOwner) {
        throw forbiddenError(
          'Only the owner of the organization can update the public status.',
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

    throw internalServerError();
  }
};
