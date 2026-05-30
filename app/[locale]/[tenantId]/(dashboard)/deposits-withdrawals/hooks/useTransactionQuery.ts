import { useInfiniteQuery } from "@tanstack/react-query";
import { transaction } from "@/services/transaction";
import { encodeSearch } from "@/utils/encodeSearch";
import { useTenantClientIds } from "@/hooks/useTenantClientIds";
import type { TransactionItem } from "@/services/transaction/types";

const PAGE_LIMIT = 25;

function filterByTenant(items: TransactionItem[], clientIds: Set<string>): TransactionItem[] {
  if (clientIds.size === 0) return items; // SuperAdmin: show all
  return items.filter((item) => clientIds.has(item.u_client_id));
}

export function useTransactionQuery(
  search: string,
  startDateTime: string,
  endDateTime: string
) {
  const { clientIds, isLoading: isTenantLoading } = useTenantClientIds();
  const isSearch = search.trim().length > 0;

  const query = useInfiniteQuery({
    queryKey: ["transaction", search, startDateTime, endDateTime],
    queryFn: ({ pageParam }) => {
      const after = pageParam || (isSearch ? encodeSearch(search) : "");
      return transaction.fetchPage({
        after,
        before: "",
        limit: PAGE_LIMIT,
        start_date_time: startDateTime,
        end_date_time: endDateTime,
      });
    },
    initialPageParam: "",
    getNextPageParam: (lastPage) =>
      lastPage.after !== "" ? lastPage.after : undefined,
    maxPages: 10,
    refetchInterval: isSearch ? false : 5000,
    enabled: !isTenantLoading,
  });

  // Apply tenant filter to all pages
  const filteredData = query.data
    ? {
        ...query.data,
        pages: query.data.pages.map((page) => ({
          ...page,
          items: filterByTenant(page.items, clientIds),
        })),
      }
    : undefined;

  return {
    ...query,
    data: filteredData,
  };
}