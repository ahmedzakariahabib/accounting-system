/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo, useState } from "react";
import {
  Box,
  Table,
  Paper,
  Button,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableContainer,
  IconButton,
  Typography,
  Chip,
} from "@mui/material";
import {
  Edit2,
  Trash2,
  Search,
  ArrowLeft,
  ArrowRight,
  Users,
  Plus,
  Mail,
  Shield,
  User2,
  Package,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n/i18n";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { getAllUsers, deleteUser } from "../../services/api/users";
import type { User } from "../../context/UsersContext";

// --------------------------------------------------
// SKELETON LOADER
// --------------------------------------------------

const TableSkeleton = () => (
  <Box sx={{ width: "100%" }}>
    {/* Search Skeleton */}
    <Box className="flex flex-col gap-4 p-6 mb-6 card sm:flex-row sm:items-center">
      <Box className="relative flex-1">
        <Box
          sx={{
            width: "100%",
            height: "40px",
            backgroundColor: "rgba(0, 0, 0, 0.06)",
            borderRadius: "8px",
            animation: "pulse 1.5s infinite",
          }}
        />
      </Box>
    </Box>

    {/* Table Skeleton */}
    <Paper
      sx={{
        backgroundColor: "var(--color-card)",
        borderRadius: "12px",
        border: "1px solid var(--color-border)",
        overflow: "hidden",
        boxShadow: "none",
      }}
    >
      {/* Table Header Skeleton */}
      <Box className="flex items-center gap-3 p-6 border-b border-border">
        <Box
          sx={{
            width: "120px",
            height: "24px",
            backgroundColor: "rgba(0, 0, 0, 0.08)",
            borderRadius: "4px",
            animation: "pulse 1.5s infinite",
          }}
        />
      </Box>

      {/* Table Body Skeleton */}
      <Box className="p-6">
        {[...Array(6)].map((_, rowIndex) => (
          <Box key={rowIndex} className="flex gap-4 mb-4 last:mb-0">
            {[...Array(5)].map((_, colIndex) => (
              <Box
                key={colIndex}
                sx={{
                  flex: 1,
                  height: "20px",
                  backgroundColor: "rgba(0, 0, 0, 0.06)",
                  borderRadius: "3px",
                  animation: "shimmer 2s infinite linear",
                  animationDelay: `${(rowIndex + colIndex) * 0.1}s`,
                }}
              />
            ))}
          </Box>
        ))}
      </Box>
    </Paper>
  </Box>
);

// --------------------------------------------------
// PAGINATION COMPONENT
// --------------------------------------------------

const PaginationControls = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
}: {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const { t } = useTranslation();
  const isArabic = i18n.language === "ar";

  const start = (currentPage - 1) * itemsPerPage + 1;
  const end = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <Box className="flex flex-col items-center justify-between gap-4 p-6 border-t border-border sm:flex-row">
      <Typography className="text-sm text-muted">
        {t("users.showing")} {start}-{end} {t("users.of")} {totalItems}
      </Typography>

      <Box className="flex items-center gap-2">
        {/* PREV */}
        <Button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="flex items-center justify-center w-10 h-10 border rounded-lg border-border text-text hover:bg-hover disabled:opacity-50"
        >
          {isArabic ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
        </Button>

        {/* PAGE INFO */}
        <Typography className="px-3 text-sm font-semibold text-text">
          {currentPage}/{totalPages}
        </Typography>

        {/* NEXT */}
        <Button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="flex items-center justify-center w-10 h-10 border rounded-lg border-border text-text hover:bg-hover disabled:opacity-50"
        >
          {isArabic ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
        </Button>
      </Box>
    </Box>
  );
};

// --------------------------------------------------
// TABLE CONTENT
// --------------------------------------------------

const UsersTableContent = ({
  users,
  onEdit,
  onDelete,
}: {
  users: User[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}) => {
  const { t } = useTranslation();
  const isArabic = i18n.language === "ar";

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield size={16} className="text-purple-500" />;
      case "cashier":
        return <User2 size={16} className="text-blue-500" />;
      case "inventory":
        return <Package size={16} className="text-green-500" />;
      default:
        return <User2 size={16} />;
    }
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
              t("users.name"),
              t("users.email"),
              t("users.role"),
              t("users.status"),
              t("users.actions"),
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
          {users.map((user) => (
            <TableRow
              key={user._id}
              sx={{
                "&:last-child td": { borderBottom: 0 },
                "&:hover": { backgroundColor: "var(--color-hover-bg)" },
              }}
            >
              <TableCell align={isArabic ? "right" : "left"}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <img
                    src={
                      user.image ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        user.name
                      )}&background=008080&color=fff`
                    }
                    alt={user.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <Typography fontWeight={600} className="text-text">
                    {user.name}
                  </Typography>
                </Box>
              </TableCell>

              <TableCell align={isArabic ? "right" : "left"}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Mail size={16} className="text-muted" />
                  <Typography className="text-text">{user.email}</Typography>
                </Box>
              </TableCell>

              <TableCell align={isArabic ? "right" : "left"}>
                <Chip
                  icon={getRoleIcon(user.role)}
                  label={t(`users.${user.role}`)}
                  size="small"
                  sx={{
                    backgroundColor:
                      user.role === "admin"
                        ? "var(--color-status-overdue-bg)"
                        : user.role === "cashier"
                        ? "var(--color-status-pending-bg)"
                        : "var(--color-status-paid-bg)",
                    color:
                      user.role === "admin"
                        ? "var(--color-status-overdue-text)"
                        : user.role === "cashier"
                        ? "var(--color-status-pending-text)"
                        : "var(--color-status-paid-text)",
                    fontWeight: 500,
                  }}
                />
              </TableCell>

              <TableCell align={isArabic ? "right" : "left"}>
                <Chip
                  label={
                    user.verified ? t("users.active") : t("users.inactive")
                  }
                  size="small"
                  sx={{
                    backgroundColor: user.verified
                      ? "var(--color-status-paid-bg)"
                      : "var(--color-status-overdue-bg)",
                    color: user.verified
                      ? "var(--color-status-paid-text)"
                      : "var(--color-status-overdue-text)",
                    fontWeight: 600,
                    minWidth: "80px",
                  }}
                />
              </TableCell>

              <TableCell align={isArabic ? "right" : "left"}>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <IconButton
                    onClick={() => onEdit(user._id!)}
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
                    onClick={() => onDelete(user._id!)}
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

          {users.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={5}
                align="center"
                sx={{ py: 8, color: "var(--color-muted)" }}
              >
                <Box sx={{ textAlign: "center" }}>
                  <Users size={48} className="mx-auto mb-4 text-muted" />
                  <Typography variant="h6" className="text-muted">
                    {t("users.noUsersFound")}
                  </Typography>
                  <Typography className="mt-2 text-muted">
                    {t("users.noUsersDescription")}
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

// --------------------------------------------------
// MAIN USERS LIST PAGE (FULL PAGE)
// --------------------------------------------------

export default function UsersList() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const isArabic = i18n.language === "ar";

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  // Fetching Users
  const { data = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: getAllUsers,
  });

  // Delete Mutation
  const mutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });

  const handleDelete = (id: string) => {
    if (confirm(t("users.deleteConfirmMessage"))) {
      mutation.mutate(id);
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/userForm?id=${id}`);
  };

  // Filtering
  const filteredUsers = useMemo(() => {
    return data.filter((user: User) =>
      [user.name, user.email, user.role]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [data, search]);

  // Pagination
  const usersToShow = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredUsers.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredUsers, currentPage]);

  if (isLoading) {
    return (
      <Box sx={{ width: "100%" }} dir={isArabic ? "rtl" : "ltr"}>
        <TableSkeleton />
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%" }} dir={isArabic ? "rtl" : "ltr"}>
      <div className="w-full p-6 mx-auto max-w-7xl">
        {/* PAGE HEADER */}
        <Box className="flex flex-col gap-6 mb-8">
          <Box className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center">
            <Box className="flex items-center gap-4">
              <Box className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                <Users className="text-primary" size={24} />
              </Box>

              <Box>
                <Typography variant="h4" className="font-bold text-text">
                  {t("users.title")}
                </Typography>
                <Typography className="mt-1 text-muted">
                  {t("users.subtitle", { count: data.length })}
                </Typography>
              </Box>
            </Box>

            <Link
              onClick={() => navigate("/userForm")}
              className="flex items-center gap-2 px-4 py-3 font-semibold text-white transition-colors rounded-lg shadow-sm bg-primary hover:bg-primary/90 w-fit"
              to={""}
            >
              <Plus size={18} />
              {t("users.addNew")}
            </Link>
          </Box>
        </Box>

        {/* SEARCH BAR */}
        <Paper
          className="p-6 mb-6"
          sx={{
            backgroundColor: "var(--color-card)",
            borderRadius: "12px",
            border: "1px solid var(--color-border)",
            boxShadow: "none",
          }}
        >
          <Box className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Box className="relative flex-1">
              <Search className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-muted" />
              <input
                type="text"
                placeholder={t("users.searchPlaceholder")}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 input"
              />
            </Box>
          </Box>
        </Paper>

        {/* TABLE */}

        {/* Table Header */}

        <Box className="overflow-hidden card">
          <UsersTableContent
            users={usersToShow}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          {/* PAGINATION */}
          {filteredUsers.length > 0 && (
            <PaginationControls
              totalItems={filteredUsers.length}
              itemsPerPage={ITEMS_PER_PAGE}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          )}
        </Box>
      </div>

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
