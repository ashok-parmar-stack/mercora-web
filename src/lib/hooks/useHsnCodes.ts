import { useState, useEffect, useCallback } from 'react';
import {
  HsnCode,
  HsnTreeNode,
  CreateHsnCodeInput,
  UpdateHsnCodeInput,
} from '@mercora/shared-types';
import {
  fetchHsnCodes,
  fetchHsnTree,
  createHsnCode,
  updateHsnCode,
  deleteHsnCode,
  triggerHsnSync,
} from '../catalog-api';

export function useHsnCodes(params?: {
  page?: number;
  limit?: number;
  search?: string;
  level?: string;
  parent_id?: string;
  status?: string;
  source?: string;
  is_leaf?: boolean;
}) {
  const [hsnCodes, setHsnCodes] = useState<HsnCode[]>([]);
  const [tree, setTree] = useState<HsnTreeNode[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 1,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isTreeLoading, setIsTreeLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadHsns = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchHsnCodes(params);
      setHsnCodes(res.items || []);
      setPagination(res.pagination);
    } catch (err: any) {
      setError(err?.message || 'Failed to load HSN codes');
    } finally {
      setIsLoading(false);
    }
  }, [JSON.stringify(params)]);

  const loadTree = useCallback(async (rootCode?: string) => {
    setIsTreeLoading(true);
    try {
      const res = await fetchHsnTree(rootCode);
      setTree(res || []);
    } catch (err: any) {
      setError(err?.message || 'Failed to load HSN tree');
    } finally {
      setIsTreeLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHsns();
  }, [loadHsns]);

  const create = async (input: CreateHsnCodeInput) => {
    const res = await createHsnCode(input);
    await loadHsns();
    return res;
  };

  const update = async (id: string, input: UpdateHsnCodeInput) => {
    const res = await updateHsnCode(id, input);
    await loadHsns();
    return res;
  };

  const remove = async (id: string) => {
    await deleteHsnCode(id);
    await loadHsns();
  };

  const sync = async (source = 'ICEGATE') => {
    const res = await triggerHsnSync({ source });
    await loadHsns();
    return res;
  };

  return {
    hsnCodes,
    tree,
    pagination,
    isLoading,
    isTreeLoading,
    error,
    refetch: loadHsns,
    loadTree,
    create,
    update,
    remove,
    sync,
  };
}
