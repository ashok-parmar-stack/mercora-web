import React from "react";
import { Trash2 } from "lucide-react";
import { Modal } from "../ui/Modal";
import { HsnCode, HsnCodeCategoryMapping, ProductCategory } from "@mercora/shared-types";

interface CategoryMapHsnModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory: ProductCategory | null;
  availableHsns: HsnCode[];
  mappedHsns: HsnCodeCategoryMapping[];
  selectedHsnToMap: string;
  setSelectedHsnToMap: (id: string) => void;
  isPrimaryMapping: boolean;
  setIsPrimaryMapping: (val: boolean) => void;
  isLoadingMappings: boolean;
  onAddMapping: () => void;
  onRemoveMapping: (hsnCodeId: string) => void;
}

export const CategoryMapHsnModal: React.FC<CategoryMapHsnModalProps> = ({
  isOpen,
  onClose,
  selectedCategory,
  availableHsns,
  mappedHsns,
  selectedHsnToMap,
  setSelectedHsnToMap,
  isPrimaryMapping,
  setIsPrimaryMapping,
  isLoadingMappings,
  onAddMapping,
  onRemoveMapping,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`HSN Mappings: ${selectedCategory?.name || ""}`}
    >
      <div className="space-y-4">
        <div className="text-xs text-gray-500">
          Link official Government HSN / Tariff codes to this category for tax calculation and export classification.
        </div>

        {/* Add Mapping Form */}
        <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
          <div className="text-xs font-bold text-gray-800">Map New HSN Code</div>
          <div className="flex items-center gap-2">
            <select
              value={selectedHsnToMap}
              onChange={(e) => setSelectedHsnToMap(e.target.value)}
              className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none font-mono"
            >
              <option value="">-- Select HSN Code --</option>
              {availableHsns.map((hsn) => (
                <option key={hsn.id} value={hsn.id}>
                  {hsn.code} ({hsn.level}) — {hsn.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={onAddMapping}
              disabled={!selectedHsnToMap}
              className="px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 shadow-2xs disabled:opacity-50 cursor-pointer"
            >
              Map
            </button>
          </div>
          <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={isPrimaryMapping}
              onChange={(e) => setIsPrimaryMapping(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 accent-brand-600 text-brand-600 focus:ring-brand-500 cursor-pointer"
            />
            <span>Set as Primary Tax Code for this category</span>
          </label>
        </div>

        {/* Active Mappings List */}
        <div>
          <div className="text-xs font-bold text-gray-800 mb-2">
            Current Mapped HSN Codes ({mappedHsns.length})
          </div>
          {isLoadingMappings ? (
            <div className="py-4 text-center text-xs text-gray-400">Loading mappings...</div>
          ) : mappedHsns.length === 0 ? (
            <div className="p-4 text-center text-xs text-gray-400 bg-gray-50 rounded-lg border border-gray-200">
              No HSN codes mapped to this category yet.
            </div>
          ) : (
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {mappedHsns.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-gray-50 border border-gray-200 text-xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <code className="font-bold text-gray-900 bg-white px-1.5 py-0.5 rounded border border-gray-200">
                      {m.hsnCode?.code}
                    </code>
                    <span className="truncate text-gray-600">{m.hsnCode?.name}</span>
                    {m.isPrimary && (
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                        PRIMARY
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemoveMapping(m.hsnCodeId)}
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
