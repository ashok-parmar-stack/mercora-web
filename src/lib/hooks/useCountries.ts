"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Country,
  CountryQueryParams,
  CreateCountryInput,
  UpdateCountryInput,
  GeographicPagination,
} from '@mercora/shared-types';
import {
  fetchCountries,
  createCountry as apiCreateCountry,
  updateCountry as apiUpdateCountry,
  updateCountryStatus as apiUpdateCountryStatus,
  deleteCountry as apiDeleteCountry,
  seedBaselineCountries as apiSeedBaseline,
} from '../geography-api';
import { isAbortError } from '../api-abort';

interface UseCountriesOptions {
  initialParams?: CountryQueryParams;
  autoFetch?: boolean;
}

export function useCountries(options: UseCountriesOptions = {}) {
  const { initialParams = { page: 1, limit: 20 }, autoFetch = true } = options;

  const [countries, setCountries] = useState<Country[]>([]);
  const [pagination, setPagination] = useState<GeographicPagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1,
  });
  const [params, setParams] = useState<CountryQueryParams>(initialParams);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Maintain AbortController for active request
  const abortControllerRef = useRef<AbortController | null>(null);

  const loadData = useCallback(async (queryParams: CountryQueryParams) => {
    // 1. Abort previous in-flight request if one is still running
    if (abortControllerRef.current) {
      abortControllerRef.current.abort('Canceled by subsequent request');
    }

    // 2. Create new AbortController for this request
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);
    setError(null);

    try {
      // 3. Send request using the active signal
      const res = await fetchCountries(queryParams, { signal: controller.signal });

      // If aborted while awaiting, ignore stale result
      if (controller.signal.aborted) {
        return;
      }

      // 4. Only the latest response updates UI/state
      setCountries(res?.items || []);
      setPagination(
        res?.pagination || {
          page: queryParams.page || 1,
          limit: queryParams.limit || 10,
          total: (res?.items || []).length,
          totalPages: 1,
        },
      );
      setIsLoading(false);
    } catch (err: any) {
      // 5. Intentionally aborted requests must not show an error or alter UI
      if (isAbortError(err) || controller.signal.aborted) {
        return;
      }
      setError(err?.message || 'Failed to load countries');
      setCountries([]);
      setIsLoading(false);
    } finally {
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
      }
    }
  }, []);

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort('Component unmounted');
        abortControllerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (autoFetch) {
      loadData(params);
    }
  }, [autoFetch, params, loadData]);

  const updateFilters = useCallback((newParams: Partial<CountryQueryParams>) => {
    setParams((prev) => ({
      ...prev,
      ...newParams,
      page: newParams.page ?? (newParams.search !== undefined || newParams.status !== undefined ? 1 : prev.page),
    }));
  }, []);

  const create = useCallback(
    async (payload: CreateCountryInput) => {
      const created = await apiCreateCountry(payload);
      await loadData(params);
      return created;
    },
    [loadData, params],
  );

  const update = useCallback(
    async (idOrCode: string, payload: UpdateCountryInput) => {
      // Optimistically update list in state
      setCountries((prev) =>
        prev.map((c) => {
          if (c.id === idOrCode || c.iso2Code === idOrCode) {
            const isAct = payload.status
              ? payload.status.toUpperCase() === 'ACTIVE'
              : c.status?.isActive ?? true;
            return {
              ...c,
              ...payload,
              status: payload.status
                ? {
                    id: isAct ? 's1' : 's2',
                    type: 'GEOGRAPHY',
                    code: payload.status.toUpperCase(),
                    name: isAct ? 'Active' : 'Inactive',
                    isActive: isAct,
                  }
                : c.status,
            };
          }
          return c;
        }),
      );
      const updated = await apiUpdateCountry(idOrCode, payload);
      await loadData(params);
      return updated;
    },
    [loadData, params],
  );

  const toggleStatus = useCallback(
    async (idOrCode: string, currentStatus?: string | boolean) => {
      let isCurrentlyActive = true;
      if (typeof currentStatus === 'boolean') {
        isCurrentlyActive = currentStatus;
      } else if (typeof currentStatus === 'string') {
        isCurrentlyActive = currentStatus.toUpperCase() === 'ACTIVE';
      }

      const target = isCurrentlyActive ? 'INACTIVE' : 'ACTIVE';

      // Immediate optimistic update
      setCountries((prev) =>
        prev.map((c) => {
          if (c.id === idOrCode || c.iso2Code === idOrCode) {
            const isAct = target === 'ACTIVE';
            return {
              ...c,
              status: {
                id: isAct ? 's1' : 's2',
                type: 'GEOGRAPHY',
                code: target,
                name: isAct ? 'Active' : 'Inactive',
                isActive: isAct,
              },
            };
          }
          return c;
        }),
      );

      const updated = await apiUpdateCountryStatus(idOrCode, target);
      await loadData(params);
      return updated;
    },
    [loadData, params],
  );

  const remove = useCallback(
    async (idOrCode: string) => {
      await apiDeleteCountry(idOrCode);
      await loadData(params);
    },
    [loadData, params],
  );

  const seedBaseline = useCallback(async () => {
    const res = await apiSeedBaseline();
    await loadData(params);
    return res;
  }, [loadData, params]);

  return {
    countries,
    pagination,
    isLoading,
    error,
    filters: params,
    updateFilters,
    create,
    update,
    toggleStatus,
    remove,
    seedBaseline,
    refetch: () => loadData(params),
  };
}
