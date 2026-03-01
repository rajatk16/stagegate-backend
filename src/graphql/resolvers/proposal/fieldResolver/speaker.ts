import { adaptUser, internalServerError, notFoundError } from '../../../../utils';
import { ProposalResolvers } from '../../../types';
import { GraphQLError } from 'graphql';

export const speaker: ProposalResolvers['speaker'] = async (parent, _args, { db }) => {
  try {
    const snap = await db.collection('users').doc(parent.speakerId).get();

    if (!snap.exists) throw notFoundError('User not found.');

    return adaptUser(snap);
  } catch (error) {
    console.error(error);

    if (error instanceof GraphQLError) {
      throw error;
    }

    throw internalServerError();
  }
};
