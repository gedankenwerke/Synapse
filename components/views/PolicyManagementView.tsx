"use client";

import { Container, Stack, Text } from "@mantine/core";

export function PolicyManagementView() {
  return (
    <Container size="xl" py="md">
      <Stack gap="md">
        <Text fz="xl" fw={700}>Policies</Text>
        <Text c="dimmed">Policy management coming soon.</Text>
      </Stack>
    </Container>
  );
}