"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  PanelLeftClose,
  PanelLeft,
  ExternalLink,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  Shield,
} from "lucide-react";
import { useUIStore } from "@/lib/store/ui-store";
import { useAuthStore } from "@/lib/store/auth-store";
import { getUserDisplayRole, getUserInitials } from "@/lib/auth-helpers";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import {
  Badge,
  DropdownMenu,
} from "@/components/common";

export function AdminHeader() {
  const router = useRouter();
  const isCollapsed = useUIStore((s) => s.isSidebarCollapsed);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const [mounted, setMounted] = useState(false);
  const { user, logout } = useAuthStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const roleLabel = getUserDisplayRole(user);

  const avatarInitials = getUserInitials(user?.name, "A");

  const handleLogout = async () => {
    try {
      const { logoutServerAction } = await import("@/app/actions/auth-actions");
      await logoutServerAction();
    } catch (e) {
      console.warn("Logout error:", e);
    } finally {
      try {
        const { logoutUser } = await import("@/lib/auth-api");
        await logoutUser();
      } catch (e) {
        logout();
      }
      window.location.replace("/login");
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 w-full border-b border-[var(--header-border)] bg-[var(--header-bg)] backdrop-blur-md transition-colors flex items-center justify-between px-4 sm:px-6 lg:pl-8 shadow-2xs">
      {/* Left: Sidebar Toggle & Console Workspace Indicator */}
      <div className="flex items-center gap-2.5">
        {/* Mobile Sidebar Toggle (Always accessible on mobile & tablet) */}
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label="Toggle navigation menu"
          className="lg:hidden h-9 w-9 flex items-center justify-center rounded-xl text-text-secondary hover:text-primary hover:bg-surface-hover border border-border transition-colors cursor-pointer shadow-2xs shrink-0"
        >
          <PanelLeft className="w-4 h-4 text-primary" />
        </button>

        {/* Console Workspace Indicator */}
        <div className="hidden sm:flex items-center gap-2 select-none">
          <span className="text-xs font-bold text-text-primary tracking-tight">
            Mercora
          </span>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20 uppercase tracking-wider">
            Console
          </span>
        </div>
      </div>

      {/* Right: Quick actions, Live directory shortcut, System Telemetry & Admin User */}
      <div className="flex items-center gap-3">
        {/* Shortcut to Live Directory */}
        <Link
          href="/businesses"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-surface-hover border border-border transition-colors shadow-2xs"
          title="Open Public Business Directory in new tab"
        >
          <span>Live Directory</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        {/* Telemetry pill */}
        <Badge variant="success" size="sm" dot className="hidden lg:inline-flex">
          Online
        </Badge>

        <ThemeToggle />

        {/* User Profile Dropdown Menu */}
        {mounted && (
          <div className="pl-1 border-l border-border">
            <DropdownMenu
              align="right"
              trigger={
                <div className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl hover:bg-surface-hover border border-transparent hover:border-border transition-all duration-150 cursor-pointer select-none group">
                  <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shadow-xs ring-1 ring-primary/20">
                    {avatarInitials}
                  </div>
                  <div className="hidden md:flex flex-col text-left">
                    <span className="text-xs font-bold text-text-primary max-w-[130px] truncate leading-tight group-hover:text-primary transition-colors">
                      {user?.name || "Admin Account"}
                    </span>
                    <span className="text-[10px] text-text-muted font-medium leading-tight">
                      {roleLabel}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-text-muted hidden sm:block group-hover:text-text-primary transition-colors" />
                </div>
              }
              className="w-56 p-1.5 rounded-2xl shadow-2xl border border-border bg-surface-raised"
            >
              {/* Clean non-redundant account email line (no duplicate avatar or name) */}
              <div className="px-3 py-2 text-[11px] text-muted-foreground truncate border-b border-border/60 mb-1">
                <span className="font-medium text-foreground">{user?.email || ""}</span>
              </div>

              {/* Action List */}
              <div className="flex flex-col gap-0.5">
                <button
                  type="button"
                  onClick={() => router.push("/admin/profile")}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-foreground hover:bg-surface-hover transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-surface flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 border border-border/60 transition-colors">
                      <Settings className="w-3.5 h-3.5" />
                    </div>
                    <span>Profile Settings</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-muted-foreground group-hover:translate-x-0.5 transition-all" />
                </button>

                <div className="my-1 h-px bg-border/60" />

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-destructive hover:bg-destructive/10 transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-destructive/10 text-destructive flex items-center justify-center border border-destructive/20 group-hover:bg-destructive/20 transition-colors">
                      <LogOut className="w-3.5 h-3.5" />
                    </div>
                    <span>Sign Out</span>
                  </div>
                </button>
              </div>
            </DropdownMenu>
          </div>
        )}
      </div>
    </header>
  );
}
