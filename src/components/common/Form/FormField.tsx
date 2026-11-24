"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface FormFieldProps {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function FormField({
  label,
  error,
  helperText,
  required,
  className,
  children,
}: FormFieldProps) {
  return (
    <div className={cn("w-full flex flex-col gap-1.5", className)}>
      {label && (
        <div className="flex items-center gap-1">
          <span className="text-[13px] font-medium text-foreground leading-tight">
            {label}
          </span>
          {required && <span className="text-destructive font-bold">*</span>}
        </div>
      )}
      {children}
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
