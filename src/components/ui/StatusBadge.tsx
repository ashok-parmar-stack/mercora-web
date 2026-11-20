import React from "react";

export type StatusValue =
  | "ACTIVE"
  | "INACTIVE"
  | "DELETED"
  | "PENDING"
  | "DRAFT"
  | "SUSPENDED"
  | "APPROVED"
  | "REJECTED"
  | string;

export interface StatusBadgeProps {
  status: StatusValue;
  /** Override the display label. Defaults to the status value, title-cased. */
  label?: string;
  size?: "xs" | "sm" | "md";
  className?: string;
}

const STATUS_CONFIG: Record<
  string,
  { dot: string; bg: string; text: string }
> = {
  ACTIVE: {
    dot: "bg-emerald-500",
    bg: "bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50",
    text: "text-emerald-700 dark:text-emerald-400",
  },
  INACTIVE: {
    dot: "bg-slate-400",
    bg: "bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50",
    text: "text-slate-600 dark:text-slate-400",
  },
  DELETED: {
    dot: "bg-rose-500",
    bg: "bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/50",
    text: "text-rose-700 dark:text-rose-400",
  },
  PENDING: {
    dot: "bg-amber-400",
    bg: "bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50",
    text: "text-amber-700 dark:text-amber-400",
  },
  DRAFT: {
    dot: "bg-slate-400",
    bg: "bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50",
    text: "text-slate-600 dark:text-slate-400",
  },
  SUSPENDED: {
    dot: "bg-orange-500",
    bg: "bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800/50",
    text: "text-orange-700 dark:text-orange-400",
  },
  APPROVED: {
    dot: "bg-emerald-500",
    bg: "bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50",
    text: "text-emerald-700 dark:text-emerald-400",
  },
  REJECTED: {
    dot: "bg-rose-500",
    bg: "bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/50",
    text: "text-rose-700 dark:text-rose-400",
  },
};

const FALLBACK_CONFIG = {
  dot: "bg-[var(--text-muted)]",
  bg: "bg-[var(--surface-hover)] border border-[var(--border)]",
  text: "text-[var(--text-secondary)]",
};

function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

const SIZE_CLASSES = {
  xs: "text-[10px] px-1.5 py-0.5 gap-1",
  sm: "text-xs px-2 py-0.5 gap-1.5",
  md: "text-xs px-2.5 py-1 gap-1.5",
};

const DOT_SIZE = {
  xs: "w-1 h-1",
  sm: "w-1.5 h-1.5",
  md: "w-1.5 h-1.5",
};

/**
 * COM-03 · StatusBadge
 *
 * Canonical badge for entity statuses across all admin pages.
 *
 * Usage:
 * ```tsx
 * <StatusBadge status={user.status?.code} />
 * <StatusBadge status="ACTIVE" label="Enabled" size="xs" />
 * ```
 */
export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  size = "sm",
  className = "",
}) => {
  const key = String(status || "").toUpperCase();
  const config = STATUS_CONFIG[key] || FALLBACK_CONFIG;
  const displayLabel = label || toTitleCase(status || "Unknown");

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full ${SIZE_CLASSES[size]} ${config.bg} ${config.text} ${className}`}
    >
      <span className={`rounded-full flex-shrink-0 ${DOT_SIZE[size]} ${config.dot}`} />
      {displayLabel}
    </span>
  );
};
