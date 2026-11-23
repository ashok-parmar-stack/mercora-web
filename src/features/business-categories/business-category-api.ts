import { BusinessCategoryItem } from "./types";

const getApiEndpoint = (endpoint: string) => {
  const cleanEndpoint = endpoint.replace(/^\//, "");
  if (typeof window !== "undefined") {
    return `/api/${cleanEndpoint}`;
  }
  const rawBase = process.env.INTERNAL_BACKEND_URL || "http://127.0.0.1:5001";
  const cleanBase = rawBase.replace(/\/api\/?$/, "");
  return `${cleanBase}/api/${cleanEndpoint}`;
};

export async function fetchBusinessCategories(): Promise<BusinessCategoryItem[]> {
  try {
    const res = await fetch(getApiEndpoint("business-categories"), {
      cache: "no-store",
    });
    if (res.ok) {
      const json = await res.json();
      const rawList = Array.isArray(json) ? json : json.data || [];
      return rawList.map((item: any) => ({
        id: item.id || item.slug,
        name: item.name,
        code: item.code,
        slug: item.slug,
        type: item.type || item.slug,
        description: item.description,
        icon: item.icon,
        displayOrder: item.displayOrder ?? 0,
        businessCount: item.businessCount ?? 0,
      }));
    }

    const errJson = await res.json().catch(() => null);
    throw new Error(errJson?.message || `Failed to fetch business categories (HTTP ${res.status})`);
  } catch (err: any) {
    console.error("fetchBusinessCategories error:", err);
    // Fallback to baseline default list if server is unreachable
    return [
      { id: "manufacture", name: "Manufacturer", code: "MANUFACTURER", slug: "manufacture", type: "manufacture", icon: "Factory", displayOrder: 1, businessCount: 3840 },
      { id: "seller", name: "Seller / Supplier", code: "SELLER", slug: "seller", type: "seller", icon: "Layers", displayOrder: 2, businessCount: 2950 },
      { id: "export", name: "Exporter", code: "EXPORTER", slug: "export", type: "export", icon: "Shield", displayOrder: 3, businessCount: 1620 },
      { id: "wholesaler", name: "Wholesaler", code: "WHOLESALER", slug: "wholesaler", type: "wholesaler", icon: "Building2", displayOrder: 4, businessCount: 1890 },
      { id: "distributor", name: "Distributor", code: "DISTRIBUTOR", slug: "distributor", type: "distributor", icon: "Truck", displayOrder: 5, businessCount: 1240 },
      { id: "service-provider", name: "Service Provider", code: "SERVICE_PROVIDER", slug: "service-provider", type: "service-provider", icon: "Wrench", displayOrder: 6, businessCount: 870 },
    ];
  }
}

export async function fetchBusinessCategoryBySlug(slug: string): Promise<BusinessCategoryItem | null> {
  if (!slug) return null;
  try {
    const res = await fetch(getApiEndpoint(`business-categories/${encodeURIComponent(slug)}`), {
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      return {
        id: data.id || data.slug,
        name: data.name,
        code: data.code,
        slug: data.slug,
        type: data.type || data.slug,
        description: data.description,
        icon: data.icon,
        displayOrder: data.displayOrder ?? 0,
        businessCount: data.businessCount ?? 0,
      };
    }
    return null;
  } catch (err: any) {
    console.error(`fetchBusinessCategoryBySlug error for "${slug}":`, err);
    return null;
  }
}
