import React from "react";
import { ChevronRight, X } from "lucide-react";
import { HsnCode, HsnLevel } from "@mercora/shared-types";

interface HsnDetailsModalProps {
  hsn: HsnCode | null;
  onClose: () => void;
  renderLevelBadge: (level: HsnLevel) => React.ReactNode;
}

export const HsnDetailsModal: React.FC<HsnDetailsModalProps> = ({
  hsn,
  onClose,
  renderLevelBadge,
}) => {
  if (!hsn) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold flex items-center justify-center font-mono">
              HSN
            </span>
            <h3 className="font-extrabold text-gray-900 text-sm truncate">HSN Tariff Details</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-gray-400 font-medium block">Official Code</span>
              <span className="font-mono font-bold text-gray-900 mt-0.5 block">{hsn.code}</span>
            </div>
            <div>
              <span className="text-gray-400 font-medium block">Hierarchy Level</span>
              <span className="mt-0.5 block">{renderLevelBadge(hsn.level)}</span>
            </div>
          </div>

          <div>
            <span className="text-gray-400 font-medium block">Breadcrumb Path</span>
            <div className="flex items-center gap-1.5 mt-1 flex-wrap text-xs text-gray-700 font-semibold bg-gray-50 p-2.5 rounded-lg border border-gray-200">
              <span className="text-gray-500">Home</span>
              <ChevronRight className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
              <span className="text-gray-500">HSN Codes</span>
              <ChevronRight className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
              <span className="text-brand-600 font-extrabold font-mono">{hsn.code}</span>
            </div>
          </div>

          <div>
            <span className="text-gray-400 font-medium block">Commodity Description</span>
            <p className="font-bold text-gray-900 mt-0.5">{hsn.name}</p>
            {hsn.description && <p className="text-gray-600 mt-1">{hsn.description}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100">
            <div>
              <span className="text-gray-400 font-medium block">Standard UQC Unit</span>
              <span className="font-mono text-gray-900">{hsn.unit || "N/A"}</span>
            </div>
            <div>
              <span className="text-gray-400 font-medium block">Data Source</span>
              <span className="font-mono text-gray-900">{hsn.source}</span>
            </div>
          </div>
        </div>

        <div className="px-6 py-3 bg-gray-50/50 border-t border-gray-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-white border border-gray-200 text-gray-700 text-xs font-bold rounded-lg hover:bg-gray-50 transition-colors shadow-2xs cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
