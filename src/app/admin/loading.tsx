import React from 'react';
import { Skeleton, SkeletonCard, SkeletonTable } from '@/components/ui/Loading';

export default function AdminLoading() {
  return (
    <div className="w-full space-y-6">
      {/* Top Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#e3e3e3]">
        <div className="space-y-2">
          <Skeleton variant="text" className="w-48 h-6" />
          <Skeleton variant="text" className="w-72 h-3.5" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton variant="rectangular" className="w-28 h-9" />
          <Skeleton variant="rectangular" className="w-32 h-9" />
        </div>
      </div>

      {/* KPI Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <SkeletonCard key={`kpi-${idx}`} />
        ))}
      </div>

      {/* Table Skeleton */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <Skeleton variant="text" className="w-40 h-4" />
          <Skeleton variant="rectangular" className="w-32 h-7" />
        </div>
        <SkeletonTable rows={6} cols={5} />
      </div>
    </div>
  );
}
