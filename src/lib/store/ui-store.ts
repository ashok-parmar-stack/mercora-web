import { create } from "zustand";

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info" | "warning";
  title: string;
  message?: string;
}

export interface Persona {
  roleCode: string;
  roleName: string;
  isSuperAdmin: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canManagePermissions: boolean;
}

interface UIStoreState {
  // Sidebar
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;

  // Multi-selection state by table key
  selectedRowIds: Record<string, string[]>;
  setSelectedRowIds: (tableKey: string, ids: string[]) => void;
  toggleRowSelection: (tableKey: string, id: string) => void;
  selectAllRows: (tableKey: string, allIds: string[]) => void;
  clearSelection: (tableKey: string) => void;

  // Active Role-wise Persona Simulation
  activePersona: Persona;
  setPersona: (roleCode: string, roleName?: string) => void;

  // Breadcrumbs
  customBreadcrumbs: { label: string; href?: string }[] | null;
  setBreadcrumbs: (crumbs: { label: string; href?: string }[] | null) => void;

  // Toasts
  toasts: ToastMessage[];
  addToast: (type: ToastMessage["type"], title: string, message?: string) => void;
  removeToast: (id: string) => void;
}

const DEFAULT_PERSONA: Persona = {
  roleCode: "SUPER_ADMIN",
  roleName: "Super Administrator",
  isSuperAdmin: true,
  canCreate: true,
  canEdit: true,
  canDelete: true,
  canManagePermissions: true,
};

export const useUIStore = create<UIStoreState>((set) => ({
  isSidebarCollapsed: false,
  toggleSidebar: () => set((s) => ({ isSidebarCollapsed: !s.isSidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ isSidebarCollapsed: collapsed }),

  selectedRowIds: {},
  setSelectedRowIds: (tableKey, ids) =>
    set((s) => ({
      selectedRowIds: { ...s.selectedRowIds, [tableKey]: ids },
    })),
  toggleRowSelection: (tableKey, id) =>
    set((s) => {
      const current = s.selectedRowIds[tableKey] || [];
      const updated = current.includes(id)
        ? current.filter((x) => x !== id)
        : [...current, id];
      return {
        selectedRowIds: { ...s.selectedRowIds, [tableKey]: updated },
      };
    }),
  selectAllRows: (tableKey, allIds) =>
    set((s) => {
      const current = s.selectedRowIds[tableKey] || [];
      const allSelected = allIds.length > 0 && current.length === allIds.length;
      return {
        selectedRowIds: {
          ...s.selectedRowIds,
          [tableKey]: allSelected ? [] : allIds,
        },
      };
    }),
  clearSelection: (tableKey) =>
    set((s) => ({
      selectedRowIds: { ...s.selectedRowIds, [tableKey]: [] },
    })),

  activePersona: DEFAULT_PERSONA,
  setPersona: (roleCode, roleName) => {
    const code = roleCode.toUpperCase();
    const isSuperAdmin = code === "SUPER_ADMIN" || code === "ADMIN";
    const isCompanyAdmin = code === "COMPANY_ADMIN";

    set({
      activePersona: {
        roleCode: code,
        roleName: roleName || roleCode,
        isSuperAdmin,
        canCreate: isSuperAdmin || isCompanyAdmin,
        canEdit: isSuperAdmin || isCompanyAdmin,
        canDelete: isSuperAdmin,
        canManagePermissions: isSuperAdmin,
      },
    });
  },

  customBreadcrumbs: null,
  setBreadcrumbs: (crumbs) => set({ customBreadcrumbs: crumbs }),

  toasts: [],
  addToast: (type, title, message) => {
    const id = Math.random().toString(36).substring(2, 9);
    set((s) => ({
      toasts: [...s.toasts, { id, type, title, message }],
    }));
    setTimeout(() => {
      set((s) => ({
        toasts: s.toasts.filter((t) => t.id !== id),
      }));
    }, 4500);
  },
  removeToast: (id) =>
    set((s) => ({
      toasts: s.toasts.filter((t) => t.id !== id),
    })),
}));
