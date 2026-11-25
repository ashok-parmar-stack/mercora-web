"use client";

import React from "react";
import { Header } from "@/components/layout/Header";
import { useSavedBusinesses } from "@/features/businesses/hooks/useSavedBusinesses";

export function CustomerPortalShell({ children }: { children: React.ReactNode }) {
  const { savedCount } = useSavedBusinesses();

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)] flex flex-col font-sans transition-colors">
      <Header savedCount={savedCount} />
      {children}
    </div>
  );
}
