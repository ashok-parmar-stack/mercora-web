'use client';

import React from 'react';

export interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

/**
 * Shimmering skeleton matching Mercora theme tokens.
 */
export function Skeleton({
  className = '',
  variant = 'rectangular',
  width,
  height,
}: SkeletonProps) {
  const variantStyles = {
    text: 'rounded-md h-4 w-full',
    circular: 'rounded-full',
    rectangular: 'rounded-xl',
  };

  return (
    <div
      aria-hidden="true"
      style={{ width, height }}
      className={`relative overflow-hidden bg-[var(--surface-hover)] before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer before:bg-gradient-to-r before:from-transparent before:via-white/20 dark:before:via-white/5 before:to-transparent ${variantStyles[variant]} ${className}`}
    />
  );
}

/* ── Pre-built Skeleton Card (Dashboard & Admin KPIs) ─────────────────────── */

export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div
      className={`p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-xs space-y-4 ${className}`}
    >
      <div className="flex items-center justify-between">
        <Skeleton variant="text" className="w-1/3 h-4" />
        <Skeleton variant="circular" className="w-8 h-8" />
      </div>
      <Skeleton variant="text" className="w-1/2 h-7" />
      <Skeleton variant="rectangular" className="w-full h-8" />
      <div className="flex gap-2 pt-2 border-t border-[var(--border)]">
        <Skeleton variant="text" className="w-1/4 h-3" />
        <Skeleton variant="text" className="w-1/4 h-3 ml-auto" />
      </div>
    </div>
  );
}

/* ── Pre-built Skeleton Table (Data Tables & Admin Management) ───────────── */

export function SkeletonTable({
  rows = 5,
  cols = 4,
  className = '',
}: {
  rows?: number;
  cols?: number;
  className?: string;
}) {
  return (
    <div className={`w-full bg-[var(--surface)] rounded-xl border border-[var(--border)] overflow-hidden shadow-xs ${className}`}>
      {/* Table Header Skeleton */}
      <div className="flex gap-4 p-4 bg-[var(--background-secondary)] border-b border-[var(--border)]">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={`head-${i}`} variant="text" className="flex-1 h-3.5" />
        ))}
      </div>
      {/* Table Rows */}
      {Array.from({ length: rows }).map((_, r) => (
        <div
          key={`row-${r}`}
          className="flex items-center gap-4 px-4 py-3.5 border-b border-[var(--border)] last:border-b-0"
        >
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton key={`cell-${r}-${c}`} variant="text" className="flex-1 h-3" />
          ))}
        </div>
      ))}
    </div>
  );
}
