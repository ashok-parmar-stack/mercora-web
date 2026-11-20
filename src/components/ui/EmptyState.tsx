import React from "react";
import { Inbox } from "lucide-react";

export interface EmptyStateProps {
  /** Icon node — defaults to Inbox icon */
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  /** Optional call-to-action element (e.g. a Button) */
  action?: React.ReactNode;
  /** Controls the vertical padding of the container */
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZE_PADDING = {
  sm: "py-10",
  md: "py-16",
  lg: "py-24",
};

const ICON_SIZE = {
  sm: "w-8 h-8",
  md: "w-10 h-10",
  lg: "w-14 h-14",
};

const ICON_INNER = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-7 h-7",
};

/**
 * COM-04 · EmptyState
 *
 * Reusable empty / no-data state for tables, lists, panels, and drawers.
 * Extracted from the DataTable inline empty state so it can be used anywhere.
 *
 * Usage:
 * ```tsx
 * <EmptyState
 *   icon={<Users />}
 *   title="No Users Found"
 *   description="Create your first user to get started."
 *   action={<Button onClick={openCreate}>Add User</Button>}
 * />
 * ```
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title = "No records found",
  description = "There are no entries matching your current filters.",
  action,
  size = "md",
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center ${SIZE_PADDING[size]} ${className}`}
    >
      <div
        className={`${ICON_SIZE[size]} rounded-2xl bg-[var(--surface-hover)] flex items-center justify-center text-[var(--text-muted)] mb-3`}
      >
        {icon ?? <Inbox className={ICON_INNER[size]} />}
      </div>

      {title && (
        <h3 className="font-bold text-[var(--text-primary)] text-sm">{title}</h3>
      )}

      {description && (
        <p className="text-xs text-[var(--text-secondary)] leading-relaxed mt-1 max-w-xs">
          {description}
        </p>
      )}

      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};
