import React from "react";
import { Hash, Layers } from "lucide-react";
import { HsnCode } from "@mercora/shared-types";

interface HsnKpiCardsProps {
  total: number;
  hsnCodes: HsnCode[];
}

export function HsnKpiCards({ total, hsnCodes }: HsnKpiCardsProps) {
  const chaptersCount = hsnCodes.filter((h) => h.level === "CHAPTER_2").length;
  const headingsCount = hsnCodes.filter((h) => h.level === "HEADING_4").length;
  const tariffCount = hsnCodes.filter((h) => h.level === "TARIFF_8").length;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-500 font-medium">Total HSN Codes</div>
          <div className="text-xl font-black text-gray-900 mt-1">{total}</div>
        </div>
        <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
          <Hash className="w-5 h-5" />
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-500 font-medium">Chapters (2-Digit)</div>
          <div className="text-xl font-black text-indigo-600 mt-1">{chaptersCount}</div>
        </div>
        <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
          <Layers className="w-5 h-5" />
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-500 font-medium">Headings (4-Digit)</div>
          <div className="text-xl font-black text-purple-600 mt-1">{headingsCount}</div>
        </div>
        <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
          <Layers className="w-5 h-5" />
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-500 font-medium">Tariff Items (8-Digit)</div>
          <div className="text-xl font-black text-emerald-600 mt-1">{tariffCount}</div>
        </div>
        <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
          <Hash className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
