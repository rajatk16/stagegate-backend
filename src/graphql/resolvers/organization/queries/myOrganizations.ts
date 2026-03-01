import { GraphQLError } from 'graphql';

import { QueryResolvers } from '../../../types';
import { adaptOrganization, internalServerError, unauthorizedError } from '../../../../utils';

export const myOrganizations: QueryResolvers['myOrganizations'] = async (
  _parent,
  _args,
  context,
) => {
  if (!context.authUser) throw unauthorizedError();

  try {
    const userId = context.authUser.uid;

    const membershipSnapshot = await context.db
      .collectionGroup('organizationMembers')
      .where('userId', '==', userId)
      .orderBy('joinedAt', 'desc')
      .get();

    if (membershipSnapshot.empty) return [];

    const orgIds = membershipSnapshot.docs
      .map((doc) => doc.ref.parent.parent?.id)
      .filter(Boolean);

    const organizationFetches = orgIds.map((orgId) =>
      context.db.collection('organizations').doc(orgId!).get(),
    );

    const orgDocs = await Promise.all(organizationFetches);

    return orgDocs.filter((d) => d.exists).map((doc) => adaptOrganization(doc));
  } catch (error) {
    console.error(error);

    if (error instanceof GraphQLError) {
      throw error;
    }

    throw internalServerError();
  }
};
