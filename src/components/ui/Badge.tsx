import React from "react";
import { cn } from "@/lib/utils";

export type BadgeVariant =
  | "success"
  | "danger"
  | "warning"
  | "info"
  | "neutral"
  | "purple"
  | "brand"
  | "green"
  | "red"
  | "amber"
  | "blue"
  | "gray"
  | "destructive"
  | "secondary"
  | "primary"
  | "default"
  | "outline";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: "sm" | "md";
  dot?: boolean;
}

/**
 * Linear-Inspired Status Badge
 * Micro typography, hairline borders, alpha tint backgrounds, and optional status pulse dot.
 */
export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "neutral",
  size = "md",
  dot = false,
  className = "",
  ...props
}) => {
  const baseStyles = "inline-flex items-center font-medium tracking-tight rounded-md select-none transition-colors border";

  const sizeStyles = {
    sm: "text-[10px] px-1.5 py-0.5 gap-1 leading-none",
    md: "text-[11px] px-2 py-0.5 gap-1.5 leading-tight",
  };

  const normalizedVariant =
    variant === "green"
      ? "success"
      : variant === "red" || variant === "destructive"
        ? "danger"
        : variant === "amber"
          ? "warning"
          : variant === "blue"
            ? "info"
            : variant === "gray" || variant === "secondary" || variant === "outline"
              ? "neutral"
              : variant === "primary" || variant === "default"
                ? "brand"
                : variant;

  const variantStyles = {
    success: "bg-status-success-bg text-status-success border-status-success-border",
    danger: "bg-status-error-bg text-status-error border-status-error-border",
    warning: "bg-status-warning-bg text-status-warning border-status-warning-border",
    info: "bg-status-info-bg text-status-info border-status-info-border",
    neutral: "bg-secondary text-text-secondary border-border",
    purple: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    brand: "bg-primary-soft text-primary border-primary/20",
  };

  const dotColors = {
    success: "bg-status-success",
    danger: "bg-status-error",
    warning: "bg-status-warning",
    info: "bg-status-info",
    neutral: "bg-text-muted",
    purple: "bg-purple-500",
    brand: "bg-primary",
  };

  return (
    <span
      className={cn(
        baseStyles,
        sizeStyles[size],
        variantStyles[normalizedVariant as keyof typeof variantStyles] || variantStyles.neutral,
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            "w-1.5 h-1.5 rounded-full shrink-0",
            dotColors[normalizedVariant as keyof typeof dotColors] || dotColors.neutral
          )}
          aria-hidden="true"
        />
      )}
      <span>{children}</span>
    </span>
  );
};
