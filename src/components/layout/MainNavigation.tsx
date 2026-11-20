"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { APP_HEADERS } from "@/config/headers.config";
import { useAuthStore } from "@/lib/store/auth-store";

export function MainNavigation() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isAuth = mounted && isAuthenticated;
  const links = isAuth
    ? [...APP_HEADERS.navigation.links, { label: "Dashboard", href: "/dashboard" }]
    : APP_HEADERS.navigation.links;

  return (
    <nav className="hidden md:flex items-center gap-1 lg:gap-2">
      {links.map((link) => {
        const isActive =
          link.href === "/"
            ? pathname === "/"
            : pathname.startsWith(link.href);

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? "text-red-600 dark:text-red-400 bg-red-50/80 dark:bg-red-950/40 font-semibold"
                : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
