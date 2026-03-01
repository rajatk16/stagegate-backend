import { internalServerError } from '../../../../utils';
import { EventResolvers, OrganizationMemberRole } from '../../../types';

export const viewerOrgRole: EventResolvers['viewerOrgRole'] = async (
  parent,
  _args,
  { authUser, db },
) => {
  try {
    if (!authUser) {
      return null;
    }

    const memberSnapshot = await db
      .collectionGroup('organizationMembers')
      .where('orgId', '==', parent.organizationId)
      .where('userId', '==', authUser.uid)
      .limit(1)
      .get();

    if (memberSnapshot.empty) {
      return null;
    }

    const member = memberSnapshot.docs[0].data();

    return member.role as OrganizationMemberRole;
  } catch (error) {
    console.error(error);

    throw internalServerError('Internal server error');
  }
};
