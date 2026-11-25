"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { APP_HEADERS } from "@/config/headers.config";

export function MainNavigation() {
  const pathname = usePathname();

  return (
    <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
      {APP_HEADERS.navigation.links.map((link) => {
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

export default MainNavigation;
