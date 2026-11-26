import { HttpClientError, requestApi } from "@/lib/http/client";
import { Business } from "../types/business.types";
import { GetBusinessesParams, GetBusinessesResponse } from "./business-api";

export type AdminVerificationStatus = "Verified" | "Premium" | "Standard" | "Unverified";

function buildAdminQueryParams(params: GetBusinessesParams = {}): Record<string, string> {
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
  if (params.page) queryParams.page = String(params.page);
  if (params.limit) queryParams.limit = String(params.limit);
  if (params.sortBy) queryParams.sortBy = params.sortBy;
  return queryParams;
}

export async function fetchAdminBusinesses(
  params: GetBusinessesParams = {}
): Promise<GetBusinessesResponse> {
  const json = await requestApi<any>("admin/businesses", {
    method: "GET",
    params: buildAdminQueryParams(params),
    signal: params.signal,
  });

  const data: Business[] = json?.data || [];
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

export async function fetchAdminBusinessByIdOrSlug(
  idOrSlug: string,
  signal?: AbortSignal
): Promise<Business | null> {
  if (!idOrSlug) return null;
  try {
    return await requestApi<Business>(`businesses/${encodeURIComponent(idOrSlug)}`, {
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

export async function createAdminBusiness(
  payload: Record<string, unknown>
): Promise<Business> {
  return requestApi<Business>("admin/businesses", {
    method: "POST",
    data: payload,
  });
}

export async function updateAdminBusiness(
  id: string,
  payload: Record<string, unknown>
): Promise<Business> {
  return requestApi<Business>(`customer/businesses/${encodeURIComponent(id)}`, {
    method: "PUT",
    data: payload,
  });
}

export async function changeAdminBusinessStatus(
  id: string,
  status: AdminVerificationStatus
): Promise<Business> {
  return requestApi<Business>(`admin/businesses/${encodeURIComponent(id)}/status`, {
    method: "PATCH",
    data: { status },
  });
}

export async function deleteAdminBusiness(id: string): Promise<void> {
  await requestApi<void>(`admin/businesses/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}
