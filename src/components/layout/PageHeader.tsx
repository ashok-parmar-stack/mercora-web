"use client";

import React from "react";
import Link from "next/link";
import { Button } from "../ui/Button";
import { ArrowLeft } from "lucide-react";

export interface PageHeaderProps {
  title: string;
  description?: string;
  backHref?: string;
  actionButton?: {
    label: string;
    onClick?: () => void;
    href?: string;
    icon?: React.ReactNode;
    disabled?: boolean;
    variant?: "primary" | "secondary" | "outline" | "danger";
  };
  extraActions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  backHref,
  actionButton,
  extraActions,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-4 sm:pb-6 border-b border-[var(--border)]">
      <div className="flex items-start gap-2.5 sm:gap-3 min-w-0">
        {backHref && (
          <Link
            href={backHref}
            className="p-1.5 sm:p-2 -ml-1 sm:-ml-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] transition-colors flex-shrink-0"
            aria-label="Go back"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </Link>
        )}
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight truncate sm:whitespace-normal font-jakarta">
            {title}
          </h1>
          {description && (
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1 max-w-2xl font-normal leading-relaxed font-work">
              {description}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
        {extraActions}
        {actionButton &&
          (actionButton.href ? (
                <Button
                  variant={actionButton.variant || "primary"}
                  disabled={actionButton.disabled}
                  leftIcon={actionButton.icon}
                  asChild
                >
                  <Link href={actionButton.href}>
                    {actionButton.label}
              </Link>
    </Button>
  ) : (
    <Button
      variant={actionButton.variant || "primary"}
      onClick={actionButton.onClick}
      disabled={actionButton.disabled}
      leftIcon={actionButton.icon}
    >
      {actionButton.label}
    </Button>
  ))
}
      </div >
    </div >
  );
};
