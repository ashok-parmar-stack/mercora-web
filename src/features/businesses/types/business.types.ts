export type BusinessType =
  | 'Manufacturer'
  | 'Supplier'
  | 'Wholesaler'
  | 'Distributor'
  | 'Exporter'
  | 'Service Provider'
  | 'MSMEs';

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
  source: string;
  sourceId: string;
  lastUpdated: string;
  products: BusinessProduct[];
  reviews?: BusinessReview[];
}

export type ViewMode = 'card' | 'table';
export type SortOption = 'relevance' | 'rating' | 'reviews' | 'established';

export interface BusinessFiltersState {
  query: string;
  category: string;
  location: string;
  businessType: string;
  verifiedOnly: boolean;
  sortBy: SortOption;
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
