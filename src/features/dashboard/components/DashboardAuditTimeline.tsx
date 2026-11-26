"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/common";
import { Clock } from "lucide-react";
import { useAbortableFetch } from "@/lib/hooks/useAbortableFetch";
import { adminV1Client } from "@/lib/http/client";

interface AuditLogEntry {
  id: string;
  action: string;
  module: string;
  actorEmail?: string;
  timestamp?: string;
  createdAt?: string;
  severity?: "INFO" | "WARNING" | "CRITICAL";
  details?: string;
}

export interface DashboardAuditTimelineProps {
  activePersonaRoleName: string;
}

export function DashboardAuditTimeline({ activePersonaRoleName }: DashboardAuditTimelineProps) {
  const [events, setEvents] = useState<AuditLogEntry[]>([]);

  const { isLoading } = useAbortableFetch(async (signal) => {
    try {
      const res = await adminV1Client.get<{ data?: AuditLogEntry[] }>("/audit-logs", {
        signal,
      });
      setEvents((res.data?.data || []).slice(0, 4));
    } catch {
      setEvents([]);
    }
  }, []);

  const getBadgeVariant = (severity?: string): "red" | "amber" | "blue" => {
    if (severity === "CRITICAL") return "red";
    if (severity === "WARNING") return "amber";
    return "blue";
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-xs flex flex-col gap-4">
      <div className="border-b border-border pb-3">
        <h3 className="font-semibold text-sm text-text-primary flex items-center gap-2">
          <Clock className="w-4 h-4 text-text-muted" />
          Recent Security Audit
        </h3>
        <p className="text-xs text-text-muted mt-0.5">
          Live chronological log of administrative actions ({activePersonaRoleName}).
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="h-16 rounded-lg border border-border skeleton-shimmer" />
          ))
        ) : events.length === 0 ? (
          <div className="p-4 rounded-lg border border-dashed border-border text-xs text-text-muted text-center">
            No recent audit events recorded.
          </div>
        ) : (
          events.map((evt) => (
            <div
              key={evt.id}
              className="p-3 rounded-lg border border-border bg-surface-hover/30 flex flex-col gap-1 text-xs"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-text-primary text-[11px] truncate">
                  {evt.action}
                </span>
                <Badge variant={getBadgeVariant(evt.severity)} size="sm">
                  {evt.module || evt.severity || "AUDIT"}
                </Badge>
              </div>
              {evt.details && (
                <div className="text-[11px] text-text-secondary truncate">{evt.details}</div>
              )}
              <div className="flex items-center justify-between text-[10px] text-text-muted mt-1">
                <span>Actor: {evt.actorEmail || "System"}</span>
                <span>{evt.timestamp || evt.createdAt || ""}</span>
              </div>
            </div>
          ))
        )}
      </div>

      <Link
        href="/admin/audit-logs"
        className="text-xs font-semibold text-primary hover:underline text-center pt-2"
      >
        View Full Audit Trail →
      </Link>
    </div>
  );
}
