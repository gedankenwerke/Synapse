import { useInfiniteQuery } from "@tanstack/react-query";
import { transaction } from "@/services/transaction";
import { encodeSearch } from "@/utils/encodeSearch";

const PAGE_LIMIT = 25;

export function useTransactionQuery(
  search: string,
  startDateTime: string,
  endDateTime: string
) {
  const isSearch = search.trim().length > 0;

  return useInfiniteQuery({
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
    maxPages: 10, // limit cached pages to prevent unbounded memory growth
    // Poll for new data every 5 seconds when not searching
    // structuralSharing (enabled globally) prevents unnecessary re-renders
    // when data hasn't actually changed
    refetchInterval: isSearch ? false : 5000,
  });
}