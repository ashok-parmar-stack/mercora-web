"use client";

import { useState, useEffect, useCallback } from "react";
import { Business } from "../types/business.types";
import { fetchBusinessBySlug } from "../api/business-api";

export function useBusinessDetails(slug: string, initialData?: Business | null) {
  const [business, setBusiness] = useState<Business | null>(initialData || null);
  const [isLoading, setIsLoading] = useState<boolean>(!initialData);
  const [error, setError] = useState<string | null>(null);

  const loadDetails = useCallback(async () => {
    if (!slug) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchBusinessBySlug(slug);
      if (data) {
        setBusiness(data);
      } else if (!initialData) {
        setError("Business profile not found");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to load business details");
    } finally {
      setIsLoading(false);
    }
  }, [slug, initialData]);

  useEffect(() => {
    if (!initialData) {
      loadDetails();
    }
  }, [loadDetails, initialData]);

  return {
    business,
    isLoading,
    error,
    refresh: loadDetails,
  };
}
