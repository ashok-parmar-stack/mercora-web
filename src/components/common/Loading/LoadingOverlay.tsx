"use client";

import React from "react";
import { LoadingSpinner } from "./LoadingSpinner";
import { cn } from "@/lib/utils";

export interface LoadingOverlayProps {
  message?: string;
  fullScreen?: boolean;
  className?: string;
}

export function LoadingOverlay({
  message,
  fullScreen = false,
  className = "",
}: LoadingOverlayProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 z-50 bg-surface/70 backdrop-blur-xs transition-opacity duration-200",
        fullScreen ? "fixed inset-0" : "absolute inset-0 rounded-xl",
        className
      )}
    >
      <LoadingSpinner size="lg" variant="primary" />
      {message && (
        <p className="text-xs font-medium text-foreground tracking-tight select-none">
          {message}
        </p>
      )}
    </div>
  );
}

export default LoadingOverlay;
