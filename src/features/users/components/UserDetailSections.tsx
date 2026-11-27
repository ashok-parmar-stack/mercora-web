"use client";

import React from "react";
import Link from "next/link";
import {
  Calendar,
  Check,
  Clock,
  Copy,
  ExternalLink,
  Shield,
  User as UserIcon,
} from "lucide-react";
import { formatLocalDateTime } from "@/lib/date";

interface UserDetailSectionsProps {
  user: any;
  derivedFirst: string;
  derivedLast: string;
  roleName: string;
  isDeleted: boolean;
  overrides: any[];
  grantedCount: number;
  revokedCount: number;
  copiedKey: string | null;
  onCopy: (text: string, key: string) => void;
}

export function UserDetailSections({
  user,
  derivedFirst,
  derivedLast,
  roleName,
  isDeleted,
  overrides,
  grantedCount,
  revokedCount,
  copiedKey,
  onCopy,
}: UserDetailSectionsProps) {
  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50/50 border border-gray-200 rounded-xl p-5 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
            <UserIcon className="w-4 h-4 text-brand-600" />
            Contact &amp; Identification
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
                  onClick={() => onCopy(user.email, "email")}
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
              <span className="font-bold text-gray-900">
                {user.phone || <span className="text-gray-400 font-normal italic">None</span>}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-500 font-medium">System UUID</span>
              <code className="font-mono text-[11px] text-gray-700 bg-white border border-gray-200 px-1.5 py-0.5 rounded">
                {user.id}
              </code>
            </div>
          </div>
        </div>

        <div className="bg-gray-50/50 border border-gray-200 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-purple-600" />
              Assigned Role &amp; UBAC Overrides
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
                {grantedCount > 0 && (
                  <span className="px-2 py-0.5 rounded bg-green-50 border border-green-200 text-green-700 text-[11px] font-bold">
                    +{grantedCount} Granted
                  </span>
                )}
                {revokedCount > 0 && (
                  <span className="px-2 py-0.5 rounded bg-red-50 border border-red-200 text-red-700 text-[11px] font-bold">
                    -{revokedCount} Revoked
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

      <div className="bg-gray-50/50 border border-gray-200 rounded-xl p-5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-gray-500" />
          Audit Timestamps &amp; Lifecycle
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="bg-white p-3 rounded-lg border border-gray-100">
            <span className="text-gray-400 block text-[10px] font-bold uppercase flex items-center gap-1">
              <Calendar className="w-3 h-3" /> Registered
            </span>
            <span className="font-semibold text-gray-800 mt-0.5 block">
              {formatLocalDateTime(user.createdAt)}
            </span>
          </div>

          <div className="bg-white p-3 rounded-lg border border-gray-100">
            <span className="text-gray-400 block text-[10px] font-bold uppercase flex items-center gap-1">
              <Clock className="w-3 h-3" /> Last Modified
            </span>
            <span className="font-semibold text-gray-800 mt-0.5 block">
              {formatLocalDateTime(user.updatedAt)}
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
  );
}
