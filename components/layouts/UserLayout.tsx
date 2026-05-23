import AppShellLayout from "@/components/AppShellLayout";
import { USER_NAV_ITEMS } from "@/components/sidebars/userNav";

export function UserLayout({ children }: { children: React.ReactNode }) {
  return <AppShellLayout navItems={USER_NAV_ITEMS}>{children}</AppShellLayout>;
}