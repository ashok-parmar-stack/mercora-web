"use client";

import React, { useState } from "react";
import { CheckCircle, Layers, Trash2, XCircle } from "lucide-react";
import {
  BulkAction,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Column,
  DataTable,
  DeleteConfirmDialog,
  StatusConfirmDialog,
} from "@/components/common";
import { useUIStore } from "@/lib/store/ui-store";

export interface SampleItem {
  id: string;
  code: string;
  name: string;
  category: string;
  status: "ACTIVE" | "INACTIVE" | "PENDING";
  updatedAt: string;
}

const SAMPLE_DATA: SampleItem[] = [
  { id: "s-1", code: "TMPL_INVITE", name: "Enterprise User Invitation", category: "AUTH", status: "ACTIVE", updatedAt: "2026-09-29" },
  { id: "s-2", code: "TMPL_RESET", name: "Security Password Reset", category: "SECURITY", status: "ACTIVE", updatedAt: "2026-09-28" },
  { id: "s-3", code: "TMPL_DIGEST", name: "Daily Trade Intelligence Digest", category: "NOTIFICATION", status: "ACTIVE", updatedAt: "2026-09-27" },
  { id: "s-4", code: "TMPL_KYC_VERIFY", name: "KYC Onboarding Verification", category: "COMPLIANCE", status: "PENDING", updatedAt: "2026-09-26" },
  { id: "s-5", code: "TMPL_ORDER_CONFIRM", name: "B2B Export Order Confirmation", category: "ORDERS", status: "ACTIVE", updatedAt: "2026-09-25" },
];

export function DataTableShowcase({
  onOpenSampleDelete,
}: {
  onOpenSampleDelete: (item: SampleItem) => void;
}) {
  const addToast = useUIStore((s) => s.addToast);
  const [tableData, setTableData] = useState<SampleItem[]>(SAMPLE_DATA);
  const [tableSearch, setTableSearch] = useState("");
  const [sampleDeleteConfirm, setSampleDeleteConfirm] = useState<SampleItem | null>(null);
  const [sampleBulkDelete, setSampleBulkDelete] = useState<string[] | null>(null);
  const [sampleBulkStatus, setSampleBulkStatus] = useState<{
    ids: string[];
    targetStatus: string;
  } | null>(null);

  const filteredData = tableData.filter(
    (item) =>
      item.name.toLowerCase().includes(tableSearch.toLowerCase()) ||
      item.code.toLowerCase().includes(tableSearch.toLowerCase()) ||
      item.category.toLowerCase().includes(tableSearch.toLowerCase())
  );

  const columns: Column<SampleItem>[] = [
    {
      key: "name",
      header: "Template Name & Code",
      sortable: true,
      render: (item) => (
        <div>
          <div className="font-bold text-gray-900">{item.name}</div>
          <div className="font-mono text-[11px] text-gray-400 uppercase">{item.code}</div>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      sortable: true,
      render: (item) => (
        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-700">
          {item.category}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (item) => (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${
            item.status === "ACTIVE"
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : item.status === "PENDING"
              ? "bg-amber-50 text-amber-700 border border-amber-200"
              : "bg-gray-100 text-gray-600 border border-gray-200"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              item.status === "ACTIVE"
                ? "bg-emerald-500"
                : item.status === "PENDING"
                ? "bg-amber-500"
                : "bg-gray-400"
            }`}
          />
          {item.status}
        </span>
      ),
    },
    {
      key: "updatedAt",
      header: "Last Modified",
      sortable: true,
      render: (item) => <span className="font-mono text-xs text-gray-500">{item.updatedAt}</span>,
    },
  ];

  const bulkActions: BulkAction<SampleItem>[] = [
    {
      label: "Activate Selected",
      variant: "primary",
      icon: <CheckCircle className="w-3.5 h-3.5" />,
      onClick: async (ids) => setSampleBulkStatus({ ids, targetStatus: "ACTIVE" }),
    },
    {
      label: "Deactivate Selected",
      variant: "secondary",
      icon: <XCircle className="w-3.5 h-3.5" />,
      onClick: async (ids) => setSampleBulkStatus({ ids, targetStatus: "INACTIVE" }),
    },
    {
      label: "Delete Selected",
      variant: "danger",
      icon: <Trash2 className="w-3.5 h-3.5" />,
      onClick: async (ids) => setSampleBulkDelete(ids),
    },
  ];

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-brand-600" />
            <CardTitle>3. Standardized Multi-Select Data Table</CardTitle>
          </div>
          <CardDescription>
            Live demonstration of row selection, branded checkboxes, count pill, bulk action bar,
            column visibility picker, and row highlights.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <DataTable<SampleItem>
            tableKey="storybook-sample-table"
            data={filteredData}
            columns={columns}
            keyExtractor={(item) => item.id}
            searchQuery={tableSearch}
            onSearchChange={setTableSearch}
            searchPlaceholder="Search sample templates..."
            bulkActions={bulkActions}
            defaultSortKey="name"
            defaultSortDir="asc"
            renderActions={(item) => (
              <button
                type="button"
                onClick={() => {
                  setSampleDeleteConfirm(item);
                  onOpenSampleDelete(item);
                }}
                className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                title="Delete item"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          />
        </CardContent>
      </Card>

      <DeleteConfirmDialog
        isOpen={Boolean(sampleDeleteConfirm)}
        onClose={() => setSampleDeleteConfirm(null)}
        entityName={sampleDeleteConfirm?.name}
        entityType="sample template"
        onConfirm={async () => {
          if (sampleDeleteConfirm) {
            setTableData((prev) => prev.filter((d) => d.id !== sampleDeleteConfirm.id));
            addToast("success", "Template Deleted", `${sampleDeleteConfirm.name} has been removed.`);
            setSampleDeleteConfirm(null);
          }
        }}
      />

      <DeleteConfirmDialog
        isOpen={Boolean(sampleBulkDelete && sampleBulkDelete.length > 0)}
        onClose={() => setSampleBulkDelete(null)}
        isBulk={true}
        count={sampleBulkDelete?.length || 0}
        entityType="sample template"
        onConfirm={async () => {
          if (sampleBulkDelete) {
            setTableData((prev) => prev.filter((d) => !sampleBulkDelete.includes(d.id)));
            addToast("success", "Bulk Delete Completed", `Successfully removed ${sampleBulkDelete.length} templates.`);
            setSampleBulkDelete(null);
          }
        }}
      />

      <StatusConfirmDialog
        isOpen={Boolean(sampleBulkStatus)}
        onClose={() => setSampleBulkStatus(null)}
        isBulk={true}
        count={sampleBulkStatus?.ids.length || 0}
        entityType="sample template"
        targetStatus={sampleBulkStatus?.targetStatus || "ACTIVE"}
        onConfirm={async () => {
          if (sampleBulkStatus) {
            setTableData((prev) =>
              prev.map((item) =>
                sampleBulkStatus.ids.includes(item.id)
                  ? { ...item, status: sampleBulkStatus.targetStatus as SampleItem["status"] }
                  : item
              )
            );
            addToast(
              "success",
              "Status Updated",
              `Updated status to ${sampleBulkStatus.targetStatus} for ${sampleBulkStatus.ids.length} records.`
            );
            setSampleBulkStatus(null);
          }
        }}
      />
    </>
  );
}
