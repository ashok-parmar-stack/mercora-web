import {
  Layers,
  Sparkles,
  Building2,
  CreditCard,
  LucideIcon,
} from "lucide-react";
import { APP_HEADERS } from "@/config/headers.config";

export interface MobileNavItem {
  href: string;
  label: string;
  description: string;
  icon: LucideIcon;
}

const ICON_BY_HREF: Record<string, LucideIcon> = {
  "/#platform": Layers,
  "/#how-it-works": Sparkles,
  "/businesses": Building2,
  "/pricing": CreditCard,
};

export const PRIMARY_NAV_ITEMS: MobileNavItem[] = APP_HEADERS.navigation.links.map(
  (link) => ({
    href: link.href,
    label: link.label,
    description: "",
    icon: ICON_BY_HREF[link.href] || Building2,
  })
);
