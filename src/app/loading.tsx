import React from 'react';
import { LogoLoader } from '@/components/ui/Loading';

export default function RootLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50/60 font-sans antialiased">
      <LogoLoader size="lg" dark={false} />
    </div>
  );
}
