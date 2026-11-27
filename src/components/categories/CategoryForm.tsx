"use client";

import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  CreateProductCategoryInput,
  ProductCategory,
  UpdateProductCategoryInput,
} from "@mercora/shared-types";
import { Input, MasterFormShell, Select, SlugField, Textarea, toSlugPreview } from "@/components/common";
import { commonSchemas, VALIDATION_MESSAGES } from "@/lib/validation/messages";

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
      const payload = {
        name: data.name.trim(),
        code: data.code?.trim() || undefined,
        slug: data.slug?.trim() ? toSlugPreview(data.slug) : undefined,
        description: data.description?.trim() || undefined,
        sortOrder: Number(data.sortOrder) || 0,
        status: data.status as any,
      };
      if (mode === "create") {
        await onSubmit({
          ...payload,
          parentId: data.parentId?.trim() || undefined,
          icon: "Layers",
          isSystem: false,
        });
      } else {
        await onSubmit(payload);
      }
    } catch (err: any) {
      setLocalError(err?.message || `Failed to ${mode} category`);
    }
  };

  const handleNameChange = (val: string) => {
    if (autoSlug && mode === "create") {
      setValue("slug", toSlugPreview(val), { shouldValidate: true });
    }
  };

  const submitting = isSubmitting || formSubmitting;

  return (
    <MasterFormShell
      title={mode === "create" ? "Category Specifications" : `Edit: ${initialData?.name || "Category"}`}
      subtitle="Configure product category identity, URL pathing, taxonomy hierarchy, and status."
      badgeLabel={mode === "create" ? "New Record" : `Level ${initialData?.level || 1}`}
      error={error || localError}
      onSubmit={handleSubmit(onFormSubmit)}
      isSubmitting={submitting}
      submitLabel={mode === "create" ? "Create Product Category" : "Save Changes"}
      cancelHref={cancelHref}
    >
      <div className="flex flex-col gap-4">
        <Input
          label="Category Name *"
          placeholder="e.g. Vitrified Floor Tiles"
          error={errors.name?.message}
          helperText="The primary display name shown to buyers and throughout catalog listings."
          {...register("name", { onChange: (e) => handleNameChange(e.target.value) })}
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

          <SlugField
            placeholder="vitrified-floor-tiles"
            showAutoToggle={mode === "create"}
            autoSync={autoSlug}
            onToggleAutoSync={() => {
              const next = !autoSlug;
              setAutoSlug(next);
              if (next) {
                setValue("slug", toSlugPreview(watch("name") || ""), { shouldValidate: true });
              }
            }}
            error={errors.slug?.message}
            helperText="SEO-friendly slug for routing and buyer discovery paths."
            {...register("slug", { onChange: () => setAutoSlug(false) })}
          />
        </div>
      </div>

      {mode === "create" && (
        <div className="border-t border-gray-100 pt-4">
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

      <div className="border-t border-gray-100 pt-4">
        <Textarea
          label="Description & Specifications (Optional)"
          rows={3}
          placeholder="Detailed description of what products belong in this category..."
          {...register("description")}
        />
      </div>

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
    </MasterFormShell>
  );
};
