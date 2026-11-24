"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, id, disabled, ...props }, ref) => {
    const autoId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={autoId}
            className="text-[13px] font-medium text-foreground leading-tight select-none"
          >
            {label}
          </label>
        )}

        <textarea
          ref={ref}
          id={autoId}
          disabled={disabled}
          className={cn(
            "flex min-h-[80px] w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground",
            "transition-colors duration-150 outline-none",
            "focus:border-border-focus focus:ring-1 focus:ring-ring",
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-surface-hover",
            error && "border-destructive focus:border-destructive focus:ring-destructive",
            className
          )}
          {...props}
        />

        {error && (
          <span className="text-xs text-destructive font-medium leading-none">
            {error}
          </span>
        )}
        {!error && helperText && (
          <span className="text-xs text-muted-foreground leading-none">
            {helperText}
          </span>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
