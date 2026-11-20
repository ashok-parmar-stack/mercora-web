import React from 'react';
import Link from 'next/link';
import { Logo } from '@/components/Logo';

export const dynamic = 'force-dynamic';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)] flex flex-col items-center justify-center p-6 text-center font-sans antialiased relative transition-colors duration-200">
      <div className="mb-6">
        <Logo height={32} />
      </div>
      <div className="max-w-md w-full bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8 shadow-xs">
        <h1 className="text-6xl font-extrabold text-brand-600 mb-3 font-display">404</h1>
        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2 font-display">Page Not Found</h2>
        <p className="text-sm text-[var(--text-secondary)] mb-6 font-body">
          The page you are looking for does not exist or may have been moved.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center w-full px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-xs transition-colors"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
