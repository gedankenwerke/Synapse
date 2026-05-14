"use client";

import { useRef, useState, useEffect } from "react";
import { SimpleGrid, Paper, Text } from "@mantine/core";
import { AreaChart, DonutChart } from "@mantine/charts";
import { useTranslations } from "next-intl";
import { AREA_CHART_DATA, DONUT_CHART_DATA } from "./mockData";

function useContainerReady() {
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (el.offsetWidth > 0) {
      setReady(true);
      return;
    }
    const observer = new ResizeObserver(([entry]) => {
      if (entry.contentRect.width > 0) {
        setReady(true);
        observer.disconnect();
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, ready };
}

export function DashboardCharts() {
  const t = useTranslations("dashboard");
  const { ref, ready } = useContainerReady();

  return (
    <SimpleGrid cols={{ base: 1, md: 3 }}>
      <Paper ref={ref} shadow="sm" p="md" radius="md" style={{ gridColumn: "span 2 / span 2" }}>
        <Text fw={600} mb="sm">
          {t("charts.depositVsWithdrawal")}
        </Text>
        {ready && (
          <AreaChart
            h={300}
            data={AREA_CHART_DATA}
            series={[
              { name: "Deposits", color: "orange.6" },
              { name: "Withdrawals", color: "gray.6" },
            ]}
            dataKey="date"
            type="default"
            curveType="monotone"
            withGradient
            withDots
            strokeWidth={2}
            fillOpacity={0.2}
          />
        )}
      </Paper>
      <Paper shadow="sm" p="md" radius="md">
        <Text fw={600} mb="sm">
          {t("charts.transactionStatus")}
        </Text>
        <DonutChart
          data={DONUT_CHART_DATA}
          size={220}
          thickness={20}
          withLabels
          labelsType="percent"
          withTooltip
        />
      </Paper>
    </SimpleGrid>
  );
}