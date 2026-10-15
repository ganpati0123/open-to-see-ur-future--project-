import { useState, type FormEvent } from 'react';
import {
  browserLocalPersistence,
  GoogleAuthProvider,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { AuthShell } from '../components/AuthShell';

const authErrorMessage = (error: unknown): string => {
  const code = error && typeof error === 'object' && 'code' in error
    ? String(error.code)
    : '';

  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'That email and password do not match. Please try again.';
    case 'auth/invalid-email':
      return 'Enter a valid email address.';
    case 'auth/operation-not-allowed':
      return 'This sign-in method is not enabled in Firebase Authentication settings.';
    case 'auth/unauthorized-domain':
      return 'This website domain is not authorized in Firebase Authentication settings.';
    case 'auth/popup-closed-by-user':
      return 'The Google sign-in window was closed before sign-in finished.';
    case 'auth/popup-blocked':
      return 'Your browser blocked the Google sign-in window. Allow pop-ups and try again.';
    case 'auth/network-request-failed':
      return 'A network error interrupted sign-in. Check your connection and try again.';
    default:
      return 'We could not sign you in. Please try again.';
  }
};

export const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleEmailLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      await setPersistence(auth, browserLocalPersistence);
      await signInWithEmailAndPassword(auth, email.trim(), password);
      navigate('/dashboard', { replace: true });
    } catch (loginError) {
      setError(authErrorMessage(loginError));
    } finally {
      setBusy(false);
    }
  };

  const handleGoogleLogin = async () => {
    setBusy(true);
    setError('');
    try {
      await setPersistence(auth, browserLocalPersistence);
      await signInWithPopup(auth, new GoogleAuthProvider());
      navigate('/dashboard', { replace: true });
    } catch (loginError) {
      setError(authErrorMessage(loginError));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Your account"
      title="Welcome back"
      description="Sign in to continue to your personal dashboard."
    >
      <form onSubmit={handleEmailLogin} className="space-y-4">
        <label className="block text-xs text-[#514a3f]" htmlFor="login-email">
          Email address
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="mt-1.5 min-h-11 w-full border border-[#cfc4b4] bg-white px-3 text-sm text-[#28251f] outline-none focus:border-[#8d6d4e] focus:ring-1 focus:ring-[#8d6d4e]"
          />
        </label>
        <label className="block text-xs text-[#514a3f]" htmlFor="login-password">
          Password
          <input
            id="login-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            className="mt-1.5 min-h-11 w-full border border-[#cfc4b4] bg-white px-3 text-sm text-[#28251f] outline-none focus:border-[#8d6d4e] focus:ring-1 focus:ring-[#8d6d4e]"
          />
        </label>
        {error && <p role="alert" className="text-sm leading-5 text-[#9b4f40]">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="flex min-h-12 w-full items-center justify-center bg-[#302d27] px-4 text-xs font-medium uppercase tracking-[.14em] text-[#f7f1e7] transition hover:bg-[#8d6d4e] disabled:cursor-wait disabled:opacity-60"
        >
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <div className="my-5 flex items-center gap-3 text-[10px] uppercase tracking-[.14em] text-[#9a907f]">
        <span className="h-px flex-1 bg-[#ded5c8]" />
        or
        <span className="h-px flex-1 bg-[#ded5c8]" />
      </div>

      <button
        type="button"
        disabled={busy}
        onClick={handleGoogleLogin}
        className="flex min-h-12 w-full items-center justify-center border border-[#cfc4b4] bg-white px-4 text-xs font-medium text-[#514a3f] transition hover:bg-[#f2ece2] disabled:cursor-wait disabled:opacity-60"
      >
        Continue with Google
      </button>

      <p className="mt-6 text-center text-xs text-[#746d61]">
        New here?{' '}
        <Link to="/signup" className="font-medium text-[#6e5942] underline decoration-[#b69570] underline-offset-4">
          Create an account
        </Link>
      </p>
    </AuthShell>
  );
};
