import React from "react";

export function BusinessCardSkeleton() {
  return (
    <div className="flex flex-col bg-surface rounded-2xl border border-border p-5 shadow-xs animate-pulse space-y-4">
      {/* Header skeleton */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-surface-hover" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-surface-hover rounded w-3/4" />
          <div className="h-3 bg-surface-hover/60 rounded w-1/2" />
        </div>
      </div>

      {/* Description skeleton */}
      <div className="space-y-2 py-1">
        <div className="h-3 bg-surface-hover/60 rounded w-full" />
        <div className="h-3 bg-surface-hover/60 rounded w-4/5" />
      </div>

      {/* Meta tags skeleton */}
      <div className="flex gap-2 pt-2">
        <div className="h-6 w-20 bg-surface-hover rounded-full" />
        <div className="h-6 w-24 bg-surface-hover rounded-full" />
      </div>

      {/* Footer skeleton */}
      <div className="pt-4 border-t border-border flex items-center justify-between">
        <div className="h-4 w-28 bg-surface-hover rounded" />
        <div className="h-8 w-24 bg-surface-hover rounded-xl" />
      </div>
    </div>
  );
}
