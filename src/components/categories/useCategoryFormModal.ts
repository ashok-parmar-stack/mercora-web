"use client";

import { useState } from "react";
import { ProductCategory } from "@mercora/shared-types";
import { useUIStore } from "@/lib/store/ui-store";

interface CategoryFormDataState {
  name: string;
  code: string;
  slug: string;
  parentId: string;
  description: string;
  icon: string;
  sortOrder: number;
  isSystem: boolean;
  status: string;
}

const EMPTY_FORM_DATA: CategoryFormDataState = {
  name: "",
  code: "",
  slug: "",
  parentId: "",
  description: "",
  icon: "Layers",
  sortOrder: 0,
  isSystem: false,
  status: "ACTIVE",
};

interface UseCategoryFormModalProps {
  create: (dto: any) => Promise<any>;
  update: (id: string, dto: any) => Promise<any>;
  move: (id: string, dto: any) => Promise<any>;
  onMutated: () => void;
}

export function useCategoryFormModal({
  create,
  update,
  move,
  onMutated,
}: UseCategoryFormModalProps) {
  const addToast = useUIStore((s) => s.addToast);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | null>(null);
  const [formData, setFormData] = useState<CategoryFormDataState>(EMPTY_FORM_DATA);
  const [targetParentId, setTargetParentId] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenCreate = (parent?: ProductCategory) => {
    setFormError(null);
    setFormData({
      ...EMPTY_FORM_DATA,
      parentId: parent ? parent.id : "",
      icon: parent ? "Grid" : "Layers",
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
      onMutated();
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
      onMutated();
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
      await move(selectedCategory.id, { newParentId: targetParentId || null });
      addToast("success", "Category Moved", `Successfully moved "${selectedCategory.name}"`);
      setIsMoveModalOpen(false);
      onMutated();
    } catch (err: any) {
      setFormError(err?.message || "Failed to reparent category");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isCreateModalOpen,
    setIsCreateModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    isMoveModalOpen,
    setIsMoveModalOpen,
    selectedCategory,
    setSelectedCategory,
    formData,
    setFormData,
    targetParentId,
    setTargetParentId,
    formError,
    isSubmitting,
    handleOpenCreate,
    handleOpenEdit,
    handleOpenMove,
    handleSaveCreate,
    handleSaveEdit,
    handleSaveMove,
  };
}
