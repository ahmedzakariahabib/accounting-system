/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import { inventorySchema } from "./inventory.validation";
import { Box, Typography, Button, Paper } from "@mui/material";
import {
  ArrowLeft,
  Save,
  Package,
  Tag,
  Truck,
  Ruler,
  Palette,
  Package2,
  AlertTriangle,
  Barcode,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n/i18n";
import { useConfirm } from "../../hooks/useConfirm";

interface Supplier {
  _id: string;
  name: string;
}

interface Props {
  initialValues: any;
  suppliers: Supplier[];
  onSubmit: (values: any, formikHelpers?: any) => void;
  isLoading?: boolean;
}

export default function ItemForm({
  initialValues,
  suppliers,
  onSubmit,
  isLoading = false,
}: Props) {
  const { t } = useTranslation();
  const isArabic = i18n.language === "ar";

  // 🔹 Confirm Hook
  const { confirm, ConfirmDialogComponent } = useConfirm();

  const formik = useFormik({
    initialValues,
    validationSchema: inventorySchema,
    onSubmit: (values, formikHelpers) => onSubmit(values, formikHelpers),
    enableReinitialize: true,
  });

  const submitting = formik.isSubmitting || isLoading;

  // 🔹 Handle submit with confirmation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isEdit = Boolean(initialValues._id);

    const result = await confirm({
      title: isEdit
        ? t("inventory.confirmEdit") || "تأكيد التعديل"
        : t("inventory.confirmSave") || "تأكيد الحفظ",
      message: isEdit
        ? t("inventory.confirmEditMessage") ||
          "هل تريد حفظ التعديلات على هذا العنصر؟"
        : t("inventory.confirmSaveMessage") || "هل تريد حفظ هذا العنصر الجديد؟",
      confirmText: t("inventory.save") || "حفظ",
      cancelText: t("inventory.cancel") || "إلغاء",
      color: "primary",
    });

    if (!result) return;

    formik.handleSubmit();
  };

  // 🔧 دالة للحصول على الخطأ
  const getError = (field: string) =>
    formik.touched[field] && formik.errors[field]
      ? (formik.errors[field] as string)
      : "";

  // Form Sections
  const formSections = [
    {
      icon: Package,
      title: t("inventory.basicInfo"),
      description: t("inventory.basicInfoDescription"),
      fields: [
        {
          name: "itemName",
          label: t("inventory.itemName"),
          placeholder: "e.g., Summer T-Shirt",
          icon: Package2,
          type: "text",
          fullWidth: true,
        },
        {
          name: "category",
          label: t("inventory.category"),
          placeholder: "e.g., Tops",
          icon: Tag,
          type: "text",
          fullWidth: true,
        },
        {
          name: "supplier",
          label: t("inventory.supplier"),
          icon: Truck,
          type: "select",
          options: suppliers,
          fullWidth: true,
        },
      ],
    },
    {
      icon: Ruler,
      title: t("inventory.specifications"),
      description: t("inventory.specificationsDescription"),
      fields: [
        {
          name: "size",
          label: t("inventory.size"),
          icon: Ruler,
          type: "text",
          fullWidth: false,
        },
        {
          name: "color",
          label: t("inventory.color"),
          placeholder: "e.g., Blue",
          icon: Palette,
          type: "text",
          fullWidth: false,
        },
        {
          name: "sku",
          label: "SKU",
          icon: Barcode,
          type: "text",
          fullWidth: false,
        },
      ],
    },
    {
      icon: Package2,
      title: t("inventory.pricingStock"),
      description: t("inventory.pricingStockDescription"),
      fields: [
        {
          name: "quantity",
          label: t("inventory.quantity"),
          icon: Package2,
          type: "number",
          fullWidth: false,
        },
        {
          name: "price",
          label: t("inventory.price"),
          icon: Tag,
          type: "number",
          step: "0.01",
          fullWidth: false,
        },
        {
          name: "lowStockThreshold",
          label: t("inventory.lowStockThreshold"),
          icon: AlertTriangle,
          type: "number",
          fullWidth: false,
        },
      ],
    },
  ];

  const renderField = (field: any) => {
    const IconComponent = field.icon;

    if (field.type === "select") {
      return (
        <div
          className={`flex flex-col gap-3 ${
            field.fullWidth ? "col-span-2" : ""
          }`}
        >
          <label className="text-sm font-medium text-[var(--color-text)] flex items-center gap-2">
            <IconComponent size={16} className="text-[var(--color-primary)]" />
            {field.label}
          </label>
          <select
            name={field.name}
            value={formik.values[field.name]}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={submitting}
            className="h-12 input"
          >
            <option value="">{t("inventory.selectSupplier")}</option>
            {field.options?.map((sp: Supplier) => (
              <option key={sp._id} value={sp._id}>
                {sp.name}
              </option>
            ))}
          </select>
          <span className="text-sm text-red-500 min-h-[20px]">
            {getError(field.name)}
          </span>
        </div>
      );
    }

    return (
      <div
        className={`flex flex-col gap-3 ${field.fullWidth ? "col-span-2" : ""}`}
      >
        <label className="text-sm font-medium text-[var(--color-text)] flex items-center gap-2">
          <IconComponent size={16} className="text-[var(--color-primary)]" />
          {field.label}
        </label>
        <input
          type={field.type}
          step={field.step}
          name={field.name}
          value={formik.values[field.name]}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          disabled={submitting}
          placeholder={field.placeholder}
          className="h-12 input"
        />
        <span className="text-sm text-red-500 min-h-[20px]">
          {getError(field.name)}
        </span>
      </div>
    );
  };

  return (
    <Box sx={{ width: "100%" }} dir={isArabic ? "rtl" : "ltr"}>
      {/* Header */}
      <Box className="flex flex-col gap-4 mb-8">
        <Box className="flex items-center gap-4">
          <Button
            component={Link}
            to="/inventory"
            className="flex items-center justify-center w-10 h-10 transition-colors rounded-lg text-text hover:bg-hover"
          >
            <ArrowLeft size={20} />
          </Button>
          <Box className="flex items-center gap-4">
            <Box className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
              <Package size={24} className="text-primary" />
            </Box>
            <Box>
              <Typography variant="h4" className="font-bold text-text">
                {initialValues._id
                  ? t("inventory.editItem")
                  : t("inventory.newItem")}
              </Typography>
              <Typography className="mt-1 text-muted">
                {initialValues._id
                  ? t("inventory.editItemDescription")
                  : t("inventory.newItemDescription")}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      <form onSubmit={handleSubmit}>
        <Box className="space-y-6">
          {formSections.map((section, index) => (
            <Paper
              key={index}
              className="card"
              sx={{
                boxShadow: "none",
                backgroundColor: "var(--color-card)",
                border: "1px solid var(--color-border)",
                borderRadius: "12px",
                overflow: "hidden",
              }}
            >
              {/* Section Header */}
              <Box className="flex items-center gap-3 p-6 border-b border-border">
                <Box className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                  <section.icon size={20} className="text-primary" />
                </Box>
                <Box>
                  <Typography variant="h6" className="font-bold text-text">
                    {section.title}
                  </Typography>
                  <Typography className="mt-1 text-sm text-muted">
                    {section.description}
                  </Typography>
                </Box>
              </Box>

              {/* Section Fields */}
              <Box className="p-6">
                <Box
                  className={`grid grid-cols-1 ${
                    section.fields.some((f) => f.fullWidth)
                      ? "gap-6"
                      : "md:grid-cols-2 gap-6"
                  }`}
                >
                  {section.fields.map((field, fieldIndex) => (
                    <Box key={fieldIndex}>{renderField(field)}</Box>
                  ))}
                </Box>
              </Box>
            </Paper>
          ))}
        </Box>

        {/* Actions */}
        <Box className="flex flex-col gap-4 mt-8 sm:flex-row sm:justify-end">
          <Button
            component={Link}
            to="/inventory"
            disabled={submitting}
            className="flex items-center justify-center gap-2 px-6 py-3 font-semibold transition-colors rounded-lg text-text bg-hover hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft size={18} />
            {t("inventory.cancel")}
          </Button>

          <Button
            type="submit"
            disabled={submitting || !formik.isValid}
            className="flex items-center justify-center gap-2 px-6 py-3 font-semibold text-white transition-colors rounded-lg bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <Box
                  sx={{
                    width: "18px",
                    height: "18px",
                    border: "2px solid transparent",
                    borderTop: "2px solid white",
                    borderRight: "2px solid white",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                  }}
                />
                {t("inventory.saving")}
              </>
            ) : (
              <>
                <Save size={18} />
                {t("inventory.save")}{" "}
              </>
            )}
          </Button>
        </Box>
      </form>

      {/* 🔹 Confirm Dialog */}
      {ConfirmDialogComponent}

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </Box>
  );
}
