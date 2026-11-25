import React from "react";
import { ProductCategory } from "@mercora/shared-types";
import { CategoryMoveModal } from "./CategoryMoveModal";
import { CategoryMapHsnModal } from "./CategoryMapHsnModal";
import { CategoryDetailsModal } from "./CategoryDetailsModal";
import { DeleteConfirmDialog, StatusConfirmDialog } from "../common/ConfirmDialog";

interface CategoryModalsContainerProps {
  ops: any;
  categories: ProductCategory[];
}

export function CategoryModalsContainer({ ops, categories }: CategoryModalsContainerProps) {
  return (
    <>
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
    </>
  );
}
