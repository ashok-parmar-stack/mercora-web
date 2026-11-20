"use client";

import { useRef, useEffect, useCallback } from 'react';
import { isAbortError, RequestAbortManager } from '../api-abort';

export interface UseAbortControllerReturn {
  /**
   * Aborts any in-flight request and generates a fresh AbortSignal for the new request.
   */
  getSignal: (reason?: string) => AbortSignal;
  /**
   * Aborts the active in-flight request if one exists.
   */
  abort: (reason?: string) => void;
  /**
   * Helper to check if a caught error was caused by an abort.
   */
  isAbort: (error: unknown) => boolean;
  /**
   * Direct access to the current AbortController instance ref.
   */
  controllerRef: React.MutableRefObject<AbortController | null>;
}

/**
 * useAbortController
 * ─────────────────────────────────────────────────────────────────────────────
 * React hook that manages AbortController lifecycle:
 * - Automatically cancels previous in-flight requests when a new request starts.
 * - Safely aborts any pending request upon component unmount to prevent leaks.
 * - Prevents stale responses from overwriting newer UI state.
 */
export function useAbortController(): UseAbortControllerReturn {
  const controllerRef = useRef<AbortController | null>(null);

  const abort = useCallback((reason?: string) => {
    if (controllerRef.current) {
      controllerRef.current.abort(reason);
      controllerRef.current = null;
    }
  }, []);

  const getSignal = useCallback(
    (reason = 'Canceled by newer request'): AbortSignal => {
      // 1. Abort previous in-flight request
      if (controllerRef.current) {
        controllerRef.current.abort(reason);
      }
      // 2. Create fresh controller for the incoming request
      const controller = new AbortController();
      controllerRef.current = controller;
      return controller.signal;
    },
    [],
  );

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      if (controllerRef.current) {
        controllerRef.current.abort('Component unmounted');
        controllerRef.current = null;
      }
    };
  }, []);

  return {
    getSignal,
    abort,
    isAbort: isAbortError,
    controllerRef,
  };
}

export { isAbortError, RequestAbortManager };
