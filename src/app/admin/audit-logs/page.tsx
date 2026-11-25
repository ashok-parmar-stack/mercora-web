"use client";

import React from "react";
import { useTableState } from "@/lib/hooks/useTableState";
import { useAbortableFetch } from "@/lib/hooks/useAbortableFetch";
import { adminV1Client } from "@/lib/http/client";
import {
  Badge,
  Column,
  DataTable,
  ErrorState,
  LoadingState,
  PageHeader,
} from "@/components/common";

interface AuditLogEntry {
  id: string;
  action: string;
  module: string;
  actorEmail: string;
  ipAddress: string;
  timestamp: string;
  severity: "INFO" | "WARNING" | "CRITICAL";
  details: string;
}

export default function AuditLogsPage() {
  const { search, setSearch } = useTableState({ defaultPageSize: 10 });
  const [logs, setLogs] = React.useState<AuditLogEntry[]>([]);

  const { isLoading, error, load } = useAbortableFetch(async (signal) => {
    const res = await adminV1Client.get<{ data?: AuditLogEntry[] }>("/audit-logs", {
      signal,
    });
    setLogs(res.data?.data || []);
  }, []);

  const filtered = logs.filter((l) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      l.action.toLowerCase().includes(q) ||
      l.actorEmail.toLowerCase().includes(q) ||
      l.details.toLowerCase().includes(q) ||
      l.module.toLowerCase().includes(q)
    );
  });

  const columns: Column<AuditLogEntry>[] = [
    {
      key: "timestamp",
      header: "Timestamp",
      render: (l) => (
        <div className="flex flex-col">
          <span className="font-mono text-xs font-bold text-gray-900">{l.timestamp}</span>
          <span className="text-[10px] text-gray-400">{l.ipAddress}</span>
        </div>
      ),
    },
    {
      key: "action",
      header: "Event & Action",
      render: (l) => (
        <div className="flex items-center gap-2">
          <Badge
            variant={
              l.severity === "CRITICAL" ? "danger" : l.severity === "WARNING" ? "warning" : "info"
            }
            size="sm"
          >
            {l.severity}
          </Badge>
          <code className="text-[11px] font-mono font-bold text-gray-800 bg-gray-100 px-1.5 py-0.5 rounded">
            {l.action}
          </code>
        </div>
      ),
    },
    {
      key: "module",
      header: "Module",
      render: (l) => (
        <Badge variant="purple" size="sm">
          {l.module}
        </Badge>
      ),
    },
    {
      key: "actorEmail",
      header: "Actor",
      render: (l) => (
        <span className="text-xs font-semibold text-gray-700">{l.actorEmail}</span>
      ),
    },
    {
      key: "details",
      header: "Log Context Details",
      render: (l) => <span className="text-xs text-gray-600 leading-snug">{l.details}</span>,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Security & System Audit Logs"
        description="Immutable administrative activity trail for compliance, forensic analysis, and security auditing."
      />

      {isLoading ? (
        <LoadingState message="Loading audit trails..." />
      ) : error ? (
        <ErrorState title="Unable to Load Audit Logs" message={error} onRetry={load} />
      ) : (
        <DataTable<AuditLogEntry>
          tableKey="audit-logs-table"
          data={filtered}
          columns={columns}
          keyExtractor={(l) => l.id}
          searchQuery={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search audit events by actor, action, or details..."
          enableSelection={false}
          emptyTitle="No Audit Logs Recorded"
          emptyDescription={
            search
              ? `No audit events matched "${search}".`
              : "No system events have been recorded yet."
          }
        />
      )}
    </div>
  );
}
