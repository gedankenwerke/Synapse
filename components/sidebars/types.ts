import type { PolicyName } from "@/services/policy/types";

export type NavItem = {
  labelKey: string;
  icon: typeof import("@tabler/icons-react").IconChartBar;
  href: string;
  requiredAction?: string;  // RBAC action name for user-layer filtering; omit for always-visible items
};