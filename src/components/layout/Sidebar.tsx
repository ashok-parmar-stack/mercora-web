"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo, LogoIcon } from "@/components/Logo";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
  const setSidebarCollapsed = useUIStore((s) => s.setSidebarCollapsed);

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  // Auto-collapse sidebar on mobile and tablet (< 1024px)
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== "undefined" && window.innerWidth < 1024) {
        setSidebarCollapsed(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setSidebarCollapsed]);

  // Close sidebar on mobile/tablet after navigating
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setSidebarCollapsed(true);
    }
  }, [pathname, setSidebarCollapsed]);

  const toggleGroup = (groupId: string) => {
    setOpenGroups((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  // Automatically ensure the group containing the active route is open
  useEffect(() => {
    ADMIN_NAV_SECTIONS.forEach((section) => {
      section.items.forEach((item) => {
        if (isGroupItem(item)) {
          const hasActiveChild = item.children.some(
            (c) => pathname === c.href || (c.href !== "/admin" && pathname?.startsWith(c.href))
          );
          if (hasActiveChild) {
            setOpenGroups((prev) => ({ ...prev, [item.id]: true }));
          }
        }
      });
    });
  }, [pathname]);

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
      {/* Mobile & Tablet backdrop scrim when sidebar is open */}
      {!isCollapsed && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={() => setSidebarCollapsed(true)}
          aria-label="Close sidebar backdrop"
        />
      )}

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
        className={`fixed top-0 bottom-0 left-0 z-40 bg-[var(--sidebar-bg,var(--surface))] text-[var(--text-secondary)] border-r border-[#E5D4DA] dark:border-white/10 shadow-[1px_0_0_0_#E5D4DA] dark:shadow-none transition-all duration-300 flex flex-col select-none ${
          isCollapsed
            ? "-translate-x-full w-64 lg:translate-x-0 lg:w-16"
            : "translate-x-0 w-64"
        }`}
      >
        <div
          className={`h-16 flex items-center border-b border-white/10 flex-shrink-0 bg-[var(--sidebar-bg,var(--surface))] px-4 ${
            isCollapsed ? "justify-center" : "justify-between"
          }`}
        >
          {isCollapsed ? (
            <Link
              href="/admin"
              className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/10 transition-colors mx-auto group"
              title="Mercora Admin"
              aria-label="Mercora Admin"
            >
              <LogoIcon size={30} dark={true} className="group-hover:scale-105 transition-transform" />
            </Link>
          ) : (
            <div className="flex items-center justify-between w-full">
              <Link
                href="/admin"
                className="flex items-center gap-2.5 min-w-0"
                title="Mercora Admin"
              >
                <Logo height={24} dark={true} className="max-w-[140px]" />
              </Link>
              <button
                type="button"
                onClick={toggleSidebar}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Collapse sidebar"
                aria-label="Collapse sidebar"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <div className={`flex-1 ${isCollapsed ? "overflow-visible" : "overflow-y-auto sidebar-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"} py-4 px-3 flex flex-col gap-5`}>
          {ADMIN_NAV_SECTIONS.map((section, idx) => (
            <div key={idx} className="flex flex-col gap-1">
              {!isCollapsed && (
                <div className="px-3 text-[10.5px] font-bold tracking-wider uppercase text-white/40 mb-1 select-none">
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

        <div className="p-2.5 border-t border-[var(--sidebar-border)] flex-shrink-0 bg-[var(--sidebar-bg)] flex flex-col gap-2">
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

export default Sidebar;
