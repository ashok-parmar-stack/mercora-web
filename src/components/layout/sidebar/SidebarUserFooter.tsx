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
      <div className="flex flex-col items-center gap-2 py-1">
        <Link
          href="/admin/profile"
          className="relative w-9 h-9 rounded-xl overflow-hidden bg-gradient-to-br from-brand-500 to-brand-700 text-white flex items-center justify-center font-bold text-xs shadow-xs transition-transform hover:scale-105"
          title="Admin Profile Settings"
        >
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.name || "User Avatar"} className="w-full h-full object-cover" />
          ) : (
            avatarInitials
          )}
          <div className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900 absolute -bottom-0.5 -right-0.5" />
        </Link>
        <button
          type="button"
          onClick={onLogout}
          className="w-9 h-9 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center justify-center transition-colors cursor-pointer"
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
      <div className="flex items-center justify-between p-2 rounded-xl bg-surface border border-border hover:border-border-focus/40 shadow-xs transition-all group">
        <Link
          href="/admin/profile"
          className="flex items-center gap-2.5 min-w-0 flex-1 hover:opacity-90 transition-opacity"
          title="View Profile Settings"
        >
          <div className="relative flex-shrink-0">
            <div className="w-8 h-8 rounded-lg overflow-hidden bg-primary text-white font-bold flex items-center justify-center text-xs shadow-xs">
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name || "User Avatar"} className="w-full h-full object-cover" />
              ) : (
                avatarInitials
              )}
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-surface absolute -bottom-0.5 -right-0.5" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-semibold text-text-primary truncate">
              {user?.name || "Ashok Parmar"}
            </span>
            <span className="text-[10px] font-medium text-text-muted truncate">
              {typeof user?.role === "object" ? user?.role?.name : user?.role || "Super Administrator"}
            </span>
          </div>
        </Link>
        <button
          type="button"
          onClick={onLogout}
          className="p-1.5 text-text-muted hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors cursor-pointer flex-shrink-0"
          title="Sign Out"
          aria-label="Sign Out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center justify-between px-2.5 pt-0.5 text-[10px] text-slate-400 dark:text-slate-500 font-medium">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Admin Engine</span>
        </div>
        <span className="font-mono text-[9px] text-slate-400">v2.4 Online</span>
      </div>
    </>
  );
}
