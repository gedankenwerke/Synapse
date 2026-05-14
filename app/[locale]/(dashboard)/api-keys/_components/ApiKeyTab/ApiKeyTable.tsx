"use client";

import {
  Table,
  Badge,
  ActionIcon,
  Group,
  UnstyledButton,
  Text,
  ScrollArea,
  Tooltip,
} from "@mantine/core";
import { useClipboard } from "@mantine/hooks";
import {
  IconCopy,
  IconBan,
  IconTrash,
  IconArrowsSort,
  IconArrowUp,
  IconArrowDown,
} from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { getColumns } from "./columns";
import type { ApiKeyData } from "./mockData";
import { formatDate } from "./mockData";

interface ApiKeyTableProps {
  data: ApiKeyData[];
  sortColumn: string | null;
  sortDirection: "asc" | "desc";
  onSort: (column: string) => void;
  onRevoke: (key: ApiKeyData) => void;
  onDelete: (key: ApiKeyData) => void;
}

export function ApiKeyTable({
  data,
  sortColumn,
  sortDirection,
  onSort,
  onRevoke,
  onDelete,
}: ApiKeyTableProps) {
  const clipboard = useClipboard({ timeout: 2000 });
  const t = useTranslations("apiKeys");
  const tc = useTranslations("common");
  const ts = useTranslations("status");

  const columns = getColumns(t);

  const rows = data.map((key) => (
    <Table.Tr key={key.id}>
      <Table.Td>{key.keyName}</Table.Td>
      <Table.Td>
        <Group gap="xs" wrap="nowrap">
          <Text size="sm" ff="monospace">
            {key.maskedKey}
          </Text>
          <Tooltip label={clipboard.copied ? tc("copied") : t("copyKey")}>
            <ActionIcon
              variant="subtle"
              color="gray"
              size="sm"
              onClick={() => clipboard.copy(key.apiKey)}
              aria-label="Copy API key"
            >
              <IconCopy size={14} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Table.Td>
      <Table.Td>{formatDate(key.createdAt)}</Table.Td>
      <Table.Td>
        <Badge
          color={key.status === "Active" ? "green" : "red"}
          variant="light"
        >
          {key.status === "Active" ? ts("active") : ts("revoked")}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Group gap={4} wrap="nowrap">
          {key.status === "Active" && (
            <Tooltip label={t("revoke")}>
              <ActionIcon
                variant="subtle"
                color="orange"
                onClick={() => onRevoke(key)}
                aria-label="Revoke key"
              >
                <IconBan size={16} />
              </ActionIcon>
            </Tooltip>
          )}
          <Tooltip label={t("delete")}>
            <ActionIcon
              variant="subtle"
              color="red"
              onClick={() => onDelete(key)}
              aria-label="Delete key"
            >
              <IconTrash size={16} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <ScrollArea>
      <Table striped highlightOnHover withTableBorder>
        <Table.Thead>
          <Table.Tr>
            {columns.map((col) => (
              <Table.Th key={col.key}>
                {col.sortable ? (
                  <UnstyledButton onClick={() => onSort(col.key)}>
                    <Group gap={4} wrap="nowrap">
                      <Text size="sm" fw={500}>
                        {col.label}
                      </Text>
                      {sortColumn === col.key ? (
                        sortDirection === "asc" ? (
                          <IconArrowUp size={14} />
                        ) : (
                          <IconArrowDown size={14} />
                        )
                      ) : (
                        <IconArrowsSort size={14} opacity={0.3} />
                      )}
                    </Group>
                  </UnstyledButton>
                ) : (
                  <Text size="sm" fw={500}>
                    {col.label}
                  </Text>
                )}
              </Table.Th>
            ))}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </ScrollArea>
  );
}