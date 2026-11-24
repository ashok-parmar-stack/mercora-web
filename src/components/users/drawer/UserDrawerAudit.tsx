"use client";

import React from "react";
import { User } from "../../../lib/admin-types";
import { Calendar, Clock } from "lucide-react";

export interface UserDrawerAuditProps {
  user: User;
}

export function UserDrawerAudit({ user }: UserDrawerAuditProps) {
  return (
    <div className="bg-surface border border-border rounded-xl p-4 shadow-xs">
      <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
        <Clock className="w-3.5 h-3.5 text-primary" />
        System Timestamps &amp; Lifecycle
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="bg-surface-hover/60 p-2.5 rounded-lg border border-border">
          <span className="text-text-muted block text-[10px] font-bold uppercase flex items-center gap-1">
            <Calendar className="w-3 h-3" /> Registration Date
          </span>
          <span className="font-semibold text-foreground">
            {user.createdAt ? new Date(user.createdAt).toLocaleString("en-US") : "Unknown"}
          </span>
        </div>

        <div className="bg-surface-hover/60 p-2.5 rounded-lg border border-border">
          <span className="text-text-muted block text-[10px] font-bold uppercase flex items-center gap-1">
            <Clock className="w-3 h-3" /> Last Record Update
          </span>
          <span className="font-semibold text-foreground">
            {user.updatedAt ? new Date(user.updatedAt).toLocaleString("en-US") : "Unknown"}
          </span>
        </div>
      </div>
    </div>
  );
}
