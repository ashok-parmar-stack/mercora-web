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
      <div className="pt-4 border-t border-border flex flex-col gap-3 pb-6">
        <div className="p-3.5 rounded-2xl bg-surface border border-border shadow-xs flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-primary text-white flex items-center justify-center text-sm font-bold shrink-0 shadow-xs">
            {avatarInitials}
          </div>
          <div className="min-w-0 flex-1 text-left">
            <p className="text-sm font-bold text-text-primary truncate">
              {user?.name || "Authenticated User"}
            </p>
            <p className="text-xs text-text-muted truncate mt-0.5">
              {user?.email || ""}
            </p>
            <div className="mt-1.5 flex items-center gap-1.5">
              <Badge variant="brand" size="sm">
                {roleLabel}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button
            variant="primary"
            size="lg"
            className="w-full justify-center shadow-xs font-bold"
            asChild
          >
            <Link href={canAccessAdmin ? "/admin" : "/dashboard"} onClick={onClose}>
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>{canAccessAdmin ? "Open Admin Console" : "Open Dashboard"}</span>
            </Link>
          </Button>

          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="md"
              className="justify-center text-xs"
              asChild
            >
              <Link href={canAccessAdmin ? "/admin/profile" : "/profile"} onClick={onClose}>
                <Settings className="w-3.5 h-3.5 text-text-muted shrink-0" />
                <span>Settings</span>
              </Link>
            </Button>

            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={onLogout}
              className="justify-center text-xs text-destructive hover:bg-destructive/10 hover:border-destructive/30"
            >
              <LogOut className="w-3.5 h-3.5 shrink-0" />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-4 border-t border-border flex flex-col gap-3 pb-6">
      <div className="px-1 text-xs text-text-muted mb-0.5 text-left">
        Join verified B2B trade network:
      </div>
      <div className="flex flex-col gap-2.5">
        <Button
          variant="primary"
          size="lg"
          className="w-full justify-center shadow-xs font-bold"
          asChild
        >
          <Link href="/register" onClick={onClose}>
            <UserPlus className="w-4 h-4 shrink-0" />
            <span>Create Free Account</span>
          </Link>
        </Button>

        <Button
          variant="outline"
          size="md"
          className="w-full justify-center"
          asChild
        >
          <Link href="/login" onClick={onClose}>
            <LogIn className="w-4 h-4 shrink-0" />
            <span>Sign In</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
