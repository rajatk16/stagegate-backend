import { Timestamp } from 'firebase-admin/firestore';
import { EventResolvers } from '../../../types';

export const members: EventResolvers['members'] = async (parent, args, { db }) => {
  const { first, after } = args;

  let query = db
    .collection('events')
    .doc(parent.id)
    .collection('members')
    .orderBy('joinedAt', 'desc')
    .limit(first);

  if (after) {
    const afterDate = new Date(after);
    const afterTimestamp = Timestamp.fromDate(afterDate);
    query = query.startAfter(afterTimestamp);
  }

  const snapshot = await query.get();

  const results = snapshot.docs.map((doc) => {
    const data = doc.data();

    return {
      userId: data.userId,
      role: data.role,
      eventId: data.eventId,
      joinedAt: data.joinedAt,
      orgId: data.orgId,
    };
  });

  const lastDoc = snapshot.docs[snapshot.docs.length - 1];
  const nextCursor = lastDoc ? lastDoc.data().joinedAt.toDate().toISOString() : null;

  return {
    pagination: {
      cursor: nextCursor,
      pageSize: results.length,
    },
    results,
  };
};
