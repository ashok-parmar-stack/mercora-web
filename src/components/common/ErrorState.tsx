"use client";

import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { APP_MESSAGES } from "@/config/messages.config";

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Failed to load data",
  message = APP_MESSAGES.errors.failedToLoadBusinesses,
  onRetry,
  className = "",
}: ErrorStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-10 text-center rounded-2xl border border-red-200 dark:border-red-900/40 bg-red-50/50 dark:bg-red-950/20 ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 flex items-center justify-center mb-4">
        <AlertCircle className="w-7 h-7" />
      </div>
      <h3 className="text-base font-semibold text-red-950 dark:text-red-200 mb-1">
        {title}
      </h3>
      <p className="text-sm text-red-700 dark:text-red-300 max-w-md mb-5">
        {message}
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 font-medium text-sm hover:bg-red-50 dark:hover:bg-slate-700/60 transition-all shadow-sm"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
}
