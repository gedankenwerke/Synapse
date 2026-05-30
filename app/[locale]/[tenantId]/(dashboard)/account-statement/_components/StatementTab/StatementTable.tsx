"use client";

import { useEffect, useCallback, useRef } from "react";
import {
  ActionIcon,
  Badge,
  Group,
  Loader,
  ScrollArea,
  Table,
  Text,
  Tooltip,
} from "@mantine/core";
import { IconEye, IconArrowDown, IconArrowUp } from "@tabler/icons-react";
import { useInView } from "react-intersection-observer";
import { useTranslations } from "next-intl";
import { COLUMNS } from "./columns";
import type { BankStatementItem } from "@/services/account-statement/types";
import { formatBaht, formatDateTime, formatBankName, getDisplayName, displayOrNA } from "./utils";

interface StatementTableProps {
  data: BankStatementItem[];
  onLoadMore: () => void;
  hasMore: boolean;
  loadingMore: boolean;
  onView: (item: BankStatementItem) => void;
  newItemIds: Set<string>;
}

function getItemKey(item: BankStatementItem) {
  return `${item.acct_id}-${item.trno}-${item.trans_date}`;
}

function TypeBadge({ type }: { type: BankStatementItem["trans_type"] }) {
  const typ = useTranslations("type");

  if (type === "Deposit") {
    return (
      <Badge variant="light" color="green" leftSection={<IconArrowDown size={12} />}>
        {typ("deposit")}
      </Badge>
    );
  }
  return (
    <Badge variant="light" color="red" leftSection={<IconArrowUp size={12} />}>
      {typ("withdraw")}
    </Badge>
  );
}

export function StatementTable({
  data,
  onLoadMore,
  hasMore,
  loadingMore,
  onView,
  newItemIds,
}: StatementTableProps) {
  const t = useTranslations("accountStatement");
  const tc = useTranslations("common");
  const tb = useTranslations("bank");

  const { ref: sentinelRef, inView } = useInView({ threshold: 0 });

  const wasLoadingMoreRef = useRef(false);
  useEffect(() => {
    wasLoadingMoreRef.current = loadingMore;
  }, [loadingMore]);

  const triggerLoadMore = useCallback(() => {
    if (inView && hasMore && !loadingMore) {
      onLoadMore();
    }
  }, [inView, hasMore, loadingMore, onLoadMore]);

  useEffect(() => {
    triggerLoadMore();
  }, [triggerLoadMore]);

  return (
    <ScrollArea h="calc(100dvh - 250px)">
      <Table striped highlightOnHover withTableBorder>
        <Table.Thead>
          <Table.Tr>
            {COLUMNS.map((col) => (
              <Table.Th key={col.key}>
                <Text size="sm" fw={500}>
                  {col.label ? t(col.label) : ""}
                </Text>
              </Table.Th>
            ))}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {data.length === 0 && !loadingMore ? (
            <Table.Tr>
              <Table.Td colSpan={COLUMNS.length}>
                <Text ta="center" c="dimmed" py="md">
                  {tc("noRecordsFound")}
                </Text>
              </Table.Td>
            </Table.Tr>
          ) : (
            <>
              {data.map((item) => {
                const key = getItemKey(item);
                const isNew = newItemIds.has(key) && !wasLoadingMoreRef.current;
                return (
                  <Table.Tr
                    key={key}
                    className={isNew ? "row-highlight-new" : ""}
                  >
                    <Table.Td>{formatDateTime(item.trans_date)}</Table.Td>
                    <Table.Td>{item.trno}</Table.Td>
                    <Table.Td>
                      <TypeBadge type={item.trans_type} />
                    </Table.Td>
                    <Table.Td>
                      <Text c={item.trans_type === "Deposit" ? "green" : "red"} fw={500}>
                        {item.trans_type === "Deposit" ? "+" : "-"}
                        {formatBaht(item.amount)}
                      </Text>
                    </Table.Td>
                    <Table.Td>{formatBankName(item.acct_bank, tb)}</Table.Td>
                    <Table.Td>{displayOrNA(item.acct_no, tc("na"))}</Table.Td>
                    <Table.Td>{getDisplayName(item)}</Table.Td>
                    <Table.Td>
                      <Tooltip label={tc("viewDetails")}>
                        <ActionIcon
                          variant="subtle"
                          color="gray"
                          onClick={() => onView(item)}
                        >
                          <IconEye size={16} />
                        </ActionIcon>
                      </Tooltip>
                    </Table.Td>
                  </Table.Tr>
                );
              })}
              <Table.Tr ref={sentinelRef} style={{ height: 1 }}>
                <Table.Td colSpan={COLUMNS.length}>
                  {loadingMore && (
                    <Group justify="center" py="sm">
                      <Loader size="sm" />
                    </Group>
                  )}
                </Table.Td>
              </Table.Tr>
            </>
          )}
        </Table.Tbody>
      </Table>
    </ScrollArea>
  );
}