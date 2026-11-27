"use client";

import React, { useState, useMemo } from "react";
import { Download, Receipt } from "lucide-react";
import { CustomerSubHeader } from "@/components/layout/CustomerSubHeader";
import {
  Badge,
  Button,
  Column,
  DataTable,
  ErrorState,
  Select,
} from "@/components/common";
import { useAbortableFetch } from "@/lib/hooks/useAbortableFetch";
import { useTableState } from "@/lib/hooks/useTableState";
import { useUIStore } from "@/lib/store/ui-store";
import { extractErrorMessage } from "@/lib/http/client";
import {
  downloadInvoicePdf,
  fetchBusinessPayments,
} from "@/features/subscriptions/api/subscription-api";
import type { PaymentRecord } from "@/features/subscriptions/types";
import {
  formatDateTime,
  formatInrMinor,
  getPaymentBadgeVariant,
} from "@/features/subscriptions/utils/razorpay-checkout";

export default function BusinessPaymentHistoryPage() {
  const addToast = useUIStore((s) => s.addToast);
  const { search, handleSearchChange, page, pageSize, paginationProps } = useTableState({
    defaultPageSize: 10,
  });

  const [statusFilter, setStatusFilter] = useState("ALL");
  const [methodFilter, setMethodFilter] = useState("ALL");
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const { isLoading, error, load } = useAbortableFetch(async (signal) => {
    const res = await fetchBusinessPayments(
      {
        status: statusFilter !== "ALL" ? statusFilter : undefined,
        method: methodFilter !== "ALL" ? methodFilter : undefined,
        search: search.trim() || undefined,
        page,
        limit: pageSize,
      },
      signal
    );
    setPayments(res.data || []);
    setTotalCount(res.meta?.total || 0);
  }, [statusFilter, methodFilter, search, page, pageSize]);

  const handleDownload = async (item: PaymentRecord) => {
    if (!item.invoiceId) return;
    setDownloadingId(item.id);
    try {
      await downloadInvoicePdf(item.invoiceId, item.invoiceNumber || undefined);
    } catch (err) {
      addToast("error", "Invoice Download Failed", extractErrorMessage(err));
    } finally {
      setDownloadingId(null);
    }
  };

  const columns: Column<PaymentRecord>[] = useMemo(
    () => [
      {
        key: "id",
        header: "Transaction ID",
        render: (p) => (
          <div className="flex flex-col">
            <span className="font-mono text-xs font-bold text-text-primary">
              {p.gatewayPaymentId || p.gatewayOrderId || p.id.slice(0, 12)}
            </span>
            <span className="text-[10px] text-text-muted font-mono">
              {p.paymentType}
            </span>
          </div>
        ),
      },
      {
        key: "planName",
        header: "Plan",
        render: (p) => (
          <div>
            <p className="text-xs font-semibold text-text-primary">
              {p.planName || "Subscription"}
            </p>
            <p className="text-[11px] text-text-muted">{p.businessName || "—"}</p>
          </div>
        ),
      },
      {
        key: "amountMinor",
        header: "Amount",
        sortable: true,
        sortAccessor: (p) => p.amountMinor,
        render: (p) => (
          <span className="text-xs font-bold font-data text-text-primary">
            {formatInrMinor(p.amountMinor, p.currency)}
          </span>
        ),
      },
      {
        key: "paymentMethod",
        header: "Method",
        render: (p) => (
          <span className="text-xs uppercase text-text-secondary">
            {p.paymentMethod || p.gateway}
          </span>
        ),
      },
      {
        key: "createdAt",
        header: "Date",
        sortable: true,
        sortAccessor: (p) => new Date(p.paidAt || p.createdAt).getTime(),
        render: (p) => (
          <span className="text-xs text-text-secondary">
            {formatDateTime(p.paidAt || p.createdAt)}
          </span>
        ),
      },
      {
        key: "paymentStatus",
        header: "Status",
        render: (p) => (
          <Badge variant={getPaymentBadgeVariant(p.paymentStatus)} size="sm">
            {p.paymentStatus}
          </Badge>
        ),
      },
    ],
    []
  );

  return (
    <>
      <CustomerSubHeader
        icon={<Receipt className="w-5 h-5 text-primary" />}
        title="Payment History & Tax Invoices"
        backHref="/subscription"
        backLabel="Subscription"
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {error ? (
          <ErrorState
            title="Unable to Load Payment History"
            message={error}
            onRetry={load}
          />
        ) : (
          <DataTable<PaymentRecord>
            tableKey="business-payments-table"
            data={payments}
            columns={columns}
            keyExtractor={(p) => p.id}
            isLoading={isLoading}
            searchQuery={search}
            onSearchChange={handleSearchChange}
            searchPlaceholder="Search by Razorpay payment ID, order ID, or business..."
            emptyTitle="No Payment Transactions Found"
            emptyDescription="Your subscription payment records and downloadable GST invoices will appear here."
            enableSelection={false}
            totalCount={totalCount}
            {...paginationProps}
            filterSlot={
              <div className="flex items-center gap-2 flex-wrap">
                <div className="w-40">
                  <Select
                    selectSize="sm"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    aria-label="Filter by payment status"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="CAPTURED">Captured</option>
                    <option value="CREATED">Pending</option>
                    <option value="AUTHORIZED">Authorized</option>
                    <option value="FAILED">Failed</option>
                    <option value="REFUNDED">Refunded</option>
                    <option value="PARTIALLY_REFUNDED">Partially Refunded</option>
                  </Select>
                </div>
                <div className="w-36">
                  <Select
                    selectSize="sm"
                    value={methodFilter}
                    onChange={(e) => setMethodFilter(e.target.value)}
                    aria-label="Filter by payment method"
                  >
                    <option value="ALL">All Methods</option>
                    <option value="upi">UPI</option>
                    <option value="card">Card</option>
                    <option value="netbanking">Net Banking</option>
                    <option value="wallet">Wallet</option>
                  </Select>
                </div>
              </div>
            }
            renderActions={(item) =>
              item.invoiceId ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  isLoading={downloadingId === item.id}
                  leftIcon={<Download className="w-3.5 h-3.5" />}
                  onClick={() => handleDownload(item)}
                >
                  Invoice
                </Button>
              ) : (
                <span className="text-[11px] text-text-muted">—</span>
              )
            }
          />
        )}
      </main>
    </>
  );
}
