import { Factory, Layers, Shield, Building2, Truck, Wrench } from "lucide-react";

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

export const BUSINESS_TYPE_OPTIONS = [
  { name: "Distributor", icon: Truck },
  { name: "Exporter", icon: Shield },
  { name: "Manufacturer", icon: Factory },
  { name: "Seller / Supplier", icon: Layers },
  { name: "Service Provider", icon: Wrench },
  { name: "Wholesaler", icon: Building2 },
];

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
