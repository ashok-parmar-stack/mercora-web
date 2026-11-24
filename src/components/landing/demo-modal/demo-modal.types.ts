export interface DemoRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialInterest?: string;
}

export interface FormErrors {
  fullName?: string;
  email?: string;
  company?: string;
  phoneNumber?: string;
}

export const COUNTRY_CODES = [
  { code: "+91", country: "India", flag: "🇮🇳" },
  { code: "+1", country: "USA / Canada", flag: "🇺🇸" },
  { code: "+44", country: "United Kingdom", flag: "🇬🇧" },
  { code: "+971", country: "United Arab Emirates", flag: "🇦🇪" },
  { code: "+65", country: "Singapore", flag: "🇸🇬" },
  { code: "+49", country: "Germany", flag: "🇩🇪" },
  { code: "+81", country: "Japan", flag: "🇯🇵" },
  { code: "+61", country: "Australia", flag: "🇦🇺" },
];

export const INTEREST_AREAS = [
  "HSN & Customs Tariff Engine",
  "8-Tier Geography Hierarchy",
  "Product Taxonomy & Category Tree",
  "Zero-Trust RBAC & Session Guard",
  "Full Deal OS Suite",
];
