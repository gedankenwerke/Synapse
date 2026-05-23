import {
  IconChartBar,
  IconFileDescription,
  IconScale,
  IconArrowsExchange,
  IconBuildingBank,
  IconUsers,
} from "@tabler/icons-react";
import type { NavItem } from "./types";

export const SENIOR_NAV_ITEMS: NavItem[] = [
  { labelKey: "dashboard", icon: IconChartBar, href: "/senior/dashboard" },
  { labelKey: "userManagement", icon: IconUsers, href: "/senior/user-management" },
  { labelKey: "customerSettlement", icon: IconBuildingBank, href: "/senior/settlement" },
  { labelKey: "accountStatement", icon: IconFileDescription, href: "/senior/account-statement" },
  { labelKey: "netBalance", icon: IconScale, href: "/senior/net-balance" },
  { labelKey: "transaction", icon: IconArrowsExchange, href: "/senior/deposits-withdrawals" },
];