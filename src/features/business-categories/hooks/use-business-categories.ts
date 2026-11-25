"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchBusinessCategories, fetchBusinessCategoriesTree } from "../business-category-api";
import { BusinessCategoryItem } from "../types";

export function useBusinessCategories() {
  const [categories, setCategories] = useState<BusinessCategoryItem[]>([]);
  const [treeCategories, setTreeCategories] = useState<BusinessCategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);

    Promise.all([
      fetchBusinessCategories(),
      fetchBusinessCategoriesTree(),
    ])
      .then(([flat, tree]) => {
        if (flat && flat.length > 0) {
          setCategories(flat);
        }
        if (tree && tree.length > 0) {
          setTreeCategories(tree);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("useBusinessCategories hook error:", err);
        setError(err?.message || "Failed to load business categories");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return {
    categories,
    treeCategories,
    loading,
    error,
    refetch: load,
  };
}
