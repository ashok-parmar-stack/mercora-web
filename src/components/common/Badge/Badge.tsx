import React from "react";
import { cn } from "@/lib/utils";

export type BadgeVariant =
  | "default"
  | "brand"
  | "neutral"
  | "success"
  | "warning"
  | "danger"
  | "destructive"
  | "info"
  | "outline"
  | "purple";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: "sm" | "md";
  dot?: boolean;
}

/**
 * Linear-Inspired Micro Status Badge
 * Hairline borders, subtle alpha tints, precise letter-spacing, and optional status dot.
 */
export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "neutral",
  size = "md",
  dot = false,
  className = "",
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center font-medium tracking-tight rounded-md select-none transition-colors border";

  const sizeStyles = {
    sm: "text-[10px] px-1.5 py-0.5 gap-1 leading-none font-medium",
    md: "text-[11px] px-2 py-0.5 gap-1.5 leading-tight font-medium",
  };

  const variantStyles: Record<BadgeVariant, string> = {
    default: "bg-primary-soft text-primary border-primary/20",
    brand: "bg-primary-soft text-primary border-primary/20",
    neutral: "bg-secondary text-text-secondary border-border",
    success: "bg-status-success-bg text-status-success border-status-success-border",
    warning: "bg-status-warning-bg text-status-warning border-status-warning-border",
    danger: "bg-status-error-bg text-status-error border-status-error-border",
    destructive: "bg-status-error-bg text-status-error border-status-error-border",
    info: "bg-status-info-bg text-status-info border-status-info-border",
    outline: "bg-transparent text-text-secondary border-border",
    purple: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  };

  const dotColors: Record<BadgeVariant, string> = {
    default: "bg-primary",
    brand: "bg-primary",
    neutral: "bg-text-muted",
    success: "bg-status-success",
    warning: "bg-status-warning",
    danger: "bg-status-error",
    destructive: "bg-status-error",
    info: "bg-status-info",
    outline: "bg-text-muted",
    purple: "bg-purple-500",
  };

  return (
    <span
      className={cn(baseStyles, sizeStyles[size], variantStyles[variant] || variantStyles.neutral, className)}
      {...props}
    >
      {dot && (
        <span
          className={cn("w-1.5 h-1.5 rounded-full shrink-0", dotColors[variant] || dotColors.neutral)}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
};

export default Badge;
