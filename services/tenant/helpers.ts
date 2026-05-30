import type { Tenant } from "./types";

/**
 * Returns true if the given tenant has any child tenants (i.e., is a Senior tenant).
 */
export function isSeniorTenant(tenant: Tenant, allTenants: Tenant[]): boolean {
  return allTenants.some((t) => t.ParentID === tenant.ID);
}

/**
 * Returns the list of Agent tenant IDs that belong to the given Senior tenant.
 */
export function getAgentTenantIds(parentTenantId: string, allTenants: Tenant[]): string[] {
  return allTenants
    .filter((t) => t.ParentID === parentTenantId)
    .map((t) => t.ID);
}

/**
 * Recursively returns ALL descendant tenant IDs (children, grandchildren, etc.).
 */
export function getAllDescendantTenantIds(parentId: string, allTenants: Tenant[]): string[] {
  const directChildren = allTenants.filter((t) => t.ParentID === parentId);
  const result: string[] = [];
  for (const child of directChildren) {
    result.push(child.ID);
    result.push(...getAllDescendantTenantIds(child.ID, allTenants));
  }
  return result;
}

/**
 * Returns the list of tenant IDs visible to the current user.
 * - SuperAdmin: all tenants
 * - Senior: own tenant + ALL descendants (children, grandchildren, etc.)
 * - Agent: only own tenant
 */
export function getVisibleTenantIds(
  currentTenantId: string,
  allTenants: Tenant[],
  isSuperAdmin: boolean
): string[] {
  if (isSuperAdmin) return allTenants.map((t) => t.ID);
  const descendantIds = getAllDescendantTenantIds(currentTenantId, allTenants);
  return [currentTenantId, ...descendantIds];
}

/**
 * Maps visible tenant IDs to their ClientID values.
 * Returns a Set for O(1) lookup when filtering bank/transaction data.
 * Returns empty Set for SuperAdmin (meaning "show all", no filtering needed).
 */
export function getVisibleClientIds(
  allTenants: Tenant[],
  visibleTenantIds: string[]
): Set<string> {
  const clientIds = new Set<string>();
  for (const tenant of allTenants) {
    if (visibleTenantIds.includes(tenant.ID) && tenant.ClientID) {
      clientIds.add(tenant.ClientID);
    }
  }
  return clientIds;
}