import AppShellLayout from "@/components/AppShellLayout";
import { SENIOR_NAV_ITEMS } from "@/components/sidebars/seniorNav";

export function SeniorLayout({ children }: { children: React.ReactNode }) {
  return <AppShellLayout navItems={SENIOR_NAV_ITEMS}>{children}</AppShellLayout>;
}