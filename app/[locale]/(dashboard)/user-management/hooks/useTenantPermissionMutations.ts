import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tenantPermission } from "@/services/tenant-permission";

export function useCreateTenantPermission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ roleId, actions }: { roleId: string; actions: string[] }) =>
      tenantPermission.create(roleId, { actions }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenant-permissions"] });
    },
  });
}

export function useDeleteTenantPermission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ roleId, actions }: { roleId: string; actions: string[] }) =>
      tenantPermission.remove(roleId, { actions }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenant-permissions"] });
    },
  });
}