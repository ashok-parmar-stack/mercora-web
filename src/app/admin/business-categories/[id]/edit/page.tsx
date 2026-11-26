"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  fetchAdminBusinessCategories,
  updateBusinessCategory,
} from "@/features/business-categories/business-category-api";
import { BusinessCategoryForm } from "@/features/business-categories/components/BusinessCategoryForm";
import {
  BusinessCategoryItem,
  UpdateBusinessCategoryPayload,
} from "@/features/business-categories/types";
import { LoadingState, ErrorState } from "@/components/common";
import { useUIStore } from "@/lib/store/ui-store";
import { useTaxonomyStore } from "@/lib/store/taxonomy-store";

export default function EditBusinessCategoryPage() {
  const params = useParams();
  const router = useRouter();
  const addToast = useUIStore((s) => s.addToast);
  const categoryId = String(params?.id || "");

  const [categories, setCategories] = useState<BusinessCategoryItem[]>([]);
  const [target, setTarget] = useState<BusinessCategoryItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetchAdminBusinessCategories({ limit: 200 })
      .then((res) => {
        const list = res.data || [];
        setCategories(list);
        const found = list.find((c) => c.id === categoryId) || null;
        setTarget(found);
        if (!found) setError("Business category not found.");
      })
      .catch((err: any) => setError(err?.message || "Failed to load business category."))
      .finally(() => setIsLoading(false));
  }, [categoryId]);

  if (isLoading) return <LoadingState message="Loading business category..." />;
  if (!target && error) {
    return (
      <ErrorState
        title="Category Not Found"
        message={error}
        onRetry={() => router.push("/admin/business-categories")}
      />
    );
  }

  const rootCategories = categories.filter((c) => !c.parentId);

  const handleSubmit = async (payload: UpdateBusinessCategoryPayload) => {
    setError(null);
    setIsSubmitting(true);
    try {
      await updateBusinessCategory(categoryId, payload);
      useTaxonomyStore.getState().invalidateTaxonomy();
      addToast("success", "Category Updated", `${payload.name || target?.name} has been updated.`);
      router.push("/admin/business-categories");
    } catch (err: any) {
      setError(err?.message || "Failed to update business category.");
      setIsSubmitting(false);
    }
  };

  return (
    <BusinessCategoryForm
      mode="edit"
      initialData={target}
      rootCategories={rootCategories}
      defaultOrder={target?.displayOrder ?? 1}
      isSubmitting={isSubmitting}
      error={error}
      cancelHref="/admin/business-categories"
      onSubmit={handleSubmit as any}
    />
  );
}
