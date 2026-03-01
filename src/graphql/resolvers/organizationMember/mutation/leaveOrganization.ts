import { GraphQLError } from 'graphql';

import { MutationResolvers, OrganizationMemberRole } from '../../../types';
import {
  notFoundError,
  forbiddenError,
  badUserInputError,
  unauthorizedError,
  internalServerError,
} from '../../../../utils';

export const leaveOrganization: MutationResolvers['leaveOrganization'] = async (
  _parent,
  { input },
  { authUser, db },
) => {
  const { organizationId } = input;

  if (!authUser) throw unauthorizedError();

  try {
    const orgRef = db.collection('organizations').doc(organizationId);
    const orgSnap = await orgRef.get();

    if (!orgSnap.exists) throw notFoundError('Organization not found.');

    const memberSnap = await orgRef
      .collection('organizationMembers')
      .where('userId', '==', authUser.uid)
      .limit(1)
      .get();

    if (memberSnap.empty) throw forbiddenError('You are not a member of this organization.');

    const memberDoc = memberSnap.docs[0];
    const memberData = memberDoc.data();

    if (memberData?.role === OrganizationMemberRole.Owner)
      throw forbiddenError('Organization owner cannot leave the organization.');

    const membersCountSnap = await orgRef.collection('organizationMembers').count().get();

    if (membersCountSnap.data().count === 1)
      throw badUserInputError('Organization must have atleast one member.');

    await memberDoc.ref.delete();

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
