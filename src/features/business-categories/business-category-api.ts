import { requestApi } from "@/lib/http/client";
import {
  BusinessCategoryItem,
  CreateBusinessCategoryPayload,
  UpdateBusinessCategoryPayload,
} from "./types";

function mapBusinessCategory(item: any): BusinessCategoryItem {
  return {
    id: item.id || item.slug,
    name: item.name,
    code: item.code,
    slug: item.slug,
    type: item.type || item.slug,
    description: item.description,
    icon: item.icon,
    parentId: item.parentId || null,
    displayOrder: item.displayOrder ?? 0,
    status: item.status || "ACTIVE",
    isActive: item.isActiveStatus ?? item.isActive ?? item.status === "ACTIVE",
    businessCount: item.businessCount ?? 0,
  };
}

export async function fetchBusinessCategories(params?: {
  parentId?: string | null;
  status?: string;
  query?: string;
  signal?: AbortSignal;
}): Promise<BusinessCategoryItem[]> {
  const queryParams: Record<string, string> = {};
  if (params?.status) queryParams.status = params.status;
  if (params?.query) queryParams.query = params.query;
  if (params?.parentId) queryParams.parentId = params.parentId;

  const json = await requestApi<any>("business-categories", {
    method: "GET",
    params: queryParams,
    signal: params?.signal,
  });
  const rawList = Array.isArray(json) ? json : json?.data || [];
  return rawList.map(mapBusinessCategory);
}

export async function fetchBusinessCategoriesTree(
  signal?: AbortSignal
): Promise<BusinessCategoryItem[]> {
  const data = await requestApi<any>("business-categories/tree", {
    method: "GET",
    signal,
  });
  return Array.isArray(data) ? data : [];
}

export async function fetchAdminBusinessCategories(params?: {
  query?: string;
  status?: string;
  parentId?: string;
  page?: number;
  limit?: number;
  signal?: AbortSignal;
}): Promise<{ data: BusinessCategoryItem[]; total: number }> {
  const queryParams: Record<string, string | number> = {};
  if (params?.query) queryParams.query = params.query;
  if (params?.status && params.status !== "ALL") queryParams.status = params.status;
  if (params?.parentId) queryParams.parentId = params.parentId;
  if (params?.page) queryParams.page = params.page;
  if (params?.limit) queryParams.limit = params.limit;

  const json = await requestApi<any>("admin/business-categories", {
    method: "GET",
    params: queryParams,
    signal: params?.signal,
  });
  return {
    data: json?.data || [],
    total: json?.total || json?.data?.length || 0,
  };
}

export async function createBusinessCategory(
  payload: CreateBusinessCategoryPayload
): Promise<BusinessCategoryItem> {
  return requestApi<BusinessCategoryItem>("admin/business-categories", {
    method: "POST",
    data: payload,
  });
}

export async function updateBusinessCategory(
  id: string,
  payload: UpdateBusinessCategoryPayload
): Promise<BusinessCategoryItem> {
  return requestApi<BusinessCategoryItem>(
    `admin/business-categories/${encodeURIComponent(id)}`,
    {
      method: "PUT",
      data: payload,
    }
  );
}

export async function toggleBusinessCategoryStatus(
  id: string,
  isActive: boolean
): Promise<BusinessCategoryItem> {
  return requestApi<BusinessCategoryItem>(
    `admin/business-categories/${encodeURIComponent(id)}/status`,
    {
      method: "PATCH",
      data: { isActive },
    }
  );
}

export async function deleteBusinessCategory(id: string): Promise<void> {
  await requestApi<void>(
    `admin/business-categories/${encodeURIComponent(id)}`,
    { method: "DELETE" }
  );
}
