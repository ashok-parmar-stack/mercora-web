"use client";

import React from "react";
import { Sparkles } from "lucide-react";
import { Input, type InputProps } from "@/components/common/Input";
import { cn } from "@/lib/utils";

/**
 * Normalize any display string into a clean URL-safe slug (`[a-z0-9-]`).
 */
export function toSlugPreview(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export interface SlugFieldProps
  extends Omit<InputProps, "label" | "leftIcon" | "value" | "onChange"> {
  label?: string;
  prefix?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  autoSync?: boolean;
  onToggleAutoSync?: () => void;
  showAutoToggle?: boolean;
}

/**
 * Shared optional URL Slug input with consistent Auto Sync / Manual Edit toggle.
 * Leaving the field blank delegates unique slug generation to the backend.
 */
export const SlugField = React.forwardRef<HTMLInputElement, SlugFieldProps>(
  (
    {
      label = "URL Slug (Optional)",
      prefix = "/",
      placeholder = "auto-generated-if-left-blank",
      helperText = "Auto-generated if left blank, or customize manually.",
      autoSync,
      onToggleAutoSync,
      showAutoToggle = false,
      className,
      ...inputProps
    },
    ref
  ) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        <div className="flex items-center justify-between gap-2">
          <label className="text-[13px] font-medium text-foreground leading-tight select-none">
            {label}
          </label>
          {showAutoToggle && onToggleAutoSync && (
            <button
              type="button"
              onClick={onToggleAutoSync}
              className="text-[11px] font-bold text-primary hover:text-primary-hover cursor-pointer flex items-center gap-1 transition-colors"
            >
              <Sparkles className="w-3 h-3" />
              <span>{autoSync ? "Manual Edit" : "Auto Sync"}</span>
            </button>
          )}
        </div>
        <Input
          ref={ref}
          placeholder={placeholder}
          leftIcon={<span className="text-xs font-mono text-text-muted">{prefix}</span>}
          helperText={helperText}
          className={cn("font-mono", className)}
          {...inputProps}
        />
      </div>
    );
  }
);

SlugField.displayName = "SlugField";
