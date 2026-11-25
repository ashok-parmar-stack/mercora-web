"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Layers,
  Plus,
  RefreshCw,
  FolderTree,
  Building2,
  CheckCircle2,
  List,
  Pencil,
  Trash2,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { DataTable, BulkAction } from "@/components/data-table/DataTable";
import {
  DeleteConfirmDialog,
  StatusConfirmDialog,
} from "@/components/common/ConfirmDialog";
import { Button, Select, Badge, ErrorState } from "@/components/common";
import { useUIStore } from "@/lib/store/ui-store";
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
import { BusinessCategoryFormModal } from "@/features/business-categories/components/BusinessCategoryFormModal";
import {
  getBusinessCategoryColumns,
  getBusinessCategoryIcon,
  renderBusinessCategoryRowActions,
} from "@/features/business-categories/components/business-category-columns";

export default function AdminBusinessCategoriesPage() {
  const addToast = useUIStore((s) => s.addToast);
  const clearSelection = useUIStore((s) => s.clearSelection);

  const [categories, setCategories] = useState<BusinessCategoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"table" | "tree">("table");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [hierarchyFilter, setHierarchyFilter] = useState<string>("ALL");

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<BusinessCategoryItem | null>(null);
  const [prefilledParentId, setPrefilledParentId] = useState<string | null>(null);

  // Confirm Dialogs
  const [deleteTarget, setDeleteTarget] = useState<BusinessCategoryItem | null>(null);
  const [bulkDeletingIds, setBulkDeletingIds] = useState<string[] | null>(null);
  const [bulkStatusConfirm, setBulkStatusConfirm] = useState<{
    ids: string[];
    targetStatus: "ACTIVE" | "INACTIVE";
  } | null>(null);

  const loadCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchAdminBusinessCategories({ limit: 500 });
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

  const rootCategories = useMemo(
    () => categories.filter((c) => !c.parentId),
    [categories]
  );

  const categoryMap = useMemo(() => {
    const map = new Map<string, BusinessCategoryItem>();
    categories.forEach((c) => map.set(c.id, c));
    return map;
  }, [categories]);

  const stats = useMemo(() => {
    const total = categories.length;
    const roots = categories.filter((c) => !c.parentId).length;
    const subcats = total - roots;
    const active = categories.filter((c) => c.isActive !== false).length;
    return { total, roots, subcats, active };
  }, [categories]);

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

  const handleOpenCreate = (parentId?: string) => {
    setEditingCategory(null);
    setPrefilledParentId(parentId || null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (cat: BusinessCategoryItem) => {
    setEditingCategory(cat);
    setPrefilledParentId(null);
    setIsFormOpen(true);
  };

  const handleSaveCategory = async (
    payload: CreateBusinessCategoryPayload | UpdateBusinessCategoryPayload,
    editingId?: string
  ) => {
    if (editingId) {
      await updateBusinessCategory(editingId, payload as UpdateBusinessCategoryPayload);
      addToast("success", "Category Updated", `"${payload.name}" updated successfully.`);
    } else {
      await createBusinessCategory(payload as CreateBusinessCategoryPayload);
      addToast("success", "Category Created", `"${payload.name}" added to directory.`);
    }
    await loadCategories();
  };

  const handleToggleStatus = useCallback(
    async (cat: BusinessCategoryItem) => {
      const nextStatus = cat.isActive === false;
      setCategories((prev) =>
        prev.map((c) => (c.id === cat.id ? { ...c, isActive: nextStatus } : c))
      );
      try {
        await toggleBusinessCategoryStatus(cat.id, nextStatus);
        addToast(
          "success",
          "Status Updated",
          `"${cat.name}" is now ${nextStatus ? "Active" : "Inactive"}.`
        );
      } catch (err: any) {
        setCategories((prev) =>
          prev.map((c) => (c.id === cat.id ? { ...c, isActive: !nextStatus } : c))
        );
        addToast("error", "Status Update Failed", err?.message || "Could not update category status.");
      }
    },
    [addToast]
  );

  const handleSingleDelete = async () => {
    if (!deleteTarget) return;
    await deleteBusinessCategory(deleteTarget.id);
    addToast("success", "Category Deleted", `"${deleteTarget.name}" removed cleanly.`);
    setDeleteTarget(null);
    await loadCategories();
  };

  const handleBulkDelete = async () => {
    if (!bulkDeletingIds || bulkDeletingIds.length === 0) return;
    let deleted = 0;
    let blocked = 0;
    for (const id of bulkDeletingIds) {
      try {
        await deleteBusinessCategory(id);
        deleted++;
      } catch {
        blocked++;
      }
    }
    clearSelection("business-categories-table");
    setBulkDeletingIds(null);
    await loadCategories();
    if (blocked > 0) {
      addToast(
        "warning",
        "Partial Bulk Deletion",
        `${deleted} deleted, ${blocked} skipped due to subcategories or active business links.`
      );
    } else {
      addToast("success", "Categories Deleted", `${deleted} categories removed successfully.`);
    }
  };

  const handleBulkStatus = async () => {
    if (!bulkStatusConfirm) return;
    const nextActive = bulkStatusConfirm.targetStatus === "ACTIVE";
    await Promise.all(
      bulkStatusConfirm.ids.map((id) => toggleBusinessCategoryStatus(id, nextActive))
    );
    clearSelection("business-categories-table");
    addToast(
      "success",
      "Bulk Status Updated",
      `${bulkStatusConfirm.ids.length} categories marked as ${bulkStatusConfirm.targetStatus}.`
    );
    setBulkStatusConfirm(null);
    await loadCategories();
  };

  const columns = useMemo(
    () => getBusinessCategoryColumns(categoryMap, handleToggleStatus),
    [categoryMap, handleToggleStatus]
  );

  const bulkActions: BulkAction<BusinessCategoryItem>[] = [
    {
      label: "Mark Active",
      variant: "primary",
      onClick: (ids) => setBulkStatusConfirm({ ids, targetStatus: "ACTIVE" }),
    },
    {
      label: "Mark Inactive",
      variant: "secondary",
      onClick: (ids) => setBulkStatusConfirm({ ids, targetStatus: "INACTIVE" }),
    },
    {
      label: "Delete Selected",
      variant: "danger",
      onClick: (ids) => setBulkDeletingIds(ids),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* ── Standard Page Header ── */}
      <PageHeader
        title="Business Category Master"
        description="Dynamic management of core business types, logistics roles, and operational classifications across Mercora."
        actionButton={{
          label: "Add Category",
          onClick: () => handleOpenCreate(),
          icon: <Plus className="w-4 h-4" />,
        }}
        extraActions={
          <div className="flex items-center gap-2">
            <div className="bg-background-secondary p-1 rounded-xl flex items-center gap-1 border border-border">
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === "table"
                    ? "bg-surface text-text-primary shadow-2xs"
                    : "text-text-muted hover:text-text-primary"
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>Table</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("tree")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === "tree"
                    ? "bg-surface text-text-primary shadow-2xs"
                    : "text-text-muted hover:text-text-primary"
                }`}
              >
                <FolderTree className="w-3.5 h-3.5" />
                <span>Hierarchy</span>
              </button>
            </div>

            <Button
              variant="outline"
              size="md"
              onClick={loadCategories}
              className="w-10 h-10 p-0"
              title="Refresh Business Categories"
              aria-label="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-primary" : ""}`} />
            </Button>
          </div>
        }
      />

      {/* ── KPI Summary Strip ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface p-4 rounded-xl border border-border shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-xs text-text-muted font-medium">Total Categories</div>
            <div className="text-xl font-black text-text-primary mt-1">{stats.total}</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-primary-soft text-primary flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-surface p-4 rounded-xl border border-border shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-xs text-text-muted font-medium">Core Business Types</div>
            <div className="text-xl font-black text-blue-600 mt-1">{stats.roots}</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-surface p-4 rounded-xl border border-border shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-xs text-text-muted font-medium">Subcategories</div>
            <div className="text-xl font-black text-emerald-600 mt-1">{stats.subcats}</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center">
            <FolderTree className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-surface p-4 rounded-xl border border-border shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-xs text-text-muted font-medium">Active Live Types</div>
            <div className="text-xl font-black text-primary mt-1">{stats.active}</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-primary-soft text-primary flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* ── Main Content: Global DataTable or Hierarchy Tree ── */}
      {error ? (
        <ErrorState
          title="Unable to Load Business Categories"
          message={error}
          onRetry={loadCategories}
        />
      ) : viewMode === "table" ? (
        <DataTable<BusinessCategoryItem>
          tableKey="business-categories-table"
          data={filteredCategories}
          columns={columns}
          keyExtractor={(c) => c.id}
          isLoading={isLoading}
          searchQuery={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search category by name, code, or slug..."
          emptyTitle="No business categories found"
          emptyDescription="Adjust search filters or add a new business type category."
          enableSelection={true}
          bulkActions={bulkActions}
          showColumnPicker={true}
          defaultPageSize={10}
          defaultSortKey="displayOrder"
          defaultSortDir="asc"
          renderActions={(cat) =>
            renderBusinessCategoryRowActions(cat, {
              onAddSubcategory: (parentId) => handleOpenCreate(parentId),
              onEdit: handleOpenEdit,
              onDelete: setDeleteTarget,
            })
          }
          filterSlot={
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="w-36">
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  selectSize="sm"
                  aria-label="Filter by status"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="ACTIVE">Active Only</option>
                  <option value="INACTIVE">Inactive Only</option>
                </Select>
              </div>
              <div className="w-44">
                <Select
                  value={hierarchyFilter}
                  onChange={(e) => setHierarchyFilter(e.target.value)}
                  selectSize="sm"
                  aria-label="Filter by hierarchy"
                >
                  <option value="ALL">All Hierarchy</option>
                  <option value="ROOT">Top-Level Primary</option>
                  <option value="SUBCATEGORY">Subcategories Only</option>
                </Select>
              </div>
            </div>
          }
        />
      ) : (
        <div className="space-y-4">
          {rootCategories.map((root) => {
            const Icon = getBusinessCategoryIcon(root.icon);
            const children = categories.filter((c) => c.parentId === root.id);
            return (
              <div
                key={root.id}
                className="rounded-2xl border border-border bg-surface p-4 shadow-2xs space-y-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary-soft text-primary flex items-center justify-center border border-primary/20">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-text-primary">{root.name}</span>
                        <Badge variant={root.isActive !== false ? "success" : "secondary"} size="sm">
                          {root.isActive !== false ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <span className="text-[11px] text-text-muted">
                        {root.businessCount || 0} businesses · {children.length} subcategories
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenCreate(root.id)}
                      leftIcon={<Plus className="w-3 h-3" />}
                    >
                      Add Sub
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenEdit(root)}
                      aria-label={`Edit ${root.name}`}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteTarget(root)}
                      aria-label={`Delete ${root.name}`}
                    >
                      <Trash2 className="w-3.5 h-3.5 text-destructive" />
                    </Button>
                  </div>
                </div>

                {children.length > 0 && (
                  <div className="pl-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-2 border-t border-border">
                    {children.map((sub) => (
                      <div
                        key={sub.id}
                        className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-background border border-border"
                      >
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-text-primary truncate">{sub.name}</div>
                          <div className="text-[10px] font-mono text-text-muted truncate">/{sub.slug}</div>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(sub)}
                            className="p-1 rounded-md text-text-muted hover:text-text-primary hover:bg-surface-hover cursor-pointer"
                            title="Edit"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(sub)}
                            className="p-1 rounded-md text-text-muted hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Create / Edit Modal (Global Modal + Input/Select/Textarea/Switch) ── */}
      <BusinessCategoryFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        editingCategory={editingCategory}
        prefilledParentId={prefilledParentId}
        rootCategories={rootCategories}
        defaultOrder={categories.length + 1}
        onSave={handleSaveCategory}
      />

      {/* ── Single Delete Confirmation ── */}
      <DeleteConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        entityName={deleteTarget?.name}
        entityType="business category"
        description={
          deleteTarget
            ? `Are you sure you want to delete "${deleteTarget.name}"? Categories with active subcategories or linked businesses cannot be deleted.`
            : undefined
        }
        onConfirm={handleSingleDelete}
      />

      {/* ── Bulk Delete Confirmation ── */}
      <DeleteConfirmDialog
        isOpen={Boolean(bulkDeletingIds && bulkDeletingIds.length > 0)}
        onClose={() => setBulkDeletingIds(null)}
        isBulk={true}
        count={bulkDeletingIds?.length || 0}
        entityType="business category"
        onConfirm={handleBulkDelete}
      />

      {/* ── Bulk Status Confirmation ── */}
      <StatusConfirmDialog
        isOpen={Boolean(bulkStatusConfirm)}
        onClose={() => setBulkStatusConfirm(null)}
        isBulk={true}
        count={bulkStatusConfirm?.ids.length || 0}
        entityType="business category"
        targetStatus={bulkStatusConfirm?.targetStatus || "ACTIVE"}
        onConfirm={handleBulkStatus}
      />
    </div>
  );
}
