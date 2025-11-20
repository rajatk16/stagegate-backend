import { Timestamp } from 'firebase-admin/firestore';

export type OrganizationModel = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo: string | null;
  website: string | null;
  ownerId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export type OrganizationMemberModel = {
  userId: string;
  role: string;
  orgId: string;
  joinedAt: Timestamp;
};
