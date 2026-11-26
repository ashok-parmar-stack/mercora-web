import React from 'react';
import { Skeleton, SkeletonCard, SkeletonTable } from '@/components/common';

export default function AdminLoading() {
  return (
    <div className="w-full flex flex-col gap-6">
      {/* Top Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-border">
        <div className="space-y-2">
          <Skeleton variant="text" className="w-52 h-7" />
          <Skeleton variant="text" className="w-80 max-w-full h-4" />
        </div>
        <div className="flex items-center gap-2.5">
          <Skeleton variant="rectangular" className="w-28 h-10 rounded-lg" />
          <Skeleton variant="rectangular" className="w-10 h-10 rounded-lg" />
          <Skeleton variant="rectangular" className="w-36 h-10 rounded-lg" />
        </div>
      </div>

      {/* KPI Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <SkeletonCard key={`kpi-${idx}`} />
        ))}
      </div>

      {/* Filter Toolbar & Table Skeleton */}
      <div className="space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Skeleton variant="rectangular" className="w-64 h-9 rounded-lg" />
            <Skeleton variant="rectangular" className="w-36 h-9 rounded-lg" />
            <Skeleton variant="rectangular" className="w-40 h-9 rounded-lg" />
          </div>
          <Skeleton variant="rectangular" className="w-24 h-9 rounded-lg" />
        </div>
        <SkeletonTable rows={6} cols={5} />
      </div>
    </div>
  );
}
