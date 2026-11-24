"use client";

import React from "react";
import Link from "next/link";
import { Badge } from "@/components/common";
import { Clock } from "lucide-react";

export interface DashboardAuditTimelineProps {
  activePersonaRoleName: string;
}

export function DashboardAuditTimeline({ activePersonaRoleName }: DashboardAuditTimelineProps) {
  const recentEvents = [
    {
      action: "Role Permission Updated",
      target: "Sales Manager",
      actor: "Security Officer",
      time: "10 mins ago",
      type: "RBAC",
    },
    {
      action: "User Provisioned",
      target: "john.smith@mercora.com",
      actor: "Admin Console",
      time: "25 mins ago",
      type: "UBAC",
    },
    {
      action: "Domain Status Registered",
      target: "LEAD → QUALIFIED",
      actor: "System Configurator",
      time: "1 hour ago",
      type: "Status",
    },
    {
      action: "Persona Switched",
      target: activePersonaRoleName,
      actor: "Local Session",
      time: "Active",
      type: "Session",
    },
  ];

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-xs flex flex-col gap-4">
      <div className="border-b border-border pb-3">
        <h3 className="font-semibold text-sm text-text-primary flex items-center gap-2">
          <Clock className="w-4 h-4 text-text-muted" />
          Recent Security Audit
        </h3>
        <p className="text-xs text-text-muted mt-0.5">Chronological log of administrative actions.</p>
      </div>

      <div className="flex flex-col gap-3">
        {recentEvents.map((evt, idx) => (
          <div
            key={idx}
            className="p-3 rounded-lg border border-border bg-surface-hover/30 flex flex-col gap-1 text-xs"
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-text-primary text-[11px]">{evt.action}</span>
              <Badge variant="blue" size="sm">
                {evt.type}
              </Badge>
            </div>
            <div className="text-[11px] text-text-secondary">
              Target: <strong className="text-text-primary font-medium">{evt.target}</strong>
            </div>
            <div className="flex items-center justify-between text-[10px] text-text-muted mt-1">
              <span>Actor: {evt.actor}</span>
              <span>{evt.time}</span>
            </div>
          </div>
        ))}
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
