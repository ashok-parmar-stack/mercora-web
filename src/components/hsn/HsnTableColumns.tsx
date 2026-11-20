import React from "react";
import { FolderTree, Eye, Trash2 } from "lucide-react";
import { HsnCode, HsnLevel } from "@mercora/shared-types";
import { Column } from "../data-table/DataTable";
import { Tooltip } from "../ui/Tooltip";

export const renderHsnLevelBadge = (level: HsnLevel) => {
  switch (level) {
    case "CHAPTER_2":
      return (
        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
          2-Digit Chapter
        </span>
      );
    case "HEADING_4":
      return (
        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
          4-Digit Heading
        </span>
      );
    case "SUBHEADING_6":
      return (
        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
          6-Digit Subheading
        </span>
      );
    case "TARIFF_8":
      return (
        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          8-Digit Tariff Item
        </span>
      );
    default:
      return (
        <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-gray-100 text-gray-700">
          {level}
        </span>
      );
  }
};

export const hsnColumns: Column<HsnCode>[] = [
  {
    key: "code",
    header: "HSN Tariff Code",
    sortable: true,
    width: "180px",
    sortAccessor: (h) => h.code,
    render: (h) => (
      <div className="flex items-center gap-2">
        <span className="font-mono font-black text-xs text-gray-900 bg-gray-100 px-2 py-1 rounded-md border border-gray-200">
          {h.code}
        </span>
        {(h.source === 'SYSTEM' || h.source === 'GOVERNMENT_CBIC') && (
          <span className="px-1.5 py-0.5 text-[10px] font-bold bg-purple-100 text-purple-700 rounded">
            SYS
          </span>
        )}
      </div>
    ),
  },
  {
    key: "name",
    header: "Official Commodity Description",
    sortable: true,
    sortAccessor: (h) => h.name?.toLowerCase() ?? "",
    render: (h) => (
      <div className="max-w-md">
        <div className="font-semibold text-gray-900 text-xs line-clamp-2 leading-relaxed">
          {h.name}
        </div>
        {h.description && (
          <div className="text-[11px] text-gray-400 line-clamp-1 mt-0.5">{h.description}</div>
        )}
      </div>
    ),
  },
  {
    key: "level",
    header: "Hierarchy Level",
    align: "center",
    sortable: true,
    width: "160px",
    sortAccessor: (h) => h.level,
    render: (h) => renderHsnLevelBadge(h.level),
  },
  {
    key: "unit",
    header: "Standard UQC",
    align: "center",
    width: "120px",
    render: (h) => (
      <span className="font-mono text-xs font-semibold text-gray-600 bg-gray-50 px-2 py-0.5 rounded border border-gray-200">
        {h.unit || "—"}
      </span>
    ),
  },
  {
    key: "source",
    header: "Sync Source",
    align: "center",
    width: "130px",
    render: (h) => (
      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
        {h.source}
      </span>
    ),
  },
];

export function renderHsnRowActions(
  hsn: HsnCode,
  options: {
    onOpenMapping: (hsn: HsnCode) => void;
    onViewHsn: (hsn: HsnCode) => void;
    onDeleteHsn: (hsn: HsnCode) => void;
  }
) {
  return (
    <div className="flex items-center justify-end gap-1">
      <Tooltip content="Map Product Categories">
        <button
          type="button"
          onClick={() => options.onOpenMapping(hsn)}
          className="p-1.5 rounded-lg text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 transition-colors cursor-pointer"
          aria-label="Map categories"
        >
          <FolderTree className="w-4 h-4" />
        </button>
      </Tooltip>
      <Tooltip content="View Tariff Details">
        <button
          type="button"
          onClick={() => options.onViewHsn(hsn)}
          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          aria-label="View tariff details"
        >
          <Eye className="w-4 h-4" />
        </button>
      </Tooltip>
      {hsn.source !== 'SYSTEM' && (
        <Tooltip content="Delete Code">
          <button
            type="button"
            onClick={() => options.onDeleteHsn(hsn)}
            className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
            aria-label="Delete code"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </Tooltip>
      )}
    </div>
  );
}
