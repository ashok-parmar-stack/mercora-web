"use client";

import { useState, useEffect, useCallback, useRef, useMemo, SetStateAction } from "react";
import {
  Business,
  BusinessFacets,
  BusinessFiltersState,
  ViewMode,
} from "../types/business.types";
import { fetchBusinessFacets, fetchBusinesses } from "../api/business-api";
import { useDebounce } from "@/hooks/use-debounce";
import { formatUserFriendlyError } from "@/config/messages";
import { isAbortError } from "@/lib/api-abort";

export interface UseBusinessesOptions {
  initialBusinesses?: Business[];
  initialTotal?: number;
  initialTotalPages?: number;
  initialFacets?: BusinessFacets | null;
  initialFilters?: Partial<BusinessFiltersState>;
  pageSize?: number;
}

const DEFAULT_FILTERS: BusinessFiltersState = {
  query: "",
  category: "all",
  location: "all",
  city: "all",
  businessType: "all",
  verifiedOnly: true,
  sortBy: "relevance",
};

function matchesFilters(b: Business, f: BusinessFiltersState, exclude?: keyof BusinessFiltersState): boolean {
  if (exclude !== "query" && f.query.trim()) {
    const q = f.query.trim().toLowerCase();
    const hay = `${b.name} ${b.category} ${b.businessType} ${b.city} ${b.state} ${b.description || ""}`.toLowerCase();
    if (!hay.includes(q)) return false;
  }
  if (exclude !== "category" && f.category && f.category !== "all") {
    const c = f.category.toLowerCase();
    if ((b.category || "").toLowerCase() !== c && (b.industry || "").toLowerCase() !== c) {
      return false;
    }
  }
  if (exclude !== "location" && f.location && f.location !== "all") {
    if ((b.state || "").trim().toLowerCase() !== f.location.trim().toLowerCase()) return false;
  }
  if (exclude !== "city" && f.city && f.city !== "all") {
    if ((b.city || "").trim().toLowerCase() !== f.city.trim().toLowerCase()) return false;
  }
  if (exclude !== "businessType" && f.businessType && f.businessType !== "all") {
    const bt = f.businessType.trim().toLowerCase();
    const bizType = (b.businessType || "").trim().toLowerCase();
    if (bizType !== bt && !bizType.includes(bt)) return false;
  }
  if (exclude !== "verifiedOnly" && f.verifiedOnly) {
    if (!b.isVerified && b.tier !== "Verified" && b.tier !== "Premium") return false;
  }
  return true;
}

export function useBusinesses(options: UseBusinessesOptions = {}) {
  const pageSize = options.pageSize || 12;
  const serverList = options.initialBusinesses || [];
  const canFilterLocally =
    serverList.length > 0 &&
    (options.initialTotal ?? serverList.length) <= serverList.length &&
    (!options.initialFilters ||
      (options.initialFilters.query === "" &&
        (options.initialFilters.category || "all") === "all" &&
        (options.initialFilters.location || "all") === "all" &&
        (options.initialFilters.city || "all") === "all" &&
        (options.initialFilters.businessType || "all") === "all"));

  const [allBusinesses] = useState<Business[]>(canFilterLocally ? serverList : []);
  const [businesses, setBusinesses] = useState<Business[]>(
    canFilterLocally ? serverList.slice(0, pageSize) : serverList
  );
  const [facets, setFacets] = useState<BusinessFacets | null>(options.initialFacets ?? null);
  const [baseFacets, setBaseFacets] = useState<BusinessFacets | null>(options.initialFacets ?? null);
  const [totalCount, setTotalCount] = useState<number>(
    options.initialTotal ?? serverList.length ?? 0
  );
  const [totalPages, setTotalPages] = useState<number>(
    options.initialTotalPages ??
    Math.max(1, Math.ceil((options.initialTotal ?? serverList.length ?? 0) / pageSize))
  );
  const [isLoading, setIsLoading] = useState<boolean>(serverList.length === 0);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("card");
  const [page, setPage] = useState<number>(1);

  const [filters, setFiltersState] = useState<BusinessFiltersState>({
    ...DEFAULT_FILTERS,
    ...options.initialFilters,
  });

  const abortControllerRef = useRef<AbortController | null>(null);
  const hasLoadedOnceRef = useRef<boolean>(serverList.length > 0);
  const lastFacetKeyRef = useRef<string | null>(null);

  const setFilters = useCallback((updater: SetStateAction<BusinessFiltersState>) => {
    setFiltersState((prev) => (typeof updater === "function" ? updater(prev) : updater));
    setPage(1);
  }, []);

  // Instant in-memory Flipkart-style filtering when full dataset is loaded
  const localResult = useMemo(() => {
    if (allBusinesses.length === 0) return null;

    const filtered = allBusinesses.filter((b) => matchesFilters(b, filters));
    const sorted = [...filtered].sort((a, b) => {
      switch (filters.sortBy) {
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "reviews":
          return (b.reviewCount || 0) - (a.reviewCount || 0);
        case "established":
          return (a.establishedYear || 9999) - (b.establishedYear || 9999);
        default:
          return (b.rating || 0) - (a.rating || 0) || (b.reviewCount || 0) - (a.reviewCount || 0);
      }
    });

    const total = sorted.length;
    const pages = Math.max(1, Math.ceil(total / pageSize));
    const safePage = Math.min(page, pages);
    const paged = sorted.slice((safePage - 1) * pageSize, safePage * pageSize);

    // Compute live facet counts locally
    const stateCounts = new Map<string, number>();
    const cityCounts = new Map<string, { state?: string; count: number }>();
    const masterCounts = new Map<string, number>();
    const typeCounts = new Map<string, number>();

    for (const b of allBusinesses) {
      if (matchesFilters(b, filters, "location") && b.state) {
        stateCounts.set(b.state, (stateCounts.get(b.state) || 0) + 1);
      }
      if (matchesFilters(b, filters, "city") && b.city) {
        const prev = cityCounts.get(b.city);
        cityCounts.set(b.city, { state: b.state, count: (prev?.count || 0) + 1 });
      }
      if (matchesFilters(b, filters, "category") && b.category) {
        masterCounts.set(b.category, (masterCounts.get(b.category) || 0) + 1);
      }
      if (matchesFilters(b, filters, "businessType") && b.businessType) {
        typeCounts.set(b.businessType, (typeCounts.get(b.businessType) || 0) + 1);
      }
    }

    const base = baseFacets;
    const computedFacets: BusinessFacets = {
      totalBusinesses: filtered.length,
      verifiedCount: filtered.filter((b) => b.isVerified || b.tier === "Verified" || b.tier === "Premium").length,
      unverifiedCount: filtered.filter((b) => !b.isVerified && b.tier !== "Verified" && b.tier !== "Premium").length,
      businessCategories: (base?.businessCategories || []).map((bc) => ({
        ...bc,
        businessCount: typeCounts.get(bc.name) ?? 0,
      })),
      locations: Array.from(stateCounts.entries())
        .map(([name, count]) => ({ name, slug: name.toLowerCase().replace(/\s+/g, "-"), count }))
        .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name)),
      cities: Array.from(cityCounts.entries())
        .map(([name, info]) => ({ name, slug: name.toLowerCase().replace(/\s+/g, "-"), state: info.state, count: info.count }))
        .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name)),
      masterCategories: Array.from(masterCounts.entries())
        .map(([name, count]) => ({ name, slug: name.toLowerCase().replace(/\s+/g, "-"), count }))
        .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name)),
    };

    return { paged, total, pages, computedFacets };
  }, [allBusinesses, filters, page, pageSize, baseFacets]);

  const debouncedQuery = useDebounce(filters.query, 250);

  const loadBusinessesFromApi = useCallback(async () => {
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    if (!hasLoadedOnceRef.current) {
      setIsLoading(true);
    }
    setIsFetching(true);
    setError(null);

    const sharedParams = {
      query: debouncedQuery,
      category: filters.category !== "all" ? filters.category : undefined,
      state: filters.location !== "all" ? filters.location : undefined,
      city: filters.city !== "all" ? filters.city : undefined,
      businessType: filters.businessType !== "all" ? filters.businessType : undefined,
      verifiedOnly: filters.verifiedOnly,
    };

    const facetKey = JSON.stringify(sharedParams);
    const shouldFetchFacets = facetKey !== lastFacetKeyRef.current;

    try {
      const [res, facetsRes] = await Promise.all([
        fetchBusinesses({
          ...sharedParams,
          sortBy: filters.sortBy,
          page,
          limit: pageSize,
          signal: controller.signal,
        }),
        shouldFetchFacets
          ? fetchBusinessFacets({ ...sharedParams, signal: controller.signal }).catch(() => null)
          : Promise.resolve(null),
      ]);

      if (controller.signal.aborted) return;

      hasLoadedOnceRef.current = true;
      setBusinesses(res.data || []);
      setTotalCount(res.total ?? 0);
      setTotalPages(res.totalPages || Math.max(1, Math.ceil((res.total ?? 0) / pageSize)));
      if (facetsRes) {
        lastFacetKeyRef.current = facetKey;
        setFacets(facetsRes);
        if (!baseFacets) setBaseFacets(facetsRes);
      }
    } catch (err: unknown) {
      if (isAbortError(err) || controller.signal.aborted) return;
      setBusinesses([]);
      setTotalCount(0);
      setTotalPages(1);
      setError(
        formatUserFriendlyError(
          err,
          "Unable to load businesses right now. Please try again in a moment."
        )
      );
    } finally {
      if (!controller.signal.aborted) {
        setIsLoading(false);
        setIsFetching(false);
      }
    }
  }, [
    debouncedQuery,
    filters.category,
    filters.location,
    filters.city,
    filters.businessType,
    filters.verifiedOnly,
    filters.sortBy,
    page,
    pageSize,
    baseFacets,
  ]);

  useEffect(() => {
    if (localResult) return; // Instant local filtering active
    loadBusinessesFromApi();
    return () => {
      abortControllerRef.current?.abort();
    };
  }, [localResult, loadBusinessesFromApi]);

  const resetFilters = useCallback(() => {
    setFiltersState(DEFAULT_FILTERS);
    setPage(1);
  }, []);

  const refresh = useCallback(() => {
    if (localResult) return;
    lastFacetKeyRef.current = null;
    loadBusinessesFromApi();
  }, [localResult, loadBusinessesFromApi]);

  return {
    businesses: localResult ? localResult.paged : businesses,
    facets: localResult ? localResult.computedFacets : facets ?? baseFacets,
    totalCount: localResult ? localResult.total : totalCount,
    isLoading: localResult ? false : isLoading,
    isFetching: localResult ? false : isFetching,
    error,
    viewMode,
    setViewMode,
    filters,
    setFilters,
    resetFilters,
    page,
    setPage,
    totalPages: localResult ? localResult.pages : totalPages,
    refresh,
  };
}
