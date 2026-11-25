import { useState, useCallback } from "react";
import { ProductCategory } from "@mercora/shared-types";
import { useUIStore } from "../../lib/store/ui-store";
import { useCategoryFormModal } from "./useCategoryFormModal";
import { useCategoryHsnMapping } from "./useCategoryHsnMapping";

interface UseCategoryOperationsProps {
  categories: ProductCategory[];
  create: (dto: any) => Promise<any>;
  update: (id: string, dto: any) => Promise<any>;
  move: (id: string, dto: any) => Promise<any>;
  remove: (id: string) => Promise<any>;
  seedBaseline: () => Promise<any>;
  refetch: () => Promise<any>;
  refetchTree: () => Promise<any>;
}

export function useCategoryOperations({
  create,
  update,
  move,
  remove,
  seedBaseline,
  refetch,
  refetchTree,
}: UseCategoryOperationsProps) {
  const addToast = useUIStore((s) => s.addToast);

  const [isSeeding, setIsSeeding] = useState(false);
  const [viewingCategory, setViewingCategory] = useState<ProductCategory | null>(null);
  const [deleteConfirmCategory, setDeleteConfirmCategory] = useState<ProductCategory | null>(null);
  const [bulkDeletingIds, setBulkDeletingIds] = useState<string[] | null>(null);
  const [bulkStatusConfirm, setBulkStatusConfirm] = useState<{
    ids: string[];
    targetStatus: "ACTIVE" | "INACTIVE";
  } | null>(null);

  const onMutated = useCallback(() => {
    refetch();
    refetchTree();
  }, [refetch, refetchTree]);

  const modal = useCategoryFormModal({ create, update, move, onMutated });
  const hsn = useCategoryHsnMapping(
    modal.selectedCategory,
    modal.setSelectedCategory,
    onMutated
  );

  const handleSeedBaseline = async () => {
    setIsSeeding(true);
    try {
      const res = await seedBaseline();
      addToast(
        "success",
        "Baseline Categories Seeded",
        `${res.seeded} categories added, ${res.skipped} already existed.`
      );
      onMutated();
    } catch (err: any) {
      addToast("error", "Seeding Failed", err?.message || "Failed to seed baseline categories");
    } finally {
      setIsSeeding(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!deleteConfirmCategory) return;
    try {
      await remove(deleteConfirmCategory.id);
      addToast("success", "Category Deleted", `Successfully deleted "${deleteConfirmCategory.name}"`);
      setDeleteConfirmCategory(null);
      onMutated();
    } catch (err: any) {
      addToast("error", "Failed to Delete", err?.message || "Failed to delete category");
    }
  };

  const handleBulkDelete = async () => {
    if (!bulkDeletingIds) return;
    try {
      await Promise.all(bulkDeletingIds.map((id) => remove(id)));
      addToast("success", "Categories Deleted", `Successfully removed ${bulkDeletingIds.length} categories`);
      setBulkDeletingIds(null);
      onMutated();
    } catch (err: any) {
      addToast("error", "Bulk Delete Failed", err?.message || "Failed to delete categories");
    }
  };

  const handleBulkStatusUpdate = async () => {
    if (!bulkStatusConfirm) return;
    try {
      await Promise.all(
        bulkStatusConfirm.ids.map((id) => update(id, { status: bulkStatusConfirm.targetStatus }))
      );
      addToast(
        "success",
        "Status Updated",
        `Updated status to ${bulkStatusConfirm.targetStatus} for ${bulkStatusConfirm.ids.length} categories`
      );
      setBulkStatusConfirm(null);
      onMutated();
    } catch (err: any) {
      addToast("error", "Status Update Failed", err?.message || "Failed to update category status");
    }
  };

  return {
    isSeeding,
    viewingCategory,
    setViewingCategory,
    deleteConfirmCategory,
    setDeleteConfirmCategory,
    bulkDeletingIds,
    setBulkDeletingIds,
    bulkStatusConfirm,
    setBulkStatusConfirm,
    handleSeedBaseline,
    handleDeleteCategory,
    handleBulkDelete,
    handleBulkStatusUpdate,
    ...modal,
    ...hsn,
  };
}
