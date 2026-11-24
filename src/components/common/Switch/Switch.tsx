"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface SwitchProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  label?: React.ReactNode;
  description?: string;
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, label, description, id, disabled, checked, onChange, ...props }, ref) => {
    const autoId = id || (typeof label === "string" ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <label
        htmlFor={autoId}
        className={cn(
          "inline-flex items-start gap-3 select-none transition-opacity",
          disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
          className
        )}
      >
        <div className="relative flex items-center h-5">
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
              "w-8 h-4.5 rounded-full border border-border bg-secondary transition-colors duration-200",
              "peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-1",
              "peer-checked:bg-primary peer-checked:border-primary"
            )}
          >
            <div
              className={cn(
                "w-3.5 h-3.5 rounded-full bg-white shadow-xs transform transition-transform duration-200 mt-[1px] ml-[1px]",
                checked && "translate-x-3.5 bg-primary-foreground"
              )}
            />
          </div>
        </div>

        {(label || description) && (
          <div className="flex flex-col text-xs leading-tight">
            {label && <span className="font-medium text-foreground">{label}</span>}
            {description && <span className="text-muted-foreground mt-0.5">{description}</span>}
          </div>
        )}
      </label>
    );
  }
);

Switch.displayName = "Switch";
