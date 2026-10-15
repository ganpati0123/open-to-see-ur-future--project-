import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  updateProfile,
  type User,
} from 'firebase/auth';
import { firebaseAuth, isFirebaseConfigured } from '../lib/firebase';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  configurationError: string | null;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const requireFirebaseAuth = () => {
  if (!firebaseAuth) {
    throw new Error('Firebase Authentication is not configured for this app.');
  }
  return firebaseAuth;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [configurationError, setConfigurationError] = useState<string | null>(null);

  useEffect(() => {
    if (!firebaseAuth) {
      setConfigurationError(
        'Firebase is not configured. Add the VITE_FIREBASE_* web configuration values to this Replit environment.',
      );
      setLoading(false);
      return;
    }

    let isMounted = true;
    let unsubscribe: (() => void) | undefined;

    const initializeAuth = async () => {
      try {
        await setPersistence(firebaseAuth, browserLocalPersistence);
        if (!isMounted) return;

        unsubscribe = onAuthStateChanged(
          firebaseAuth,
          (currentUser) => {
            setUser(currentUser);
            setLoading(false);
          },
          () => {
            setUser(null);
            setConfigurationError('Could not read the Firebase sign-in session. Refresh and try again.');
            setLoading(false);
          },
        );
      } catch {
        if (!isMounted) return;
        setConfigurationError('Could not initialize Firebase Authentication. Check the Firebase web configuration.');
        setLoading(false);
      }
    };

    void initializeAuth();
    return () => {
      isMounted = false;
      unsubscribe?.();
    };
  }, []);

  const signUp = async (name: string, email: string, password: string) => {
    const credential = await createUserWithEmailAndPassword(
      requireFirebaseAuth(),
      email.trim(),
      password,
    );
    const displayName = name.trim();
    if (displayName) {
      await updateProfile(credential.user, { displayName });
    }
    setUser(credential.user);
  };

  const signIn = async (email: string, password: string) => {
    const credential = await signInWithEmailAndPassword(
      requireFirebaseAuth(),
      email.trim(),
      password,
    );
    setUser(credential.user);
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const credential = await signInWithPopup(requireFirebaseAuth(), provider);
    setUser(credential.user);
  };

  const sendPasswordReset = async (email: string) => {
    await sendPasswordResetEmail(requireFirebaseAuth(), email.trim());
  };

  const signOut = async () => {
    await firebaseSignOut(requireFirebaseAuth());
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        configurationError,
        signUp,
        signIn,
        signInWithGoogle,
        sendPasswordReset,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider.');
  }
  return context;
};
