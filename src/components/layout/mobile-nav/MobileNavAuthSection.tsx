"use client";

import React from "react";
import Link from "next/link";
import {
  LogIn,
  UserPlus,
  ShieldCheck,
  LogOut,
  Settings,
} from "lucide-react";
import { Badge, Button } from "@/components/common";
import { isAdminRole } from "@/lib/auth-helpers";

interface MobileNavAuthSectionProps {
  isAuth: boolean;
  user: any;
  avatarInitials: string;
  roleLabel: string;
  onClose: () => void;
  onLogout: () => void;
}

export function MobileNavAuthSection({
  isAuth,
  user,
  avatarInitials,
  roleLabel,
  onClose,
  onLogout,
}: MobileNavAuthSectionProps) {
  if (isAuth) {
    const canAccessAdmin = isAdminRole(user);
    return (
      <div className="flex flex-col gap-3">
        {/* User Identity Card */}
        <div className="rounded-2xl border border-border bg-surface shadow-2xs overflow-hidden">
          <div className="px-4 py-3.5 flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-primary text-white flex items-center justify-center text-sm font-bold shrink-0 shadow-xs">
              {avatarInitials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-bold text-text-primary truncate">
                  {user?.name || "Authenticated User"}
                </p>
                <Badge variant="brand" size="sm">
                  {roleLabel}
                </Badge>
              </div>
              <p className="text-xs text-text-muted truncate mt-0.5">
                {user?.email || ""}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2.5">
          <Button
            variant="primary"
            size="lg"
            className="w-full justify-center shadow-xs font-semibold"
            leftIcon={<ShieldCheck className="w-4 h-4 shrink-0" />}
            asChild
          >
            <Link href={canAccessAdmin ? "/admin" : "/dashboard"} onClick={onClose}>
              {canAccessAdmin ? "Open Admin Console" : "Open Dashboard"}
            </Link>
          </Button>

          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="md"
              className="h-10 justify-center"
              leftIcon={<Settings className="w-4 h-4 text-text-muted shrink-0" />}
              asChild
            >
              <Link href={canAccessAdmin ? "/admin/profile" : "/profile"} onClick={onClose}>
                Settings
              </Link>
            </Button>

            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={onLogout}
              leftIcon={<LogOut className="w-4 h-4 shrink-0" />}
              className="h-10 justify-center text-destructive hover:bg-destructive/10 hover:border-destructive/30"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="px-1 text-xs text-text-muted">
        Join Mercora's verified B2B trade network:
      </div>
      <div className="flex flex-col gap-2">
        <Button
          variant="primary"
          size="lg"
          className="w-full justify-center shadow-xs font-semibold"
          leftIcon={<UserPlus className="w-4 h-4 shrink-0" />}
          asChild
        >
          <Link href="/register" onClick={onClose}>
            Create Free Account
          </Link>
        </Button>

        <Button
          variant="outline"
          size="lg"
          className="w-full justify-center"
          leftIcon={<LogIn className="w-4 h-4 shrink-0" />}
          asChild
        >
          <Link href="/login" onClick={onClose}>
            Sign In
          </Link>
        </Button>
      </div>
    </div>
  );
}
