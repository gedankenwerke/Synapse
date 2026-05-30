import { useQuery } from "@tanstack/react-query";
import { netBalance } from "@/services/net-balance";
import { useTenantClientIds } from "@/hooks/useTenantClientIds";
import type { NetBalanceItem } from "@/services/net-balance/types";

function filterByTenant(items: NetBalanceItem[], clientIds: Set<string>): NetBalanceItem[] {
  if (clientIds.size === 0) return items; // SuperAdmin: show all
  return items.filter((item) => clientIds.has(item.client_id));
}

export function useNetBalanceQuery(
  startDateTime: string,
  endDateTime: string
) {
  const { clientIds, isLoading: isTenantLoading } = useTenantClientIds();

  const query = useQuery({
    queryKey: ["netBalance", startDateTime, endDateTime],
    queryFn: () =>
      netBalance.fetchPage({
        after: "",
        before: "",
        limit: 25,
        start_date_time: startDateTime,
        end_date_time: endDateTime,
      }),
    refetchInterval: 30000,
    enabled: !isTenantLoading,
  });

  // Apply tenant filter
  const filteredData = query.data
    ? {
        ...query.data,
        items: filterByTenant(query.data.items, clientIds),
      }
    : undefined;

  return {
    ...query,
    data: filteredData,
  };
}