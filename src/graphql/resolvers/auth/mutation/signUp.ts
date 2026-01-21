import { GraphQLError } from 'graphql';

import { adaptUser } from '../../../../utils';
import { MutationResolvers } from '../../../types';

export const signUp: MutationResolvers['signUp'] = async (_parent, args, context) => {
  const existingUserSnap = await context.db
    .collection('users')
    .where('email', '==', args.input.email)
    .limit(1)
    .get();

  let firestoreDoc = existingUserSnap.empty ? null : existingUserSnap.docs[0];
  const firestoreUser = firestoreDoc ? firestoreDoc.data() : null;

  let authUserRecord = null;

  try {
    authUserRecord = await context.auth.getUserByEmail(args.input.email);
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
    const newAuthUser = await context.auth.createUser({
      email: args.input.email,
      password: args.input.password,
      displayName: args.input.name,
      emailVerified: false,
    });

    const now = new Date().toISOString();

    const newUserData = {
      ...firestoreUser,
      id: newAuthUser.uid,
      name: args.input.name,
      updatedAt: now,
    };

    const batch = context.db.batch();

    const newDocRef = context.db.collection('users').doc(newAuthUser.uid);
    batch.set(newDocRef, newUserData, { merge: true });

    const oldDocRef = context.db.collection('users').doc(firestoreDoc!.id);
    batch.delete(oldDocRef);

    await batch.commit();

    const updatedDoc = await context.db.collection('users').doc(newAuthUser.uid).get();
    return {
      uid: newAuthUser.uid,
      email: newAuthUser.email!,
      user: adaptUser(updatedDoc),
    };
  }

  if (!firestoreDoc && !authUserRecord) {
    const newAuthUser = await context.auth.createUser({
      email: args.input.email,
      password: args.input.password,
      displayName: args.input.name,
      emailVerified: false,
    });

    const userData = {
      id: newAuthUser.uid,
      email: newAuthUser.email,
      name: args.input.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await context.db.collection('users').doc(newAuthUser.uid).set(userData);

    const userDoc = await context.db.collection('users').doc(newAuthUser.uid).get();

    return {
      uid: newAuthUser.uid,
      email: newAuthUser.email!,
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
