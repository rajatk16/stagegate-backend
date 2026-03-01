import { GraphQLError } from 'graphql';

import { QueryResolvers } from '../../../types';
import {
  adaptOrganization,
  forbiddenError,
  internalServerError,
  notFoundError,
  unauthorizedError,
} from '../../../../utils';

export const organizationBySlug: QueryResolvers['organizationBySlug'] = async (
  _parent,
  args,
  context,
) => {
  const { authUser, db } = context;
  const { slug } = args;

  if (!authUser) throw unauthorizedError();

  try {
    const snapshot = await db
      .collection('organizations')
      .where('slug', '==', slug)
      .limit(1)
      .get();

    if (snapshot.empty) throw notFoundError('Organization not found.');

    const doc = snapshot.docs[0];

    // Check if the user is a member of the organization
    const membershipDoc = await db
      .collection('organizations')
      .doc(doc.id)
      .collection('organizationMembers')
      .doc(authUser.uid)
      .get();

    if (!membershipDoc.exists)
      throw forbiddenError('You are not a member of this organization.');

    return adaptOrganization(doc);
  } catch (error) {
    console.error(error);

    if (error instanceof GraphQLError) {
      throw error;
    }

    throw internalServerError();
  }
};
