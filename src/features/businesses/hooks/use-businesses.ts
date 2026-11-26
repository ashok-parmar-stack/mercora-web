"use client";

import { useState, useEffect, useCallback, SetStateAction } from "react";
import {
  Business,
  BusinessFacets,
  BusinessFiltersState,
  ViewMode,
} from "../types/business.types";
import { fetchBusinessFacets, fetchBusinesses } from "../api/business-api";
import { useDebounce } from "@/hooks/use-debounce";
import { formatUserFriendlyError } from "@/config/messages";

export interface UseBusinessesOptions {
  initialBusinesses?: Business[];
  pageSize?: number;
}

const DEFAULT_FILTERS: BusinessFiltersState = {
  query: "",
  category: "all",
  location: "all",
  city: "all",
  businessType: "all",
  verifiedOnly: false,
  sortBy: "relevance",
};

export function useBusinesses(options: UseBusinessesOptions = {}) {
  const pageSize = options.pageSize || 12;
  const [businesses, setBusinesses] = useState<Business[]>(options.initialBusinesses || []);
  const [facets, setFacets] = useState<BusinessFacets | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(!options.initialBusinesses?.length);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("card");
  const [page, setPage] = useState<number>(1);

  const [filters, setFiltersState] = useState<BusinessFiltersState>(DEFAULT_FILTERS);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const sp = new URLSearchParams(window.location.search);
    const q = sp.get("query") || sp.get("q") || "";
    const cat = sp.get("category") || "all";
    const loc = sp.get("state") || sp.get("location") || "all";
    const cityParam = sp.get("city") || "all";
    const bt = sp.get("businessType") || "all";
    const verified = sp.get("verifiedOnly") === "true";

    if (q || cat !== "all" || loc !== "all" || cityParam !== "all" || bt !== "all" || verified) {
      setFiltersState((prev) => ({
        ...prev,
        query: q,
        category: cat,
        location: loc,
        city: cityParam,
        businessType: bt,
        verifiedOnly: verified,
      }));
    }
  }, []);

  const setFilters = useCallback((updater: SetStateAction<BusinessFiltersState>) => {
    setFiltersState((prev) => (typeof updater === "function" ? updater(prev) : updater));
    setPage(1);
  }, []);

  const debouncedQuery = useDebounce(filters.query, 300);

  const loadBusinesses = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const sharedParams = {
      query: debouncedQuery,
      category: filters.category !== "all" ? filters.category : undefined,
      state: filters.location !== "all" ? filters.location : undefined,
      city: filters.city !== "all" ? filters.city : undefined,
      businessType: filters.businessType !== "all" ? filters.businessType : undefined,
      verifiedOnly: filters.verifiedOnly,
    };

    try {
      const [res, facetsRes] = await Promise.all([
        fetchBusinesses({
          ...sharedParams,
          sortBy: filters.sortBy,
          page,
          limit: pageSize,
        }),
        fetchBusinessFacets(sharedParams).catch(() => null),
      ]);

      setBusinesses(res.data || []);
      setTotalCount(res.total ?? 0);
      setTotalPages(res.totalPages || Math.max(1, Math.ceil((res.total ?? 0) / pageSize)));
      if (facetsRes) {
        setFacets(facetsRes);
      }
    } catch (err: unknown) {
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
      setIsLoading(false);
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
  ]);

  useEffect(() => {
    loadBusinesses();
  }, [loadBusinesses]);

  const resetFilters = useCallback(() => {
    setFiltersState(DEFAULT_FILTERS);
    setPage(1);
  }, []);

  return {
    businesses,
    facets,
    totalCount,
    isLoading,
    error,
    viewMode,
    setViewMode,
    filters,
    setFilters,
    resetFilters,
    page,
    setPage,
    totalPages,
    refresh: loadBusinesses,
  };
}
