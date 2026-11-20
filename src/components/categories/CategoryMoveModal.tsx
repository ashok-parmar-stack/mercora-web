import React from "react";
import { AlertCircle } from "lucide-react";
import { Modal } from "../ui/Modal";
import { ProductCategory } from "@mercora/shared-types";

interface CategoryMoveModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory: ProductCategory | null;
  categories: ProductCategory[];
  targetParentId: string;
  setTargetParentId: (id: string) => void;
  formError: string | null;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export const CategoryMoveModal: React.FC<CategoryMoveModalProps> = ({
  isOpen,
  onClose,
  selectedCategory,
  categories,
  targetParentId,
  setTargetParentId,
  formError,
  isSubmitting,
  onSubmit,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Move Category: ${selectedCategory?.name || ""}`}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        {formError && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-800 leading-relaxed">
          Choose a new parent category. The tree depth levels and materialized paths will automatically recalculate. Moving under own subtrees is automatically prevented.
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Select Target Parent Category
          </label>
          <select
            value={targetParentId}
            onChange={(e) => setTargetParentId(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
          >
            <option value="">[ None - Move to Root Level ]</option>
            {categories
              .filter((c) => c.id !== selectedCategory?.id)
              .map((c) => (
                <option key={c.id} value={c.id}>
                  {"— ".repeat((c.level || 1) - 1)} {c.name} (L{c.level || 1})
                </option>
              ))}
          </select>
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 text-xs font-bold text-white bg-purple-600 rounded-lg hover:bg-purple-700 shadow-2xs cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? "Moving..." : "Reparent Category"}
          </button>
        </div>
      </form>
    </Modal>
  );
};
