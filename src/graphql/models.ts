import { Timestamp } from 'firebase-admin/firestore';

export type OrganizationModel = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo: string | null;
  website: string | null;
  ownerId: string;
  isPublic: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export type OrganizationMemberModel = {
  userId: string;
  role: string;
  orgId: string;
  joinedAt: Timestamp;
};

export type EventModel = {
  id: string;
  name: string;
  slug: string;
  eventType: string;
  description: string | null;
  tagline: string | null;
  startDate: Timestamp | null;
  endDate: Timestamp | null;
  location: {
    name: string | null;
    address: string | null;
    city: string | null;
    country: string | null;
  } | null;
  website: string | null;
  coverImage: string | null;
  organizationId: string;
  format: string;
  status: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export type EventMemberModel = {
  userId: string;
  role: string;
  orgId: string;
  eventId: string;
  joinedAt: Timestamp;
};

export type ProposalModel = {
  id: string;
  eventId: string;
  organizationId: string;
  title: string;
  abstract?: string | null;
  description?: string | null;
  duration?: number | null;
  speakerId: string;
  status: string;
  format: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  submittedAt?: Timestamp | null;
  normalizedTitle: string;
  submissionHash: string;
};
