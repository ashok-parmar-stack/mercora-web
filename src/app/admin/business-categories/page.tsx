"use client";

import React, { useMemo, useState } from "react";
import { FolderTree, List, Plus, RefreshCw } from "lucide-react";
import {
  BulkAction,
  Button,
  DataTable,
  DeleteConfirmDialog,
  ErrorState,
  PageHeader,
  Select,
  StatusConfirmDialog,
} from "@/components/common";
import { BusinessCategoryItem } from "@/features/business-categories/types";
import { useBusinessCategoryAdmin } from "@/features/business-categories/hooks/use-business-category-admin";
import { BusinessCategoryFormModal } from "@/features/business-categories/components/BusinessCategoryFormModal";
import { BusinessCategoryHierarchyView } from "@/features/business-categories/components/BusinessCategoryHierarchyView";
import { BusinessCategoryKpiStrip } from "@/features/business-categories/components/BusinessCategoryKpiStrip";
import {
  getBusinessCategoryColumns,
  renderBusinessCategoryRowActions,
} from "@/features/business-categories/components/business-category-columns";

export default function AdminBusinessCategoriesPage() {
  const [viewMode, setViewMode] = useState<"table" | "tree">("table");
  const {
    categories,
    rootCategories,
    categoryMap,
    stats,
    filteredCategories,
    isLoading,
    error,
    loadCategories,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    hierarchyFilter,
    setHierarchyFilter,
    isFormOpen,
    setIsFormOpen,
    editingCategory,
    prefilledParentId,
    deleteTarget,
    setDeleteTarget,
    bulkDeletingIds,
    setBulkDeletingIds,
    bulkStatusConfirm,
    setBulkStatusConfirm,
    handleOpenCreate,
    handleOpenEdit,
    handleSaveCategory,
    handleToggleStatus,
    handleDeleteSingle,
    handleBulkDelete,
    handleBulkStatus,
  } = useBusinessCategoryAdmin();

  const columns = useMemo(
    () => getBusinessCategoryColumns(categoryMap, handleToggleStatus),
    [categoryMap, handleToggleStatus]
  );

  const bulkActions: BulkAction<BusinessCategoryItem>[] = [
    { label: "Mark Active", variant: "primary", onClick: (ids) => setBulkStatusConfirm({ ids, targetStatus: "ACTIVE" }) },
    { label: "Mark Inactive", variant: "secondary", onClick: (ids) => setBulkStatusConfirm({ ids, targetStatus: "INACTIVE" }) },
    { label: "Delete Selected", variant: "danger", onClick: (ids) => setBulkDeletingIds(ids) },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Business Category Master"
        description="Dynamic management of core business types, logistics roles, and operational classifications across Mercora."
        actionButton={{ label: "Add Category", onClick: () => handleOpenCreate(), icon: <Plus className="w-4 h-4" /> }}
        extraActions={
          <div className="flex items-center gap-2">
            <div className="bg-background-secondary p-1 rounded-xl flex items-center gap-1 border border-border">
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === "table" ? "bg-surface text-text-primary shadow-2xs" : "text-text-muted hover:text-text-primary"
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>Table</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("tree")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === "tree" ? "bg-surface text-text-primary shadow-2xs" : "text-text-muted hover:text-text-primary"
                }`}
              >
                <FolderTree className="w-3.5 h-3.5" />
                <span>Hierarchy</span>
              </button>
            </div>
            <Button variant="outline" size="md" onClick={loadCategories} className="w-10 h-10 p-0" aria-label="Refresh">
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-primary" : ""}`} />
            </Button>
          </div>
        }
      />

      <BusinessCategoryKpiStrip stats={stats} />

      {error ? (
        <ErrorState title="Unable to Load Business Categories" message={error} onRetry={loadCategories} />
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
              onAddSubcategory: handleOpenCreate,
              onEdit: handleOpenEdit,
              onDelete: setDeleteTarget,
            })
          }
          filterSlot={
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="w-36">
                <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} selectSize="sm" aria-label="Filter by status">
                  <option value="ALL">All Statuses</option>
                  <option value="ACTIVE">Active Only</option>
                  <option value="INACTIVE">Inactive Only</option>
                </Select>
              </div>
              <div className="w-44">
                <Select value={hierarchyFilter} onChange={(e) => setHierarchyFilter(e.target.value)} selectSize="sm" aria-label="Filter by hierarchy">
                  <option value="ALL">All Hierarchy</option>
                  <option value="ROOT">Top-Level Primary</option>
                  <option value="SUBCATEGORY">Subcategories Only</option>
                </Select>
              </div>
            </div>
          }
        />
      ) : (
        <BusinessCategoryHierarchyView
          rootCategories={rootCategories}
          allCategories={categories}
          onCreateSubcategory={handleOpenCreate}
          onEdit={handleOpenEdit}
          onDelete={setDeleteTarget}
        />
      )}

      <BusinessCategoryFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        editingCategory={editingCategory}
        prefilledParentId={prefilledParentId}
        rootCategories={rootCategories}
        defaultOrder={categories.length + 1}
        onSave={handleSaveCategory}
      />

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
        onConfirm={handleDeleteSingle}
      />

      <DeleteConfirmDialog
        isOpen={Boolean(bulkDeletingIds?.length)}
        onClose={() => setBulkDeletingIds(null)}
        isBulk={true}
        count={bulkDeletingIds?.length || 0}
        entityType="business category"
        onConfirm={handleBulkDelete}
      />

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
