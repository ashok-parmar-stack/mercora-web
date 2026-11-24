"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Role, PermissionAction, CreateRolePayload, UpdateRolePayload } from "../admin-types";
import {
  fetchRoles,
  fetchRoleByIdOrCode,
  createRole,
  updateRole,
  deleteRole,
  restoreRole,
  fetchRolePermissions,
  updateRolePermissions,
  RoleQueryParams,
} from "../admin-api";
import { useUIStore } from "../store/ui-store";
import { isAbortError } from "../api-abort";

export function useRoles(params?: RoleQueryParams) {
  const [roles, setRoles] = useState<Role[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(params?.page || 1);
  const [limit, setLimit] = useState<number>(params?.limit || 10);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const addToast = useUIStore((s) => s.addToast);

  const abortControllerRef = useRef<AbortController | null>(null);

  const load = useCallback(async () => {
    // 1. Abort previous in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort('Canceled by subsequent request');
    }

    // 2. Create new AbortController
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);
    setError(null);
    try {
      // 3. Send request with signal
      const res: any = await fetchRoles(params, { signal: controller.signal });
      if (controller.signal.aborted) {
        return;
      }

      if (Array.isArray(res)) {
        setRoles(res);
        setTotal(res.length);
        setPage(params?.page || 1);
        setLimit(params?.limit || res.length || 10);
        setTotalPages(1);
      } else if (res && typeof res === 'object') {
        const list = Array.isArray(res.items) ? res.items : Array.isArray(res.data) ? res.data : [];
        setRoles(list);
        setTotal(typeof res.total === 'number' ? res.total : list.length);
        setPage(typeof res.page === 'number' ? res.page : (params?.page || 1));
        setLimit(typeof res.limit === 'number' ? res.limit : (params?.limit || 10));
        setTotalPages(typeof res.totalPages === 'number' ? res.totalPages : 1);
      } else {
        setRoles([]);
        setTotal(0);
      }
      setIsLoading(false);
    } catch (err: any) {
      // 4. Do not show error or update state if aborted
      if (isAbortError(err) || controller.signal.aborted) {
        return;
      }
      setError(err?.response?.data?.message || err?.message || 'Failed to load roles');
      setIsLoading(false);
    } finally {
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
      }
    }
  }, [
    params?.statusId,
    params?.includeDeleted,
    params?.search,
    params?.sortBy,
    params?.sortOrder,
    params?.page,
    params?.limit,
  ]);

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort('Component unmounted');
        abortControllerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const create = async (payload: CreateRolePayload) => {
    try {
      const res = await createRole(payload);
      addToast("success", "Role Created", `Successfully created role ${payload.name}`);
      await load();
      return res.data;
    } catch (err: any) {
      addToast("error", "Create Failed", err?.response?.data?.message || err?.message || "Failed to create role.");
      throw err;
    }
  };

  const update = async (idOrCode: string, payload: UpdateRolePayload) => {
    try {
      const res = await updateRole(idOrCode, payload);
      addToast("success", "Role Updated", "Role updated successfully.");
      await load();
      return res.data;
    } catch (err: any) {
      addToast("error", "Update Failed", err?.response?.data?.message || err?.message || "Failed to update role.");
      throw err;
    }
  };

  const remove = async (idOrCode: string, mode: "soft" | "hard" = "soft") => {
    try {
      await deleteRole(idOrCode, mode);
      addToast("success", "Role Deleted", mode === "soft" ? "Role moved to trash." : "Role permanently deleted.");
      await load();
    } catch (err: any) {
      addToast("error", "Delete Failed", err?.response?.data?.message || err?.message || "Failed to delete role.");
      throw err;
    }
  };

  const restore = async (idOrCode: string) => {
    try {
      await restoreRole(idOrCode);
      addToast("success", "Role Restored", "Role reactivated successfully.");
      await load();
    } catch (err: any) {
      addToast("error", "Restore Failed", err?.response?.data?.message || err?.message || "Failed to restore role.");
      throw err;
    }
  };

  return {
    roles,
    total,
    page,
    limit,
    totalPages,
    isLoading,
    error,
    refetch: load,
    createRole: create,
    updateRole: update,
    deleteRole: remove,
    restoreRole: restore,
  };
}

export function useRoleDetails(idOrCode: string) {
  const [role, setRole] = useState<Role | null>(null);
  const [assignedPermissions, setAssignedPermissions] = useState<PermissionAction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!idOrCode) return;
    setIsLoading(true);
    setError(null);
    try {
      const [roleRes, permRes]: any[] = await Promise.all([
        fetchRoleByIdOrCode(idOrCode),
        fetchRolePermissions(idOrCode).catch(() => ({ data: [] })),
      ]);
      setRole(roleRes.data || roleRes);
      setAssignedPermissions(Array.isArray(permRes) ? permRes : permRes?.data || []);
    } catch (err: any) {
      setError(err.message || "Failed to load role details");
    } finally {
      setIsLoading(false);
    }
  }, [idOrCode]);

  useEffect(() => {
    load();
  }, [load]);

  const savePermissions = async (permissionActionIds: string[]) => {
    // optimistic
  };

  return {
    role,
    assignedPermissions,
    isLoading,
    error,
    refetch: load,
    savePermissions,
  };
}
