import React from "react";

export function BusinessCardSkeleton() {
  return (
    <div className="flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm animate-pulse space-y-4">
      {/* Header skeleton */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-800" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
          <div className="h-3 bg-slate-100 dark:bg-slate-800/60 rounded w-1/2" />
        </div>
      </div>

      {/* Description skeleton */}
      <div className="space-y-2 py-1">
        <div className="h-3 bg-slate-100 dark:bg-slate-800/60 rounded w-full" />
        <div className="h-3 bg-slate-100 dark:bg-slate-800/60 rounded w-4/5" />
      </div>

      {/* Meta tags skeleton */}
      <div className="flex gap-2 pt-2">
        <div className="h-6 w-20 bg-slate-200 dark:bg-slate-800 rounded-full" />
        <div className="h-6 w-24 bg-slate-200 dark:bg-slate-800 rounded-full" />
      </div>

      {/* Footer skeleton */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="h-4 w-28 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="h-8 w-24 bg-slate-200 dark:bg-slate-800 rounded-xl" />
      </div>
    </div>
  );
}
