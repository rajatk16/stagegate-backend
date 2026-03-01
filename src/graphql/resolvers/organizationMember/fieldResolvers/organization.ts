import { OrganizationMemberResolvers } from '../../../types';
import { adaptOrganization, notFoundError } from '../../../../utils';

export const organization: OrganizationMemberResolvers['organization'] = async (
  parent,
  _args,
  context,
) => {
  const snap = await context.db.collection('organizations').doc(parent.orgId).get();

  if (!snap.exists) throw notFoundError('Organization not found.');

  const data = snap.data();

  if (!data) throw notFoundError('Organization not found.');

  return adaptOrganization(snap);
};
