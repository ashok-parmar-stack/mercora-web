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

      {!isLoading && !error && logs.length > 0 && (
        <div className="bg-surface border border-border rounded-xl p-4 shadow-2xs flex flex-col gap-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-text-primary">Audit Severity Breakdown</span>
            <span className="text-text-muted font-data">{logs.length} total events</span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-surface-hover overflow-hidden flex">
            <div
              className="bg-info h-full"
              style={{
                width: `${(logs.filter((l) => l.severity === "INFO").length / logs.length) * 100}%`,
              }}
              title="INFO"
            />
            <div
              className="bg-warning h-full"
              style={{
                width: `${(logs.filter((l) => l.severity === "WARNING").length / logs.length) * 100}%`,
              }}
              title="WARNING"
            />
            <div
              className="bg-destructive h-full"
              style={{
                width: `${(logs.filter((l) => l.severity === "CRITICAL").length / logs.length) * 100}%`,
              }}
              title="CRITICAL"
            />
          </div>
          <div className="flex items-center gap-4 text-[11px] text-text-secondary flex-wrap">
            <span>Info: <strong className="text-text-primary">{logs.filter((l) => l.severity === "INFO").length}</strong></span>
            <span>Warning: <strong className="text-text-primary">{logs.filter((l) => l.severity === "WARNING").length}</strong></span>
            <span>Critical: <strong className="text-text-primary">{logs.filter((l) => l.severity === "CRITICAL").length}</strong></span>
          </div>
        </div>
      )}

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
