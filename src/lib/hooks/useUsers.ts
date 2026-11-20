"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { User, CreateUserPayload, UpdateUserPayload } from "../admin-types";
import {
  fetchUsers,
  fetchUserByIdOrSlug,
  createUser,
  updateUser,
  deleteUser,
  restoreUser,
  fetchUserPermissions,
  setUserPermissionOverrides,
  removeUserPermissionOverride,
} from "../admin-api";
import { useUIStore } from "../store/ui-store";
import { isAbortError } from "../api-abort";

// Shared in-memory store so mutations persist across view transitions
let localUsersStore: User[] = [];

export function useUsers(params?: {
  roleId?: string;
  statusId?: string;
  includeDeleted?: boolean;
  search?: string;
}) {
  const [users, setUsers] = useState<User[]>(localUsersStore);
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
      const res: any = await fetchUsers(params, { signal: controller.signal });
      
      if (controller.signal.aborted) {
        return;
      }

      const list = Array.isArray(res) ? res : res?.data || [];
      localUsersStore = list;
      setUsers(list);
      setIsLoading(false);
    } catch (err: any) {
      // 4. Do not show error or update state if aborted
      if (isAbortError(err) || controller.signal.aborted) {
        return;
      }
      setUsers([...localUsersStore]);
      setIsLoading(false);
    } finally {
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
      }
    }
  }, [params?.roleId, params?.statusId, params?.includeDeleted, params?.search]);

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

  const create = async (payload: CreateUserPayload) => {
    const res = await createUser(payload);
    await load();
    return res.data || res;
  };

  const update = async (idOrSlug: string, payload: UpdateUserPayload) => {
    const cleanDto: any = {};
    if ((payload as any).name) cleanDto.name = (payload as any).name;
    else if (payload.firstName || payload.lastName) {
      cleanDto.name = [payload.firstName, payload.lastName].filter(Boolean).join(" ");
    }
    if (payload.slug) cleanDto.slug = payload.slug;
    if (payload.phone) cleanDto.phone = payload.phone;
    if (payload.roleId && typeof payload.roleId === "string" && payload.roleId.trim().length > 0) {
      cleanDto.roleId = payload.roleId;
    }
    if (payload.statusId && typeof payload.statusId === "string" && payload.statusId.trim().length > 0) {
      cleanDto.statusId = payload.statusId;
    }

    const res = await updateUser(idOrSlug, Object.keys(cleanDto).length > 0 ? cleanDto : payload);
    await load();
    return res.data || res;
  };

  const remove = async (idOrSlug: string, mode: "soft" | "hard" = "soft") => {
    await deleteUser(idOrSlug, mode);
    addToast("success", "User Deleted", mode === "hard" ? "User permanently removed." : "User moved to trash.");
    await load();
  };

  const restore = async (idOrSlug: string) => {
    await restoreUser(idOrSlug);
    addToast("success", "User Restored", "User reactivated successfully.");
    await load();
  };

  return {
    users,
    isLoading,
    error,
    refetch: load,
    createUser: create,
    updateUser: update,
    deleteUser: remove,
    restoreUser: restore,
  };
}

export function useUserDetails(idOrSlug: string) {
  const [user, setUser] = useState<User | null>(() => {
    return localUsersStore.find((u) => u.id === idOrSlug || u.slug === idOrSlug) || null;
  });
  const [permissionsInfo, setPermissionsInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const addToast = useUIStore((s) => s.addToast);

  const load = useCallback(async () => {
    if (!idOrSlug) return;
    setIsLoading(true);
    setError(null);
    try {
      const [userRes, permRes]: any[] = await Promise.all([
        fetchUserByIdOrSlug(idOrSlug),
        fetchUserPermissions(idOrSlug).catch(() => ({ data: {} })),
      ]);
      const foundUser = userRes.data || userRes;
      setUser(foundUser);
      setPermissionsInfo(permRes.data || permRes);
    } catch (err: any) {
      // Fallback to local store
      const local = localUsersStore.find((u) => u.id === idOrSlug || u.slug === idOrSlug);
      if (local) {
        setUser(local);
        setPermissionsInfo({ userPermissions: local.userPermissions || [] });
      } else {
        setError(err.message || "Failed to load user");
      }
    } finally {
      setIsLoading(false);
    }
  }, [idOrSlug]);

  useEffect(() => {
    load();
  }, [load]);

  const addOverride = async (override: {
    permissionActionId: string;
    effect: "GRANT" | "REVOKE";
    reason?: string;
  }) => {
    try {
      await setUserPermissionOverrides(idOrSlug, [override]);
      addToast("success", "Override Saved", "User permission override applied.");
      await load();
    } catch (err: any) {
      addToast("error", "Override Failed", err?.message || "Failed to save user permission override.");
      throw err;
    }
  };

  const removeOverride = async (permissionActionId: string) => {
    try {
      await removeUserPermissionOverride(idOrSlug, permissionActionId);
      addToast("success", "Override Removed", "User permission override removed.");
      await load();
    } catch (err: any) {
      addToast("error", "Removal Failed", err?.message || "Failed to remove user permission override.");
      throw err;
    }
  };

  return {
    user,
    permissionsInfo,
    isLoading,
    error,
    refetch: load,
    addOverride,
    removeOverride,
  };
}
