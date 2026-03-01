import { GraphQLError } from 'graphql';

import { QueryResolvers } from '../../../types';
import {
  adaptEvent,
  notFoundError,
  unauthorizedError,
  internalServerError,
} from '../../../../utils';

export const organizationEvents: QueryResolvers['organizationEvents'] = async (
  _parent,
  { organizationId },
  { db, authUser },
) => {
  if (!authUser) throw unauthorizedError();

  try {
    const orgSnap = await db.collection('organizations').doc(organizationId).get();

    if (!orgSnap.exists) throw notFoundError('Organization not found.');

    const orgRef = orgSnap.ref;

    const eventsSnap = await orgRef.collection('events').orderBy('createdAt', 'desc').get();

    if (eventsSnap.empty || eventsSnap.docs.length === 0) {
      return [];
    }

    const visibleEvents = [];

    for (const eventDoc of eventsSnap.docs) {
      visibleEvents.push(adaptEvent(eventDoc));
    }

    return visibleEvents;
  } catch (error) {
    console.error('error');

    if (error instanceof GraphQLError) {
      throw error;
    }

    throw internalServerError();
  }
};
