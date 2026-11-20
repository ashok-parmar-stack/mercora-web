"use client";

import React from "react";
import { Button } from "../ui/Button";

export interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  actionButton?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
    disabled?: boolean;
    variant?: "primary" | "secondary" | "outline" | "danger";
  };
  extraActions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  eyebrow = "Access & Identity",
  title,
  description,
  actionButton,
  extraActions,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border)]">
      <div>
        <div className="flex items-center gap-2 text-brand-600 text-xs font-bold uppercase tracking-widest mb-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
          {eyebrow}
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-[var(--text-secondary)] mt-1 max-w-2xl font-normal leading-relaxed">
            {description}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        {extraActions}
        {actionButton && (
          <Button
            variant={actionButton.variant || "primary"}
            onClick={actionButton.onClick}
            disabled={actionButton.disabled}
            leftIcon={actionButton.icon}
          >
            {actionButton.label}
          </Button>
        )}
      </div>
    </div>
  );
};
