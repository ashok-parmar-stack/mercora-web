export interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  companyName?: string;
  gstin?: string;
  city?: string;
  state?: string;
}

export interface CustomerStats {
  savedCount: number;
  inquiriesCount: number;
  quotesReceived: number;
}
