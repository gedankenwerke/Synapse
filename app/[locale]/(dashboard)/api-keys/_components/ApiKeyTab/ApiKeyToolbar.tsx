"use client";

import { Group, TextInput, Button } from "@mantine/core";
import { IconSearch, IconPlus } from "@tabler/icons-react";
import { useTranslations } from "next-intl";

interface ApiKeyToolbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onGenerateNew: () => void;
}

export function ApiKeyToolbar({
  searchValue,
  onSearchChange,
  onGenerateNew,
}: ApiKeyToolbarProps) {
  const t = useTranslations("apiKeys");

  return (
    <Group justify="space-between" mb="md">
      <Group gap="xs">
        <TextInput
          placeholder={t("searchPlaceholder")}
          leftSection={<IconSearch size={16} />}
          value={searchValue}
          onChange={(e) => onSearchChange(e.currentTarget.value)}
          w={250}
        />
      </Group>

      <Group gap="xs">
        <Button leftSection={<IconPlus size={16} />} onClick={onGenerateNew}>
          {t("generateNewKey")}
        </Button>
      </Group>
    </Group>
  );
}