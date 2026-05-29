export interface TenantRole {
  id: string;
  tenantID: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface TenantRoleCreateRequest {
  name: string;
  tenant_id: string;
}

export interface TenantRoleUpdateRequest {
  name?: string;
  tenant_id?: string;
}
