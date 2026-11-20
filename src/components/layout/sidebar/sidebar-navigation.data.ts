import {
  Shield,
  Users,
  Key,
  Layers,
  Mail,
  History,
  Sparkles,
  Globe,
  MapPin,
  Map,
  Building2,
  Navigation,
  Building,
  Milestone,
  Home,
  FolderTree,
  Hash,
  Package,
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

export const ADMIN_NAV_SECTIONS: NavSection[] = [
  {
    label: "Access & Security",
    items: [
      { href: "/admin/roles", label: "Roles & RBAC", icon: Shield },
      { href: "/admin/users", label: "Users & UBAC", icon: Users },
      { href: "/admin/permissions", label: "Permissions", icon: Key },
      { href: "/admin/statuses", label: "Status Management", icon: Layers },
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
          { href: "/admin/hsn-sync", label: "HSN Sync Runs", icon: Sparkles },
        ],
      },
      {
        id: "geographic-master",
        label: "Geographic Master",
        icon: Globe,
        children: [
          { href: "/admin/geography", label: "Geo Dashboard", icon: Globe },
          { href: "/admin/countries", label: "Countries Master", icon: MapPin },
          { href: "/admin/states", label: "States & UTs", icon: Map },
          { href: "/admin/districts", label: "Districts Master", icon: Building2 },
          { href: "/admin/sub-districts", label: "Sub-districts (Tehsils)", icon: Navigation },
          { href: "/admin/cities", label: "Cities & Towns", icon: Building },
          { href: "/admin/localities", label: "Localities & Hubs", icon: Milestone },
          { href: "/admin/postal-codes", label: "Postal Codes (PIN)", icon: Home },
          { href: "/admin/post-offices", label: "Post Offices Master", icon: Mail },
        ],
      },
    ],
  },
  {
    label: "System & Compliance",
    items: [
      { href: "/admin/email-templates", label: "Email Notifications", icon: Mail },
      { href: "/admin/audit-logs", label: "Security Audit Logs", icon: History },
      { href: "/admin/storybook", label: "UI Design System", icon: Sparkles },
    ],
  },
];
