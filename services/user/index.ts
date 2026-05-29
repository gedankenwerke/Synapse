import httpClient from "@/libs/axios";
import type {
  UserListParams,
  CreateUserPayload,
  UpdateUserPayload,
  ApiUser,
  ApiPaginatedUserResponse,
  PaginatedUserResponse,
} from "./types";
import type { User } from "./types";
import { mapApiPaginatedResponse } from "./types";
import { ResponseWrapper } from "@/types/response";

function mapApiUser(api: ApiUser): User {
  return {
    id: api.ID,
    username: api.Username,
    tenant_id: api.TenantID,
    created_at: api.CreatedAt,
    updated_at: api.UpdatedAt,
  };
}

export const userService = {
  list: async (params: UserListParams): Promise<PaginatedUserResponse> => {
    const response = await httpClient.get<unknown>("/api/v1/users", {
      params,
    });
    const apiData = (response as unknown as ResponseWrapper<ApiPaginatedUserResponse>).data;
    return mapApiPaginatedResponse(apiData);
  },

  getById: async (id: string): Promise<User> => {
    const response = await httpClient.get<unknown>(`/api/v1/users/${id}`);
    const apiData = (response as unknown as ResponseWrapper<ApiUser>).data;
    return mapApiUser(apiData);
  },

  create: async (data: CreateUserPayload): Promise<User> => {
    const response = await httpClient.post<unknown>("/api/v1/users", data);
    const apiData = (response as unknown as ResponseWrapper<ApiUser>).data;
    return mapApiUser(apiData);
  },

  update: async (id: string, data: UpdateUserPayload): Promise<User> => {
    const response = await httpClient.put<unknown>(`/api/v1/users/${id}`, data);
    const apiData = (response as unknown as ResponseWrapper<ApiUser>).data;
    return mapApiUser(apiData);
  },

  remove: async (id: string): Promise<void> => {
    await httpClient.delete(`/api/v1/users/${id}`);
  },
};