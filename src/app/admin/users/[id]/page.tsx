"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "../../../../components/layout/PageHeader";
import { StatusBadge } from "../../../../components/status/StatusBadge";
import { Badge } from "../../../../components/ui/Badge";
import { Tooltip } from "../../../../components/ui/Tooltip";
import { ConfirmDialog } from "../../../../components/common/ConfirmDialog";
import { useUserDetails, useUsers } from "../../../../lib/hooks/useUsers";
import { useUIStore } from "../../../../lib/store/ui-store";
import {
  Mail,
  Phone,
  Shield,
  KeyRound,
  Calendar,
  Clock,
  Pencil,
  Trash2,
  RotateCcw,
  Copy,
  Check,
  ExternalLink,
  User as UserIcon,
  Fingerprint,
  AlertTriangle,
  RefreshCw,
  ArrowLeft,
} from "lucide-react";

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const idOrSlug = params?.id as string;

  const { user, permissionsInfo, isLoading, error, refetch } = useUserDetails(idOrSlug);
  const { deleteUser, restoreUser } = useUsers();
  const activePersona = useUIStore((s) => s.activePersona);

  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader title="User Profile" backHref="/admin/users" />
        <div className="bg-white border border-gray-200 rounded-xl p-12 flex flex-col items-center justify-center gap-3 text-gray-500 shadow-xs">
          <RefreshCw className="w-6 h-6 animate-spin text-brand-600" />
          <span className="text-sm font-medium">Loading user details...</span>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader title="User Not Found" backHref="/admin/users" />
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 flex flex-col items-center text-center max-w-md mx-auto">
          <AlertTriangle className="w-10 h-10 text-red-500 mb-3" />
          <h2 className="text-base font-bold text-red-900">User Not Found</h2>
          <p className="text-xs text-red-700 mt-1 mb-5">
            {error || "The user you are looking for does not exist or may have been deleted."}
          </p>
          <Link
            href="/admin/users"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 text-xs font-bold hover:bg-gray-50 transition-colors shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Users List
          </Link>
        </div>
      </div>
    );
  }

  const nameParts = (user as any).name ? String((user as any).name).trim().split(/\s+/) : [];
  const derivedFirst = user.firstName || nameParts[0] || "";
  const derivedLast = user.lastName || (nameParts.length > 1 ? nameParts.slice(1).join(" ") : "");
  const fullName = (user as any).name || `${derivedFirst} ${derivedLast}`.trim() || user.email.split("@")[0] || "Unnamed User";
  const isDeleted = Boolean(user.deletedAt);
  const initials = (derivedFirst[0] || (user as any).name?.[0] || user.email[0] || "U").toUpperCase();
  const roleName = user.role?.name || "User";

  const overrides = Array.isArray(permissionsInfo)
    ? permissionsInfo
    : permissionsInfo?.userPermissions || user.userPermissions || [];
  const granted = overrides.filter((p: any) => p.effect === "GRANT");
  const revoked = overrides.filter((p: any) => p.effect === "REVOKE");

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      <PageHeader
        title={fullName}
        description={`User account details, assigned roles, and permission policies for ${user.email}.`}
        backHref="/admin/users"
        actionButton={{
          label: "Edit User",
          href: `/admin/users/${encodeURIComponent(user.slug || user.id)}/edit`,
          icon: <Pencil className="w-4 h-4" />,
          disabled: !activePersona.canEdit,
        }}
        extraActions={
          <div className="flex items-center gap-2">
            <Link
              href={`/admin/users/${encodeURIComponent(user.slug || user.id)}/permissions`}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold transition-colors shadow-2xs"
            >
              <KeyRound className="w-4 h-4 text-brand-600" />
              <span>UBAC Matrix</span>
            </Link>

            {isDeleted ? (
              <button
                onClick={async () => {
                  await restoreUser(user.slug || user.id);
                  refetch();
                }}
                disabled={!activePersona.canEdit}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-green-50 hover:bg-green-100 border border-green-200 text-green-700 text-xs font-bold transition-colors disabled:opacity-40"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Restore</span>
              </button>
            ) : (
              <button
                onClick={() => setIsDeleting(true)}
                disabled={!activePersona.canDelete}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-xs font-bold transition-colors disabled:opacity-40"
              >
                <Trash2 className="w-4 h-4" />
                <span>Soft-Delete</span>
              </button>
            )}
          </div>
        }
      />

      {/* Main Profile Card */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        {/* Banner Header */}
        <div className="bg-gradient-to-r from-brand-50/60 via-white to-gray-50 p-6 sm:p-8 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-brand-600 to-rose-400 text-white flex items-center justify-center font-extrabold text-3xl shadow-lg ring-4 ring-white">
                {initials}
              </div>
              <div className="absolute -bottom-1 -right-1">
                <span
                  className={`block w-5 h-5 rounded-full ring-3 ring-white ${
                    isDeleted
                      ? "bg-red-500"
                      : user.status?.code === "INACTIVE"
                      ? "bg-yellow-500"
                      : "bg-emerald-500"
                  }`}
                  title={isDeleted ? "Deleted" : user.status?.code || "Active"}
                />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{fullName}</h1>
                <StatusBadge status={user.status?.code || "ACTIVE"} isDeleted={isDeleted} />
                <Badge variant="purple" size="md">
                  {roleName}
                </Badge>
              </div>

              <div className="text-sm text-gray-500 mt-1 flex items-center gap-2 flex-wrap">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-gray-400" />
                  {user.email}
                </span>

                {user.slug && (
                  <code className="text-xs font-mono bg-gray-100 text-gray-600 px-2 py-0.5 rounded border border-gray-200">
                    @{user.slug}
                  </code>
                )}
              </div>
            </div>
          </div>

          {isDeleted && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-xs text-red-800">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <div>
                <strong>Soft-Deleted Account:</strong> This user was soft-deleted on{" "}
                {user.deletedAt ? new Date(user.deletedAt).toLocaleString() : "an unknown date"}.
                System access and active session tokens are revoked.
              </div>
            </div>
          )}
        </div>

        {/* Content Grid */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Identity & Account Card */}
            <div className="bg-gray-50/50 border border-gray-200 rounded-xl p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                <UserIcon className="w-4 h-4 text-brand-600" />
                Contact & Identification
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-500 font-medium">First Name</span>
                  <span className="font-bold text-gray-900">{derivedFirst || "—"}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-500 font-medium">Last Name</span>
                  <span className="font-bold text-gray-900">{derivedLast || "—"}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-500 font-medium">Email Address</span>
                  <div className="flex items-center gap-1.5 font-bold text-gray-900">
                    <span>{user.email}</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(user.email, "email")}
                      className="text-gray-400 hover:text-gray-600 cursor-pointer"
                      title="Copy email"
                    >
                      {copiedKey === "email" ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-500 font-medium">Phone Number</span>
                  <span className="font-bold text-gray-900">{user.phone || <span className="text-gray-400 font-normal italic">None</span>}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-500 font-medium">System UUID</span>
                  <code className="font-mono text-[11px] text-gray-700 bg-white border border-gray-200 px-1.5 py-0.5 rounded">
                    {user.id}
                  </code>
                </div>
              </div>
            </div>

            {/* Access & Role Governance */}
            <div className="bg-gray-50/50 border border-gray-200 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-purple-600" />
                  Assigned Role & UBAC Overrides
                </h3>
                <Link
                  href={`/admin/users/${encodeURIComponent(user.slug || user.id)}/permissions`}
                  className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 hover:underline"
                >
                  Configure <ExternalLink className="w-3 h-3" />
                </Link>
              </div>

              <div className="bg-white border border-purple-100 rounded-lg p-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-950">{roleName}</span>
                  {user.role?.code && (
                    <code className="text-[10px] bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded font-mono">
                      {user.role.code}
                    </code>
                  )}
                </div>
                <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
                  {user.role?.description || "Standard organization permissions apply without special restrictions."}
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-3.5 text-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-gray-700">Custom UBAC Overrides</span>
                  <span className="text-gray-500 font-semibold">{overrides.length} rules</span>
                </div>
                {overrides.length > 0 ? (
                  <div className="flex items-center gap-2">
                    {granted.length > 0 && (
                      <span className="px-2 py-0.5 rounded bg-green-50 border border-green-200 text-green-700 text-[11px] font-bold">
                        +{granted.length} Granted
                      </span>
                    )}
                    {revoked.length > 0 && (
                      <span className="px-2 py-0.5 rounded bg-red-50 border border-red-200 text-red-700 text-[11px] font-bold">
                        -{revoked.length} Revoked
                      </span>
                    )}
                  </div>
                ) : (
                  <p className="text-[11px] text-gray-500">
                    No custom overrides configured for this user.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Audit Timestamps Card */}
          <div className="bg-gray-50/50 border border-gray-200 rounded-xl p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-gray-500" />
              Audit Timestamps & Lifecycle
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="bg-white p-3 rounded-lg border border-gray-100">
                <span className="text-gray-400 block text-[10px] font-bold uppercase flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Registered
                </span>
                <span className="font-semibold text-gray-800 mt-0.5 block">
                  {user.createdAt ? new Date(user.createdAt).toLocaleString() : "—"}
                </span>
              </div>

              <div className="bg-white p-3 rounded-lg border border-gray-100">
                <span className="text-gray-400 block text-[10px] font-bold uppercase flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Last Modified
                </span>
                <span className="font-semibold text-gray-800 mt-0.5 block">
                  {user.updatedAt ? new Date(user.updatedAt).toLocaleString() : "—"}
                </span>
              </div>

              <div className="bg-white p-3 rounded-lg border border-gray-100">
                <span className="text-gray-400 block text-[10px] font-bold uppercase">
                  Account Status
                </span>
                <span className="font-semibold text-gray-800 mt-0.5 block">
                  {isDeleted ? "Soft-Deleted" : user.status?.name || "Active"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={isDeleting}
        onClose={() => setIsDeleting(false)}
        title={`Delete User: ${user.email}?`}
        description={`Are you sure you want to soft-delete "${user.email}"? The user will no longer be able to log in.`}
        confirmText="Delete User"
        variant="danger"
        onConfirm={async () => {
          await deleteUser(user.slug || user.id, "soft");
          setIsDeleting(false);
          router.push("/admin/users");
        }}
      />
    </div>
  );
}
