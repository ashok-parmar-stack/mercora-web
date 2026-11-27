"use client";

import React from "react";
import Link from "next/link";
import { Bookmark, ExternalLink, GitCompare, Trash2 } from "lucide-react";
import { Business } from "../../businesses/types/business.types";
import {
  EmptyState,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/common";
import { APP_MESSAGES } from "@/config/messages";

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
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="flex flex-col justify-between">
        <div>
          <SheetHeader className="pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-primary fill-current" />
              <SheetTitle className="font-bold text-slate-900 dark:text-white text-base">
                Saved Businesses ({savedBusinesses.length})
              </SheetTitle>
            </div>
          </SheetHeader>

          <div className="mt-4 overflow-y-auto max-h-[calc(100vh-12rem)] space-y-3 pr-1">
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
                  className="p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-800/40 flex items-center justify-between gap-3 shadow-2xs hover:border-red-500/40 transition-colors"
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
                      className="p-2 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
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

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
          {savedBusinesses.length >= 2 && (
            <Link
              href="/saved-businesses?compare=true"
              onClick={onClose}
              className="w-full py-2.5 px-4 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <GitCompare className="w-4 h-4" />
              <span>Compare Saved ({savedBusinesses.length})</span>
            </Link>
          )}
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Close Panel
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
