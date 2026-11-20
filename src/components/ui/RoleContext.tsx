"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Role, User } from "@/lib/admin-types";

export interface ActivePersona {
  roleCode: string;
  roleName: string;
  userEmail: string;
  userSlug: string;
  isSuperAdmin: boolean;
  canManageRoles: boolean;
  canManagePermissions: boolean;
  canDeleteUsers: boolean;
  canManageOverrides: boolean;
}

const DEFAULT_PERSONA: ActivePersona = {
  roleCode: "SUPER_ADMIN",
  roleName: "Super Administrator",
  userEmail: "admin@mercora.com",
  userSlug: "super-admin",
  isSuperAdmin: true,
  canManageRoles: true,
  canManagePermissions: true,
  canDeleteUsers: true,
  canManageOverrides: true,
};

interface RoleContextType {
  activePersona: ActivePersona;
  setActiveRole: (roleCode: string, roles: Role[]) => void;
  setActiveUserPersona: (user: User, roles: Role[]) => void;
  resetToSuperAdmin: () => void;
}

const RoleContext = createContext<RoleContextType>({
  activePersona: DEFAULT_PERSONA,
  setActiveRole: () => {},
  setActiveUserPersona: () => {},
  resetToSuperAdmin: () => {},
});

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activePersona, setActivePersona] = useState<ActivePersona>(DEFAULT_PERSONA);

  const calculatePermissions = (roleCode: string, roleName?: string, userEmail?: string, userSlug?: string): ActivePersona => {
    const isSuperAdmin = roleCode.toUpperCase() === "SUPER_ADMIN" || roleCode.toUpperCase() === "ADMIN";
    const isCompanyAdmin = roleCode.toUpperCase() === "COMPANY_ADMIN";
    const isStaff = roleCode.toUpperCase() === "STAFF" || roleCode.toUpperCase() === "OPERATOR";

    return {
      roleCode: roleCode.toUpperCase(),
      roleName: roleName || roleCode,
      userEmail: userEmail || `${roleCode.toLowerCase()}@mercora.com`,
      userSlug: userSlug || roleCode.toLowerCase().replace(/_/g, "-"),
      isSuperAdmin,
      canManageRoles: isSuperAdmin,
      canManagePermissions: isSuperAdmin,
      canDeleteUsers: isSuperAdmin || isCompanyAdmin,
      canManageOverrides: isSuperAdmin,
    };
  };

  const setActiveRole = (roleCode: string, roles: Role[]) => {
    const foundRole = roles.find((r) => r.code === roleCode || r.id === roleCode);
    const persona = calculatePermissions(
      foundRole?.code || roleCode,
      foundRole?.name || roleCode
    );
    setActivePersona(persona);
  };

  const setActiveUserPersona = (user: User, roles: Role[]) => {
    const roleObj = user.role || roles.find((r) => r.id === user.roleId);
    const roleCode = roleObj?.code || "BUYER";
    const persona = calculatePermissions(
      roleCode,
      roleObj?.name || roleCode,
      user.email,
      user.slug
    );
    setActivePersona(persona);
  };

  const resetToSuperAdmin = () => {
    setActivePersona(DEFAULT_PERSONA);
  };

  return (
    <RoleContext.Provider value={{ activePersona, setActiveRole, setActiveUserPersona, resetToSuperAdmin }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => useContext(RoleContext);
