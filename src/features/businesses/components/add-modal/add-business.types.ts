import {
  Factory,
  Layers,
  ShieldCheck,
  Building2,
  Truck,
  Wrench,
  Globe,
  Ship,
  Plane,
  Briefcase,
  FileCheck,
  Search,
  LucideIcon,
} from "lucide-react";

export interface AddBusinessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBusinessCreated?: () => void;
}

export interface ProductItem {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  description: string;
}

export const CATEGORY_ICON_LOOKUP: Record<string, LucideIcon> = {
  export: Globe,
  importer: Ship,
  logistics: Truck,
  "freight-forwarder": Plane,
  manufacture: Factory,
  wholesaler: Building2,
  "trading-company": Briefcase,
  "customs-broker": FileCheck,
  "service-provider": Wrench,
  "sourcing-agent": Search,
  // Defaults
  ShieldCheck: ShieldCheck,
  Globe: Globe,
  Ship: Ship,
  Truck: Truck,
  Plane: Plane,
  Factory: Factory,
  Building2: Building2,
  Briefcase: Briefcase,
  FileCheck: FileCheck,
  Wrench: Wrench,
  Layers: Layers,
};

export const COMMON_CATEGORIES = [
  "Industrial Machinery",
  "Textiles & Fabrics",
  "Ceramics & Tiles",
  "Pharmaceuticals",
  "Renewable Energy",
  "Chemicals & Petrochemicals",
  "Metals & Engineering",
  "Electronics & Electrical",
  "Food & Agriculture",
  "Packaging & Plastics",
];
