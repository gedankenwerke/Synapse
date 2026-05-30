import { useQuery } from "@tanstack/react-query";
import { tenant } from "@/services/tenant";
import { useAppStore } from "@/store/useAppStore";
import { getVisibleTenantIds, getVisibleClientIds } from "@/services/tenant/helpers";
import { deriveRole } from "@/utils/role";

/**
 * Returns a Set of ClientID values that the current user can see.
 * - SuperAdmin: returns empty Set (meaning "show all, no filtering needed")
 * - Senior: own tenant + all descendants' ClientIDs
 * - Agent: own tenant's ClientID only
 *
 * Returns `{ clientIds: Set<string>, isLoading }`.
 * An **empty** Set means "show everything" (SuperAdmin or still loading).
 * A **non-empty** Set means "only show items whose client_id/u_client_id is in this Set".
 */
export function useTenantClientIds() {
  const user = useAppStore((s) => s.user);
  const tenantId = user?.tenant_id ?? "1";

  const tenantsQuery = useQuery({
    queryKey: ["tenants"],
    queryFn: () => tenant.list(),
    staleTime: 5 * 60 * 1000, // 5 min cache
  });

  const tenants = tenantsQuery.data ?? [];
  const isSuperAdmin = deriveRole(user, tenants) === "superadmin";
  const visibleTenantIds = getVisibleTenantIds(tenantId, tenants, isSuperAdmin);
  const clientIds = isSuperAdmin
    ? new Set<string>() // empty = show all
    : getVisibleClientIds(tenants, visibleTenantIds);

  return {
    clientIds,
    isLoading: tenantsQuery.isLoading,
  };
}