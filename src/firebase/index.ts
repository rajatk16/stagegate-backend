import dotenv from 'dotenv';
import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

dotenv.config();

let app: admin.app.App;

if (!admin.apps.length) {
  const creds = JSON.parse(process.env.FIREBASE_CREDENTIALS ?? '{}');
  app = admin.initializeApp({
    credential: admin.credential.cert(creds),
    projectId: process.env.FIREBASE_PROJECT_ID,
  });
} else {
  app = admin.app();
}

const FIRESTORE_DB_ID = process.env.FIRESTORE_DB_ID || '(default)';
export const db = getFirestore(app, FIRESTORE_DB_ID);
export const auth = admin.auth(app);
