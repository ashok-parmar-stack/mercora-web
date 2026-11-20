import React from "react";
import { AlertCircle } from "lucide-react";
import { Modal } from "../ui/Modal";
import { ProductCategory } from "@mercora/shared-types";

interface CategoryCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: ProductCategory[];
  formData: {
    name: string;
    code: string;
    slug: string;
    parentId: string;
    description: string;
    sortOrder: number;
    isSystem: boolean;
    status: string;
  };
  setFormData: React.Dispatch<
    React.SetStateAction<{
      name: string;
      code: string;
      slug: string;
      parentId: string;
      description: string;
      icon: string;
      sortOrder: number;
      isSystem: boolean;
      status: string;
    }>
  >;
  formError: string | null;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export const CategoryCreateModal: React.FC<CategoryCreateModalProps> = ({
  isOpen,
  onClose,
  categories,
  formData,
  setFormData,
  formError,
  isSubmitting,
  onSubmit,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={formData.parentId ? "Add Child Subcategory" : "Create Root Category"}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        {formError && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Category Name *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Vitrified Floor Tiles"
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Category Code (Optional)
            </label>
            <input
              type="text"
              placeholder="Auto-generated if blank"
              value={formData.code}
              onChange={(e) => setFormData((prev) => ({ ...prev, code: e.target.value }))}
              className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 bg-white font-mono focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              URL Slug (Optional)
            </label>
            <input
              type="text"
              placeholder="Auto-generated if blank"
              value={formData.slug}
              onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
              className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 bg-white font-mono focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Parent Category
          </label>
          <select
            value={formData.parentId}
            onChange={(e) => setFormData((prev) => ({ ...prev, parentId: e.target.value }))}
            className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
          >
            <option value="">[ None - Top Level Root ]</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {"— ".repeat((c.level || 1) - 1)} {c.name} (L{c.level || 1})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Description
          </label>
          <textarea
            rows={2}
            placeholder="Description of this category..."
            value={formData.description}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
          />
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
            className="px-4 py-2 text-xs font-bold text-white bg-brand-600 rounded-lg hover:bg-brand-700 shadow-2xs cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? "Creating..." : "Create Category"}
          </button>
        </div>
      </form>
    </Modal>
  );
};
