import { GraphQLError } from 'graphql';

import { adaptUser } from '../../../../utils';
import { MutationResolvers } from '../../../types';
import { Timestamp } from 'firebase-admin/firestore';

export const signUp: MutationResolvers['signUp'] = async (_parent, { input }, { db, auth }) => {
  const normalizedEmail = input.email.trim().toLowerCase();
  const usersRef = db.collection('users');

  const existingUserSnap = await usersRef.where('email', '==', normalizedEmail).limit(1).get();

  let firestoreDoc = existingUserSnap.empty ? null : existingUserSnap.docs[0];

  const firestoreUser = firestoreDoc?.data() ?? null;

  let authUserRecord = null;

  try {
    authUserRecord = await auth.getUserByEmail(normalizedEmail);
  } catch (error) {
    if (error.code !== 'auth/user-not-found') {
      throw new GraphQLError(error.message, {
        extensions: {
          code: 'INTERNAL_SERVER_ERROR',
          http: {
            status: 500,
          },
        },
      });
    }
  }

  if (authUserRecord && firestoreUser) {
    throw new GraphQLError('User already exists', {
      extensions: {
        code: 'BAD_USER_INPUT',
        http: {
          status: 400,
        },
      },
    });
  }

  if (firestoreUser && !authUserRecord) {
    const externalId = firestoreUser.id;

    const newAuthUser = await auth.createUser({
      uid: externalId,
      email: normalizedEmail,
      password: input.password,
      displayName: input.name,
      emailVerified: true,
    });

    const now = Timestamp.now();

    await firestoreDoc!.ref.update({
      name: input.name,
      updatedAt: now,
    });

    const updatedDoc = await firestoreDoc!.ref.get();

    return {
      uid: newAuthUser.uid,
      email: normalizedEmail,
      user: adaptUser(updatedDoc),
    };
  }

  if (authUserRecord && !firestoreUser) {
    const now = Timestamp.now();

    await usersRef.doc(authUserRecord.uid).set({
      id: authUserRecord.uid,
      email: normalizedEmail,
      name: authUserRecord.displayName ?? input.name,
      createdAt: now,
      updatedAt: now,
    });

    const userDoc = await usersRef.doc(authUserRecord.uid).get();

    return {
      uid: authUserRecord.uid,
      email: normalizedEmail,
      user: adaptUser(userDoc),
    };
  }

  if (!firestoreDoc && !authUserRecord) {
    const now = Timestamp.now();
    const newAuthUser = await auth.createUser({
      email: normalizedEmail,
      password: input.password,
      displayName: input.name,
      emailVerified: true,
    });

    await usersRef.doc(newAuthUser.uid).set({
      id: newAuthUser.uid,
      email: normalizedEmail,
      name: input.name,
      createdAt: now,
      updatedAt: now,
    });

    const userDoc = await usersRef.doc(newAuthUser.uid).get();

    return {
      uid: newAuthUser.uid,
      email: normalizedEmail,
      user: adaptUser(userDoc),
    };
  }

  throw new GraphQLError('Internal server error', {
    extensions: {
      code: 'INTERNAL_SERVER_ERROR',
      http: {
        status: 500,
      },
    },
  });
};
