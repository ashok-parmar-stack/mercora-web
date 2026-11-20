import React from "react";

export interface SectionCardProps {
  /** Card heading */
  title?: string;
  /** Subtitle shown below the title */
  description?: string;
  /** Slot for actions/buttons in the card header row (aligned right) */
  headerActions?: React.ReactNode;
  /** Footer content — shown below a divider at the bottom of the card */
  footer?: React.ReactNode;
  /** Override card padding */
  padding?: "sm" | "md" | "lg" | "none";
  className?: string;
  children: React.ReactNode;
}

const PADDING_CLASSES = {
  none: "",
  sm: "p-4",
  md: "p-5 md:p-6",
  lg: "p-6 md:p-8",
};

/**
 * COM-05 · SectionCard
 *
 * Shared card shell for forms and detail panels.
 * Eliminates the repeated border/bg/shadow/padding shell across all pages.
 *
 * Usage:
 * ```tsx
 * <SectionCard title="User Details" description="Basic profile information">
 *   <FormField label="Name"><Input {...register("name")} /></FormField>
 * </SectionCard>
 *
 * <SectionCard
 *   title="Permissions"
 *   headerActions={<Button size="sm">Edit</Button>}
 *   footer={<p className="text-xs text-[var(--text-muted)]">Last updated 2 hours ago</p>}
 * >
 *   ...
 * </SectionCard>
 * ```
 */
export const SectionCard: React.FC<SectionCardProps> = ({
  title,
  description,
  headerActions,
  footer,
  padding = "md",
  className = "",
  children,
}) => {
  const hasHeader = title || description || headerActions;

  return (
    <div
      className={`bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-xs overflow-hidden ${className}`}
    >
      {/* Card Header */}
      {hasHeader && (
        <div className="flex items-start justify-between gap-4 px-5 md:px-6 py-4 border-b border-[var(--border)]">
          <div className="min-w-0">
            {title && (
              <h2 className="text-sm font-bold text-[var(--text-primary)] tracking-tight">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-xs text-[var(--text-secondary)] mt-0.5 leading-relaxed">
                {description}
              </p>
            )}
          </div>
          {headerActions && (
            <div className="flex items-center gap-2 flex-shrink-0">{headerActions}</div>
          )}
        </div>
      )}

      {/* Card Body */}
      <div className={PADDING_CLASSES[padding]}>{children}</div>

      {/* Card Footer */}
      {footer && (
        <div className="px-5 md:px-6 py-3.5 border-t border-[var(--border)] bg-[var(--background-secondary)]">
          {footer}
        </div>
      )}
    </div>
  );
};
