import { GraphQLError } from 'graphql';

import { QueryResolvers } from '../../../types';
import { adaptOrganization, internalServerError, unauthorizedError } from '../../../../utils';

export const searchOrganizations: QueryResolvers['searchOrganizations'] = async (
  _parent,
  args,
  context,
) => {
  if (!context.authUser) throw unauthorizedError();

  try {
    if (!args.query.trim()) return [];

    const normalized = args.query.trim();

    const snapshot = await context.db
      .collection('organizations')
      .where('isPublic', '==', true)
      .where('name', '>=', normalized)
      .where('name', '<=', normalized + '\uf8ff')
      .limit(args.limit)
      .get();

    if (snapshot.empty) return [];

    const orgDocs = snapshot.docs;

    if (!args.excludeMyOrganizations) {
      return orgDocs.filter((d) => d.exists).map((doc) => adaptOrganization(doc));
    }

    const filtered = [];

    for (const doc of orgDocs) {
      const memberSnap = await context.db
        .collection('organizations')
        .doc(doc.id)
        .collection('organizationMembers')
        .doc(context.authUser.uid)
        .get();

      if (!memberSnap.exists) {
        filtered.push(adaptOrganization(doc));
      }
    }

    return filtered;
  } catch (error) {
    console.error(error);

    if (error instanceof GraphQLError) {
      throw error;
    }

    throw internalServerError();
  }
};
