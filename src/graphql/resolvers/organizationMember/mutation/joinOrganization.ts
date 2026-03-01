import { GraphQLError } from 'graphql';
import { Timestamp } from 'firebase-admin/firestore';

import { MutationResolvers, OrganizationMemberRole } from '../../../types';
import {
  notFoundError,
  forbiddenError,
  badUserInputError,
  unauthorizedError,
  internalServerError,
} from '../../../../utils';

export const joinOrganization: MutationResolvers['joinOrganization'] = async (
  _parent,
  args,
  context,
) => {
  const { organizationId } = args.input;
  const { authUser, db } = context;

  if (!authUser) throw unauthorizedError();

  try {
    const { uid } = authUser;

    const orgRef = db.collection('organizations').doc(organizationId);
    const orgSnap = await orgRef.get();

    if (!orgSnap.exists) throw notFoundError('Organization not found.');

    const orgData = orgSnap.data();

    if (!orgData?.isPublic) throw forbiddenError('Organization is not public.');

    const memberRef = orgRef.collection('organizationMembers').doc(uid);
    const memberSnap = await memberRef.get();

    if (memberSnap.exists)
      throw badUserInputError('You are already a member of this organization.');

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

    if (error instanceof GraphQLError) {
      throw error;
    }

    throw internalServerError();
  }
};
