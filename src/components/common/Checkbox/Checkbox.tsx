"use client";

import React, { forwardRef } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  label?: React.ReactNode;
  description?: string;
  indeterminate?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, indeterminate, id, disabled, checked, onChange, ...props }, ref) => {
    const autoId = id || (typeof label === "string" ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <label
        htmlFor={autoId}
        className={cn(
          "inline-flex items-start gap-2.5 select-none transition-opacity",
          disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
          className
        )}
      >
        <div className="relative flex items-center justify-center h-5">
          <input
            ref={ref}
            id={autoId}
            type="checkbox"
            disabled={disabled}
            checked={checked}
            onChange={onChange}
            className="peer sr-only"
            {...props}
          />
          <div
            className={cn(
              "w-4 h-4 rounded border border-border bg-surface transition-all duration-150 flex items-center justify-center",
              "peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-1",
              "peer-checked:bg-primary peer-checked:border-primary peer-checked:text-primary-foreground",
              "peer-hover:border-border-hover"
            )}
          >
            {(checked || indeterminate) && (
              <Check className="w-3 h-3 stroke-[3]" />
            )}
          </div>
        </div>

        {(label || description) && (
          <div className="flex flex-col text-xs leading-tight pt-0.5">
            {label && <span className="font-medium text-foreground">{label}</span>}
            {description && <span className="text-muted-foreground mt-0.5">{description}</span>}
          </div>
        )}
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";
