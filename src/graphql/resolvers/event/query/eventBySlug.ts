import { GraphQLError } from 'graphql';

import { QueryResolvers } from '../../../types';
import {
  adaptEvent,
  notFoundError,
  forbiddenError,
  adaptOrganization,
  unauthorizedError,
  internalServerError,
} from '../../../../utils';

export const eventBySlug: QueryResolvers['eventBySlug'] = async (_parent, args, context) => {
  const { authUser, db } = context;
  const { organizationSlug, eventSlug } = args;

  if (!authUser) throw unauthorizedError();

  try {
    const orgSnap = await db
      .collection('organizations')
      .where('slug', '==', organizationSlug)
      .limit(1)
      .get();

    if (orgSnap.empty) throw notFoundError('Organization not found.');

    const orgDoc = orgSnap.docs[0];
    const organization = adaptOrganization(orgDoc);

    const memberSnap = await db
      .collection('organizations')
      .doc(organization.id)
      .collection('organizationMembers')
      .where('userId', '==', authUser.uid)
      .limit(1)
      .get();

    if (memberSnap.empty) {
      throw forbiddenError('You are not a member of this organization.');
    }

    const eventSnap = await db
      .collection('organizations')
      .doc(organization.id)
      .collection('events')
      .where('slug', '==', eventSlug)
      .limit(1)
      .get();

    if (eventSnap.empty) {
      throw notFoundError('Event not found.');
    }

    const eventDoc = eventSnap.docs[0];
    const event = adaptEvent(eventDoc);

    return event;
  } catch (error) {
    console.error(error);

    if (error instanceof GraphQLError) {
      throw error;
    }

    throw internalServerError();
  }
};
