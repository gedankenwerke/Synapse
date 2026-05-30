"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Group,
  TextInput,
  Button,
  Table,
  ActionIcon,
  Text,
  ScrollArea,
  Center,
  Loader,
  Stack,
} from "@mantine/core";
import { IconSearch, IconPlus, IconPencil, IconTrash, IconEdit } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { useDisclosure } from "@mantine/hooks";
import type { TenantRole } from "@/services/tenant-role/types";
import { EditRoleDrawer } from "./EditRoleDrawer";
import {
  AddRoleModal,
  EditRoleModal,
  DeleteRoleModal,
} from "./RolesModals";
import type { RoleFormValues } from "./RolesModals";
import { useCreateTenantRole, useUpdateTenantRole, useDeleteTenantRole } from "../../hooks/useTenantRoleMutations";
import { useTenantRolesQuery } from "../../hooks/useTenantRolesQuery";

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

interface RolesTabProps {
  tenantId: string;
}

export function RolesTab({ tenantId }: RolesTabProps) {
  const t = useTranslations("userManagement");
  const tr = useTranslations("userManagement.roles");
  const tc = useTranslations("common");

  const { data: roles = [], isLoading } = useTenantRolesQuery();
  const createRole = useCreateTenantRole();
  const updateRole = useUpdateTenantRole();
  const deleteRole = useDeleteTenantRole();

  // Filter state
  const [roleSearch, setRoleSearch] = useState("");

  // EditRoleDrawer state
  const [drawerOpened, { open: openDrawer, close: closeDrawer }] = useDisclosure(false);
  const [selectedRole, setSelectedRole] = useState<TenantRole | null>(null);

  // Role CRUD modals
  const [addOpened, { open: openAdd, close: closeAdd }] = useDisclosure(false);
  const [editOpened, { open: openEdit, close: closeEdit }] = useDisclosure(false);
  const [deleteOpened, { open: openDelete, close: closeDelete }] = useDisclosure(false);
  const [editRole, setEditRole] = useState<TenantRole | null>(null);
  const [deleteRole2, setDeleteRole2] = useState<TenantRole | null>(null);

  // Filter roles: only show roles belonging to the current tenant
  const filteredRoles = roles.filter((r) => {
    if (r.TenantID !== tenantId) return false;
    if (roleSearch && !r.Name.toLowerCase().includes(roleSearch.toLowerCase())) return false;
    return true;
  });

  // Handlers
  const handleEditPermissions = (role: TenantRole) => {
    setSelectedRole(role);
    openDrawer();
  };

  const handleEditRole = (role: TenantRole) => {
    setEditRole(role);
    openEdit();
  };

  const handleDeleteRole = (role: TenantRole) => {
    setDeleteRole2(role);
    openDelete();
  };

  const handleCreateRole = (values: RoleFormValues) => {
    // Force tenant_id to current tenant
    createRole.mutate({ ...values, tenant_id: tenantId }, {
      onSuccess: () => {
        closeAdd();
        notifications.show({ title: tc("success"), message: tr("success.created"), color: "green" });
      },
      onError: (err: any) => {
        notifications.show({ title: tc("error"), message: err?.message || tr("error.createFailed"), color: "red" });
      },
    });
  };

  const handleUpdateRole = (values: RoleFormValues) => {
    if (!editRole) return;
    updateRole.mutate(
      { id: editRole.ID, data: values },
      {
        onSuccess: () => {
          closeEdit();
          notifications.show({ title: tc("success"), message: tr("success.updated"), color: "green" });
        },
        onError: (err: any) => {
          notifications.show({ title: tc("error"), message: err?.message || tr("error.updateFailed"), color: "red" });
        },
      }
    );
  };

  const handleDeleteConfirm = () => {
    if (!deleteRole2) return;
    deleteRole.mutate(deleteRole2.ID, {
      onSuccess: () => {
        closeDelete();
        notifications.show({ title: tc("success"), message: tr("success.deleted"), color: "green" });
      },
      onError: (err: any) => {
        notifications.show({ title: tc("error"), message: err?.message || tr("error.deleteFailed"), color: "red" });
      },
    });
  };

  if (isLoading) {
    return (
      <Center py="xl">
        <Loader />
      </Center>
    );
  }

  return (
    <Stack gap="md">
      {/* Filter bar */}
      <Group justify="space-between">
        <Group gap="sm">
          <TextInput
            placeholder={tr("searchPlaceholder")}
            leftSection={<IconSearch size={16} />}
            value={roleSearch}
            onChange={(e) => setRoleSearch(e.currentTarget.value)}
            w={250}
          />
          <Button leftSection={<IconPlus size={16} />} onClick={openAdd}>
            {tr("addRole")}
          </Button>
        </Group>
      </Group>

      {/* Roles table */}
      <ScrollArea>
        <Table striped highlightOnHover withTableBorder>
          <Table.Thead>
            <Table.Tr>
              <Table.Th><Text size="sm" fw={500}>{tr("colName")}</Text></Table.Th>
              <Table.Th><Text size="sm" fw={500}>{tr("colCreated")}</Text></Table.Th>
              <Table.Th><Text size="sm" fw={500}>{""}</Text></Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {filteredRoles.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={3}>
                  <Text c="dimmed" ta="center" py="lg">No roles found</Text>
                </Table.Td>
              </Table.Tr>
            ) : (
              filteredRoles.map((role) => (
                <Table.Tr key={role.ID}>
                  <Table.Td><Text size="sm" fw={500}>{role.Name}</Text></Table.Td>
                  <Table.Td><Text size="sm">{formatThaiDate(role.CreatedAt)}</Text></Table.Td>
                  <Table.Td>
                    <Group gap={4} wrap="nowrap">
                      <ActionIcon variant="subtle" color="blue" onClick={() => handleEditPermissions(role)} aria-label="Edit permissions">
                        <IconPencil size={16} />
                      </ActionIcon>
                      <ActionIcon variant="subtle" color="gray" onClick={() => handleEditRole(role)} aria-label="Edit role details">
                        <IconEdit size={16} />
                      </ActionIcon>
                      <ActionIcon variant="subtle" color="red" onClick={() => handleDeleteRole(role)} aria-label="Delete role">
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))
            )}
          </Table.Tbody>
        </Table>
      </ScrollArea>

      {/* Edit permissions drawer */}
      <EditRoleDrawer
        opened={drawerOpened}
        onClose={closeDrawer}
        role={selectedRole}
      />

      {/* Role CRUD modals */}
      <AddRoleModal
        opened={addOpened}
        onClose={closeAdd}
        onSave={handleCreateRole}
        loading={createRole.isPending}
      />
      <EditRoleModal
        opened={editOpened}
        onClose={closeEdit}
        onSave={handleUpdateRole}
        loading={updateRole.isPending}
        role={editRole}
      />
      <DeleteRoleModal
        opened={deleteOpened}
        onClose={closeDelete}
        onConfirm={handleDeleteConfirm}
        roleName={deleteRole2?.Name ?? ""}
        loading={deleteRole.isPending}
      />
    </Stack>
  );
}