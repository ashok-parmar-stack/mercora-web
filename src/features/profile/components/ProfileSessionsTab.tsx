"use client";

import React from "react";
import { Laptop, Shield } from "lucide-react";

export interface ProfileSessionsTabProps {
  onTerminateCurrentSession: () => void;
}

export function ProfileSessionsTab({ onTerminateCurrentSession }: ProfileSessionsTabProps) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-7 shadow-xs space-y-6">
      <div>
        <h3 className="text-base font-extrabold text-[var(--text-primary)]">
          Active Security Sessions
        </h3>
        <p className="text-xs text-[var(--text-muted)] mt-0.5">
          Real-time monitoring of all devices authenticated with your credentials.
        </p>
      </div>

      {/* Current Active Session Card */}
      <div className="p-4 rounded-xl border border-status-success-border bg-status-success-bg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs flex-shrink-0">
            <Laptop className="w-5 h-5" />
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-[var(--text-primary)]">
                Windows PC — Chrome Desktop (Current Session)
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-status-success/20 text-status-success">
                Live
              </span>
            </div>
            <p className="text-[11px] text-[var(--text-muted)] font-mono mt-0.5">
              IP: 127.0.0.1 • Authenticated Port 9000 • Session ID: sess_active_live
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onTerminateCurrentSession}
          className="text-xs font-bold text-text-muted hover:text-status-error hover:underline px-3 py-1.5 self-start sm:self-auto cursor-pointer"
        >
          Terminate
        </button>
      </div>

      {/* Single-Session Enforcement Policy Alert */}
      <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)] flex items-start gap-3 text-xs leading-relaxed">
        <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold text-[var(--text-primary)] block mb-0.5">
            Single Active Session Policy Enforced
          </strong>
          <p className="text-[var(--text-secondary)]">
            Mercora automatically invalidates prior active tokens whenever a new login is initiated on another machine. Your session is protected against concurrent token hijacking.
          </p>
        </div>
      </div>
    </div>
  );
}
