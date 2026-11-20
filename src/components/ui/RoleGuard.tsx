"use client";

import React from "react";
import { useRole } from "./RoleContext";

export interface RoleGuardProps {
  children: React.ReactNode;
  requiredRole?: string | string[];
  requireSuperAdmin?: boolean;
  requireCanManageRoles?: boolean;
  requireCanManagePermissions?: boolean;
  requireCanDeleteUsers?: boolean;
  fallback?: React.ReactNode;
  disableInsteadOfHide?: boolean;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  requiredRole,
  requireSuperAdmin,
  requireCanManageRoles,
  requireCanManagePermissions,
  requireCanDeleteUsers,
  fallback = null,
  disableInsteadOfHide = false,
}) => {
  const { activePersona } = useRole();

  let hasAccess = true;

  if (requireSuperAdmin && !activePersona.isSuperAdmin) {
    hasAccess = false;
  }

  if (requireCanManageRoles && !activePersona.canManageRoles) {
    hasAccess = false;
  }

  if (requireCanManagePermissions && !activePersona.canManagePermissions) {
    hasAccess = false;
  }

  if (requireCanDeleteUsers && !activePersona.canDeleteUsers) {
    hasAccess = false;
  }

  if (requiredRole) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (!roles.includes(activePersona.roleCode)) {
      hasAccess = false;
    }
  }

  if (hasAccess) {
    return <>{children}</>;
  }

  if (disableInsteadOfHide) {
    return (
      <div className="relative group inline-block">
        <div className="opacity-40 pointer-events-none cursor-not-allowed select-none">
          {children}
        </div>
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block bg-gray-900 text-white text-[11px] font-medium px-2.5 py-1 rounded shadow-lg whitespace-nowrap z-30">
          Requires elevated role ({activePersona.roleCode} restricted)
        </div>
      </div>
    );
  }

  return <>{fallback}</>;
};
