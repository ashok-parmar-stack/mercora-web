"use client";

import React from "react";
import Link from "next/link";
import { User } from "../../../lib/admin-types";
import { Shield, ExternalLink, KeyRound, Lock, AlertTriangle } from "lucide-react";

export interface UserDrawerGovernanceProps {
  user: User;
  roleName: string;
  userPermissions: any[];
  isLoadingPerms: boolean;
}

export function UserDrawerGovernance({
  user,
  roleName,
  userPermissions,
  isLoadingPerms,
}: UserDrawerGovernanceProps) {
  return (
    <div className="bg-surface border border-border rounded-xl p-4 shadow-xs">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-primary" />
          Role &amp; UBAC Overrides
        </h3>

        <Link
          href={`/admin/users/${encodeURIComponent(user.slug || user.id)}/permissions`}
          className="text-xs font-bold text-primary hover:text-primary-hover flex items-center gap-1 hover:underline"
        >
          <span>Matrix</span>
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>

      <div className="space-y-3 text-xs">
        {/* Role Details Banner */}
        <div className="bg-primary-soft/30 border border-primary/20 rounded-lg p-3 flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs flex-shrink-0">
            <Shield className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-foreground text-sm">{roleName}</span>
              {user.role?.code && (
                <code className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-mono">
                  {user.role.code}
                </code>
              )}
            </div>
            {user.role?.description ? (
              <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                {user.role.description}
              </p>
            ) : (
              <p className="text-[11px] text-muted-foreground mt-0.5 italic">
                Standard organizational role permissions apply.
              </p>
            )}
          </div>
        </div>

        {/* UBAC Permissions Summary */}
        <div className="bg-surface-hover/60 border border-border rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-foreground flex items-center gap-1">
              <KeyRound className="w-3.5 h-3.5 text-muted-foreground" />
              Individual UBAC Overrides
            </span>
            <span className="text-[11px] text-muted-foreground">
              {isLoadingPerms ? (
                "Loading..."
              ) : userPermissions.length === 0 ? (
                "0 custom rules"
              ) : (
                `${userPermissions.length} active ${
                  userPermissions.length === 1 ? "override" : "overrides"
                }`
              )}
            </span>
          </div>

          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Individual user overrides take absolute precedence over role policies in the
            deterministic permission engine.
          </p>
        </div>
      </div>
    </div>
  );
}
