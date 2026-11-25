"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LoadingSpinnerProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  variant?: "primary" | "secondary" | "red" | "white" | "muted" | "current";
  className?: string;
  label?: string;
}

export function LoadingSpinner({
  size = "md",
  variant = "primary",
  className = "",
  label = "Loading...",
}: LoadingSpinnerProps) {
  const sizeMap = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-10 h-10",
  };

  const variantMap = {
    primary: "text-primary",
    secondary: "text-accent",
    red: "text-[var(--theme-red)]",
    white: "text-white",
    muted: "text-muted-foreground",
    current: "text-current",
  };

  return (
    <Loader2
      className={cn(
        "animate-spin stroke-[2.25]",
        sizeMap[size],
        variantMap[variant],
        className
      )}
      aria-label={label}
    />
  );
}

export default LoadingSpinner;
