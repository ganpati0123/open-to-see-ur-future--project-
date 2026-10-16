import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey:
    import.meta.env.VITE_FIREBASE_API_KEY ||
    (import.meta.env.apiKey as string | undefined) ||
    'AIzaSyCRimlOlIPBIphZSb5UxuVn3TA_atQVVf0',
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ||
    'open-to-see-ur-future.firebaseapp.com',
  projectId:
    import.meta.env.VITE_FIREBASE_PROJECT_ID ||
    'open-to-see-ur-future',
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
    'open-to-see-ur-future.firebasestorage.app',
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ||
    '216092307343',
  appId:
    import.meta.env.VITE_FIREBASE_APP_ID ||
    '1:216092307343:web:749e6d0d9ee0818a24e5fa',
};

let firebaseApp: FirebaseApp;
try {
  firebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
} catch (error) {
  console.warn('Firebase initialization note:', error);
  firebaseApp = getApps()[0] || initializeApp(firebaseConfig, 'open-to-see-future-app');
}

export const auth: Auth = getAuth(firebaseApp);

