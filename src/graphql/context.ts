import { Request } from 'express';
import { DecodedIdToken, getAuth } from 'firebase-admin/auth';
import { Firestore, getFirestore } from 'firebase-admin/firestore';

interface DataSourceContext {
  user: DecodedIdToken | null;
  db: Firestore;
}

export const createContext = async (req: Request): Promise<DataSourceContext> => {
  const authHeader = req.headers.authorization ?? '';
  let user = null;

  if (authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.split(' ')[1];
      user = await getAuth().verifyIdToken(token);
    } catch {
      throw new Error('Invalid token');
    }
  }

  return { user, db: getFirestore() };
};
