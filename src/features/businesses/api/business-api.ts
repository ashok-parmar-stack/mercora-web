import { Business, EnquirySubmission } from "../types/business.types";

const getApiEndpoint = (endpoint: string) => {
  const cleanEndpoint = endpoint.replace(/^\//, "");
  if (typeof window !== "undefined") {
    return `/api/${cleanEndpoint}`;
  }
  const rawBase = process.env.INTERNAL_BACKEND_URL || "http://127.0.0.1:5001";
  const cleanBase = rawBase.replace(/\/api\/?$/, "");
  return `${cleanBase}/api/${cleanEndpoint}`;
};

export interface GetBusinessesParams {
  query?: string;
  category?: string;
  state?: string;
  city?: string;
  businessType?: string;
  verifiedOnly?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
}

export interface GetBusinessesResponse {
  data: Business[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function fetchBusinesses(params: GetBusinessesParams = {}): Promise<GetBusinessesResponse> {
  const query = new URLSearchParams();
  if (params.query) query.set("query", params.query);
  if (params.category && params.category !== "all") query.set("category", params.category);
  if (params.state) query.set("state", params.state);
  if (params.city) query.set("city", params.city);
  if (params.businessType && params.businessType !== "all") query.set("businessType", params.businessType);
  if (params.verifiedOnly) query.set("verifiedOnly", "true");
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.sortBy) query.set("sortBy", params.sortBy);

  try {
    const res = await fetch(`${getApiEndpoint("businesses")}?${query.toString()}`, {
      cache: "no-store",
    });

    if (res.ok) {
      const json = await res.json();
      return {
        data: json.data || [],
        total: json.total ?? json.totalCount ?? json.data?.length ?? 0,
        page: json.page || params.page || 1,
        limit: json.limit || params.limit || 12,
        totalPages: json.totalPages || Math.ceil((json.total ?? json.data?.length ?? 0) / (params.limit || 12)) || 1,
      };
    }

    const errJson = await res.json().catch(() => null);
    throw new Error(errJson?.message || `Failed to fetch businesses (HTTP ${res.status})`);
  } catch (err: any) {
    console.error("fetchBusinesses error:", err);
    throw new Error(err?.message || "Unable to connect to the business directory service. Please try again later.");
  }
}

export async function fetchBusinessBySlug(slug: string): Promise<Business | null> {
  if (!slug) return null;
  try {
    const res = await fetch(`${getApiEndpoint(`businesses/${encodeURIComponent(slug)}`)}`, {
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json();
      return data;
    }

    if (res.status === 404) {
      return null;
    }

    const errJson = await res.json().catch(() => null);
    throw new Error(errJson?.message || `Failed to fetch business details (HTTP ${res.status})`);
  } catch (err: any) {
    if (err?.message?.includes("404") || err?.message?.includes("not found")) {
      return null;
    }
    console.error(`fetchBusinessBySlug error for "${slug}":`, err);
    throw err;
  }
}

export async function submitEnquiry(enquiry: EnquirySubmission): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(`${getApiEndpoint("businesses/enquiries")}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(enquiry),
    });

    if (res.ok) {
      const json = await res.json().catch(() => ({}));
      return { success: true, message: json.message || "Enquiry sent successfully!" };
    }

    const errJson = await res.json().catch(() => null);
    throw new Error(errJson?.message || `Enquiry submission failed (HTTP ${res.status})`);
  } catch (err: any) {
    console.error("submitEnquiry error:", err);
    throw new Error(err?.message || "Unable to submit inquiry at this time. Please try again.");
  }
}
