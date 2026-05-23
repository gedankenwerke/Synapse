import {
  IconChartBar,
  IconFileDescription,
  IconScale,
  IconArrowsExchange,
  IconBuildingBank,
} from "@tabler/icons-react";
import type { NavItem } from "./types";

export const USER_NAV_ITEMS: NavItem[] = [
  { labelKey: "dashboard", icon: IconChartBar, href: "/user/dashboard" },
  { labelKey: "accountStatement", icon: IconFileDescription, href: "/user/account-statement", requiredAction: "SearchBankStatement" },
  { labelKey: "netBalance", icon: IconScale, href: "/user/net-balance", requiredAction: "SearchNetBalance" },
  { labelKey: "transaction", icon: IconArrowsExchange, href: "/user/deposits-withdrawals", requiredAction: "SearchTransactionHistory" },
  { labelKey: "customerSettlement", icon: IconBuildingBank, href: "/user/settlement", requiredAction: "Settlement" },
];