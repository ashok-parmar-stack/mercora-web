'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth-store';
import { Loader2 } from 'lucide-react';

export function AuthRouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isLoading, initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/admin');
    }
  }, [isAuthenticated, isLoading, router]);

  // While checking or if already authenticated and redirecting, avoid flashing the auth form
  if (!isLoading && isAuthenticated) {
    return (
      <div className="w-full min-h-[300px] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-[#7F1D3F] animate-spin" />
        <p className="text-xs font-semibold text-[#765C67]">
          Redirecting to your dashboard...
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
