// 11. Firebase for async data read/write

import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get } from 'firebase/database';

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export const fetchHighScores = async () => {
  const dbRef = ref(db);
  const snapshot = await get(dbRef);
  return snapshot.exists() ? Object.values(snapshot.val()) : [];
};
