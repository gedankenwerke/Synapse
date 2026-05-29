import httpClient from "@/libs/axios";
import { TenantPermission, TenantPermissionCreateRequest, TenantPermissionDeleteRequest } from "./types";
import { ResponseWrapper } from "@/types/response";

// Backend returns PascalCase
interface RawTenantPermission {
  ID: string;
  RoleID: string;
  Action: string;
  CreatedAt: string;
  UpdatedAt: string;
}

/** Map PascalCase backend permission → camelCase frontend TenantPermission */
function normalizeTenantPermission(raw: RawTenantPermission): TenantPermission {
  return {
    id: raw.ID,
    roleID: raw.RoleID,
    action: raw.Action,
    createdAt: raw.CreatedAt,
    updatedAt: raw.UpdatedAt,
  };
}

export const tenantPermission = {
  /** Fetch permissions for a specific role.
   *  NOTE: The permissions endpoint may return 404 if not implemented on the backend.
   *  Returns empty array on failure so the app doesn't crash.
   */
  listByRole: async (roleId: string): Promise<TenantPermission[]> => {
    try {
      const response = await httpClient.get<ResponseWrapper<RawTenantPermission[]>>(
        `/api/v1/tenant-roles/${roleId}/permissions`
      );
      const data = (response as unknown as ResponseWrapper<RawTenantPermission[]>).data;
      return Array.isArray(data) ? data.map(normalizeTenantPermission) : [];
    } catch {
      // Gracefully handle 404 or other errors — permissions endpoint may not exist
      console.warn(`[tenantPermission] Failed to fetch permissions for role ${roleId}`);
      return [];
    }
  },

  create: async (roleId: string, payload: TenantPermissionCreateRequest): Promise<TenantPermission[]> => {
    const response = await httpClient.post<ResponseWrapper<RawTenantPermission[]>>(
      `/api/v1/tenant-roles/${roleId}/permissions`,
      payload
    );
    const data = (response as unknown as ResponseWrapper<RawTenantPermission[]>).data;
    return Array.isArray(data) ? data.map(normalizeTenantPermission) : [];
  },

  remove: async (roleId: string, payload: TenantPermissionDeleteRequest): Promise<void> => {
    await httpClient.delete(`/api/v1/tenant-roles/${roleId}/permissions`, { data: payload });
  },
};