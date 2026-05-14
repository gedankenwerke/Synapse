import type { useTranslations } from "next-intl";

export interface ColumnDef {
  key: string;
  label: string;
  sortable: boolean;
}

export function getColumns(t: ReturnType<typeof useTranslations<"apiKeys">>): ColumnDef[] {
  return [
    { key: "keyName", label: t("colKeyName"), sortable: true },
    { key: "apiKey", label: t("colApiKey"), sortable: false },
    { key: "createdAt", label: t("colCreatedDate"), sortable: true },
    { key: "status", label: t("colStatus"), sortable: false },
    { key: "actions", label: "", sortable: false },
  ];
}