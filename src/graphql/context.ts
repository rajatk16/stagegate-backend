import { Request } from 'express';
import { Firestore } from 'firebase-admin/firestore';

import { auth, db } from '../firebase';

export interface AuthUser {
  uid: string;
  email?: string;
}

export interface DataSourceContext {
  authUser: AuthUser | null;
  db: Firestore;
}

export const buildContext = async (req: Request): Promise<DataSourceContext> => {
  const authHeader: string = req.headers.authorization ?? '';
  let authUser: AuthUser | null = null;

  if (authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.split(' ')[1];
      const decoded = await auth.verifyIdToken(token);
      authUser = {
        uid: decoded.uid,
        email: decoded.email,
      };
    } catch (error) {
      console.warn('Auth verification failed: ', error);
    }
  }

  return { authUser, db };
};
