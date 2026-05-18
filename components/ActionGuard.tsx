"use client";

import { usePermissionStore } from "@/store/usePermissionStore";

interface ActionGuardProps {
  action: string;
  tenantId?: string;
  children: React.ReactNode;
}

export function ActionGuard({ action, tenantId, children }: ActionGuardProps) {
  const hasAction = usePermissionStore((s) => s.hasAction);
  const hasActionInTenant = usePermissionStore((s) => s.hasActionInTenant);

  if (tenantId) {
    if (!hasActionInTenant(action, tenantId)) return null;
  } else {
    if (!hasAction(action)) return null;
  }

  return <>{children}</>;
}