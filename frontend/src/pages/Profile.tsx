/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, type JSX } from "react";
import { useUsers } from "../context/UsersContext";
import {
  Edit,
  Save,
  X,
  Mail,
  Calendar,
  Shield,
  User,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Box, Typography } from "@mui/material";

export default function Profile() {
  const { t } = useTranslation();
  const { currentUser, updateProfile, userId, fetchProfile, loading } =
    useUsers();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  // LOAD PROFILE
  useEffect(() => {
    if (!userId) return;
    fetchProfile(userId);
  }, [userId]);

  // SYNC CURRENT USER → FORM DATA
  useEffect(() => {
    if (!currentUser) return;
    setFormData({
      name: currentUser.name,
      email: currentUser.email,
    });
  }, [currentUser]);

  const handleSave = async () => {
    if (!userId) return;

    try {
      await updateProfile(userId, {
        name: formData.name,
      });

      toast.success(t("profile.updateSuccess"));
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      toast.error(t("profile.updateError"));
    }
  };

  const handleCancel = () => {
    if (!currentUser) return;
    setFormData({
      name: currentUser.name,
      email: currentUser.email,
    });
    setIsEditing(false);
  };

  const formatDate = (date?: string) =>
    date ? new Date(date).toLocaleDateString() : "—";

  // LOADING COMPONENT
  if (loading || !currentUser) {
    return (
      <Box sx={{ width: "100%" }} className="p-6">
        {/* Header Skeleton */}
        <Box className="flex flex-col items-start gap-6 mb-8 lg:flex-row lg:items-center">
          {/* Avatar Skeleton */}
          <Box className="relative">
            <Box
              sx={{
                width: "96px",
                height: "96px",
                backgroundColor: "rgba(0, 0, 0, 0.08)",
                borderRadius: "50%",
                animation: "pulse 1.5s infinite",
                "@media (min-width: 1024px)": {
                  width: "128px",
                  height: "128px",
                }
              }}
            />
          </Box>

          {/* Info Skeleton */}
          <Box className="flex-1 space-y-4">
            <Box className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
              <Box className="space-y-2">
                <Box
                  sx={{
                    width: "200px",
                    height: "32px",
                    backgroundColor: "rgba(0, 0, 0, 0.08)",
                    borderRadius: "6px",
                    animation: "pulse 1.5s infinite",
                  }}
                />
                <Box
                  sx={{
                    width: "120px",
                    height: "20px",
                    backgroundColor: "rgba(0, 0, 0, 0.06)",
                    borderRadius: "4px",
                    animation: "pulse 1.5s infinite",
                    animationDelay: "0.2s"
                  }}
                />
              </Box>
              
              {/* Buttons Skeleton */}
              <Box className="flex gap-3">
                <Box
                  sx={{
                    width: "100px",
                    height: "40px",
                    backgroundColor: "rgba(0, 0, 0, 0.06)",
                    borderRadius: "8px",
                    animation: "pulse 1.5s infinite",
                    animationDelay: "0.4s"
                  }}
                />
                <Box
                  sx={{
                    width: "100px",
                    height: "40px",
                    backgroundColor: "rgba(0, 0, 0, 0.06)",
                    borderRadius: "8px",
                    animation: "pulse 1.5s infinite",
                    animationDelay: "0.5s"
                  }}
                />
              </Box>
            </Box>

            {/* Status Skeleton */}
            <Box className="flex items-center gap-4">
              <Box
                sx={{
                  width: "80px",
                  height: "24px",
                  backgroundColor: "rgba(0, 0, 0, 0.06)",
                  borderRadius: "12px",
                  animation: "pulse 1.5s infinite",
                  animationDelay: "0.3s"
                }}
              />
              <Box
                sx={{
                  width: "150px",
                  height: "20px",
                  backgroundColor: "rgba(0, 0, 0, 0.06)",
                  borderRadius: "4px",
                  animation: "pulse 1.5s infinite",
                  animationDelay: "0.4s"
                }}
              />
            </Box>
          </Box>
        </Box>

        {/* Profile Fields Skeleton */}
        <Box className="grid grid-cols-1 gap-6 pt-8 border-t border-border lg:grid-cols-2">
          {[...Array(4)].map((_, index) => (
            <Box key={index} className="flex gap-4 p-4 rounded-lg bg-background">
              {/* Icon Skeleton */}
              <Box
                sx={{
                  width: "40px",
                  height: "40px",
                  backgroundColor: "rgba(0, 0, 0, 0.06)",
                  borderRadius: "50%",
                  animation: "pulse 1.5s infinite",
                  animationDelay: `${index * 0.1}s`
                }}
              />
              
              {/* Content Skeleton */}
              <Box className="flex-1 space-y-2">
                <Box
                  sx={{
                    width: "80px",
                    height: "16px",
                    backgroundColor: "rgba(0, 0, 0, 0.08)",
                    borderRadius: "3px",
                    animation: "pulse 1.5s infinite",
                    animationDelay: `${index * 0.1 + 0.2}s`
                  }}
                />
                <Box
                  sx={{
                    width: "120px",
                    height: "20px",
                    backgroundColor: "rgba(0, 0, 0, 0.06)",
                    borderRadius: "3px",
                    animation: "pulse 1.5s infinite",
                    animationDelay: `${index * 0.1 + 0.3}s`
                  }}
                />
              </Box>
            </Box>
          ))}
        </Box>

        <style>
          {`
            @keyframes pulse {
              0% { opacity: 1; }
              50% { opacity: 0.5; }
              100% { opacity: 1; }
            }
          `}
        </style>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%" }} className="p-6">
      {/* HEADER */}
      <Box className="flex flex-col items-start gap-6 mb-8 lg:flex-row lg:items-center">
        <Box className="relative">
          <img
            className="object-cover w-24 h-24 rounded-full lg:w-32 lg:h-32 bg-card"
            src={
              currentUser.image ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                currentUser.name
              )}&background=008080&color=fff`
            }
            alt="Profile"
          />
        </Box>

        {/* INFO SECTION */}
        <Box className="flex-1">
          <Box className="flex flex-col gap-2 mb-4 lg:flex-row lg:items-center lg:justify-between">
            <Box>
              {isEditing ? (
                <input
                  className="w-full text-2xl font-bold input lg:w-80"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              ) : (
                <Typography variant="h4" className="font-bold text-text">
                  {formData.name}
                </Typography>
              )}

              <Typography className="mt-1 text-sm capitalize text-muted">
                {currentUser.role}
              </Typography>
            </Box>

            {/* BUTTONS */}
            <Box className="flex gap-3">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white rounded-lg bg-primary hover:bg-primary/90"
                  >
                    <Save size={16} /> {t("profile.save")}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg text-text bg-hover"
                  >
                    <X size={16} /> {t("profile.cancel")}
                  </button>
                </>
              ) : (
                <Box className="flex justify-between gap-4">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white rounded-lg bg-primary hover:bg-primary/90"
                  >
                    <Edit size={16} /> {t("profile.editProfile")}
                  </button>

                  <Link
                    to="/changePassword"
                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-colors border-2 rounded-lg text-primary border-primary hover:bg-primary hover:text-white"
                  >
                    {t("profile.changePassword")}
                  </Link>
                </Box>
              )}
            </Box>
          </Box>

          <Box className="flex items-center gap-4">
            <span
              className={`inline-flex items-center gap-2 px-3 py-1 text-sm font-medium rounded-full ${
                currentUser.status === "active"
                  ? "bg-[var(--color-status-paid-bg)] text-[var(--color-status-paid-text)]"
                  : "bg-[var(--color-status-overdue-bg)] text-[var(--color-status-overdue-text)]"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  currentUser.status === "active" 
                    ? "bg-[var(--color-status-paid-text)]" 
                    : "bg-[var(--color-status-overdue-text)]"
                }`}
              />
              {currentUser.status === "active"
                ? t("profile.active")
                : t("profile.inactive")}
            </span>

            <Typography className="text-sm text-muted">
              {t("profile.memberSince")} {formatDate(currentUser.createdAt)}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* DETAILS GRID */}
      <Box className="grid grid-cols-1 gap-6 pt-8 border-t border-border lg:grid-cols-2">
        {/* EMAIL */}
        <ProfileField
          icon={<Mail size={20} className="text-primary" />}
          label={t("profile.email")}
          value={formData.email}
          onChange={(v) => setFormData({ ...formData, email: v })}
        />

        {/* ROLE (READ ONLY) */}
        <ProfileField
          icon={<Shield size={20} className="text-primary" />}
          label={t("profile.role")}
          value={currentUser.role}
        />

        {/* STATUS (READ ONLY) */}
        <ProfileField
          icon={<User size={20} className="text-primary" />}
          label={t("profile.status")}
          value={currentUser.status === "active" ? t("profile.active") : t("profile.inactive")}
        />

        {/* JOIN DATE (READ ONLY) */}
        <ProfileField
          icon={<Calendar size={20} className="text-primary" />}
          label={t("profile.joinDate")}
          value={formatDate(currentUser.createdAt)}
        />
      </Box>
    </Box>
  );
}

function ProfileField({
  icon,
  label,
  value,
  isEditing = false,
  isSelect = false,
  selectOptions = [],
  onChange,
}: {
  icon: JSX.Element;
  label: string;
  value: any;
  isEditing?: boolean;
  isSelect?: boolean;
  selectOptions?: { value: any; label: string }[];
  onChange?: (v: any) => void;
}) {
  return (
    <Box className="flex gap-4 p-4 rounded-lg bg-background card">
      <Box className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
        {icon}
      </Box>

      <Box className="flex-1">
        <Typography className="text-sm font-medium text-text">{label}</Typography>

        {isEditing ? (
          isSelect ? (
            <select
              className="w-full mt-1 input"
              value={value}
              onChange={(e) => onChange?.(e.target.value)}
            >
              {selectOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              className="w-full mt-1 input"
              value={value}
              onChange={(e) => onChange?.(e.target.value)}
            />
          )
        ) : (
          <Typography className="mt-1 text-text">{value}</Typography>
        )}
      </Box>
    </Box>
  );
}