import { DocumentSnapshot } from 'firebase-admin/firestore';

export const adaptProposal = (doc: DocumentSnapshot) => {
  const data = doc.data();

  return {
    id: doc.id,
    eventId: data?.eventId,
    organizationId: data?.organizationId,
    title: data?.title,
    abstract: data?.abstract ?? null,
    description: data?.description ?? null,
    duration: data?.duration ?? null,
    speakerId: data?.speakerId,
    status: data?.status,
    format: data?.format,
    createdAt: data?.createdAt,
    updatedAt: data?.updatedAt,
    submittedAt: data?.submittedAt ?? null,
    normalizedTitle: data?.normalizedTitle,
    submissionHash: data?.submissionHash,
  };
};
