import type { DocumentSnapshot } from 'firebase-admin/firestore';

export const adaptOrganization = (doc: DocumentSnapshot) => {
  const data = doc.data();

  return {
    id: doc.id,
    name: data?.name ?? '',
    slug: data?.slug ?? '',
    description: data?.description ?? null,
    logo: data?.logo ?? null,
    website: data?.website ?? null,
    createdAt: data?.createdAt ?? null,
    ownerId: data?.ownerId ?? '',
    updatedAt: data?.updatedAt ?? null,
    isPublic: data?.isPublic ?? false,
  };
};
