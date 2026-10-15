import { useState } from 'react';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { AuthShell } from '../components/AuthShell';
import { auth } from '../firebase';
import { useAuth } from '../context/AuthContext';

export const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleLogout = async () => {
    setBusy(true);
    setError('');
    try {
      await signOut(auth);
      navigate('/login', { replace: true });
    } catch {
      setError('We could not sign you out. Please try again.');
      setBusy(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Your account"
      title={`Welcome${user?.displayName ? `, ${user.displayName}` : ''}`}
      description="You are signed in to Open to See Your Future."
    >
      <div className="border-y border-[#ded5c8] py-4">
        <span className="block text-[10px] uppercase tracking-[.14em] text-[#918877]">Signed in as</span>
        <span className="mt-1 block break-all text-sm text-[#514a3f]">{user?.email}</span>
      </div>
      {error && <p role="alert" className="mt-4 text-sm text-[#9b4f40]">{error}</p>}
      <button
        type="button"
        onClick={handleLogout}
        disabled={busy}
        className="mt-6 flex min-h-12 w-full items-center justify-center border border-[#b9a58a] px-4 text-xs font-medium uppercase tracking-[.14em] text-[#514a3f] transition hover:bg-[#eee7dc] disabled:cursor-wait disabled:opacity-60"
      >
        {busy ? 'Signing out…' : 'Log out'}
      </button>
    </AuthShell>
  );
};
