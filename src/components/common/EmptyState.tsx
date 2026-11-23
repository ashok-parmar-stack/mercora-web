"use client";

import React from "react";
import { FolderOpen, ArrowRight } from "lucide-react";
import { APP_MESSAGES } from "@/config/messages.config";
import { Button } from "@/components/ui/Button";

export interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title = APP_MESSAGES.empty.noBusinessesFound.title,
  description = APP_MESSAGES.empty.noBusinessesFound.description,
  actionLabel,
  onAction,
  icon,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 backdrop-blur-sm ${className}`}
    >
      <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center mb-4 shadow-inner">
        {icon || <FolderOpen className="w-8 h-8" />}
      </div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mb-6 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
          <Button
          type="button"
          variant="primary"
          size="md"
          onClick={onAction}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          {actionLabel}
    </Button>
  )
}
    </div >
  );
}
