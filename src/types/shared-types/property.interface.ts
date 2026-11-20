export type PropertyStatus = 'active' | 'under_contract' | 'closed' | 'draft';
export type PropertyType = 'commercial' | 'industrial' | 'office' | 'multifamily' | 'retail' | 'land';

export interface PropertyItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  propertyType: PropertyType;
  status: PropertyStatus;
  price: number;
  askingPriceFormatted?: string;
  capRate: number;
  sqft: number;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  brokerName: string;
  brokerFirm: string;
  highlights: string[];
  dealThesis: string;
  verifiedFactsCount: number;
  score: number;
  citations: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreatePropertyDto {
  title: string;
  description: string;
  propertyType: PropertyType;
  price: number;
  capRate: number;
  sqft: number;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  brokerName: string;
  brokerFirm: string;
  highlights?: string[];
  dealThesis?: string;
}
