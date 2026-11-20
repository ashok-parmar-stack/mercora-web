'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'mercora_saved_businesses';

export function useSavedBusinesses() {
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSavedIds(JSON.parse(stored));
      }
    } catch {
      // Ignore storage errors
    } finally {
      setIsHydrated(true);
    }
  }, []);

  const toggleSave = useCallback((id: string) => {
    setSavedIds((prev) => {
      const updated = prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Ignore
      }
      return updated;
    });
  }, []);

  const isSaved = useCallback((id: string) => savedIds.includes(id), [savedIds]);

  return {
    savedIds,
    savedCount: savedIds.length,
    isSaved,
    toggleSave,
    isHydrated,
  };
}
