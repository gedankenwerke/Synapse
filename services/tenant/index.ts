import httpClient from "@/libs/axios";
import { Tenant, TenantCreateRequest, TenantUpdateRequest } from "./types";
import { ResponseWrapper } from "@/types/response";

// Backend returns PascalCase — this interface matches the raw API response
interface RawTenant {
  ID: string;
  ParentID: string;
  Name: string;
  CreatedAt: string;
  UpdatedAt: string;
  IsExternal?: boolean;
  ClientID?: string;
  ParentClientID?: string;
}

interface PaginatedTenantResponse {
  Items: RawTenant[];
}

/** Map raw PascalCase backend tenant → camelCase frontend Tenant */
function normalizeTenant(raw: RawTenant): Tenant {
  return {
    id: raw.ID,
    parentID: raw.ParentID,
    name: raw.Name,
    createdAt: raw.CreatedAt,
    updatedAt: raw.UpdatedAt,
  };
}

export const tenant = {
  list: async (): Promise<Tenant[]> => {
    const response = await httpClient.get<ResponseWrapper<PaginatedTenantResponse | RawTenant[]>>(
      "/api/v1/tenants"
    );
    const data = (response as unknown as ResponseWrapper<unknown>).data;
    // Handle paginated { Items: [...] } response (PascalCase)
    if (data && typeof data === "object" && !Array.isArray(data) && "Items" in data) {
      return (data as PaginatedTenantResponse).Items.map(normalizeTenant);
    }
    // Handle bare array response (fallback)
    if (Array.isArray(data)) return (data as RawTenant[]).map(normalizeTenant);
    return [];
  },

  get: async (id: string): Promise<Tenant> => {
    const response = await httpClient.get<ResponseWrapper<RawTenant>>(
      `/api/v1/tenants/${id}`
    );
    return normalizeTenant((response as unknown as ResponseWrapper<RawTenant>).data);
  },

  create: async (payload: TenantCreateRequest): Promise<Tenant> => {
    const response = await httpClient.post<ResponseWrapper<RawTenant>>(
      "/api/v1/tenants",
      payload
    );
    return normalizeTenant((response as unknown as ResponseWrapper<RawTenant>).data);
  },

  update: async (id: string, payload: TenantUpdateRequest): Promise<Tenant> => {
    const response = await httpClient.put<ResponseWrapper<RawTenant>>(
      `/api/v1/tenants/${id}`,
      payload
    );
    return normalizeTenant((response as unknown as ResponseWrapper<RawTenant>).data);
  },

  delete: async (id: string): Promise<void> => {
    await httpClient.delete(`/api/v1/tenants/${id}`);
  },
};