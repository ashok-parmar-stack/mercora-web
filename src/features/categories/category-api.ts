import { HttpClientError, requestApi } from "@/lib/http/client";
import { CategoryItem } from "./types";

export interface GetCategoriesResponse {
  data: CategoryItem[];
  total: number;
}

function mapCategory(item: any): CategoryItem {
  return {
    id: item.id || item.slug,
    name: item.name,
    slug: item.slug,
    count: item.productCount ?? item.count ?? item.businessCount ?? 0,
    icon: item.iconUrl || item.icon,
  };
}

export async function fetchCategories(
  signal?: AbortSignal
): Promise<CategoryItem[]> {
  const json = await requestApi<any>("categories", {
    method: "GET",
    signal,
  });
  const rawList = Array.isArray(json) ? json : json?.data || [];
  return rawList.map(mapCategory);
}

export async function fetchCategoryBySlug(
  slug: string,
  signal?: AbortSignal
): Promise<CategoryItem | null> {
  if (!slug) return null;
  try {
    const json = await requestApi<any>(
      `categories/${encodeURIComponent(slug)}`,
      { method: "GET", signal }
    );
    const item = json?.data || json;
    return item ? mapCategory(item) : null;
  } catch (err) {
    if (err instanceof HttpClientError && err.status === 404) {
      return null;
    }
    throw err;
  }
}
