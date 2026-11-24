"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  inputSize?: "sm" | "md" | "lg" | "xl";
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
    const autoId =
      id ||
      (typeof label === "string"
        ? label.toLowerCase().replace(/\s+/g, "-")
        : undefined);

    const sizeStyles = {
      sm: "h-9 text-xs px-2.5",
      md: "h-10 text-sm px-3",
      lg: "h-11 text-sm px-3.5",
      xl: "h-12 text-base px-4",
    };

    const handleWheel = (e: React.WheelEvent<HTMLInputElement>) => {
      if (props.type === "number") {
        e.currentTarget.blur();
      }
      props.onWheel?.(e);
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
            <div className="absolute left-3.5 flex items-center pointer-events-none text-muted-foreground">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={autoId}
            disabled={disabled}
            onWheel={handleWheel}
            className={cn(
              "w-full rounded-lg border border-border bg-surface text-foreground placeholder:text-muted-foreground shadow-2xs",
              "transition-colors duration-150 outline-none",
              "hover:border-border-hover focus:border-border-focus focus:ring-1 focus:ring-ring",
              "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-surface-hover",
              sizeStyles[inputSize],
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              error && "border-destructive focus:border-destructive focus:ring-destructive",
              className
            )}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3.5 flex items-center text-muted-foreground">
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
