"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AlertCircle, Layers, Plus, Save } from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  Input,
  PageHeader,
  Select,
  SlugField,
  Switch,
  Textarea,
  toSlugPreview,
} from "@/components/common";
import {
  BusinessCategoryItem,
  CreateBusinessCategoryPayload,
  UpdateBusinessCategoryPayload,
} from "../types";

const ICON_OPTIONS = [
  { value: "Globe", label: "Globe (Global / Export)" },
  { value: "Ship", label: "Ship (Maritime / Importer)" },
  { value: "Truck", label: "Truck (Logistics / Transport)" },
  { value: "Plane", label: "Plane (Air Freight / Cargo)" },
  { value: "Factory", label: "Factory (Manufacturing)" },
  { value: "Building2", label: "Building (Wholesale / Corp)" },
  { value: "Briefcase", label: "Briefcase (Trading)" },
  { value: "FileCheck", label: "FileCheck (Customs)" },
  { value: "Wrench", label: "Wrench (Services)" },
  { value: "ShieldCheck", label: "ShieldCheck (Verified)" },
  { value: "Search", label: "Search (Sourcing)" },
  { value: "Layers", label: "Layers (General)" },
];

export interface BusinessCategoryFormProps {
  mode: "create" | "edit";
  initialData?: BusinessCategoryItem | null;
  prefilledParentId?: string | null;
  rootCategories: BusinessCategoryItem[];
  defaultOrder: number;
  isSubmitting: boolean;
  error: string | null;
  cancelHref: string;
  onSubmit: (
    payload: CreateBusinessCategoryPayload | UpdateBusinessCategoryPayload
  ) => Promise<void>;
}

export function BusinessCategoryForm({
  mode,
  initialData,
  prefilledParentId,
  rootCategories,
  defaultOrder,
  isSubmitting,
  error,
  cancelHref,
  onSubmit,
}: BusinessCategoryFormProps) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [slug, setSlug] = useState("");
  const [autoSlug, setAutoSlug] = useState(mode === "create");
  const [parentId, setParentId] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("Layers");
  const [displayOrder, setDisplayOrder] = useState(defaultOrder);
  const [isActive, setIsActive] = useState(true);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setName(initialData.name);
      setCode(initialData.code || "");
      setSlug(initialData.slug || "");
      setParentId(initialData.parentId || "");
      setDescription(initialData.description || "");
      setIcon(initialData.icon || "Layers");
      setDisplayOrder(initialData.displayOrder ?? 1);
      setIsActive(initialData.isActive !== false);
    } else if (mode === "create") {
      setParentId(prefilledParentId || "");
      setDisplayOrder(defaultOrder);
    }
  }, [mode, initialData, prefilledParentId, defaultOrder]);

  const handleNameChange = (val: string) => {
    setName(val);
    if (mode === "create") {
      if (autoSlug) {
        setSlug(toSlugPreview(val));
      }
      setCode(
        val
          .toUpperCase()
          .replace(/[^A-Z0-9]+/g, "_")
          .replace(/(^_|_$)/g, "")
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setValidationError("Category Name is required.");
      return;
    }
    setValidationError(null);
    await onSubmit({
      name: name.trim(),
      code: code.trim() || undefined,
      slug: slug.trim() ? toSlugPreview(slug) : undefined,
      parentId: parentId || null,
      description: description.trim() || undefined,
      icon,
      displayOrder: Number(displayOrder) || 1,
      isActive,
    });
  };

  const displayError = validationError || error;

  return (
    <div className="flex flex-col gap-6 w-full">
      <PageHeader
        title={mode === "edit" ? "Edit Business Category" : "Create Business Category"}
        description="Configure category hierarchy, identifiers, icons, and registration visibility."
        backHref={cancelHref}
      />

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {displayError && (
              <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{displayError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <Input
                  label="Category Name *"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Freight Forwarder or Air Cargo"
                  required
                />
              </div>
              <Input
                label="Display Order"
                type="number"
                value={String(displayOrder)}
                onChange={(e) => setDisplayOrder(Number(e.target.value))}
                min={0}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Category Code (Optional)"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g. FREIGHT_FORWARDER"
              />
              <SlugField
                value={slug}
                onChange={(e) => {
                  setAutoSlug(false);
                  setSlug(e.target.value.toLowerCase());
                }}
                showAutoToggle={mode === "create"}
                autoSync={autoSlug}
                onToggleAutoSync={() => {
                  const next = !autoSlug;
                  setAutoSlug(next);
                  if (next) setSlug(toSlugPreview(name));
                }}
                placeholder="e.g. freight-forwarder"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Parent Category"
                value={parentId}
                onChange={(e) => setParentId(e.target.value)}
              >
                <option value="">None (Top-Level Primary Business Type)</option>
                {rootCategories
                  .filter((c) => c.id !== initialData?.id)
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
              </Select>

              <Select
                label="Icon Identifier"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
              >
                {ICON_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Select>
            </div>

            <Textarea
              label="Short Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Operational scope, service capabilities, or member criteria..."
              rows={3}
            />

            <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-surface-hover/40">
              <div className="flex items-center gap-3">
                <Layers className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-sm font-semibold text-foreground">Active Status</p>
                  <p className="text-xs text-text-secondary">
                    Show this category in public directory filters and business registration.
                  </p>
                </div>
              </div>
              <Switch
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
              <Button variant="outline" asChild>
                <Link href={cancelHref}>Cancel</Link>
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={isSubmitting}
                leftIcon={
                  mode === "edit" ? (
                    <Save className="w-4 h-4" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )
                }
              >
                {mode === "edit" ? "Save Changes" : "Create Category"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
