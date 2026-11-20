import {
  ProductCategory,
  CategoryTreeNode,
  CategoryBreadcrumbItem,
  CreateProductCategoryInput,
  UpdateProductCategoryInput,
  MoveProductCategoryInput,
  HsnCode,
  HsnTreeNode,
  CreateHsnCodeInput,
  UpdateHsnCodeInput,
  HsnCodeCategoryMapping,
  MasterSyncRun,
} from '@mercora/shared-types';
import { apiClient } from './admin-api';

const API_BASE = '/v1/admin';

export interface PaginatedResult<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CatalogApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

// ══════════════════════════════════════════════════════════════════════════════
// PRODUCT CATEGORIES API
// ══════════════════════════════════════════════════════════════════════════════

export async function fetchProductCategories(params?: {
  page?: number;
  limit?: number;
  search?: string;
  parent_id?: string;
  level?: number;
  roots_only?: boolean;
  status?: string;
  sort_by?: string;
  sort_order?: 'ASC' | 'DESC';
}): Promise<PaginatedResult<ProductCategory>> {
  const res = await apiClient.get<CatalogApiResponse<PaginatedResult<ProductCategory>>>(
    `${API_BASE}/product-categories`,
    { params },
  );
  return res.data.data;
}

export async function fetchCategoryTree(): Promise<CategoryTreeNode[]> {
  const res = await apiClient.get<CatalogApiResponse<CategoryTreeNode[]>>(
    `${API_BASE}/product-categories/tree`,
  );
  return res.data.data;
}

export async function fetchCategoryById(id: string): Promise<ProductCategory> {
  const res = await apiClient.get<CatalogApiResponse<ProductCategory>>(
    `${API_BASE}/product-categories/${id}`,
  );
  return res.data.data;
}

export async function fetchCategoryBreadcrumbs(id: string): Promise<CategoryBreadcrumbItem[]> {
  const res = await apiClient.get<CatalogApiResponse<CategoryBreadcrumbItem[]>>(
    `${API_BASE}/product-categories/${id}/path`,
  );
  return res.data.data;
}

export async function createProductCategory(
  payload: CreateProductCategoryInput,
): Promise<ProductCategory> {
  const res = await apiClient.post<CatalogApiResponse<ProductCategory>>(
    `${API_BASE}/product-categories`,
    payload,
  );
  return res.data.data;
}

export async function updateProductCategory(
  id: string,
  payload: UpdateProductCategoryInput,
): Promise<ProductCategory> {
  const res = await apiClient.patch<CatalogApiResponse<ProductCategory>>(
    `${API_BASE}/product-categories/${id}`,
    payload,
  );
  return res.data.data;
}

export async function moveProductCategory(
  id: string,
  payload: MoveProductCategoryInput,
): Promise<ProductCategory> {
  const res = await apiClient.patch<CatalogApiResponse<ProductCategory>>(
    `${API_BASE}/product-categories/${id}/move`,
    payload,
  );
  return res.data.data;
}

export async function deleteProductCategory(id: string): Promise<void> {
  await apiClient.delete(`${API_BASE}/product-categories/${id}`);
}

export async function seedBaselineCategories(): Promise<{ seeded: number; skipped: number }> {
  const res = await apiClient.post<CatalogApiResponse<{ seeded: number; skipped: number }>>(
    `${API_BASE}/product-categories/seed-baseline`,
  );
  return res.data.data;
}

// ══════════════════════════════════════════════════════════════════════════════
// HSN CODES API
// ══════════════════════════════════════════════════════════════════════════════

export async function fetchHsnCodes(params?: {
  page?: number;
  limit?: number;
  search?: string;
  level?: string;
  parent_id?: string;
  status?: string;
  source?: string;
  is_leaf?: boolean;
  sort_by?: string;
  sort_order?: 'ASC' | 'DESC';
}): Promise<PaginatedResult<HsnCode>> {
  const res = await apiClient.get<CatalogApiResponse<PaginatedResult<HsnCode>>>(
    `${API_BASE}/hsn-codes`,
    { params },
  );
  return res.data.data;
}

export async function fetchHsnTree(rootCode?: string): Promise<HsnTreeNode[]> {
  const res = await apiClient.get<CatalogApiResponse<HsnTreeNode[]>>(
    `${API_BASE}/hsn-codes/tree`,
    { params: { root_code: rootCode } },
  );
  return res.data.data;
}

export async function fetchHsnById(id: string): Promise<HsnCode> {
  const res = await apiClient.get<CatalogApiResponse<HsnCode>>(
    `${API_BASE}/hsn-codes/${id}`,
  );
  return res.data.data;
}

export async function createHsnCode(payload: CreateHsnCodeInput): Promise<HsnCode> {
  const res = await apiClient.post<CatalogApiResponse<HsnCode>>(
    `${API_BASE}/hsn-codes`,
    payload,
  );
  return res.data.data;
}

export async function updateHsnCode(id: string, payload: UpdateHsnCodeInput): Promise<HsnCode> {
  const res = await apiClient.patch<CatalogApiResponse<HsnCode>>(
    `${API_BASE}/hsn-codes/${id}`,
    payload,
  );
  return res.data.data;
}

export async function deleteHsnCode(id: string): Promise<void> {
  await apiClient.delete(`${API_BASE}/hsn-codes/${id}`);
}

export async function triggerHsnSync(payload?: {
  source?: string;
  masterType?: string;
}): Promise<MasterSyncRun> {
  const res = await apiClient.post<CatalogApiResponse<MasterSyncRun>>(
    `${API_BASE}/hsn-codes/sync`,
    payload || { source: 'ICEGATE', masterType: 'HSN' },
  );
  return res.data.data;
}

export async function fetchSyncRuns(limit = 20): Promise<MasterSyncRun[]> {
  const res = await apiClient.get<CatalogApiResponse<MasterSyncRun[]>>(
    `${API_BASE}/hsn-codes/sync-runs`,
    { params: { limit } },
  );
  return res.data.data;
}

export async function fetchSyncRunById(id: string): Promise<MasterSyncRun> {
  const res = await apiClient.get<CatalogApiResponse<MasterSyncRun>>(
    `${API_BASE}/hsn-codes/sync-runs/${id}`,
  );
  return res.data.data;
}

// ══════════════════════════════════════════════════════════════════════════════
// MAPPING API
// ══════════════════════════════════════════════════════════════════════════════

export async function fetchCategoriesForHsn(hsnId: string): Promise<HsnCodeCategoryMapping[]> {
  const res = await apiClient.get<CatalogApiResponse<HsnCodeCategoryMapping[]>>(
    `${API_BASE}/hsn-codes/${hsnId}/categories`,
  );
  return res.data.data;
}

export async function fetchHsnsForCategory(categoryId: string): Promise<HsnCodeCategoryMapping[]> {
  const res = await apiClient.get<CatalogApiResponse<HsnCodeCategoryMapping[]>>(
    `${API_BASE}/product-categories/${categoryId}/hsn-codes`,
  );
  return res.data.data;
}

export async function mapCategoryToHsn(
  hsnId: string,
  payload: { productCategoryId: string; isPrimary?: boolean },
): Promise<HsnCodeCategoryMapping> {
  const res = await apiClient.post<CatalogApiResponse<HsnCodeCategoryMapping>>(
    `${API_BASE}/hsn-codes/${hsnId}/categories`,
    payload,
  );
  return res.data.data;
}

export async function unmapCategoryFromHsn(
  hsnId: string,
  categoryId: string,
): Promise<void> {
  await apiClient.delete(`${API_BASE}/hsn-codes/${hsnId}/categories/${categoryId}`);
}

export async function seedBaselineMappings(): Promise<{ seeded: number; skipped: number }> {
  const res = await apiClient.post<CatalogApiResponse<{ seeded: number; skipped: number }>>(
    `${API_BASE}/catalog/seed-baseline-mappings`,
  );
  return res.data.data;
}
