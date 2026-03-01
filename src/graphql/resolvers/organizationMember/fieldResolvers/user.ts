import { adaptUser, notFoundError } from '../../../../utils';
import { OrganizationMemberResolvers } from '../../../types';

export const user: OrganizationMemberResolvers['user'] = async (parent, _args, context) => {
  const snap = await context.db.collection('users').doc(parent.userId).get();

  if (!snap.exists) throw notFoundError('User not found.');

  return adaptUser(snap);
};
