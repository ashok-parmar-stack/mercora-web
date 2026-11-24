"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  PanelLeftClose,
  PanelLeft,
  ExternalLink,
  ShieldCheck,
  LogOut,
} from "lucide-react";
import { useUIStore } from "@/lib/store/ui-store";
import { useAuthStore } from "@/lib/store/auth-store";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Badge } from "@/components/ui/Badge";

export function AdminHeader() {
  const isCollapsed = useUIStore((s) => s.isSidebarCollapsed);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const [mounted, setMounted] = useState(false);
  const { user, logout } = useAuthStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const roleLabel =
    typeof user?.role === "object" && user.role !== null
      ? user.role.name || user.role.code
      : user?.role || "SUPER_ADMIN";

  return (
    <header className="sticky top-0 z-30 h-16 w-full border-b border-border bg-surface/95 backdrop-blur-md transition-colors flex items-center justify-between px-4 sm:px-6">
      {/* Left: Sidebar Toggle & Admin Console Badge */}
      <div className="flex items-center gap-3">
        {isCollapsed ? (
          <button
            type="button"
            onClick={toggleSidebar}
            aria-label="Expand sidebar"
            className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors cursor-pointer"
            title="Expand sidebar"
          >
            <PanelLeft className="w-5 h-5 text-primary" />
          </button>
        ) : (
          <button
            type="button"
            onClick={toggleSidebar}
            aria-label="Close mobile sidebar"
            className="lg:hidden p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors cursor-pointer"
            title="Close sidebar"
          >
            <PanelLeftClose className="w-5 h-5" />
          </button>
        )}

        <div className="flex items-center gap-2">
          <div className="h-4 w-px bg-border hidden sm:block" />
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-hover border border-border text-text-primary text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
            <span>Admin Console</span>
            <span className="text-text-muted hidden md:inline">· Control Plane</span>
          </div>
        </div>
      </div>

      {/* Right: Quick actions, Live directory shortcut, System Telemetry & Admin User */}
      <div className="flex items-center gap-3">
        {/* Shortcut to Live Directory */}
        <Link
          href="/businesses"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-surface-hover border border-border transition-colors"
          title="Open Public Business Directory in new tab"
        >
          <span>Live Directory</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        {/* Telemetry pill */}
        <Badge variant="success" size="sm" dot className="hidden lg:inline-flex">
          API Online
        </Badge>

        <ThemeToggle />

        {/* Admin profile & logout */}
        {mounted && (
          <div className="flex items-center gap-2 pl-1 border-l border-border">
            <Link
              href="/admin/profile"
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-surface-hover transition-colors"
              title="Admin Profile"
            >
              <div className="w-7 h-7 rounded-lg bg-primary text-white flex items-center justify-center text-xs font-bold shadow-xs">
                {user?.name ? user.name.slice(0, 2).toUpperCase() : "SA"}
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-semibold text-text-primary max-w-[120px] truncate leading-tight">
                  {user?.name || "System Admin"}
                </span>
                <span className="text-[10px] text-text-muted font-medium leading-tight">
                  {roleLabel}
                </span>
              </div>
            </Link>

            <button
              type="button"
              onClick={() => logout()}
              title="Sign Out"
              aria-label="Sign Out"
              className="p-2 text-text-muted hover:text-destructive hover:bg-surface-hover rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
