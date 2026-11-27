"use client";

import React, { useState } from "react";
import { BarChart3, CheckCircle2, MapPin, ShieldAlert } from "lucide-react";
import { Tooltip } from "@/components/common";
import { useAbortableFetch } from "@/lib/hooks/useAbortableFetch";
import { fetchBusinessFacets } from "@/features/businesses/api/business-api";
import type { BusinessFacets } from "@/features/businesses/types/business.types";
import { adminV1Client } from "@/lib/http/client";

interface AuditLogSummaryItem {
  id: string;
  module?: string;
  severity?: "INFO" | "WARNING" | "CRITICAL";
}

export function DashboardAnalyticsCharts() {
  const [facets, setFacets] = useState<BusinessFacets | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLogSummaryItem[]>([]);

  const { isLoading } = useAbortableFetch(async (signal) => {
    const [facetsRes, auditRes] = await Promise.allSettled([
      fetchBusinessFacets({ signal }),
      adminV1Client.get<{ data?: AuditLogSummaryItem[] }>("/audit-logs", { signal }),
    ]);

    if (facetsRes.status === "fulfilled") {
      setFacets(facetsRes.value);
    }
    if (auditRes.status === "fulfilled") {
      setAuditLogs(auditRes.value.data?.data || []);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="h-64 rounded-xl border border-border skeleton-shimmer" />
        ))}
      </div>
    );
  }

  const hasFacets = Boolean(facets && facets.totalBusinesses > 0);
  const hasAudit = auditLogs.length > 0;

  if (!hasFacets && !hasAudit) {
    return null;
  }

  const verifiedPct =
    facets && facets.totalBusinesses > 0
      ? Math.round((facets.verifiedCount / facets.totalBusinesses) * 100)
      : 0;
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (verifiedPct / 100) * circumference;

  const topCategories = [...(facets?.businessCategories || [])]
    .sort((a, b) => b.businessCount - a.businessCount)
    .slice(0, 5);
  const maxCategoryCount = Math.max(1, ...topCategories.map((c) => c.businessCount));

  const topLocations = [...(facets?.locations || [])]
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  const maxLocationCount = Math.max(1, ...topLocations.map((l) => l.count));

  const infoCount = auditLogs.filter((l) => l.severity === "INFO" || !l.severity).length;
  const warnCount = auditLogs.filter((l) => l.severity === "WARNING").length;
  const critCount = auditLogs.filter((l) => l.severity === "CRITICAL").length;
  const auditTotal = Math.max(1, auditLogs.length);

  const moduleCounts = Object.entries(
    auditLogs.reduce<Record<string, number>>((acc, item) => {
      const mod = item.module || "SYSTEM";
      acc[mod] = (acc[mod] || 0) + 1;
      return acc;
    }, {})
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {hasFacets && facets && (
        <>
          {/* 1. Verification Status Donut */}
          <div className="bg-card border border-border rounded-xl p-5 shadow-xs flex flex-col justify-between gap-4">
            <div className="border-b border-border pb-3">
              <h3 className="font-semibold text-sm text-text-primary flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-success" />
                Business Verification
              </h3>
              <p className="text-xs text-text-muted mt-0.5">
                Verified vs unverified directory profiles.
              </p>
            </div>

            <div className="flex items-center justify-center gap-8 py-2">
              <div className="relative w-28 h-28 flex items-center justify-center">
                <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="none"
                    stroke="var(--border)"
                    strokeWidth="10"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="none"
                    stroke="var(--primary)"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-lg font-extrabold text-text-primary font-data">
                    {verifiedPct}%
                  </span>
                  <span className="text-[10px] text-text-muted uppercase tracking-wider">
                    Verified
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary inline-block" />
                  <span className="text-text-secondary">Verified:</span>
                  <strong className="text-text-primary font-data">{facets.verifiedCount}</strong>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-border inline-block" />
                  <span className="text-text-secondary">Unverified:</span>
                  <strong className="text-text-primary font-data">{facets.unverifiedCount}</strong>
                </div>
                <div className="text-[11px] text-text-muted pt-1 border-t border-border">
                  Total: <strong className="text-text-primary">{facets.totalBusinesses}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Businesses by Category */}
          <div className="bg-card border border-border rounded-xl p-5 shadow-xs flex flex-col gap-4">
            <div className="border-b border-border pb-3">
              <h3 className="font-semibold text-sm text-text-primary flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-primary" />
                Businesses by Category
              </h3>
              <p className="text-xs text-text-muted mt-0.5">Top directory business types.</p>
            </div>

            <div className="flex flex-col gap-3">
              {topCategories.length === 0 ? (
                <p className="text-xs text-text-muted">No category metrics available.</p>
              ) : (
                topCategories.map((cat) => {
                  const widthPct = Math.max(
                    6,
                    Math.round((cat.businessCount / maxCategoryCount) * 100)
                  );
                  return (
                    <div key={cat.id} className="flex flex-col gap-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-text-secondary truncate pr-2">{cat.name}</span>
                        <span className="font-semibold text-text-primary font-data">
                          {cat.businessCount}
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-surface-hover overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary transition-all duration-300"
                          style={{ width: `${widthPct}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* 3. Top Locations */}
          <div className="bg-card border border-border rounded-xl p-5 shadow-xs flex flex-col gap-4">
            <div className="border-b border-border pb-3">
              <h3 className="font-semibold text-sm text-text-primary flex items-center gap-2">
                <MapPin className="w-4 h-4 text-info" />
                Businesses by State
              </h3>
              <p className="text-xs text-text-muted mt-0.5">Top geographic hubs.</p>
            </div>

            <div className="flex flex-col gap-3">
              {topLocations.length === 0 ? (
                <p className="text-xs text-text-muted">No location metrics available.</p>
              ) : (
                topLocations.map((loc) => {
                  const widthPct = Math.max(6, Math.round((loc.count / maxLocationCount) * 100));
                  return (
                    <div key={loc.slug || loc.name} className="flex flex-col gap-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-text-secondary truncate pr-2">{loc.name}</span>
                        <span className="font-semibold text-text-primary font-data">{loc.count}</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-surface-hover overflow-hidden">
                        <div
                          className="h-full rounded-full bg-info transition-all duration-300"
                          style={{ width: `${widthPct}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </>
      )}

      {/* 4. Audit & Security Activity */}
      {hasAudit && (
        <div className="bg-card border border-border rounded-xl p-5 shadow-xs flex flex-col gap-4">
          <div className="border-b border-border pb-3">
            <h3 className="font-semibold text-sm text-text-primary flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-warning" />
              Audit &amp; Security Activity
            </h3>
            <p className="text-xs text-text-muted mt-0.5">
              Distribution across {auditLogs.length} recent audit events.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {/* Stacked Severity Bar */}
            <div className="h-3 w-full rounded-full bg-surface-hover overflow-hidden flex">
              {infoCount > 0 && (
                <Tooltip
                  content={`Info: ${infoCount}`}
                  triggerClassName="h-full"
                  triggerStyle={{ width: `${(infoCount / auditTotal) * 100}%` }}
                >
                  <div className="bg-info h-full w-full" />
                </Tooltip>
              )}
              {warnCount > 0 && (
                <Tooltip
                  content={`Warning: ${warnCount}`}
                  triggerClassName="h-full"
                  triggerStyle={{ width: `${(warnCount / auditTotal) * 100}%` }}
                >
                  <div className="bg-warning h-full w-full" />
                </Tooltip>
              )}
              {critCount > 0 && (
                <Tooltip
                  content={`Critical: ${critCount}`}
                  triggerClassName="h-full"
                  triggerStyle={{ width: `${(critCount / auditTotal) * 100}%` }}
                >
                  <div className="bg-destructive h-full w-full" />
                </Tooltip>
              )}
            </div>

            <div className="flex items-center gap-4 text-[11px] flex-wrap">
              <span className="inline-flex items-center gap-1.5 text-text-secondary">
                <span className="w-2 h-2 rounded-full bg-info" /> Info: <strong className="text-text-primary">{infoCount}</strong>
              </span>
              <span className="inline-flex items-center gap-1.5 text-text-secondary">
                <span className="w-2 h-2 rounded-full bg-warning" /> Warning: <strong className="text-text-primary">{warnCount}</strong>
              </span>
              <span className="inline-flex items-center gap-1.5 text-text-secondary">
                <span className="w-2 h-2 rounded-full bg-destructive" /> Critical: <strong className="text-text-primary">{critCount}</strong>
              </span>
            </div>

            <div className="pt-2 border-t border-border flex flex-col gap-2">
              {moduleCounts.map(([mod, count]) => (
                <div key={mod} className="flex items-center justify-between text-xs">
                  <span className="text-text-secondary truncate pr-2">{mod}</span>
                  <span className="font-semibold text-text-primary font-data">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
