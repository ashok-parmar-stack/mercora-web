"use client";

import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "mercora_saved_businesses";
const EMPTY_IDS: string[] = [];

let cachedRaw: string | null | undefined;
let cachedIds: string[] = EMPTY_IDS;
const listeners = new Set<() => void>();

function readSavedIdsSnapshot(): string[] {
  if (typeof window === "undefined") return EMPTY_IDS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === cachedRaw) return cachedIds;
    cachedRaw = raw;
    if (!raw) {
      cachedIds = EMPTY_IDS;
      return cachedIds;
    }
    const parsed = JSON.parse(raw);
    cachedIds = Array.isArray(parsed)
      ? parsed.filter((id) => typeof id === "string")
      : EMPTY_IDS;
    return cachedIds;
  } catch {
    return cachedIds;
  }
}

function getServerSnapshot(): string[] {
  return EMPTY_IDS;
}

function subscribe(callback: () => void): () => void {
  listeners.add(callback);

  const handleStorage = (event: StorageEvent) => {
    if (event.key && event.key !== STORAGE_KEY) return;
    cachedRaw = undefined;
    callback();
  };

  if (typeof window !== "undefined") {
    window.addEventListener("storage", handleStorage);
  }

  return () => {
    listeners.delete(callback);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", handleStorage);
    }
  };
}

function notifySubscribers() {
  for (const listener of listeners) {
    listener();
  }
}

export function useSavedBusinesses() {
  const savedIds = useSyncExternalStore(
    subscribe,
    readSavedIdsSnapshot,
    getServerSnapshot
  );

  const isHydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const toggleSave = useCallback((businessId: string) => {
    const current = readSavedIdsSnapshot();
    const updated = current.includes(businessId)
      ? current.filter((id) => id !== businessId)
      : [...current, businessId];

    try {
      const serialized = JSON.stringify(updated);
      localStorage.setItem(STORAGE_KEY, serialized);
      cachedRaw = serialized;
      cachedIds = updated;
    } catch {
      cachedIds = updated;
    }

    notifySubscribers();
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
