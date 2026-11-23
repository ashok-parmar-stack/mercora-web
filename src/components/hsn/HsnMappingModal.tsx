import React from "react";
import { Boxes, Trash2 } from "lucide-react";
import { Modal } from "../ui/Modal";
import { Select } from "../ui/Select";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
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
            <Select
              value={selectedCatToMap}
              onChange={(e) => setSelectedCatToMap(e.target.value)}
              className="flex-1"
            >
              <option value="">-- Select Product Category --</option>
              {allCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {"— ".repeat((cat.level || 1) - 1)} {cat.name} (L{cat.level || 1})
                </option>
              ))}
            </Select>
            <Button
              type="button"
              size="sm"
              variant="primary"
              onClick={onAddCatMapping}
              disabled={!selectedCatToMap}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              Map
            </Button>
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
                      <Badge variant="success" size="sm">
                        PRIMARY
                      </Badge>
                    )}
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => onRemoveCatMapping(m.productCategoryId)}
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
