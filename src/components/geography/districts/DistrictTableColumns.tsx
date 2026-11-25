import React from "react";
import Link from "next/link";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { District } from "@mercora/shared-types";
import { Column } from "@/components/data-table/DataTable";
import { StatusBadge } from "@/components/status/StatusBadge";
import { Tooltip } from "@/components/ui/Tooltip";

export function getDistrictColumns(): Column<District>[] {
  return [
    {
      key: "name",
      header: "District / Province",
      sortable: true,
      sortAccessor: (district) => district.name?.toLowerCase() ?? "",
      render: (district) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-xs flex-shrink-0 border border-teal-200">
            {district.code ? district.code.substring(0, 2) : "DT"}
          </div>
          <div className="min-w-0">
            <div className="font-extrabold text-gray-900 text-xs truncate">{district.name}</div>
            <div className="text-[11px] text-gray-400 truncate max-w-xs">
              {district.localName || district.name}
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
      sortAccessor: (district) => district.code ?? "",
      render: (district) => (
        <span className="inline-block px-2 py-0.5 rounded font-mono font-extrabold text-[11px] bg-teal-50 text-teal-700 border border-teal-200">
          {district.code}
        </span>
      ),
    },
    {
      key: "state",
      header: "Parent State",
      sortable: true,
      width: "160px",
      sortAccessor: (district) => district.state?.name ?? "",
      render: (district) => (
        <span className="text-xs font-semibold text-gray-800 truncate">
          {district.state?.name || "—"}
        </span>
      ),
    },
    {
      key: "type",
      header: "Type",
      align: "center",
      sortable: true,
      width: "130px",
      sortAccessor: (district) => district.type ?? "",
      render: (district) => (
        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-gray-100 text-gray-700">
          {district.type || "DISTRICT"}
        </span>
      ),
    },
    {
      key: "censusCode",
      header: "Census / LGD",
      align: "center",
      sortable: true,
      width: "130px",
      sortAccessor: (district) => district.censusCode ?? "",
      render: (district) => (
        <span className="font-mono text-gray-600 text-xs">
          {district.censusCode || "—"}
        </span>
      ),
    },
    {
      key: "source",
      header: "Source",
      align: "center",
      sortable: true,
      width: "110px",
      render: (district) => (
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-700">
          {district.source || "MANUAL"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      align: "center",
      sortable: true,
      width: "120px",
      sortAccessor: (district) => district.status?.code ?? "ACTIVE",
      render: (district) => (
        <StatusBadge
          status={district.status?.code || (district.statusId ? "ACTIVE" : undefined)}
          isDeleted={Boolean(district.deletedAt)}
        />
      ),
    },
  ];
}

export function renderDistrictRowActions(
  district: District,
  {
    onView,
    onDelete,
  }: {
    onView: (d: District) => void;
    onDelete: (d: District) => void;
  }
) {
  return (
    <div className="flex items-center justify-end gap-1">
      <Tooltip content="View District Details">
        <button
          type="button"
          onClick={() => onView(district)}
          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          aria-label="View details"
        >
          <Eye className="w-4 h-4" />
        </button>
      </Tooltip>

      <Tooltip content="Edit District">
        <Link
          href={`/admin/districts/${district.id}/edit`}
          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          aria-label="Edit district"
        >
          <Pencil className="w-4 h-4" />
        </Link>
      </Tooltip>

      <Tooltip content="Delete District">
        <button
          type="button"
          onClick={() => onDelete(district)}
          className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
          aria-label="Delete district"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </Tooltip>
    </div>
  );
}
