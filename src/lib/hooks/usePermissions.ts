"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Permission, CreatePermissionPayload } from "../admin-types";
import {
  fetchPermissions,
  fetchPermissionByIdOrCode,
  createPermission,
  updatePermission,
  deletePermission,
  restorePermission,
} from "../admin-api";
import { useUIStore } from "../store/ui-store";
import { isAbortError } from "../api-abort";

export function usePermissions(params?: { statusId?: string; includeDeleted?: boolean }) {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const addToast = useUIStore((s) => s.addToast);

  const abortControllerRef = useRef<AbortController | null>(null);

  const load = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort('Canceled by subsequent request');
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);
    setError(null);
    try {
      const res: any = await fetchPermissions(params, { signal: controller.signal });
      if (controller.signal.aborted) {
        return;
      }
      const list = Array.isArray(res) ? res : res?.data || [];
      setPermissions(list);
      setIsLoading(false);
    } catch (err: any) {
      if (isAbortError(err) || controller.signal.aborted) {
        return;
      }
      setError(err.message || "Failed to load permissions");
      addToast("error", "Permissions Load Error", err.message);
      setIsLoading(false);
    } finally {
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
      }
    }
  }, [params?.statusId, params?.includeDeleted, addToast]);

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

  const create = async (payload: CreatePermissionPayload) => {
    try {
      const res = await createPermission(payload);
      addToast("success", "Permission Created", `Created module ${payload.name}`);
      await load();
      return res.data;
    } catch (err: any) {
      addToast("error", "Creation Failed", err.message);
      throw err;
    }
  };

  const update = async (idOrCode: string, payload: Partial<CreatePermissionPayload>) => {
    try {
      const res = await updatePermission(idOrCode, payload);
      addToast("success", "Permission Updated", "Permission details saved.");
      await load();
      return res.data;
    } catch (err: any) {
      addToast("error", "Update Failed", err.message);
      throw err;
    }
  };

  const remove = async (idOrCode: string, mode: "soft" | "hard" = "soft") => {
    try {
      await deletePermission(idOrCode, mode);
      addToast("success", "Permission Deleted", "Moved permission to trash.");
      await load();
    } catch (err: any) {
      addToast("error", "Delete Failed", err.message);
      throw err;
    }
  };

  const restore = async (idOrCode: string) => {
    try {
      await restorePermission(idOrCode);
      addToast("success", "Permission Restored", "Permission reactivated.");
      await load();
    } catch (err: any) {
      addToast("error", "Restore Failed", err.message);
      throw err;
    }
  };

  return {
    permissions,
    isLoading,
    error,
    refetch: load,
    createPermission: create,
    updatePermission: update,
    deletePermission: remove,
    restorePermission: restore,
  };
}

export function usePermissionDetails(idOrCode: string) {
  const [permission, setPermission] = useState<Permission | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const addToast = useUIStore((s) => s.addToast);

  const load = useCallback(async () => {
    if (!idOrCode) return;
    setIsLoading(true);
    setError(null);
    try {
      const res: any = await fetchPermissionByIdOrCode(idOrCode);
      setPermission(res.data || res);
    } catch (err: any) {
      setError(err.message || "Failed to load permission details");
      addToast("error", "Failed to load permission", err.message);
    } finally {
      setIsLoading(false);
    }
  }, [idOrCode, addToast]);

  useEffect(() => {
    load();
  }, [load]);

  return {
    permission,
    isLoading,
    error,
    refetch: load,
  };
}
