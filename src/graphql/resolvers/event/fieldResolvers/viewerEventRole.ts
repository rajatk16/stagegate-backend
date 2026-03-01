import { internalServerError } from '../../../../utils';
import { EventMemberRole, EventResolvers } from '../../../types';

export const viewerEventRole: EventResolvers['viewerEventRole'] = async (
  parent,
  _args,
  { authUser, db },
) => {
  try {
    if (!authUser) {
      return null;
    }

    const memberSnapshot = await db
      .collectionGroup('eventMembers')
      .where('eventId', '==', parent.id)
      .where('userId', '==', authUser.uid)
      .limit(1)
      .get();

    if (memberSnapshot.empty) {
      return null;
    }

    const member = memberSnapshot.docs[0].data();

    return member.role as EventMemberRole;
  } catch (error) {
    console.error(error);
    throw internalServerError('Internal server error');
  }
};
