import { OrganizationResolvers } from '../../../types';
import { decodeCursor, DEFAULT_PAGINATION_LIMIT, encodeCursor } from '../../../../utils';

export const members: OrganizationResolvers['members'] = async (
  parent,
  { pagination },
  context,
) => {
  const organizationMembersRef = context.db
    .collection('organizations')
    .doc(parent.id)
    .collection('organizationMembers');

  const totalSnapshot = await organizationMembersRef.count().get();
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

  const snapshot = await organizationMembersRef
    .orderBy('joinedAt', 'desc')
    .offset(offset)
    .limit(limit)
    .get();

  const results = snapshot.docs.map((doc) => {
    const data = doc.data();

    return {
      userId: data.userId,
      role: data.role,
      orgId: data.orgId,
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
