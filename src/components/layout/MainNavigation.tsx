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
                ? "text-primary bg-primary/10 dark:bg-primary/20 font-semibold"
                : "text-text-secondary hover:text-text-primary hover:bg-surface-hover"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
