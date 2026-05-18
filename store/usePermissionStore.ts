import { create } from "zustand";
import { policy } from "../services/policy";
import { PolicyCatalogItem, PolicyName } from "../services/policy/types";
import { tenantUser } from "../services/tenant-user";
import { tenantPermission } from "../services/tenant-permission";
import { useAppStore } from "./useAppStore";

// Maps each page (PolicyName) to the action(s) that grant access.
// A user can see a page if they have at least one of the listed actions.
// If a page is not in this map, it requires SuperAdminOnly or explicit action check.
const PAGE_ACTION_MAP: Partial<Record<PolicyName, string[]>> = {
  SearchTransactionHistory: ["SearchTransactionHistory"],
  SearchBankStatement: ["SearchBankStatement"],
  SearchNetBalance: ["SearchNetBalance"],
  Settlement: ["Settlement"],
  CreatePayAgent: ["CreatePayAgent"],
  ListUsers: ["ListUsers"],
  ListPolicies: ["ListPolicies"],
  ReloadPolicies: ["ReloadPolicies"],
};

interface PermissionState {
  policies: PolicyCatalogItem[];
  userActions: string[];
  userActionsByTenant: Record<string, string[]>;
  isLoading: boolean;
  error: string | null;

  fetchPolicies: () => Promise<void>;
  fetchUserPermissions: () => Promise<void>;
  hasAction: (action: string) => boolean;
  hasActionInTenant: (action: string, tenantId: string) => boolean;
  hasPermission: (name: PolicyName) => boolean;
  isSuperAdminOnly: (name: PolicyName) => boolean;
  canSeePage: (name: PolicyName) => boolean;
}

export const usePermissionStore = create<PermissionState>()((set, get) => ({
  policies: [],
  userActions: [],
  userActionsByTenant: {},
  isLoading: false,
  error: null,

  fetchPolicies: async () => {
    set({ isLoading: true, error: null });
    try {
      const policies = await policy.list();
      set({ policies: policies ?? [], isLoading: false });
    } catch (err) {
      set({ error: String(err), isLoading: false });
    }
  },

  fetchUserPermissions: async () => {
    const { user, isSuperAdmin } = useAppStore.getState();

    // SuperAdmin bypasses permission checks entirely
    if (isSuperAdmin) {
      set({ userActions: [], userActionsByTenant: {} });
      return;
    }

    if (!user) {
      set({ userActions: [], userActionsByTenant: {} });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      // Step 1: Get the current user's TenantUser records
      const tenantUsers = await tenantUser.list({ user_id: user.id });
      const roleIds = tenantUsers.map((tu) => tu.TenantRoleID);

      if (roleIds.length === 0) {
        set({ userActions: [], userActionsByTenant: {}, isLoading: false });
        return;
      }

      // Step 2: Get all permission assignments, filter to user's roles
      const allPermissions = await tenantPermission.list();
      const userPerms = allPermissions.filter((p) => roleIds.includes(p.RoleID));
      const actions = userPerms.map((p) => p.Action);
      const uniqueActions = Array.from(new Set(actions));

      // Build tenant-scoped action map: TenantID → actions available in that tenant
      const actionsByTenant: Record<string, string[]> = {};
      for (const tu of tenantUsers) {
        const tenantPerms = userPerms.filter((p) => p.RoleID === tu.TenantRoleID);
        const tenantActions = Array.from(new Set(tenantPerms.map((p) => p.Action)));
        if (actionsByTenant[tu.TenantID]) {
          actionsByTenant[tu.TenantID] = Array.from(new Set([...actionsByTenant[tu.TenantID], ...tenantActions]));
        } else {
          actionsByTenant[tu.TenantID] = tenantActions;
        }
      }

      set({ userActions: uniqueActions, userActionsByTenant: actionsByTenant, isLoading: false });
    } catch (err) {
      set({ error: String(err), isLoading: false });
    }
  },

  hasAction: (action: string) => {
    if (useAppStore.getState().isSuperAdmin) return true;
    return get().userActions.includes(action);
  },

  hasActionInTenant: (action: string, tenantId: string) => {
    if (useAppStore.getState().isSuperAdmin) return true;
    const tenantActions = get().userActionsByTenant[tenantId] ?? [];
    return tenantActions.includes(action);
  },

  hasPermission: (name: PolicyName) => {
    const policies = get().policies ?? [];
    const policyItem = policies.find((p) => p.Name === name);
    if (!policyItem) return false;

    if (policyItem.SuperAdminOnly) {
      return useAppStore.getState().isSuperAdmin;
    }
    return true;
  },

  isSuperAdminOnly: (name: PolicyName) => {
    const policies = get().policies ?? [];
    const policyItem = policies.find((p) => p.Name === name);
    return policyItem?.SuperAdminOnly ?? false;
  },

  canSeePage: (name: PolicyName) => {
    if (useAppStore.getState().isSuperAdmin) return true;
    const policies = get().policies ?? [];
    const policyItem = policies.find((p) => p.Name === name);
    // SuperAdminOnly policies are only visible to SuperAdmin
    if (policyItem?.SuperAdminOnly) return false;
    // For non-SuperAdmin pages, require at least one of the mapped actions
    const requiredActions = PAGE_ACTION_MAP[name];
    if (requiredActions) {
      return get().userActions.some((a) => requiredActions.includes(a));
    }
    // Pages not in the map require SuperAdmin by default
    return false;
  },
}));