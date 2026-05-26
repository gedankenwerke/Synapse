"use client";

import { useTranslations } from "next-intl";
import { Modal, Stack, Text, Badge, Group, Button } from "@mantine/core";
import type { UserData } from "@/services/user/types";

interface ViewUserModalProps {
  opened: boolean;
  onClose: () => void;
  user: UserData | null;
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleString("en-GB", {
      timeZone: "Asia/Bangkok",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

export function ViewUserModal({ opened, onClose, user }: ViewUserModalProps) {
  const t = useTranslations("userManagement");
  const tc = useTranslations("common");

  if (!user) return null;

  const firstAssignment = user.assignments[0];

  return (
    <Modal opened={opened} onClose={onClose} title={t("userDetails")} centered size="md">
      <Stack gap="sm">
        <div>
          <Text size="xs" c="dimmed">{t("modal.usernameLabel")}</Text>
          <Text fw={700} size="lg">{user.username}</Text>
        </div>

        <div>
          <Text size="xs" c="dimmed">{t("modal.tenantLabel")}</Text>
          <Text fw={500}>
            {firstAssignment ? firstAssignment.tenantName : "—"}
          </Text>
        </div>

        <div>
          <Text size="xs" c="dimmed">{t("modal.roleLabel")}</Text>
          {firstAssignment ? (
            <Badge variant="light" color="blue">
              {firstAssignment.roleName}
            </Badge>
          ) : (
            <Text fw={500}>—</Text>
          )}
        </div>

        <div>
          <Text size="xs" c="dimmed">{t("colCreated")}</Text>
          <Text fw={500}>{formatDate(user.createdAt)}</Text>
        </div>

        <Group justify="flex-end" mt="xl">
          <Button variant="default" onClick={onClose}>
            {tc("close")}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}