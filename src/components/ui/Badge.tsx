import React from "react";

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

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "neutral",
  size = "md",
  dot = false,
  className = "",
  ...props
}) => {
  const baseStyles = "inline-flex items-center font-bold uppercase tracking-wider rounded-full";

  const sizeStyles = {
    sm: "text-[10px] px-2 py-0.5 gap-1",
    md: "text-xs px-2.5 py-1 gap-1.5",
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
    success: "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60",
    danger: "bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60",
    warning: "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60",
    info: "bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/60",
    neutral: "bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800/60 dark:text-slate-300 dark:border-slate-700/60",
    purple: "bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800/60",
    brand: "bg-brand-50 text-brand-700 border border-brand-200 dark:bg-brand-950/40 dark:text-brand-300 dark:border-brand-800/60",
  };

  const dotColors = {
    success: "bg-emerald-500",
    danger: "bg-rose-500",
    warning: "bg-amber-500",
    info: "bg-blue-500",
    neutral: "bg-slate-400",
    purple: "bg-purple-500",
    brand: "bg-brand-600",
  };

  return (
    <span
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[normalizedVariant]} ${className}`}
      {...props}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[normalizedVariant]}`} />}
      {children}
    </span>
  );
};
