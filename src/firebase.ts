import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.apiKey as string,
  authDomain: 'open-to-see-ur-future.firebaseapp.com',
  projectId: 'open-to-see-ur-future',
  storageBucket: 'open-to-see-ur-future.firebasestorage.app',
  messagingSenderId: '216092307343',
  appId: '1:216092307343:web:749e6d0d9ee0818a24e5fa',
};

const missingConfig = Object.entries(firebaseConfig)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missingConfig.length > 0) {
  throw new Error(`Missing Firebase web configuration: ${missingConfig.join(', ')}`);
}

const firebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(firebaseApp);
