"use client";

import { Alert, Container, Title } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Container py="xl">
      <Alert
        icon={<IconAlertCircle size={16} />}
        title={<Title order={3}>Something went wrong</Title>}
        color="red"
      >
        {error.message}
      </Alert>
    </Container>
  );
}