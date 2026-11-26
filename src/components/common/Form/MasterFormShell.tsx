"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Save, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/common/Badge";
import { Button } from "@/components/common/Button";

export interface MasterFormShellProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  badgeLabel: string;
  error?: string | null;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  isSubmitting?: boolean;
  submitLabel: string;
  cancelHref?: string;
  onCancel?: () => void;
  statusSection?: {
    label: string;
    isActive: boolean;
    onToggle: () => void;
    activeDescription: string;
    inactiveDescription: string;
  };
  children: React.ReactNode;
}

/**
 * Shared layout chrome for Master Data entity forms (Countries, States, Districts, Sub-Districts, Categories).
 */
export function MasterFormShell({
  title,
  subtitle,
  badgeLabel,
  error,
  onSubmit,
  isSubmitting = false,
  submitLabel,
  cancelHref = "/admin",
  onCancel,
  statusSection,
  children,
}: MasterFormShellProps) {
  return (
    <div className="w-full flex flex-col gap-6">
      <div className="w-full bg-surface border border-border rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col gap-6">
        <div className="border-b border-border pb-4 flex items-center justify-between gap-3">
          <div>
            <h3 className="font-extrabold text-base text-foreground">{title}</h3>
            {subtitle && <p className="text-xs text-text-secondary mt-0.5">{subtitle}</p>}
          </div>
          <Badge variant="brand" size="sm">
            {badgeLabel}
          </Badge>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-6" noValidate>
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200 flex items-center gap-2.5">
              <ShieldAlert className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {children}

          {statusSection && (
            <div className="sm:col-span-2 flex flex-col gap-2 p-4 rounded-xl border border-border bg-surface-hover/50">
              <label className="text-xs font-bold text-foreground">{statusSection.label}</label>
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={statusSection.onToggle}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                      statusSection.isActive ? "bg-emerald-500" : "bg-gray-300 hover:bg-gray-400"
                    }`}
                    title={statusSection.isActive ? "Click to deactivate" : "Click to activate"}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                        statusSection.isActive ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                  <span
                    onClick={statusSection.onToggle}
                    className={`text-xs font-extrabold cursor-pointer select-none ${
                      statusSection.isActive ? "text-emerald-700" : "text-gray-500"
                    }`}
                  >
                    {statusSection.isActive ? "Active Status" : "Inactive Status"}
                  </span>
                </div>
                <div className="text-[11px] text-gray-500 font-medium">
                  {statusSection.isActive
                    ? statusSection.activeDescription
                    : statusSection.inactiveDescription}
                </div>
              </div>
            </div>
          )}

          <div className="border-t border-border pt-6 flex items-center justify-between gap-3">
            {onCancel ? (
              <Button type="button" variant="secondary" size="md" onClick={onCancel}>
                <ArrowLeft className="w-4 h-4" />
                <span>Cancel &amp; Return</span>
              </Button>
            ) : (
              <Button variant="secondary" size="md" asChild>
                <Link href={cancelHref}>
                  <ArrowLeft className="w-4 h-4" />
                  <span>Cancel &amp; Return</span>
                </Link>
              </Button>
            )}

            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isSubmitting}
              disabled={isSubmitting}
              leftIcon={<Save className="w-4 h-4" />}
            >
              {submitLabel}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
