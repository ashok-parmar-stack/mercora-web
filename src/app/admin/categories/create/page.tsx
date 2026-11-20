"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PageHeader } from "../../../../components/layout/PageHeader";
import { CategoryForm } from "../../../../components/categories/CategoryForm";
import {
  createProductCategory,
  fetchProductCategories,
} from "../../../../lib/catalog-api";
import { ProductCategory, CreateProductCategoryInput } from "@mercora/shared-types";
import { useUIStore } from "../../../../lib/store/ui-store";

function CreateCategoryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedParentId = searchParams.get("parentId") || "";

  const addToast = useUIStore((s) => s.addToast);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProductCategories({ limit: 1000 })
      .then((res) => {
        setCategories(res.items || []);
      })
      .catch((err) => {
        setError(err?.message || "Failed to load category hierarchy");
      });
  }, []);

  const handleSubmit = async (formData: CreateProductCategoryInput) => {
    setError(null);
    setIsSubmitting(true);
    try {
      await createProductCategory(formData);
      addToast(
        "success",
        "Category Created",
        `Successfully created category "${formData.name.trim()}".`
      );
      router.push("/admin/categories");
    } catch (err: any) {
      setError(err?.message || "Failed to create category");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Create Product Category"
        description="Add a new root node or child subcategory to the Mercora global product taxonomy."
        backHref="/admin/categories"
      />

      <CategoryForm
        mode="create"
        categories={categories}
        preselectedParentId={preselectedParentId}
        onSubmit={handleSubmit as any}
        isSubmitting={isSubmitting}
        error={error}
        cancelHref="/admin/categories"
      />
    </div>
  );
}

export default function CreateCategoryPage() {
  return (
    <Suspense fallback={<div className="p-8 text-xs text-gray-400 font-semibold">Loading form...</div>}>
      <CreateCategoryContent />
    </Suspense>
  );
}
