"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  SubDistrict,
  SubDistrictQueryParams,
  CreateSubDistrictInput,
  UpdateSubDistrictInput,
  GeographicPagination,
} from '@mercora/shared-types';
import {
  fetchSubDistricts,
  createSubDistrict as apiCreateSubDistrict,
  updateSubDistrict as apiUpdateSubDistrict,
  updateSubDistrictStatus as apiUpdateSubDistrictStatus,
  deleteSubDistrict as apiDeleteSubDistrict,
} from '../geography-api';
import { isAbortError } from '../api-abort';

interface UseSubDistrictsOptions {
  initialParams?: SubDistrictQueryParams;
  autoFetch?: boolean;
}

export function useSubDistricts(options: UseSubDistrictsOptions = {}) {
  const { initialParams = { page: 1, limit: 10 }, autoFetch = true } = options;

  const [subDistricts, setSubDistricts] = useState<SubDistrict[]>([]);
  const [pagination, setPagination] = useState<GeographicPagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [params, setParams] = useState<SubDistrictQueryParams>(initialParams);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  const loadData = useCallback(async (queryParams: SubDistrictQueryParams) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort('Canceled by subsequent request');
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetchSubDistricts(queryParams, { signal: controller.signal });

      if (controller.signal.aborted) {
        return;
      }

      setSubDistricts(res?.items || []);
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
      if (isAbortError(err) || controller.signal.aborted) {
        return;
      }
      setError(err?.message || 'Failed to load sub-districts');
      setSubDistricts([]);
      setIsLoading(false);
    } finally {
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
      }
    }
  }, []);

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

  const updateFilters = useCallback((newParams: Partial<SubDistrictQueryParams>) => {
    setParams((prev) => ({
      ...prev,
      ...newParams,
      page: newParams.page ?? (newParams.search !== undefined || newParams.status !== undefined ? 1 : prev.page),
    }));
  }, []);

  const create = useCallback(
    async (payload: CreateSubDistrictInput) => {
      const created = await apiCreateSubDistrict(payload);
      await loadData(params);
      return created;
    },
    [loadData, params],
  );

  const update = useCallback(
    async (idOrCode: string, payload: UpdateSubDistrictInput) => {
      setSubDistricts((prev) =>
        prev.map((c) => {
          if (c.id === idOrCode || c.code === idOrCode) {
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
      const updated = await apiUpdateSubDistrict(idOrCode, payload);
      await loadData(params);
      return updated;
    },
    [loadData, params],
  );

  const toggleStatus = useCallback(
    async (idOrCode: string, currentStatus?: string | boolean) => {
      const isCurrentlyActive =
        typeof currentStatus === 'boolean'
          ? currentStatus
          : typeof currentStatus === 'string'
            ? currentStatus.toUpperCase() !== 'INACTIVE'
            : true;

      const newStatusCode = isCurrentlyActive ? 'INACTIVE' : 'ACTIVE';

      setSubDistricts((prev) =>
        prev.map((c) => {
          if (c.id === idOrCode || c.code === idOrCode) {
            return {
              ...c,
              status: {
                id: isCurrentlyActive ? 's2' : 's1',
                type: 'GEOGRAPHY',
                code: newStatusCode,
                name: isCurrentlyActive ? 'Inactive' : 'Active',
                isActive: !isCurrentlyActive,
              },
            };
          }
          return c;
        }),
      );

      await apiUpdateSubDistrictStatus(idOrCode, newStatusCode);
      await loadData(params);
    },
    [loadData, params],
  );

  const remove = useCallback(
    async (idOrCode: string) => {
      setSubDistricts((prev) => prev.filter((c) => c.id !== idOrCode && c.code !== idOrCode));
      await apiDeleteSubDistrict(idOrCode);
      await loadData(params);
    },
    [loadData, params],
  );

  const refetch = useCallback(() => {
    return loadData(params);
  }, [loadData, params]);

  return {
    subDistricts,
    pagination,
    params,
    isLoading,
    error,
    filters: params,
    updateFilters,
    create,
    update,
    toggleStatus,
    remove,
    refetch,
  };
}
