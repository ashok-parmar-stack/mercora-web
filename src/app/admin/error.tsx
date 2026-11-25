'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';
import { Button } from '@/components/common';

export default function AdminErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[Admin Error Boundary]:', error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-surface rounded-2xl p-7 border border-border shadow-sm text-center space-y-5">
        <div className="w-12 h-12 rounded-full bg-destructive/15 text-destructive flex items-center justify-center mx-auto">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-lg font-bold text-text-primary">Admin Console Error</h2>
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
            {error.message || 'Unable to load this admin module. Your session or network request may need a retry.'}
          </p>
        </div>
        <div className="flex items-center justify-center gap-3">
          <Button type="button" variant="primary" size="sm" onClick={() => reset()}>
            Retry View
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin">Admin Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
