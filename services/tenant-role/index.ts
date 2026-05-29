import httpClient from "@/libs/axios";
import { TenantRole, TenantRoleCreateRequest, TenantRoleUpdateRequest } from "./types";
import { ResponseWrapper } from "@/types/response";

// Backend returns PascalCase
interface RawTenantRole {
  ID: string;
  TenantID: string;
  Name: string;
  CreatedAt: string;
  UpdatedAt: string;
}

/** Map PascalCase backend role → camelCase frontend TenantRole */
function normalizeTenantRole(raw: RawTenantRole): TenantRole {
  return {
    id: raw.ID,
    tenantID: raw.TenantID,
    name: raw.Name,
    createdAt: raw.CreatedAt,
    updatedAt: raw.UpdatedAt,
  };
}

export const tenantRole = {
  list: async (): Promise<TenantRole[]> => {
    const response = await httpClient.get<ResponseWrapper<RawTenantRole[]>>(
      "/api/v1/tenant-roles"
    );
    const data = (response as unknown as ResponseWrapper<RawTenantRole[]>).data;
    return Array.isArray(data) ? data.map(normalizeTenantRole) : [];
  },

  get: async (id: string): Promise<TenantRole> => {
    const response = await httpClient.get<ResponseWrapper<RawTenantRole>>(
      `/api/v1/tenant-roles/${id}`
    );
    return normalizeTenantRole((response as unknown as ResponseWrapper<RawTenantRole>).data);
  },

  create: async (payload: TenantRoleCreateRequest): Promise<TenantRole> => {
    const response = await httpClient.post<ResponseWrapper<RawTenantRole>>(
      "/api/v1/tenant-roles",
      payload
    );
    return normalizeTenantRole((response as unknown as ResponseWrapper<RawTenantRole>).data);
  },

  update: async (id: string, payload: TenantRoleUpdateRequest): Promise<TenantRole> => {
    const response = await httpClient.put<ResponseWrapper<RawTenantRole>>(
      `/api/v1/tenant-roles/${id}`,
      payload
    );
    return normalizeTenantRole((response as unknown as ResponseWrapper<RawTenantRole>).data);
  },

  delete: async (id: string): Promise<void> => {
    await httpClient.delete(`/api/v1/tenant-roles/${id}`);
  },
};