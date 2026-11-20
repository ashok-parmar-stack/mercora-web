"use client";

import React from "react";
import Link from "next/link";
import { LogOut } from "lucide-react";

interface SidebarUserFooterProps {
  user: any;
  isCollapsed: boolean;
  onLogout: () => void;
}

export function SidebarUserFooter({ user, isCollapsed, onLogout }: SidebarUserFooterProps) {
  const avatarInitials = user?.name ? user.name.slice(0, 2).toUpperCase() : "AP";

  if (isCollapsed) {
    return (
      <div className="flex flex-col items-center gap-1.5 py-1">
        <Link
          href="/admin/profile"
          className="w-9 h-9 rounded-xl overflow-hidden bg-brand-50 hover:bg-brand-100 text-brand-600 dark:bg-brand-950/40 dark:text-brand-400 flex items-center justify-center font-bold text-xs transition-transform hover:scale-105"
          title="Admin Profile Settings"
        >
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.name || "User Avatar"} className="w-full h-full object-cover" />
          ) : (
            avatarInitials
          )}
        </Link>
        <button
          type="button"
          onClick={onLogout}
          className="w-9 h-9 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center justify-center transition-colors cursor-pointer"
          title="Sign Out"
          aria-label="Sign Out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between p-2 rounded-xl bg-[var(--surface-hover)] border border-[var(--border)] group">
        <Link
          href="/admin/profile"
          className="flex items-center gap-2.5 min-w-0 flex-1 hover:opacity-85 transition-opacity"
          title="View Profile Settings"
        >
          <div className="w-8 h-8 rounded-lg overflow-hidden bg-slate-900 text-white font-extrabold flex items-center justify-center text-xs shadow-2xs flex-shrink-0 dark:bg-white dark:text-slate-900">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name || "User Avatar"} className="w-full h-full object-cover" />
            ) : (
              avatarInitials
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold text-[var(--text-primary)] truncate">
              {user?.name || "Ashok Parmar"}
            </span>
            <span className="text-[10px] text-[var(--text-muted)] truncate">
              {typeof user?.role === "object" ? user?.role?.name : user?.role || "Super Administrator"}
            </span>
          </div>
        </Link>
        <button
          type="button"
          onClick={onLogout}
          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors cursor-pointer flex-shrink-0"
          title="Sign Out"
          aria-label="Sign Out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center justify-between px-2 py-0.5 text-[10px] text-[var(--text-muted)]">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-gray-500 dark:text-gray-400">Admin Engine</span>
        </div>
        <span className="font-mono text-[9px] text-gray-400">v2.4 Online</span>
      </div>
    </>
  );
}
