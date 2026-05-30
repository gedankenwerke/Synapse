import { useQuery } from "@tanstack/react-query";
import { tenantRole } from "@/services/tenant-role";

export function useTenantRolesQuery() {
  return useQuery({
    queryKey: ["tenant-roles"],
    queryFn: () => tenantRole.list(),
    staleTime: 30_000,
  });
}