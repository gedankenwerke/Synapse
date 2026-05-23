import {
  IconChartBar,
  IconBuilding,
  IconScale,
  IconFileDescription,
  IconArrowsExchange,
  IconRobot,
  IconBuildingBank,
} from "@tabler/icons-react";
import type { NavItem } from "./types";

export const SUPERADMIN_NAV_ITEMS: NavItem[] = [
  { labelKey: "dashboard", icon: IconChartBar, href: "/superadmin/dashboard" },
  { labelKey: "tenants", icon: IconBuilding, href: "/superadmin/tenants" },
  { labelKey: "policies", icon: IconScale, href: "/superadmin/policies" },
  { labelKey: "payAgent", icon: IconRobot, href: "/superadmin/pay-agent" },
  { labelKey: "customerSettlement", icon: IconBuildingBank, href: "/superadmin/settlement" },
  { labelKey: "accountStatement", icon: IconFileDescription, href: "/superadmin/account-statement" },
  { labelKey: "netBalance", icon: IconScale, href: "/superadmin/net-balance" },
];