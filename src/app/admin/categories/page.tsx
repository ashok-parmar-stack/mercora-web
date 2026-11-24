"use client";

import React, { useState, useMemo } from "react";
import { Plus, RefreshCw, FolderTree, Sparkles, List } from "lucide-react";
import { useProductCategories } from "../../../lib/hooks/useProductCategories";
import { CategoryTreeNode, ProductCategory } from "@mercora/shared-types";
import { PageHeader } from "../../../components/layout/PageHeader";
import { Button } from "@/components/common";
import { DataTable, BulkAction } from "../../../components/data-table/DataTable";
import { DeleteConfirmDialog, StatusConfirmDialog } from "../../../components/common/ConfirmDialog";
import { Select } from "../../../components/ui/Select";
import { CategoryStatsCards } from "../../../components/categories/CategoryStatsCards";
import { CategoryTreeView } from "../../../components/categories/CategoryTreeView";
import { CategoryMoveModal } from "../../../components/categories/CategoryMoveModal";
import { CategoryMapHsnModal } from "../../../components/categories/CategoryMapHsnModal";
import { CategoryDetailsModal } from "../../../components/categories/CategoryDetailsModal";
import {
  getCategoryColumns,
  renderCategoryRowActions,
} from "../../../components/categories/CategoryTableColumns";
import { useCategoryOperations } from "../../../components/categories/useCategoryOperations";

export default function ProductCategoriesAdminPage() {
  const {
    categories: rawCategories,
    tree,
    isLoading,
    isTreeLoading,
    refetch,
    refetchTree,
    create,
    update,
    move,
    remove,
    seedBaseline,
  } = useProductCategories({ limit: 1000 });

  const categories = Array.isArray(rawCategories) ? rawCategories : [];

  // View mode switcher: "table" (default) or "tree"
  const [viewMode, setViewMode] = useState<"table" | "tree">("table");

  // Filtering & Search
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [levelFilter, setLevelFilter] = useState("ALL");
  const [expandedNodeIds, setExpandedNodeIds] = useState<Set<string>>(new Set());

  // Operations Hook
  const ops = useCategoryOperations({
    categories,
    create,
    update,
    move,
    remove,
    seedBaseline,
    refetch,
    refetchTree,
  });

  // Tree expand/collapse helpers
  const toggleNode = (nodeId: string) => {
    setExpandedNodeIds((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) next.delete(nodeId);
      else next.add(nodeId);
      return next;
    });
  };

  const expandAll = () => {
    const allIds = new Set<string>();
    const collectIds = (nodes: CategoryTreeNode[]) => {
      for (const node of nodes) {
        allIds.add(node.id);
        if (node.children && node.children.length > 0) collectIds(node.children);
      }
    };
    collectIds(tree);
    setExpandedNodeIds(allIds);
  };

  const collapseAll = () => setExpandedNodeIds(new Set());

  // Filter categories for Table View
  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => {
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchName = cat.name?.toLowerCase().includes(q);
        const matchCode = cat.code?.toLowerCase().includes(q);
        const matchSlug = cat.slug?.toLowerCase().includes(q);
        if (!matchName && !matchCode && !matchSlug) return false;
      }
      if (statusFilter !== "ALL") {
        const status = cat.status?.code || "ACTIVE";
        if (status !== statusFilter) return false;
      }
      if (levelFilter !== "ALL") {
        if (levelFilter === "L1" && cat.level !== 1) return false;
        if (levelFilter === "L2" && cat.level !== 2) return false;
        if (levelFilter === "L3" && cat.level !== 3) return false;
        if (levelFilter === "L4_PLUS" && (cat.level || 1) < 4) return false;
      }
      return true;
    });
  }, [categories, searchTerm, statusFilter, levelFilter]);

  // Filter tree nodes by search
  const filterNodes = (nodes: CategoryTreeNode[], query: string): CategoryTreeNode[] => {
    if (!query.trim()) return nodes;
    const q = query.toLowerCase();
    return nodes.reduce<CategoryTreeNode[]>((acc, node) => {
      const matchSelf =
        node.name?.toLowerCase().includes(q) ||
        node.code?.toLowerCase().includes(q) ||
        node.slug?.toLowerCase().includes(q);
      const matchingChildren = node.children ? filterNodes(node.children, query) : [];
      if (matchSelf || matchingChildren.length > 0) {
        acc.push({
          ...node,
          children: matchingChildren.length > 0 ? matchingChildren : node.children,
        });
      }
      return acc;
    }, []);
  };

  const filteredTree = useMemo(() => filterNodes(tree, searchTerm), [tree, searchTerm]);

  // Statistics
  const stats = useMemo(() => {
    const total = categories.length;
    const roots = categories.filter((c) => !c.parentId).length;
    const maxLevel = categories.reduce((max, c) => Math.max(max, c.level || 1), 1);
    const systemCount = categories.filter((c) => c.isSystem).length;
    return { total, roots, maxLevel, systemCount };
  }, [categories]);

  // Helper map for parent names
  const categoryMap = useMemo(() => {
    const map = new Map<string, ProductCategory>();
    for (const c of categories) map.set(c.id, c);
    return map;
  }, [categories]);

  const columns = useMemo(() => getCategoryColumns(categoryMap), [categoryMap]);

  // Bulk Actions
  const bulkActions: BulkAction<ProductCategory>[] = [
    {
      label: "Mark Active",
      variant: "primary",
      onClick: async (selectedIds) => {
        ops.setBulkStatusConfirm({ ids: selectedIds, targetStatus: "ACTIVE" });
      },
    },
    {
      label: "Mark Inactive",
      variant: "secondary",
      onClick: async (selectedIds) => {
        ops.setBulkStatusConfirm({ ids: selectedIds, targetStatus: "INACTIVE" });
      },
    },
    {
      label: "Delete Selected",
      variant: "danger",
      onClick: async (selectedIds) => {
        ops.setBulkDeletingIds(selectedIds);
      },
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* ── Standard Mercora Page Header ── */}
      <PageHeader
        title="Product Category Master"
        description="Flipkart-style infinite self-referencing hierarchy (Parent → Child → Subchild) with official HSN compliance mapping."
        actionButton={{
          label: "Add Category",
          href: "/admin/categories/create",
          icon: <Plus className="w-4 h-4" />,
        }}
        extraActions={
          <div className="flex items-center gap-2">
            {/* View Switcher Pill */}
            <div className="bg-gray-100 p-1 rounded-xl flex items-center gap-1 border border-gray-200/80">
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === "table"
                    ? "bg-white text-gray-900 shadow-2xs"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>Table View</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("tree")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === "tree"
                    ? "bg-white text-gray-900 shadow-2xs"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                <FolderTree className="w-3.5 h-3.5" />
                <span>Tree View</span>
              </button>
            </div>

            {/* Seed Baseline Button */}
            <Button
              variant="outline"
              size="md"
              onClick={ops.handleSeedBaseline}
              disabled={ops.isSeeding}
              leftIcon={<Sparkles className={`w-3.5 h-3.5 text-amber-500 ${ops.isSeeding ? "animate-spin" : ""}`} />}
              title="Populate baseline Ceramic & Tiles category hierarchy"
            >
              <span>{ops.isSeeding ? "Seeding..." : "Seed Baseline"}</span>
            </Button>

            {/* Refresh Button */}
            <Button
              variant="outline"
              size="md"
              onClick={() => {
                refetch();
                refetchTree();
              }}
              className="w-10 h-10 p-0"
              title="Refresh Categories"
              aria-label="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading || isTreeLoading ? "animate-spin text-primary" : ""}`} />
            </Button>
          </div>
        }
      />

      {/* ── KPI Metric Summary Cards ── */}
      <CategoryStatsCards stats={stats} />

      {/* ── Main View Area (Table View or Tree View) ── */}
      {viewMode === "table" ? (
        <DataTable<ProductCategory>
          tableKey="product-categories-table"
          data={filteredCategories}
          columns={columns}
          keyExtractor={(c) => c.id}
          isLoading={isLoading}
          searchQuery={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Search categories by name, code, slug..."
          emptyTitle="No product categories found"
          emptyDescription="Click 'Seed Baseline' or 'Add Category' to start populating your catalog hierarchy."
          renderActions={(cat) =>
            renderCategoryRowActions(cat, {
              onOpenMapHsn: ops.handleOpenMapHsn,
              onOpenMove: ops.handleOpenMove,
              onViewDetails: ops.setViewingCategory,
              onDeleteCategory: ops.setDeleteConfirmCategory,
            })
          }
          bulkActions={bulkActions}
          showColumnPicker={true}
          defaultPageSize={10}
          filterSlot={
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="w-36">
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  dropdownPosition="bottom"
                  aria-label="Filter by status"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </Select>
              </div>

              <div className="w-40">
                <Select
                  value={levelFilter}
                  onChange={(e) => setLevelFilter(e.target.value)}
                  dropdownPosition="bottom"
                  aria-label="Filter by level"
                >
                  <option value="ALL">All Hierarchy Levels</option>
                  <option value="L1">Level 1 (Roots)</option>
                  <option value="L2">Level 2 (Categories)</option>
                  <option value="L3">Level 3 (Subcategories)</option>
                  <option value="L4_PLUS">Level 4+ (Leaf Items)</option>
                </Select>
              </div>
            </div>
          }
        />
      ) : (
        <CategoryTreeView
          tree={filteredTree}
          isTreeLoading={isTreeLoading}
          searchTerm={searchTerm}
          expandedNodeIds={expandedNodeIds}
          toggleNode={toggleNode}
          expandAll={expandAll}
          collapseAll={collapseAll}
          totalNodes={stats.total}
          onOpenMove={ops.handleOpenMove}
          onOpenMapHsn={ops.handleOpenMapHsn}
          onDeleteCategory={(cat) => ops.setDeleteConfirmCategory(cat)}
          onSeedBaseline={ops.handleSeedBaseline}
        />
      )}

      {/* ── MOVE / REPARENT CATEGORY MODAL ── */}
      <CategoryMoveModal
        isOpen={ops.isMoveModalOpen}
        onClose={() => ops.setIsMoveModalOpen(false)}
        selectedCategory={ops.selectedCategory}
        categories={categories}
        targetParentId={ops.targetParentId}
        setTargetParentId={ops.setTargetParentId}
        formError={ops.formError}
        isSubmitting={ops.isSubmitting}
        onSubmit={ops.handleSaveMove}
      />

      {/* ── MAP HSN CODES MODAL ── */}
      <CategoryMapHsnModal
        isOpen={ops.isMapHsnModalOpen}
        onClose={() => ops.setIsMapHsnModalOpen(false)}
        selectedCategory={ops.selectedCategory}
        availableHsns={ops.availableHsns}
        mappedHsns={ops.mappedHsns}
        selectedHsnToMap={ops.selectedHsnToMap}
        setSelectedHsnToMap={ops.setSelectedHsnToMap}
        isPrimaryMapping={ops.isPrimaryMapping}
        setIsPrimaryMapping={ops.setIsPrimaryMapping}
        isLoadingMappings={ops.isLoadingMappings}
        onAddMapping={ops.handleAddHsnMapping}
        onRemoveMapping={ops.handleRemoveHsnMapping}
      />

      {/* ── VIEW CATEGORY DETAILS MODAL ── */}
      <CategoryDetailsModal
        category={ops.viewingCategory}
        categories={categories}
        onClose={() => ops.setViewingCategory(null)}
      />

      {/* ── Single Delete Confirmation Dialog ── */}
      <DeleteConfirmDialog
        isOpen={Boolean(ops.deleteConfirmCategory)}
        onClose={() => ops.setDeleteConfirmCategory(null)}
        entityName={ops.deleteConfirmCategory?.name}
        entityType="product category"
        onConfirm={ops.handleDeleteCategory}
      />

      {/* ── Bulk Delete Confirmation Dialog ── */}
      <DeleteConfirmDialog
        isOpen={Boolean(ops.bulkDeletingIds && ops.bulkDeletingIds.length > 0)}
        onClose={() => ops.setBulkDeletingIds(null)}
        isBulk={true}
        count={ops.bulkDeletingIds?.length || 0}
        entityType="product category"
        onConfirm={ops.handleBulkDelete}
      />

      {/* ── Bulk Status Confirmation Dialog ── */}
      <StatusConfirmDialog
        isOpen={Boolean(ops.bulkStatusConfirm)}
        onClose={() => ops.setBulkStatusConfirm(null)}
        isBulk={true}
        count={ops.bulkStatusConfirm?.ids.length || 0}
        entityType="product category"
        targetStatus={ops.bulkStatusConfirm?.targetStatus || "ACTIVE"}
        onConfirm={ops.handleBulkStatusUpdate}
      />
    </div>
  );
}
