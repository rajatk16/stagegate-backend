import { EventResolvers } from '../../../types';
import { decodeCursor, DEFAULT_PAGINATION_LIMIT, encodeCursor } from '../../../../utils';

export const members: EventResolvers['members'] = async (parent, { pagination }, { db }) => {
  const eventMembersRef = db
    .collection('organizations')
    .doc(parent.organizationId)
    .collection('events')
    .doc(parent.id)
    .collection('eventMembers');

  const totalSnapshot = await eventMembersRef.count().get();
  const total = totalSnapshot.data().count;

  let offset = 0;
  let limit = DEFAULT_PAGINATION_LIMIT;

  if (pagination?.cursor) {
    const decoded = decodeCursor(pagination.cursor);
    limit = decoded.limit;
    offset = decoded.offset;
  } else if (pagination?.limit) {
    limit = pagination.limit;
  }
  const snapshot = await eventMembersRef
    .orderBy('joinedAt', 'desc')
    .offset(offset)
    .limit(limit)
    .get();

  const results = snapshot.docs.map((doc) => {
    const data = doc.data();

    return {
      role: data.role,
      orgId: data.orgId,
      userId: data.userId,
      eventId: data.eventId,
      joinedAt: data.joinedAt,
    };
  });

  const nextOffset = offset + results.length;
  const nextCursor = nextOffset < total ? encodeCursor(limit, nextOffset) : null;

  return {
    pagination: {
      cursor: nextCursor,
      total,
    },
    results,
  };
};
