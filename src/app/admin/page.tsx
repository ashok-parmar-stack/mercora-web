"use client";

import React from "react";
import Link from "next/link";
import { useRoles } from "../../lib/hooks/useRoles";
import { useUsers } from "../../lib/hooks/useUsers";
import { usePermissions } from "../../lib/hooks/usePermissions";
import { useStatuses } from "../../lib/hooks/useStatuses";
import { useUIStore } from "../../lib/store/ui-store";
import { PageHeader } from "../../components/layout/PageHeader";
import { Badge, Button } from "@/components/common";
import { DashboardStats } from "@/features/dashboard/components/DashboardStats";
import { DashboardAuditTimeline } from "@/features/dashboard/components/DashboardAuditTimeline";
import { DashboardAnalyticsCharts } from "@/features/dashboard/components/DashboardAnalyticsCharts";
import {
  Shield,
  Users,
  Layers,
  Activity,
  Plus,
  Sparkles,
  FolderTree,
  Hash,
} from "lucide-react";

export default function AdminDashboardPage() {
  const { roles, isLoading: rolesLoading } = useRoles();
  const { users, isLoading: usersLoading } = useUsers();
  const { permissions, isLoading: permsLoading } = usePermissions();
  const { statuses, isLoading: statusesLoading } = useStatuses();
  const activePersona = useUIStore((s) => s.activePersona);

  const activeUsersCount = users.filter((u) => !u.deletedAt).length;
  const activeRolesCount = roles.filter((r) => !r.deletedAt).length;
  const systemRolesCount = roles.filter((r) => r.isSystem).length;

  const quickLinks = [
    {
      title: "Product Category Tree",
      desc: "Flipkart-style infinite taxonomy with parent-child hierarchy.",
      href: "/admin/categories",
      icon: FolderTree,
    },
    {
      title: "HSN Code Master",
      desc: "Official Indian Customs & GST ITCHS tariff sync and mapping.",
      href: "/admin/hsn-codes",
      icon: Hash,
    },
    {
      title: "Create New Role",
      desc: "Define custom role with fine-grained permissions.",
      href: "/admin/roles/create",
      icon: Shield,
    },
    {
      title: "Provision User Account",
      desc: "Onboard new team member and assign organizational role.",
      href: "/admin/users/create",
      icon: Users,
    },
    {
      title: "Define Domain Status",
      desc: "Register a status code for Users, Companies, or Leads.",
      href: "/admin/statuses/create",
      icon: Layers,
    },
    {
      title: "Inspect Component Storybook",
      desc: "Test isolated UI components, states, and variants.",
      href: "/admin/storybook",
      icon: Sparkles,
    },
  ];

  return (
    <div className="flex flex-col gap-8 w-full">
      <PageHeader
        title="Admin Console Overview"
        description="Unified enterprise control plane for Mercora Global B2B Intelligence Platform."
      />

      <DashboardStats
        rolesLoading={rolesLoading}
        usersLoading={usersLoading}
        permsLoading={permsLoading}
        statusesLoading={statusesLoading}
        activeRolesCount={activeRolesCount}
        activeUsersCount={activeUsersCount}
        systemRolesCount={systemRolesCount}
        permissionsCount={permissions.length}
        statusesCount={statuses.length}
      />

      <DashboardAnalyticsCharts />

      {/* Active Persona Banner */}
      <div className="bg-card border border-border text-text-primary rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold flex-shrink-0 shadow-xs">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm text-text-primary">
                Active Simulation Persona: {activePersona.roleName}
              </h3>
              <Badge variant="purple" size="sm">
                Code: {activePersona.roleCode}
              </Badge>
            </div>
            <p className="text-xs text-text-muted mt-0.5">
              Permissions: {activePersona.canCreate ? "Create ✓" : "Create ✗"} |{" "}
              {activePersona.canEdit ? "Edit ✓" : "Edit ✗"} |{" "}
              {activePersona.canDelete ? "Delete ✓" : "Delete ✗"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="/admin/roles">
            <Button variant="secondary" size="md">
              Manage Roles
            </Button>
          </Link>
          <Link href="/admin/users">
            <Button variant="primary" size="md">
              Manage Users
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Access Actions */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6 shadow-xs flex flex-col gap-4">
          <div className="border-b border-border pb-3">
            <h3 className="font-semibold text-sm text-text-primary">Quick Configuration Actions</h3>
            <p className="text-xs text-text-muted mt-0.5">Jump directly to dedicated management workflows.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {quickLinks.map((link, idx) => {
              const Icon = link.icon;
              return (
                <Link
                  key={idx}
                  href={link.href}
                  className="p-4 rounded-xl border border-border hover:border-border-focus/40 hover:bg-surface-hover/50 transition-all flex flex-col gap-2 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-lg bg-surface-hover group-hover:bg-primary/10 group-hover:text-primary text-text-secondary transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <Plus className="w-4 h-4 text-text-muted group-hover:text-primary transition-colors" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-xs text-text-primary group-hover:text-primary transition-colors">
                      {link.title}
                    </h4>
                    <p className="text-[11px] text-text-muted mt-0.5 leading-snug">{link.desc}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Activity Timeline */}
        <DashboardAuditTimeline activePersonaRoleName={activePersona.roleName} />
      </div>
    </div>
  );
}
