'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/common';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App Router Caught Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background text-text-primary transition-colors">
      <div className="max-w-md w-full bg-surface rounded-2xl p-8 border border-border shadow-md text-center space-y-5">
        <div className="w-12 h-12 rounded-full bg-destructive/15 text-destructive flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-xl font-bold text-text-primary">Something went wrong</h2>
          <p className="text-sm text-text-secondary leading-relaxed">
            {error.message || 'An unexpected error occurred while loading this page.'}
          </p>
        </div>
        <div className="flex items-center justify-center gap-3">
          <Button type="button" variant="primary" size="md" onClick={() => reset()}>
            Try Again
          </Button>
          <Button variant="outline" size="md" asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
