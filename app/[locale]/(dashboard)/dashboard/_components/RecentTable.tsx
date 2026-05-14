"use client";

import { Paper, Table, Text, Badge, ScrollArea, Group } from "@mantine/core";
import { IconArrowDown, IconArrowUp } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { RECENT_TRANSACTIONS, formatBaht, type TransactionData } from "./mockData";

function TypeBadge({ type }: { type: TransactionData["type"] }) {
  const t = useTranslations("type");
  if (type === "Deposit") {
    return (
      <Badge variant="light" color="green" leftSection={<IconArrowDown size={12} />}>
        {t("deposit")}
      </Badge>
    );
  }
  return (
    <Badge variant="light" color="red" leftSection={<IconArrowUp size={12} />}>
      {t("withdrawal")}
    </Badge>
  );
}

function StatusBadge({ status }: { status: TransactionData["status"] }) {
  const t = useTranslations("status");
  const colorMap: Record<TransactionData["status"], string> = {
    Pending: "yellow",
    Completed: "green",
    Rejected: "red",
  };
  const keyMap: Record<TransactionData["status"], string> = {
    Pending: "pending",
    Completed: "completed",
    Rejected: "rejected",
  };
  return (
    <Badge variant="light" color={colorMap[status]}>
      {t(keyMap[status])}
    </Badge>
  );
}

export function RecentTable() {
  const t = useTranslations("dashboard.recentTransactions");

  const rows = RECENT_TRANSACTIONS.map((txn) => (
    <Table.Tr key={txn.id}>
      <Table.Td>
        <Text size="sm" fw={500}>
          {txn.id}
        </Text>
      </Table.Td>
      <Table.Td>{txn.user}</Table.Td>
      <Table.Td>
        <TypeBadge type={txn.type} />
      </Table.Td>
      <Table.Td>{formatBaht(txn.amount)}</Table.Td>
      <Table.Td>
        <StatusBadge status={txn.status} />
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Paper shadow="sm" p="md" radius="md">
      <Text fw={600} mb="sm">
        {t("title")}
      </Text>
      <ScrollArea>
        <Table striped highlightOnHover withTableBorder>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>{t("colTransactionId")}</Table.Th>
              <Table.Th>{t("colUser")}</Table.Th>
              <Table.Th>{t("colType")}</Table.Th>
              <Table.Th>{t("colAmount")}</Table.Th>
              <Table.Th>{t("colStatus")}</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </ScrollArea>
    </Paper>
  );
}