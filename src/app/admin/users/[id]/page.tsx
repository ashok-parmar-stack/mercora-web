"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  KeyRound,
  Mail,
  Pencil,
  RefreshCw,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { Badge, ConfirmDialog, PageHeader } from "@/components/common";
import { StatusBadge } from "@/components/status/StatusBadge";
import { useUserDetails, useUsers } from "@/lib/hooks/useUsers";
import { useUIStore } from "@/lib/store/ui-store";
import { UserDetailSections } from "@/features/users/components/UserDetailSections";

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
  const fullName =
    (user as any).name || `${derivedFirst} ${derivedLast}`.trim() || user.email.split("@")[0] || "Unnamed User";
  const isDeleted = Boolean(user.deletedAt);
  const initials = (derivedFirst[0] || (user as any).name?.[0] || user.email[0] || "U").toUpperCase();
  const roleName = user.role?.name || "User";

  const overrides = Array.isArray(permissionsInfo)
    ? permissionsInfo
    : permissionsInfo?.userPermissions || user.userPermissions || [];
  const grantedCount = overrides.filter((p: any) => p.effect === "GRANT").length;
  const revokedCount = overrides.filter((p: any) => p.effect === "REVOKE").length;
  const userKey = encodeURIComponent(user.slug || user.id);

  return (
    <div className="flex flex-col gap-6 w-full">
      <PageHeader
        title={fullName}
        description={`User account details, assigned roles, and permission policies for ${user.email}.`}
        backHref="/admin/users"
        actionButton={{
          label: "Edit User",
          href: `/admin/users/${userKey}/edit`,
          icon: <Pencil className="w-4 h-4" />,
          disabled: !activePersona.canEdit,
        }}
        extraActions={
          <div className="flex items-center gap-2">
            <Link
              href={`/admin/users/${userKey}/permissions`}
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

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-brand-50/60 via-white to-gray-50 p-6 sm:p-8 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-brand-600 to-rose-400 text-white flex items-center justify-center font-extrabold text-3xl shadow-lg ring-4 ring-white">
                {initials}
              </div>
              <span
                className={`block w-5 h-5 rounded-full ring-3 ring-white absolute -bottom-1 -right-1 ${
                  isDeleted ? "bg-red-500" : user.status?.code === "INACTIVE" ? "bg-yellow-500" : "bg-emerald-500"
                }`}
                title={isDeleted ? "Deleted" : user.status?.code || "Active"}
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{fullName}</h1>
                <StatusBadge status={user.status?.code || "ACTIVE"} isDeleted={isDeleted} />
                <Badge variant="purple" size="md">{roleName}</Badge>
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

        <UserDetailSections
          user={user}
          derivedFirst={derivedFirst}
          derivedLast={derivedLast}
          roleName={roleName}
          isDeleted={isDeleted}
          overrides={overrides}
          grantedCount={grantedCount}
          revokedCount={revokedCount}
          copiedKey={copiedKey}
          onCopy={copyToClipboard}
        />
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
