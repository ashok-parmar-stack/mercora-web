"use client";

import React from "react";
import { Palette } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/common";

export function ColorTokensSection() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-brand-600" />
          <CardTitle>1. Brand Color System &amp; Design Tokens</CardTitle>
        </div>
        <CardDescription>
          The primary brand crimson palette (`#ee3135`), dark ink surfaces, and semantic indicators.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div>
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
            Brand Red Spectrum
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            <div className="flex flex-col p-3 rounded-xl bg-brand-50 border border-brand-200">
              <span className="text-xs font-bold text-brand-900">brand-50</span>
              <span className="text-[10px] font-mono text-brand-700">#fff3f4</span>
              <span className="text-[10px] text-gray-500 mt-1">Row Selection / Tint</span>
            </div>
            <div className="flex flex-col p-3 rounded-xl bg-brand-100 border border-brand-200">
              <span className="text-xs font-bold text-brand-900">brand-100</span>
              <span className="text-[10px] font-mono text-brand-700">#ffe4e6</span>
              <span className="text-[10px] text-gray-500 mt-1">Light Border</span>
            </div>
            <div className="flex flex-col p-3 rounded-xl bg-brand-500 text-white shadow-sm">
              <span className="text-xs font-bold">brand-500</span>
              <span className="text-[10px] font-mono text-brand-100">#ee3135</span>
              <span className="text-[10px] text-brand-100 mt-1">Primary Red Accent</span>
            </div>
            <div className="flex flex-col p-3 rounded-xl bg-brand-600 text-white shadow-sm">
              <span className="text-xs font-bold">brand-600</span>
              <span className="text-[10px] font-mono text-brand-100">#d92c30</span>
              <span className="text-[10px] text-brand-100 mt-1">Button Hover / Check</span>
            </div>
            <div className="flex flex-col p-3 rounded-xl bg-brand-700 text-white shadow-sm">
              <span className="text-xs font-bold">brand-700</span>
              <span className="text-[10px] font-mono text-brand-100">#b82029</span>
              <span className="text-[10px] text-brand-100 mt-1">Active Elements</span>
            </div>
            <div className="flex flex-col p-3 rounded-xl bg-gray-900 text-white shadow-sm">
              <span className="text-xs font-bold">brand-dark</span>
              <span className="text-[10px] font-mono text-gray-400">#14161a</span>
              <span className="text-[10px] text-gray-400 mt-1">Sidebar / Text</span>
            </div>
          </div>
        </div>

        <div>
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
            Semantic Status Tokens
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
              <div className="text-xs font-bold text-emerald-800">Success</div>
              <div className="text-[10px] font-mono text-emerald-600">ACTIVE / APPROVED</div>
            </div>
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200">
              <div className="text-xs font-bold text-rose-800">Danger / Error</div>
              <div className="text-[10px] font-mono text-rose-600">INACTIVE / DELETED</div>
            </div>
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
              <div className="text-xs font-bold text-amber-800">Warning / Pending</div>
              <div className="text-[10px] font-mono text-amber-600">PENDING / SUSPENDED</div>
            </div>
            <div className="p-3 rounded-xl bg-sky-50 border border-sky-200">
              <div className="text-xs font-bold text-sky-800">Info / Accent</div>
              <div className="text-[10px] font-mono text-sky-600">PROCESSING / SYNC</div>
            </div>
          </div>
        </div>

        <div>
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
            Dynamic Theme Surfaces (Adapts on Theme Toggle)
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              ["--background", "Base Page Canvas", "bg-[var(--background)]"],
              ["--surface", "Card & Panel Layer", "bg-[var(--surface)]"],
              ["--surface-raised", "Modal / Popover Layer", "bg-[var(--surface-raised)]"],
              ["--surface-hover", "Hover Interactive Tint", "bg-[var(--surface-hover)]"],
            ].map(([token, desc, cls]) => (
              <div key={token} className={`p-3 rounded-xl ${cls} border border-[var(--border)]`}>
                <div className="text-xs font-bold text-[var(--text-primary)]">{token}</div>
                <div className="text-[10px] text-[var(--text-muted)]">{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
