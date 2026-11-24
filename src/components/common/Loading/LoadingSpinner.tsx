"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LoadingSpinnerProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  variant?: "primary" | "secondary" | "white" | "muted";
  className?: string;
}

export function LoadingSpinner({
  size = "md",
  variant = "primary",
  className = "",
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
    white: "text-white",
    muted: "text-muted-foreground",
  };

  return (
    <Loader2
      className={cn(
        "animate-spin stroke-[2.25]",
        sizeMap[size],
        variantMap[variant],
        className
      )}
      aria-label="Loading..."
    />
  );
}

export default LoadingSpinner;
