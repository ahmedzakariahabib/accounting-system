import React, { useState, useMemo } from "react";
import {
  Box,
  IconButton,
  Button,
  Typography,
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
  Filter,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n/i18n";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteSupplier, fetchSuppliers } from "../../services/api/suppliers";
import type { Supplier } from "../../types/Suppliers";

// --------------------------------------------------
// 🧮 Pagination Controls
// --------------------------------------------------
interface PaginationControlsProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const currentLang = i18n.language;
  const { t } = useTranslation();

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <Box className="flex flex-col items-center justify-between gap-4 p-6 border-t border-border sm:flex-row">
      <Typography className="text-sm text-muted">
        {t("suppliers.table.showing")} {startItem}-{endItem}{" "}
        {t("suppliers.table.of")} {totalItems} {t("suppliers.table.results")}
      </Typography>

      <Box className="flex items-center gap-2">
        <Button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="flex items-center justify-center w-10 h-10 transition-colors border rounded-lg border-border text-text hover:bg-hover disabled:opacity-50"
        >
          {currentLang === "ar" ? (
            <ArrowRight size={16} />
          ) : (
            <ArrowLeft size={16} />
          )}
        </Button>

        {pages.map((page) => (
          <Button
            key={page}
            onClick={() => onPageChange(page)}
            className={`flex items-center justify-center w-10 h-10 transition-colors rounded-lg text-sm font-semibold ${
              page === currentPage
                ? "bg-primary text-white"
                : "text-text hover:bg-hover"
            }`}
          >
            {page}
          </Button>
        ))}

        <Button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="flex items-center justify-center w-10 h-10 transition-colors border rounded-lg border-border text-text hover:bg-hover disabled:opacity-50"
        >
          {currentLang === "ar" ? (
            <ArrowLeft size={16} />
          ) : (
            <ArrowRight size={16} />
          )}
        </Button>
      </Box>
    </Box>
  );
};

// --------------------------------------------------
// 🧾 Table Content Component
// --------------------------------------------------
const SuppliersTableContent = ({
  rows,
  handleEdit,
  handleDelete,
}: {
  rows: Supplier[];
  handleEdit: (id: string) => void;
  handleDelete: (id: string) => void;
}) => {
  const { t } = useTranslation();
  const isArabic = i18n.language === "ar";
  const formatDate = (date?: string) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString(
      i18n.language === "ar" ? "ar-EG" : "en-US"
    );
  };

  return (
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
            {[
              t("suppliers.table.supplierName"),
              t("suppliers.table.supplierCompany"),
              t("suppliers.table.supplierEmail"),
              t("suppliers.table.phone"),
              t("suppliers.table.address"),
              t("suppliers.table.lastPurchaseDate"),
              t("suppliers.table.actions"),
            ].map((label, idx) => (
              <TableCell
                key={idx}
                align={isArabic ? "right" : "left"}
                sx={{
                  fontWeight: "bold",
                  color: "var(--color-text)",
                  backgroundColor: "var(--color-table-header)",
                  borderBottom: "1px solid var(--color-border)",
                  py: 3,
                  fontSize: "0.875rem",
                }}
              >
                {label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row._id}
              sx={{
                "&:last-child td": { borderBottom: 0 },
                "&:hover": { backgroundColor: "var(--color-hover-bg)" },
              }}
            >
              <TableCell align={isArabic ? "right" : "left"}>
                <Typography fontWeight={600}>{row.name}</Typography>
              </TableCell>
              <TableCell align={isArabic ? "right" : "left"}>
                {row.company}
              </TableCell>
              <TableCell align={isArabic ? "right" : "left"}>
                {row.email}
              </TableCell>
              <TableCell align={isArabic ? "right" : "left"}>
                {row.contactNumber}
              </TableCell>
              <TableCell align={isArabic ? "right" : "left"}>
                {row.address || "-"} {/* ✅ عرض العنوان بدل totalPurchases */}
              </TableCell>
              <TableCell align={isArabic ? "right" : "left"}>
                {formatDate(row.updatedAt)}
              </TableCell>

              <TableCell align={isArabic ? "right" : "left"}>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <IconButton
                    onClick={() => handleEdit(row._id!)}
                    sx={{
                      color: "var(--color-primary)",
                      "&:hover": {
                        backgroundColor: "var(--color-primary)" + "20",
                      },
                    }}
                  >
                    <Edit2 size={18} />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(row._id!)}
                    sx={{
                      color: "#ef4444",
                      "&:hover": { backgroundColor: "#ef4444" + "20" },
                    }}
                  >
                    <Trash2 size={18} />
                  </IconButton>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

// --------------------------------------------------
// 🌟 Main Table Component
// --------------------------------------------------
export default function SuppliersTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();
  const ITEMS_PER_PAGE = 6;

  const queryClient = useQueryClient();
  const { data = [] } = useQuery({
    queryKey: ["suppliers"],
    queryFn: fetchSuppliers,
  });

  const mutation = useMutation({
    mutationFn: deleteSupplier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
    },
  });

  const handleDelete = (id: string) => {
    if (confirm(t("suppliers.confirmDelete"))) {
      mutation.mutate(id);
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/suppliers/${id}/edit`);
  };

  const filteredRows = useMemo(() => {
    return data.filter((row) =>
      [row.name, row.company, row.contactNumber, row.address || ""]
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  const currentRows = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredRows.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredRows, currentPage]);

  return (
    <Box sx={{ width: "100%" }}>
      {/* Search Bar */}
      <Box className="flex flex-col gap-4 p-6 mb-6 card sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-muted" />
          <input
            type="text"
            placeholder={t("suppliers.searchPlaceholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 input"
          />
        </div>
        <button
          onClick={() => navigate("/suppliers/new")}
          className="flex items-center gap-2 px-4 py-2 font-medium transition-colors border rounded-lg text-text border-border hover:bg-hover sm:w-auto"
        >
          <Filter size={16} />
          {t("suppliers.addNewSupplier")}
        </button>
      </Box>

      {/* Table */}
      <Box className="overflow-hidden card">
        <SuppliersTableContent
          rows={currentRows}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />

        {/* Pagination */}
        <PaginationControls
          totalItems={filteredRows.length}
          itemsPerPage={ITEMS_PER_PAGE}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </Box>
    </Box>
  );
}
