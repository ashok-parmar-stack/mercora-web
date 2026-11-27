"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Download, Eye } from "lucide-react";
import {
  PageHeader,
  Badge,
  Button,
  DataTable,
  Input,
  Select,
  ErrorState,
  type Column,
} from "@/components/common";
import { extractErrorMessage } from "@/lib/http/client";
import {
  downloadInvoicePdf,
  exportAdminPaymentsCsv,
  fetchAdminPayments,
  fetchAdminPlans,
} from "../../api/subscription-api";
import type { PaymentRecord, SubscriptionPlan } from "../../types";

interface AdminTransactionsViewProps {
  title: string;
  description: string;
  fixedStatus?: string;
}

export function AdminTransactionsView({
  title,
  description,
  fixedStatus,
}: AdminTransactionsViewProps) {
  const [rows, setRows] = useState<PaymentRecord[]>([]);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(fixedStatus || "");
  const [method, setMethod] = useState("");
  const [planId, setPlanId] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAdminPlans()
      .then(setPlans)
      .catch(() => {});
  }, []);

  const effectiveStatus = fixedStatus || status || undefined;

  const loadData = useCallback(
    (signal?: AbortSignal) => {
      setLoading(true);
      setError(null);
      fetchAdminPayments(
        {
          page,
          limit,
          status: effectiveStatus,
          method: method || undefined,
          planId: planId || undefined,
          search: search.trim() || undefined,
          fromDate: fromDate || undefined,
          toDate: toDate || undefined,
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
    [page, limit, effectiveStatus, method, planId, search, fromDate, toDate]
  );

  useEffect(() => {
    const ctrl = new AbortController();
    loadData(ctrl.signal);
    return () => ctrl.abort();
  }, [loadData]);

  const handleExport = async () => {
    setExporting(true);
    try {
      await exportAdminPaymentsCsv({
        status: effectiveStatus,
        method: method || undefined,
        planId: planId || undefined,
        search: search.trim() || undefined,
        fromDate: fromDate || undefined,
        toDate: toDate || undefined,
      });
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setExporting(false);
    }
  };

  const columns: Column<PaymentRecord>[] = [
    {
      key: "order",
      header: "Gateway Refs",
      render: (p) => (
        <div>
          <p className="font-mono text-xs font-semibold text-text-primary">
            {p.gatewayOrderId || p.id.slice(0, 8)}
          </p>
          <p className="font-mono text-[11px] text-text-muted">
            {p.gatewayPaymentId || "Awaiting capture"}
          </p>
        </div>
      ),
    },
    {
      key: "business",
      header: "Business & Plan",
      render: (p) => (
        <div>
          <p className="text-sm font-semibold text-text-primary">
            {p.businessName || p.businessId}
          </p>
          <p className="text-xs text-text-muted">
            {p.planName || "Plan"} • {p.paymentType}
          </p>
        </div>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      render: (p) => (
        <div>
          <p className="font-semibold text-text-primary">
            ₹{Number(p.amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </p>
          {p.refundedAmount > 0 && (
            <p className="text-[11px] text-destructive">
              Refunded: ₹{Number(p.refundedAmount).toLocaleString("en-IN")}
            </p>
          )}
        </div>
      ),
    },
    {
      key: "method",
      header: "Method",
      render: (p) => (
        <span className="text-xs uppercase font-medium text-text-secondary">
          {p.paymentMethod || p.gateway}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (p) => (
        <div>
          <Badge
            variant={
              p.paymentStatus === "CAPTURED"
                ? "success"
                : p.paymentStatus === "FAILED" || p.paymentStatus === "REFUNDED"
                ? "danger"
                : p.paymentStatus === "PARTIALLY_REFUNDED"
                ? "warning"
                : "neutral"
            }
            size="sm"
          >
            {p.paymentStatus}
          </Badge>
          {p.failureReason && (
            <p className="text-[11px] text-destructive mt-1 max-w-[200px] truncate">
              {p.failureReason}
            </p>
          )}
        </div>
      ),
    },
    {
      key: "date",
      header: "Date",
      render: (p) => (
        <span className="text-xs text-text-muted">
          {new Date(p.paidAt || p.createdAt).toLocaleString("en-IN")}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={title}
        description={description}
        badge={
          <Badge variant="neutral" size="sm">
            {total} Records
          </Badge>
        }
        extraActions={
          <Button size="sm" variant="outline" disabled={exporting} onClick={handleExport}>
            <Download className="w-3.5 h-3.5" />
            <span>{exporting ? "Exporting CSV..." : "Export CSV"}</span>
          </Button>
        }
      />

      {error && (
        <ErrorState title="Transaction query error" message={error} onRetry={() => loadData()} />
      )}

      {!fixedStatus && (
        <div className="flex flex-wrap items-center gap-2">
          {[
            { value: "", label: "All Transactions" },
            { value: "CAPTURED", label: "Successful" },
            { value: "PENDING", label: "Pending" },
            { value: "FAILED", label: "Failed" },
            { value: "REFUNDED", label: "Refunded" },
          ].map((tab) => {
            const active = status === tab.value;
            return (
              <button
                key={tab.value || "ALL"}
                type="button"
                onClick={() => {
                  setStatus(tab.value);
                  setPage(1);
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-colors cursor-pointer ${
                  active
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-surface text-text-secondary border-border hover:border-primary/40"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      )}

      <DataTable
        tableKey={`admin-payments-${fixedStatus || "all"}`}
        data={rows}
        columns={columns}
        keyExtractor={(p) => p.id}
        isLoading={loading}
        emptyTitle="No payment transactions match these filters"
        emptyDescription="Transactions appear here once businesses initiate Razorpay checkout."
        searchQuery={search}
        onSearchChange={(v) => {
          setSearch(v);
          setPage(1);
        }}
        searchPlaceholder="Search Razorpay order/payment ID, business, or email..."
        filterSlot={
          <div className="flex flex-wrap items-center gap-2">
            {!fixedStatus && (
              <div className="w-40">
                <Select
                  value={status}
                  onChange={(e) => {
                    setStatus(e.target.value);
                    setPage(1);
                  }}
                  options={[
                    { value: "", label: "All Statuses" },
                    { value: "CAPTURED", label: "Captured" },
                    { value: "PENDING", label: "Pending (Created/Auth)" },
                    { value: "FAILED", label: "Failed" },
                    { value: "REFUNDED", label: "Refunded" },
                    { value: "PARTIALLY_REFUNDED", label: "Partially Refunded" },
                  ]}
                />
              </div>
            )}
            <div className="w-36">
              <Select
                value={method}
                onChange={(e) => {
                  setMethod(e.target.value);
                  setPage(1);
                }}
                options={[
                  { value: "", label: "All Methods" },
                  { value: "upi", label: "UPI" },
                  { value: "card", label: "Card" },
                  { value: "netbanking", label: "NetBanking" },
                  { value: "wallet", label: "Wallet" },
                ]}
              />
            </div>
            <div className="w-44">
              <Select
                value={planId}
                onChange={(e) => {
                  setPlanId(e.target.value);
                  setPage(1);
                }}
                options={[
                  { value: "", label: "All Plans" },
                  ...plans.map((p) => ({ value: p.id, label: p.name })),
                ]}
              />
            </div>
            <div className="w-36">
              <Input
                type="date"
                aria-label="From date"
                value={fromDate}
                onChange={(e) => {
                  setFromDate(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <div className="w-36">
              <Input
                type="date"
                aria-label="To date"
                value={toDate}
                onChange={(e) => {
                  setToDate(e.target.value);
                  setPage(1);
                }}
              />
            </div>
          </div>
        }
        renderActions={(p) => (
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" asChild>
              <Link href={`/admin/payments/transactions/${p.id}`}>
                <Eye className="w-3.5 h-3.5" />
                <span>Details</span>
              </Link>
            </Button>
            {p.invoiceId && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => downloadInvoicePdf(p.invoiceId!, p.invoiceNumber || undefined)}
              >
                <Download className="w-3.5 h-3.5" />
              </Button>
            )}
          </div>
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
