"use client";

import React, { useState, useEffect } from "react";
import { AlertCircle, Layers, Plus, Pencil } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import {
  Button,
  Input,
  Select,
  Textarea,
  Switch,
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

interface BusinessCategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingCategory: BusinessCategoryItem | null;
  prefilledParentId?: string | null;
  rootCategories: BusinessCategoryItem[];
  defaultOrder: number;
  onSave: (
    payload: CreateBusinessCategoryPayload | UpdateBusinessCategoryPayload,
    editingId?: string
  ) => Promise<void>;
}

export function BusinessCategoryFormModal({
  isOpen,
  onClose,
  editingCategory,
  prefilledParentId,
  rootCategories,
  defaultOrder,
  onSave,
}: BusinessCategoryFormModalProps) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [slug, setSlug] = useState("");
  const [parentId, setParentId] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("Layers");
  const [displayOrder, setDisplayOrder] = useState(1);
  const [isActive, setIsActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setFormError(null);
    if (editingCategory) {
      setName(editingCategory.name);
      setCode(editingCategory.code || "");
      setSlug(editingCategory.slug || "");
      setParentId(editingCategory.parentId || "");
      setDescription(editingCategory.description || "");
      setIcon(editingCategory.icon || "Layers");
      setDisplayOrder(editingCategory.displayOrder ?? 1);
      setIsActive(editingCategory.isActive !== false);
    } else {
      setName("");
      setCode("");
      setSlug("");
      setParentId(prefilledParentId || "");
      setDescription("");
      setIcon("Layers");
      setDisplayOrder(defaultOrder);
      setIsActive(true);
    }
  }, [isOpen, editingCategory, prefilledParentId, defaultOrder]);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingCategory) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")
      );
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
      setFormError("Category Name is required.");
      return;
    }

    setIsSubmitting(true);
    setFormError(null);
    try {
      const payload = {
        name: name.trim(),
        code: code.trim() || name.toUpperCase().replace(/\s+/g, "_"),
        slug: slug.trim() || name.toLowerCase().replace(/\s+/g, "-"),
        parentId: parentId || null,
        description: description.trim() || undefined,
        icon,
        displayOrder: Number(displayOrder) || 0,
        isActive,
      };
      await onSave(payload, editingCategory?.id);
      onClose();
    } catch (err: any) {
      setFormError(err?.message || "Failed to save business category.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const parentOptions = [
    { value: "", label: "None (Top-Level Primary Business Type)" },
    ...rootCategories
      .filter((rc) => !editingCategory || rc.id !== editingCategory.id)
      .map((rc) => ({ value: rc.id, label: rc.name })),
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingCategory ? "Edit Business Category" : "Create Business Category"}
      description="Configure category hierarchy, identifiers, icons, and registration visibility."
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {formError && (
          <div className="p-3 text-xs font-semibold rounded-xl bg-destructive/10 text-destructive border border-destructive/20 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {/* Row 1: Category Name & Display Order */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div className="sm:col-span-2">
            <Input
              label="Category Name *"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Freight Forwarder or Air Cargo"
              required
            />
          </div>
          <div>
            <Input
              label="Display Order"
              type="number"
              value={String(displayOrder)}
              onChange={(e) => setDisplayOrder(Number(e.target.value) || 0)}
              placeholder="1"
            />
          </div>
        </div>

        {/* Row 2: Code & URL Slug */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <Input
            label="Category Code *"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="e.g. FREIGHT_FORWARDER"
            required
          />
          <Input
            label="URL Slug *"
            value={slug}
            onChange={(e) => setSlug(e.target.value.toLowerCase())}
            placeholder="e.g. freight-forwarder"
            required
          />
        </div>

        {/* Row 3: Parent Category & Icon Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <Select
            label="Parent Category"
            value={parentId}
            onChange={(e) => setParentId(e.target.value)}
            options={parentOptions}
            placeholder="Top-Level Primary Type"
          />

          <Select
            label="Icon Identifier"
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            options={ICON_OPTIONS}
          />
        </div>

        {/* Row 4: Short Description */}
        <Textarea
          label="Short Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          placeholder="Operational scope, service capabilities, or member criteria..."
        />

        {/* Row 5: Active Status Toggle */}
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-background border border-border">
          <div>
            <span className="text-xs font-bold text-text-primary block">
              Active Status
            </span>
            <span className="text-[11px] text-text-muted">
              Show this category in public directory filters and business registration.
            </span>
          </div>
          <Switch
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
        </div>

        {/* Pinned Footer Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={isSubmitting}
            leftIcon={editingCategory ? <Pencil className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          >
            {editingCategory ? "Update Category" : "Create Category"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
