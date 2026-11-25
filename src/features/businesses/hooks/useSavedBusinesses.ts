"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "mercora_saved_businesses";
const SYNC_EVENT = "mercora:saved-businesses-changed";

function readSavedIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === "string") : [];
  } catch {
    return [];
  }
}

export function useSavedBusinesses() {
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setSavedIds(readSavedIds());
    setIsHydrated(true);

    const handleSync = (event: Event) => {
      if (event instanceof StorageEvent && event.key && event.key !== STORAGE_KEY) {
        return;
      }
      setSavedIds(readSavedIds());
    };

    window.addEventListener("storage", handleSync);
    window.addEventListener(SYNC_EVENT, handleSync);
    return () => {
      window.removeEventListener("storage", handleSync);
      window.removeEventListener(SYNC_EVENT, handleSync);
    };
  }, []);

  const toggleSave = useCallback((businessId: string) => {
    setSavedIds((prev) => {
      const updated = prev.includes(businessId)
        ? prev.filter((id) => id !== businessId)
        : [...prev, businessId];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        window.dispatchEvent(new Event(SYNC_EVENT));
      } catch {
        // Ignore storage quota / private-browsing failures
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
    isSaved,
    toggleSave,
    isHydrated,
    isLoaded: isHydrated,
  };
}
