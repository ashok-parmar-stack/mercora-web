import React from "react";
import { getInternalBackendUrl } from "@/app/actions/action-helpers";
import { BusinessesDiscoveryClient } from "@/features/businesses/components/listing/BusinessesDiscoveryClient";
import {
  Business,
  BusinessFacets,
  BusinessFiltersState,
} from "@/features/businesses/types/business.types";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

function readParam(val: string | string[] | undefined): string {
  if (Array.isArray(val)) return val[0] || "";
  return val || "";
}

export default async function BusinessesDiscoveryPage({ searchParams }: PageProps) {
  const sp = (await searchParams) || {};
  const query = readParam(sp.query) || readParam(sp.q);
  const category = readParam(sp.category) || "all";
  const location = readParam(sp.state) || readParam(sp.location) || "all";
  const city = readParam(sp.city) || "all";
  const businessType = readParam(sp.businessType) || "all";
  const verifiedOnly = readParam(sp.verifiedOnly) !== "false";

  const initialFilters: Partial<BusinessFiltersState> = {
    query,
    category,
    location,
    city,
    businessType,
    verifiedOnly,
    sortBy: "relevance",
  };

  const params = new URLSearchParams();
  if (query.trim()) params.set("query", query.trim());
  if (category !== "all") params.set("category", category);
  if (location !== "all") params.set("state", location);
  if (city !== "all") params.set("city", city);
  if (businessType !== "all") params.set("businessType", businessType);
  if (verifiedOnly) params.set("verifiedOnly", "true");

  const listParams = new URLSearchParams(params);
  listParams.set("page", "1");
  listParams.set("limit", "12");
  listParams.set("sortBy", "relevance");

  const backendUrl = getInternalBackendUrl();

  let initialBusinesses: Business[] = [];
  let initialTotal = 0;
  let initialTotalPages = 1;
  let initialFacets: BusinessFacets | null = null;

  try {
    const [listRes, facetsRes] = await Promise.all([
      fetch(`${backendUrl}/api/businesses?${listParams.toString()}`, { cache: "no-store" }),
      fetch(`${backendUrl}/api/businesses/facets?${params.toString()}`, { cache: "no-store" }),
    ]);

    if (listRes.ok) {
      const json = await listRes.json();
      initialBusinesses = json?.data || [];
      initialTotal = json?.total ?? json?.totalCount ?? initialBusinesses.length;
      initialTotalPages = json?.totalPages || Math.max(1, Math.ceil(initialTotal / 12));
    }

    if (facetsRes.ok) {
      initialFacets = await facetsRes.json();
    }
  } catch {
    // Fallback gracefully to client fetch if backend is temporarily unreachable during SSR
  }

  return (
    <BusinessesDiscoveryClient
      initialBusinesses={initialBusinesses}
      initialTotal={initialTotal}
      initialTotalPages={initialTotalPages}
      initialFacets={initialFacets}
      initialFilters={initialFilters}
    />
  );
}
