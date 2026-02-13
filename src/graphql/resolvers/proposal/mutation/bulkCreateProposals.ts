import { GraphQLError } from 'graphql';
import { Timestamp } from 'firebase-admin/firestore';

import {
  EventMemberRole,
  MutationResolvers,
  OrganizationMember,
  OrganizationMemberRole,
  ProposalInput,
  ProposalStatus,
} from '../../../types';

const MAX_BATCH_SIZE = 100;

export const bulkCreateProposals: MutationResolvers['bulkCreateProposals'] = async (
  _,
  { input },
  { db, authUser },
) => {
  if (!authUser) {
    throw new GraphQLError('Unauthorized', {
      extensions: {
        code: 'UNAUTHORIZED',
        http: {
          status: 401,
        },
      },
    });
  }

  const { eventId, format, organizationId, proposals } = input;

  if (!proposals.length || proposals.length === 0) {
    throw new GraphQLError('No proposals provided', {
      extensions: {
        code: 'BAD_USER_INPUT',
        http: {
          status: 400,
        },
      },
    });
  }

  try {
    const orgRef = db.collection('organizations').doc(organizationId);
    const orgSnap = await orgRef.get();

    if (!orgSnap.exists) {
      throw new GraphQLError('Organization not found', {
        extensions: {
          code: 'NOT_FOUND',
          http: {
            status: 404,
          },
        },
      });
    }

    const orgMemberSnap = await orgRef
      .collection('organizationMembers')
      .doc(authUser.uid)
      .get();

    if (!orgMemberSnap.exists) {
      throw new GraphQLError('You are not a member of this organization', {
        extensions: {
          code: 'FORBIDDEN',
          http: {
            status: 403,
          },
        },
      });
    }

    const orgMember = orgMemberSnap.data() as OrganizationMember;
    const orgRole = orgMember.role as OrganizationMemberRole;

    if (orgRole !== OrganizationMemberRole.Owner) {
      throw new GraphQLError('Only organization owners can bulk upload proposals', {
        extensions: {
          code: 'FORBIDDEN',
          http: {
            status: 403,
          },
        },
      });
    }

    const eventRef = orgRef.collection('events').doc(eventId);
    const eventSnap = await eventRef.get();

    if (!eventSnap.exists) {
      throw new GraphQLError('Event not found', {
        extensions: {
          code: 'NOT_FOUND',
          http: {
            status: 404,
          },
        },
      });
    }

    const grouped = groupBySpeaker(proposals);

    let created = 0;
    let skipped = 0;

    let batch = db.batch();
    let operationCount = 0;

    const commitBatch = async () => {
      if (operationCount > 0) {
        await batch.commit();
        batch = db.batch();
        operationCount = 0;
      }
    };

    for (const [email, speakerProposals] of grouped.entries()) {
      const normalizedEmail = email.trim().toLowerCase();
      const usersRef = db.collection('users');

      const existingUserSnap = await usersRef
        .where('email', '==', normalizedEmail)
        .limit(1)
        .get();

      let speakerId: string;

      if (!existingUserSnap.empty) {
        speakerId = existingUserSnap.docs[0].id;
      } else {
        speakerId = usersRef.doc().id;

        const firstProposal = speakerProposals[0];

        batch.set(usersRef.doc(speakerId), {
          id: speakerId,
          name: firstProposal.speakerName,
          email: normalizedEmail,
          location: firstProposal.speakerLocation ?? null,
          bio: firstProposal.speakerBio ?? null,
          occupation: firstProposal.speakerOccupation ?? null,
          contactInfo: firstProposal.speakerContactInfo ?? null,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        });

        operationCount++;
      }

      const orgMemberRef = orgRef.collection('organizationMembers').doc(speakerId);

      const orgMemberSnapCheck = await orgMemberRef.get();

      if (!orgMemberSnapCheck.exists) {
        batch.set(orgMemberRef, {
          userId: speakerId,
          orgId: organizationId,
          role: OrganizationMemberRole.Member,
          joinedAt: Timestamp.now(),
        });

        operationCount++;
      }

      const eventMemberRef = eventRef.collection('eventMembers').doc(speakerId);

      const eventMemberSnapCheck = await eventMemberRef.get();

      if (!eventMemberSnapCheck.exists) {
        batch.set(eventMemberRef, {
          eventId,
          joinedAt: Timestamp.now(),
          userId: speakerId,
          role: EventMemberRole.Guest,
          orgId: organizationId,
        });

        operationCount++;
      }

      for (const proposalInput of speakerProposals) {
        const normalizedTitle = proposalInput.title.trim().toLowerCase();
        const submissionHash = `${organizationId}-${eventId}-${normalizedTitle}-${normalizedEmail}`;
        const duplicateSnap = await eventRef
          .collection('proposals')
          .where('submissionHash', '==', submissionHash)
          .limit(1)
          .get();

        if (!duplicateSnap.empty) {
          skipped++;
          continue;
        }

        const proposalRef = eventRef.collection('proposals').doc();

        batch.set(proposalRef, {
          id: proposalRef.id,
          organizationId,
          eventId,
          title: proposalInput.title.trim(),
          abstract: proposalInput.abstract.trim() ?? '',
          description: proposalInput.description?.trim() ?? '',
          duration: proposalInput.duration ?? 30,
          speakerId,
          status: ProposalStatus.Submitted,
          format,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
          submittedAt: Timestamp.now(),
          normalizedTitle,
          submissionHash,
        });

        operationCount++;
        created++;

        if (operationCount >= MAX_BATCH_SIZE) {
          await commitBatch();
        }
      }
    }

    await commitBatch();

    return {
      total: proposals.length,
      created,
      skipped,
    };
  } catch (error) {
    console.error(error);

    if (error instanceof GraphQLError) {
      throw error;
    }

    throw new GraphQLError('Internal server error', {
      extensions: {
        code: 'INTERNAL_SERVER_ERROR',
        http: {
          status: 500,
        },
      },
    });
  }
};

const groupBySpeaker = (proposals: ProposalInput[]): Map<string, ProposalInput[]> => {
  const map = new Map<string, ProposalInput[]>();

  for (const proposal of proposals) {
    const email = proposal.speakerEmail.trim().toLowerCase();

    if (!map.has(email)) {
      map.set(email, []);
    }

    map.get(email)!.push(proposal);
  }

  return map;
};
