"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  createBusinessCategory,
  fetchAdminBusinessCategories,
} from "@/features/business-categories/business-category-api";
import { BusinessCategoryForm } from "@/features/business-categories/components/BusinessCategoryForm";
import {
  BusinessCategoryItem,
  CreateBusinessCategoryPayload,
} from "@/features/business-categories/types";
import { useUIStore } from "@/lib/store/ui-store";
import { useTaxonomyStore } from "@/lib/store/taxonomy-store";

function CreateBusinessCategoryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const addToast = useUIStore((s) => s.addToast);
  const prefilledParentId = searchParams.get("parentId");

  const [categories, setCategories] = useState<BusinessCategoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchAdminBusinessCategories({ limit: 200 })
      .then((res) => setCategories(res.data || []))
      .catch(() => {});
  }, []);

  const rootCategories = categories.filter((c) => !c.parentId);

  const handleSubmit = async (payload: CreateBusinessCategoryPayload) => {
    setError(null);
    setIsSubmitting(true);
    try {
      await createBusinessCategory(payload);
      useTaxonomyStore.getState().invalidateTaxonomy();
      addToast("success", "Category Created", `${payload.name} has been added.`);
      router.push("/admin/business-categories");
    } catch (err: any) {
      setError(err?.message || "Failed to create business category.");
      setIsSubmitting(false);
    }
  };

  return (
    <BusinessCategoryForm
      mode="create"
      prefilledParentId={prefilledParentId}
      rootCategories={rootCategories}
      defaultOrder={categories.length + 1}
      isSubmitting={isSubmitting}
      error={error}
      cancelHref="/admin/business-categories"
      onSubmit={handleSubmit as any}
    />
  );
}

export default function CreateBusinessCategoryPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-text-muted">Loading...</div>}>
      <CreateBusinessCategoryContent />
    </Suspense>
  );
}
