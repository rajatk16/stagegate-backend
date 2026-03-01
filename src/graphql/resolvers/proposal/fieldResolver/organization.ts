import { GraphQLError } from 'graphql';

import { ProposalResolvers } from '../../../types';
import { adaptOrganization, internalServerError, notFoundError } from '../../../../utils';

export const organization: ProposalResolvers['organization'] = async (
  parent,
  _args,
  { db },
) => {
  try {
    const snap = await db.collection('organizations').doc(parent.organizationId).get();

    if (!snap.exists) throw notFoundError('Organization not found.');

    return adaptOrganization(snap);
  } catch (error) {
    console.error(error);

    if (error instanceof GraphQLError) {
      throw error;
    }

    throw internalServerError();
  }
};
