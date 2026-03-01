import { OrganizationResolvers } from '../../../types';
import { adaptUser, notFoundError } from '../../../../utils';

export const owner: OrganizationResolvers['owner'] = async (parent, _args, context) => {
  const snap = await context.db.collection('users').doc(parent.ownerId).get();

  if (!snap.exists) throw notFoundError('User not found.');

  return adaptUser(snap);
};
