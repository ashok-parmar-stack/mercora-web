'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/common';

export default function PublicErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[Public Directory Error Boundary]:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 bg-background">
      <div className="max-w-md w-full bg-surface rounded-2xl p-8 border border-border shadow-xs text-center space-y-5">
        <div className="w-12 h-12 rounded-full bg-destructive/15 text-destructive flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-lg font-bold text-text-primary">Unable to load view</h2>
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
            {error.message || 'Something interrupted loading this directory page.'}
          </p>
        </div>
        <div className="flex items-center justify-center gap-3">
          <Button type="button" variant="primary" size="sm" onClick={() => reset()}>
            Reload Section
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/businesses">Explore Directory</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
