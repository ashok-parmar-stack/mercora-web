"use client";

import { useState, useEffect, useCallback } from "react";
import { Role, User, Permission, PermissionAction, Status } from "../admin-types";
import {
  fetchRoles,
  createRole,
  updateRole,
  deleteRole,
  restoreRole,
  fetchRolePermissions,
  updateRolePermissions,
  fetchPermissions,
  fetchStatuses,
} from "../admin-api";

export interface ToastItem {
  id: string;
  type: "success" | "error" | "info" | "warning";
  title: string;
  message?: string;
}

export interface PersonaState {
  roleCode: string;
  roleName: string;
  isSuperAdmin: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canManagePermissions: boolean;
}

// Global in-memory reactive store listeners for Next.js client components
type Listener = () => void;

interface StoreState {
  // Roles
  roles: Role[];
  selectedRole: Role | null;
  rolePermissions: PermissionAction[];
  isRolesLoading: boolean;
  roleError: string | null;

  // Permissions & Statuses catalog
  permissions: Permission[];
  statuses: Status[];
  isCatalogLoading: boolean;

  // Modals
  isCreateRoleOpen: boolean;
  isEditRoleOpen: boolean;
  isPermissionMatrixOpen: boolean;
  isDeleteConfirmOpen: boolean;
  roleToDelete: Role | null;
  deleteMode: "soft" | "hard";

  // Filter & Search
  roleSearch: string;
  roleStatusFilter: string;
  includeDeletedRoles: boolean;

  // Persona / Role-wise access simulation
  persona: PersonaState;

  // Toasts
  toasts: ToastItem[];
}

let state: StoreState = {
  roles: [],
  selectedRole: null,
  rolePermissions: [],
  isRolesLoading: false,
  roleError: null,

  permissions: [],
  statuses: [],
  isCatalogLoading: false,

  isCreateRoleOpen: false,
  isEditRoleOpen: false,
  isPermissionMatrixOpen: false,
  isDeleteConfirmOpen: false,
  roleToDelete: null,
  deleteMode: "soft",

  roleSearch: "",
  roleStatusFilter: "ALL",
  includeDeletedRoles: false,

  persona: {
    roleCode: "SUPER_ADMIN",
    roleName: "Super Administrator",
    isSuperAdmin: true,
    canCreate: true,
    canEdit: true,
    canDelete: true,
    canManagePermissions: true,
  },

  toasts: [],
};

const listeners = new Set<Listener>();

function emitChange() {
  listeners.forEach((listener) => {
    listener();
  });
}

export const adminStore = {
  getState: () => state,

  setState: (updater: Partial<StoreState> | ((prev: StoreState) => Partial<StoreState>)) => {
    const next = typeof updater === "function" ? updater(state) : updater;
    state = { ...state, ...next };
    emitChange();
  },

  // Toast dispatch
  addToast: (type: ToastItem["type"], title: string, message?: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    const toast: ToastItem = { id, type, title, message };
    state = { ...state, toasts: [...state.toasts, toast] };
    emitChange();

    setTimeout(() => {
      adminStore.removeToast(id);
    }, 4500);
  },

  removeToast: (id: string) => {
    state = { ...state, toasts: state.toasts.filter((t) => t.id !== id) };
    emitChange();
  },

  // Persona management (User vs Admin role-wise view switch)
  setPersonaRole: (roleCode: string, roleName?: string) => {
    const code = roleCode.toUpperCase();
    const isSuperAdmin = code === "SUPER_ADMIN" || code === "ADMIN";
    const isCompanyAdmin = code === "COMPANY_ADMIN";

    state = {
      ...state,
      persona: {
        roleCode: code,
        roleName: roleName || roleCode,
        isSuperAdmin,
        canCreate: isSuperAdmin || isCompanyAdmin,
        canEdit: isSuperAdmin || isCompanyAdmin,
        canDelete: isSuperAdmin,
        canManagePermissions: isSuperAdmin,
      },
    };
    emitChange();
  },

  // Async Actions for Roles
  loadRoles: async () => {
    state = { ...state, isRolesLoading: true, roleError: null };
    emitChange();
    try {
      const res: any = await fetchRoles({
        statusId: state.roleStatusFilter !== "ALL" ? state.roleStatusFilter : undefined,
        includeDeleted: state.includeDeletedRoles,
      });
      const rolesList = Array.isArray(res) ? res : res?.data || [];
      state = { ...state, roles: rolesList, isRolesLoading: false };
    } catch (err: any) {
      state = { ...state, isRolesLoading: false, roleError: err.message };
      adminStore.addToast("error", "Failed to load roles", err.message);
    }
    emitChange();
  },

  loadCatalog: async () => {
    state = { ...state, isCatalogLoading: true };
    emitChange();
    try {
      const [permRes, statusRes]: any[] = await Promise.all([
        fetchPermissions({ includeDeleted: false }),
        fetchStatuses(),
      ]);
      const permList = Array.isArray(permRes) ? permRes : permRes?.data || [];
      const statusList = Array.isArray(statusRes) ? statusRes : statusRes?.data || [];
      state = {
        ...state,
        permissions: permList,
        statuses: statusList,
        isCatalogLoading: false,
      };
    } catch (err: any) {
      state = { ...state, isCatalogLoading: false };
      adminStore.addToast("error", "Catalog load error", err.message);
    }
    emitChange();
  },

  handleCreateRole: async (payload: { code: string; name: string; description?: string; priority?: number }) => {
    try {
      await createRole(payload);
      adminStore.addToast("success", "Role Created", `Successfully created role ${payload.name}`);
      state = { ...state, isCreateRoleOpen: false };
      emitChange();
      await adminStore.loadRoles();
    } catch (err: any) {
      adminStore.addToast("error", "Failed to create role", err.message);
    }
  },

  handleUpdateRole: async (idOrCode: string, payload: { code?: string; name?: string; description?: string; priority?: number; statusId?: string }) => {
    try {
      await updateRole(idOrCode, payload);
      adminStore.addToast("success", "Role Updated", `Role updated successfully.`);
      state = { ...state, isEditRoleOpen: false, selectedRole: null };
      emitChange();
      await adminStore.loadRoles();
    } catch (err: any) {
      adminStore.addToast("error", "Failed to update role", err.message);
    }
  },

  handleDeleteRole: async () => {
    if (!state.roleToDelete) return;
    const { id, code, name } = state.roleToDelete;
    const mode = state.deleteMode;
    try {
      await deleteRole(code || id, mode);
      adminStore.addToast(
        "success",
        mode === "soft" ? "Role Soft-Deleted" : "Role Permanently Deleted",
        `Role "${name}" was moved to trash.`
      );
      state = { ...state, isDeleteConfirmOpen: false, roleToDelete: null };
      emitChange();
      await adminStore.loadRoles();
    } catch (err: any) {
      adminStore.addToast("error", "Failed to delete role", err.message);
    }
  },

  handleRestoreRole: async (role: Role) => {
    try {
      await restoreRole(role.code || role.id);
      adminStore.addToast("success", "Role Restored", `Role "${role.name}" was restored to ACTIVE status.`);
      await adminStore.loadRoles();
    } catch (err: any) {
      adminStore.addToast("error", "Failed to restore role", err.message);
    }
  },

  openPermissionMatrix: async (role: Role) => {
    state = { ...state, selectedRole: role, isPermissionMatrixOpen: true, rolePermissions: [] };
    emitChange();
    try {
      const res: any = await fetchRolePermissions(role.code || role.id);
      const permActions = Array.isArray(res) ? res : res?.data || [];
      state = { ...state, rolePermissions: permActions };
      emitChange();
    } catch (err: any) {
      adminStore.addToast("error", "Failed to load role permissions", err.message);
    }
  },

  handleSaveRolePermissions: async (permissionActionIds: string[]) => {
    if (!state.selectedRole) return;
    try {
      await updateRolePermissions(state.selectedRole.code || state.selectedRole.id, permissionActionIds);
      adminStore.addToast("success", "Permissions Updated", `Permissions synchronized for role ${state.selectedRole.name}`);
      state = { ...state, isPermissionMatrixOpen: false, selectedRole: null };
      emitChange();
      await adminStore.loadRoles();
    } catch (err: any) {
      adminStore.addToast("error", "Failed to update permissions", err.message);
    }
  },
};

// React hook for consuming state in Next.js components
export function useAdminStore() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const handleStoreChange = () => setTick((t) => t + 1);
    listeners.add(handleStoreChange);
    return () => {
      listeners.delete(handleStoreChange);
    };
  }, []);

  return {
    state,
    ...adminStore,
  };
}
