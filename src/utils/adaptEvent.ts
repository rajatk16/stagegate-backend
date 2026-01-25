import { GraphQLError } from 'graphql';
import { DocumentSnapshot } from 'firebase-admin/firestore';

import { EventModel } from '../graphql/models';

export const adaptEvent = (doc: DocumentSnapshot): EventModel => {
  const data = doc.data();

  if (!data) {
    throw new GraphQLError('Invalid event data', {
      extensions: {
        code: 'INTERNAL_SERVER_ERROR',
        http: {
          status: 500,
        },
      },
    });
  }

  return {
    id: doc.id,
    name: data.name ?? '',
    slug: data.slug ?? '',
    eventType: data.eventType,
    description: data.description,
    tagline: data.tagline,
    startDate: data.startDate,
    endDate: data.endDate,
    location: data.location,
    website: data.website,
    coverImage: data.coverImage,
    organizationId: data.organizationId,
    format: data.format,
    status: data.status,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
};
