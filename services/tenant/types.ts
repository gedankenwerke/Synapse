export interface Tenant {
  id: string;
  parentID: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface TenantCreateRequest {
  name: string;
  parent_id: string;
}

export interface TenantUpdateRequest {
  name?: string;
}