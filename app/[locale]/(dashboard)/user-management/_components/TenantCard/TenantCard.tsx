"use client";

import { useState } from "react";
import {
  Paper,
  Stack,
  Group,
  Text,
  ActionIcon,
  Badge,
  Divider,
  Collapse,
} from "@mantine/core";
import { IconPencil, IconTrash, IconChevronRight, IconChevronDown } from "@tabler/icons-react";
import type { Tenant } from "@/services/tenant/types";
import type { TenantRole } from "@/services/tenant-role/types";
import type { TenantUser } from "@/services/tenant-user/types";
import type { TenantPermission } from "@/services/tenant-permission/types";
import { UsersSection } from "./UsersSection";
import { RolesSection } from "./RolesSection";
import { ActionGuard } from "@/components/ActionGuard";

interface TenantCardProps {
  tenant: Tenant;
  parentName?: string;
  tenantUsers: TenantUser[];
  roles: TenantRole[];
  permissions: TenantPermission[];
  roleMap: Map<string, string>;
  userMap: Map<string, string>;
  isToggling?: boolean;
  onTogglePermission: (roleId: string, action: string, enabled: boolean) => void;
  onEditTenant: (tenant: Tenant) => void;
  onDeleteTenant: (tenant: Tenant) => void;
  onAddUser: () => void;
  onRemoveUser: (tenantUserId: string) => void;
  onAddRole: () => void;
  onEditRole: (role: TenantRole) => void;
  onDeleteRole: (role: TenantRole) => void;
}

export function TenantCard({
  tenant,
  parentName,
  tenantUsers,
  roles,
  permissions,
  roleMap,
  userMap,
  isToggling,
  onTogglePermission,
  onEditTenant,
  onDeleteTenant,
  onAddUser,
  onRemoveUser,
  onAddRole,
  onEditRole,
  onDeleteRole,
}: TenantCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Paper shadow="sm" radius="md" p="md" withBorder>
      {/* Header — always visible, click to expand/collapse */}
      <Group
        justify="space-between"
        wrap="nowrap"
        style={{ cursor: "pointer" }}
        onClick={() => setExpanded(!expanded)}
      >
        <Group gap={6} wrap="nowrap">
          <ActionIcon variant="subtle" size="sm" color="gray">
            {expanded ? <IconChevronDown size={14} /> : <IconChevronRight size={14} />}
          </ActionIcon>
          <Text size="md" fw={700} truncate>
            {tenant.name}
          </Text>
          {parentName && (
            <Badge variant="dot" color="gray" size="sm">
              {parentName}
            </Badge>
          )}
        </Group>
        <Group gap={2} onClick={(e) => e.stopPropagation()}>
          {/* Summary when collapsed */}
          {!expanded && (
            <Text size="xs" c="dimmed">
              {tenantUsers.length} user{tenantUsers.length !== 1 ? "s" : ""}, {roles.length} role{roles.length !== 1 ? "s" : ""}
            </Text>
          )}
          <ActionGuard action="UpdateTenant">
            <ActionIcon
              variant="subtle"
              color="blue"
              size="sm"
              onClick={() => onEditTenant(tenant)}
              aria-label="Edit tenant"
            >
              <IconPencil size={14} />
            </ActionIcon>
          </ActionGuard>
          <ActionGuard action="DeleteTenant">
            <ActionIcon
              variant="subtle"
              color="red"
              size="sm"
              onClick={() => onDeleteTenant(tenant)}
              aria-label="Delete tenant"
            >
              <IconTrash size={14} />
            </ActionIcon>
          </ActionGuard>
        </Group>
      </Group>

      {/* Expandable content */}
      <Collapse expanded={expanded}>
        <Stack gap="sm" mt="sm">
          <Divider />

          {/* Users */}
          <UsersSection
            tenantId={tenant.id}
            tenantUsers={tenantUsers}
            roleMap={roleMap}
            userMap={userMap}
            onRemoveUser={onRemoveUser}
            onAddUser={onAddUser}
          />

          <Divider />

          {/* Roles & Permissions */}
          <RolesSection
            tenantId={tenant.id}
            roles={roles}
            permissions={permissions}
            isToggling={isToggling}
            onTogglePermission={onTogglePermission}
            onAddRole={onAddRole}
            onEditRole={onEditRole}
            onDeleteRole={onDeleteRole}
          />
        </Stack>
      </Collapse>
    </Paper>
  );
}