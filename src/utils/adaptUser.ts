import { GraphQLError } from 'graphql';
import { DocumentSnapshot } from 'firebase-admin/firestore';

import { User } from '../graphql/types';

export const adaptUser = (doc: DocumentSnapshot): User => {
  const user = doc.data();

  if (!user)
    throw new GraphQLError('Invalid user data', {
      extensions: {
        code: 'INTERNAL_SERVER_ERROR',
        http: {
          status: 500,
        },
      },
    });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    location: {
      city: user.location?.city,
      country: user.location?.country,
    },
    bio: user.bio ?? '',
    occupation: {
      company: user.occupation?.company ?? '',
      title: user.occupation?.title ?? '',
    },
    contactInfo: {
      secondaryEmail: user.contactInfo?.secondaryEmail ?? '',
      phone: user.contactInfo?.phone ?? '',
      website: user.contactInfo?.website ?? '',
    },
    socialMedia: user.socialMedia?.map((socialMedia: any) => ({
      platform: socialMedia.platform ?? '',
      handle: socialMedia.handle ?? '',
    })),
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    profilePicture: user.profilePicture ?? '',
  };
};
