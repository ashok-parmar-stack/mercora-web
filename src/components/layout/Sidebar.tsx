"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo, LogoIcon } from "@/components/Logo";
import { ChevronLeft } from "lucide-react";
import { useUIStore } from "../../lib/store/ui-store";
import { useAuthStore } from "../../lib/store/auth-store";
import {
  ADMIN_NAV_SECTIONS,
  isGroupItem,
} from "./sidebar/sidebar-navigation.data";
import { SidebarGroupItem } from "./sidebar/SidebarGroupItem";
import { SidebarSingleItem } from "./sidebar/SidebarSingleItem";
import { SidebarUserFooter } from "./sidebar/SidebarUserFooter";

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const isCollapsed = useUIStore((s) => s.isSidebarCollapsed);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    "geographic-master": true,
    "catalog-master": true,
  });

  const toggleGroup = (groupId: string) => {
    setOpenGroups((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  const [hoveredGroup, setHoveredGroup] = useState<string | null>(null);
  const [pinnedGroup, setPinnedGroup] = useState<string | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleGroupMouseEnter = (id: string) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setHoveredGroup(id);
  };

  const handleGroupMouseLeave = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    if (pinnedGroup) return;
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredGroup(null);
    }, 350);
  };

  useEffect(() => {
    setHoveredGroup(null);
    setPinnedGroup(null);
  }, [pathname, isCollapsed]);

  const { user, logout } = useAuthStore();
  const addToast = useUIStore((s) => s.addToast);

  const handleLogout = async () => {
    try {
      addToast("info", "Signing out...", "Ending active session");
      const { logoutServerAction } = await import("@/app/actions/auth-actions");
      await logoutServerAction();
    } catch (e) {
      console.warn("Server action logout failed:", e);
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
    <>
      {isCollapsed && pinnedGroup && (
        <div
          className="fixed inset-0 z-30 bg-transparent cursor-default"
          onClick={() => {
            setPinnedGroup(null);
            setHoveredGroup(null);
          }}
          aria-hidden="true"
        />
      )}

      <aside
        id="admin-sidebar"
        aria-label="Admin Navigation Sidebar"
        className={`fixed top-0 bottom-0 left-0 z-40 bg-[var(--sidebar-bg,var(--surface))] text-[var(--text-secondary)] border-r border-[var(--sidebar-border,var(--border))] transition-all duration-300 flex flex-col select-none shadow-xs ${isCollapsed
            ? "-translate-x-full w-64 lg:translate-x-0 lg:w-16"
            : "translate-x-0 w-64"
          }`}
      >
        <div
          className={`h-16 flex items-center border-b border-[var(--sidebar-border,var(--border))] flex-shrink-0 bg-[var(--sidebar-bg,var(--surface))] px-3.5 ${isCollapsed ? "justify-center" : "justify-between"
            }`}
        >
          {isCollapsed ? (
            <button
              type="button"
              onClick={toggleSidebar}
              className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors mx-auto cursor-pointer"
              title="Expand sidebar"
              aria-label="Expand sidebar"
              aria-expanded={false}
              aria-controls="admin-sidebar"
            >
              <LogoIcon size={30} />
            </button>
          ) : (
            <div className="flex items-center justify-between w-full">
              <Link
                href="/admin"
                className="flex items-center gap-2 min-w-0"
                title="Mercora Admin Console"
              >
                <Logo height={24} className="max-w-[135px]" />
                <span className="px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider bg-red-50 text-red-600 border border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900 rounded flex-shrink-0">
                  Admin
                </span>
              </Link>
              <button
                type="button"
                onClick={toggleSidebar}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Collapse sidebar"
                aria-label="Collapse sidebar"
                aria-expanded={true}
                aria-controls="admin-sidebar"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <div className={`flex-1 ${isCollapsed ? "overflow-visible" : "overflow-y-auto"} py-4 px-2.5 flex flex-col gap-4`}>
          {ADMIN_NAV_SECTIONS.map((section, idx) => (
            <div key={idx} className="flex flex-col gap-1">
              {!isCollapsed && (
                <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-0.5">
                  {section.label}
                </div>
              )}

              {section.items.map((entry) => {
                if (isGroupItem(entry)) {
                  return (
                    <SidebarGroupItem
                      key={entry.id}
                      entry={entry}
                      pathname={pathname}
                      isCollapsed={isCollapsed}
                      isOpen={!!openGroups[entry.id]}
                      isHovered={hoveredGroup === entry.id}
                      isPinned={pinnedGroup === entry.id}
                      onToggleOpen={() => toggleGroup(entry.id)}
                      onMouseEnter={() => handleGroupMouseEnter(entry.id)}
                      onMouseLeave={handleGroupMouseLeave}
                      onPinClick={() => {
                        if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
                        setPinnedGroup((prev) => (prev === entry.id ? null : entry.id));
                        setHoveredGroup(entry.id);
                      }}
                      onChildClick={() => {
                        if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
                        setTimeout(() => {
                          setHoveredGroup(null);
                          setPinnedGroup(null);
                        }, 120);
                      }}
                    />
                  );
                }

                return (
                  <SidebarSingleItem
                    key={entry.href}
                    entry={entry}
                    pathname={pathname}
                    isCollapsed={isCollapsed}
                  />
                );
              })}
            </div>
          ))}
        </div>

        <div className="p-2 border-t border-[var(--border)] flex-shrink-0 bg-[var(--surface)] flex flex-col gap-2">
          <SidebarUserFooter
            user={user}
            isCollapsed={isCollapsed}
            onLogout={handleLogout}
          />
        </div>
      </aside>

      {!isCollapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden animate-in fade-in duration-200 backdrop-blur-xs"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};
