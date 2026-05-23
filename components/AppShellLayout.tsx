"use client";

import { AppShell, ScrollArea } from "@mantine/core";
import { HeaderBar } from "@/components/HeaderBar";
import { SidebarNav } from "@/components/SidebarNav";
import type { NavItem } from "./sidebars/types";

interface AppShellLayoutProps {
  children: React.ReactNode;
  navItems: NavItem[];
}

export default function AppShellLayout({ children, navItems }: AppShellLayoutProps) {
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
            <SidebarNav navItems={navItems} />
          </ScrollArea>
        </AppShell.Section>
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}