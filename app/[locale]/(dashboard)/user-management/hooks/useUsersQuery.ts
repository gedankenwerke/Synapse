import { useInfiniteQuery } from "@tanstack/react-query";
import { userService } from "@/services/user";

const PAGE_LIMIT = 10;

export function useUsersQuery(search: string) {
  return useInfiniteQuery({
    queryKey: ["users", search],
    queryFn: ({ pageParam }) => {
      const after = typeof pageParam === "string" ? pageParam : "";
      return userService.list({
        after,
        before: "",
        limit: PAGE_LIMIT,
        username: search || undefined,
        tenant_id: 1,
      });
    },
    initialPageParam: "",
    getNextPageParam: (lastPage) =>
      lastPage.after !== "" ? lastPage.after : undefined,
    staleTime: 60_000,
  });
}