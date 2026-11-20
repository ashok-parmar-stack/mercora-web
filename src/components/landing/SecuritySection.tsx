"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Shield,
  Key,
  Users,
  Smartphone,
  Laptop,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Clock,
  Sparkles,
  Lock,
  History,
} from "lucide-react";

export default function SecuritySection() {
  const [ubacOverrideActive, setUbacOverrideActive] = useState<boolean>(true);
  const [deviceSimActive, setDeviceSimActive] = useState<boolean>(false);

  return (
    <section
      id="security"
      className="py-20 border-b scroll-mt-24"
      style={{
        borderColor: "var(--theme-glass-border)",
        background: "var(--theme-canvas)",
        scrollMarginTop: "85px",
      }}
    >
      <div className="container">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-4 tracking-wide uppercase"
            style={{
              background: "var(--theme-blush)",
              border: "1px solid rgba(238, 49, 53, 0.25)",
              color: "var(--theme-red)",
            }}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Zero-Trust Enterprise Identity &amp; Access</span>
          </div>

          <h2
            className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4"
            style={{ color: "var(--theme-ink-darkest)", lineHeight: "1.15" }}
          >
            Deterministic RBAC/UBAC &amp;{" "}
            <span style={{ color: "var(--theme-red)" }}>Single Active Session Guard.</span>
          </h2>

          <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
            Corporate tenants require ironclad isolation. Mercora pairs deterministic dual-layer permission evaluation with strict single active session enforcement to prevent credential sharing and unauthorized master data tampering.
          </p>
        </div>

        {/* Security Triad Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          
          {/* Card 1: Interactive RBAC vs UBAC Priority Matrix */}
          <div
            className="lg:col-span-6 rounded-2xl p-6 sm:p-8 border shadow-sm flex flex-col justify-between"
            style={{
              background: "var(--theme-card-bg)",
              borderColor: "var(--theme-glass-border)",
            }}
          >
            <div>
              <div className="flex items-center justify-between mb-4 pb-3 border-b" style={{ borderColor: "var(--theme-glass-border)" }}>
                <div className="flex items-center gap-2">
                  <Key className="w-4 h-4 text-red-500" />
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Dual-Layer Permission Engine
                  </span>
                </div>
                <Link
                  href="/admin/roles"
                  className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
                >
                  <span>Role Matrix</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-2" style={{ color: "var(--theme-ink-darkest)" }}>
                UBAC Overrides Take Deterministic Priority #1
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                When a user has standard role permissions (RBAC) but an administrator sets a granular user-level override (UBAC), Mercora resolves the decision deterministically without ambiguity.
              </p>

              {/* Interactive Permission Toggle */}
              <div
                className="p-4 rounded-xl border mb-6"
                style={{
                  background: "var(--theme-canvas)",
                  borderColor: "var(--theme-glass-border)",
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-xs font-bold text-gray-900" style={{ color: "var(--theme-ink-darkest)" }}>
                      Target Action: <code className="text-red-600 font-mono">CATALOG.DELETE_CATEGORY</code>
                    </div>
                    <div className="text-2xs text-gray-500">Subject: anand.sharma@dealers.in</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setUbacOverrideActive(!ubacOverrideActive)}
                    className="px-3 py-1 text-xs font-bold rounded-lg shadow-2xs cursor-pointer transition-colors"
                    style={{
                      background: "var(--theme-card-bg)",
                      border: "1px solid var(--theme-glass-border)",
                      color: "var(--theme-ink-darkest)",
                    }}
                  >
                    Toggle Override: {ubacOverrideActive ? "ACTIVE" : "DISABLED"}
                  </button>
                </div>

                <div className="space-y-2 text-xs">
                  {/* Layer 1: RBAC */}
                  <div
                    className="flex items-center justify-between p-2.5 rounded-lg border"
                    style={{
                      background: "var(--theme-card-bg)",
                      borderColor: "var(--theme-glass-border)",
                    }}
                  >
                    <span style={{ color: "var(--theme-gray-600)" }}>
                      Layer 2 (Role: <strong>Catalog Operator</strong>)
                    </span>
                    <span
                      className="px-2 py-0.5 rounded text-2xs font-bold border"
                      style={{
                        background: "var(--theme-error-bg)",
                        color: "var(--theme-error)",
                        borderColor: "var(--theme-error-border)",
                      }}
                    >
                      DENIED BY ROLE
                    </span>
                  </div>

                  {/* Layer 2: UBAC */}
                  <div
                    className="flex items-center justify-between p-2.5 rounded-lg border"
                    style={{
                      background: "var(--theme-card-bg)",
                      borderColor: "var(--theme-glass-border)",
                    }}
                  >
                    <span style={{ color: "var(--theme-gray-600)" }}>
                      Layer 1 (UBAC Override Policy)
                    </span>
                    <span
                      className="px-2 py-0.5 rounded text-2xs font-bold border"
                      style={{
                        background: ubacOverrideActive ? "var(--theme-success-bg)" : "var(--theme-canvas)",
                        color: ubacOverrideActive ? "var(--theme-success)" : "var(--theme-gray-400)",
                        borderColor: ubacOverrideActive ? "var(--theme-success-border)" : "var(--theme-glass-border)",
                      }}
                    >
                      {ubacOverrideActive ? "EXPLICIT ALLOW (PRIORITY 1)" : "NO OVERRIDE SET"}
                    </span>
                  </div>

                  {/* Calculated Result */}
                  <div
                    className={`p-3 rounded-lg border flex items-center justify-between font-bold ${
                      ubacOverrideActive
                        ? "bg-emerald-50/80 border-emerald-200 text-emerald-800"
                        : "bg-rose-50/80 border-rose-200 text-rose-800"
                    }`}
                  >
                    <span>Final Evaluated Resolution:</span>
                    <span>{ubacOverrideActive ? "✓ ACCESS GRANTED" : "✕ ACCESS DENIED"}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t flex items-center justify-between text-xs text-gray-500" style={{ borderColor: "var(--theme-glass-border)" }}>
              <span>✓ Evaluated in 2ms in Token Pipeline</span>
              <span className="font-bold text-gray-900" style={{ color: "var(--theme-ink-darkest)" }}>100% Deterministic</span>
            </div>
          </div>

          {/* Card 2: Dynamic Single Active Session Policy */}
          <div
            className="lg:col-span-6 rounded-2xl p-6 sm:p-8 border shadow-sm flex flex-col justify-between"
            style={{
              background: "var(--theme-card-bg)",
              borderColor: "var(--theme-glass-border)",
            }}
          >
            <div>
              <div className="flex items-center justify-between mb-4 pb-3 border-b" style={{ borderColor: "var(--theme-glass-border)" }}>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-500" />
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Credential Sharing Prevention
                  </span>
                </div>
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  1 User = 1 Device
                </span>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-2" style={{ color: "var(--theme-ink-darkest)" }}>
                Instant Concurrent Session Invalidation
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Prevents paid enterprise accounts from being shared across multiple users. Logging into a new browser or device immediately revokes previous session tokens on the server.
              </p>

              {/* Interactive Device Simulator */}
              <div
                className="p-4 rounded-xl border mb-6"
                style={{
                  background: "var(--theme-canvas)",
                  borderColor: "var(--theme-glass-border)",
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="text-xs font-bold text-gray-700">Account: vikram.patel@logistics.in</div>
                  <button
                    type="button"
                    onClick={() => setDeviceSimActive(!deviceSimActive)}
                    className="px-3 py-1 text-xs font-bold rounded-lg bg-red-600 text-white hover:bg-red-700 shadow-xs cursor-pointer"
                  >
                    Simulate Login from Device 2
                  </button>
                </div>

                <div className="space-y-2 text-xs">
                  {/* Laptop */}
                  <div
                    className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                      deviceSimActive
                        ? "bg-rose-50 border-rose-200 text-rose-800"
                        : "bg-emerald-50 border-emerald-200 text-emerald-800"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Laptop className="w-4 h-4" />
                      <div>
                        <div className="font-bold">MacBook Pro · Office Chrome</div>
                        <div className="text-2xs opacity-80">IP: 14.139.12.8 · Session #sess_09a</div>
                      </div>
                    </div>
                    <span className="text-2xs font-extrabold uppercase px-2 py-0.5 rounded bg-white/80">
                      {deviceSimActive ? "Revoked & Logged Out" : "Active Session"}
                    </span>
                  </div>

                  {/* Smartphone */}
                  <div
                    className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                      deviceSimActive
                        ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                        : "bg-gray-50 border-gray-200 text-gray-400"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Smartphone className="w-4 h-4" />
                      <div>
                        <div className="font-bold">Android Device · Mobile Chrome</div>
                        <div className="text-2xs opacity-80">
                          {deviceSimActive ? "IP: 49.36.88.10 · Session #sess_91b (New)" : "No Active Token"}
                        </div>
                      </div>
                    </div>
                    <span className="text-2xs font-extrabold uppercase px-2 py-0.5 rounded bg-white/80">
                      {deviceSimActive ? "Live Protected" : "Standby"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t flex items-center justify-between text-xs text-gray-500" style={{ borderColor: "var(--theme-glass-border)" }}>
              <span>✓ Redis &amp; PostgreSQL Token Revocation</span>
              <span className="text-emerald-600 font-bold">&lt; 8ms Invalidation SLA</span>
            </div>
          </div>

        </div>

        {/* Live Immutable Audit Log Ticker */}
        <div
          className="rounded-2xl p-6 border shadow-xs"
          style={{
            background: "var(--theme-card-bg)",
            borderColor: "var(--theme-glass-border)",
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-red-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Immutable Master Audit Stream
              </span>
            </div>
            <Link href="/admin/audit-logs" className="text-xs font-bold text-red-600 hover:underline">
              View Audit Console →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
            <div
              className="p-3 rounded-lg border"
              style={{
                background: "var(--theme-canvas)",
                borderColor: "var(--theme-glass-border)",
              }}
            >
              <div className="text-2xs mb-1" style={{ color: "var(--theme-gray-400)" }}>11:14:02 · UBAC Override</div>
              <div className="font-bold truncate" style={{ color: "var(--theme-ink-darkest)" }}>ROLE: SALES_LEAD ➔ EDIT_ORDER</div>
              <div className="text-2xs mt-1" style={{ color: "var(--theme-success)" }}>Actor: sec_officer@mercora.com</div>
            </div>

            <div
              className="p-3 rounded-lg border"
              style={{
                background: "var(--theme-canvas)",
                borderColor: "var(--theme-glass-border)",
              }}
            >
              <div className="text-2xs mb-1" style={{ color: "var(--theme-gray-400)" }}>11:12:48 · LGD Gazette Sync</div>
              <div className="font-bold truncate" style={{ color: "var(--theme-ink-darkest)" }}>SUB_DISTRICT: 24 Reconciled</div>
              <div className="text-2xs mt-1" style={{ color: "var(--theme-red)" }}>Actor: Cron Worker (System)</div>
            </div>

            <div
              className="p-3 rounded-lg border"
              style={{
                background: "var(--theme-canvas)",
                borderColor: "var(--theme-glass-border)",
              }}
            >
              <div className="text-2xs mb-1" style={{ color: "var(--theme-gray-400)" }}>11:08:15 · Session Revocation</div>
              <div className="font-bold truncate" style={{ color: "var(--theme-ink-darkest)" }}>DEVICE_CONFLICT: Sess #8482 Invalidated</div>
              <div className="text-2xs mt-1" style={{ color: "var(--theme-error)" }}>Actor: SingleSessionGuard</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
