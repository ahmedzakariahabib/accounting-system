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
} from "@mui/material";
import {
  Edit2,
  Trash2,
  ArrowLeft,
  ArrowRight,
  Search,
  Printer,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n/i18n";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  deleteOnePurchase,
  fetchPurchases,
} from "../../services/api/purchases";

import type { Purchase } from "../../types/purchases";

interface TableColumn {
  key: string;
  label: string;
}

interface InvoiceTableProps {
  columns: TableColumn[];
}

export default function PurchasesTable({ columns }: InvoiceTableProps) {
  const { t } = useTranslation();
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  const queryClient = useQueryClient();

  // ======================
  //  Load All Purchases
  // ======================
  const {
    data: purchases = [],
    isLoading,
    isError,
  } = useQuery<Purchase[]>({
    queryKey: ["allpurchases"],
    queryFn: fetchPurchases,
  });

  // ======================
  //  Delete Purchase
  // ======================
  const mutation = useMutation({
    mutationFn: deleteOnePurchase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allpurchases"] });
    },
  });

  const handleDelete = (id: string) => {
    if (confirm("هل أنت متأكد أنك تريد حذف الفاتورة؟")) {
      mutation.mutate(id);
    }
  };

  // ======================
  //  Search
  // ======================
  const filteredRows = useMemo(() => {
    if (!search.trim()) return purchases;

    return purchases.filter((row) =>
      row.supplierName?.toLowerCase().includes(search.toLowerCase())
    );
  }, [purchases, search]);

  // ======================
  //  Pagination
  // ======================
  const totalPages = Math.ceil(filteredRows.length / ITEMS_PER_PAGE);
  const currentRows = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredRows.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredRows, currentPage]);

  // ======================
  //  Loading Skeleton
  // ======================
  if (isLoading) {
    return (
      <Box sx={{ width: "100%", textAlign: "center", py: 8 }}>
        <Typography>جارٍ تحميل المشتريات...</Typography>
      </Box>
    );
  }

  // ======================
  //  Error State
  // ======================
  if (isError) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Typography variant="h6" color="error">
          حدث خطأ أثناء تحميل بيانات المشتريات
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
            placeholder={t("searchInvoice")}
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
                  {t(col.label)}
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
                  {/* ID */}
                  <TableCell align={isArabic ? "right" : "left"}>
                    #{row._id.slice(0, 6)}
                  </TableCell>

                  {/* Supplier Name */}
                  <TableCell align={isArabic ? "right" : "left"}>
                    {row.supplierName}
                  </TableCell>

                  {/* Total Amount */}
                  <TableCell align={isArabic ? "right" : "left"}>
                    {(row.totalAmount ?? 0).toLocaleString()} ر.س
                  </TableCell>

                  {/* Purchase Date */}
                  <TableCell align={isArabic ? "right" : "left"}>
                    {new Date(row.purchaseDate).toLocaleDateString(
                      isArabic ? "ar-EG" : "en-US"
                    )}
                  </TableCell>

                  {/* Status */}
                  <TableCell align={isArabic ? "right" : "left"}>
                    {t(row.status)}
                  </TableCell>

                  {/* Actions */}
                  <TableCell>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      {/* Edit */}
                      <IconButton
                        sx={{ color: "var(--color-primary)" }}
                        onClick={() => navigate(`/purchases/${row._id}/edit`)}
                      >
                        <Edit2 size={18} />
                      </IconButton>

                      {/* Print */}
                      <IconButton
                        onClick={() =>
                          navigate(`/purchases/${row._id}/print`)
                        }
                        sx={{ color: "var(--color-primary)" }}
                      >
                        <Printer size={18} />
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
                  {t("noResultsFound")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 📄 Pagination */}
      <Box className="flex items-center justify-between p-6 border-t border-border">
        <Typography className="text-sm text-muted">
          {t("showing")} {(currentPage - 1) * ITEMS_PER_PAGE + 1}-
          {Math.min(currentPage * ITEMS_PER_PAGE, filteredRows.length)}{" "}
          {t("of")} {filteredRows.length}
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
            {currentPage}/{totalPages || 1}
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
    </Box>
  );
}
