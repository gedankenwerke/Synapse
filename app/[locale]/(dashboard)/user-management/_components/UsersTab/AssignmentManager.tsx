"use client";

import { useTranslations } from "next-intl";
import {
  Badge,
  ActionIcon,
  Group,
  Stack,
  Text,
  Divider,
  Tooltip,
} from "@mantine/core";
import { IconX, IconLock } from "@tabler/icons-react";
import type { AssignmentData } from "./types";

interface AssignmentManagerProps {
  assignments: AssignmentData[];
  onChange: (assignments: AssignmentData[]) => void;
}

export function AssignmentManager({
  assignments,
}: AssignmentManagerProps) {
  const t = useTranslations("userManagement");

  return (
    <Stack gap="sm">
      <Text fw={600} size="sm">{t("drawer.assignmentsSection")}</Text>

      {assignments.length === 0 ? (
        <Text c="dimmed" size="sm" ta="center" py="sm">
          {t("noAssignments")}
        </Text>
      ) : (
        <Stack gap={4}>
          {assignments.map((assignment) => (
            <Group key={assignment.id} justify="space-between" wrap="nowrap">
              <Group gap="xs" wrap="nowrap">
                <Text size="sm">{assignment.tenantName}</Text>
                <Badge variant="light" color="orange" size="sm">
                  {assignment.roleName}
                </Badge>
              </Group>
              <Tooltip label={t("comingSoon.tenants")}>
                <ActionIcon
                  variant="subtle"
                  color="gray"
                  size="sm"
                  disabled
                  aria-label={t("removeAssignment")}
                >
                  <IconX size={14} />
                </ActionIcon>
              </Tooltip>
            </Group>
          ))}
        </Stack>
      )}

      <Divider my="xs" />

      <Group gap="xs">
        <IconLock size={14} />
        <Text c="dimmed" size="sm" fs="italic">
          {t("comingSoon.tenants")}
        </Text>
      </Group>
    </Stack>
  );
}