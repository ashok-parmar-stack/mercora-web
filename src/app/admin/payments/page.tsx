"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  IndianRupee,
  CheckCircle2,
  Clock,
  XCircle,
  Crown,
  AlertTriangle,
  RotateCcw,
  ArrowRight,
  Sliders,
} from "lucide-react";
import { PageHeader, Badge, Button, Skeleton, ErrorState } from "@/components/common";
import { extractErrorMessage } from "@/lib/http/client";
import { fetchAdminPaymentAnalytics } from "@/features/subscriptions/api/subscription-api";
import { AdminPaymentCharts } from "@/features/subscriptions/components/admin/AdminPaymentCharts";
import type { AdminPaymentAnalytics } from "@/features/subscriptions/types";

export default function AdminPaymentsOverviewPage() {
  const [months, setMonths] = useState(12);
  const [analytics, setAnalytics] = useState<AdminPaymentAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = (horizon: number, signal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    fetchAdminPaymentAnalytics(horizon, signal)
      .then((res) => setAnalytics(res))
      .catch((err) => {
        if (err?.name !== "AbortError") {
          setError(extractErrorMessage(err));
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const ctrl = new AbortController();
    loadData(months, ctrl.signal);
    return () => ctrl.abort();
  }, [months]);

  const kpis = analytics?.kpis;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payments & Subscriptions Overview"
        description="Real-time Razorpay revenue metrics, transaction conversion outcomes, active plan mix, and refund analytics."
        extraActions={
          <div className="flex items-center gap-2">
            {[6, 12].map((m) => (
              <Button
                key={m}
                size="sm"
                variant={months === m ? "primary" : "outline"}
                onClick={() => setMonths(m)}
              >
                Last {m}m
              </Button>
            ))}
            <Button size="sm" variant="outline" asChild>
              <Link href="/admin/payments/transactions">
                <span>View Transactions</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </Button>
          </div>
        }
      />

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, idx) => (
            <Skeleton key={idx} className="h-28 rounded-2xl" />
          ))}
        </div>
      ) : error ? (
        <ErrorState
          title="Unable to load payment analytics"
          message={error}
          onRetry={() => loadData(months)}
        />
      ) : analytics && kpis ? (
        <>
          {/* 6 KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-surface border border-border shadow-xs space-y-2">
              <div className="flex items-center justify-between text-text-muted text-xs font-medium">
                <span>Total Revenue</span>
                <IndianRupee className="w-4 h-4 text-primary" />
              </div>
              <div className="text-2xl font-bold text-text-primary">
                ₹{(kpis.totalRevenue || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </div>
              <div className="text-xs text-text-muted">
                Net after refunds: ₹
                {(kpis.netRevenue || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-surface border border-border shadow-xs space-y-2">
              <div className="flex items-center justify-between text-text-muted text-xs font-medium">
                <span>Successful Transactions</span>
                <CheckCircle2 className="w-4 h-4 text-status-success" />
              </div>
              <div className="text-2xl font-bold text-text-primary">
                {kpis.successfulTransactions}
              </div>
              <div className="text-xs text-text-muted flex items-center gap-2">
                <Link href="/admin/payments/successful" className="text-primary hover:underline">
                  View captured payments
                </Link>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-surface border border-border shadow-xs space-y-2">
              <div className="flex items-center justify-between text-text-muted text-xs font-medium">
                <span>Pending / Failed Transactions</span>
                <Clock className="w-4 h-4 text-status-warning" />
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-bold text-text-primary">
                  {kpis.pendingTransactions}
                </span>
                <span className="text-xs text-text-muted">pending</span>
                <span className="text-lg font-bold text-destructive flex items-center gap-1">
                  <XCircle className="w-4 h-4" />
                  {kpis.failedTransactions}
                </span>
                <span className="text-xs text-text-muted">failed</span>
              </div>
              <div className="text-xs flex items-center gap-3">
                <Link href="/admin/payments/pending" className="text-primary hover:underline">
                  Pending
                </Link>
                <Link href="/admin/payments/failed" className="text-destructive hover:underline">
                  Failed
                </Link>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-surface border border-border shadow-xs space-y-2">
              <div className="flex items-center justify-between text-text-muted text-xs font-medium">
                <span>Active Subscriptions</span>
                <Crown className="w-4 h-4 text-primary" />
              </div>
              <div className="text-2xl font-bold text-text-primary">
                {kpis.activeSubscriptions}
              </div>
              <div className="text-xs text-text-muted">
                Past due: {kpis.pastDueSubscriptions} • Cancelled: {kpis.cancelledSubscriptions}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-surface border border-border shadow-xs space-y-2">
              <div className="flex items-center justify-between text-text-muted text-xs font-medium">
                <span>Expiring Soon</span>
                <AlertTriangle className="w-4 h-4 text-status-warning" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-text-primary">
                  {kpis.expiringSubscriptions}
                </span>
                {kpis.expiringSubscriptions > 0 && (
                  <Badge variant="warning" size="sm">
                    Actionable
                  </Badge>
                )}
              </div>
              <div className="text-xs text-text-muted">
                Expired historical: {kpis.expiredSubscriptions}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-surface border border-border shadow-xs space-y-2">
              <div className="flex items-center justify-between text-text-muted text-xs font-medium">
                <span>Total Refunded</span>
                <RotateCcw className="w-4 h-4 text-destructive" />
              </div>
              <div className="text-2xl font-bold text-text-primary">
                ₹{(kpis.totalRefunded || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </div>
              <div className="text-xs text-text-muted">
                Across {kpis.totalRefundsCount} refund request(s)
              </div>
            </div>
          </div>

          {/* Quick links row */}
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" variant="outline" asChild>
              <Link href="/admin/payments/subscriptions">Manage Subscriptions</Link>
            </Button>
            <Button size="sm" variant="outline" asChild>
              <Link href="/admin/payments/plans">Configure Plans</Link>
            </Button>
            <Button size="sm" variant="outline" asChild>
              <Link href="/admin/payments/invoices">Tax Invoices</Link>
            </Button>
            <Button size="sm" variant="outline" asChild>
              <Link href="/admin/payments/refunds">Refund Ledger</Link>
            </Button>
            <Button size="sm" variant="outline" asChild>
              <Link href="/admin/payments/settings" className="inline-flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5" />
                <span>Gateway Settings</span>
              </Link>
            </Button>
          </div>

          {/* 6 Charts backed exclusively by live PostgreSQL aggregates */}
          <AdminPaymentCharts charts={analytics.charts} />
        </>
      ) : null}
    </div>
  );
}
