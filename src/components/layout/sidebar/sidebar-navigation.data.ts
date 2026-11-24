import {
  LayoutDashboard,
  Shield,
  Users,
  Key,
  Layers,
  Sparkles,
  Globe,
  MapPin,
  Map,
  Building2,
  Navigation,
  FolderTree,
  Hash,
  Package,
  FileText,
  Mail,
  LucideIcon,
} from "lucide-react";

export interface NavSingleItem {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
}

export interface NavGroupItem {
  label: string;
  icon: LucideIcon;
  id: string;
  children: Array<{
    href: string;
    label: string;
    icon: LucideIcon;
    badge?: string;
  }>;
}

export type NavEntry = NavSingleItem | NavGroupItem;

export interface NavSection {
  label: string;
  items: NavEntry[];
}

export function isGroupItem(item: NavEntry): item is NavGroupItem {
  return "children" in item;
}

/**
 * Functional Admin Navigation Sections
 * Grouped logically with Overview / Dashboard as the primary landing item.
 */
export const ADMIN_NAV_SECTIONS: NavSection[] = [
  {
    label: "Overview",
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Access & Security",
    items: [
      { href: "/admin/roles", label: "Roles & RBAC", icon: Shield },
      { href: "/admin/users", label: "Users & UBAC", icon: Users },
      { href: "/admin/permissions", label: "Permissions", icon: Key },
      { href: "/admin/statuses", label: "Status Management", icon: Layers },
      { href: "/admin/audit-logs", label: "Audit Logs", icon: FileText },
    ],
  },
  {
    label: "Master Data",
    items: [
      {
        id: "catalog-master",
        label: "Catalog Master",
        icon: Package,
        children: [
          { href: "/admin/categories", label: "Product Categories", icon: FolderTree },
          { href: "/admin/hsn-codes", label: "HSN Code Master", icon: Hash },
        ],
      },
      {
        id: "geographic-master",
        label: "Geographic Master",
        icon: Globe,
        children: [
          { href: "/admin/countries", label: "Countries Master", icon: MapPin },
          { href: "/admin/states", label: "States & UTs", icon: Map },
          { href: "/admin/districts", label: "Districts Master", icon: Building2 },
          { href: "/admin/sub-districts", label: "Sub-districts (Tehsils)", icon: Navigation },
        ],
      },
    ],
  },
  {
    label: "Communications",
    items: [
      { href: "/admin/email-templates", label: "Email Templates", icon: Mail },
    ],
  },
];
