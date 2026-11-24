import React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
}

/**
 * Linear-Inspired Input Component
 * Dense 36px height (h-9), subtle hairline borders, and calibrated focus states.
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error,
      leftIcon,
      className = "",
      id,
      onWheel,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    const handleWheel = (e: React.WheelEvent<HTMLInputElement>) => {
      if (props.type === "number") {
        e.currentTarget.blur();
      }
      onWheel?.(e);
    };

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-xs font-medium text-text-secondary select-none">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 pointer-events-none text-text-muted flex items-center">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            onWheel={handleWheel}
            className={cn(
              "w-full h-9 bg-surface border rounded-lg text-xs sm:text-sm text-text-primary placeholder:text-text-muted outline-none transition-all duration-150 focus:ring-1",
              error
                ? "border-destructive focus:border-destructive focus:ring-destructive/30"
                : "border-border hover:border-border-hover focus:border-primary focus:ring-primary/25",
              leftIcon ? "pl-9" : "pl-3",
              "pr-3 py-1.5 disabled:bg-background-secondary disabled:text-text-disabled disabled:cursor-not-allowed",
              className
            )}
            {...props}
          />
        </div>
        {error && <span className="text-[11px] text-destructive font-medium mt-0.5">{error}</span>}
        {!error && helperText && <span className="text-[11px] text-text-muted mt-0.5">{helperText}</span>}
      </div>
    );
  }
);
Input.displayName = "Input";
