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
        "relative overflow-hidden bg-surface-hover/70",
        "before:absolute before:inset-0 before:-translate-x-full",
        "before:animate-shimmer before:bg-gradient-to-r before:from-transparent before:via-white/20 dark:before:via-white/5 before:to-transparent",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}

export function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div className={cn("p-5 rounded-xl border border-border bg-surface shadow-xs space-y-4", className)}>
      <div className="flex items-center justify-between">
        <Skeleton variant="text" className="w-1/3 h-4" />
        <Skeleton variant="circular" className="w-7 h-7" />
      </div>
      <Skeleton variant="text" className="w-1/2 h-6" />
      <Skeleton variant="rectangular" className="w-full h-8" />
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 4, className = "" }: { rows?: number; cols?: number; className?: string }) {
  return (
    <div className={cn("w-full bg-surface rounded-xl border border-border overflow-hidden shadow-xs", className)}>
      <div className="flex gap-4 p-4 bg-background-secondary border-b border-border">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={`head-${i}`} variant="text" className="flex-1 h-3.5" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={`row-${r}`} className="flex items-center gap-4 px-4 py-3 border-b border-border last:border-b-0">
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton key={`cell-${r}-${c}`} variant="text" className="flex-1 h-3" />
          ))}
        </div>
      ))}
    </div>
  );
}

export default Skeleton;
