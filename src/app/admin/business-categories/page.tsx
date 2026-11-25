"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Layers,
  Plus,
  RefreshCw,
  Search,
  Pencil,
  Trash2,
  FolderTree,
  Building2,
  Globe,
  Ship,
  Truck,
  Plane,
  Factory,
  Briefcase,
  FileCheck,
  Wrench,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  ChevronRight,
  GitFork,
  ArrowUpDown,
  LucideIcon,
} from "lucide-react";
import {
  Button,
  Input,
  Select,
  Switch,
  Badge,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  ConfirmationDialog,
  PageHeader,
  EmptyState,
} from "@/components/common";
import {
  fetchAdminBusinessCategories,
  createBusinessCategory,
  updateBusinessCategory,
  deleteBusinessCategory,
  toggleBusinessCategoryStatus,
} from "@/features/business-categories/business-category-api";
import {
  BusinessCategoryItem,
  CreateBusinessCategoryPayload,
  UpdateBusinessCategoryPayload,
} from "@/features/business-categories/types";

const ICON_OPTIONS: { label: string; value: string; icon: LucideIcon }[] = [
  { label: "Globe (Global / Export)", value: "Globe", icon: Globe },
  { label: "Ship (Maritime / Importer)", value: "Ship", icon: Ship },
  { label: "Truck (Logistics / Transport)", value: "Truck", icon: Truck },
  { label: "Plane (Air Freight / Cargo)", value: "Plane", icon: Plane },
  { label: "Factory (Manufacturing)", value: "Factory", icon: Factory },
  { label: "Building (Wholesale / Corp)", value: "Building2", icon: Building2 },
  { label: "Briefcase (Trading)", value: "Briefcase", icon: Briefcase },
  { label: "FileCheck (Customs)", value: "FileCheck", icon: FileCheck },
  { label: "Wrench (Services)", value: "Wrench", icon: Wrench },
  { label: "ShieldCheck (Verified)", value: "ShieldCheck", icon: ShieldCheck },
  { label: "Layers (General)", value: "Layers", icon: Layers },
];

function getCategoryIcon(iconName?: string): LucideIcon {
  const match = ICON_OPTIONS.find((item) => item.value === iconName);
  return match ? match.icon : Layers;
}

export default function AdminBusinessCategoriesPage() {
  const [categories, setCategories] = useState<BusinessCategoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [hierarchyFilter, setHierarchyFilter] = useState<string>("ALL");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<BusinessCategoryItem | null>(null);
  const [prefilledParentId, setPrefilledParentId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Form Fields
  const [formName, setFormName] = useState("");
  const [formCode, setFormCode] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formParentId, setFormParentId] = useState<string>("");
  const [formDescription, setFormDescription] = useState("");
  const [formIcon, setFormIcon] = useState("Layers");
  const [formDisplayOrder, setFormDisplayOrder] = useState(1);
  const [formIsActive, setFormIsActive] = useState(true);

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<BusinessCategoryItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchAdminBusinessCategories({ limit: 200 });
      setCategories(res.data || []);
    } catch (err: any) {
      setError(err?.message || "Failed to load business categories");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  // Root categories list for parent selection
  const rootCategories = useMemo(() => {
    return categories.filter((c) => !c.parentId);
  }, [categories]);

  // Quick lookup map
  const categoryMap = useMemo(() => {
    const map = new Map<string, BusinessCategoryItem>();
    categories.forEach((c) => map.set(c.id, c));
    return map;
  }, [categories]);

  // Metrics
  const stats = useMemo(() => {
    const total = categories.length;
    const roots = categories.filter((c) => !c.parentId).length;
    const subcats = total - roots;
    const active = categories.filter((c) => c.isActive !== false).length;
    const totalBusinesses = categories.reduce((sum, c) => sum + (c.businessCount || 0), 0);
    return { total, roots, subcats, active, totalBusinesses };
  }, [categories]);

  // Filtered categories
  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => {
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchName = cat.name.toLowerCase().includes(q);
        const matchCode = cat.code?.toLowerCase().includes(q);
        const matchSlug = cat.slug?.toLowerCase().includes(q);
        if (!matchName && !matchCode && !matchSlug) return false;
      }
      if (statusFilter === "ACTIVE" && cat.isActive === false) return false;
      if (statusFilter === "INACTIVE" && cat.isActive !== false) return false;

      if (hierarchyFilter === "ROOT" && cat.parentId) return false;
      if (hierarchyFilter === "SUBCATEGORY" && !cat.parentId) return false;

      return true;
    });
  }, [categories, search, statusFilter, hierarchyFilter]);

  const openCreateModal = (parentId?: string) => {
    setEditingCategory(null);
    setFormError(null);
    setFormName("");
    setFormCode("");
    setFormSlug("");
    setFormParentId(parentId || "");
    setFormDescription("");
    setFormIcon(parentId ? "ChevronRight" : "Layers");
    setFormDisplayOrder(categories.length + 1);
    setFormIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (cat: BusinessCategoryItem) => {
    setEditingCategory(cat);
    setFormError(null);
    setFormName(cat.name);
    setFormCode(cat.code || "");
    setFormSlug(cat.slug || "");
    setFormParentId(cat.parentId || "");
    setFormDescription(cat.description || "");
    setFormIcon(cat.icon || "Layers");
    setFormDisplayOrder(cat.displayOrder ?? 1);
    setFormIsActive(cat.isActive !== false);
    setIsModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    setFormName(val);
    if (!editingCategory) {
      const slugVal = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setFormSlug(slugVal);
      const codeVal = val
        .toUpperCase()
        .replace(/[^A-Z0-9]+/g, "_")
        .replace(/(^_|_$)/g, "");
      setFormCode(codeVal);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      setFormError("Category Name is required");
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      if (editingCategory) {
        const payload: UpdateBusinessCategoryPayload = {
          name: formName.trim(),
          code: formCode.trim() || undefined,
          slug: formSlug.trim() || undefined,
          parentId: formParentId || null,
          description: formDescription.trim() || undefined,
          icon: formIcon,
          displayOrder: Number(formDisplayOrder),
          isActive: formIsActive,
        };
        await updateBusinessCategory(editingCategory.id, payload);
      } else {
        const payload: CreateBusinessCategoryPayload = {
          name: formName.trim(),
          code: formCode.trim() || formName.toUpperCase().replace(/\s+/g, "_"),
          slug: formSlug.trim() || formName.toLowerCase().replace(/\s+/g, "-"),
          parentId: formParentId || null,
          description: formDescription.trim() || undefined,
          icon: formIcon,
          displayOrder: Number(formDisplayOrder),
          isActive: formIsActive,
        };
        await createBusinessCategory(payload);
      }

      setIsModalOpen(false);
      await loadCategories();
    } catch (err: any) {
      setFormError(err?.message || "Failed to save business category");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (cat: BusinessCategoryItem) => {
    const nextStatus = !cat.isActive;
    // Optimistic update
    setCategories((prev) =>
      prev.map((c) => (c.id === cat.id ? { ...c, isActive: nextStatus } : c))
    );

    try {
      await toggleBusinessCategoryStatus(cat.id, nextStatus);
    } catch (err: any) {
      // Revert on failure
      setCategories((prev) =>
        prev.map((c) => (c.id === cat.id ? { ...c, isActive: !nextStatus } : c))
      );
      alert(err?.message || "Failed to toggle status");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteBusinessCategory(deleteTarget.id);
      setDeleteTarget(null);
      await loadCategories();
    } catch (err: any) {
      alert(err?.message || "Failed to delete category");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <PageHeader
        title="Business Category Master"
        description="Dynamic management of core business types, logistics roles, and operational classifications across Mercora."
        actionButton={{
          label: "Add Category",
          onClick: () => openCreateModal(),
          icon: <Plus className="w-4 h-4" />,
        }}
      />

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-surface border border-border shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-text-muted uppercase tracking-wider">
              Total Categories
            </span>
            <Layers className="w-4 h-4 text-primary" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-text-primary tracking-tight">
              {stats.total}
            </span>
            <span className="text-xs text-text-muted">system categories</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-surface border border-border shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-text-muted uppercase tracking-wider">
              Core Business Types
            </span>
            <Building2 className="w-4 h-4 text-blue-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-blue-600 tracking-tight">
              {stats.roots}
            </span>
            <span className="text-xs text-text-muted">top-level classes</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-surface border border-border shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-text-muted uppercase tracking-wider">
              Subcategories
            </span>
            <FolderTree className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-600 tracking-tight">
              {stats.subcats}
            </span>
            <span className="text-xs text-text-muted">specialized domains</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-surface border border-border shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-text-muted uppercase tracking-wider">
              Active Status
            </span>
            <CheckCircle2 className="w-4 h-4 text-primary" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-primary tracking-tight">
              {stats.active}
            </span>
            <span className="text-xs text-text-muted">live in registration</span>
          </div>
        </div>
      </div>

      {/* Search and Filters Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-surface border border-border shadow-xs">
        <div className="w-full sm:w-80 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search category, code or slug..."
            className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-border bg-background text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-border bg-background text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active Only</option>
            <option value="INACTIVE">Inactive Only</option>
          </select>

          {/* Hierarchy Filter */}
          <select
            value={hierarchyFilter}
            onChange={(e) => setHierarchyFilter(e.target.value)}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-border bg-background text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="ALL">All Hierarchy</option>
            <option value="ROOT">Top-Level Only</option>
            <option value="SUBCATEGORY">Subcategories Only</option>
          </select>

          {/* Refresh Button */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={loadCategories}
            disabled={isLoading}
            leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Table Section */}
      <div className="rounded-2xl bg-surface border border-border shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-text-muted">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-primary mb-3" />
            <p className="text-sm font-semibold">Loading dynamic business categories...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-status-danger">
            <XCircle className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm font-bold">{error}</p>
            <Button variant="outline" size="sm" onClick={loadCategories} className="mt-4">
              Try Again
            </Button>
          </div>
        ) : filteredCategories.length === 0 ? (
          <EmptyState
            title="No business categories found"
            description="Try adjusting your search query or filters to find what you need."
            actionLabel="Add Category"
            onAction={() => openCreateModal()}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-background-secondary/50 text-[11px] font-bold text-text-muted uppercase tracking-wider">
                  <th className="py-3.5 px-4">Category Name</th>
                  <th className="py-3.5 px-4">Code & Slug</th>
                  <th className="py-3.5 px-4">Hierarchy</th>
                  <th className="py-3.5 px-4 text-center">Businesses</th>
                  <th className="py-3.5 px-4 text-center">Order</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm">
                {filteredCategories.map((cat) => {
                  const Icon = getCategoryIcon(cat.icon);
                  const isSub = Boolean(cat.parentId);
                  const parentCat = cat.parentId ? categoryMap.get(cat.parentId) : null;

                  return (
                    <tr
                      key={cat.id}
                      className="hover:bg-surface-hover/80 transition-colors group"
                    >
                      {/* Name & Icon */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                              isSub
                                ? "bg-background-secondary text-text-muted border-border"
                                : "bg-primary-soft text-primary border-primary/20"
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-text-primary">
                                {cat.name}
                              </span>
                              {isSub && (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                                  Sub
                                </span>
                              )}
                            </div>
                            {cat.description && (
                              <p className="text-xs text-text-muted line-clamp-1 max-w-xs mt-0.5">
                                {cat.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Code & Slug */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col gap-1">
                          <code className="text-xs font-mono font-bold text-text-primary bg-background px-1.5 py-0.5 rounded border border-border inline-block w-fit">
                            {cat.code || cat.slug.toUpperCase()}
                          </code>
                          <span className="text-[11px] font-mono text-text-muted">
                            slug: {cat.slug}
                          </span>
                        </div>
                      </td>

                      {/* Hierarchy */}
                      <td className="py-3.5 px-4">
                        {parentCat ? (
                          <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-background-secondary text-xs font-semibold text-text-secondary border border-border">
                            <GitFork className="w-3 h-3 text-text-muted" />
                            <span>{parentCat.name}</span>
                          </div>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                            Root / Primary
                          </span>
                        )}
                      </td>

                      {/* Businesses Linked */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-extrabold bg-background text-text-secondary border border-border">
                          {cat.businessCount || 0}
                        </span>
                      </td>

                      {/* Order */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="text-xs font-mono font-semibold text-text-muted">
                          #{cat.displayOrder ?? 0}
                        </span>
                      </td>

                      {/* Status & Quick Toggle */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(cat)}
                          title={cat.isActive !== false ? "Click to Deactivate" : "Click to Activate"}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                            cat.isActive !== false
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
                              : "bg-neutral-100 text-neutral-500 border-neutral-300 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              cat.isActive !== false ? "bg-emerald-500 animate-pulse" : "bg-neutral-400"
                            }`}
                          />
                          <span>{cat.isActive !== false ? "Active" : "Inactive"}</span>
                        </button>
                      </td>

                      {/* Row Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {!isSub && (
                            <button
                              type="button"
                              onClick={() => openCreateModal(cat.id)}
                              title="Add Subcategory under this type"
                              className="p-1.5 rounded-lg text-text-muted hover:text-primary hover:bg-primary-soft transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => openEditModal(cat)}
                            title="Edit Category"
                            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(cat)}
                            title="Delete Category"
                            className="p-1.5 rounded-lg text-text-muted hover:text-status-danger hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Category Dialog Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Edit Business Category" : "Create Business Category"}
            </DialogTitle>
            <DialogDescription>
              Configure the category hierarchy, code, and operational settings.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            {formError && (
              <div className="p-3 text-xs font-semibold rounded-xl bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-300 border border-red-200 dark:border-red-800">
                {formError}
              </div>
            )}

            {/* Name */}
            <div>
              <Input
                label="Category Name"
                value={formName}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Freight Forwarder or Air Cargo"
                required
              />
            </div>

            {/* Code and Slug */}
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Category Code"
                value={formCode}
                onChange={(e) => setFormCode(e.target.value.toUpperCase())}
                placeholder="e.g. FREIGHT_FORWARDER"
                required
              />
              <Input
                label="URL Slug"
                value={formSlug}
                onChange={(e) => setFormSlug(e.target.value.toLowerCase())}
                placeholder="e.g. freight-forwarder"
                required
              />
            </div>

            {/* Parent Category Dropdown */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                Parent Category (Optional for Subcategory)
              </label>
              <select
                value={formParentId}
                onChange={(e) => setFormParentId(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-border bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">None (Top-Level Primary Business Type)</option>
                {rootCategories
                  .filter((rc) => !editingCategory || rc.id !== editingCategory.id)
                  .map((rc) => (
                    <option key={rc.id} value={rc.id}>
                      {rc.name}
                    </option>
                  ))}
              </select>
            </div>

            {/* Icon & Display Order */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                  Icon Identifier
                </label>
                <select
                  value={formIcon}
                  onChange={(e) => setFormIcon(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-border bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {ICON_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Input
                  label="Display Order"
                  type="number"
                  value={String(formDisplayOrder)}
                  onChange={(e) => setFormDisplayOrder(Number(e.target.value) || 0)}
                  placeholder="1"
                />
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                Short Description
              </label>
              <textarea
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                rows={2}
                placeholder="Operational scope, service capabilities, or member criteria..."
                className="w-full px-3 py-2 text-sm rounded-xl border border-border bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
              />
            </div>

            {/* Active Switch */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-background border border-border">
              <div>
                <span className="text-xs font-bold text-text-primary block">
                  Active Status
                </span>
                <span className="text-[11px] text-text-muted">
                  Show this category in public directory filters and business registration.
                </span>
              </div>
              <Switch
                checked={formIsActive}
                onChange={(e) => setFormIsActive(e.target.checked)}
              />
            </div>

            <DialogFooter className="mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting}
                className="font-bold"
              >
                {isSubmitting ? "Saving..." : editingCategory ? "Update Category" : "Create Category"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog for Deletion */}
      <ConfirmationDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Business Category"
        description={
          deleteTarget
            ? `Are you sure you want to delete "${deleteTarget.name}"? If there are subcategories or businesses assigned to this category, deletion will be blocked by system safety rules.`
            : ""
        }
        confirmLabel={isDeleting ? "Deleting..." : "Delete Category"}
        cancelLabel="Cancel"
        variant="danger"
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
