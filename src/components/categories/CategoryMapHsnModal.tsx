import React from "react";
import { Trash2 } from "lucide-react";
import { Modal } from "../ui/Modal";
import { Select } from "../ui/Select";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
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
            <Select
              value={selectedHsnToMap}
              onChange={(e) => setSelectedHsnToMap(e.target.value)}
              className="flex-1 font-mono"
            >
              <option value="">-- Select HSN Code --</option>
              {availableHsns.map((hsn) => (
                <option key={hsn.id} value={hsn.id}>
                  {hsn.code} ({hsn.level}) — {hsn.name}
                </option>
              ))}
            </Select>
            <Button
              type="button"
              size="sm"
              variant="primary"
              onClick={onAddMapping}
              disabled={!selectedHsnToMap}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              Map
            </Button>
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
                      <Badge variant="success" size="sm">
                        PRIMARY
                      </Badge>
                    )}
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => onRemoveMapping(m.hsnCodeId)}
                    className="h-7 w-7 p-0 text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end pt-3 border-t">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onClose}
          >
            Done
          </Button>
        </div>
      </div>
    </Modal>
  );
};
