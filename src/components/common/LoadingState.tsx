"use client";

import React from "react";
import { Loader2 } from "lucide-react";

export interface LoadingStateProps {
  message?: string;
  className?: string;
}

export function LoadingState({
  message = "Loading verified businesses...",
  className = "",
}: LoadingStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-12 text-center rounded-2xl bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm ${className}`}
    >
      <Loader2 className="w-8 h-8 text-red-600 animate-spin mb-3" />
      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
        {message}
      </p>
    </div>
  );
}
