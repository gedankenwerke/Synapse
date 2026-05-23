"use client";

import { AppShell, NavLink } from "@mantine/core";
import { Link, usePathname } from "@/navigation";
import { useLocale, useTranslations } from "next-intl";
import type { NavItem } from "./sidebars/types";

interface SidebarNavProps {
  navItems: NavItem[];
}

export function SidebarNav({ navItems }: SidebarNavProps) {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("nav");

  return (
    <AppShell.Section>
      {navItems.map((item) => (
        <NavLink
          key={item.href}
          label={t(item.labelKey)}
          leftSection={<item.icon size={20} />}
          active={pathname.startsWith(`/${locale}${item.href}`)}
          component={Link}
          href={item.href}
        />
      ))}
    </AppShell.Section>
  );
}