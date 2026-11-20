"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  ChevronLeft,
  Eye,
  Layers,
  Activity,
  FileCheck,
  AlertOctagon,
  X,
} from "lucide-react";
import { useHsnSync } from "../../../lib/hooks/useHsnSync";
import { MasterSyncRun } from "@mercora/shared-types";
import { PageHeader } from "../../../components/layout/PageHeader";
import { DataTable, Column } from "../../../components/data-table/DataTable";
import { Tooltip } from "../../../components/ui/Tooltip";
import { useUIStore } from "../../../lib/store/ui-store";

export default function HsnSyncRunsPage() {
  const addToast = useUIStore((s) => s.addToast);
  const { syncRuns, activeRun, isLoading, isSyncing, refetch, loadRunDetails, triggerSync } =
    useHsnSync(50);

  const [viewingRun, setViewingRun] = useState<MasterSyncRun | null>(null);

  const handleTriggerSync = async () => {
    try {
      const res = await triggerSync("ICEGATE");
      addToast(
        "success",
        "Sync Job Completed",
        `ICEGATE sync done: ${res.insertedRecords} inserted, ${res.updatedRecords} updated, ${res.unchangedRecords} unchanged`,
      );
      refetch();
    } catch (err: any) {
      addToast("error", "Sync Failed", err?.message || "Sync execution failed");
    }
  };

  const handleOpenRunDetails = async (run: MasterSyncRun) => {
    const full = await loadRunDetails(run.id);
    if (full) {
      setViewingRun(full);
    } else {
      setViewingRun(run);
    }
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle className="w-3 h-3" />
            COMPLETED
          </span>
        );
      case "RUNNING":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <RefreshCw className="w-3 h-3 animate-spin" />
            RUNNING
          </span>
        );
      case "FAILED":
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertTriangle className="w-3 h-3" />
            FAILED
          </span>
        );
    }
  };

  const columns: Column<MasterSyncRun>[] = [
    {
      key: "startedAt",
      header: "Started At",
      sortable: true,
      sortAccessor: (run) => run.startedAt ?? "",
      render: (run) => (
        <div className="text-xs font-mono text-gray-900 font-medium">
          {run.startedAt ? new Date(run.startedAt).toLocaleString() : "N/A"}
        </div>
      ),
    },
    {
      key: "source",
      header: "Government Source",
      align: "center",
      sortable: true,
      render: (run) => (
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
          {run.source} ({run.masterType})
        </span>
      ),
    },
    {
      key: "status",
      header: "Job Status",
      align: "center",
      sortable: true,
      render: (run) => renderStatusBadge(run.status),
    },
    {
      key: "totalRecords",
      header: "Total Ingested",
      align: "center",
      sortable: true,
      sortAccessor: (run) => run.totalRecords ?? 0,
      render: (run) => (
        <span className="font-bold text-xs text-gray-900">
          {run.totalRecords}
        </span>
      ),
    },
    {
      key: "insertedRecords",
      header: "Inserted",
      align: "center",
      sortable: true,
      sortAccessor: (run) => run.insertedRecords ?? 0,
      render: (run) => (
        <span className="font-bold text-xs text-emerald-600">
          +{run.insertedRecords}
        </span>
      ),
    },
    {
      key: "updatedRecords",
      header: "Updated",
      align: "center",
      sortable: true,
      sortAccessor: (run) => run.updatedRecords ?? 0,
      render: (run) => (
        <span className="font-bold text-xs text-blue-600">
          {run.updatedRecords}
        </span>
      ),
    },
    {
      key: "unchangedRecords",
      header: "Unchanged",
      align: "center",
      sortable: true,
      sortAccessor: (run) => run.unchangedRecords ?? 0,
      render: (run) => (
        <span className="font-bold text-xs text-gray-400">
          {run.unchangedRecords}
        </span>
      ),
    },
    {
      key: "failedRecords",
      header: "Errors",
      align: "center",
      sortable: true,
      sortAccessor: (run) => run.failedRecords ?? 0,
      render: (run) =>
        run.failedRecords > 0 ? (
          <span className="font-bold text-xs text-rose-600">
            {run.failedRecords}
          </span>
        ) : (
          <span className="text-xs text-gray-400">0</span>
        ),
    },
  ];

  const renderActions = (run: MasterSyncRun) => (
    <div className="flex items-center justify-end">
      <Tooltip content="View Audit Details">
        <button
          type="button"
          onClick={() => handleOpenRunDetails(run)}
          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          aria-label="View run details"
        >
          <Eye className="w-4 h-4" />
        </button>
      </Tooltip>
    </div>
  );

  // Summary stats
  const totalRuns = syncRuns.length;
  const completedRuns = syncRuns.filter((r) => r.status === "COMPLETED").length;
  const failedRuns = syncRuns.filter((r) => r.status === "FAILED").length;
  const totalIngested = syncRuns.reduce((sum, r) => sum + (r.totalRecords || 0), 0);

  return (
    <div className="flex flex-col gap-6">
      {/* ── Standard Mercora Page Header ── */}
      <PageHeader
        title="HSN & Tariff Sync Runs"
        description="Audit execution history, official ICEGATE/GST ingestion logs, diff metrics, and sync run errors."
        actionButton={{
          label: "Trigger Sync Now",
          onClick: handleTriggerSync,
          icon: <RefreshCw className={`w-4 h-4 ${isSyncing ? "animate-spin" : ""}`} />,
        }}
        extraActions={
          <div className="flex items-center gap-2">
            <Link
              href="/admin/hsn-codes"
              className="px-3 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>HSN Codes</span>
            </Link>

            <button
              type="button"
              onClick={() => refetch()}
              className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 transition-colors shadow-2xs cursor-pointer"
              title="Refresh Sync Log"
              aria-label="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-brand-600" : ""}`} />
            </button>
          </div>
        }
      />

      {/* ── KPI Metric Summary Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-500 font-medium">Total Sync Runs</div>
            <div className="text-xl font-black text-gray-900 mt-1">
              {totalRuns}
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Activity className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-500 font-medium">Completed Runs</div>
            <div className="text-xl font-black text-emerald-600 mt-1">
              {completedRuns}
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <FileCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-500 font-medium">Failed Runs</div>
            <div className="text-xl font-black text-rose-600 mt-1">
              {failedRuns}
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertOctagon className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-500 font-medium">Total Ingested</div>
            <div className="text-xl font-black text-purple-600 mt-1">
              {totalIngested}
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* ── Main Unified DataTable with Pagination ── */}
      <DataTable<MasterSyncRun>
        tableKey="hsn-sync-runs-table"
        columns={columns}
        data={syncRuns}
        keyExtractor={(run) => run.id}
        isLoading={isLoading}
        renderActions={renderActions}
        showColumnPicker={true}
        defaultPageSize={10}
        emptyTitle="No sync runs recorded yet"
        emptyDescription="Click 'Trigger Sync Now' to execute the first ingestion job from ICEGATE."
      />

      {/* ── SYNC RUN DETAILS MODAL ── */}
      {viewingRun && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-gray-900 text-sm">
                  Sync Run Audit: {viewingRun.source} ({viewingRun.masterType})
                </span>
              </div>
              <button
                type="button"
                onClick={() => setViewingRun(null)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                <div>
                  <span className="text-gray-400 font-medium block">Job Status</span>
                  <div className="mt-1">{renderStatusBadge(viewingRun.status)}</div>
                </div>
                <div>
                  <span className="text-gray-400 font-medium block">Total Ingested</span>
                  <div className="font-bold text-gray-900 mt-1">{viewingRun.totalRecords}</div>
                </div>
                <div>
                  <span className="text-gray-400 font-medium block">Started At</span>
                  <div className="font-mono text-gray-900 mt-0.5">
                    {viewingRun.startedAt
                      ? new Date(viewingRun.startedAt).toLocaleString()
                      : "N/A"}
                  </div>
                </div>
                <div>
                  <span className="text-gray-400 font-medium block">Completed At</span>
                  <div className="font-mono text-gray-900 mt-0.5">
                    {viewingRun.completedAt
                      ? new Date(viewingRun.completedAt).toLocaleString()
                      : "N/A"}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-center">
                  <div className="text-gray-500 text-[10px]">Inserted</div>
                  <div className="text-emerald-700 font-bold text-sm">+{viewingRun.insertedRecords}</div>
                </div>
                <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-lg text-center">
                  <div className="text-gray-500 text-[10px]">Updated</div>
                  <div className="text-blue-700 font-bold text-sm">{viewingRun.updatedRecords}</div>
                </div>
                <div className="p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-center">
                  <div className="text-gray-500 text-[10px]">Unchanged</div>
                  <div className="text-gray-700 font-bold text-sm">{viewingRun.unchangedRecords}</div>
                </div>
              </div>

              {viewingRun.errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg">
                  <strong>Execution Error:</strong> {viewingRun.errorMessage}
                </div>
              )}
            </div>

            <div className="px-6 py-3 bg-gray-50/50 border-t border-gray-100 flex justify-end">
              <button
                type="button"
                onClick={() => setViewingRun(null)}
                className="px-4 py-1.5 bg-white border border-gray-200 text-gray-700 text-xs font-bold rounded-lg hover:bg-gray-50 transition-colors shadow-2xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
