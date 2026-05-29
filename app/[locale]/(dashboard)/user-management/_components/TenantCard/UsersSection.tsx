"use client";

import { Stack, Group, Text, Badge, ActionIcon, Button } from "@mantine/core";
import { IconPlus, IconX, IconUser } from "@tabler/icons-react";
import type { TenantUser } from "@/services/tenant-user/types";
import type { TenantRole } from "@/services/tenant-role/types";
import { ActionGuard } from "@/components/ActionGuard";

interface UsersSectionProps {
  tenantId: string;
  tenantUsers: TenantUser[];
  roleMap: Map<string, string>;
  userMap: Map<string, string>;
  onRemoveUser: (tenantUserId: string) => void;
  onAddUser: () => void;
}

export function UsersSection({
  tenantUsers,
  roleMap,
  userMap,
  onRemoveUser,
  onAddUser,
}: UsersSectionProps) {
  return (
    <Stack gap={4}>
      <Text size="sm" fw={600} c="dimmed">
        Users
      </Text>
      {tenantUsers.length === 0 ? (
        <Text size="xs" c="dimmed" pl="sm">
          No users assigned
        </Text>
      ) : (
        <Stack gap={2} pl="sm">
          {tenantUsers.map((tu) => (
            <Group key={tu.id} gap={6} wrap="nowrap">
              <IconUser size={12} color="gray" />
              <Text size="xs" truncate>
                {userMap.get(tu.userID) ?? tu.userID}
              </Text>
              <Badge variant="light" color="orange" size="xs">
                {roleMap.get(tu.tenantRoleID) ?? "—"}
              </Badge>
              <ActionGuard action="DeleteTenantUser">
                <ActionIcon
                  variant="subtle"
                  color="red"
                  size="xs"
                  onClick={() => onRemoveUser(tu.id)}
                  aria-label="Remove user"
                >
                  <IconX size={10} />
                </ActionIcon>
              </ActionGuard>
            </Group>
          ))}
        </Stack>
      )}
      <ActionGuard action="CreateTenantUser">
        <Button
          variant="subtle"
          size="compact-xs"
          leftSection={<IconPlus size={12} />}
          onClick={onAddUser}
          ml="sm"
        >
          Assign user
        </Button>
      </ActionGuard>
    </Stack>
  );
}