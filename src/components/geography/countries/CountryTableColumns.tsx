import React from "react";
import Link from "next/link";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Country } from "@mercora/shared-types";
import { Column } from "@/components/data-table/DataTable";
import { StatusBadge } from "@/components/status/StatusBadge";
import { Tooltip } from "@/components/ui/Tooltip";

export function getCountryColumns(): Column<Country>[] {
  return [
    {
      key: "name",
      header: "Country / Territory",
      sortable: true,
      sortAccessor: (country) => country.name?.toLowerCase() ?? "",
      render: (country) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
            {country.iso2Code}
          </div>
          <div className="min-w-0">
            <div className="font-extrabold text-gray-900 text-xs truncate">{country.name}</div>
            <div className="text-[11px] text-gray-400 truncate max-w-xs">
              {country.officialName || country.name}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "iso2Code",
      header: "ISO Alpha-2",
      align: "center",
      sortable: true,
      width: "95px",
      minWidth: "95px",
      sortAccessor: (country) => country.iso2Code ?? "",
      render: (country) => (
        <span className="inline-block px-2 py-0.5 rounded font-mono font-extrabold text-[11px] bg-blue-50 text-blue-700 border border-blue-200">
          {country.iso2Code}
        </span>
      ),
    },
    {
      key: "iso3Code",
      header: "ISO Alpha-3",
      align: "center",
      sortable: true,
      width: "95px",
      minWidth: "95px",
      sortAccessor: (country) => country.iso3Code ?? "",
      render: (country) => (
        <span className="inline-block px-2 py-0.5 rounded font-mono font-bold text-[11px] bg-gray-100 text-gray-800">
          {country.iso3Code}
        </span>
      ),
    },
    {
      key: "phoneCode",
      header: "Calling Code",
      align: "center",
      sortable: true,
      width: "105px",
      minWidth: "105px",
      sortAccessor: (country) => country.phoneCode ?? "",
      render: (country) => (
        <span className="font-mono text-gray-600 text-[11px] font-medium">
          {country.phoneCode ? `+${country.phoneCode.replace("+", "")}` : "—"}
        </span>
      ),
    },
    {
      key: "currencyCode",
      header: "Currency",
      align: "center",
      sortable: true,
      width: "95px",
      minWidth: "95px",
      sortAccessor: (country) => country.currencyCode ?? "",
      render: (country) => (
        <span className="font-mono text-gray-700 font-bold text-[11px]">
          {country.currencyCode || "—"}
        </span>
      ),
    },
    {
      key: "source",
      header: "Source",
      align: "center",
      sortable: true,
      width: "95px",
      minWidth: "95px",
      render: (country) => (
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-700">
          {country.source || "MANUAL"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      align: "center",
      sortable: true,
      width: "110px",
      minWidth: "110px",
      sortAccessor: (country) => country.status?.code ?? "ACTIVE",
      render: (country) => (
        <StatusBadge
          status={country.status?.code || (country.statusId ? "ACTIVE" : undefined)}
          isDeleted={Boolean(country.deletedAt)}
        />
      ),
    },
  ];
}

export function renderCountryRowActions(
  country: Country,
  {
    onView,
    onDelete,
  }: {
    onView: (c: Country) => void;
    onDelete: (c: Country) => void;
  }
) {
  return (
    <div className="flex items-center justify-end gap-1">
      <Tooltip content="View Country Details">
        <button
          type="button"
          onClick={() => onView(country)}
          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          aria-label="View details"
        >
          <Eye className="w-4 h-4" />
        </button>
      </Tooltip>

      <Tooltip content="Edit Country">
        <Link
          href={`/admin/countries/${country.id}/edit`}
          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          aria-label="Edit country"
        >
          <Pencil className="w-4 h-4" />
        </Link>
      </Tooltip>

      <Tooltip content="Delete Country">
        <button
          type="button"
          onClick={() => onDelete(country)}
          className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
          aria-label="Delete country"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </Tooltip>
    </div>
  );
}
