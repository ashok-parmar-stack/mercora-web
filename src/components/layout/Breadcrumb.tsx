"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { useUIStore } from "../../lib/store/ui-store";

const ROUTE_LABELS: Record<string, string> = {
  admin: "Home",
  businesses: "Businesses",
  "business-categories": "Business Categories",
  categories: "Product Categories",
  pincodes: "PIN Code Master",
  locations: "Locations",
  "saved-businesses": "Saved Businesses",
  enquiries: "My Inquiries",
  "hsn-codes": "HSN Codes",
  users: "Users",
  roles: "Roles",
  permissions: "Permissions",
  statuses: "Status Management",
  "audit-logs": "Audit Logs",
  "email-templates": "Email Templates",
  countries: "Countries",
  states: "States",
  districts: "Districts",
  "sub-districts": "Sub-Districts",
  create: "Create",
  edit: "Edit",
  profile: "Profile",
  storybook: "Design System",
};

function isIdSegment(segment: string): boolean {
  if (!segment) return false;
  if (ROUTE_LABELS[segment.toLowerCase()]) return false;

  // Standard UUID: 8-4-4-4-12 hex
  const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  // Hex strings (MongoDB ObjectID 24 chars, or 32 chars)
  const hexRegex = /^[0-9a-fA-F]{24,32}$/;
  // Numeric ID
  const numericRegex = /^\d+$/;
  // CUID or NanoID
  const cuidRegex = /^c[a-z0-9]{20,}$/i;
  // Generic hyphenated UUID or long alphanumeric ID (>= 16 chars)
  const longHashRegex = /^[0-9a-zA-Z_-]{16,}$/;

  return (
    uuidRegex.test(segment) ||
    hexRegex.test(segment) ||
    numericRegex.test(segment) ||
    cuidRegex.test(segment) ||
    longHashRegex.test(segment)
  );
}

export const Breadcrumb: React.FC = () => {
  const pathname = usePathname();
  const customBreadcrumbs = useUIStore((s) => s.customBreadcrumbs);

  // If page provides dynamic custom breadcrumbs (e.g. multi-level category hierarchy)
  if (customBreadcrumbs && customBreadcrumbs.length > 0) {
    return (
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] font-medium overflow-x-auto py-1 px-2.5 rounded-lg bg-[var(--surface)] border border-[var(--border)] shadow-2xs w-fit max-w-full"
      >
        <Link
          href="/admin"
          className="flex items-center gap-1.5 text-[var(--text-secondary)] hover:text-primary font-semibold transition-colors flex-shrink-0"
        >
          <Home className="w-3.5 h-3.5 text-primary" />
          <span>Admin</span>
        </Link>

        {customBreadcrumbs.map((crumb, idx) => {
          const isLast = idx === customBreadcrumbs.length - 1;
          return (
            <React.Fragment key={crumb.label + idx}>
              <ChevronRight className="w-3 h-3 text-gray-400 dark:text-gray-500 flex-shrink-0" />
              {isLast || !crumb.href ? (
                <span className="text-[var(--text-primary)] font-bold truncate bg-[var(--surface-hover)] px-2 py-0.5 rounded-md">
                  {crumb.label}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className="text-[var(--text-secondary)] hover:text-brand-600 dark:hover:text-brand-400 transition-colors truncate"
                >
                  {crumb.label}
                </Link>
              )}
            </React.Fragment>
          );
        })}
      </nav>
    );
  }

  // Automatic path-based breadcrumb generation
  const segments = (pathname || "").split("/").filter(Boolean);

  // If on admin dashboard root ("/admin"), do not show breadcrumb unnecessarily
  if (segments.length <= 1) {
    return null;
  }

  const adminSubSegments = segments.slice(1);
  const items: { href: string; label: string }[] = [];
  let accumulatedPath = "/admin";

  for (let i = 0; i < adminSubSegments.length; i++) {
    const seg = adminSubSegments[i];
    accumulatedPath += `/${seg}`;

    if (isIdSegment(seg)) {
      // If the ID is NOT the last segment (e.g. followed by /edit or /permissions),
      // skip rendering the raw ID in the breadcrumb trail.
      if (i < adminSubSegments.length - 1) {
        continue;
      } else {
        // If the ID is the final segment (e.g. /admin/users/[id])
        const prevSeg = adminSubSegments[i - 1]?.toLowerCase();
        const label = prevSeg === "users" ? "User Profile" : "Details";
        items.push({ href: accumulatedPath, label });
      }
    } else {
      let label = ROUTE_LABELS[seg.toLowerCase()];
      if (!label) {
        label = seg
          .replace(/-/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());
      }
      items.push({ href: accumulatedPath, label });
    }
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] font-medium overflow-x-auto py-1 px-2.5 rounded-lg bg-[var(--surface)] border border-[var(--border)] shadow-2xs w-fit max-w-full"
    >
      <Link
        href="/admin"
        className="flex items-center gap-1.5 text-[var(--text-secondary)] hover:text-primary font-semibold transition-colors flex-shrink-0"
      >
        <Home className="w-3.5 h-3.5 text-primary" />
        <span>Admin</span>
      </Link>

      {items.map((seg, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <React.Fragment key={seg.href + idx}>
            <ChevronRight className="w-3 h-3 text-gray-400 dark:text-gray-500 flex-shrink-0" />
            {isLast ? (
              <span className="text-[var(--text-primary)] font-bold truncate bg-[var(--surface-hover)] px-2 py-0.5 rounded-md">
                {seg.label}
              </span>
            ) : (
              <Link
                href={seg.href}
                className="text-[var(--text-secondary)] hover:text-brand-600 dark:hover:text-brand-400 transition-colors truncate"
              >
                {seg.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
