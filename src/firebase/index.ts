import dotenv from 'dotenv';
import * as admin from 'firebase-admin';

dotenv.config();

let app: admin.app.App;

if (!admin.apps.length) {
  const creds = JSON.parse(process.env.FIREBASE_CREDENTIALS ?? '{}');
  app = admin.initializeApp({
    credential: admin.credential.cert(creds),
  });
} else {
  app = admin.app();
}

export const db = admin.firestore(app);
export const auth = admin.auth(app);
