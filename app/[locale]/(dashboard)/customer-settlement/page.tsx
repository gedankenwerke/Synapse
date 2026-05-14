"use client";

import { useState, useMemo } from "react";
import { Container, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useTranslations } from "next-intl";
import { MOCK_SETTLEMENTS } from "./_components/SettlementTab/mockData";
import type { SettlementData } from "./_components/SettlementTab/mockData";
import { SettlementToolbar } from "./_components/SettlementTab/SettlementToolbar";
import { SettlementTable } from "./_components/SettlementTab/SettlementTable";
import { SettlementPagination } from "./_components/SettlementTab/SettlementPagination";
import {
  AddSettlementModal,
  ProcessTransferModal,
  ViewDetailsModal,
} from "./_components/SettlementTab/SettlementModals";
import type { SettlementFormValues } from "./_components/SettlementTab/SettlementModals";

export default function CustomerSettlementPage() {
  const t = useTranslations("settlement");
  const tc = useTranslations("common");
  const [settlements, setSettlements] = useState<SettlementData[]>(MOCK_SETTLEMENTS);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>("All");

  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [addOpened, { open: openAdd, close: closeAdd }] = useDisclosure(false);
  const [processOpened, { open: openProcess, close: closeProcess }] =
    useDisclosure(false);
  const [viewOpened, { open: openView, close: closeView }] =
    useDisclosure(false);
  const [selectedSettlement, setSelectedSettlement] =
    useState<SettlementData | null>(null);

  const filteredSettlements = useMemo(() => {
    let result = settlements;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (s) =>
          s.id.toLowerCase().includes(q) ||
          s.userName.toLowerCase().includes(q)
      );
    }
    if (statusFilter && statusFilter !== "All") {
      result = result.filter((s) => s.status === statusFilter);
    }
    return result;
  }, [settlements, searchQuery, statusFilter]);

  const sortedSettlements = useMemo(() => {
    if (!sortColumn) return filteredSettlements;
    return [...filteredSettlements].sort((a, b) => {
      const aVal = a[sortColumn as keyof SettlementData];
      const bVal = b[sortColumn as keyof SettlementData];
      if (sortColumn === "amount") {
        return sortDirection === "asc"
          ? (aVal as number) - (bVal as number)
          : (bVal as number) - (aVal as number);
      }
      const comparison = String(aVal).localeCompare(String(bVal));
      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [filteredSettlements, sortColumn, sortDirection]);

  const paginatedSettlements = sortedSettlements.slice(
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

  const handleProcess = (settlement: SettlementData) => {
    setSelectedSettlement(settlement);
    openProcess();
  };

  const handleViewDetails = (settlement: SettlementData) => {
    setSelectedSettlement(settlement);
    openView();
  };

  const handleAddSettlement = (data: SettlementFormValues) => {
    const newSettlement: SettlementData = {
      id: `STL-${String(settlements.length + 1).padStart(3, "0")}`,
      requestDate: new Date().toISOString().split("T")[0],
      userName: data.userName,
      bankName: data.bankName,
      accountNumber: data.accountNumber,
      amount: data.amount,
      status: "Pending" as const,
      remark: data.remark,
    };
    setSettlements((prev) => [newSettlement, ...prev]);
    closeAdd();
    notifications.show({
      title: tc("success"),
      message: t("success.added"),
      color: "green",
    });
  };

  const handleConfirmTransfer = () => {
    if (!selectedSettlement) return;
    setSettlements((prev) =>
      prev.map((s) =>
        s.id === selectedSettlement.id
          ? { ...s, status: "Processed" as const, slipUrl: "/slips/placeholder.png" }
          : s
      )
    );
    closeProcess();
    notifications.show({
      title: tc("success"),
      message: t("success.processed", { userName: selectedSettlement.userName }),
      color: "green",
    });
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (value: string | null) => {
    setStatusFilter(value);
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
        <SettlementToolbar
          searchValue={searchQuery}
          onSearchChange={handleSearchChange}
          statusFilter={statusFilter}
          onStatusFilterChange={handleStatusFilterChange}
          onAddSettlement={openAdd}
        />

        <SettlementTable
          data={paginatedSettlements}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
          onProcess={handleProcess}
          onViewDetails={handleViewDetails}
        />

        <SettlementPagination
          totalItems={sortedSettlements.length}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </Stack>

      <AddSettlementModal
        opened={addOpened}
        onClose={closeAdd}
        onSave={handleAddSettlement}
      />
      <ProcessTransferModal
        opened={processOpened}
        onClose={closeProcess}
        onConfirm={handleConfirmTransfer}
        settlement={selectedSettlement}
      />
      <ViewDetailsModal
        opened={viewOpened}
        onClose={closeView}
        settlement={selectedSettlement}
      />
    </Container>
  );
}