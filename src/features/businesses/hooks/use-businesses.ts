"use client";

import { useState, useEffect, useCallback, useRef, SetStateAction } from "react";
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

export function useBusinesses(options: UseBusinessesOptions = {}) {
  const pageSize = options.pageSize || 12;
  const hasServerSeed = Boolean(options.initialBusinesses && options.initialBusinesses.length > 0);

  const [businesses, setBusinesses] = useState<Business[]>(options.initialBusinesses || []);
  const [facets, setFacets] = useState<BusinessFacets | null>(options.initialFacets ?? null);
  const [baseFacets, setBaseFacets] = useState<BusinessFacets | null>(options.initialFacets ?? null);
  const [totalCount, setTotalCount] = useState<number>(
    options.initialTotal ?? options.initialBusinesses?.length ?? 0
  );
  const [totalPages, setTotalPages] = useState<number>(
    options.initialTotalPages ??
      Math.max(1, Math.ceil((options.initialTotal ?? options.initialBusinesses?.length ?? 0) / pageSize))
  );
  const [isLoading, setIsLoading] = useState<boolean>(!hasServerSeed);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("card");
  const [page, setPage] = useState<number>(1);

  const [filters, setFiltersState] = useState<BusinessFiltersState>({
    ...DEFAULT_FILTERS,
    ...options.initialFilters,
  });

  const abortControllerRef = useRef<AbortController | null>(null);
  const skipInitialFetchRef = useRef<boolean>(hasServerSeed);
  const hasLoadedOnceRef = useRef<boolean>(hasServerSeed);
  const lastFacetKeyRef = useRef<string | null>(
    options.initialFacets
      ? JSON.stringify({
          query: options.initialFilters?.query || "",
          category:
            options.initialFilters?.category && options.initialFilters.category !== "all"
              ? options.initialFilters.category
              : undefined,
          state:
            options.initialFilters?.location && options.initialFilters.location !== "all"
              ? options.initialFilters.location
              : undefined,
          city:
            options.initialFilters?.city && options.initialFilters.city !== "all"
              ? options.initialFilters.city
              : undefined,
          businessType:
            options.initialFilters?.businessType && options.initialFilters.businessType !== "all"
              ? options.initialFilters.businessType
              : undefined,
          verifiedOnly: options.initialFilters?.verifiedOnly ?? true,
        })
      : null
  );

  const setFilters = useCallback((updater: SetStateAction<BusinessFiltersState>) => {
    setFiltersState((prev) => (typeof updater === "function" ? updater(prev) : updater));
    setPage(1);
  }, []);

  const debouncedQuery = useDebounce(filters.query, 250);

  const loadBusinesses = useCallback(async () => {
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
    if (skipInitialFetchRef.current) {
      skipInitialFetchRef.current = false;
      return;
    }
    loadBusinesses();
    return () => {
      abortControllerRef.current?.abort();
    };
  }, [loadBusinesses]);

  const resetFilters = useCallback(() => {
    setFiltersState(DEFAULT_FILTERS);
    setPage(1);
  }, []);

  const refresh = useCallback(() => {
    lastFacetKeyRef.current = null;
    loadBusinesses();
  }, [loadBusinesses]);

  return {
    businesses,
    facets: facets ?? baseFacets,
    totalCount,
    isLoading,
    isFetching,
    error,
    viewMode,
    setViewMode,
    filters,
    setFilters,
    resetFilters,
    page,
    setPage,
    totalPages,
    refresh,
  };
}
