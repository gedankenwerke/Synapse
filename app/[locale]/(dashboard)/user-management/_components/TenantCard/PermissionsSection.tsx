"use client";

import { useState } from "react";
import {
  Stack,
  Text,
  Group,
  Checkbox,
  Collapse,
  ActionIcon,
  Badge,
  Divider,
} from "@mantine/core";
import { IconChevronDown, IconChevronRight } from "@tabler/icons-react";
import { PERMISSION_CATEGORIES } from "../RolesTab/permissionActions";
import type { TenantPermission } from "@/services/tenant-permission/types";

interface PermissionsSectionProps {
  roleId: string;
  roleName: string;
  permissions: TenantPermission[];
  allActions: string[];
  isToggling?: boolean;
  onToggle: (action: string, enabled: boolean) => void;
}

export function PermissionsSection({
  roleId,
  roleName,
  permissions,
  allActions,
  isToggling,
  onToggle,
}: PermissionsSectionProps) {
  const [expanded, setExpanded] = useState(false);

  const enabledActions = new Set(permissions.map((p) => p.action));

  return (
    <Stack gap={4}>
      <Group
        gap={4}
        style={{ cursor: "pointer" }}
        onClick={() => setExpanded(!expanded)}
      >
        <ActionIcon variant="subtle" size="xs" color="gray">
          {expanded ? (
            <IconChevronDown size={14} />
          ) : (
            <IconChevronRight size={14} />
          )}
        </ActionIcon>
        <Text size="sm" fw={600}>
          {roleName}
        </Text>
        <Badge variant="light" color="blue" size="sm">
          {permissions.length}/{allActions.length}
        </Badge>
      </Group>

      <Collapse expanded={expanded}>
        <Stack gap="xs" pl="lg">
          {PERMISSION_CATEGORIES.map((cat) => (
            <Stack key={cat.key} gap={2}>
              <Text size="xs" fw={500} c="dimmed" tt="uppercase">
                {cat.key}
              </Text>
              {cat.actions.map((action) => {
                const isEnabled = enabledActions.has(action);
                const isRelevant = allActions.includes(action);
                if (!isRelevant) return null;
                return (
                  <Checkbox
                    key={action}
                    label={action}
                    size="xs"
                    checked={isEnabled}
                    disabled={isToggling}
                    onChange={(e) => onToggle(action, e.currentTarget.checked)}
                    styles={{
                      label: { fontSize: "11px" },
                    }}
                  />
                );
              })}
              <Divider my={4} />
            </Stack>
          ))}
        </Stack>
      </Collapse>
    </Stack>
  );
}