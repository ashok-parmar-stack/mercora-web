"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { RotateCcw, Eye } from "lucide-react";
import {
  PageHeader,
  Badge,
  DataTable,
  Select,
  ErrorState,
  Button,
  type Column,
} from "@/components/common";
import { extractErrorMessage } from "@/lib/http/client";
import { formatCurrencyAmount, formatLocalDateTime } from "@/lib/format";
import { fetchAdminRefunds } from "@/features/subscriptions/api/subscription-api";
import type { RefundRecord } from "@/features/subscriptions/types";

export default function AdminRefundsPage() {
  const [rows, setRows] = useState<RefundRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(
    (signal?: AbortSignal) => {
      setLoading(true);
      setError(null);
      fetchAdminRefunds(
        {
          page,
          limit,
          search: search.trim() || undefined,
          status: status || undefined,
        },
        signal
      )
        .then((res) => {
          setRows(res.data || []);
          setTotal(res.meta?.total || 0);
        })
        .catch((err) => {
          if (err?.name !== "AbortError") setError(extractErrorMessage(err));
        })
        .finally(() => setLoading(false));
    },
    [page, limit, search, status]
  );

  useEffect(() => {
    const ctrl = new AbortController();
    loadData(ctrl.signal);
    return () => ctrl.abort();
  }, [loadData]);

  const columns: Column<RefundRecord>[] = [
    {
      key: "gatewayRefundId",
      header: "Refund Reference",
      render: (r) => (
        <div>
          <p className="font-mono text-xs font-semibold text-text-primary">
            {r.gatewayRefundId || r.id.slice(0, 8)}
          </p>
          <p className="text-[11px] text-text-muted">{r.gateway.toUpperCase()}</p>
        </div>
      ),
    },
    {
      key: "businessName",
      header: "Business & Plan",
      render: (r) => (
        <div>
          <p className="text-sm font-medium text-text-primary">
            {r.businessName || r.businessId}
          </p>
          <p className="text-xs text-text-muted">{r.planName || "Subscription"}</p>
        </div>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      render: (r) => (
        <span className="font-semibold text-text-primary">
          {formatCurrencyAmount(r.amount, r.currency, { alwaysShowDecimals: true })}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (r) => (
        <Badge
          variant={
            r.status === "PROCESSED"
              ? "success"
              : r.status === "FAILED"
              ? "danger"
              : "warning"
          }
          size="sm"
        >
          {r.status}
        </Badge>
      ),
    },
    {
      key: "reason",
      header: "Reason",
      render: (r) => <span className="text-xs text-text-secondary">{r.reason}</span>,
    },
    {
      key: "createdAt",
      header: "Initiated At",
      render: (r) => (
        <span className="text-xs text-text-muted">
          {formatLocalDateTime(r.createdAt)}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Refunds"
        description="Track full and partial Razorpay refunds synchronized across gateway APIs and webhooks."
        badge={
          <Badge variant="neutral" size="sm">
            <RotateCcw className="w-3 h-3" /> {total} Total
          </Badge>
        }
      />

      {error && (
        <ErrorState title="Unable to load refunds" message={error} onRetry={() => loadData()} />
      )}

      <DataTable
        tableKey="admin-refunds"
        data={rows}
        columns={columns}
        keyExtractor={(r) => r.id}
        isLoading={loading}
        emptyTitle="No refunds recorded"
        emptyDescription="Full and partial subscription refunds will appear here once initiated."
        searchQuery={search}
        onSearchChange={(v) => {
          setSearch(v);
          setPage(1);
        }}
        searchPlaceholder="Search refund ID, payment ID, or business..."
        filterSlot={
          <div className="w-44">
            <Select
              selectSize="sm"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              options={[
                { value: "", label: "All Statuses" },
                { value: "PENDING", label: "Pending" },
                { value: "PROCESSED", label: "Processed" },
                { value: "FAILED", label: "Failed" },
              ]}
            />
          </div>
        }
        renderActions={(r) => (
          <Button
            size="sm"
            variant="outline"
            leftIcon={<Eye className="w-3.5 h-3.5" />}
            asChild
          >
            <Link href={`/admin/payments/transactions/${r.paymentId}`}>
              Transaction
            </Link>
          </Button>
        )}
        totalCount={total}
        currentPage={page}
        pageSize={limit}
        onPageChange={setPage}
        onPageSizeChange={(s) => {
          setLimit(s);
          setPage(1);
        }}
      />
    </div>
  );
}
