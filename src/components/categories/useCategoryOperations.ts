import { useState } from "react";
import { ProductCategory, HsnCode, HsnCodeCategoryMapping } from "@mercora/shared-types";
import { useUIStore } from "../../lib/store/ui-store";
import {
  fetchHsnsForCategory,
  mapCategoryToHsn,
  unmapCategoryFromHsn,
  fetchHsnCodes,
} from "../../lib/catalog-api";

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
  categories,
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
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [isMapHsnModalOpen, setIsMapHsnModalOpen] = useState(false);
  const [viewingCategory, setViewingCategory] = useState<ProductCategory | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | null>(null);
  const [deleteConfirmCategory, setDeleteConfirmCategory] = useState<ProductCategory | null>(null);
  const [bulkDeletingIds, setBulkDeletingIds] = useState<string[] | null>(null);
  const [bulkStatusConfirm, setBulkStatusConfirm] = useState<{
    ids: string[];
    targetStatus: "ACTIVE" | "INACTIVE";
  } | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    slug: "",
    parentId: "",
    description: "",
    icon: "Layers",
    sortOrder: 0,
    isSystem: false,
    status: "ACTIVE",
  });
  const [targetParentId, setTargetParentId] = useState<string>("");
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mapping Modal State
  const [mappedHsns, setMappedHsns] = useState<HsnCodeCategoryMapping[]>([]);
  const [availableHsns, setAvailableHsns] = useState<HsnCode[]>([]);
  const [selectedHsnToMap, setSelectedHsnToMap] = useState("");
  const [isPrimaryMapping, setIsPrimaryMapping] = useState(false);
  const [isLoadingMappings, setIsLoadingMappings] = useState(false);

  // Handlers
  const handleSeedBaseline = async () => {
    setIsSeeding(true);
    try {
      const res = await seedBaseline();
      addToast(
        "success",
        "Baseline Categories Seeded",
        `${res.seeded} categories added, ${res.skipped} already existed.`
      );
      refetch();
      refetchTree();
    } catch (err: any) {
      addToast("error", "Seeding Failed", err?.message || "Failed to seed baseline categories");
    } finally {
      setIsSeeding(false);
    }
  };

  const handleOpenCreate = (parent?: ProductCategory) => {
    setFormError(null);
    setFormData({
      name: "",
      code: "",
      slug: "",
      parentId: parent ? parent.id : "",
      description: "",
      icon: parent ? "Grid" : "Layers",
      sortOrder: 0,
      isSystem: false,
      status: "ACTIVE",
    });
    setIsCreateModalOpen(true);
  };

  const handleOpenEdit = (cat: ProductCategory) => {
    setSelectedCategory(cat);
    setFormError(null);
    setFormData({
      name: cat.name,
      code: cat.code,
      slug: cat.slug,
      parentId: cat.parentId || "",
      description: cat.description || "",
      icon: cat.icon || "Layers",
      sortOrder: cat.sortOrder || 0,
      isSystem: cat.isSystem,
      status: cat.status?.code || "ACTIVE",
    });
    setIsEditModalOpen(true);
  };

  const handleOpenMove = (cat: ProductCategory) => {
    setSelectedCategory(cat);
    setTargetParentId(cat.parentId || "");
    setFormError(null);
    setIsMoveModalOpen(true);
  };

  const handleOpenMapHsn = async (cat: ProductCategory) => {
    setSelectedCategory(cat);
    setSelectedHsnToMap("");
    setIsPrimaryMapping(false);
    setIsLoadingMappings(true);
    setIsMapHsnModalOpen(true);
    try {
      const [maps, allHsns] = await Promise.all([
        fetchHsnsForCategory(cat.id),
        fetchHsnCodes({ limit: 1000 }),
      ]);
      setMappedHsns(maps);
      setAvailableHsns(allHsns.items || []);
    } catch (err: any) {
      addToast("error", "Failed to load mappings", err?.message || "Could not retrieve mappings");
    } finally {
      setIsLoadingMappings(false);
    }
  };

  const handleSaveCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError("Category name is required.");
      return;
    }
    setIsSubmitting(true);
    setFormError(null);
    try {
      await create({
        name: formData.name.trim(),
        code: formData.code.trim() || undefined,
        slug: formData.slug.trim() || undefined,
        parentId: formData.parentId || undefined,
        description: formData.description.trim() || undefined,
        icon: formData.icon || "Layers",
        sortOrder: Number(formData.sortOrder) || 0,
        isSystem: false,
        status: formData.status as any,
      });
      addToast("success", "Category Created", `Successfully created "${formData.name.trim()}"`);
      setIsCreateModalOpen(false);
      refetch();
      refetchTree();
    } catch (err: any) {
      setFormError(err?.message || "Failed to create category");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory) return;
    if (!formData.name.trim()) {
      setFormError("Category name is required.");
      return;
    }
    setIsSubmitting(true);
    setFormError(null);
    try {
      await update(selectedCategory.id, {
        name: formData.name.trim(),
        code: formData.code.trim() || undefined,
        slug: formData.slug.trim() || undefined,
        description: formData.description.trim() || undefined,
        sortOrder: Number(formData.sortOrder) || 0,
        status: formData.status as any,
      });
      addToast("success", "Category Updated", `Successfully updated "${formData.name.trim()}"`);
      setIsEditModalOpen(false);
      refetch();
      refetchTree();
    } catch (err: any) {
      setFormError(err?.message || "Failed to update category");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveMove = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory) return;
    setIsSubmitting(true);
    setFormError(null);
    try {
      await move(selectedCategory.id, {
        newParentId: targetParentId || null,
      });
      addToast("success", "Category Moved", `Successfully moved "${selectedCategory.name}"`);
      setIsMoveModalOpen(false);
      refetch();
      refetchTree();
    } catch (err: any) {
      setFormError(err?.message || "Failed to reparent category");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddHsnMapping = async () => {
    if (!selectedCategory || !selectedHsnToMap) return;
    try {
      await mapCategoryToHsn(selectedHsnToMap, {
        productCategoryId: selectedCategory.id,
        isPrimary: isPrimaryMapping,
      });
      const updated = await fetchHsnsForCategory(selectedCategory.id);
      setMappedHsns(updated);
      setSelectedHsnToMap("");
      setIsPrimaryMapping(false);
      addToast("success", "HSN Code Mapped", "Successfully associated HSN code with category");
      refetch();
      refetchTree();
    } catch (err: any) {
      addToast("error", "Failed to Map HSN", err?.message || "Could not complete mapping");
    }
  };

  const handleRemoveHsnMapping = async (hsnCodeId: string) => {
    if (!selectedCategory) return;
    try {
      await unmapCategoryFromHsn(hsnCodeId, selectedCategory.id);
      const updated = await fetchHsnsForCategory(selectedCategory.id);
      setMappedHsns(updated);
      addToast("info", "HSN Mapping Removed", "Successfully unmapped HSN code");
      refetch();
      refetchTree();
    } catch (err: any) {
      addToast("error", "Failed to Unmap HSN", err?.message || "Could not remove mapping");
    }
  };

  const handleDeleteCategory = async () => {
    if (!deleteConfirmCategory) return;
    try {
      await remove(deleteConfirmCategory.id);
      addToast("success", "Category Deleted", `Successfully deleted "${deleteConfirmCategory.name}"`);
      setDeleteConfirmCategory(null);
      refetch();
      refetchTree();
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
      refetch();
      refetchTree();
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
      refetch();
      refetchTree();
    } catch (err: any) {
      addToast("error", "Status Update Failed", err?.message || "Failed to update category status");
    }
  };

  return {
    isSeeding,
    isCreateModalOpen,
    setIsCreateModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    isMoveModalOpen,
    setIsMoveModalOpen,
    isMapHsnModalOpen,
    setIsMapHsnModalOpen,
    viewingCategory,
    setViewingCategory,
    selectedCategory,
    deleteConfirmCategory,
    setDeleteConfirmCategory,
    bulkDeletingIds,
    setBulkDeletingIds,
    bulkStatusConfirm,
    setBulkStatusConfirm,
    formData,
    setFormData,
    targetParentId,
    setTargetParentId,
    formError,
    isSubmitting,
    mappedHsns,
    availableHsns,
    selectedHsnToMap,
    setSelectedHsnToMap,
    isPrimaryMapping,
    setIsPrimaryMapping,
    isLoadingMappings,
    handleSeedBaseline,
    handleOpenCreate,
    handleOpenEdit,
    handleOpenMove,
    handleOpenMapHsn,
    handleSaveCreate,
    handleSaveEdit,
    handleSaveMove,
    handleAddHsnMapping,
    handleRemoveHsnMapping,
    handleDeleteCategory,
    handleBulkDelete,
    handleBulkStatusUpdate,
  };
}
