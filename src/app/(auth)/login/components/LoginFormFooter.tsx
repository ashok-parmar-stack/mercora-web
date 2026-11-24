import React from 'react';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

export function LoginFormFooter() {
  return (
    <div className="mt-6 pt-5 border-t border-border flex flex-col items-center gap-3 text-center">
      <p className="text-xs text-text-secondary">
        Need an enterprise workspace?{' '}
        <Link
          href="/register"
          className="font-bold text-primary hover:text-primary-hover hover:underline transition-colors ml-1"
        >
          Create account &rarr;
        </Link>
      </p>

      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-hover border border-border text-[11px] text-text-muted">
        <ShieldCheck className="w-3.5 h-3.5 text-primary" />
        <span>Protected by Mercora Session Guard (1 Device Policy)</span>
      </div>
    </div>
  );
}
