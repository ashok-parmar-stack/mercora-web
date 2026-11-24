"use client";

import React from "react";
import { FolderOpen } from "lucide-react";
import { Button } from "../Button";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
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
  actionLabel,
  onAction,
  className = "",
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border border-dashed border-border bg-surface/50 text-foreground",
        className
      )}
    >
      <div className="w-14 h-14 rounded-2xl bg-secondary text-primary flex items-center justify-center mb-3.5 border border-border">
        {icon || <FolderOpen className="w-7 h-7" />}
      </div>
      <h3 className="text-base font-semibold text-foreground mb-1 tracking-tight">
        {title}
      </h3>
      {description && (
        <p className="text-xs text-muted-foreground max-w-sm mb-4 leading-relaxed">
          {description}
        </p>
      )}
      {action ? (
        action
      ) : actionLabel && onAction ? (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
};

export default EmptyState;
