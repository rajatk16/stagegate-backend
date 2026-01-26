import { Timestamp } from 'firebase-admin/firestore';

export const toISOString = (value: Timestamp) => value.toDate().toISOString();
