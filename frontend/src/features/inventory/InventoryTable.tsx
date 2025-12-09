import { useMemo, useState } from "react";
import {
  Box,
  IconButton,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from "@mui/material";
import { Edit2, Trash2, ArrowLeft, ArrowRight, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n/i18n";

import { useInventory, useDeleteInventory } from "../../hooks/useInventory";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { useConfirm } from "../../hooks/useConfirm";

interface TableColumn {
  key: string;
  label: string;
}

interface InventoryTableProps {
  columns: TableColumn[];
}

// RENDER STATUS CHIP
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderStatusChip = (status: string, t: any) => {
  const isInStock = status === "In Stock";

  return (
    <Chip
      label={t(
        isInStock ? "inventory.status.inStock" : "inventory.status.outOfStock"
      )}
      size="small"
      sx={{
        backgroundColor: isInStock
          ? "var(--color-status-paid-bg)"
          : "var(--color-status-overdue-bg)",
        color: isInStock
          ? "var(--color-status-paid-text)"
          : "var(--color-status-overdue-text)",
        fontWeight: 600,
        borderRadius: "8px",
        minWidth: "85px",
      }}
    />
  );
};

// SKELETON LOADER
const TableSkeleton = () => (
  <Box sx={{ width: "100%" }}>
    {/* 🔍 Search Skeleton */}
    <Box className="flex flex-col gap-4 p-6 mb-6 card sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Box
          sx={{
            width: "100%",
            height: "40px",
            backgroundColor: "rgba(0, 0, 0, 0.06)",
            borderRadius: "8px",
            animation: "pulse 1.5s infinite",
          }}
        />
      </div>
    </Box>

    {/* 📋 Table Skeleton */}
    <TableContainer
      component={Paper}
      sx={{
        boxShadow: "none",
        backgroundColor: "var(--color-card)",
        border: "1px solid var(--color-border)",
        borderRadius: "12px",
        overflow: "hidden",
      }}
    >
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: "var(--color-table-header)" }}>
            {[...Array(8)].map((_, index) => (
              <TableCell key={index}>
                <Box
                  sx={{
                    width: "80%",
                    height: "20px",
                    backgroundColor: "rgba(0, 0, 0, 0.08)",
                    borderRadius: "4px",
                    animation: "pulse 1.5s infinite",
                  }}
                />
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {[...Array(6)].map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              {[...Array(8)].map((_, colIndex) => (
                <TableCell key={colIndex}>
                  <Box
                    sx={{
                      width: colIndex === 7 ? "60px" : "90%",
                      height: "16px",
                      backgroundColor: "rgba(0, 0, 0, 0.06)",
                      borderRadius: "3px",
                      animation: "shimmer 2s infinite linear",
                      animationDelay: `${(rowIndex + colIndex) * 0.1}s`,
                    }}
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

    {/* 📄 Pagination Skeleton */}
    <Box className="flex items-center justify-between p-6 border-t border-border">
      <Box
        sx={{
          width: "120px",
          height: "20px",
          backgroundColor: "rgba(0, 0, 0, 0.06)",
          borderRadius: "4px",
          animation: "pulse 1.5s infinite",
        }}
      />

      <Box className="flex items-center gap-2">
        <Box
          sx={{
            width: "40px",
            height: "40px",
            backgroundColor: "rgba(0, 0, 0, 0.06)",
            borderRadius: "8px",
            animation: "pulse 1.5s infinite",
          }}
        />
        <Box
          sx={{
            width: "40px",
            height: "20px",
            backgroundColor: "rgba(0, 0, 0, 0.06)",
            borderRadius: "4px",
            animation: "pulse 1.5s infinite",
          }}
        />
        <Box
          sx={{
            width: "40px",
            height: "40px",
            backgroundColor: "rgba(0, 0, 0, 0.06)",
            borderRadius: "8px",
            animation: "pulse 1.5s infinite",
          }}
        />
      </Box>
    </Box>
  </Box>
);

export default function InventoryTable({ columns }: InventoryTableProps) {
  const { t } = useTranslation();
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  const ITEMS_PER_PAGE = 6;

  // ======================
  //  Load All Inventory
  // ======================
  const { data: inventory = [], isLoading, isError, refetch } = useInventory();

  // ======================
  //  Delete Inventory
  // ======================
  const deleteMutation = useDeleteInventory();
  const { confirm, ConfirmDialogComponent } = useConfirm();

  const handleDelete = async (id: string) => {
    const result = await confirm({
      title: t("inventory.confirmDelete"),
      message: t("inventory.confirmDeleteMessage"),
      confirmText: t("inventory.delete"),
      cancelText: t("inventory.cancel"),
      color: "error",
    });

    if (!result) return;

    try {
      await deleteMutation.mutateAsync(id);
      refetch(); // إعادة تحميل البيانات
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error deleting item:", error);
      alert(error.response?.data?.message || "حدث خطأ أثناء الحذف");
    }
  };

  // ======================
  //  Search
  // ======================
  const filteredRows = useMemo(() => {
    if (!search.trim()) return inventory;

    return inventory.filter(
      (row) =>
        row.itemName?.toLowerCase().includes(search.toLowerCase()) ||
        row.category?.toLowerCase().includes(search.toLowerCase()) ||
        row.color?.toLowerCase().includes(search.toLowerCase())
    );
  }, [inventory, search]);

  // ======================
  //  Pagination
  // ======================
  const totalPages = Math.ceil(filteredRows.length / ITEMS_PER_PAGE) || 1;
  const currentRows = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredRows.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredRows, currentPage]);

  // ======================
  //  Loading Skeleton
  // ======================
  if (isLoading) {
    return <TableSkeleton />;
  }

  // ======================
  //  Error State
  // ======================
  if (isError) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Typography variant="h6" color="error">
          حدث خطأ أثناء تحميل بيانات المخزون
        </Typography>
      </Box>
    );
  }

  // ======================
  //  Main Return
  // ======================
  return (
    <Box sx={{ width: "100%" }}>
      {/* 🔍 Search */}
      <Box className="flex flex-col gap-4 p-6 mb-6 card sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-muted" />
          <input
            type="text"
            placeholder={t("inventory.search")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 input"
          />
        </div>
      </Box>

      {/* 📋 Table */}
      <TableContainer
        component={Paper}
        sx={{
          boxShadow: "none",
          backgroundColor: "var(--color-card)",
          border: "1px solid var(--color-border)",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "var(--color-table-header)" }}>
              {columns.map((col) => (
                <TableCell
                  key={col.key}
                  align={isArabic ? "right" : "left"}
                  sx={{
                    fontWeight: "bold",
                    color: "var(--color-text)",
                    py: 2.5,
                    borderBottom: "1px solid var(--color-border)",
                  }}
                >
                  {t(`inventory.columns.${col.label}`)}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {currentRows.length > 0 ? (
              currentRows.map((row) => (
                <TableRow
                  key={row._id}
                  sx={{
                    "&:hover": { backgroundColor: "var(--color-hover-bg)" },
                  }}
                >
                  {/* Item Name */}
                  <TableCell align={isArabic ? "right" : "left"}>
                    {row.itemName}
                  </TableCell>

                  {/* Category */}
                  <TableCell align={isArabic ? "right" : "left"}>
                    {row.category}
                  </TableCell>

                  {/* Size */}
                  <TableCell align={isArabic ? "right" : "left"}>
                    {row.size}
                  </TableCell>

                  {/* Color */}
                  <TableCell align={isArabic ? "right" : "left"}>
                    {row.color}
                  </TableCell>

                  {/* Price */}
                  <TableCell align={isArabic ? "right" : "left"}>
                    {(row.price ?? 0).toLocaleString()} ر.س
                  </TableCell>

                  {/* Quantity */}
                  <TableCell
                    align={isArabic ? "right" : "left"}
                    sx={{
                      color:
                        row.quantity < row.lowStockThreshold
                          ? "#b91c1c"
                          : "var(--color-text)",
                      fontWeight: 600,
                    }}
                  >
                    {row.quantity}
                    {row.quantity < row.lowStockThreshold && (
                      <Typography
                        variant="caption"
                        sx={{ color: "#b91c1c", ml: 1 }}
                      >
                        (منخفض)
                      </Typography>
                    )}
                  </TableCell>

                  {/* Status */}
                  <TableCell align={isArabic ? "right" : "left"}>
                    {renderStatusChip(row.stockStatus, t)}
                  </TableCell>

                  {/* Actions */}
                  <TableCell>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      {/* Edit */}
                      <IconButton
                        sx={{ color: "var(--color-primary)" }}
                        onClick={() => navigate(`/inventory/${row._id}/edit`)}
                      >
                        <Edit2 size={18} />
                      </IconButton>

                      {/* Delete */}
                      <IconButton
                        onClick={() => handleDelete(row._id)}
                        sx={{ color: "#ef4444" }}
                      >
                        <Trash2 size={18} />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  align="center"
                  sx={{ py: 4, color: "var(--color-text-muted)" }}
                >
                  {t("inventory.noResults")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 📄 Pagination */}
      <Box className="flex items-center justify-between p-6 border-t border-border">
        <Typography className="text-sm text-muted">
          {t("inventory.pagination.showing")}{" "}
          {(currentPage - 1) * ITEMS_PER_PAGE + 1}-
          {Math.min(currentPage * ITEMS_PER_PAGE, filteredRows.length)}{" "}
          {t("inventory.pagination.of")} {filteredRows.length}
        </Typography>

        <Box className="flex items-center gap-2">
          <Button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="flex items-center justify-center w-10 h-10 border rounded-lg border-border text-text hover:bg-hover"
          >
            {isArabic ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
          </Button>

          <Typography className="text-sm font-semibold">
            {currentPage}/{totalPages}
          </Typography>

          <Button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="flex items-center justify-center w-10 h-10 border rounded-lg border-border text-text hover:bg-hover"
          >
            {isArabic ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
          </Button>
        </Box>
      </Box>

      {/* CONFIRM DIALOG */}
      <ConfirmDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        title={t("confirmDelete")}
        message={t("confirmDeleteInventoryMessage")}
        onConfirm={function (): void {
          throw new Error("Function not implemented.");
        }}
      />

      <style>
        {`
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
          }
          
          @keyframes shimmer {
            0% { background-color: rgba(0, 0, 0, 0.06); }
            50% { background-color: rgba(0, 0, 0, 0.12); }
            100% { background-color: rgba(0, 0, 0, 0.06); }
          }
        `}
      </style>
      {ConfirmDialogComponent}
    </Box>
  );
}
