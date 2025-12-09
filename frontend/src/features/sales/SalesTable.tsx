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
import { deleteOneSale, fetchSales } from "../../services/api/sales";
import type { Sale, InvoiceTableProps } from "../../types/sales";

export default function SalesTable({ columns }: InvoiceTableProps) {
  const { t } = useTranslation();
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  const queryClient = useQueryClient();

  //  جلب بيانات المبيعات
  const { data: sales = [], isLoading, isError } = useQuery<Sale[]>({
    queryKey: ["allsales"],
    queryFn: fetchSales,
  });

  //  حذف فاتورة
  const deleteMutation = useMutation({
    mutationFn: deleteOneSale,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allsales"] });
    },
  });

  const handleDelete = (id: string) => {
    if (confirm("هل أنت متأكد أنك تريد حذف الفاتورة؟")) {
      deleteMutation.mutate(id);
    }
  };

  //  فلترة المبيعات حسب البحث
  const filteredRows = useMemo(() => {
    if (!search.trim()) return sales;
    return sales.filter(
      (row) =>
        row.customer?.name.toLowerCase().includes(search.toLowerCase()) ||
        (row.invoiceNumber || "").toLowerCase().includes(search.toLowerCase())
    );
  }, [sales, search]);

  //  Pagination
  const totalPages = Math.ceil(filteredRows.length / ITEMS_PER_PAGE) || 1;
  const currentRows = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredRows.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredRows, currentPage]);

  //  Loader أثناء التحميل - محسن
  if (isLoading) {
    return (
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
                animation: "pulse 1.5s infinite"
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
                    <Box
                      sx={{
                        width: "80px",
                        height: "20px",
                        backgroundColor: "rgba(0, 0, 0, 0.08)",
                        borderRadius: "4px",
                        animation: "pulse 1.5s infinite"
                      }}
                    />
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {[...Array(5)].map((_, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columns.map((col, colIndex) => (
                    <TableCell key={col.key} align={isArabic ? "right" : "left"}>
                      <Box
                        sx={{
                          width: colIndex === 0 ? "60px" : 
                                 colIndex === columns.length - 1 ? "120px" : "100px",
                          height: "16px",
                          backgroundColor: "rgba(0, 0, 0, 0.06)",
                          borderRadius: "3px",
                          animation: "shimmer 2s infinite linear",
                          animationDelay: `${(rowIndex + colIndex) * 0.1}s`
                        }}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination Skeleton */}
        <Box className="flex items-center justify-between p-6 border-t border-border">
          <Box
            sx={{
              width: "120px",
              height: "20px",
              backgroundColor: "rgba(0, 0, 0, 0.06)",
              borderRadius: "4px",
              animation: "pulse 1.5s infinite"
            }}
          />
          
          <Box className="flex items-center gap-2">
            <Box
              sx={{
                width: "40px",
                height: "40px",
                backgroundColor: "rgba(0, 0, 0, 0.06)",
                borderRadius: "8px",
                animation: "pulse 1.5s infinite"
              }}
            />
            <Box
              sx={{
                width: "40px",
                height: "20px",
                backgroundColor: "rgba(0, 0, 0, 0.06)",
                borderRadius: "4px",
                animation: "pulse 1.5s infinite"
              }}
            />
            <Box
              sx={{
                width: "40px",
                height: "40px",
                backgroundColor: "rgba(0, 0, 0, 0.06)",
                borderRadius: "8px",
                animation: "pulse 1.5s infinite"
              }}
            />
          </Box>
        </Box>

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
      </Box>
    );
  }

  //  في حالة الخطأ
  if (isError) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Typography variant="h6" color="error">
          حدث خطأ أثناء تحميل بيانات المبيعات 
        </Typography>
      </Box>
    );
  }

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
                  <TableCell align={isArabic ? "right" : "left"}>
                    #{row.invoiceNumber}
                  </TableCell>
                  <TableCell align={isArabic ? "right" : "left"}>
                    {row.customer?.name}
                  </TableCell>
                  <TableCell align={isArabic ? "right" : "left"}>
                    {row.grandTotal.toLocaleString()} ر.س
                  </TableCell>
                  <TableCell align={isArabic ? "right" : "left"}>
                    {new Date(row.saleDate).toLocaleDateString(
                      isArabic ? "ar-EG" : "en-US"
                    )}
                  </TableCell>
                  <TableCell align={isArabic ? "right" : "left"}>
                    {row.paymentStatus}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <IconButton
                        onClick={() => navigate(`/sales/${row._id}/edit`)}
                        sx={{ color: "var(--color-primary)" }}
                      >
                        <Edit2 size={18} />
                      </IconButton>
                      <IconButton
                        onClick={() => navigate(`/sales/${row._id}/print`)}
                        title={t("print")}
                        sx={{ color: "var(--color-primary)" }}
                      >
                        <Printer size={18} />
                      </IconButton>
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

      {/*  Pagination */}
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
    </Box>
  );
}