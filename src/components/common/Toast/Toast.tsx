"use client";

import React from "react";
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

export interface ToastProps {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}

/**
 * Linear-Inspired Floating Toast Notification
 * Elevated card with hairline border, high-contrast icon, and one-click dismiss.
 */
export const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-status-success shrink-0" />,
    error: <AlertCircle className="w-4 h-4 text-status-error shrink-0" />,
    warning: <AlertTriangle className="w-4 h-4 text-status-warning shrink-0" />,
    info: <Info className="w-4 h-4 text-status-info shrink-0" />,
  };

  const borders = {
    success: "border-status-success-border",
    error: "border-status-error-border",
    warning: "border-status-warning-border",
    info: "border-status-info-border",
  };

  return (
    <div
      role="alert"
      className={cn(
        "flex items-start gap-3 w-80 max-w-sm p-3.5 rounded-xl border bg-surface-raised shadow-xl",
        "animate-in fade-in-0 slide-in-from-bottom-2 duration-200 text-xs",
        borders[toast.type]
      )}
    >
      {icons[toast.type]}
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-text-primary leading-tight">{toast.title}</h4>
        {toast.message && <p className="text-text-secondary mt-0.5 leading-snug">{toast.message}</p>}
      </div>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        className="p-1 rounded-md text-text-muted hover:text-text-primary hover:bg-surface-hover cursor-pointer"
        aria-label="Dismiss toast"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export default Toast;
