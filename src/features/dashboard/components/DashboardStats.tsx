"use client";

import React from "react";
import Link from "next/link";
import { Shield, Users, Key, Layers, ArrowUpRight } from "lucide-react";

export interface DashboardStatsProps {
  rolesLoading: boolean;
  usersLoading: boolean;
  permsLoading: boolean;
  statusesLoading: boolean;
  activeRolesCount: number;
  activeUsersCount: number;
  systemRolesCount: number;
  permissionsCount: number;
  statusesCount: number;
}

export function DashboardStats({
  rolesLoading,
  usersLoading,
  permsLoading,
  statusesLoading,
  activeRolesCount,
  activeUsersCount,
  systemRolesCount,
  permissionsCount,
  statusesCount,
}: DashboardStatsProps) {
  const quickStats = [
    {
      label: "Active Roles",
      value: rolesLoading ? "..." : String(activeRolesCount),
      subtext: `${systemRolesCount} System Enforced`,
      icon: Shield,
      href: "/admin/roles",
    },
    {
      label: "Directory Users",
      value: usersLoading ? "..." : String(activeUsersCount),
      subtext: "Enterprise accounts",
      icon: Users,
      href: "/admin/users",
    },
    {
      label: "Permission Modules",
      value: permsLoading ? "..." : String(permissionsCount),
      subtext: "Granular action matrix",
      icon: Key,
      href: "/admin/permissions",
    },
    {
      label: "Status Types",
      value: statusesLoading ? "..." : String(statusesCount),
      subtext: "Domain lifecycle records",
      icon: Layers,
      href: "/admin/statuses",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {quickStats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <Link
            key={idx}
            href={stat.href}
            className="bg-card border border-border hover:border-border-focus/40 rounded-xl p-5 shadow-xs transition-all hover:shadow-sm group flex flex-col justify-between gap-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                {stat.label}
              </span>
              <div className="p-2 rounded-lg border border-primary/20 bg-primary/10 text-primary">
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div>
              <div className="text-2xl font-bold text-text-primary tracking-tight">
                {stat.value}
              </div>
              <div className="text-[11px] text-text-muted font-medium mt-0.5 flex items-center justify-between">
                <span>{stat.subtext}</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-text-muted group-hover:text-primary transition-colors" />
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
