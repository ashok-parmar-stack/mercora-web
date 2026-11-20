"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Business, BusinessFiltersState, ViewMode } from "../types/business.types";
import { fetchBusinesses } from "../api/business-api";
import { useDebounce } from "@/hooks/use-debounce";
import { filterBusinesses, sortBusinesses } from "../utils/business-filters";

export interface UseBusinessesOptions {
  initialBusinesses?: Business[];
  pageSize?: number;
}

export function useBusinesses(options: UseBusinessesOptions = {}) {
  const pageSize = options.pageSize || 12;
  const [businesses, setBusinesses] = useState<Business[]>(options.initialBusinesses || []);
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
        category: filters.category,
        businessType: filters.businessType,
        verifiedOnly: filters.verifiedOnly,
        sortBy: filters.sortBy,
        page,
        limit: pageSize,
      });

      setBusinesses(res.data || []);
    } catch (err: any) {
      setBusinesses([]);
      setError(err?.message || "Failed to load businesses");
    } finally {
      setIsLoading(false);
    }
  }, [debouncedQuery, filters.category, filters.businessType, filters.verifiedOnly, filters.sortBy, page, pageSize]);

  useEffect(() => {
    loadBusinesses();
  }, [loadBusinesses]);

  const filteredBusinesses = useMemo(() => {
    const list = filterBusinesses(businesses, {
      query: debouncedQuery,
      category: filters.category,
      businessType: filters.businessType,
      verifiedOnly: filters.verifiedOnly,
    });
    return sortBusinesses(list, filters.sortBy);
  }, [businesses, debouncedQuery, filters.category, filters.businessType, filters.verifiedOnly, filters.sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredBusinesses.length / pageSize));
  const paginatedBusinesses = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredBusinesses.slice(start, start + pageSize);
  }, [filteredBusinesses, page, pageSize]);

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
    businesses: paginatedBusinesses,
    totalCount: filteredBusinesses.length,
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
