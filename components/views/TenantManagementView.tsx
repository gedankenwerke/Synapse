"use client";

import { Container, Stack, Text } from "@mantine/core";
import { useTranslations } from "next-intl";

export function TenantManagementView() {
  const t = useTranslations("nav");
  return (
    <Container size="xl" py="md">
      <Stack gap="md">
        <Text fz="xl" fw={700}>Tenants</Text>
        <Text c="dimmed">Tenant management coming soon.</Text>
      </Stack>
    </Container>
  );
}