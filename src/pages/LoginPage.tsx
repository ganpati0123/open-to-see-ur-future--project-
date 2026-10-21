import { useState, type FormEvent } from 'react';
import {
  browserLocalPersistence,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, ExternalLink, KeyRound, Mail } from 'lucide-react';
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
      return 'That email and password do not match. Please verify or reset your password.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/operation-not-allowed':
      return 'This sign-in method is not enabled in Firebase Authentication settings.';
    case 'auth/unauthorized-domain':
      return 'This website domain is not authorized in Firebase Authentication settings.';
    case 'auth/popup-closed-by-user':
      return 'The Google sign-in window was closed before sign-in finished.';
    case 'auth/popup-blocked':
      return 'Your browser blocked the Google sign-in window. Allow pop-ups and try again.';
    case 'auth/network-request-failed':
      return 'A network error interrupted the connection. Check your internet connection and try again.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a few moments before trying again.';
    default:
      return 'We could not complete your request. Please try again.';
  }
};

export const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  // Forgot password flow states
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [resetBusy, setResetBusy] = useState(false);
  const [resetError, setResetError] = useState('');

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

  const handleSendPasswordReset = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const targetEmail = resetEmail.trim() || email.trim();
    if (!targetEmail) {
      setResetError('Please enter your registered email address.');
      return;
    }

    setResetBusy(true);
    setResetError('');
    try {
      await sendPasswordResetEmail(auth, targetEmail);
      setResetSent(true);
    } catch (err: any) {
      const code = err?.code;
      if (code === 'auth/user-not-found') {
        setResetError('No account registered with this email address. Please check your spelling or create an account.');
      } else if (code === 'auth/invalid-email') {
        setResetError('Please enter a valid email address.');
      } else if (code === 'auth/too-many-requests') {
        setResetError('Too many reset requests recently. Please wait a few minutes before trying again.');
      } else {
        setResetError(authErrorMessage(err));
      }
    } finally {
      setResetBusy(false);
    }
  };

  // ============================================
  // FORGOT PASSWORD VIEW
  // ============================================
  if (isForgotPassword) {
    return (
      <AuthShell
        eyebrow="Account Recovery"
        title="Reset your password"
        description="Enter your registered email address. We'll send a password reset link directly to your inbox so you can set a new password and sign in."
      >
        {resetSent ? (
          <div className="space-y-5 animate-in fade-in">
            <div className="rounded-xl border border-[#27745b]/40 bg-[#27745b]/10 p-4 text-[#1f604b]">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-[#27745b] mt-0.5" />
                <div>
                  <h3 className="font-serif text-base font-semibold text-[#1f604b]">
                    Reset link dispatched!
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-[#2c4e40]">
                    We sent a password recovery email to{' '}
                    <strong className="font-mono text-[#1a382c]">{resetEmail.trim() || email.trim()}</strong>.
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-[#2c4e40]">
                    Please open your <strong>Gmail / Email Inbox</strong> (and check your <strong>Spam/Junk folder</strong> if not found within 1 minute). Click the link to enter your updated password, then come back here to log in.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <a
                href="https://mail.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-11 w-full items-center justify-center gap-2 rounded-sm border border-[#cfc4b4] bg-white px-4 text-xs font-medium text-[#514a3f] transition hover:bg-[#f2ece2]"
              >
                <Mail className="h-4 w-4 text-[#bd8e48]" />
                <span>Open Gmail Inbox</span>
                <ExternalLink className="h-3.5 w-3.5 text-[#9a907f]" />
              </a>

              <button
                type="button"
                onClick={() => {
                  setIsForgotPassword(false);
                  setResetSent(false);
                  setResetError('');
                }}
                className="flex min-h-11 w-full items-center justify-center gap-2 bg-[#302d27] px-4 text-xs font-semibold uppercase tracking-[.14em] text-[#f7f1e7] transition hover:bg-[#8d6d4e] cursor-pointer"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back to Sign In</span>
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSendPasswordReset} className="space-y-4">
            <div className="rounded-lg border border-[#ded5c8] bg-[#fbf8f1] p-3 text-xs text-[#746d61] leading-relaxed">
              <span className="flex items-center gap-1.5 font-medium text-[#28251f] mb-1">
                <KeyRound className="h-3.5 w-3.5 text-[#bd8e48]" />
                Instant Email Recovery
              </span>
              Enter the Gmail or email address you used to register. A secure reset link will be generated and emailed to you immediately.
            </div>

            <label className="block text-xs text-[#514a3f]" htmlFor="reset-email">
              Your registered email address
              <input
                id="reset-email"
                type="email"
                autoComplete="email"
                required
                value={resetEmail || email}
                onChange={(event) => {
                  setResetEmail(event.target.value);
                  setEmail(event.target.value);
                }}
                placeholder="e.g. you@gmail.com"
                className="mt-1.5 min-h-11 w-full border border-[#cfc4b4] bg-white px-3 text-sm text-[#28251f] outline-none focus:border-[#8d6d4e] focus:ring-1 focus:ring-[#8d6d4e]"
              />
            </label>

            {resetError && (
              <p role="alert" className="text-xs leading-5 text-[#9b4f40] bg-[#9b4f40]/10 p-2.5 rounded border border-[#9b4f40]/30">
                {resetError}
              </p>
            )}

            <button
              type="submit"
              disabled={resetBusy}
              className="flex min-h-12 w-full items-center justify-center gap-2 bg-[#302d27] px-4 text-xs font-semibold uppercase tracking-[.14em] text-[#f7f1e7] transition hover:bg-[#8d6d4e] disabled:cursor-wait disabled:opacity-60 cursor-pointer shadow-sm"
            >
              <Mail className="h-4 w-4 text-[#e6b967]" />
              <span>{resetBusy ? 'Dispatching Reset Link…' : 'Send Password Reset Link'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsForgotPassword(false);
                setResetError('');
              }}
              className="flex min-h-10 w-full items-center justify-center gap-2 text-xs uppercase tracking-[.12em] text-[#746d61] hover:text-[#28251f] cursor-pointer transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Cancel & Return to Sign In</span>
            </button>
          </form>
        )}
      </AuthShell>
    );
  }

  // ============================================
  // STANDARD SIGN IN VIEW
  // ============================================
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
            placeholder="e.g. you@gmail.com"
            className="mt-1.5 min-h-11 w-full border border-[#cfc4b4] bg-white px-3 text-sm text-[#28251f] outline-none focus:border-[#8d6d4e] focus:ring-1 focus:ring-[#8d6d4e]"
          />
        </label>

        <div>
          <div className="flex items-center justify-between">
            <label className="block text-xs text-[#514a3f]" htmlFor="login-password">
              Password
            </label>
            <button
              type="button"
              onClick={() => {
                setIsForgotPassword(true);
                setResetEmail(email);
                setError('');
              }}
              className="text-xs text-[#8d6d4e] hover:text-[#28251f] hover:underline cursor-pointer"
            >
              Forgot password?
            </button>
          </div>
          <input
            id="login-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            className="mt-1.5 min-h-11 w-full border border-[#cfc4b4] bg-white px-3 text-sm text-[#28251f] outline-none focus:border-[#8d6d4e] focus:ring-1 focus:ring-[#8d6d4e]"
          />
        </div>

        {error && <p role="alert" className="text-sm leading-5 text-[#9b4f40]">{error}</p>}

        <button
          type="submit"
          disabled={busy}
          className="flex min-h-12 w-full items-center justify-center bg-[#302d27] px-4 text-xs font-semibold uppercase tracking-[.14em] text-[#f7f1e7] transition hover:bg-[#8d6d4e] disabled:cursor-wait disabled:opacity-60 cursor-pointer shadow-sm"
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
        className="flex min-h-12 w-full items-center justify-center border border-[#cfc4b4] bg-white px-4 text-xs font-medium text-[#514a3f] transition hover:bg-[#f2ece2] disabled:cursor-wait disabled:opacity-60 cursor-pointer"
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
