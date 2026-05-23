import AppShellLayout from "@/components/AppShellLayout";
import { SUPERADMIN_NAV_ITEMS } from "@/components/sidebars/superadminNav";

export function SuperadminLayout({ children }: { children: React.ReactNode }) {
  return <AppShellLayout navItems={SUPERADMIN_NAV_ITEMS}>{children}</AppShellLayout>;
}