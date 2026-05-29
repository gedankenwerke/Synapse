import type { LoginRequestUser } from "@/services/authentication/types";
import type { Tenant } from "@/services/tenant/types";

export type UserRole = "superadmin" | "senior" | "agent";

export function deriveRole(user: LoginRequestUser | null, tenants: Tenant[]): UserRole {
  if (!user) return "agent";
  if (!Array.isArray(tenants)) return "agent";
  if (user.tenant_id === "1") return "superadmin";
  const myTenant = tenants.find((t) => t.id === user.tenant_id);
  if (!myTenant) return user.tenant_id === "1" ? "superadmin" : "agent";
  const hasChildren = tenants.some((t) => t.parentID === myTenant.id);
  return hasChildren ? "senior" : "agent";
}

export function getHomePath(_role: UserRole): string {
  return "/dashboard";
}