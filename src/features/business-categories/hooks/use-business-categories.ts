"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchBusinessCategories } from "../business-category-api";
import { BusinessCategoryItem } from "../types";

const DEFAULT_BUSINESS_CATEGORIES: BusinessCategoryItem[] = [
  { id: "bc-1", name: "Distributor", code: "DISTRIBUTOR", slug: "distributor", type: "DISTRIBUTOR", displayOrder: 1, businessCount: 0 },
  { id: "bc-2", name: "Exporter", code: "EXPORTER", slug: "exporter", type: "EXPORTER", displayOrder: 2, businessCount: 0 },
  { id: "bc-3", name: "Manufacturer", code: "MANUFACTURER", slug: "manufacturer", type: "MANUFACTURER", displayOrder: 3, businessCount: 0 },
  { id: "bc-4", name: "Seller / Supplier", code: "SUPPLIER", slug: "seller-supplier", type: "SUPPLIER", displayOrder: 4, businessCount: 0 },
  { id: "bc-5", name: "Service Provider", code: "SERVICE", slug: "service-provider", type: "SERVICE", displayOrder: 5, businessCount: 0 },
  { id: "bc-6", name: "Wholesaler", code: "WHOLESALER", slug: "wholesaler", type: "WHOLESALER", displayOrder: 6, businessCount: 0 },
];

export function useBusinessCategories() {
  const [categories, setCategories] = useState<BusinessCategoryItem[]>(DEFAULT_BUSINESS_CATEGORIES);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchBusinessCategories()
      .then((items) => {
        if (items && items.length > 0) {
          setCategories(items);
        }
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
