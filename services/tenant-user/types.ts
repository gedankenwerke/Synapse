export interface TenantUser {
  id: string;
  tenantID: string;
  tenantRoleID: string;
  userID: string;
  createdAt: string;
  updatedAt: string;
}

export interface TenantUserCreateRequest {
  tenant_id: string;
  user_id: string;
  tenant_role_id: string;
}

export interface TenantUserUpdateRequest {
  tenant_role_id?: string;
}