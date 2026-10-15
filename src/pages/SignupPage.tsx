import { useState, type FormEvent } from 'react';
import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  setPersistence,
  updateProfile,
} from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { AuthShell } from '../components/AuthShell';

const signupErrorMessage = (error: unknown): string => {
  const code = error && typeof error === 'object' && 'code' in error
    ? String(error.code)
    : '';

  switch (code) {
    case 'auth/email-already-in-use':
      return 'An account already exists for this email. Try signing in instead.';
    case 'auth/invalid-email':
      return 'Enter a valid email address.';
    case 'auth/weak-password':
      return 'Choose a password with at least 6 characters.';
    case 'auth/operation-not-allowed':
      return 'Email and password sign-up is not enabled in Firebase Authentication settings.';
    case 'auth/unauthorized-domain':
      return 'This website domain is not authorized in Firebase Authentication settings.';
    case 'auth/network-request-failed':
      return 'A network error interrupted sign-up. Check your connection and try again.';
    default:
      return 'We could not create your account. Please try again.';
  }
};

export const SignupPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSignup = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      await setPersistence(auth, browserLocalPersistence);
      const result = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const displayName = name.trim();
      if (displayName) await updateProfile(result.user, { displayName });
      navigate('/dashboard', { replace: true });
    } catch (signupError) {
      setError(signupErrorMessage(signupError));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Join the studio"
      title="Create your account"
      description="Save your place and access your personal dashboard."
    >
      <form onSubmit={handleSignup} className="space-y-4">
        <label className="block text-xs text-[#514a3f]" htmlFor="signup-name">
          Name <span className="text-[#9a907f]">(optional)</span>
          <input
            id="signup-name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mt-1.5 min-h-11 w-full border border-[#cfc4b4] bg-white px-3 text-sm text-[#28251f] outline-none focus:border-[#8d6d4e] focus:ring-1 focus:ring-[#8d6d4e]"
          />
        </label>
        <label className="block text-xs text-[#514a3f]" htmlFor="signup-email">
          Email address
          <input
            id="signup-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="mt-1.5 min-h-11 w-full border border-[#cfc4b4] bg-white px-3 text-sm text-[#28251f] outline-none focus:border-[#8d6d4e] focus:ring-1 focus:ring-[#8d6d4e]"
          />
        </label>
        <label className="block text-xs text-[#514a3f]" htmlFor="signup-password">
          Password
          <input
            id="signup-password"
            type="password"
            autoComplete="new-password"
            minLength={6}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            className="mt-1.5 min-h-11 w-full border border-[#cfc4b4] bg-white px-3 text-sm text-[#28251f] outline-none focus:border-[#8d6d4e] focus:ring-1 focus:ring-[#8d6d4e]"
          />
          <span className="mt-1 block text-[10px] text-[#918877]">Use at least 6 characters.</span>
        </label>
        {error && <p role="alert" className="text-sm leading-5 text-[#9b4f40]">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="flex min-h-12 w-full items-center justify-center bg-[#302d27] px-4 text-xs font-medium uppercase tracking-[.14em] text-[#f7f1e7] transition hover:bg-[#8d6d4e] disabled:cursor-wait disabled:opacity-60"
        >
          {busy ? 'Creating account…' : 'Create account'}
        </button>
      </form>
      <p className="mt-6 text-center text-xs text-[#746d61]">
        Already registered?{' '}
        <Link to="/login" className="font-medium text-[#6e5942] underline decoration-[#b69570] underline-offset-4">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
};
