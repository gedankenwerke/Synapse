import { useQuery } from "@tanstack/react-query";
import { tenantPermission } from "@/services/tenant-permission";

export function useTenantPermissionsQuery(roleIds?: string[]) {
  return useQuery({
    queryKey: ["tenant-permissions", roleIds],
    queryFn: async () => {
      if (!roleIds || roleIds.length === 0) return [];
      // Fetch permissions for each role using the role-scoped API
      const results = await Promise.all(
        roleIds.map((roleId) => tenantPermission.listByRole(roleId))
      );
      return results.flatMap((perms) => perms);
    },
    enabled: !!roleIds && roleIds.length > 0,
    staleTime: 60_000,
  });
}