"use client";

import { Loader, Center } from "@mantine/core";
import { SeniorLayout } from "@/components/layouts/SeniorLayout";
import { useAuthGuard } from "@/components/layouts/useAuthGuard";
import { useAppStore } from "@/store/useAppStore";

export default function SeniorRouteLayout({ children }: { children: React.ReactNode }) {
  const { hydrated, verifying, allowed } = useAuthGuard("senior");
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const token = useAppStore((s) => s.token);

  if (!hydrated || !isAuthenticated || !token) {
    return <Center mih="100vh"><Loader /></Center>;
  }
  if (verifying) {
    return <Center mih="100vh"><Loader /></Center>;
  }
  if (!allowed) {
    return <Center mih="100vh"><Loader /></Center>;
  }

  return <SeniorLayout>{children}</SeniorLayout>;
}