import React from "react";
import { FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

/**
 * Linear-Inspired Empty State Component
 * Subtle icon frame, crisp typography, and call-to-action button container.
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No results found",
  description = "Try adjusting your filters or search terms.",
  icon,
  action,
  className = "",
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border border-dashed border-border bg-surface/50",
        className
      )}
    >
      <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-surface-raised border border-border text-text-muted mb-4 shadow-2xs">
        {icon || <FolderOpen className="w-5 h-5 text-text-muted" />}
      </div>
      <h3 className="text-sm font-semibold text-text-primary tracking-tight mb-1">{title}</h3>
      {description && <p className="text-xs text-text-secondary max-w-sm mb-5 leading-relaxed">{description}</p>}
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
};

export default EmptyState;
