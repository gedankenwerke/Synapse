"use client";

import { Container, Stack, Text } from "@mantine/core";
import { useTranslations } from "next-intl";
import { StatCards } from "@/app/[locale]/(dashboard)/dashboard/_components/StatCards";
import { DashboardCharts } from "@/app/[locale]/(dashboard)/dashboard/_components/DashboardCharts";
import { RecentTable } from "@/app/[locale]/(dashboard)/dashboard/_components/RecentTable";
import { useDashboardData } from "@/app/[locale]/(dashboard)/dashboard/hooks/useDashboardData";
import type { UserRole } from "@/services/authentication/types";

interface DashboardViewProps {
  role: UserRole;
}

export function DashboardView({ role }: DashboardViewProps) {
  const t = useTranslations("dashboard");
  const { statCards, areaChartData, donutChartData, recentTransactions, isLoading } = useDashboardData();

  return (
    <Container size="xl" py="md">
      <Stack gap="md">
        <Text fz="xl" fw={700}>
          {t("title")}
        </Text>
        <StatCards statCards={statCards} isLoading={isLoading} />
        <DashboardCharts areaData={areaChartData} donutData={donutChartData} isLoading={isLoading} />
        <RecentTable transactions={recentTransactions} isLoading={isLoading} />
      </Stack>
    </Container>
  );
}