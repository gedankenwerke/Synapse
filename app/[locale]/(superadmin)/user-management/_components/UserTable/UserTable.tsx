"use client";

import { useTranslations } from "next-intl";
import {
  Table,
  Badge,
  ActionIcon,
  Group,
  Text,
  ScrollArea,
  Center,
  Loader,
} from "@mantine/core";
import { IconEye, IconPencil, IconTrash } from "@tabler/icons-react";
import { getColumns } from "./columns";
import { ActionGuard } from "@/components/ActionGuard";
import type { UserData } from "@/services/user/types";

const TH_TZ = "Asia/Bangkok";

function formatThaiDate(iso: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleString("en-GB", {
    timeZone: TH_TZ,
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface UserTableProps {
  data: UserData[];
  isLoading?: boolean;
  onView: (user: UserData) => void;
  onEdit: (user: UserData) => void;
  onDelete: (user: UserData) => void;
}

export function UserTable({
  data,
  isLoading,
  onView,
  onEdit,
  onDelete,
}: UserTableProps) {
  const t = useTranslations("userManagement");
  const columns = getColumns(t);

  if (isLoading) {
    return (
      <Center py="xl">
        <Loader />
      </Center>
    );
  }

  const rows = data.map((user) => {
    const firstAssignment = user.assignments[0];

    return (
      <Table.Tr key={user.id}>
        <Table.Td>
          <Text size="sm" fw={500}>
            {user.username}
          </Text>
        </Table.Td>
        <Table.Td>
          {firstAssignment ? (
            <Badge variant="light" color="blue" size="sm">
              {firstAssignment.roleName}
            </Badge>
          ) : (
            <Text size="sm" c="dimmed">
              —
            </Text>
          )}
        </Table.Td>
        <Table.Td>
          <Text size="sm">{formatThaiDate(user.createdAt)}</Text>
        </Table.Td>
        <Table.Td>
          <Group gap={4} wrap="nowrap">
            <ActionIcon
              variant="subtle"
              color="blue"
              onClick={() => onView(user)}
              aria-label={t("viewUser")}
            >
              <IconEye size={16} />
            </ActionIcon>
            <ActionGuard action="UpdateUser">
              <ActionIcon
                variant="subtle"
                color="orange"
                onClick={() => onEdit(user)}
                aria-label={t("editUser")}
              >
                <IconPencil size={16} />
              </ActionIcon>
            </ActionGuard>
            <ActionGuard action="DeleteUser">
              <ActionIcon
                variant="subtle"
                color="red"
                onClick={() => onDelete(user)}
                aria-label={t("deleteUser")}
              >
                <IconTrash size={16} />
              </ActionIcon>
            </ActionGuard>
          </Group>
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <ScrollArea>
      <Table striped highlightOnHover withTableBorder>
        <Table.Thead>
          <Table.Tr>
            {columns.map((col) => (
              <Table.Th key={col.key}>
                {col.label ? (
                  <Text size="sm" fw={500}>
                    {col.label}
                  </Text>
                ) : null}
              </Table.Th>
            ))}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </ScrollArea>
  );
}