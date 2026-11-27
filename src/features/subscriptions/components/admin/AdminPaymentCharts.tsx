"use client";

import React from "react";
import type { AdminPaymentAnalytics } from "../../types";

interface AdminPaymentChartsProps {
  charts: AdminPaymentAnalytics["charts"];
}

function formatInrCompact(value: number): string {
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(1)}k`;
  return `₹${Math.round(value).toLocaleString("en-IN")}`;
}

export function AdminPaymentCharts({ charts }: AdminPaymentChartsProps) {
  const maxRevenue = Math.max(
    1,
    ...charts.monthlyRevenue.map((m) => Math.max(m.revenue || 0, m.refund || 0))
  );
  const maxTxCount = Math.max(
    1,
    ...charts.transactionOutcomes.map((m) => (m.successful || 0) + (m.pending || 0) + (m.failed || 0))
  );
  const maxPlanCount = Math.max(
    1,
    ...charts.planDistribution.map((p) => p.activeCount || p.totalCount || 0)
  );
  const maxSubNew = Math.max(
    1,
    ...charts.subscriptionTrends.map((s) => s.newSubscriptions || 0)
  );
  const maxRenewExp = Math.max(
    1,
    ...charts.subscriptionTrends.map((s) => Math.max(s.renewals || 0, s.expirations || 0))
  );
  const maxRefundAmt = Math.max(
    1,
    ...charts.refundTrend.map((r) => r.amount || 0)
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 1. Monthly Revenue Chart */}
      <div className="p-5 rounded-2xl bg-surface border border-border shadow-xs space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-text-primary">Monthly Revenue (INR)</h3>
            <p className="text-xs text-text-muted">Captured subscription gross revenue vs refunds</p>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-text-muted">
            <span className="inline-flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-xs bg-primary" /> Revenue
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-xs bg-destructive/75" /> Refunds
            </span>
          </div>
        </div>
        {charts.monthlyRevenue.length === 0 ? (
          <div className="h-44 flex items-center justify-center text-xs text-text-muted">
            No monthly revenue recorded yet.
          </div>
        ) : (
          <div className="h-48 flex items-end gap-2 pt-4">
            {charts.monthlyRevenue.map((item) => {
              const revPct = Math.round(((item.revenue || 0) / maxRevenue) * 100);
              const refPct = Math.round(((item.refund || 0) / maxRevenue) * 100);
              return (
                <div key={item.month} className="flex-1 flex flex-col items-center gap-1.5 min-w-0">
                  <span className="text-[10px] font-medium text-text-muted truncate max-w-full">
                    {formatInrCompact(item.revenue || 0)}
                  </span>
                  <div className="w-full h-32 flex items-end justify-center gap-1">
                    <div
                      className="w-1/2 max-w-[18px] rounded-t bg-primary/85 transition-all"
                      style={{ height: `${Math.max(item.revenue > 0 ? 6 : 2, revPct)}%` }}
                      title={`${item.month}: ₹${(item.revenue || 0).toLocaleString("en-IN")}`}
                    />
                    {item.refund > 0 && (
                      <div
                        className="w-1/2 max-w-[14px] rounded-t bg-destructive/75 transition-all"
                        style={{ height: `${Math.max(4, refPct)}%` }}
                        title={`${item.month} refunds: ₹${item.refund.toLocaleString("en-IN")}`}
                      />
                    )}
                  </div>
                  <span className="text-[10px] text-text-secondary truncate max-w-full">
                    {item.month.slice(2)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. Successful vs Failed Transactions */}
      <div className="p-5 rounded-2xl bg-surface border border-border shadow-xs space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-text-primary">Successful vs Failed Transactions</h3>
            <p className="text-xs text-text-muted">Monthly payment gateway outcomes</p>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-text-muted">
            <span className="inline-flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-xs bg-status-success" /> Success
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-xs bg-status-warning" /> Pending
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-xs bg-destructive" /> Failed
            </span>
          </div>
        </div>
        {charts.transactionOutcomes.length === 0 ? (
          <div className="h-44 flex items-center justify-center text-xs text-text-muted">
            No transactions recorded yet.
          </div>
        ) : (
          <div className="h-48 flex items-end gap-2 pt-4">
            {charts.transactionOutcomes.map((item) => {
              const sPct = Math.round(((item.successful || 0) / maxTxCount) * 100);
              const pPct = Math.round(((item.pending || 0) / maxTxCount) * 100);
              const fPct = Math.round(((item.failed || 0) / maxTxCount) * 100);
              return (
                <div key={item.month} className="flex-1 flex flex-col items-center gap-1.5 min-w-0">
                  <span className="text-[10px] font-medium text-text-muted">
                    {item.successful + item.pending + item.failed}
                  </span>
                  <div className="w-full max-w-[24px] h-32 rounded-t overflow-hidden bg-surface-hover/50 flex flex-col-reverse">
                    <div
                      className="w-full bg-status-success"
                      style={{ height: `${sPct}%` }}
                      title={`Successful: ${item.successful}`}
                    />
                    <div
                      className="w-full bg-status-warning"
                      style={{ height: `${pPct}%` }}
                      title={`Pending: ${item.pending}`}
                    />
                    <div
                      className="w-full bg-destructive"
                      style={{ height: `${fPct}%` }}
                      title={`Failed: ${item.failed}`}
                    />
                  </div>
                  <span className="text-[10px] text-text-secondary truncate max-w-full">
                    {item.month.slice(2)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. Subscription Plan Distribution */}
      <div className="p-5 rounded-2xl bg-surface border border-border shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-text-primary">Subscription Plan Distribution</h3>
          <p className="text-xs text-text-muted">Active subscribers &amp; cumulative revenue by plan</p>
        </div>
        {charts.planDistribution.length === 0 ? (
          <div className="h-44 flex items-center justify-center text-xs text-text-muted">
            No plan distribution metrics yet.
          </div>
        ) : (
          <div className="space-y-3 pt-1">
            {charts.planDistribution.map((plan) => {
              const count = plan.activeCount || 0;
              const widthPct = Math.max(4, Math.round((count / maxPlanCount) * 100));
              return (
                <div key={plan.planCode} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-text-primary">
                      {plan.planName}{" "}
                      <span className="text-[11px] font-normal text-text-muted">
                        ({plan.activeCount} active / {plan.totalCount} total)
                      </span>
                    </span>
                    <span className="font-medium text-text-secondary">
                      ₹{(plan.revenue || 0).toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-surface-hover overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${count > 0 ? widthPct : 2}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. New Subscriptions Trend */}
      <div className="p-5 rounded-2xl bg-surface border border-border shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-text-primary">New Subscriptions Trend</h3>
          <p className="text-xs text-text-muted">Monthly new business subscription activations</p>
        </div>
        {charts.subscriptionTrends.length === 0 ? (
          <div className="h-44 flex items-center justify-center text-xs text-text-muted">
            No new subscription activations yet.
          </div>
        ) : (
          <div className="h-44 flex items-end gap-2 pt-3">
            {charts.subscriptionTrends.map((row) => {
              const pct = Math.round(((row.newSubscriptions || 0) / maxSubNew) * 100);
              return (
                <div key={row.month} className="flex-1 flex flex-col items-center gap-1.5 min-w-0">
                  <span className="text-[10px] font-semibold text-text-muted">
                    {row.newSubscriptions}
                  </span>
                  <div className="w-full h-28 flex items-end justify-center">
                    <div
                      className="w-4/5 max-w-[22px] rounded-t bg-primary/70 transition-all"
                      style={{ height: `${Math.max(row.newSubscriptions > 0 ? 8 : 3, pct)}%` }}
                      title={`${row.month}: ${row.newSubscriptions} new`}
                    />
                  </div>
                  <span className="text-[10px] text-text-secondary truncate max-w-full">
                    {row.month.slice(2)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. Renewals and Expirations */}
      <div className="p-5 rounded-2xl bg-surface border border-border shadow-xs space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-text-primary">Renewals &amp; Expirations</h3>
            <p className="text-xs text-text-muted">Monthly retention renewals vs expired subscriptions</p>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-text-muted">
            <span className="inline-flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-xs bg-status-success" /> Renewals
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-xs bg-status-warning" /> Expirations
            </span>
          </div>
        </div>
        {charts.subscriptionTrends.length === 0 ? (
          <div className="h-44 flex items-center justify-center text-xs text-text-muted">
            No renewal or expiration data yet.
          </div>
        ) : (
          <div className="h-44 flex items-end gap-2 pt-3">
            {charts.subscriptionTrends.map((row) => {
              const rPct = Math.round(((row.renewals || 0) / maxRenewExp) * 100);
              const ePct = Math.round(((row.expirations || 0) / maxRenewExp) * 100);
              return (
                <div key={row.month} className="flex-1 flex flex-col items-center gap-1.5 min-w-0">
                  <span className="text-[10px] text-text-muted">
                    {row.renewals}/{row.expirations}
                  </span>
                  <div className="w-full h-28 flex items-end justify-center gap-1">
                    <div
                      className="w-1/2 max-w-[14px] rounded-t bg-status-success"
                      style={{ height: `${Math.max(row.renewals > 0 ? 8 : 3, rPct)}%` }}
                      title={`Renewals: ${row.renewals}`}
                    />
                    <div
                      className="w-1/2 max-w-[14px] rounded-t bg-status-warning"
                      style={{ height: `${Math.max(row.expirations > 0 ? 8 : 3, ePct)}%` }}
                      title={`Expirations: ${row.expirations}`}
                    />
                  </div>
                  <span className="text-[10px] text-text-secondary truncate max-w-full">
                    {row.month.slice(2)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 6. Refund Trend Chart */}
      <div className="p-5 rounded-2xl bg-surface border border-border shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-text-primary">Refund Trend</h3>
          <p className="text-xs text-text-muted">Monthly processed refunds count &amp; INR total</p>
        </div>
        {charts.refundTrend.length === 0 ? (
          <div className="h-44 flex items-center justify-center text-xs text-text-muted">
            No refunds recorded yet.
          </div>
        ) : (
          <div className="h-44 flex items-end gap-2 pt-3">
            {charts.refundTrend.map((row) => {
              const pct = Math.round(((row.amount || 0) / maxRefundAmt) * 100);
              return (
                <div key={row.month} className="flex-1 flex flex-col items-center gap-1.5 min-w-0">
                  <span className="text-[10px] font-medium text-text-muted truncate max-w-full">
                    {row.count > 0 ? formatInrCompact(row.amount) : "0"}
                  </span>
                  <div className="w-full h-28 flex items-end justify-center">
                    <div
                      className="w-4/5 max-w-[22px] rounded-t bg-destructive/75 transition-all"
                      style={{ height: `${Math.max(row.amount > 0 ? 8 : 3, pct)}%` }}
                      title={`${row.month}: ${row.count} refunds (₹${row.amount.toLocaleString("en-IN")})`}
                    />
                  </div>
                  <span className="text-[10px] text-text-secondary truncate max-w-full">
                    {row.month.slice(2)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
