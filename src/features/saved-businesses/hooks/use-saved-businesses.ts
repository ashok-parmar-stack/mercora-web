"use client";

import { useState, useEffect, useCallback } from "react";
import { Business } from "../../businesses/types/business.types";

const STORAGE_KEY = "mercora_saved_businesses";

export function useSavedBusinesses() {
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSavedIds(JSON.parse(stored));
      }
    } catch (e) {
      console.warn("Failed to load saved businesses from storage", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const toggleSave = useCallback((businessId: string) => {
    setSavedIds((prev) => {
      const exists = prev.includes(businessId);
      const updated = exists ? prev.filter((id) => id !== businessId) : [...prev, businessId];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn("Failed to save to storage", e);
      }
      return updated;
    });
  }, []);

  const isSaved = useCallback(
    (businessId: string) => savedIds.includes(businessId),
    [savedIds]
  );

  return {
    savedIds,
    savedCount: savedIds.length,
    isLoaded,
    toggleSave,
    isSaved,
  };
}
