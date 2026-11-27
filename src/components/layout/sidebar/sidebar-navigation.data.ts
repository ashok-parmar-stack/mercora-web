import {
  LayoutDashboard,
  Shield,
  Users,
  Key,
  Layers,
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
  Briefcase,
  CreditCard,
  BarChart3,
  RotateCcw,
  Receipt,
  Crown,
  Sliders,
  ListChecks,
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
    label: "Directory",
    items: [
      { href: "/admin/businesses", label: "Businesses", icon: Briefcase },
    ],
  },
  {
    label: "Billing & Payments",
    items: [
      {
        id: "payments",
        label: "Payments",
        icon: CreditCard,
        children: [
          { href: "/admin/payments", label: "Overview", icon: BarChart3 },
          { href: "/admin/payments/transactions", label: "Transactions", icon: ListChecks },
          { href: "/admin/payments/invoices", label: "Invoices", icon: Receipt },
          { href: "/admin/payments/refunds", label: "Refunds", icon: RotateCcw },
        ],
      },
      {
        id: "subscriptions",
        label: "Subscriptions",
        icon: Crown,
        children: [
          { href: "/admin/payments/subscriptions", label: "Active Subscriptions", icon: Crown },
          { href: "/admin/payments/plans", label: "Subscription Plans", icon: Layers },
        ],
      },
      { href: "/admin/payments/settings", label: "Payment Settings", icon: Sliders },
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
          { href: "/admin/business-categories", label: "Business Categories", icon: Layers, badge: "Types" },
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
      { href: "/admin/pincodes", label: "Pincode Master", icon: Mail, badge: "Govt Sync" },
    ],
  },
  {
    label: "Communications",
    items: [
      { href: "/admin/email-templates", label: "Email Templates", icon: Mail },
    ],
  },
];
