"use client";

import { Container, Stack, Text } from "@mantine/core";
import { useTranslations } from "next-intl";
import { StatCards } from "./_components/StatCards";
import { DashboardCharts } from "./_components/DashboardCharts";
import { RecentTable } from "./_components/RecentTable";

export default function DashboardPage() {
  const t = useTranslations("dashboard");

  return (
    <Container size="xl" py="md">
      <Stack gap="md">
        <Text fz="xl" fw={700}>
          {t("title")}
        </Text>
        <StatCards />
        <DashboardCharts />
        <RecentTable />
      </Stack>
    </Container>
  );
}