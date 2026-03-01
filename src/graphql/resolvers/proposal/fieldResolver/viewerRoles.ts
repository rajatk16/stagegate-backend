import { internalServerError } from '../../../../utils';
import { EventMemberModel, OrganizationMemberModel } from '../../../models';
import {
  EventMemberRole,
  ProposalResolvers,
  ProposalViewerRole,
  OrganizationMemberRole,
} from '../../../types';

export const viewerRoles: ProposalResolvers['viewerRoles'] = async (parent, _args, context) => {
  try {
    const { authUser, db } = context;

    if (!authUser) {
      return [];
    }

    const roles: ProposalViewerRole[] = [];
    const uid = authUser.uid;

    const { organizationId, eventId, speakerId } = parent;

    if (speakerId === uid) {
      roles.push(ProposalViewerRole.Speaker);
    }

    const orgRef = db.collection('organizations').doc(organizationId);

    const orgMemberSnap = await orgRef.collection('organizationMembers').doc(uid).get();

    if (orgMemberSnap.exists) {
      const orgRole = (orgMemberSnap.data() as OrganizationMemberModel)
        .role as OrganizationMemberRole;

      if (
        orgRole === OrganizationMemberRole.Owner ||
        orgRole === OrganizationMemberRole.Admin
      ) {
        roles.push(ProposalViewerRole.Organizer);
      }
    }

    const eventMemberSnap = await orgRef
      .collection('events')
      .doc(eventId)
      .collection('eventMembers')
      .doc(uid)
      .get();

    if (eventMemberSnap.exists) {
      const eventRole = (eventMemberSnap.data() as EventMemberModel).role as EventMemberRole;

      if (eventRole === EventMemberRole.Organizer) roles.push(ProposalViewerRole.Organizer);

      if (eventRole === EventMemberRole.Reviewer) roles.push(ProposalViewerRole.Reviewer);
    }

    return roles;
  } catch (error) {
    console.error(error);

    throw internalServerError();
  }
};
