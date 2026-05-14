"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/navigation";
import { SegmentedControl, Menu, Group } from "@mantine/core";
import { IconLanguage, IconCheck } from "@tabler/icons-react";

type LanguageSwitcherVariant = "segmented" | "menu";

const locales = [
  { label: "TH", value: "th" },
  { label: "EN", value: "en" },
];

const localeLabels: Record<string, string> = {
  th: "🇹🇭 ภาษาไทย",
  en: "🇬🇧 English",
};

export function LanguageSwitcher({ variant }: { variant: LanguageSwitcherVariant }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  if (variant === "segmented") {
    return (
      <SegmentedControl
        value={locale}
        onChange={(value) => switchLocale(value)}
        data={locales}
        size="sm"
      />
    );
  }

  // Menu variant
  return (
    <>
      <Menu.Label>
        <Group gap="xs">
          <IconLanguage size={14} />
          <span>Language / ภาษา</span>
        </Group>
      </Menu.Label>
      {locales.map((loc) => (
        <Menu.Item
          key={loc.value}
          leftSection={
            locale === loc.value ? <IconCheck size={14} /> : (
              <span style={{ width: 14 }} />
            )
          }
          onClick={() => switchLocale(loc.value)}
        >
          {localeLabels[loc.value]}
        </Menu.Item>
      ))}
    </>
  );
}