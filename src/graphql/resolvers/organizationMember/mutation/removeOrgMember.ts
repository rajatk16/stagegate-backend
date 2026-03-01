import { GraphQLError } from 'graphql';

import { MutationResolvers, OrganizationMemberRole } from '../../../types';
import {
  notFoundError,
  forbiddenError,
  unauthorizedError,
  internalServerError,
} from '../../../../utils';

export const removeOrgMember: MutationResolvers['removeOrgMember'] = async (
  _parent,
  { input },
  { authUser, db },
) => {
  const { organizationId, userId } = input;

  if (!authUser) throw unauthorizedError();

  if (authUser.uid === userId)
    throw forbiddenError('You cannot remove yourself from the organization');

  try {
    const orgRef = db.collection('organizations').doc(organizationId);
    const orgSnap = await orgRef.get();

    if (!orgSnap.exists) throw notFoundError('Organization not found.');

    const membersRef = orgRef.collection('organizationMembers');

    const [callerSnap, targetSnap] = await Promise.all([
      membersRef.where('userId', '==', authUser.uid).limit(1).get(),
      membersRef.where('userId', '==', userId).limit(1).get(),
    ]);

    if (callerSnap.empty) throw forbiddenError('You are not a member of this organization');

    if (targetSnap.empty) throw notFoundError('User is not a member of this organization');

    const callerRole = callerSnap.docs[0].data()?.role as OrganizationMemberRole;
    const targetRole = targetSnap.docs[0].data()?.role as OrganizationMemberRole;

    if (
      callerRole !== OrganizationMemberRole.Owner &&
      targetRole !== OrganizationMemberRole.Admin
    )
      throw forbiddenError('Insufficient permissions');

    if (
      callerRole === OrganizationMemberRole.Admin &&
      targetRole === OrganizationMemberRole.Owner
    )
      throw forbiddenError('Admin users cannot remove the owner of the organization.');

    if (
      callerRole === OrganizationMemberRole.Admin &&
      targetRole === OrganizationMemberRole.Admin
    )
      throw forbiddenError('Admin users cannot remove another admin from the organization.');

    if (targetRole === OrganizationMemberRole.Owner)
      throw forbiddenError('Owner cannot be removed from the organization');

    await targetSnap.docs[0].ref.delete();

    return {
      success: true,
    };
  } catch (error) {
    console.log(error);

    if (error instanceof GraphQLError) {
      throw error;
    }

    throw internalServerError();
  }
};
