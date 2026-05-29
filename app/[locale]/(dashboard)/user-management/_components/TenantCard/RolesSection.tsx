"use client";

import { Stack, Group, Text, Badge, ActionIcon, Button } from "@mantine/core";
import { IconPlus, IconPencil, IconTrash } from "@tabler/icons-react";
import type { TenantRole } from "@/services/tenant-role/types";
import type { TenantPermission } from "@/services/tenant-permission/types";
import { PermissionsSection } from "./PermissionsSection";
import { PERMISSION_ACTIONS } from "../RolesTab/permissionActions";
import { ActionGuard } from "@/components/ActionGuard";

interface RolesSectionProps {
  tenantId: string;
  roles: TenantRole[];
  permissions: TenantPermission[];
  isToggling?: boolean;
  onTogglePermission: (roleId: string, action: string, enabled: boolean) => void;
  onAddRole: () => void;
  onEditRole: (role: TenantRole) => void;
  onDeleteRole: (role: TenantRole) => void;
}

export function RolesSection({
  roles,
  permissions,
  isToggling,
  onTogglePermission,
  onAddRole,
  onEditRole,
  onDeleteRole,
}: RolesSectionProps) {
  return (
    <Stack gap={4}>
      <Text size="sm" fw={600} c="dimmed">
        Roles
      </Text>
      {roles.length === 0 ? (
        <Text size="xs" c="dimmed" pl="sm">
          No roles
        </Text>
      ) : (
        <Stack gap={4} pl="sm">
          {roles.map((role) => {
            const rolePerms = permissions.filter(
              (p) => p.roleID === role.id
            );
            return (
              <Stack key={role.id} gap={2}>
                <Group gap={4} wrap="nowrap">
                  <PermissionsSection
                    roleId={role.id}
                    roleName={role.name}
                    permissions={rolePerms}
                    allActions={[...PERMISSION_ACTIONS]}
                    isToggling={isToggling}
                    onToggle={(action, enabled) => onTogglePermission(role.id, action, enabled)}
                  />
                  <Group gap={2} ml="auto">
                    <ActionGuard action="UpdateTenantRole">
                      <ActionIcon
                        variant="subtle"
                        color="blue"
                        size="xs"
                        onClick={() => onEditRole(role)}
                        aria-label="Edit role"
                      >
                        <IconPencil size={12} />
                      </ActionIcon>
                    </ActionGuard>
                    <ActionGuard action="DeleteTenantRole">
                      <ActionIcon
                        variant="subtle"
                        color="red"
                        size="xs"
                        onClick={() => onDeleteRole(role)}
                        aria-label="Delete role"
                      >
                        <IconTrash size={12} />
                      </ActionIcon>
                    </ActionGuard>
                  </Group>
                </Group>
              </Stack>
            );
          })}
        </Stack>
      )}
      <ActionGuard action="CreateTenantRole">
        <Button
          variant="subtle"
          size="compact-xs"
          leftSection={<IconPlus size={12} />}
          onClick={onAddRole}
          ml="sm"
        >
          Add role
        </Button>
      </ActionGuard>
    </Stack>
  );
}