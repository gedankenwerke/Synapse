export interface TenantPermission {
  id: string;
  roleID: string;
  action: string;
  createdAt: string;
  updatedAt: string;
}

export interface TenantPermissionCreateRequest {
  actions: string[];
}

export interface TenantPermissionDeleteRequest {
  actions: string[];
}