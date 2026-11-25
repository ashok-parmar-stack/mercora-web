import {
  Home,
  Building2,
  Layers,
  MapPin,
  Info,
  LucideIcon,
} from "lucide-react";

export interface MobileNavItem {
  href: string;
  label: string;
  description: string;
  icon: LucideIcon;
}

export const PRIMARY_NAV_ITEMS: MobileNavItem[] = [
  {
    href: "/",
    label: "Home",
    description: "Platform overview & enterprise modules",
    icon: Home,
  },
  {
    href: "/businesses",
    label: "Businesses",
    description: "Verified manufacturers & trade suppliers",
    icon: Building2,
  },
  {
    href: "/categories",
    label: "Categories",
    description: "Industrial taxonomy & product sectors",
    icon: Layers,
  },
  {
    href: "/locations",
    label: "Locations",
    description: "Pan-India clusters & district directory",
    icon: MapPin,
  },
  {
    href: "/about",
    label: "About Mercora",
    description: "High-trust B2B trade & master data OS",
    icon: Info,
  },
];
