"use client";

import { useState } from "react";
import {
  Container,
  SimpleGrid,
  Stack,
  Text,
  Loader,
  Center,
  Group,
  Button,
  TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useTranslations } from "next-intl";
import { useDebouncedValue } from "@mantine/hooks";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import { usePageGuard } from "@/hooks/usePageGuard";
import { useAppStore } from "@/store/useAppStore";
import { getVisibleTenantIds } from "@/services/tenant/helpers";
import { useUsersQuery } from "./hooks/useUsersQuery";
import { useCreateUser, useUpdateUser, useDeleteUser } from "./hooks/useUserMutations";
import { mapApiUserToUserData } from "@/services/user/types";
import type { UserData, AssignmentData } from "@/services/user/types";
import type { Tenant } from "@/services/tenant/types";
import type { TenantRole } from "@/services/tenant-role/types";
import { EditUserDrawer } from "./_components/UsersTab/EditUserDrawer";
import {
  useCreateTenantUser,
  useUpdateTenantUser,
  useDeleteTenantUser,
} from "./hooks/useTenantUserMutations";
import {
  AddUserModal,
  DeleteConfirmModal,
} from "./_components/UsersTab/UserModals";
import type { UserFormValues } from "./_components/UsersTab/UserModals";
import {
  AddTenantModal,
  EditTenantModal,
  DeleteTenantModal,
} from "./_components/PermissionsTab/TenantModals";
import type { TenantFormValues } from "./_components/PermissionsTab/TenantModals";
import { useTenantsQuery } from "./hooks/useTenantsQuery";
import {
  useCreateTenant,
  useUpdateTenant,
  useDeleteTenant,
} from "./hooks/useTenantMutations";
import type { TenantCreateRequest, TenantUpdateRequest } from "@/services/tenant/types";
import {
  AddRoleModal,
  EditRoleModal,
  DeleteRoleModal,
} from "./_components/RolesTab/RolesModals";
import type { RoleFormValues } from "./_components/RolesTab/RolesModals";
import { useTenantRolesQuery } from "./hooks/useTenantRolesQuery";
import {
  useCreateTenantRole,
  useUpdateTenantRole,
  useDeleteTenantRole,
} from "./hooks/useTenantRoleMutations";
import type { TenantRoleCreateRequest, TenantRoleUpdateRequest } from "@/services/tenant-role/types";
import { useTenantUsersQuery } from "./hooks/useTenantUsersQuery";
import { useTenantPermissionsQuery } from "./hooks/useTenantPermissionsQuery";
import {
  useCreateTenantPermission,
  useDeleteTenantPermission,
} from "./hooks/useTenantPermissionMutations";
import { TenantCard } from "./_components/TenantCard/TenantCard";
import { ActionGuard } from "@/components/ActionGuard";

export default function UserManagementPage() {
  const t = useTranslations("userManagement");
  const tc = useTranslations("common");
  const { allowed, loading } = usePageGuard("ListUsers");
  if (loading) return <Center mih="100vh"><Loader /></Center>;
  if (!allowed) return null;
  const currentTenantId = useAppStore((s) => s.user?.tenant_id ?? "");
  const isSuperAdmin = useAppStore((s) => s.isSuperAdmin);

  // ── Search ──
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch] = useDebouncedValue(searchQuery, 300);

  // ── Users queries ──
  const {
    data: usersData,
    isLoading: usersLoading,
    error: queryError,
  } = useUsersQuery(debouncedSearch);

  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();
  const createTenantUser = useCreateTenantUser();
  const updateTenantUser = useUpdateTenantUser();
  const deleteTenantUser = useDeleteTenantUser();

  const { data: tenantUsers = [] } = useTenantUsersQuery();
  const { data: tenants = [] } = useTenantsQuery();
  const { data: roles = [] } = useTenantRolesQuery();
  const { data: permissions = [], isLoading: permissionsLoading } = useTenantPermissionsQuery(roles.map((r) => r.id));

  // ── Tenant-scoped filtering ──
  const visibleTenantIds = getVisibleTenantIds(currentTenantId, tenants, isSuperAdmin);
  const scopedTenants = isSuperAdmin ? tenants : tenants.filter((t) => visibleTenantIds.includes(t.id));
  const scopedRoles = isSuperAdmin ? roles : roles.filter((r) => visibleTenantIds.includes(r.tenantID));
  const scopedPermissions = isSuperAdmin ? permissions : permissions.filter((p) => {
    const role = roles.find((r) => r.id === p.roleID);
    return role ? visibleTenantIds.includes(role.tenantID) : false;
  });
  const scopedTenantUsers = isSuperAdmin ? tenantUsers : tenantUsers.filter((tu) => visibleTenantIds.includes(tu.tenantID));

  // ── Lookup maps ──
  const tenantMap = new Map(scopedTenants.map((t) => [t.id, t.name]));
  const roleMap = new Map(scopedRoles.map((r) => [r.id, r.name]));

  // Build userMap: userId → username (needed for tenant cards)
  const allUsers: UserData[] = (usersData?.pages.flatMap((p) => p.items.map(mapApiUserToUserData)) ?? []);
  const userMap = new Map(allUsers.map((u) => [u.id, u.username]));

  // ── Users state (modals/drawers) ──
  const [addOpened, { open: openAdd, close: closeAdd }] = useDisclosure(false);
  const [deleteOpened, { open: openDelete, close: closeDelete }] = useDisclosure(false);
  const [editOpened, { open: openEdit, close: closeEdit }] = useDisclosure(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);

  // Enrich users with assignments for the EditUserDrawer
  const permissionMap = new Map<string, string[]>();
  for (const p of scopedPermissions) {
    const list = permissionMap.get(p.roleID) ?? [];
    list.push(p.action);
    permissionMap.set(p.roleID, list);
  }

  const usersWithAssignments: UserData[] = allUsers.map((user) => {
    const assignments: AssignmentData[] = scopedTenantUsers
      .filter((tu) => tu.userID === user.id)
      .map((tu) => ({
        id: tu.id,
        tenantId: tu.tenantID,
        tenantName: tenantMap.get(tu.tenantID) ?? "—",
        roleId: tu.tenantRoleID,
        roleName: roleMap.get(tu.tenantRoleID) ?? "—",
        permissions: permissionMap.get(tu.tenantRoleID) ?? [],
      }));
    return { ...user, assignments };
  });

  const handleAddUser = (formData: UserFormValues) => {
    createUser.mutate(
      { username: formData.username, password: formData.password, tenant_id: currentTenantId },
      {
        onSuccess: () => {
          closeAdd();
          notifications.show({ title: tc("success"), message: t("success.userAdded"), color: "green" });
        },
        onError: (err: any) => {
          const msg = err?.message || t("error.createFailed");
          notifications.show({ title: tc("error"), message: msg, color: "red" });
        },
      }
    );
  };

  const handleEdit = (user: UserData) => { setSelectedUser(user); openEdit(); };

  const handleSave = (updatedUser: UserData, updatedAssignments: AssignmentData[]) => {
    const originalAssignments = selectedUser?.assignments ?? [];
    const added = updatedAssignments.filter((a) => a.id.startsWith("new-"));
    const removed = originalAssignments.filter(
      (orig) => !updatedAssignments.some((a) => a.id === orig.id)
    );
    const changed = updatedAssignments.filter((a) => {
      if (a.id.startsWith("new-")) return false;
      const orig = originalAssignments.find((o) => o.id === a.id);
      return orig && orig.roleId !== a.roleId;
    });

    updateUser.mutate(
      { id: updatedUser.id, data: { username: updatedUser.username, tenant_id: currentTenantId } },
      {
        onSuccess: () => {
          added.forEach((a) => {
            createTenantUser.mutate({
              user_id: updatedUser.id,
              tenant_id: a.tenantId,
              tenant_role_id: a.roleId,
            });
          });
          removed.forEach((a) => {
            deleteTenantUser.mutate(a.id);
          });
          changed.forEach((a) => {
            updateTenantUser.mutate({ id: a.id, data: { tenant_role_id: a.roleId } });
          });
          closeEdit();
          notifications.show({ title: tc("success"), message: t("success.userUpdated"), color: "green" });
        },
        onError: (err: any) => {
          const msg = err?.message || t("error.updateFailed");
          notifications.show({ title: tc("error"), message: msg, color: "red" });
        },
      }
    );
  };

  const handleDelete = (user: UserData) => { setSelectedUser(user); openDelete(); };

  const handleDeleteConfirm = () => {
    if (!selectedUser) return;
    deleteUser.mutate(selectedUser.id, {
      onSuccess: () => {
        closeDelete();
        notifications.show({ title: tc("success"), message: t("success.userDeleted"), color: "green" });
      },
      onError: (err: any) => {
        const msg = err?.message || t("error.deleteFailed");
        notifications.show({ title: tc("error"), message: msg, color: "red" });
      },
    });
  };

  // ── Tenants state ──
  const [addTenantOpened, { open: openAddTenant, close: closeAddTenant }] = useDisclosure(false);
  const [editTenantOpened, { open: openEditTenant, close: closeEditTenant }] = useDisclosure(false);
  const [deleteTenantOpened, { open: openDeleteTenant, close: closeDeleteTenant }] = useDisclosure(false);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);

  const createTenant = useCreateTenant();
  const updateTenant = useUpdateTenant();
  const deleteTenant = useDeleteTenant();

  const handleAddTenant = (data: TenantFormValues) => {
    createTenant.mutate({ name: data.name, parent_id: data.parent_id }, {
      onSuccess: () => {
        closeAddTenant();
        notifications.show({ title: tc("success"), message: t("tenants.success.created"), color: "green" });
      },
      onError: (err: any) => {
        const msg = err?.message || t("tenants.error.createFailed");
        notifications.show({ title: tc("error"), message: msg, color: "red" });
      },
    });
  };

  const handleEditTenant = (tenant: Tenant) => { setSelectedTenant(tenant); openEditTenant(); };

  const handleUpdateTenant = (data: TenantUpdateRequest) => {
    if (!selectedTenant) return;
    updateTenant.mutate({ id: selectedTenant.id, data }, {
      onSuccess: () => {
        closeEditTenant();
        notifications.show({ title: tc("success"), message: t("tenants.success.updated"), color: "green" });
      },
      onError: (err: any) => {
        const msg = err?.message || t("tenants.error.updateFailed");
        notifications.show({ title: tc("error"), message: msg, color: "red" });
      },
    });
  };

  const handleDeleteTenant = (tenant: Tenant) => { setSelectedTenant(tenant); openDeleteTenant(); };

  const handleDeleteTenantConfirm = () => {
    if (!selectedTenant) return;
    deleteTenant.mutate(selectedTenant.id, {
      onSuccess: () => {
        closeDeleteTenant();
        notifications.show({ title: tc("success"), message: t("tenants.success.deleted"), color: "green" });
      },
      onError: (err: any) => {
        const msg = err?.message || t("tenants.error.deleteFailed");
        notifications.show({ title: tc("error"), message: msg, color: "red" });
      },
    });
  };

  // ── Roles state ──
  const [addRoleOpened, { open: openAddRole, close: closeAddRole }] = useDisclosure(false);
  const [editRoleOpened, { open: openEditRole, close: closeEditRole }] = useDisclosure(false);
  const [deleteRoleOpened, { open: openDeleteRole, close: closeDeleteRole }] = useDisclosure(false);
  const [selectedRole, setSelectedRole] = useState<TenantRole | null>(null);

  const createRole = useCreateTenantRole();
  const updateRole = useUpdateTenantRole();
  const deleteRole = useDeleteTenantRole();

  // ── Role permissions ──
  const createPerm = useCreateTenantPermission();
  const deletePerm = useDeleteTenantPermission();

  const handleAddRole = (data: TenantRoleCreateRequest) => {
    createRole.mutate(data, {
      onSuccess: () => {
        closeAddRole();
        notifications.show({ title: tc("success"), message: t("roles.success.created"), color: "green" });
      },
      onError: (err: any) => {
        const msg = err?.message || t("roles.error.createFailed");
        notifications.show({ title: tc("error"), message: msg, color: "red" });
      },
    });
  };

  const handleEditRole = (role: TenantRole) => {
    setSelectedRole(role);
    openEditRole();
  };

  const handleUpdateRole = (data: TenantRoleUpdateRequest) => {
    if (!selectedRole) return;
    updateRole.mutate({ id: selectedRole.id, data }, {
      onSuccess: () => {
        closeEditRole();
        notifications.show({ title: tc("success"), message: t("roles.success.updated"), color: "green" });
      },
      onError: (err: any) => {
        const msg = err?.message || t("roles.error.updateFailed");
        notifications.show({ title: tc("error"), message: msg, color: "red" });
      },
    });
  };

  const handleDeleteRole = (role: TenantRole) => { setSelectedRole(role); openDeleteRole(); };

  const handleDeleteRoleConfirm = () => {
    if (!selectedRole) return;
    deleteRole.mutate(selectedRole.id, {
      onSuccess: () => {
        closeDeleteRole();
        notifications.show({ title: tc("success"), message: t("roles.success.deleted"), color: "green" });
      },
      onError: (err: any) => {
        const msg = err?.message || t("roles.error.deleteFailed");
        notifications.show({ title: tc("error"), message: msg, color: "red" });
      },
    });
  };

  // ── Permission toggle (scoped to a role) ──
  const [togglingRole, setTogglingRole] = useState<string | null>(null);

  const handleTogglePermission = (roleId: string, action: string, enabled: boolean) => {
    setTogglingRole(roleId);
    if (enabled) {
      createPerm.mutate(
        { roleId, actions: [action] },
        {
          onSuccess: () => {
            notifications.show({ title: tc("success"), message: t("roles.permissions.success.permissionAdded"), color: "green" });
          },
          onError: (err: any) => {
            const msg = err?.message || t("roles.permissions.error.permissionAddFailed");
            notifications.show({ title: tc("error"), message: msg, color: "red" });
          },
        }
      );
    } else {
      deletePerm.mutate(
        { roleId, actions: [action] },
        {
          onSuccess: () => {
            notifications.show({ title: tc("success"), message: t("roles.permissions.success.permissionRemoved"), color: "green" });
          },
          onError: (err: any) => {
            const msg = err?.message || t("roles.permissions.error.permissionRemoveFailed");
            notifications.show({ title: tc("error"), message: msg, color: "red" });
          },
        }
      );
    }
  };

  // ── Organize tenants by hierarchy ──
  // Root tenant (id === "1" or parentID === "0") is excluded from the card grid
  const ROOT_IDS = new Set(["1", "0"]);
  const displayTenants = scopedTenants.filter((t) => !ROOT_IDS.has(t.id));

  // Build ordered list: parents first, then their children (deduplicated)
  const addedIds = new Set<string>();
  const orderedTenants: Tenant[] = [];

  // Parents = tenants that have at least one child in displayTenants
  const parentTenants = displayTenants.filter(
    (t) => displayTenants.some((child) => child.parentID === t.id)
  );

  for (const pt of parentTenants) {
    if (!addedIds.has(pt.id)) {
      orderedTenants.push(pt);
      addedIds.add(pt.id);
    }
    for (const child of displayTenants.filter((t) => t.parentID === pt.id)) {
      if (!addedIds.has(child.id)) {
        orderedTenants.push(child);
        addedIds.add(child.id);
      }
    }
  }
  // Add any remaining tenants not yet added (orphans or agents whose parent was excluded)
  for (const t of displayTenants) {
    if (!addedIds.has(t.id)) orderedTenants.push(t);
  }

  // ── Remove user from tenant ──
  const handleRemoveUserFromTenant = (tenantUserId: string) => {
    deleteTenantUser.mutate(tenantUserId, {
      onSuccess: () => {
        notifications.show({ title: tc("success"), message: "User removed from tenant", color: "green" });
      },
      onError: (err: any) => {
        const msg = err?.message || "Failed to remove user";
        notifications.show({ title: tc("error"), message: msg, color: "red" });
      },
    });
  };

  if (queryError) {
    return (
      <Container size="xl" py="md">
        <Text c="red">{t("error.loadFailed")}</Text>
      </Container>
    );
  }

  return (
    <Container size="xl" py="md">
      {/* Page title */}
      <Text fz="xl" fw={700} mb="md">{t("title")}</Text>

      {/* Toolbar */}
      <Group justify="space-between" mb="md">
        <TextInput
          placeholder="Search users..."
          leftSection={<IconSearch size={16} />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.currentTarget.value)}
          w={280}
        />
        <Group gap="sm">
          <ActionGuard action="CreateTenant">
            <Button variant="light" size="xs" leftSection={<IconPlus size={16} />} onClick={openAddTenant}>
              Add Tenant
            </Button>
          </ActionGuard>
          <ActionGuard action="CreateUser">
            <Button size="xs" leftSection={<IconPlus size={16} />} onClick={openAdd}>
              Add User
            </Button>
          </ActionGuard>
        </Group>
      </Group>

      {/* Tenant card grid */}
      {usersLoading ? (
        <Center py="xl"><Loader /></Center>
      ) : (
        <SimpleGrid
          cols={{ base: 1, sm: 2, lg: 3 }}
          spacing="md"
        >
          {orderedTenants.map((tenant) => {
            const isChild = parentTenants.some((p) => tenant.parentID === p.id);
            const tenantTuList = scopedTenantUsers.filter((tu) => tu.tenantID === tenant.id);
            const tenantRoles = scopedRoles.filter((r) => r.tenantID === tenant.id);
            const tenantPerms = scopedPermissions.filter((p) =>
              tenantRoles.some((r) => r.id === p.roleID)
            );
            const parentName = isChild
              ? tenantMap.get(tenant.parentID) ?? undefined
              : undefined;

            return (
              <TenantCard
                key={tenant.id}
                tenant={tenant}
                parentName={parentName}
                tenantUsers={tenantTuList}
                roles={tenantRoles}
                permissions={tenantPerms}
                roleMap={roleMap}
                userMap={userMap}
                isToggling={togglingRole !== null && (createPerm.isPending || deletePerm.isPending)}
                onTogglePermission={(roleId, action, enabled) => handleTogglePermission(roleId, action, enabled)}
                onEditTenant={handleEditTenant}
                onDeleteTenant={handleDeleteTenant}
                onAddUser={openAdd}
                onRemoveUser={handleRemoveUserFromTenant}
                onAddRole={openAddRole}
                onEditRole={handleEditRole}
                onDeleteRole={handleDeleteRole}
              />
            );
          })}
        </SimpleGrid>
      )}

      {/* Users modals */}
      <AddUserModal opened={addOpened} onClose={closeAdd} onSave={handleAddUser} loading={createUser.isPending} />
      <DeleteConfirmModal opened={deleteOpened} onClose={closeDelete} onConfirm={handleDeleteConfirm} userName={selectedUser?.username ?? ""} loading={deleteUser.isPending} />
      <EditUserDrawer opened={editOpened} onClose={closeEdit} user={selectedUser} onSave={handleSave} loading={updateUser.isPending} tenants={scopedTenants} roles={scopedRoles} />

      {/* Tenant modals */}
      <AddTenantModal opened={addTenantOpened} onClose={closeAddTenant} onSave={handleAddTenant} tenants={scopedTenants} loading={createTenant.isPending} />
      <EditTenantModal opened={editTenantOpened} onClose={closeEditTenant} tenant={selectedTenant} onSave={handleUpdateTenant} tenants={scopedTenants} loading={updateTenant.isPending} />
      <DeleteTenantModal opened={deleteTenantOpened} onClose={closeDeleteTenant} onConfirm={handleDeleteTenantConfirm} tenantName={selectedTenant?.name ?? ""} loading={deleteTenant.isPending} />

      {/* Role modals */}
      <AddRoleModal opened={addRoleOpened} onClose={closeAddRole} onSave={handleAddRole} loading={createRole.isPending} tenants={scopedTenants} />
      <EditRoleModal opened={editRoleOpened} onClose={closeEditRole} role={selectedRole} onSave={handleUpdateRole} loading={updateRole.isPending} tenants={scopedTenants} />
      <DeleteRoleModal opened={deleteRoleOpened} onClose={closeDeleteRole} onConfirm={handleDeleteRoleConfirm} roleName={selectedRole?.name ?? ""} loading={deleteRole.isPending} />
    </Container>
  );
}