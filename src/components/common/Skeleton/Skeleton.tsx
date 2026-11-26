"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
}

/**
 * Linear-Inspired Shimmer Skeleton Component
 * High-craft shimmer wave matching theme tokens.
 */
export function Skeleton({
  variant = "rectangular",
  width,
  height,
  className,
  style,
  ...props
}: SkeletonProps) {
  const variantStyles = {
    text: "h-3.5 w-full rounded-md",
    circular: "rounded-full",
    rectangular: "rounded-lg",
  };

  return (
    <div
      aria-hidden="true"
      style={{ width, height, ...style }}
      className={cn(
        "relative overflow-hidden bg-[#EAE1E4] dark:bg-white/10 animate-pulse",
        "before:absolute before:inset-0 before:-translate-x-full",
        "before:animate-shimmer before:bg-gradient-to-r before:from-transparent before:via-white/40 dark:before:via-white/10 before:to-transparent",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}

export function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div className={cn("p-4 rounded-xl border border-border bg-surface shadow-2xs flex items-center justify-between gap-3", className)}>
      <div className="space-y-2.5 flex-1">
        <Skeleton variant="text" className="w-24 h-3.5" />
        <Skeleton variant="text" className="w-16 h-7" />
      </div>
      <Skeleton variant="rectangular" className="w-10 h-10 rounded-xl shrink-0" />
    </div>
  );
}

export function SkeletonTable({ rows = 6, cols = 5, className = "" }: { rows?: number; cols?: number; className?: string }) {
  return (
    <div className={cn("w-full bg-surface rounded-xl border border-border overflow-hidden shadow-2xs", className)}>
      <div className="flex gap-4 px-4 py-3.5 bg-background-secondary border-b border-border">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={`head-${i}`} variant="text" className="flex-1 h-3.5" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={`row-${r}`} className="flex items-center gap-4 px-4 py-3.5 border-b border-border last:border-b-0">
          <div className="flex items-center gap-3 flex-[1.4]">
            <Skeleton variant="rectangular" className="w-9 h-9 rounded-lg shrink-0" />
            <div className="space-y-1.5 flex-1">
              <Skeleton variant="text" className="w-3/4 h-3.5" />
              <Skeleton variant="text" className="w-1/2 h-2.5" />
            </div>
          </div>
          {Array.from({ length: Math.max(1, cols - 1) }).map((_, c) => (
            <Skeleton key={`cell-${r}-${c}`} variant="text" className="flex-1 h-3.5" />
          ))}
        </div>
      ))}
    </div>
  );
}

export default Skeleton;
