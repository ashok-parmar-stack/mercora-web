"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchBusinessCategories } from "../business-category-api";
import { BusinessCategoryItem } from "../types";

export function useBusinessCategories() {
  const [categories, setCategories] = useState<BusinessCategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchBusinessCategories()
      .then((items) => {
        setCategories(items || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err?.message || "Failed to load business categories");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return {
    categories,
    loading,
    error,
    refetch: load,
  };
}
