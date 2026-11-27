"use client";

import React, { useEffect } from "react";
import { Sidebar } from "../../components/layout/Sidebar";
import { AdminHeader } from "../../components/layout/AdminHeader";
import { Breadcrumb } from "../../components/layout/Breadcrumb";
import { useUIStore } from "../../lib/store/ui-store";
import { useAuthStore } from "../../lib/store/auth-store";
import { v1HttpClient } from "../../lib/http/client";

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const isCollapsed = useUIStore((s) => s.isSidebarCollapsed);
  const { user, isAuthenticated, updateUser } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated || Array.isArray(user?.effectivePermissions)) {
      return;
    }
    const ctrl = new AbortController();
    v1HttpClient
      .get<{ user?: { effectivePermissions?: string[] } }>("/auth/me", {
        signal: ctrl.signal,
      })
      .then((res) => {
        const perms = res.data?.user?.effectivePermissions;
        if (Array.isArray(perms)) {
          updateUser({ effectivePermissions: perms });
        }
      })
      .catch(() => {
        // Non-fatal: server-side guards remain authoritative
      });
    return () => ctrl.abort();
  }, [isAuthenticated, user?.effectivePermissions, updateUser]);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)] font-sans antialiased flex flex-col transition-colors duration-200 overflow-x-hidden">
      {/* 1. Collapsible Enterprise Sidebar */}
      <Sidebar />

      {/* 2. Main Page Layout (Offset for Sidebar) */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${isCollapsed ? "lg:pl-16" : "lg:pl-64"
          }`}
      >
        {/* Top Navbar */}
        <AdminHeader />

        {/* Content Container */}
        <main className="flex-1 w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 flex flex-col gap-4 sm:gap-5 min-w-0">
          {/* Unified Breadcrumb Navigation */}
          <Breadcrumb />
          {children}
        </main>
      </div>
    </div>
  );
}
