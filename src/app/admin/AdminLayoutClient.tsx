"use client";

import React from "react";
import { Sidebar } from "../../components/layout/Sidebar";
import { AdminHeader } from "../../components/layout/AdminHeader";
import { Breadcrumb } from "../../components/layout/Breadcrumb";
import { GlobalToasts } from "../../components/common/GlobalToasts";
import { useUIStore } from "../../lib/store/ui-store";

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const isCollapsed = useUIStore((s) => s.isSidebarCollapsed);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)] font-sans antialiased flex flex-col transition-colors duration-200 overflow-x-hidden">
      {/* 1. Collapsible Enterprise Sidebar */}
      <Sidebar />

      {/* 2. Main Page Layout (Offset for Sidebar) */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          isCollapsed ? "lg:pl-16" : "lg:pl-64"
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

      {/* 3. Global Toast Notifications */}
      <GlobalToasts />
    </div>
  );
}
