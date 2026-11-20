"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { PageHeader } from "../../../../../components/layout/PageHeader";
import { CategoryForm } from "../../../../../components/categories/CategoryForm";
import {
  fetchCategoryById,
  updateProductCategory,
  fetchProductCategories,
} from "../../../../../lib/catalog-api";
import { ProductCategory, UpdateProductCategoryInput } from "@mercora/shared-types";
import { useUIStore } from "../../../../../lib/store/ui-store";

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const categoryId = params?.id as string;

  const addToast = useUIStore((s) => s.addToast);
  const [category, setCategory] = useState<ProductCategory | null>(null);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!categoryId) return;
    setIsLoading(true);
    Promise.all([
      fetchCategoryById(categoryId),
      fetchProductCategories({ limit: 1000 }),
    ])
      .then(([cat, catsRes]) => {
        setCategory(cat);
        setCategories(catsRes.items || []);
      })
      .catch((err) => {
        setError(err?.message || "Failed to load category details");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [categoryId]);

  const handleSubmit = async (formData: UpdateProductCategoryInput) => {
    if (!categoryId) return;
    setError(null);
    setIsSubmitting(true);
    try {
      await updateProductCategory(categoryId, formData);
      addToast(
        "success",
        "Category Updated",
        `Successfully updated "${formData.name?.trim() || category?.name}".`
      );
      router.push("/admin/categories");
    } catch (err: any) {
      setError(err?.message || "Failed to update category");
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center text-gray-400 gap-3">
        <RefreshCw className="w-8 h-8 animate-spin text-brand-600" />
        <span className="text-xs font-semibold text-gray-600">Loading category specifications...</span>
      </div>
    );
  }

  if (!category && !isLoading) {
    return (
      <div className="p-8 bg-rose-50 border border-rose-200 rounded-2xl text-center max-w-lg mx-auto">
        <h3 className="font-extrabold text-sm text-rose-800">Category Not Found</h3>
        <p className="text-xs text-rose-600 mt-1">
          The requested category ID could not be loaded or may have been removed.
        </p>
        <button
          type="button"
          onClick={() => router.push("/admin/categories")}
          className="mt-4 px-4 py-2 text-xs font-bold text-white bg-rose-600 rounded-xl hover:bg-rose-700 shadow-xs cursor-pointer"
        >
          Return to Categories List
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={`Edit Category: ${category?.name || "Product Category"}`}
        description="Modify category display name, code, slug, description, and status settings."
        backHref="/admin/categories"
      />

      <CategoryForm
        mode="edit"
        initialData={category!}
        categories={categories}
        onSubmit={handleSubmit as any}
        isSubmitting={isSubmitting}
        error={error}
        cancelHref="/admin/categories"
      />
    </div>
  );
}
