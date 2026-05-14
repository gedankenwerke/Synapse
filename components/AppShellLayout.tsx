"use client";

import { AppShell, ScrollArea, Text } from "@mantine/core";
import { HeaderBar } from "@/components/HeaderBar";
import { SidebarNav } from "@/components/SidebarNav";

export default function AppShellLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell
      header={{ height: 64 }}
      navbar={{
        width: 260,
        breakpoint: "sm",
        collapsed: { mobile: true, desktop: false },
      }}
      padding="md"
    >
      <AppShell.Header>
        <HeaderBar />
      </AppShell.Header>

      <AppShell.Navbar p="xs">

        <AppShell.Section grow mt="xs">
          <ScrollArea>
            <SidebarNav />
          </ScrollArea>
        </AppShell.Section>
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}