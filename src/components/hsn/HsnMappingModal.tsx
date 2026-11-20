import React from "react";
import { Boxes, Trash2 } from "lucide-react";
import { Modal } from "../ui/Modal";
import { HsnCode, HsnCodeCategoryMapping, ProductCategory } from "@mercora/shared-types";

interface HsnMappingModalProps {
  mappingHsn: HsnCode | null;
  onClose: () => void;
  allCategories: ProductCategory[];
  mappedCategories: HsnCodeCategoryMapping[];
  selectedCatToMap: string;
  setSelectedCatToMap: (val: string) => void;
  isPrimaryCat: boolean;
  setIsPrimaryCat: (val: boolean) => void;
  isLoadingMappings: boolean;
  onAddCatMapping: () => void;
  onRemoveCatMapping: (catId: string) => void;
}

export const HsnMappingModal: React.FC<HsnMappingModalProps> = ({
  mappingHsn,
  onClose,
  allCategories,
  mappedCategories,
  selectedCatToMap,
  setSelectedCatToMap,
  isPrimaryCat,
  setIsPrimaryCat,
  isLoadingMappings,
  onAddCatMapping,
  onRemoveCatMapping,
}) => {
  return (
    <Modal
      isOpen={Boolean(mappingHsn)}
      onClose={onClose}
      title={`Map Categories: HSN ${mappingHsn?.code || ""}`}
    >
      <div className="space-y-4">
        <div className="text-xs text-gray-500">
          Associate this official HSN classification code with one or more product categories.
        </div>

        <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
          <div className="text-xs font-bold text-gray-800">Add Category Mapping</div>
          <div className="flex items-center gap-2">
            <select
              value={selectedCatToMap}
              onChange={(e) => setSelectedCatToMap(e.target.value)}
              className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
            >
              <option value="">-- Select Product Category --</option>
              {allCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {"— ".repeat((cat.level || 1) - 1)} {cat.name} (L{cat.level || 1})
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={onAddCatMapping}
              disabled={!selectedCatToMap}
              className="px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 shadow-2xs disabled:opacity-50 cursor-pointer"
            >
              Map
            </button>
          </div>
          <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={isPrimaryCat}
              onChange={(e) => setIsPrimaryCat(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 accent-brand-600 text-brand-600 focus:ring-brand-500 cursor-pointer"
            />
            <span>Set as primary category for this HSN</span>
          </label>
        </div>

        <div>
          <div className="text-xs font-bold text-gray-800 mb-2">
            Mapped Categories ({mappedCategories.length})
          </div>
          {isLoadingMappings ? (
            <div className="py-4 text-center text-xs text-gray-400">Loading mappings...</div>
          ) : mappedCategories.length === 0 ? (
            <div className="p-4 text-center text-xs text-gray-400 bg-gray-50 rounded-lg border border-gray-200">
              No categories mapped to this HSN code yet.
            </div>
          ) : (
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {mappedCategories.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-gray-50 border border-gray-200 text-xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Boxes className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
                    <span className="font-bold text-gray-800 truncate">
                      {m.productCategory?.name}
                    </span>
                    {m.isPrimary && (
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                        PRIMARY
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemoveCatMapping(m.productCategoryId)}
                    className="text-rose-500 hover:text-rose-700 p-1 rounded hover:bg-rose-50 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end pt-3 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </Modal>
  );
};
