"use client";

import { useState, useMemo, useCallback } from "react";
import { useAbortableFetch } from "@/lib/hooks/useAbortableFetch";
import { useTableState } from "@/lib/hooks/useTableState";
import { useTaxonomyStore } from "@/lib/store/taxonomy-store";
import { useUIStore } from "@/lib/store/ui-store";
import {
  createBusinessCategory,
  deleteBusinessCategory,
  fetchAdminBusinessCategories,
  toggleBusinessCategoryStatus,
  updateBusinessCategory,
} from "@/features/business-categories/business-category-api";
import {
  BusinessCategoryItem,
  CreateBusinessCategoryPayload,
  UpdateBusinessCategoryPayload,
} from "@/features/business-categories/types";

export function useBusinessCategoryAdmin() {
  const addToast = useUIStore((s) => s.addToast);
  const clearSelection = useUIStore((s) => s.clearSelection);
  const invalidateTaxonomy = useTaxonomyStore((s) => s.invalidateTaxonomy);

  const { search, setSearch } = useTableState({ defaultPageSize: 10 });
  const [categories, setCategories] = useState<BusinessCategoryItem[]>([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [hierarchyFilter, setHierarchyFilter] = useState("ALL");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<BusinessCategoryItem | null>(null);
  const [prefilledParentId, setPrefilledParentId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<BusinessCategoryItem | null>(null);
  const [bulkDeletingIds, setBulkDeletingIds] = useState<string[] | null>(null);
  const [bulkStatusConfirm, setBulkStatusConfirm] = useState<{
    ids: string[];
    targetStatus: "ACTIVE" | "INACTIVE";
  } | null>(null);

  const { isLoading, error, load: loadCategories } = useAbortableFetch(async (signal) => {
    const res = await fetchAdminBusinessCategories({ limit: 500, signal });
    setCategories(res.data || []);
  }, []);

  const rootCategories = useMemo(() => categories.filter((c) => !c.parentId), [categories]);
  const categoryMap = useMemo(() => {
    const map = new Map<string, BusinessCategoryItem>();
    categories.forEach((c) => map.set(c.id, c));
    return map;
  }, [categories]);

  const stats = useMemo(() => {
    const total = categories.length;
    const roots = categories.filter((c) => !c.parentId).length;
    return {
      total,
      roots,
      subcats: total - roots,
      active: categories.filter((c) => c.isActive !== false).length,
    };
  }, [categories]);

  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => {
      if (search.trim()) {
        const q = search.toLowerCase();
        if (
          !cat.name.toLowerCase().includes(q) &&
          !cat.code?.toLowerCase().includes(q) &&
          !cat.slug?.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      if (statusFilter === "ACTIVE" && cat.isActive === false) return false;
      if (statusFilter === "INACTIVE" && cat.isActive !== false) return false;
      if (hierarchyFilter === "ROOT" && cat.parentId) return false;
      if (hierarchyFilter === "SUBCATEGORY" && !cat.parentId) return false;
      return true;
    });
  }, [categories, search, statusFilter, hierarchyFilter]);

  const refreshAll = useCallback(async () => {
    invalidateTaxonomy();
    await loadCategories();
  }, [invalidateTaxonomy, loadCategories]);

  const handleOpenCreate = useCallback((parentId?: string) => {
    setEditingCategory(null);
    setPrefilledParentId(parentId || null);
    setIsFormOpen(true);
  }, []);

  const handleOpenEdit = useCallback((cat: BusinessCategoryItem) => {
    setEditingCategory(cat);
    setPrefilledParentId(null);
    setIsFormOpen(true);
  }, []);

  const handleSaveCategory = async (
    payload: CreateBusinessCategoryPayload | UpdateBusinessCategoryPayload,
    editingId?: string
  ) => {
    if (editingId) {
      await updateBusinessCategory(editingId, payload as UpdateBusinessCategoryPayload);
      addToast("success", "Category Updated", `"${payload.name}" updated successfully.`);
    } else {
      await createBusinessCategory(payload as CreateBusinessCategoryPayload);
      addToast("success", "Category Created", `"${payload.name}" added to directory.`);
    }
    await refreshAll();
  };

  const handleToggleStatus = useCallback(
    async (cat: BusinessCategoryItem) => {
      const nextStatus = cat.isActive === false;
      setCategories((prev) =>
        prev.map((c) => (c.id === cat.id ? { ...c, isActive: nextStatus } : c))
      );
      try {
        await toggleBusinessCategoryStatus(cat.id, nextStatus);
        invalidateTaxonomy();
        addToast("success", "Status Updated", `"${cat.name}" is now ${nextStatus ? "Active" : "Inactive"}.`);
      } catch (err: any) {
        setCategories((prev) =>
          prev.map((c) => (c.id === cat.id ? { ...c, isActive: !nextStatus } : c))
        );
        addToast("error", "Status Update Failed", err?.message || "Could not update category status.");
      }
    },
    [addToast, invalidateTaxonomy]
  );

  const handleDeleteSingle = async () => {
    if (!deleteTarget) return;
    await deleteBusinessCategory(deleteTarget.id);
    addToast("success", "Category Deleted", `"${deleteTarget.name}" removed cleanly.`);
    setDeleteTarget(null);
    await refreshAll();
  };

  const handleBulkDelete = async () => {
    if (!bulkDeletingIds?.length) return;
    let deleted = 0;
    let blocked = 0;
    for (const id of bulkDeletingIds) {
      try {
        await deleteBusinessCategory(id);
        deleted++;
      } catch {
        blocked++;
      }
    }
    clearSelection("business-categories-table");
    setBulkDeletingIds(null);
    await refreshAll();
    if (blocked > 0) {
      addToast("warning", "Partial Bulk Deletion", `${deleted} deleted, ${blocked} skipped due to dependencies.`);
    } else {
      addToast("success", "Categories Deleted", `${deleted} categories removed successfully.`);
    }
  };

  const handleBulkStatus = async () => {
    if (!bulkStatusConfirm) return;
    const nextActive = bulkStatusConfirm.targetStatus === "ACTIVE";
    await Promise.all(bulkStatusConfirm.ids.map((id) => toggleBusinessCategoryStatus(id, nextActive)));
    clearSelection("business-categories-table");
    addToast("success", "Bulk Status Updated", `${bulkStatusConfirm.ids.length} categories marked as ${bulkStatusConfirm.targetStatus}.`);
    setBulkStatusConfirm(null);
    await refreshAll();
  };

  return {
    categories,
    rootCategories,
    categoryMap,
    stats,
    filteredCategories,
    isLoading,
    error,
    loadCategories,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    hierarchyFilter,
    setHierarchyFilter,
    isFormOpen,
    setIsFormOpen,
    editingCategory,
    prefilledParentId,
    deleteTarget,
    setDeleteTarget,
    bulkDeletingIds,
    setBulkDeletingIds,
    bulkStatusConfirm,
    setBulkStatusConfirm,
    handleOpenCreate,
    handleOpenEdit,
    handleSaveCategory,
    handleToggleStatus,
    handleDeleteSingle,
    handleBulkDelete,
    handleBulkStatus,
  };
}
