"use client";

import React, { useState, useEffect, useCallback } from "react";
import { PageHeader } from "../../../components/layout/PageHeader";
import { DataTable, Column } from "../../../components/data-table/DataTable";
import { Badge } from "../../../components/ui/Badge";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";

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
  const [search, setSearch] = useState("");
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/v1/admin/audit-logs", { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        setLogs(json.data || []);
      } else {
        throw new Error(`Failed to load audit trails (HTTP ${res.status})`);
      }
    } catch (err: any) {
      console.error("Error loading audit logs:", err);
      setError(err?.message || "Unable to connect to audit log service.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

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
              l.severity === "CRITICAL" ? "red" : l.severity === "WARNING" ? "amber" : "blue"
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

      {loading ? (
        <LoadingState message="Loading audit trails..." />
      ) : error ? (
        <ErrorState
          title="Unable to Load Audit Logs"
          message={error}
          onRetry={loadLogs}
        />
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
          emptyDescription={search ? `No audit events matched "${search}".` : "No system events have been recorded yet."}
        />
      )}
    </div>
  );
}
