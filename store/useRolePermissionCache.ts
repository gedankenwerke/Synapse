import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { TenantPermission } from "@/services/tenant-permission/types";

/**
 * Role Permission Cache
 *
 * Problem: The API has no GET endpoint for reading a role's assigned permissions.
 * Non-superadmin users get 403 on /policies, /tenant-roles, /tenant-permissions.
 *
 * Solution: Cache role→actions mappings from multiple sources:
 * 1. When superadmin assigns/deassigns permissions via the UI
 * 2. When any user fetches /tenant-permissions (seeds all role-permission pairs)
 *
 * Cache miss → empty actions (safer than granting everything).
 * The backend enforces real permissions on every API call regardless.
 */

interface RolePermissionCacheState {
  /** Map of role ID → array of action strings */
  cache: Record<string, string[]>;

  /** Set actions for a specific role ID */
  setRoleActions: (roleId: string, actions: string[]) => void;

  /** Get actions for a specific role ID (returns [] if not cached) */
  getRoleActions: (roleId: string) => string[];

  /** Get actions for multiple role IDs (union of all) */
  getActionsForRoles: (roleIds: string[]) => string[];

  /** Seed the cache from a list of TenantPermission records (merges with existing) */
  seedFromPermissions: (permissions: TenantPermission[]) => void;

  /** Clear the entire cache */
  clearCache: () => void;
}

export const useRolePermissionCache = create<RolePermissionCacheState>()(
  persist(
    (set, get) => ({
      cache: {},

      setRoleActions: (roleId, actions) =>
        set((state) => ({
          cache: { ...state.cache, [roleId]: actions },
        })),

      getRoleActions: (roleId) => get().cache[roleId] ?? [],

      getActionsForRoles: (roleIds) => {
        const { cache } = get();
        const allActions = new Set<string>();
        for (const roleId of roleIds) {
          const actions = cache[roleId];
          if (actions) {
            for (const action of actions) {
              allActions.add(action);
            }
          }
        }
        return Array.from(allActions);
      },

      seedFromPermissions: (permissions) =>
        set((state) => {
          const newCache = { ...state.cache };
          for (const perm of permissions) {
            if (!newCache[perm.RoleID]) {
              newCache[perm.RoleID] = [];
            }
            if (!newCache[perm.RoleID].includes(perm.Action)) {
              newCache[perm.RoleID] = [...newCache[perm.RoleID], perm.Action];
            }
          }
          return { cache: newCache };
        }),

      clearCache: () => set({ cache: {} }),
    }),
    {
      name: "role-permission-cache",
    }
  )
);