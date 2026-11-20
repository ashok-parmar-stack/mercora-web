"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Bookmark, MessageSquare, User, LogOut } from "lucide-react";
import { APP_HEADERS } from "@/config/headers.config";

export function CustomerSidebar() {
  const pathname = usePathname();

  const links = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Saved Businesses", href: "/saved-businesses", icon: Bookmark },
    { label: "My Enquiries", href: "/enquiries", icon: MessageSquare },
    { label: "Profile", href: "/profile", icon: User },
  ];

  return (
    <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 min-h-[calc(100vh-4rem)] flex flex-col justify-between">
      <div className="space-y-6">
        <div className="px-3">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Customer Portal
          </h3>
        </div>

        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400 font-semibold"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
        <button
          type="button"
          onClick={() => {
            window.location.href = "/login";
          }}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-rose-600 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>{APP_HEADERS.navigation.auth.logout}</span>
        </button>
      </div>
    </aside>
  );
}
