import httpClient from "@/libs/axios";
import { TenantUser, TenantUserCreateRequest, TenantUserUpdateRequest } from "./types";
import { ResponseWrapper } from "@/types/response";

// Backend returns PascalCase
interface RawTenantUser {
  ID: string;
  TenantID: string;
  TenantRoleID: string;
  UserID: string;
  CreatedAt: string;
  UpdatedAt: string;
}

/** Map PascalCase backend tenant-user → camelCase frontend TenantUser */
function normalizeTenantUser(raw: RawTenantUser): TenantUser {
  return {
    id: raw.ID,
    tenantID: raw.TenantID,
    tenantRoleID: raw.TenantRoleID,
    userID: raw.UserID,
    createdAt: raw.CreatedAt,
    updatedAt: raw.UpdatedAt,
  };
}

export const tenantUser = {
  list: async (params?: { tenant_id?: string; user_id?: string }): Promise<TenantUser[]> => {
    const query = new URLSearchParams();
    if (params?.tenant_id) query.set("tenant_id", params.tenant_id);
    if (params?.user_id) query.set("user_id", params.user_id);
    const qs = query.toString();
    const url = qs ? `/api/v1/tenant-users?${qs}` : "/api/v1/tenant-users";
    const response = await httpClient.get<ResponseWrapper<RawTenantUser[]>>(url);
    const data = (response as unknown as ResponseWrapper<RawTenantUser[]>).data;
    return Array.isArray(data) ? data.map(normalizeTenantUser) : [];
  },

  get: async (id: string): Promise<TenantUser> => {
    const response = await httpClient.get<ResponseWrapper<RawTenantUser>>(
      `/api/v1/tenant-users/${id}`
    );
    return normalizeTenantUser((response as unknown as ResponseWrapper<RawTenantUser>).data);
  },

  create: async (payload: TenantUserCreateRequest): Promise<TenantUser> => {
    const response = await httpClient.post<ResponseWrapper<RawTenantUser>>(
      "/api/v1/tenant-users",
      payload
    );
    return normalizeTenantUser((response as unknown as ResponseWrapper<RawTenantUser>).data);
  },

  update: async (id: string, payload: TenantUserUpdateRequest): Promise<TenantUser> => {
    const response = await httpClient.put<ResponseWrapper<RawTenantUser>>(
      `/api/v1/tenant-users/${id}`,
      payload
    );
    return normalizeTenantUser((response as unknown as ResponseWrapper<RawTenantUser>).data);
  },

  delete: async (id: string): Promise<void> => {
    await httpClient.delete(`/api/v1/tenant-users/${id}`);
  },
};