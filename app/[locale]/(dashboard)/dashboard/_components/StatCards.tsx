"use client";

import { SimpleGrid, Paper, Text, Group, ThemeIcon } from "@mantine/core";
import {
  IconWallet,
  IconArrowDown,
  IconArrowUp,
  IconUsers,
  IconTrendingUp,
  IconTrendingDown,
} from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { STAT_CARDS } from "./mockData";

const ICON_MAP = {
  wallet: IconWallet,
  deposit: IconArrowDown,
  withdrawal: IconArrowUp,
  users: IconUsers,
} as const;

export function StatCards() {
  const t = useTranslations("dashboard");

  return (
    <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }}>
      {STAT_CARDS.map((card) => {
        const Icon = ICON_MAP[card.icon as keyof typeof ICON_MAP];
        const isPositive = card.change >= 0;
        return (
          <Paper key={card.titleKey} shadow="sm" p="md" radius="md">
            <Group justify="space-between" mb="xs">
              <Text size="sm" c="dimmed">
                {t(`stats.${card.titleKey}`)}
              </Text>
              <ThemeIcon variant="light" size="sm" color="orange">
                <Icon size={16} />
              </ThemeIcon>
            </Group>
            <Text fw={700} fz="xl">
              {card.value}
            </Text>
            <Group gap={4} mt={4}>
              {isPositive ? (
                <IconTrendingUp size={14} color="var(--mantine-color-green-6)" />
              ) : (
                <IconTrendingDown size={14} color="var(--mantine-color-red-6)" />
              )}
              <Text size="xs" c={isPositive ? "green" : "red"}>
                {isPositive ? "+" : ""}
                {card.change}% {t("stats.fromLastWeek")}
              </Text>
            </Group>
          </Paper>
        );
      })}
    </SimpleGrid>
  );
}