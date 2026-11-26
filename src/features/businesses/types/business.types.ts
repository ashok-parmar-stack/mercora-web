export type BusinessType =
  | 'Manufacturer'
  | 'Supplier'
  | 'Wholesaler'
  | 'Distributor'
  | 'Exporter'
  | 'Service Provider'
  | 'MSMEs'
  | (string & {});

export type VerificationTier = 'Verified' | 'Premium' | 'Standard';

export interface BusinessProduct {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  description?: string;
  priceRange?: string;
}

export interface BusinessReview {
  id: string;
  author: string;
  role: string;
  rating: number;
  date: string;
  content: string;
}

export interface Business {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  imageUrl: string;
  category: string;
  businessType: BusinessType;
  industry: string;
  city: string;
  state: string;
  pincode: string;
  description: string;
  fullOverview?: string;
  rating: number;
  reviewCount: number;
  establishedYear: number;
  employeeCount: string;
  annualTurnover?: string;
  ownershipType?: string;
  isVerified: boolean;
  tier: VerificationTier;
  phone: string;
  email: string;
  website: string;
  address: string;
  gstin: string;
  cin: string;
  source?: string;
  sourceId?: string;
  lastUpdated?: string;
  updatedAt?: string;
  createdAt?: string;
  products: BusinessProduct[];
  reviews?: BusinessReview[];
}

export type ViewMode = 'card' | 'table';
export type SortOption = 'relevance' | 'rating' | 'reviews' | 'established';

export interface BusinessFiltersState {
  query: string;
  category: string;
  location: string;
  city: string;
  businessType: string;
  verifiedOnly: boolean;
  sortBy: SortOption;
}

export interface BusinessFacetCategory {
  id: string;
  name: string;
  slug: string;
  code: string;
  icon?: string;
  displayOrder: number;
  businessCount: number;
}

export interface BusinessFacetOption {
  name: string;
  slug: string;
  state?: string;
  count: number;
}

export interface BusinessFacets {
  totalBusinesses: number;
  verifiedCount: number;
  unverifiedCount: number;
  businessCategories: BusinessFacetCategory[];
  locations: BusinessFacetOption[];
  cities: BusinessFacetOption[];
  masterCategories: BusinessFacetOption[];
}

export interface EnquirySubmission {
  businessId: string;
  businessName: string;
  name: string;
  phone: string;
  email?: string;
  company?: string;
  city?: string;
  requirement: string;
  productName?: string;
}
