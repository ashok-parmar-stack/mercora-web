import { useState, useEffect, useCallback } from 'react';
import {
  ProductCategory,
  CategoryTreeNode,
  CreateProductCategoryInput,
  UpdateProductCategoryInput,
  MoveProductCategoryInput,
} from '@mercora/shared-types';
import {
  fetchProductCategories,
  fetchCategoryTree,
  createProductCategory,
  updateProductCategory,
  moveProductCategory,
  deleteProductCategory,
  seedBaselineCategories,
} from '../catalog-api';

export function useProductCategories(params?: {
  page?: number;
  limit?: number;
  search?: string;
  parent_id?: string;
  level?: number;
  status?: string;
}) {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [tree, setTree] = useState<CategoryTreeNode[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 1,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isTreeLoading, setIsTreeLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchProductCategories(params);
      setCategories(res.items || []);
      setPagination(res.pagination);
    } catch (err: any) {
      setError(err?.message || 'Failed to load product categories');
    } finally {
      setIsLoading(false);
    }
  }, [JSON.stringify(params)]);

  const loadTree = useCallback(async () => {
    setIsTreeLoading(true);
    try {
      const res = await fetchCategoryTree();
      setTree(res || []);
    } catch (err: any) {
      setError(err?.message || 'Failed to load category tree');
    } finally {
      setIsTreeLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    loadTree();
  }, [loadTree]);

  const create = async (input: CreateProductCategoryInput) => {
    const res = await createProductCategory(input);
    await Promise.all([loadCategories(), loadTree()]);
    return res;
  };

  const update = async (id: string, input: UpdateProductCategoryInput) => {
    const res = await updateProductCategory(id, input);
    await Promise.all([loadCategories(), loadTree()]);
    return res;
  };

  const move = async (id: string, input: MoveProductCategoryInput) => {
    const res = await moveProductCategory(id, input);
    await Promise.all([loadCategories(), loadTree()]);
    return res;
  };

  const remove = async (id: string) => {
    await deleteProductCategory(id);
    await Promise.all([loadCategories(), loadTree()]);
  };

  const seed = async () => {
    const res = await seedBaselineCategories();
    await Promise.all([loadCategories(), loadTree()]);
    return res;
  };

  return {
    categories,
    tree,
    pagination,
    isLoading,
    isTreeLoading,
    error,
    refetch: loadCategories,
    refetchTree: loadTree,
    create,
    update,
    move,
    remove,
    seedBaseline: seed,
  };
}
