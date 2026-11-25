"use client";

import React from "react";

interface PincodeKpiStripProps {
  total: number;
  deliveryCount: number;
  stateCount: number;
}

export function PincodeKpiStrip({ total, deliveryCount, stateCount }: PincodeKpiStripProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <div className="p-4 rounded-xl bg-surface border border-border shadow-2xs">
        <div className="text-xs font-semibold text-text-muted">Total PIN Codes</div>
        <div className="text-2xl font-extrabold text-text-primary mt-1">{total}</div>
      </div>
      <div className="p-4 rounded-xl bg-surface border border-border shadow-2xs">
        <div className="text-xs font-semibold text-text-muted">Delivery Hubs</div>
        <div className="text-2xl font-extrabold text-primary mt-1">{deliveryCount}</div>
      </div>
      <div className="p-4 rounded-xl bg-surface border border-border shadow-2xs">
        <div className="text-xs font-semibold text-text-muted">States Synced</div>
        <div className="text-2xl font-extrabold text-text-primary mt-1">{stateCount}</div>
      </div>
      <div className="p-4 rounded-xl bg-surface border border-border shadow-2xs flex flex-col justify-center">
        <div className="text-xs font-semibold text-text-muted">India Post API</div>
        <div className="flex items-center gap-1.5 mt-1 text-xs font-bold text-emerald-600">
          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
          <span>Govt Live Sync Online</span>
        </div>
      </div>
    </div>
  );
}
