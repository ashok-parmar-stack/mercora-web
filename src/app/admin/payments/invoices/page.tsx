"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Download, Eye, Receipt } from "lucide-react";
import {
  PageHeader,
  Badge,
  Button,
  DataTable,
  Select,
  ErrorState,
  type Column,
} from "@/components/common";
import { extractErrorMessage } from "@/lib/http/client";
import { formatCurrencyAmount } from "@/lib/format";
import {
  downloadInvoicePdf,
  fetchAdminInvoices,
} from "@/features/subscriptions/api/subscription-api";
import type { InvoiceRecord } from "@/features/subscriptions/types";

export default function AdminInvoicesPage() {
  const [rows, setRows] = useState<InvoiceRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const loadData = useCallback(
    (signal?: AbortSignal) => {
      setLoading(true);
      setError(null);
      fetchAdminInvoices(
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

  const handleDownload = async (inv: InvoiceRecord) => {
    setDownloadingId(inv.id);
    try {
      await downloadInvoicePdf(inv.id, inv.invoiceNumber);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setDownloadingId(null);
    }
  };

  const columns: Column<InvoiceRecord>[] = [
    {
      key: "invoiceNumber",
      header: "Invoice No.",
      render: (inv) => (
        <div>
          <p className="font-mono text-xs font-bold text-text-primary">{inv.invoiceNumber}</p>
          <p className="text-[11px] text-text-muted">
            {new Date(inv.invoiceDate).toLocaleDateString("en-IN")}
          </p>
        </div>
      ),
    },
    {
      key: "businessName",
      header: "Billed Business",
      render: (inv) => (
        <div>
          <p className="text-sm font-medium text-text-primary">
            {inv.businessName || inv.billingDetails?.businessName || inv.businessId}
          </p>
          <p className="text-xs text-text-muted">{inv.planName || "Subscription Plan"}</p>
        </div>
      ),
    },
    {
      key: "tax",
      header: "Subtotal + GST",
      render: (inv) => (
        <div className="text-xs text-text-secondary">
          <div>{formatCurrencyAmount(inv.subtotal, inv.currency)}</div>
          <div className="text-text-muted">GST: {formatCurrencyAmount(inv.taxAmount, inv.currency)}</div>
        </div>
      ),
    },
    {
      key: "totalAmount",
      header: "Total",
      render: (inv) => (
        <span className="font-semibold text-text-primary">
          {formatCurrencyAmount(inv.totalAmount, inv.currency, { alwaysShowDecimals: true })}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (inv) => (
        <Badge
          variant={
            inv.status === "PAID"
              ? "success"
              : inv.status === "REFUNDED" || inv.status === "VOID"
              ? "danger"
              : "warning"
          }
          size="sm"
        >
          {inv.status}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Invoices"
        description="GST-compliant tax invoices automatically issued upon verified Razorpay subscription capture."
        badge={
          <Badge variant="neutral" size="sm">
            <Receipt className="w-3 h-3" /> {total} Issued
          </Badge>
        }
      />

      {error && (
        <ErrorState title="Invoice load error" message={error} onRetry={() => loadData()} />
      )}

      <DataTable
        tableKey="admin-invoices"
        data={rows}
        columns={columns}
        keyExtractor={(inv) => inv.id}
        isLoading={loading}
        emptyTitle="No invoices issued yet"
        emptyDescription="Tax invoices appear here automatically once subscription payments are captured."
        searchQuery={search}
        onSearchChange={(v) => {
          setSearch(v);
          setPage(1);
        }}
        searchPlaceholder="Search invoice number, business, or GSTIN..."
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
                { value: "PAID", label: "Paid" },
                { value: "ISSUED", label: "Issued" },
                { value: "REFUNDED", label: "Refunded" },
                { value: "VOID", label: "Void" },
              ]}
            />
          </div>
        }
        renderActions={(inv) => (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={downloadingId === inv.id}
              onClick={() => handleDownload(inv)}
            >
              <Download className="w-3.5 h-3.5" />
              <span>{downloadingId === inv.id ? "PDF..." : "PDF"}</span>
            </Button>
            <Button size="sm" variant="ghost" asChild>
              <Link href={`/admin/payments/transactions/${inv.paymentId}`}>
                <Eye className="w-3.5 h-3.5" />
              </Link>
            </Button>
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
