"use client";

import { useEffect, useCallback } from "react";
import { useTaxonomyStore } from "@/lib/store/taxonomy-store";

export function useBusinessCategories() {
  const categories = useTaxonomyStore((s) => s.businessCategories);
  const treeCategories = useTaxonomyStore((s) => s.businessCategoryTree);
  const loading = useTaxonomyStore((s) => s.isLoading);
  const error = useTaxonomyStore((s) => s.error);
  const fetchTaxonomy = useTaxonomyStore((s) => s.fetchTaxonomy);

  useEffect(() => {
    void fetchTaxonomy(false);
  }, [fetchTaxonomy]);

  const refetch = useCallback(() => fetchTaxonomy(true), [fetchTaxonomy]);

  return {
    categories,
    treeCategories,
    loading,
    error,
    refetch,
  };
}
