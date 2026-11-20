import React from 'react';
import Link from 'next/link';

export function LoginFormFooter() {
  return (
    <div className="mt-3.5 pt-3 text-center" style={{ borderTop: '1px solid var(--theme-warm-line)' }}>
      <p className="text-xs font-work" style={{ color: 'var(--theme-gray-500)' }}>
        Don&apos;t have an account?{' '}
        <Link
          href="/register"
          className="font-bold font-rethink transition-colors ml-1"
          style={{ color: 'var(--theme-red)' }}
        >
          Create a free account →
        </Link>
      </p>
    </div>
  );
}
