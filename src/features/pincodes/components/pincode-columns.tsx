"use client";

import React from "react";
import { CheckCircle2 } from "lucide-react";
import { Badge, Column } from "@/components/common";
import { PincodeRecord } from "@/features/pincodes/api/pincode-api";

export function getPincodeColumns(): Column<PincodeRecord>[] {
  return [
    {
      key: "pincode",
      header: "PIN Code",
      sortable: true,
      sortAccessor: (p) => p.pincode,
      render: (item) => (
        <span className="font-mono font-bold text-xs px-2.5 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20">
          {item.pincode}
        </span>
      ),
    },
    {
      key: "postOfficeName",
      header: "Post Office Name",
      sortable: true,
      sortAccessor: (p) => p.postOfficeName.toLowerCase(),
      render: (item) => (
        <span className="font-bold text-xs text-text-primary">{item.postOfficeName}</span>
      ),
    },
    {
      key: "branchType",
      header: "Branch Type",
      sortable: true,
      render: (item) => <span className="text-xs text-text-secondary">{item.branchType}</span>,
    },
    {
      key: "district",
      header: "District",
      sortable: true,
      render: (item) => (
        <span className="text-xs text-text-secondary font-medium">{item.district}</span>
      ),
    },
    {
      key: "state",
      header: "State",
      sortable: true,
      render: (item) => <span className="text-xs text-text-secondary">{item.state}</span>,
    },
    {
      key: "deliveryStatus",
      header: "Delivery Status",
      sortable: true,
      render: (item) => (
        <Badge variant={item.deliveryStatus === "Delivery" ? "success" : "warning"} size="sm">
          {item.deliveryStatus}
        </Badge>
      ),
    },
    {
      key: "source",
      header: "Source",
      sortable: true,
      render: (item) => (
        <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{item.source === "MANUAL_ENTRY" ? "Manual" : "Govt Synced"}</span>
        </div>
      ),
    },
  ];
}
