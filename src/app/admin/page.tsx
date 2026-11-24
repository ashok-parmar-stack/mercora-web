"use client";

import React from "react";
import Link from "next/link";
import { useRoles } from "../../lib/hooks/useRoles";
import { useUsers } from "../../lib/hooks/useUsers";
import { usePermissions } from "../../lib/hooks/usePermissions";
import { useStatuses } from "../../lib/hooks/useStatuses";
import { useUIStore } from "../../lib/store/ui-store";
import { PageHeader } from "../../components/layout/PageHeader";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import {
  Shield,
  Users,
  Key,
  Layers,
  Activity,
  ArrowUpRight,
  Plus,
  CheckCircle2,
  Clock,
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

  const quickStats = [
    {
      label: "Active Roles",
      value: rolesLoading ? "..." : String(activeRolesCount),
      subtext: `${roles.filter((r) => r.isSystem).length} System Enforced`,
      icon: Shield,
      href: "/admin/roles",
      color: "text-blue-600 bg-blue-50 border-blue-100",
    },
    {
      label: "Directory Users",
      value: usersLoading ? "..." : String(activeUsersCount),
      subtext: "Enterprise accounts",
      icon: Users,
      href: "/admin/users",
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
    },
    {
      label: "Permission Modules",
      value: permsLoading ? "..." : String(permissions.length),
      subtext: "Granular action matrix",
      icon: Key,
      href: "/admin/permissions",
      color: "text-purple-600 bg-purple-50 border-purple-100",
    },
    {
      label: "Status Types",
      value: statusesLoading ? "..." : String(statuses.length),
      subtext: "Domain lifecycle records",
      icon: Layers,
      href: "/admin/statuses",
      color: "text-amber-600 bg-amber-50 border-amber-100",
    },
  ];

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
      target: activePersona.roleName,
      actor: "Local Session",
      time: "Active",
      type: "Session",
    },
  ];

  return (
    <div className="flex flex-col gap-8 max-w-6xl">
      <PageHeader
        title="Admin Console Overview"
        description="Unified enterprise control plane for Mercora Global B2B Intelligence Platform."
      />

      {/* KPI Stats Grid */}
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
            <p className="text-xs text-text-muted mt-0.5">
              Jump directly to dedicated management workflows.
            </p>
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
                    <p className="text-[11px] text-text-muted mt-0.5 leading-snug">
                      {link.desc}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Activity Timeline */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-xs flex flex-col gap-4">
          <div className="border-b border-border pb-3">
            <h3 className="font-semibold text-sm text-text-primary flex items-center gap-2">
              <Clock className="w-4 h-4 text-text-muted" />
              Recent Security Audit
            </h3>
            <p className="text-xs text-text-muted mt-0.5">
              Chronological log of administrative actions.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {recentEvents.map((evt, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg border border-border bg-surface-hover/30 flex flex-col gap-1 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-text-primary text-[11px]">
                    {evt.action}
                  </span>
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
      </div>
    </div>
  );
}
