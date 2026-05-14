export type TransactionType = "Deposit" | "Withdrawal";
export type TransactionStatus = "Pending" | "Completed" | "Rejected";

export interface TransactionData {
  id: string;
  user: string;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
}

export function formatBaht(amount: number): string {
  return `฿ ${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export interface StatCardData {
  titleKey: string;
  value: string;
  change: number;
  icon: string;
}

export const STAT_CARDS: StatCardData[] = [
  { titleKey: "totalBalance", value: "฿ 1,250,000", change: 5.2, icon: "wallet" },
  { titleKey: "todayDeposits", value: "฿ 85,400", change: 12.3, icon: "deposit" },
  { titleKey: "todayWithdrawals", value: "฿ 42,600", change: -3.1, icon: "withdrawal" },
  { titleKey: "activeUsers", value: "1,420", change: 2.8, icon: "users" },
];

export const AREA_CHART_DATA = [
  { date: "Mon", Deposits: 78000, Withdrawals: 35000 },
  { date: "Tue", Deposits: 92000, Withdrawals: 48000 },
  { date: "Wed", Deposits: 65000, Withdrawals: 39000 },
  { date: "Thu", Deposits: 110000, Withdrawals: 52000 },
  { date: "Fri", Deposits: 85000, Withdrawals: 42000 },
  { date: "Sat", Deposits: 45000, Withdrawals: 28000 },
  { date: "Sun", Deposits: 38000, Withdrawals: 21000 },
];

export const DONUT_CHART_DATA = [
  { name: "Completed", value: 68, color: "green.6" },
  { name: "Pending", value: 22, color: "yellow.6" },
  { name: "Rejected", value: 10, color: "red.6" },
];

export const RECENT_TRANSACTIONS: TransactionData[] = [
  { id: "TXN-2024-001", user: "Somchai Wattana", type: "Deposit", amount: 15000.0, status: "Completed" },
  { id: "TXN-2024-002", user: "Niran Phadungkit", type: "Withdrawal", amount: 5000.0, status: "Completed" },
  { id: "TXN-2024-003", user: "Priya Srisai", type: "Deposit", amount: 250000.0, status: "Pending" },
  { id: "TXN-2024-004", user: "Anuchit Kiatkungwal", type: "Withdrawal", amount: 12500.0, status: "Completed" },
  { id: "TXN-2024-005", user: "Kanya Thammajak", type: "Deposit", amount: 500000.0, status: "Rejected" },
];