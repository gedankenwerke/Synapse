"use client";

import { useState, useMemo } from "react";
import { Container, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useTranslations } from "next-intl";
import { MOCK_API_KEYS } from "./_components/ApiKeyTab/mockData";
import type { ApiKeyData, ConfirmAction } from "./_components/ApiKeyTab/mockData";
import { generateApiKey, maskApiKey } from "./_components/ApiKeyTab/mockData";
import { ApiKeyToolbar } from "./_components/ApiKeyTab/ApiKeyToolbar";
import { ApiKeyTable } from "./_components/ApiKeyTab/ApiKeyTable";
import { ApiKeyPagination } from "./_components/ApiKeyTab/ApiKeyPagination";
import {
  CreateKeyModal,
  SuccessKeyModal,
  RevokeDeleteModal,
} from "./_components/ApiKeyTab/ApiKeyModals";

export default function ApiKeysPage() {
  const t = useTranslations("apiKeys");
  const tc = useTranslations("common");
  const [apiKeys, setApiKeys] = useState<ApiKeyData[]>(MOCK_API_KEYS);

  const [searchQuery, setSearchQuery] = useState("");

  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [createOpened, { open: openCreate, close: closeCreate }] =
    useDisclosure(false);
  const [successOpened, { open: openSuccess, close: closeSuccess }] =
    useDisclosure(false);
  const [confirmOpened, { open: openConfirm, close: closeConfirm }] =
    useDisclosure(false);

  const [selectedKey, setSelectedKey] = useState<ApiKeyData | null>(null);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>("revoke");
  const [newlyCreatedKey, setNewlyCreatedKey] = useState("");
  const [newlyCreatedKeyName, setNewlyCreatedKeyName] = useState("");

  const filteredKeys = useMemo(() => {
    if (!searchQuery) return apiKeys;
    const q = searchQuery.toLowerCase();
    return apiKeys.filter((k) => k.keyName.toLowerCase().includes(q));
  }, [apiKeys, searchQuery]);

  const sortedKeys = useMemo(() => {
    if (!sortColumn) return filteredKeys;
    return [...filteredKeys].sort((a, b) => {
      const aVal = a[sortColumn as keyof ApiKeyData];
      const bVal = b[sortColumn as keyof ApiKeyData];
      const comparison = String(aVal).localeCompare(String(bVal));
      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [filteredKeys, sortColumn, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(sortedKeys.length / rowsPerPage));
  const paginatedKeys = sortedKeys.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const handleCreate = (keyName: string) => {
    const fullKey = generateApiKey();
    const newKey: ApiKeyData = {
      id: String(Date.now()),
      keyName,
      apiKey: fullKey,
      maskedKey: maskApiKey(fullKey),
      createdAt: new Date().toISOString().split("T")[0],
      status: "Active",
    };
    setApiKeys((prev) => [newKey, ...prev]);
    closeCreate();
    setNewlyCreatedKey(fullKey);
    setNewlyCreatedKeyName(keyName);
    openSuccess();
    notifications.show({
      title: tc("success"),
      message: t("success.generated"),
      color: "green",
    });
  };

  const handleRevoke = (key: ApiKeyData) => {
    setSelectedKey(key);
    setConfirmAction("revoke");
    openConfirm();
  };

  const handleDelete = (key: ApiKeyData) => {
    setSelectedKey(key);
    setConfirmAction("delete");
    openConfirm();
  };

  const handleConfirm = () => {
    if (!selectedKey) return;
    if (confirmAction === "revoke") {
      setApiKeys((prev) =>
        prev.map((k) =>
          k.id === selectedKey.id ? { ...k, status: "Revoked" as const } : k
        )
      );
      notifications.show({
        title: tc("success"),
        message: t("success.revoked", { name: selectedKey.keyName }),
        color: "orange",
      });
    } else {
      setApiKeys((prev) => prev.filter((k) => k.id !== selectedKey.id));
      notifications.show({
        title: tc("success"),
        message: t("success.deleted", { name: selectedKey.keyName }),
        color: "green",
      });
    }
    closeConfirm();
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleRowsPerPageChange = (value: string | null) => {
    setRowsPerPage(Number(value) || 10);
    setCurrentPage(1);
  };

  return (
    <Container size="xl" py="md">
      <Text fz="xl" fw={700} mb="md">
        {t("title")}
      </Text>

      <Stack gap="md">
        <ApiKeyToolbar
          searchValue={searchQuery}
          onSearchChange={handleSearchChange}
          onGenerateNew={openCreate}
        />

        <ApiKeyTable
          data={paginatedKeys}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
          onRevoke={handleRevoke}
          onDelete={handleDelete}
        />

        <ApiKeyPagination
          totalItems={sortedKeys.length}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </Stack>

      <CreateKeyModal
        opened={createOpened}
        onClose={closeCreate}
        onCreate={handleCreate}
      />
      <SuccessKeyModal
        opened={successOpened}
        onClose={closeSuccess}
        apiKey={newlyCreatedKey}
        keyName={newlyCreatedKeyName}
      />
      <RevokeDeleteModal
        opened={confirmOpened}
        onClose={closeConfirm}
        onConfirm={handleConfirm}
        action={confirmAction}
        keyName={selectedKey?.keyName ?? ""}
      />
    </Container>
  );
}