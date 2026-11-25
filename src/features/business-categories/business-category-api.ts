import {
  BusinessCategoryItem,
  CreateBusinessCategoryPayload,
  UpdateBusinessCategoryPayload,
} from "./types";

const getApiEndpoint = (endpoint: string) => {
  const cleanEndpoint = endpoint.replace(/^\//, "");
  if (typeof window !== "undefined") {
    return `/api/${cleanEndpoint}`;
  }
  const rawBase = process.env.INTERNAL_BACKEND_URL || "http://127.0.0.1:5001";
  const cleanBase = rawBase.replace(/\/api\/?$/, "");
  return `${cleanBase}/api/${cleanEndpoint}`;
};

export async function fetchBusinessCategories(params?: {
  parentId?: string | null;
  status?: string;
  query?: string;
}): Promise<BusinessCategoryItem[]> {
  try {
    const q = new URLSearchParams();
    if (params?.status) q.set("status", params.status);
    if (params?.query) q.set("query", params.query);
    if (params?.parentId) q.set("parentId", params.parentId);

    const queryStr = q.toString() ? `?${q.toString()}` : "";
    const res = await fetch(getApiEndpoint(`business-categories${queryStr}`), {
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
        parentId: item.parentId || null,
        displayOrder: item.displayOrder ?? 0,
        status: item.status || "ACTIVE",
        isActive: item.isActiveStatus ?? item.isActive ?? (item.status === "ACTIVE"),
        businessCount: item.businessCount ?? 0,
      }));
    }

    const errJson = await res.json().catch(() => null);
    throw new Error(errJson?.message || `Failed to fetch business categories (HTTP ${res.status})`);
  } catch (err: any) {
    console.error("fetchBusinessCategories error:", err);
    // Baseline fallback with all 10 core categories
    return [
      { id: "export", name: "Export Seller / Exporter", code: "EXPORTER", slug: "export", type: "export", icon: "ShieldCheck", displayOrder: 1, businessCount: 245, status: "ACTIVE", isActive: true },
      { id: "importer", name: "Importer", code: "IMPORTER", slug: "importer", type: "importer", icon: "Ship", displayOrder: 2, businessCount: 110, status: "ACTIVE", isActive: true },
      { id: "logistics", name: "Logistics Provider", code: "LOGISTICS_PROVIDER", slug: "logistics", type: "logistics", icon: "Truck", displayOrder: 3, businessCount: 180, status: "ACTIVE", isActive: true },
      { id: "freight-forwarder", name: "Freight Forwarder", code: "FREIGHT_FORWARDER", slug: "freight-forwarder", type: "freight", icon: "Plane", displayOrder: 4, businessCount: 95, status: "ACTIVE", isActive: true },
      { id: "manufacture", name: "Manufacturer", code: "MANUFACTURER", slug: "manufacture", type: "manufacture", icon: "Factory", displayOrder: 5, businessCount: 120, status: "ACTIVE", isActive: true },
      { id: "wholesaler", name: "Wholesaler / Distributor", code: "WHOLESALER_DISTRIBUTOR", slug: "wholesaler", type: "wholesale", icon: "Building2", displayOrder: 6, businessCount: 85, status: "ACTIVE", isActive: true },
      { id: "trading-company", name: "Trading Company", code: "TRADING_COMPANY", slug: "trading-company", type: "trading", icon: "Briefcase", displayOrder: 7, businessCount: 65, status: "ACTIVE", isActive: true },
      { id: "customs-broker", name: "Customs Clearance Agent", code: "CUSTOMS_BROKER", slug: "customs-clearance", type: "customs", icon: "FileCheck", displayOrder: 8, businessCount: 40, status: "ACTIVE", isActive: true },
      { id: "service-provider", name: "Service Provider", code: "SERVICE_PROVIDER", slug: "service-provider", type: "service", icon: "Wrench", displayOrder: 9, businessCount: 70, status: "ACTIVE", isActive: true },
      { id: "sourcing-agent", name: "Sourcing Agent", code: "SOURCING_AGENT", slug: "sourcing-agent", type: "sourcing", icon: "Search", displayOrder: 10, businessCount: 30, status: "ACTIVE", isActive: true },
    ];
  }
}

export async function fetchBusinessCategoriesTree(): Promise<BusinessCategoryItem[]> {
  try {
    const res = await fetch(getApiEndpoint("business-categories/tree"), {
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    }
    return [];
  } catch (err) {
    console.error("fetchBusinessCategoriesTree error:", err);
    return [];
  }
}

export async function fetchAdminBusinessCategories(params?: {
  query?: string;
  status?: string;
  parentId?: string;
  page?: number;
  limit?: number;
}): Promise<{ data: BusinessCategoryItem[]; total: number }> {
  const q = new URLSearchParams();
  if (params?.query) q.set("query", params.query);
  if (params?.status) q.set("status", params.status);
  if (params?.parentId) q.set("parentId", params.parentId);
  if (params?.page) q.set("page", String(params.page));
  if (params?.limit) q.set("limit", String(params.limit));

  const queryStr = q.toString() ? `?${q.toString()}` : "";
  const res = await fetch(getApiEndpoint(`admin/business-categories${queryStr}`), {
    cache: "no-store",
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message || "Failed to fetch admin business categories");
  }

  const json = await res.json();
  return {
    data: json.data || [],
    total: json.total || json.data?.length || 0,
  };
}

export async function createBusinessCategory(
  payload: CreateBusinessCategoryPayload
): Promise<BusinessCategoryItem> {
  const res = await fetch(getApiEndpoint("admin/business-categories"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message || "Failed to create business category");
  }
  return res.json();
}

export async function updateBusinessCategory(
  id: string,
  payload: UpdateBusinessCategoryPayload
): Promise<BusinessCategoryItem> {
  const res = await fetch(getApiEndpoint(`admin/business-categories/${encodeURIComponent(id)}`), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message || "Failed to update business category");
  }
  return res.json();
}

export async function toggleBusinessCategoryStatus(
  id: string,
  isActive: boolean
): Promise<BusinessCategoryItem> {
  const res = await fetch(getApiEndpoint(`admin/business-categories/${encodeURIComponent(id)}/status`), {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isActive }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message || "Failed to toggle status");
  }
  return res.json();
}

export async function deleteBusinessCategory(id: string): Promise<void> {
  const res = await fetch(getApiEndpoint(`admin/business-categories/${encodeURIComponent(id)}`), {
    method: "DELETE",
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message || "Failed to delete business category");
  }
}
