import { GraphQLError } from 'graphql';

import { ProposalResolvers } from '../../../types';
import { adaptEvent, internalServerError, notFoundError } from '../../../../utils';

export const event: ProposalResolvers['event'] = async (parent, _args, { db }) => {
  try {
    const snap = await db
      .collection('organizations')
      .doc(parent.organizationId)
      .collection('events')
      .doc(parent.eventId)
      .get();

    if (!snap.exists) throw notFoundError('Event not found.');

    return adaptEvent(snap);
  } catch (error) {
    console.error(error);

    if (error instanceof GraphQLError) {
      throw error;
    }

    throw internalServerError();
  }
};
