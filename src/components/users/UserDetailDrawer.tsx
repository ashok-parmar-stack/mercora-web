"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { User } from "../../lib/admin-types";
import { StatusBadge } from "../status/StatusBadge";
import { Badge } from "../ui/Badge";
import { Tooltip } from "../ui/Tooltip";
import { fetchUserPermissions } from "../../lib/admin-api";
import {
  X,
  ChevronLeft,
  ChevronRight,
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
  Lock,
  Layers,
} from "lucide-react";

export interface UserDetailDrawerProps {
  user: User | null;
  usersList?: User[];
  isOpen: boolean;
  onClose: () => void;
  onSelectUser?: (user: User) => void;
  onDeleteUser?: (user: User) => void;
  onRestoreUser?: (user: User) => void;
  canEdit?: boolean;
  canDelete?: boolean;
}

export const UserDetailDrawer: React.FC<UserDetailDrawerProps> = ({
  user,
  usersList = [],
  isOpen,
  onClose,
  onSelectUser,
  onDeleteUser,
  onRestoreUser,
  canEdit = true,
  canDelete = true,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [userPermissions, setUserPermissions] = useState<any[]>([]);
  const [isLoadingPerms, setIsLoadingPerms] = useState(false);

  // Find index in current list for prev/next navigation
  const currentIndex = user && usersList.length > 0
    ? usersList.findIndex((u) => (u.slug || u.id) === (user.slug || user.id))
    : -1;

  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex >= 0 && currentIndex < usersList.length - 1;

  const goToPrev = useCallback(() => {
    if (hasPrev && onSelectUser) {
      onSelectUser(usersList[currentIndex - 1]);
    }
  }, [hasPrev, currentIndex, usersList, onSelectUser]);

  const goToNext = useCallback(() => {
    if (hasNext && onSelectUser) {
      onSelectUser(usersList[currentIndex + 1]);
    }
  }, [hasNext, currentIndex, usersList, onSelectUser]);

  // Load permission overrides when user changes
  useEffect(() => {
    if (!user || !isOpen) {
      setUserPermissions([]);
      return;
    }

    let isMounted = true;
    setIsLoadingPerms(true);
    fetchUserPermissions(user.slug || user.id)
      .then((res: any) => {
        if (!isMounted) return;
        const data = res?.data || res || [];
        const perms = Array.isArray(data) ? data : data.userPermissions || [];
        setUserPermissions(perms);
      })
      .catch(() => {
        if (!isMounted) return;
        setUserPermissions(user.userPermissions || []);
      })
      .finally(() => {
        if (isMounted) setIsLoadingPerms(false);
      });

    return () => {
      isMounted = false;
    };
  }, [user?.id, user?.slug, isOpen]);

  // Keyboard navigation: Left/Right arrows & Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft" && hasPrev) {
        goToPrev();
      } else if (e.key === "ArrowRight" && hasNext) {
        goToNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, hasPrev, hasNext, goToPrev, goToNext, onClose]);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  if (!isOpen || !user) return null;

  const nameParts = (user as any).name ? String((user as any).name).trim().split(/\s+/) : [];
  const derivedFirst = user.firstName || nameParts[0] || "";
  const derivedLast = user.lastName || (nameParts.length > 1 ? nameParts.slice(1).join(" ") : "");
  const fullName = (user as any).name || `${derivedFirst} ${derivedLast}`.trim() || user.email.split("@")[0] || "Unnamed User";
  const isDeleted = Boolean(user.deletedAt);
  const initials = (derivedFirst[0] || (user as any).name?.[0] || user.email[0] || "U").toUpperCase();
  const roleName = user.role?.name || "User";

  const grantedOverrides = userPermissions.filter((p) => p.effect === "GRANT");
  const revokedOverrides = userPermissions.filter((p) => p.effect === "REVOKE");

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-Over Drawer Container */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`User Details: ${fullName}`}
        className="relative w-full max-w-xl bg-white shadow-2xl z-10 flex flex-col h-full border-l border-gray-200 animate-in slide-in-from-right duration-250 ease-out"
      >
        {/* ── Top Bar: Header & Controls ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/70">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-2">
              <UserIcon className="w-4 h-4 text-brand-600" />
              <span className="font-extrabold text-xs text-gray-900 tracking-wide">
                User Details
              </span>
            </div>

            {usersList.length > 1 && currentIndex >= 0 && (
              <span className="text-xs font-semibold text-gray-500 bg-white border border-gray-200 px-2.5 py-0.5 rounded-full shadow-2xs ml-1">
                User <strong className="text-gray-900">{currentIndex + 1}</strong> of{" "}
                <strong className="text-gray-900">{usersList.length}</strong>
              </span>
            )}

            {usersList.length > 1 && (
              <div className="flex items-center gap-1 ml-1">
                <Tooltip content="Previous user (← key)">
                  <button
                    type="button"
                    onClick={goToPrev}
                    disabled={!hasPrev}
                    className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed text-gray-600 transition-colors shadow-2xs cursor-pointer"
                    aria-label="Previous user"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </Tooltip>

                <Tooltip content="Next user (→ key)">
                  <button
                    type="button"
                    onClick={goToNext}
                    disabled={!hasNext}
                    className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed text-gray-600 transition-colors shadow-2xs cursor-pointer"
                    aria-label="Next user"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </Tooltip>
              </div>
            )}
          </div>

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Close drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Scrollable Body ── */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {/* ── User Identity Banner ── */}
          <div className="bg-gradient-to-br from-brand-50/50 via-white to-gray-50 border border-gray-200 rounded-2xl p-5 shadow-xs">
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-rose-400 text-white flex items-center justify-center font-extrabold text-2xl shadow-md ring-4 ring-white">
                  {initials}
                </div>
                <div className="absolute -bottom-1 -right-1">
                  <span
                    className={`block w-4 h-4 rounded-full ring-2 ring-white ${
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

              {/* Title & Badges */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-lg font-bold text-gray-900 truncate">
                    {fullName}
                  </h2>
                  <StatusBadge
                    status={user.status?.code || "ACTIVE"}
                    isDeleted={isDeleted}
                  />
                  <Badge variant="purple" size="sm">
                    {roleName}
                  </Badge>
                </div>

                <div className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-gray-400" />
                  <span className="truncate">{user.email}</span>
                </div>

                {user.slug && (
                  <div className="mt-2.5 inline-flex items-center gap-1.5 bg-white border border-gray-200 px-2 py-0.5 rounded-md text-[11px] font-mono text-gray-600 shadow-2xs">
                    <span>@{user.slug}</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(user.slug, "slug")}
                      className="text-gray-400 hover:text-gray-600 cursor-pointer"
                      title="Copy slug"
                    >
                      {copiedKey === "slug" ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {isDeleted && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2.5 text-xs text-red-800">
                <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <div>
                  <strong>User Account in Trash:</strong> This user was soft-deleted on{" "}
                  {user.deletedAt ? new Date(user.deletedAt).toLocaleString() : "an unknown date"}.
                  Login and system access are suspended.
                </div>
              </div>
            )}
          </div>

          {/* ── Details Grid ── */}
          <div className="space-y-4">
            {/* Identity & Contact Card */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-1.5">
                <UserIcon className="w-3.5 h-3.5 text-brand-600" />
                Contact & Account Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* First Name */}
                <div className="bg-gray-50/70 p-2.5 rounded-lg border border-gray-100">
                  <span className="text-gray-400 block text-[10px] font-bold uppercase">First Name</span>
                  <span className="font-semibold text-gray-800">{derivedFirst || "—"}</span>
                </div>

                {/* Last Name */}
                <div className="bg-gray-50/70 p-2.5 rounded-lg border border-gray-100">
                  <span className="text-gray-400 block text-[10px] font-bold uppercase">Last Name</span>
                  <span className="font-semibold text-gray-800">{derivedLast || "—"}</span>
                </div>

                {/* Email Address */}
                <div className="bg-gray-50/70 p-2.5 rounded-lg border border-gray-100 flex items-center justify-between">
                  <div className="min-w-0">
                    <span className="text-gray-400 block text-[10px] font-bold uppercase">Email Address</span>
                    <span className="font-semibold text-gray-800 truncate block">{user.email}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(user.email, "email")}
                    className="p-1 rounded hover:bg-gray-200 text-gray-400 hover:text-gray-700 transition-colors ml-2 flex-shrink-0 cursor-pointer"
                    title="Copy email"
                  >
                    {copiedKey === "email" ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                {/* Phone Number */}
                <div className="bg-gray-50/70 p-2.5 rounded-lg border border-gray-100 flex items-center justify-between">
                  <div className="min-w-0">
                    <span className="text-gray-400 block text-[10px] font-bold uppercase">Phone Number</span>
                    <span className="font-semibold text-gray-800 truncate block">
                      {user.phone || <span className="text-gray-400 italic font-normal">Not configured</span>}
                    </span>
                  </div>
                  {user.phone && (
                    <button
                      type="button"
                      onClick={() => copyToClipboard(user.phone || "", "phone")}
                      className="p-1 rounded hover:bg-gray-200 text-gray-400 hover:text-gray-700 transition-colors ml-2 flex-shrink-0 cursor-pointer"
                      title="Copy phone"
                    >
                      {copiedKey === "phone" ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}
                </div>

                {/* Internal User ID */}
                <div className="sm:col-span-2 bg-gray-50/70 p-2.5 rounded-lg border border-gray-100 flex items-center justify-between">
                  <div className="min-w-0">
                    <span className="text-gray-400 block text-[10px] font-bold uppercase flex items-center gap-1">
                      <Fingerprint className="w-3 h-3" /> System Identifier (UUID)
                    </span>
                    <code className="font-mono text-[11px] text-gray-700 truncate block">{user.id}</code>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(user.id, "id")}
                    className="p-1 rounded hover:bg-gray-200 text-gray-400 hover:text-gray-700 transition-colors ml-2 flex-shrink-0 cursor-pointer"
                    title="Copy User ID"
                  >
                    {copiedKey === "id" ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Role & Access Governance Card */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-purple-600" />
                  Role & UBAC Overrides
                </h3>

                <Link
                  href={`/admin/users/${encodeURIComponent(user.slug || user.id)}/permissions`}
                  className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 hover:underline"
                >
                  <span>Matrix</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>

              <div className="space-y-3 text-xs">
                {/* Role Details Banner */}
                <div className="bg-purple-50/50 border border-purple-100 rounded-lg p-3 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-purple-950 text-sm">{roleName}</span>
                      {user.role?.code && (
                        <code className="text-[10px] bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded font-mono">
                          {user.role.code}
                        </code>
                      )}
                    </div>
                    {user.role?.description ? (
                      <p className="text-[11px] text-purple-800/80 mt-0.5 leading-relaxed">
                        {user.role.description}
                      </p>
                    ) : (
                      <p className="text-[11px] text-purple-800/60 mt-0.5 italic">
                        Standard organizational role permissions apply.
                      </p>
                    )}
                  </div>
                </div>

                {/* UBAC Permissions Summary */}
                <div className="bg-gray-50/70 border border-gray-100 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-gray-700 flex items-center gap-1">
                      <KeyRound className="w-3.5 h-3.5 text-gray-500" />
                      Individual UBAC Overrides
                    </span>
                    <span className="text-[11px] text-gray-500">
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

                  {userPermissions.length > 0 ? (
                    <div className="flex items-center gap-2 mt-2">
                      {grantedOverrides.length > 0 && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-green-50 border border-green-200 text-green-700 text-[11px] font-bold">
                          +{grantedOverrides.length} Grants
                        </span>
                      )}
                      {revokedOverrides.length > 0 && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-red-50 border border-red-200 text-red-700 text-[11px] font-bold">
                          -{revokedOverrides.length} Revokes
                        </span>
                      )}
                    </div>
                  ) : (
                    <p className="text-[11px] text-gray-500 leading-relaxed">
                      No custom UBAC overrides assigned. This user strictly inherits permissions defined in the{" "}
                      <strong className="text-gray-700">{roleName}</strong> role.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Lifecycle & Timestamps Card */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-gray-500" />
                Audit & Activity Timestamps
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Registered / Created */}
                <div className="bg-gray-50/70 p-2.5 rounded-lg border border-gray-100">
                  <span className="text-gray-400 block text-[10px] font-bold uppercase flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Account Registered
                  </span>
                  <span className="font-semibold text-gray-800">
                    {user.createdAt ? new Date(user.createdAt).toLocaleString() : "—"}
                  </span>
                </div>

                {/* Last Updated */}
                <div className="bg-gray-50/70 p-2.5 rounded-lg border border-gray-100">
                  <span className="text-gray-400 block text-[10px] font-bold uppercase flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Last Profile Update
                  </span>
                  <span className="font-semibold text-gray-800">
                    {user.updatedAt ? new Date(user.updatedAt).toLocaleString() : "—"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Sticky Bottom Action Bar ── */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between gap-3">
          {/* Left Action: Delete / Restore */}
          <div>
            {isDeleted ? (
              <button
                type="button"
                onClick={() => onRestoreUser && onRestoreUser(user)}
                disabled={!canEdit}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-green-50 hover:bg-green-100 border border-green-200 text-green-700 text-xs font-bold transition-colors disabled:opacity-40 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Restore User
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onDeleteUser && onDeleteUser(user)}
                disabled={!canDelete}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-xs font-bold transition-colors disabled:opacity-40 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Soft-Delete
              </button>
            )}
          </div>

          {/* Right Actions: Edit, Permissions & Close */}
          <div className="flex items-center gap-2">
            <Link
              href={`/admin/users/${encodeURIComponent(user.slug || user.id)}/permissions`}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold transition-colors shadow-2xs"
            >
              <KeyRound className="w-3.5 h-3.5 text-gray-500" />
              Permissions
            </Link>

            <Link
              href={`/admin/users/${encodeURIComponent(user.slug || user.id)}/edit`}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-colors shadow-xs ${
                !canEdit ? "pointer-events-none opacity-40" : ""
              }`}
            >
              <Pencil className="w-3.5 h-3.5" />
              Edit Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
