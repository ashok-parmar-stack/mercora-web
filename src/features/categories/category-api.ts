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

const FALLBACK_CATEGORIES: CategoryItem[] = [
  { id: "cat-1", name: "Industrial Machinery", slug: "industrial-machinery", count: 420, icon: "Factory" },
  { id: "cat-2", name: "Textiles & Fabrics", slug: "textiles-fabrics", count: 310, icon: "Layers" },
  { id: "cat-3", name: "Pharmaceuticals", slug: "pharmaceuticals", count: 280, icon: "Activity" },
  { id: "cat-4", name: "Ceramics & Tiles", slug: "ceramics-tiles", count: 540, icon: "Grid" },
  { id: "cat-5", name: "Chemicals & Plastics", slug: "chemicals-plastics", count: 195, icon: "FlaskConical" },
  { id: "cat-6", name: "Packaging & Printing", slug: "packaging-printing", count: 160, icon: "Package" },
  { id: "cat-7", name: "Electrical & Electronics", slug: "electrical-electronics", count: 340, icon: "Zap" },
  { id: "cat-8", name: "Construction & Real Estate", slug: "construction-real-estate", count: 410, icon: "Building" },
  { id: "cat-9", name: "Agriculture & Food", slug: "agriculture-food", count: 290, icon: "Sprout" },
  { id: "cat-10", name: "Metals & Minerals", slug: "metals-minerals", count: 225, icon: "Component" },
  { id: "cat-11", name: "Automotive & Auto Parts", slug: "automotive-parts", count: 360, icon: "Truck" },
  { id: "cat-12", name: "Renewable & Solar Energy", slug: "renewable-solar-energy", count: 180, icon: "SunMedium" },
];

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
    console.error("fetchCategories error, returning baseline:", err);
    return FALLBACK_CATEGORIES;
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
