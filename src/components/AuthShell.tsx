import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface AuthShellProps {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}

export const AuthShell = ({ eyebrow, title, description, children }: AuthShellProps) => (
  <main className="cosmic-shell relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10 text-[#f5f0e7]">
    <div className="w-full max-w-md">
      <Link
        to="/"
        className="mb-6 inline-flex text-[10px] uppercase tracking-[.15em] text-[#766b5b] underline decoration-[#b69570] underline-offset-4 hover:text-[#28251f]"
      >
        Back to the studio
      </Link>
      <section className="cosmic-glow rounded-2xl border border-[#e6b967]/25 bg-[#111326]/90 p-6 shadow-2xl backdrop-blur-xl sm:p-9">
        <span className="shop-kicker">{eyebrow}</span>
        <h1 className="mt-3 font-serif text-4xl leading-tight sm:text-5xl">{title}</h1>
        <p className="mt-3 text-sm leading-6 text-[#746d61]">{description}</p>
        <div className="mt-7">{children}</div>
      </section>
    </div>
  </main>
);

export const AuthLoading = () => (
  <main
    className="flex min-h-screen items-center justify-center bg-[#f3eee5] px-6 text-center text-sm text-[#746d61]"
    aria-live="polite"
    aria-busy="true"
  >
    Checking your sign-in…
  </main>
);
