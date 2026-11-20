import { CategoryItem } from "./types";

const getApiEndpoint = (endpoint: string) => {
  const cleanEndpoint = endpoint.replace(/^\//, "");
  if (typeof window !== "undefined") {
    return `/api/${cleanEndpoint}`;
  }
  const rawBase = process.env.INTERNAL_BACKEND_URL || "http://127.0.0.1:5001";
  const cleanBase = rawBase.replace(/\/api\/?$/, "");
  return `${cleanBase}/api/${cleanEndpoint}`;
};

export interface GetCategoriesResponse {
  data: CategoryItem[];
  total: number;
}

export async function fetchCategories(): Promise<CategoryItem[]> {
  try {
    const res = await fetch(getApiEndpoint("categories"), {
      cache: "no-store",
    });
    if (res.ok) {
      const json = await res.json();
      const rawList = Array.isArray(json) ? json : json.data || [];
      return rawList.map((item: any) => ({
        id: item.id || item.slug,
        name: item.name,
        slug: item.slug,
        count: item.productCount ?? item.count ?? item.businessCount ?? 0,
        icon: item.iconUrl || item.icon,
      }));
    }

    const errJson = await res.json().catch(() => null);
    throw new Error(errJson?.message || `Failed to fetch categories (HTTP ${res.status})`);
  } catch (err: any) {
    console.error("fetchCategories error:", err);
    throw new Error(err?.message || "Unable to load categories. Please try again later.");
  }
}

export async function fetchCategoryBySlug(slug: string): Promise<CategoryItem | null> {
  if (!slug) return null;
  try {
    const res = await fetch(getApiEndpoint(`categories/${encodeURIComponent(slug)}`), {
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      return {
        id: data.id || data.slug,
        name: data.name,
        slug: data.slug,
        count: data.productCount ?? data.count ?? data.businessCount ?? 0,
        icon: data.iconUrl || data.icon,
      };
    }
    if (res.status === 404) {
      return null;
    }
    const errJson = await res.json().catch(() => null);
    throw new Error(errJson?.message || `Failed to fetch category ${slug}`);
  } catch (err: any) {
    if (err?.message?.includes("404") || err?.message?.includes("not found")) {
      return null;
    }
    console.error(`fetchCategoryBySlug error for "${slug}":`, err);
    throw err;
  }
}
