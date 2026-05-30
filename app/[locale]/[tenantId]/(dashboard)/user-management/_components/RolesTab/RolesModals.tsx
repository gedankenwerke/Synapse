"use client";

import { useTranslations } from "next-intl";
import {
  Modal,
  SimpleGrid,
  TextInput,
  Button,
  Group,
  Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import type { TenantRole } from "@/services/tenant-role/types";

export interface RoleFormValues {
  name: string;
  tenant_id: string;
}

interface AddRoleModalProps {
  opened: boolean;
  onClose: () => void;
  onSave: (data: RoleFormValues) => void;
  loading?: boolean;
}

export function AddRoleModal({
  opened,
  onClose,
  onSave,
  loading,
}: AddRoleModalProps) {
  const t = useTranslations("userManagement.roles");
  const tc = useTranslations("common");

  const form = useForm<{ name: string }>({
    initialValues: { name: "" },
    validate: {
      name: (val) =>
        val.trim().length > 0 ? null : t("validation.nameRequired"),
    },
  });

  const handleSubmit = (values: { name: string }) => {
    // tenant_id is set by parent — not needed in form
    onSave({ name: values.name, tenant_id: "" });
    form.reset();
  };

  return (
    <Modal opened={opened} onClose={onClose} title={t("modal.addTitle")} size="lg" centered>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <SimpleGrid cols={1}>
          <TextInput
            label={t("modal.nameLabel")}
            placeholder={t("modal.namePlaceholder")}
            {...form.getInputProps("name")}
          />
        </SimpleGrid>
        <Group justify="flex-end" mt="xl">
          <Button variant="default" onClick={onClose} disabled={loading}>
            {tc("cancel")}
          </Button>
          <Button type="submit" loading={loading}>
            {tc("save")}
          </Button>
        </Group>
      </form>
    </Modal>
  );
}

interface EditRoleModalProps {
  opened: boolean;
  onClose: () => void;
  onSave: (data: RoleFormValues) => void;
  loading?: boolean;
  role: TenantRole | null;
}

export function EditRoleModal({
  opened,
  onClose,
  onSave,
  loading,
  role,
}: EditRoleModalProps) {
  const t = useTranslations("userManagement.roles");
  const tc = useTranslations("common");

  const form = useForm<{ name: string }>({
    initialValues: { name: role?.Name ?? "" },
    validate: {
      name: (val) =>
        val.trim().length > 0 ? null : t("validation.nameRequired"),
    },
  });

  const handleSubmit = (values: { name: string }) => {
    onSave({ name: values.name, tenant_id: "" });
  };

  return (
    <Modal opened={opened} onClose={onClose} title={t("modal.editTitle")} size="lg" centered>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <SimpleGrid cols={1}>
          <TextInput
            label={t("modal.nameLabel")}
            placeholder={t("modal.namePlaceholder")}
            {...form.getInputProps("name")}
          />
        </SimpleGrid>
        <Group justify="flex-end" mt="xl">
          <Button variant="default" onClick={onClose} disabled={loading}>
            {tc("cancel")}
          </Button>
          <Button type="submit" loading={loading}>
            {tc("save")}
          </Button>
        </Group>
      </form>
    </Modal>
  );
}

interface DeleteRoleModalProps {
  opened: boolean;
  onClose: () => void;
  onConfirm: () => void;
  roleName: string;
  loading?: boolean;
}

export function DeleteRoleModal({
  opened,
  onClose,
  onConfirm,
  roleName,
  loading,
}: DeleteRoleModalProps) {
  const t = useTranslations("userManagement.roles");
  const tc = useTranslations("common");

  return (
    <Modal opened={opened} onClose={onClose} title={t("modal.deleteTitle")} centered size="sm">
      <Text>
        {t("modal.deleteConfirmation", { name: roleName })}
      </Text>
      <Group justify="flex-end" mt="xl">
        <Button variant="default" onClick={onClose} disabled={loading}>
          {tc("cancel")}
        </Button>
        <Button color="red" onClick={onConfirm} loading={loading}>
          {tc("confirm")}
        </Button>
      </Group>
    </Modal>
  );
}