"use client";

import React from "react";
import Link from "next/link";
import { Button } from "../Button";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PageHeaderActionButton {
  label: string;
  onClick?: () => void;
  href?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

export interface PageHeaderProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  backHref?: string;
  badge?: React.ReactNode;
  actionButton?: PageHeaderActionButton;
  extraActions?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  backHref,
  badge,
  actionButton,
  extraActions,
  className,
  children,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-4 border-b border-border transition-colors",
        className
      )}
    >
      <div className="flex items-start gap-2.5 sm:gap-3 min-w-0">
        {backHref && (
          <Link
            href={backHref}
            className="p-1.5 sm:p-2 -ml-1 sm:-ml-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-hover border border-transparent hover:border-border transition-all flex-shrink-0"
            aria-label="Go back"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </Link>
        )}
        <div className="min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-foreground tracking-tight truncate sm:whitespace-normal font-sans">
              {title}
            </h1>
            {badge && <div className="flex-shrink-0">{badge}</div>}
          </div>
          {description && (
            <p className="text-xs sm:text-sm text-text-secondary mt-1 max-w-2xl font-normal leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 flex-wrap shrink-0">
        {extraActions}
        {actionButton &&
          (actionButton.href ? (
            <Button
              variant={actionButton.variant || "primary"}
              size={actionButton.size || "md"}
              disabled={actionButton.disabled}
              leftIcon={actionButton.icon}
              asChild
            >
              <Link href={actionButton.href}>{actionButton.label}</Link>
            </Button>
          ) : (
            <Button
              variant={actionButton.variant || "primary"}
              size={actionButton.size || "md"}
              onClick={actionButton.onClick}
              disabled={actionButton.disabled}
              leftIcon={actionButton.icon}
            >
              {actionButton.label}
            </Button>
          ))}
        {children}
      </div>
    </div>
  );
};

export default PageHeader;
