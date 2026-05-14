"use client";

import {
  Modal,
  TextInput,
  Button,
  Group,
  Text,
  Alert,
  Code,
  Stack,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useClipboard } from "@mantine/hooks";
import { IconAlertTriangle, IconCopy } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import type { ApiKeyData, ConfirmAction } from "./mockData";

interface CreateKeyModalProps {
  opened: boolean;
  onClose: () => void;
  onCreate: (keyName: string) => void;
}

export function CreateKeyModal({ opened, onClose, onCreate }: CreateKeyModalProps) {
  const t = useTranslations("apiKeys");
  const tc = useTranslations("common");

  const form = useForm({
    initialValues: { keyName: "" },
    validate: {
      keyName: (val: string) =>
        val.trim().length > 0 ? null : t("validation.keyNameRequired"),
    },
  });

  const handleSubmit = (values: { keyName: string }) => {
    onCreate(values.keyName.trim());
    form.reset();
  };

  return (
    <Modal
      opened={opened}
      onClose={() => {
        form.reset();
        onClose();
      }}
      title={t("modal.generateTitle")}
      centered
      size="md"
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label={t("modal.keyNameLabel")}
          placeholder={t("modal.keyNamePlaceholder")}
          {...form.getInputProps("keyName")}
        />
        <Group justify="flex-end" mt="xl">
          <Button
            variant="default"
            onClick={() => {
              form.reset();
              onClose();
            }}
          >
            {tc("cancel")}
          </Button>
          <Button type="submit">{t("modal.generate")}</Button>
        </Group>
      </form>
    </Modal>
  );
}

interface SuccessKeyModalProps {
  opened: boolean;
  onClose: () => void;
  apiKey: string;
  keyName: string;
}

export function SuccessKeyModal({
  opened,
  onClose,
  apiKey,
  keyName,
}: SuccessKeyModalProps) {
  const t = useTranslations("apiKeys");
  const clipboard = useClipboard({ timeout: 3000 });

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={t("modal.successTitle")}
      centered
      size="md"
      closeOnClickOutside={false}
    >
      <Stack gap="md">
        <Alert
          color="red"
          icon={<IconAlertTriangle size={18} />}
          variant="light"
        >
          {t("modal.securityWarning")}
        </Alert>

        <div>
          <Text size="sm" fw={500} mb={4}>
            {t("modal.keyName")}
          </Text>
          <Text size="sm">{keyName}</Text>
        </div>

        <div>
          <Text size="sm" fw={500} mb={4}>
            {t("modal.apiKey")}
          </Text>
          <Code block style={{ fontSize: "0.85rem", wordBreak: "break-all" }}>
            {apiKey}
          </Code>
        </div>

        <Button
          size="md"
          leftSection={<IconCopy size={18} />}
          onClick={() => clipboard.copy(apiKey)}
          color={clipboard.copied ? "green" : undefined}
        >
          {clipboard.copied ? t("modal.copiedToClipboard") : t("modal.copyToClipboard")}
        </Button>
      </Stack>
    </Modal>
  );
}

interface RevokeDeleteModalProps {
  opened: boolean;
  onClose: () => void;
  onConfirm: () => void;
  action: ConfirmAction;
  keyName: string;
}

export function RevokeDeleteModal({
  opened,
  onClose,
  onConfirm,
  action,
  keyName,
}: RevokeDeleteModalProps) {
  const t = useTranslations("apiKeys");
  const tc = useTranslations("common");
  const isRevoke = action === "revoke";

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={isRevoke ? t("modal.revokeTitle") : t("modal.deleteTitle")}
      centered
      size="sm"
    >
      <Text>
        {isRevoke
          ? t("modal.revokeConfirmation", { name: keyName })
          : t("modal.deleteConfirmation", { name: keyName })}
      </Text>
      <Group justify="flex-end" mt="xl">
        <Button variant="default" onClick={onClose}>
          {tc("cancel")}
        </Button>
        <Button color={isRevoke ? "orange" : "red"} onClick={onConfirm}>
          {isRevoke ? t("modal.revoke") : t("modal.delete")}
        </Button>
      </Group>
    </Modal>
  );
}