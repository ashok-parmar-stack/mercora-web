"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AlertCircle, ArrowLeft, Save, Sparkles } from "lucide-react";
import { ProductCategory, CreateProductCategoryInput, UpdateProductCategoryInput } from "@mercora/shared-types";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Button } from "../ui/Button";
import { commonSchemas, VALIDATION_MESSAGES } from "../../lib/validation/messages";

const categorySchema = z.object({
  name: commonSchemas.name("Category Name", 2),
  code: z.string().optional(),
  slug: commonSchemas.slug,
  parentId: z.string().optional(),
  description: z.string().optional(),
  sortOrder: z.union([z.number(), z.string()]).optional(),
  status: z.string().min(1, VALIDATION_MESSAGES.SELECT_OPTION("status")),
});

export type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryFormProps {
  mode: "create" | "edit";
  initialData?: Partial<ProductCategory>;
  categories?: ProductCategory[];
  preselectedParentId?: string;
  onSubmit: (formData: CreateProductCategoryInput | UpdateProductCategoryInput) => Promise<void>;
  isSubmitting?: boolean;
  error?: string | null;
  cancelHref?: string;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
  mode,
  initialData,
  categories = [],
  preselectedParentId,
  onSubmit,
  isSubmitting = false,
  error = null,
  cancelHref = "/admin/categories",
}) => {
  const router = useRouter();
  const [autoSlug, setAutoSlug] = useState(mode === "create");
  const [localError, setLocalError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting: formSubmitting },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: initialData?.name || "",
      code: initialData?.code || "",
      slug: initialData?.slug || "",
      parentId: initialData?.parentId || preselectedParentId || "",
      description: initialData?.description || "",
      sortOrder: initialData?.sortOrder !== undefined ? initialData.sortOrder : "",
      status: initialData?.status?.code || "ACTIVE",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || "",
        code: initialData.code || "",
        slug: initialData.slug || "",
        parentId: initialData.parentId || preselectedParentId || "",
        description: initialData.description || "",
        sortOrder: initialData.sortOrder !== undefined ? initialData.sortOrder : "",
        status: initialData.status?.code || "ACTIVE",
      });
    }
  }, [initialData, preselectedParentId, reset]);

  const onFormSubmit: SubmitHandler<CategoryFormData> = async (data) => {
    setLocalError(null);
    try {
      const parentIdClean = data.parentId?.trim() || undefined;
      const codeClean = data.code?.trim() || undefined;
      const slugClean = data.slug?.trim() || undefined;
      const descClean = data.description?.trim() || undefined;

      if (mode === "create") {
        await onSubmit({
          name: data.name.trim(),
          code: codeClean,
          slug: slugClean,
          parentId: parentIdClean,
          description: descClean,
          icon: "Layers",
          sortOrder: Number(data.sortOrder) || 0,
          isSystem: false,
          status: data.status as any,
        });
      } else {
        await onSubmit({
          name: data.name.trim(),
          code: codeClean,
          slug: slugClean,
          description: descClean,
          sortOrder: Number(data.sortOrder) || 0,
          status: data.status as any,
        });
      }
    } catch (err: any) {
      setLocalError(err?.message || `Failed to ${mode} category`);
    }
  };

  const handleNameChange = (val: string) => {
    if (autoSlug && mode === "create") {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setValue("slug", generatedSlug, { shouldValidate: true });
    }
  };

  const activeError = error || localError;
  const submitting = isSubmitting || formSubmitting;

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="w-full flex flex-col gap-6" noValidate>
      {activeError && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <div className="font-bold">Operation Error</div>
            <div className="mt-0.5">{activeError}</div>
          </div>
        </div>
      )}

      {/* Main Form Card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col gap-6">
        <div className="border-b border-gray-100 pb-4 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-base text-gray-900">
              {mode === "create" ? "Category Specifications" : `Edit: ${initialData?.name || "Category"}`}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Configure product category identity, URL pathing, taxonomy hierarchy, and status.
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-brand-50 text-brand-700 border border-brand-200">
            {mode === "create" ? "New Record" : `Level ${initialData?.level || 1}`}
          </span>
        </div>

        {/* Section 1: Basic Information */}
        <div className="flex flex-col gap-4">
          <Input
            label="Category Name *"
            placeholder="e.g. Vitrified Floor Tiles"
            error={errors.name?.message}
            helperText="The primary display name shown to buyers and throughout catalog listings."
            {...register("name", {
              onChange: (e) => handleNameChange(e.target.value),
            })}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Category Code (Optional)"
              placeholder="Auto-generated if left blank"
              error={errors.code?.message}
              helperText="Unique identifier for ERP, sync jobs, and backend integrations."
              className="font-mono uppercase"
              {...register("code")}
            />

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                  URL Slug (Optional)
                </label>
                {mode === "create" && (
                  <button
                    type="button"
                    onClick={() => setAutoSlug(!autoSlug)}
                    className="text-[11px] font-bold text-brand-600 hover:text-brand-700 cursor-pointer flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    {autoSlug ? "Manual Edit" : "Auto Sync"}
                  </button>
                )}
              </div>
              <Input
                placeholder="vitrified-floor-tiles"
                leftIcon={<span className="text-xs font-mono text-gray-400">/</span>}
                error={errors.slug?.message}
                helperText="SEO-friendly slug for routing and buyer discovery paths."
                className="font-mono"
                {...register("slug", {
                  onChange: () => setAutoSlug(false),
                })}
              />
            </div>
          </div>
        </div>

        {/* Section 2: Hierarchy & Parent Category */}
        {mode === "create" && (
          <div className="border-t border-gray-100 pt-4 flex flex-col gap-2">
            <Select
              label="Parent Category (Taxonomy Hierarchy)"
              error={errors.parentId?.message}
              helperText="Selecting a parent category nests this item under that node and calculates its depth level."
              {...register("parentId")}
            >
              <option value="">[ None - Root Top-Level Category (Level 1) ]</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {"— ".repeat(Math.max(0, (c.level || 1) - 1))} {c.name} (Level {c.level || 1})
                </option>
              ))}
            </Select>
          </div>
        )}

        {/* Section 3: Description */}
        <div className="border-t border-gray-100 pt-4 flex flex-col gap-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
            Description &amp; Specifications (Optional)
          </label>
          <textarea
            rows={3}
            placeholder="Detailed description of what products belong in this category..."
            className="w-full bg-white border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 rounded-lg text-sm text-gray-900 p-3 outline-none transition-all duration-150"
            {...register("description")}
          />
        </div>

        {/* Section 4: Display Order & Status */}
        <div className="border-t border-gray-100 pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Display Sort Order (Optional)"
            type="number"
            min={0}
            placeholder="e.g. 1"
            error={errors.sortOrder?.message}
            helperText="Determines sequence in catalog menus (lower numbers show first)."
            className="font-mono"
            {...register("sortOrder")}
          />

          <Select
            label="Status Lifecycle"
            error={errors.status?.message}
            helperText="Active categories are accessible to buyers and vendors for product listings."
            {...register("status")}
          >
            <option value="ACTIVE">ACTIVE — Live in Catalog</option>
            <option value="INACTIVE">INACTIVE — Hidden from Catalog</option>
          </Select>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-100 pt-6 flex items-center justify-between gap-3">
          <Link
            href={cancelHref}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Cancel &amp; Return</span>
          </Link>

          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={submitting}
            disabled={submitting}
            leftIcon={<Save className="w-4 h-4" />}
          >
            {mode === "create"
              ? submitting
                ? "Creating Category..."
                : "Create Product Category"
              : submitting
                ? "Saving Changes..."
                : "Save Changes"}
          </Button>
        </div>
      </div>
    </form>
  );
};
