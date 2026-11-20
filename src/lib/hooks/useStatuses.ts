"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Status } from "../admin-types";
import { fetchStatuses } from "../admin-api";
import { useUIStore } from "../store/ui-store";
import { isAbortError } from "../api-abort";

export function useStatuses(param?: string | { type?: string }) {
  const type = typeof param === "string" ? param : param?.type;

  const [statuses, setStatuses] = useState<Status[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  const load = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort('Canceled by subsequent request');
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);
    setError(null);
    try {
      const res: any = await fetchStatuses(type, { signal: controller.signal });
      if (controller.signal.aborted) {
        return;
      }
      const list = Array.isArray(res) ? res : res?.data || [];
      setStatuses(list);
      setIsLoading(false);
    } catch (err: any) {
      if (isAbortError(err) || controller.signal.aborted) {
        return;
      }
      setStatuses([]);
      setIsLoading(false);
    } finally {
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
      }
    }
  }, [type]);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort('Component unmounted');
        abortControllerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return {
    statuses,
    isLoading,
    error,
    refetch: load,
  };
}
