import React from "react";
import { X } from "lucide-react";
import { SubDistrict } from "@mercora/shared-types";
import { StatusBadge } from "@/components/status/StatusBadge";

interface SubDistrictDetailModalProps {
  subDistrict: SubDistrict | null;
  onClose: () => void;
}

export function SubDistrictDetailModal({
  subDistrict,
  onClose,
}: SubDistrictDetailModalProps) {
  if (!subDistrict) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-2">
            <span className="w-7 h-5 rounded bg-cyan-50 border border-cyan-200 text-xs font-bold text-cyan-700 flex items-center justify-center">
              {subDistrict.code}
            </span>
            <h3 className="font-extrabold text-gray-900 text-sm">
              {subDistrict.name}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-gray-400 font-medium block">Sub-District Code</span>
              <span className="font-mono font-bold text-gray-900 mt-0.5 block">{subDistrict.code}</span>
            </div>
            <div>
              <span className="text-gray-400 font-medium block">Type</span>
              <span className="font-semibold text-gray-900 mt-0.5 block">{subDistrict.type || "SUB_DISTRICT"}</span>
            </div>
          </div>

          <div>
            <span className="text-gray-400 font-medium block">Parent District</span>
            <span className="font-bold text-gray-900 mt-0.5 block">{subDistrict.district?.name || "—"}</span>
          </div>

          {subDistrict.censusCode && (
            <div>
              <span className="text-gray-400 font-medium block">Census / LGD Code</span>
              <span className="font-mono text-gray-900 mt-0.5 block">{subDistrict.censusCode}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100">
            <div>
              <span className="text-gray-400 font-medium block">Data Source</span>
              <span className="font-mono text-gray-900">{subDistrict.source || "MANUAL"}</span>
            </div>
            <div>
              <span className="text-gray-400 font-medium block">Status</span>
              <div className="mt-0.5">
                <StatusBadge status={subDistrict.status?.code || "ACTIVE"} />
              </div>
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
}
