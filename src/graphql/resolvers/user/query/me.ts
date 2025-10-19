import { GraphQLError } from 'graphql';

import { adaptUser } from '../../../../utils';
import { QueryResolvers } from '../../../types';

export const me: QueryResolvers['me'] = async (_parent, _args, context) => {
  if (!context.authUser) return null;

  const doc = await context.db.collection('users').doc(context.authUser.uid).get();

  if (!doc.exists) throw new GraphQLError('User profile not found');

  const data = doc.data();

  return adaptUser(data ?? {});
};
