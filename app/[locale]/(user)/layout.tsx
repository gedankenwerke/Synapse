"use client";

import { Loader, Center } from "@mantine/core";
import { UserLayout } from "@/components/layouts/UserLayout";
import { useAuthGuard } from "@/components/layouts/useAuthGuard";
import { useAppStore } from "@/store/useAppStore";

export default function UserRouteLayout({ children }: { children: React.ReactNode }) {
  const { hydrated, verifying, allowed } = useAuthGuard("user");
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

  return <UserLayout>{children}</UserLayout>;
}