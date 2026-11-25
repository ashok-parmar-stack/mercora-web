"use client";

import { useState, useEffect, useCallback } from "react";
import { Business, BusinessFiltersState, ViewMode } from "../types/business.types";
import { fetchBusinesses } from "../api/business-api";
import { useDebounce } from "@/hooks/use-debounce";

export interface UseBusinessesOptions {
  initialBusinesses?: Business[];
  pageSize?: number;
}

export function useBusinesses(options: UseBusinessesOptions = {}) {
  const pageSize = options.pageSize || 12;
  const [businesses, setBusinesses] = useState<Business[]>(options.initialBusinesses || []);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(!options.initialBusinesses?.length);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("card");
  const [page, setPage] = useState<number>(1);

  const [filters, setFilters] = useState<BusinessFiltersState>({
    query: "",
    category: "all",
    location: "all",
    businessType: "all",
    verifiedOnly: false,
    sortBy: "relevance",
  });

  const debouncedQuery = useDebounce(filters.query, 300);

  const loadBusinesses = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchBusinesses({
        query: debouncedQuery,
        category: filters.category !== "all" ? filters.category : undefined,
        state: filters.location !== "all" ? filters.location : undefined,
        businessType: filters.businessType !== "all" ? filters.businessType : undefined,
        verifiedOnly: filters.verifiedOnly,
        sortBy: filters.sortBy,
        page,
        limit: pageSize,
      });

      setBusinesses(res.data || []);
      setTotalCount(res.total ?? 0);
      setTotalPages(res.totalPages || Math.max(1, Math.ceil((res.total ?? 0) / pageSize)));
    } catch (err: any) {
      setBusinesses([]);
      setTotalCount(0);
      setTotalPages(1);
      setError(err?.message || "Failed to load businesses");
    } finally {
      setIsLoading(false);
    }
  }, [debouncedQuery, filters.category, filters.location, filters.businessType, filters.verifiedOnly, filters.sortBy, page, pageSize]);

  useEffect(() => {
    loadBusinesses();
  }, [loadBusinesses]);

  const resetFilters = useCallback(() => {
    setFilters({
      query: "",
      category: "all",
      location: "all",
      businessType: "all",
      verifiedOnly: false,
      sortBy: "relevance",
    });
    setPage(1);
  }, []);

  return {
    businesses,
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
