// Simple in-memory & session query cache utility for Next.js App Router
type QueryKey = string;

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

class SimpleQueryCache {
  private cache = new Map<QueryKey, CacheEntry<unknown>>();
  private defaultTtlMs = 60000; // 1 minute

  set<T>(key: QueryKey, data: T): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  get<T>(key: QueryKey, ttlMs: number = this.defaultTtlMs): T | null {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;
    if (!entry) return null;
    if (Date.now() - entry.timestamp > ttlMs) {
      this.cache.delete(key);
      return null;
    }
    return entry.data;
  }

  invalidate(keyPrefix: string): void {
    for (const key of this.cache.keys()) {
      if (key.startsWith(keyPrefix)) {
        this.cache.delete(key);
      }
    }
  }

  clear(): void {
    this.cache.clear();
  }
}

export const queryCache = new SimpleQueryCache();
