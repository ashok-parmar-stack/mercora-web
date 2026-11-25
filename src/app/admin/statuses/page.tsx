"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useStatuses } from "../../../lib/hooks/useStatuses";
import { Status } from "../../../lib/admin-types";
import { PageHeader } from "../../../components/layout/PageHeader";
import { Button } from "@/components/common";
import { DataTable, Column, BulkAction } from "../../../components/data-table/DataTable";
import { StatusBadge } from "../../../components/status/StatusBadge";
import { Tooltip } from "../../../components/ui/Tooltip";
import { Badge } from "../../../components/ui/Badge";
import { Select } from "../../../components/ui/Select";
import { Plus, Pencil, RefreshCw, Download } from "lucide-react";

export default function StatusesListPage() {
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<string>("ALL");

  const { statuses, isLoading, refetch } = useStatuses(
    selectedType !== "ALL" ? selectedType : undefined
  );

  const statusTypes = [
    "ALL",
    "USER",
    "ROLE",
    "PERMISSION",
    "PERMISSION_ACTION",
    "EMAIL_TEMPLATE",
    "COMPANY",
    "LEAD",
  ];

  const filteredStatuses = statuses.filter((s) => {
    if (selectedType !== "ALL" && s.type !== selectedType) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = s.name.toLowerCase().includes(q);
      const matchCode = s.code.toLowerCase().includes(q);
      const matchType = s.type.toLowerCase().includes(q);
      if (!matchName && !matchCode && !matchType) return false;
    }
    return true;
  });

  const columns: Column<Status>[] = [
    {
      key: "type",
      header: "Domain Type",
      render: (s) => (
        <Badge variant="purple" size="sm">
          {s.type}
        </Badge>
      ),
    },
    {
      key: "code",
      header: "Status Code",
      render: (s) => (
        <code className="text-xs font-mono font-bold text-gray-900 dark:text-gray-200 bg-gray-50 dark:bg-white/[0.06] border border-gray-200 dark:border-white/10 px-2 py-0.5 rounded">
          {s.code}
        </code>
      ),
    },
    {
      key: "name",
      header: "Display Name",
      render: (s) => <span className="font-extrabold text-xs text-gray-900 dark:text-white">{s.name}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (s) => <StatusBadge status={s.code} />,
    },
  ];

  const renderActions = (s: Status) => (
    <div className="flex items-center gap-1">
      <Tooltip content="Edit Status">
        <Link
          href={`/admin/statuses/${encodeURIComponent(s.id)}/edit`}
          className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/[0.08] transition-colors"
          aria-label="Edit status"
        >
          <Pencil className="w-4 h-4" />
        </Link>
      </Tooltip>
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Status Management"
        description="Unified lifecycle dictionary across Users, Roles, Permissions, Companies, and Leads."
        actionButton={{
          label: "Add Status",
          href: "/admin/statuses/create",
          icon: <Plus className="w-4 h-4" />,
        }}
        extraActions={
          <Button
            variant="outline"
            size="md"
            onClick={() => refetch()}
            className="w-10 h-10 p-0"
            title="Refresh"
            aria-label="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-primary" : ""}`} />
          </Button>
        }
      />

      <DataTable<Status>
        tableKey="statuses-table"
        data={filteredStatuses}
        columns={columns}
        keyExtractor={(s) => s.id}
        isLoading={isLoading}
        searchQuery={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by type, code, or name..."
        emptyTitle="No statuses defined"
        emptyDescription="No status entries found for the selected type filter."
        enableSelection={true}
        showColumnPicker={true}
        bulkActions={[
          {
            label: "Export Selected CSV",
            variant: "outline",
            icon: <Download className="w-3.5 h-3.5" />,
            onClick: (_ids, items) => {
              const csv = [
                "Type,Code,Name",
                ...items.map((i) => `"${i.type}","${i.code}","${i.name}"`),
              ].join("\n");
              const link = document.createElement("a");
              link.href = encodeURI("data:text/csv;charset=utf-8," + csv);
              link.download = `statuses_export_${Date.now()}.csv`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            },
          },
        ] satisfies BulkAction<Status>[]}
        renderActions={renderActions}
        filterSlot={
          <div className="w-48">
            <Select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              {statusTypes.map((t) => (
                <option key={t} value={t}>
                  {t === "ALL" ? "All Domain Types" : t}
                </option>
              ))}
            </Select>
          </div>
        }
      />
    </div>
  );
}
