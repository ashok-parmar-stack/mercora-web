"use client";

import React from "react";
import { LoadingSpinner } from "./LoadingSpinner";
import { cn } from "@/lib/utils";

export interface LoadingStateProps {
  message?: string;
  className?: string;
}

export function LoadingState({
  message = "Loading...",
  className = "",
}: LoadingStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-border bg-surface/50 backdrop-blur-xs",
        className
      )}
    >
      <LoadingSpinner size="lg" variant="primary" className="mb-3" />
      <p className="text-sm font-medium text-muted-foreground tracking-tight">
        {message}
      </p>
    </div>
  );
}

export default LoadingState;
