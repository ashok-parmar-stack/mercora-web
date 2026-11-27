import React from "react";
import Link from "next/link";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { SubDistrict } from "@mercora/shared-types";
import { Column } from "@/components/data-table/DataTable";
import { StatusBadge } from "@/components/status/StatusBadge";
import { Tooltip } from "@/components/common";

export function getSubDistrictColumns(): Column<SubDistrict>[] {
  return [
    {
      key: "name",
      header: "Sub-District / Taluka",
      sortable: true,
      sortAccessor: (subDistrict) => subDistrict.name?.toLowerCase() ?? "",
      render: (subDistrict) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-50 text-cyan-700 flex items-center justify-center font-bold text-xs flex-shrink-0 border border-cyan-200">
            {subDistrict.code ? subDistrict.code.substring(0, 2) : "SD"}
          </div>
          <div className="min-w-0">
            <div className="font-extrabold text-gray-900 text-xs truncate">{subDistrict.name}</div>
            <div className="text-[11px] text-gray-400 truncate max-w-xs">
              {subDistrict.localName || subDistrict.name}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "code",
      header: "Code",
      align: "center",
      sortable: true,
      width: "100px",
      sortAccessor: (subDistrict) => subDistrict.code ?? "",
      render: (subDistrict) => (
        <span className="inline-block px-2 py-0.5 rounded font-mono font-extrabold text-[11px] bg-cyan-50 text-cyan-700 border border-cyan-200">
          {subDistrict.code}
        </span>
      ),
    },
    {
      key: "district",
      header: "Parent District",
      sortable: true,
      width: "160px",
      sortAccessor: (subDistrict) => subDistrict.district?.name ?? "",
      render: (subDistrict) => (
        <span className="text-xs font-semibold text-gray-800 truncate">
          {subDistrict.district?.name || "—"}
        </span>
      ),
    },
    {
      key: "type",
      header: "Type",
      align: "center",
      sortable: true,
      width: "130px",
      sortAccessor: (subDistrict) => subDistrict.type ?? "",
      render: (subDistrict) => (
        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-gray-100 text-gray-700">
          {subDistrict.type || "SUB_DISTRICT"}
        </span>
      ),
    },
    {
      key: "censusCode",
      header: "Census / LGD",
      align: "center",
      sortable: true,
      width: "130px",
      sortAccessor: (subDistrict) => subDistrict.censusCode ?? "",
      render: (subDistrict) => (
        <span className="font-mono text-gray-600 text-xs">
          {subDistrict.censusCode || "—"}
        </span>
      ),
    },
    {
      key: "source",
      header: "Source",
      align: "center",
      sortable: true,
      width: "110px",
      render: (subDistrict) => (
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-700">
          {subDistrict.source || "MANUAL"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      align: "center",
      sortable: true,
      width: "120px",
      sortAccessor: (subDistrict) => subDistrict.status?.code ?? "ACTIVE",
      render: (subDistrict) => (
        <StatusBadge
          status={subDistrict.status?.code || (subDistrict.statusId ? "ACTIVE" : undefined)}
          isDeleted={Boolean(subDistrict.deletedAt)}
        />
      ),
    },
  ];
}

export function renderSubDistrictRowActions(
  subDistrict: SubDistrict,
  {
    onView,
    onDelete,
  }: {
    onView: (sd: SubDistrict) => void;
    onDelete: (sd: SubDistrict) => void;
  }
) {
  return (
    <div className="flex items-center justify-end gap-1">
      <Tooltip content="View Sub-District Details">
        <button
          type="button"
          onClick={() => onView(subDistrict)}
          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          aria-label="View details"
        >
          <Eye className="w-4 h-4" />
        </button>
      </Tooltip>

      <Tooltip content="Edit Sub-District">
        <Link
          href={`/admin/sub-districts/${subDistrict.id}/edit`}
          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          aria-label="Edit sub-district"
        >
          <Pencil className="w-4 h-4" />
        </Link>
      </Tooltip>

      <Tooltip content="Delete Sub-District">
        <button
          type="button"
          onClick={() => onDelete(subDistrict)}
          className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
          aria-label="Delete sub-district"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </Tooltip>
    </div>
  );
}
