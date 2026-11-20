/**
 * OPT-01: Shared abortable fetch base hook.
 *
 * Encapsulates the AbortController lifecycle pattern duplicated across all 16
 * resource hooks. Each hook that fetches data can use this as its base.
 *
 * Usage:
 * ```ts
 * const { isLoading, error, load } = useAbortableFetch(async (signal) => {
 *   const res = await fetchRoles(params, { signal });
 *   const list = Array.isArray(res) ? res : res?.data || [];
 *   setRoles(list);
 * });
 * ```
 */

"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { isAbortError } from "../api-abort";

export interface UseAbortableFetchOptions {
  /** If true, auto-triggers `load()` on mount. Defaults to true. */
  autoLoad?: boolean;
  /** Called when an error occurs (non-abort errors only). */
  onError?: (err: any) => void;
}

export interface UseAbortableFetchReturn {
  isLoading: boolean;
  error: string | null;
  /** Trigger (or re-trigger) the fetch. Returns a cleanup abort function. */
  load: () => Promise<void>;
  /** Abort any in-flight request */
  abort: () => void;
}

/**
 * Generic hook that wraps any async fetch function with:
 * - Abort previous in-flight requests on re-trigger
 * - isLoading / error state management
 * - Cleanup on unmount
 * - Ignore stale/aborted responses
 */
export function useAbortableFetch(
  /** The async function to run. Receives the AbortSignal. */
  fetchFn: (signal: AbortSignal) => Promise<void>,
  deps: React.DependencyList = [],
  options: UseAbortableFetchOptions = {}
): UseAbortableFetchReturn {
  const { autoLoad = true, onError } = options;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const abort = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort("Canceled by caller");
      abortControllerRef.current = null;
    }
  }, []);

  const load = useCallback(async () => {
    // Abort any previous in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort("Canceled by subsequent request");
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);
    setError(null);

    try {
      await fetchFn(controller.signal);

      // If aborted while awaiting, do nothing
      if (controller.signal.aborted) return;

      setIsLoading(false);
    } catch (err: any) {
      if (isAbortError(err) || controller.signal.aborted) return;

      const message =
        err?.response?.data?.message || err?.message || "An unexpected error occurred.";
      setError(message);
      setIsLoading(false);
      onError?.(err);
    } finally {
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  // Auto-load on mount / when deps change
  useEffect(() => {
    if (autoLoad) load();
  }, [load, autoLoad]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort("Component unmounted");
        abortControllerRef.current = null;
      }
    };
  }, []);

  return { isLoading, error, load, abort };
}
