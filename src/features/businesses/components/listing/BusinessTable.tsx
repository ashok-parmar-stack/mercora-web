"use client";

import React from "react";
import Link from "next/link";
import { Download, Building2, ExternalLink } from "lucide-react";
import { Business } from "../../types/business.types";
import { BusinessBadge } from "../shared/BusinessBadge";
import { DataTable, Column, BulkAction } from "@/components/data-table/DataTable";
import { Button, Tooltip } from "@/components/common";

export interface BusinessTableProps {
  businesses: Business[];
  onSelect?: (business: Business) => void;
}

function downloadBusinessesCsv(rowsToExport: Business[]) {
  if (!rowsToExport.length) return;
  const headers = [
    "Name",
    "Category",
    "BusinessType",
    "City",
    "State",
    "ProductsCount",
    "Verified",
    "EstablishedYear",
    "Phone",
    "Email",
  ];
  const rows = rowsToExport.map((b) => [
    `"${b.name.replace(/"/g, '""')}"`,
    `"${b.category}"`,
    `"${b.businessType}"`,
    `"${b.city}"`,
    `"${b.state}"`,
    b.products?.length || 0,
    b.isVerified ? "Yes" : "No",
    b.establishedYear,
    `"${b.phone}"`,
    `"${b.email}"`,
  ]);
  const csvContent =
    "data:text/csv;charset=utf-8," +
    [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
  const link = document.createElement("a");
  link.setAttribute("href", encodeURI(csvContent));
  link.setAttribute("download", `b2b_businesses_export_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function BusinessTable({ businesses, onSelect }: BusinessTableProps) {
  const columns: Column<Business>[] = [
    {
      key: "name",
      header: "Business",
      sortable: true,
      sortAccessor: (b) => b.name.toLowerCase(),
      render: (business) => (
        <div
          onClick={() => onSelect && onSelect(business)}
          className="flex items-center gap-3 cursor-pointer group min-w-[200px]"
        >
          <div className="w-8 h-8 rounded-lg bg-primary-soft text-primary flex items-center justify-center font-bold text-xs flex-shrink-0 overflow-hidden">
            {business.logoUrl ? (
              <img src={business.logoUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <Building2 className="w-4 h-4" />
            )}
          </div>
          <div className="min-w-0">
            <div className="font-bold text-xs text-text-primary group-hover:text-primary transition-colors truncate">
              {business.name}
            </div>
            <div className="text-[11px] text-text-muted truncate max-w-xs">
              {business.city}, {business.state}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      sortable: true,
      render: (b) => (
        <span className="text-xs text-text-secondary font-medium">{b.category}</span>
      ),
    },
    {
      key: "businessType",
      header: "Type",
      sortable: true,
      render: (b) => (
        <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-surface-hover text-text-secondary border border-border">
          {b.businessType}
        </span>
      ),
    },
    {
      key: "city",
      header: "Location",
      sortable: true,
      sortAccessor: (b) => `${b.city}, ${b.state}`.toLowerCase(),
      render: (b) => (
        <span className="text-xs text-text-secondary">
          {b.city}, {b.state}
        </span>
      ),
    },
    {
      key: "products",
      header: "Products",
      align: "center",
      sortable: true,
      sortAccessor: (b) => b.products?.length || 0,
      render: (b) => (
        <span className="text-xs font-bold text-text-primary">{b.products?.length || 0}</span>
      ),
    },
    {
      key: "isVerified",
      header: "Verification",
      sortable: true,
      sortAccessor: (b) => (b.isVerified ? 1 : 0),
      render: (b) => (
        <BusinessBadge isVerified={b.isVerified} tier={b.tier} size="sm" />
      ),
    },
    {
      key: "establishedYear",
      header: "Est.",
      align: "center",
      sortable: true,
      render: (b) => <span className="text-xs text-text-muted">{b.establishedYear}</span>,
    },
  ];

  const bulkActions: BulkAction<Business>[] = [
    {
      label: "Export Selected CSV",
      variant: "outline",
      icon: <Download className="w-3.5 h-3.5" />,
      onClick: (_ids, selectedItems) => downloadBusinessesCsv(selectedItems),
    },
  ];

  return (
    <DataTable<Business>
      tableKey="public-businesses-table"
      data={businesses}
      columns={columns}
      keyExtractor={(b) => b.id}
      enableSelection={true}
      bulkActions={bulkActions}
      showColumnPicker={true}
      defaultPageSize={12}
      filterSlot={
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => downloadBusinessesCsv(businesses)}
          leftIcon={<Download className="w-3.5 h-3.5" />}
        >
          Export All CSV
        </Button>
      }
      renderActions={(business) => (
        <Tooltip content="Open Profile">
          <Link
            href={`/businesses/${business.slug}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline px-2 py-1 rounded-lg hover:bg-primary-soft transition-colors"
          >
            <span>Profile</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </Tooltip>
      )}
    />
  );
}
