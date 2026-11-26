import { HttpClientError, requestApi } from "@/lib/http/client";
import { Business, BusinessFacets, EnquirySubmission } from "../types/business.types";

export interface GetBusinessesParams {
  query?: string;
  category?: string;
  location?: string;
  state?: string;
  city?: string;
  businessType?: string;
  verifiedOnly?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  signal?: AbortSignal;
}

export interface GetBusinessesResponse {
  data: Business[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

function buildBusinessQueryParams(
  params: GetBusinessesParams = {},
  includePagination = true
): Record<string, string> {
  const queryParams: Record<string, string> = {};
  if (params.query?.trim()) queryParams.query = params.query.trim();
  if (params.category && params.category !== "all") queryParams.category = params.category;
  if (params.location && params.location !== "all") queryParams.location = params.location;
  if (params.state && params.state !== "all") queryParams.state = params.state;
  if (params.city && params.city !== "all") queryParams.city = params.city;
  if (params.businessType && params.businessType !== "all") {
    queryParams.businessType = params.businessType;
  }
  if (params.verifiedOnly) queryParams.verifiedOnly = "true";
  if (includePagination) {
    if (params.page) queryParams.page = String(params.page);
    if (params.limit) queryParams.limit = String(params.limit);
    if (params.sortBy) queryParams.sortBy = params.sortBy;
  }
  return queryParams;
}

export async function fetchBusinesses(
  params: GetBusinessesParams = {}
): Promise<GetBusinessesResponse> {
  const queryParams = buildBusinessQueryParams(params, true);

  const json = await requestApi<any>("businesses", {
    method: "GET",
    params: queryParams,
    signal: params.signal,
  });

  const data = json?.data || [];
  const total = json?.total ?? json?.totalCount ?? data.length ?? 0;
  const limit = json?.limit || params.limit || 12;

  return {
    data,
    total,
    page: json?.page || params.page || 1,
    limit,
    totalPages: json?.totalPages || Math.ceil(total / limit) || 1,
  };
}

export async function fetchBusinessFacets(
  params: GetBusinessesParams = {}
): Promise<BusinessFacets> {
  const queryParams = buildBusinessQueryParams(params, false);
  return requestApi<BusinessFacets>("businesses/facets", {
    method: "GET",
    params: queryParams,
    signal: params.signal,
  });
}

export async function fetchBusinessBySlug(
  slug: string,
  signal?: AbortSignal
): Promise<Business | null> {
  if (!slug) return null;
  try {
    return await requestApi<Business>(`businesses/${encodeURIComponent(slug)}`, {
      method: "GET",
      signal,
    });
  } catch (err) {
    if (err instanceof HttpClientError && err.status === 404) {
      return null;
    }
    throw err;
  }
}

export async function submitEnquiry(
  enquiry: EnquirySubmission
): Promise<{ success: boolean; message: string }> {
  const requirementText = enquiry.requirement?.trim() || "";
  const formattedMessage = enquiry.productName
    ? `[Product: ${enquiry.productName}] ${requirementText}`
    : requirementText;

  const payload = {
    businessId: enquiry.businessId,
    businessName: enquiry.businessName || undefined,
    name: enquiry.name.trim(),
    phone: enquiry.phone.trim(),
    email: enquiry.email?.trim() || undefined,
    company: enquiry.company?.trim() || undefined,
    message: formattedMessage,
    source: "DIRECTORY_RFQ",
  };

  const json = await requestApi<any>("businesses/enquiries", {
    method: "POST",
    data: payload,
  });
  return {
    success: true,
    message: json?.message || "Enquiry sent successfully!",
  };
}

export async function createBusiness(
  data: Partial<Business> | Record<string, unknown>
): Promise<{ success: boolean; data: Business }> {
  try {
    const json = await requestApi<Business>("businesses", {
      method: "POST",
      data,
    });
    return { success: true, data: json };
  } catch (err) {
    if (err instanceof HttpClientError && err.status === 401) {
      throw new Error("Please sign in to register or create a business profile.");
    }
    throw err;
  }
}
