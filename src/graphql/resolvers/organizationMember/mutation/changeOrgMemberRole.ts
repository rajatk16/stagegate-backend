import { GraphQLError } from 'graphql';

import { MutationResolvers, OrganizationMemberRole } from '../../../types';
import {
  notFoundError,
  forbiddenError,
  badUserInputError,
  unauthorizedError,
  internalServerError,
} from '../../../../utils';

export const changeOrgMemberRole: MutationResolvers['changeOrgMemberRole'] = async (
  _parent,
  { input },
  { authUser, db },
) => {
  const { organizationId, userId, role: newRole } = input;

  if (!authUser) throw unauthorizedError();

  if (authUser.uid === userId) throw badUserInputError('You cannot change your own role.');

  try {
    const orgRef = db.collection('organizations').doc(organizationId);
    const orgSnap = await orgRef.get();

    if (!orgSnap.exists) throw notFoundError('Organization not found.');

    const requesterRef = orgRef.collection('organizationMembers').doc(authUser.uid);
    const targetRef = orgRef.collection('organizationMembers').doc(userId);

    const [requesterSnap, targetSnap] = await Promise.all([
      requesterRef.get(),
      targetRef.get(),
    ]);

    if (!requesterSnap.exists)
      throw forbiddenError('You are not a member of this organization.');

    if (!targetSnap.exists) throw notFoundError('User is not a member of this organization.');

    const requesterRole = requesterSnap.data()?.role as OrganizationMemberRole;
    const targetRole = targetSnap.data()?.role as OrganizationMemberRole;

    if (
      requesterRole !== OrganizationMemberRole.Owner &&
      targetRole !== OrganizationMemberRole.Admin
    )
      throw forbiddenError('Insufficient permissions.');

    if (targetRole === newRole)
      throw badUserInputError(`The user already has the role ${newRole}.`);

    if (newRole === OrganizationMemberRole.Owner)
      throw badUserInputError('OWNER role cannot be assigned to another user.');

    if (
      requesterRole === OrganizationMemberRole.Admin &&
      targetRole === OrganizationMemberRole.Owner
    )
      throw forbiddenError('Admin users cannot change the role of an owner.');

    if (
      requesterRole === OrganizationMemberRole.Admin &&
      targetRole === OrganizationMemberRole.Admin
    )
      throw forbiddenError('Admin users cannot change the role of another admin.');

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

    throw internalServerError();
  }
};
