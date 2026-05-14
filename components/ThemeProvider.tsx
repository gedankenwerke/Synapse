"use client";

import { useEffect } from "react";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { useAppStore } from "@/store/useAppStore";
import { theme } from "@/theme";

const MANTINE_STORAGE_KEY = "mantine-color-scheme-value";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const colorScheme = useAppStore((state) => state.colorScheme);

  // Sync color scheme to Mantine's localStorage key so ColorSchemeScript
  // can read it on the next page load before React hydrates
  useEffect(() => {
    try {
      localStorage.setItem(MANTINE_STORAGE_KEY, colorScheme);
    } catch {}
  }, [colorScheme]);

  return (
    <MantineProvider
      theme={theme}
      forceColorScheme={colorScheme}
    >
      <Notifications position="top-right" />
      {children}
    </MantineProvider>
  );
}