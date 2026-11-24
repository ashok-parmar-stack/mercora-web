"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  inputSize?: "sm" | "md" | "lg";
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      inputSize = "md",
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const autoId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    const sizeStyles = {
      sm: "h-8 text-xs px-2.5",
      md: "h-9 text-sm px-3",
      lg: "h-10 text-sm px-3.5",
    };

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

        <div className="relative flex items-center w-full">
          {leftIcon && (
            <div className="absolute left-3 flex items-center pointer-events-none text-muted-foreground">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={autoId}
            disabled={disabled}
            className={cn(
              "w-full rounded-lg border border-border bg-surface text-foreground placeholder:text-muted-foreground",
              "transition-colors duration-150 outline-none",
              "focus:border-border-focus focus:ring-1 focus:ring-ring",
              "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-surface-hover",
              sizeStyles[inputSize],
              leftIcon && "pl-9",
              rightIcon && "pr-9",
              error && "border-destructive focus:border-destructive focus:ring-destructive",
              className
            )}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3 flex items-center pointer-events-none text-muted-foreground">
              {rightIcon}
            </div>
          )}
        </div>

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

Input.displayName = "Input";
