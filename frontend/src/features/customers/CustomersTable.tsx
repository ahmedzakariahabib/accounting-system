import React, { useState, useMemo,  } from 'react';
import { Box, IconButton, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import type { InvoiceTableProps, PaginationControlsProps } from '../../types/sales';
import type { InvoiceTableContentPropsPhon } from '../../types/Suppliers';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n/i18n';
import {  ArrowLeft, ArrowRight, Search, Filter, Edit2 ,Trash2 } from "lucide-react";
// CustomersTable.tsx
import { useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import { deleteCustomer, fetchCustomers } from '../../services/api/customers';
import { useNavigate } from 'react-router-dom';


// إجمالي عدد السجلات الكلي في ال Table
const ITEMS_PER_PAGE = 5;

const PaginationControls: React.FC<PaginationControlsProps> = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const currentLang = i18n.language;
  const { t } = useTranslation();

  const generatePages = (): (number | string)[] => {
    const maxVisible = 5;
    const pages: (number | string)[] = [];
    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }
    const half = Math.floor(maxVisible / 2);
    let start = Math.max(2, currentPage - half);
    let end = Math.min(totalPages - 1, currentPage + half);
    if (currentPage <= half + 1) end = maxVisible;
    else if (currentPage >= totalPages - half) start = totalPages - maxVisible + 1;
    pages.push(1);
    if (start > 2) pages.push("...");
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages - 1) pages.push("...");
    if (!pages.includes(totalPages)) pages.push(totalPages);
    return pages;
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <Box className="flex flex-col items-center justify-between gap-4 p-6 border-t border-border sm:flex-row">
      <Typography className="text-sm text-muted">
        {t("suppliers.table.showing")} {startItem}-{endItem} {t("suppliers.table.of")} {totalItems} {t("suppliers.table.results")}
      </Typography>
      
      <Box className="flex items-center gap-2">
        <Button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="flex items-center justify-center w-10 h-10 transition-colors border rounded-lg border-border text-text hover:bg-hover disabled:opacity-50"
        >
          {currentLang === "ar" ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
        </Button>

        {generatePages().map((page, index) =>
          typeof page === "number" ? (
            <Button
              key={index}
              onClick={() => onPageChange(page)}
              className={`flex items-center justify-center w-10 h-10 transition-colors rounded-lg text-sm font-semibold ${
                page === currentPage
                  ? "bg-primary text-white"
                  : "text-text hover:bg-hover"
              }`}
            >
              {page}
            </Button>
          ) : (
            <Typography key={index} className="flex items-center justify-center w-10 h-10 text-muted">
              ...
            </Typography>
          )
        )}

        <Button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="flex items-center justify-center w-10 h-10 transition-colors border rounded-lg border-border text-text hover:bg-hover disabled:opacity-50"
        >
          {currentLang === "ar" ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
        </Button>
      </Box>
    </Box>
  );
};

// --- عرض محتوى الجدول ---

const InvoiceTableContent: React.FC<InvoiceTableContentPropsPhon> = ({ rows, columns  , handleDelete, handleEdit}) => {
    const { t } = useTranslation();
    const isArabic = i18n.language === "ar";

    return (
        <TableContainer component={Paper} sx={{ maxHeight: 422, overflowY: 'auto', boxShadow: 'none', backgroundColor: "var(--color-card)" }}>
            <Table stickyHeader aria-label="custom pagination invoice table">

                {/* رأس الجدول */}
                <TableHead>
                    <TableRow sx={{ backgroundColor: "var(--color-table-header)" }}>
                        {columns?.map((col) => (
                            <TableCell
                                key={col.key}
                                align={isArabic ? "right" : "left"}
                                sx={{
                                    fontWeight: "bold", minWidth: 150, color: "var(--color-text)",
                                    backgroundColor: "var(--color-table-header)",
                                    borderBottom: "1px solid var(--color-border)"
                                }}
                            >{t(`${col.key}`)}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>

                <TableBody>
                    {rows.length > 0 ? (
                        rows?.map((row) => (
                            <TableRow
                                key={row._id}
                                sx={{
                                    "&:last-child td": { borderBottom: 0 },
                                    "& .MuiTableCell-root": {
                                        borderBottom: "1px solid var(--color-border)",
                                        color: "var(--color-text)",
                                        backgroundColor: "var(--color-card)"
                                    },
                                    "&:hover": {
                                        backgroundColor: "var(--color-hover-bg)"
                                    }
                                }}
                            >
                                {/* حقل اسم العميل */}
                                <TableCell align={isArabic ? "right" : "left"}>
                                    {row.name}
                                </TableCell>
                                
                                {/* حقل رقم التليفون */}
                                <TableCell align={isArabic ? "right" : "left"}>
                                    {row.phone}
                                </TableCell>
                                
                                {/* حقل رقم التليفون */}
                                <TableCell align={isArabic ? "right" : "left"}>
                                    {row.email}
                                </TableCell>
                                
                                {/* حقل المبلغ */}
                                <TableCell align={isArabic ? "right" : "left"}>
                                    <span style={{
                                        color: "var(--color-primary)",
                                        fontWeight: 600
                                    }}>
                                        {row.totalPurchases}
                                    </span>
                                </TableCell>
                                
                                {/* حقل التاريخ */}
                                <TableCell align={isArabic ? "right" : "left"}>
                                    <span style={{
                                        color: "var(--color-primary)",
                                        fontWeight: 600
                                    }}>
                                        {new Date(row.lastPurchaseDate).toLocaleDateString(
                                            i18n.language === "ar" ? "ar-EG" : "en-US"
                                        )}
                                    </span>
                                </TableCell>
                                
                                {/* حقل الإجراءات */}
                                <TableCell align={isArabic ? "right" : "left"}>
                                    {/* {renderActions()} */}
                                    <Box sx={{ display: "flex", gap: 1 }}>
                                                      <IconButton 
                                                        onClick={() => handleEdit(row._id)}
                                                        sx={{ 
                                                          color: "var(--color-primary)",
                                                          '&:hover': { backgroundColor: 'var(--color-primary)' + '20' }
                                                        }}
                                                      >
                                                        <Edit2 size={18} />
                                                      </IconButton>
                                                      <IconButton 
                                                        onClick={() => handleDelete(row._id)}
                                                        sx={{ 
                                                          color: "#ef4444",
                                                          '&:hover': { backgroundColor: '#ef4444' + '20' }
                                                        }}
                                                      >
                                                        <Trash2 size={18} />
                                                      </IconButton>
                                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            {/* رسالة عدم وجود نتائج */}
                            <TableCell colSpan={columns.length} align="center">
                                <Typography sx={{ padding: '20px', color: 'var(--color-muted)' }}>
                                    {t('noRecords')}
                                </Typography>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};


export default function CustomersTable({ columns }: InvoiceTableProps) {
    const { t } = useTranslation();
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const navigator = useNavigate()

const queryClient = useQueryClient();
const { data } = useQuery({
  queryKey: ["customer"],
  queryFn: fetchCustomers,
});
console.log(data);

const mutation = useMutation({
  mutationFn: deleteCustomer,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["customer"] });
  },
});
const handleDelete = (id: string) => {
  if (confirm("هل أنت متأكد أنك تريد حذف العميل؟")) {
    mutation.mutate(id);
  }
};
const handleEdit = (id: string) => {
  if (confirm("هل أنت متأكد أنك تريد تعديلات للعميل؟")) {
    navigator(`/customers/${id}/edit`)
  }
};

  const filteredRows = useMemo(() => {
    const customers = data || [];
    if (!searchTerm) return customers;
    return customers.filter(row =>
      row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (row.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.phone.includes(searchTerm)
    );
  }, [data, searchTerm]);

  const currentRows = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredRows.slice(start, start + ITEMS_PER_PAGE);
  }, [currentPage, filteredRows]);

    return (
        <Box sx={{ width: '100%', overflow: 'hidden', }}>
            {/* حقل البحث */}
            <Box className="flex flex-col gap-4 p-6 mb-6 card sm:flex-row sm:items-center">
                <div className="relative flex-1">
                <Search className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-muted" />
                <input
                    type="text"
                    placeholder={t("customers.searchPlaceholder")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 input"
                />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 font-medium transition-colors border rounded-lg text-text border-border hover:bg-hover sm:w-auto">
                <Filter size={16} />
                {t("suppliers.filter")}
                </button>
            </Box>

            {/* عرض محتوى الجدول */}
              <Box className="overflow-hidden card">
            <Box  sx={{
                backgroundColor: "var(--color-card)"
                , borderRadius: 3, boxShadow: "none", border: `1px solid var(--color-border)`, overflow: 'hidden', marginBottom: '1px',
            }}>
                <InvoiceTableContent rows={currentRows} columns={columns}   handleDelete={handleDelete} handleEdit={handleEdit}/>
            </Box>

            {/* شريط التنقل (PaginationControls) */}
            <Box sx={{ backgroundColor: "var(--color-card)", overflow: 'hidden', }}>
                <PaginationControls
                    totalItems={filteredRows.length}
                    itemsPerPage={ITEMS_PER_PAGE}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                />
            </Box>
            </Box>
        </Box>
    );
}