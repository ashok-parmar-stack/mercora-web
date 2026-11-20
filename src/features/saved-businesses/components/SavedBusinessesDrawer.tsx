"use client";

import React from "react";
import Link from "next/link";
import { X, Heart, ExternalLink, Trash2 } from "lucide-react";
import { Business } from "../../businesses/types/business.types";
import { EmptyState } from "@/components/common/EmptyState";
import { APP_MESSAGES } from "@/config/messages.config";

export interface SavedBusinessesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedBusinesses: Business[];
  onRemove: (businessId: string) => void;
}

export function SavedBusinessesDrawer({
  isOpen,
  onClose,
  savedBusinesses,
  onRemove,
}: SavedBusinessesDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm transition-opacity">
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-600 fill-current" />
              <h2 className="font-bold text-slate-900 dark:text-white text-base">
                Saved Businesses ({savedBusinesses.length})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-4 overflow-y-auto max-h-[calc(100vh-12rem)] space-y-3">
            {savedBusinesses.length === 0 ? (
              <EmptyState
                title={APP_MESSAGES.empty.noSavedBusinesses.title}
                description={APP_MESSAGES.empty.noSavedBusinesses.description}
                actionLabel={APP_MESSAGES.empty.noSavedBusinesses.actionLabel}
                onAction={onClose}
              />
            ) : (
              savedBusinesses.map((b) => (
                <div
                  key={b.id}
                  className="p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-800/40 flex items-center justify-between gap-3 shadow-2xs"
                >
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-red-600 dark:text-red-400 block truncate">
                      {b.businessType} · {b.category}
                    </span>
                    <Link
                      href={`/businesses/${b.slug}`}
                      onClick={onClose}
                      className="text-xs font-bold text-slate-900 dark:text-white hover:text-red-600 transition-colors block truncate"
                    >
                      {b.name}
                    </Link>
                    <span className="text-[11px] text-slate-400 block truncate">
                      {b.city}, {b.state}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Link
                      href={`/businesses/${b.slug}`}
                      onClick={onClose}
                      className="p-2 text-slate-500 hover:text-red-600 transition-colors"
                      title="View Profile"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => onRemove(b.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                      title="Remove Bookmark"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Close Panel
          </button>
        </div>
      </div>
    </div>
  );
}
