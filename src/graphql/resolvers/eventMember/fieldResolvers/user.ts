import { GraphQLError } from 'graphql';

import { EventMemberResolvers } from '../../../types';
import { adaptUser, internalServerError, notFoundError } from '../../../../utils';

export const user: EventMemberResolvers['user'] = async (parent, _args, context) => {
  try {
    const snap = await context.db.collection('users').doc(parent.userId).get();

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
