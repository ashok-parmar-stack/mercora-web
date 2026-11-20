import { PropertyItem, PropertyType, PropertyStatus } from './property.interface';

export interface SearchQueryParams {
  query?: string;
  propertyType?: PropertyType;
  status?: PropertyStatus;
  minPrice?: number;
  maxPrice?: number;
  minCapRate?: number;
  maxCapRate?: number;
  city?: string;
  state?: string;
  page?: number;
  limit?: number;
  sortBy?: 'price_asc' | 'price_desc' | 'cap_rate_desc' | 'score_desc' | 'relevance';
}

export interface SearchFacetBucket {
  key: string;
  docCount: number;
}

export interface SearchFacets {
  propertyTypes: SearchFacetBucket[];
  cities: SearchFacetBucket[];
  priceRanges: SearchFacetBucket[];
}

export interface SearchResultItem {
  item: PropertyItem;
  score: number;
  highlights?: Record<string, string[]>;
}

export interface SearchResponse {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  tookMs: number;
  source: 'elasticsearch' | 'database_fallback';
  results: SearchResultItem[];
  facets: SearchFacets;
}
