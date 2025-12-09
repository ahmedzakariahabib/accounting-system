/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Plus,
  Trash2,
  ArrowLeft,
  Save,
  User,
  Package,
  Receipt,
  FileText,
} from "lucide-react";
import i18n from "../../i18n/i18n";
import {
  fetchSinglePurchase,
  handleFormPurchases,
  updatePurchase,
} from "../../services/api/purchases";
import { fetchSuppliers } from "../../services/api/suppliers";
import { useQuery } from "@tanstack/react-query";
import { useFormik } from "formik";
import type { NewPurchaseFormValues } from "../../types/purchases";

export default function FormPurchases({
  purchaseData,
}: {
  purchaseData?: NewPurchaseFormValues;
}) {
  const { t } = useTranslation();
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const { data: suppliers = [], isLoading: loadingSuppliers } = useQuery({
    queryKey: ["suppliers"],
    queryFn: fetchSuppliers,
  });

  const {
    data: purchase,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["purchase", id],
    queryFn: () => fetchSinglePurchase(id!),
    enabled: !!id,
  });

  const formik = useFormik<NewPurchaseFormValues>({
    initialValues: {
      supplierName: "",
      purchaseDate: new Date().toISOString().split("T")[0],
      discount: 0,
      taxRate: 15,
      items: [{ itemName: "", quantity: 1, unitPrice: 0 }],
      notes: "",
      status: "Ordered",
    },
    enableReinitialize: true,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        if (isEditMode && id) {
          await updatePurchase(id, values.status);
        } else {
          await handleFormPurchases(values);
        }
        navigate("/purchases");
      } catch (error) {
        console.error(error);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  React.useEffect(() => {
    if (purchase && isEditMode) {
      formik.setValues({
        supplierName: purchase.supplierName || "",
        purchaseDate: purchase.purchaseDate
          ? purchase.purchaseDate.split("T")[0]
          : new Date().toISOString().split("T")[0],
        discount: purchase.discount || 0,
        taxRate: purchase.taxRate || 15,
        items: purchase.items?.map((item: any) => ({
          itemName: item.itemName || "",
          quantity: item.quantity || 1,
          unitPrice: item.unitPrice || 0,
        })) ?? [{ itemName: "", quantity: 1, unitPrice: 0 }],
        notes: purchase.notes || "",
        status: purchase.status || "Ordered",
      });
    }
  }, [purchase, isEditMode]);

  const readOnly = isEditMode;

  type Item = { itemName: string; quantity: number; unitPrice: number };

  const updateItem = (
    index: number,
    key: keyof Item,
    value: string | number
  ) => {
    if (isEditMode) return;

    const items: Item[] = [...formik.values.items];

    if (key === "itemName") {
      items[index][key] = value as string;
    } else {
      items[index][key] = Number(value) as number;
    }

    formik.setFieldValue("items", items);
  };

  const addItem = () => {
    if (isEditMode) return;
    formik.setFieldValue("items", [
      ...formik.values.items,
      { itemName: "", quantity: 1, unitPrice: 0 },
    ]);
  };

  const removeItem = (index: number) => {
    if (isEditMode) return;
    if (formik.values.items.length > 1) {
      const items = formik.values.items.filter((_, i) => i !== index);
      formik.setFieldValue("items", items);
    }
  };

  const subtotal = formik.values.items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );
  const taxValue = subtotal * (formik.values.taxRate / 100);
  const grandTotal = subtotal - formik.values.discount + taxValue;

  if (isLoading) {
    return (
      <main className="flex items-center justify-center flex-1 p-6 bg-background">
        <div className="text-lg text-text">{t("common.loading")}</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex items-center justify-center flex-1 p-6 bg-background">
        <div className="text-lg text-red-600">
          {t("common.errorLoadingData")}
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 p-6 bg-background" dir={isArabic ? "rtl" : "ltr"}>
      <div className="w-full mx-auto space-y-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/purchases")}
              className="flex items-center justify-center w-10 h-10 transition-colors rounded-lg text-text hover:bg-hover"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                <Receipt size={24} className="text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-text">
                  {id
                    ? t("purchases.editPurchase")
                    : t("purchases.newPurchase")}
                </h1>
                <p className="mt-1 text-muted">
                  {id
                    ? t("purchases.editPurchaseDescription")
                    : t("purchases.newPurchaseDescription")}
                </p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-5">
          {/* Supplier & Date */}
          <div className="card">
            <div className="flex items-center gap-3 p-6 border-b border-border">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                <User size={20} className="text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-text">
                  {t("purchases.supplierInformation")}
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2">
              <div className="flex flex-col gap-3">
                <label className="text-sm font-medium text-text">
                  {t("purchases.supplierName")}
                </label>

                {loadingSuppliers ? (
                  <p className="text-sm text-muted">جارٍ التحميل...</p>
                ) : (
                  <select
                    name="supplierName"
                    value={formik.values.supplierName}
                    onChange={formik.handleChange}
                    className="input"
                    disabled={readOnly}
                  >
                    <option value="">-- اختر المورد --</option>
                    {suppliers.map((s: any) => (
                      <option key={s._id} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-sm font-medium text-text">
                  {t("purchases.date")}
                </label>
                <input
                  type="date"
                  name="purchaseDate"
                  value={formik.values.purchaseDate}
                  onChange={formik.handleChange}
                  className="input"
                  readOnly={readOnly}
                />
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="card">
            <div className="flex items-center gap-3 p-6 border-b border-border">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                <Package size={20} className="text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-text">
                  {t("purchases.itemsDetails")}
                </h2>
              </div>
            </div>

            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="px-4 py-3 text-sm font-semibold text-left text-text">
                        {t("purchases.itemName")}
                      </th>
                      <th className="px-4 py-3 text-sm font-semibold text-center text-text">
                        {t("purchases.quantity")}
                      </th>
                      <th className="px-4 py-3 text-sm font-semibold text-center text-text">
                        {t("purchases.price")}
                      </th>
                      <th className="px-4 py-3 text-sm font-semibold text-center text-text">
                        {t("purchases.total")}
                      </th>
                      {!readOnly && (
                        <th className="px-4 py-3 text-sm font-semibold text-center text-text">
                          {t("purchases.actions")}
                        </th>
                      )}
                    </tr>
                  </thead>

                  <tbody>
                    {formik.values.items.map((item, i) => (
                      <tr
                        key={i}
                        className="transition-colors border-b border-border hover:bg-hover"
                      >
                        <td className="px-4 py-3">
                          <input
                            name={`items[${i}].itemName`}
                            value={item.itemName}
                            onChange={(e) =>
                              updateItem(i, "itemName", e.target.value)
                            }
                            className="w-full text-sm input"
                            readOnly={readOnly}
                          />
                        </td>

                        <td className="px-4 py-3 text-center">
                          <input
                            type="number"
                            min="1"
                            name={`items[${i}].quantity`}
                            value={item.quantity}
                            onChange={(e) =>
                              updateItem(i, "quantity", +e.target.value)
                            }
                            className="w-20 text-sm text-center input"
                            readOnly={readOnly}
                          />
                        </td>

                        <td className="px-4 py-3 text-center">
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            name={`items[${i}].unitPrice`}
                            value={item.unitPrice}
                            onChange={(e) =>
                              updateItem(i, "unitPrice", +e.target.value)
                            }
                            className="w-24 text-sm text-center input"
                            readOnly={readOnly}
                          />
                        </td>

                        <td className="px-4 py-3 font-medium text-center">
                          {(item.quantity * item.unitPrice).toFixed(2)} ر.س
                        </td>

                        {!readOnly && (
                          <td className="px-4 py-3 text-center">
                            <button
                              type="button"
                              onClick={() => removeItem(i)}
                              disabled={formik.values.items.length === 1}
                              className="p-2 transition-colors rounded-lg text-muted hover:text-red-600 hover:bg-red-50 disabled:opacity-50"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {!readOnly && (
                <button
                  onClick={addItem}
                  type="button"
                  className="flex items-center gap-2 px-4 py-3 mt-6 text-sm font-semibold transition-colors rounded-lg bg-primary/10 text-primary hover:bg-primary/20 w-fit"
                >
                  <Plus size={16} />
                  {t("purchases.addItem")}
                </button>
              )}
            </div>
          </div>

          {/* Summary + Notes */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Notes */}
            <div className="lg:col-span-1">
              <div className="card">
                <div className="flex items-center gap-3 p-6 border-b border-border">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                    <FileText size={20} className="text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-text">
                      {t("purchases.notes")}
                    </h2>
                  </div>
                </div>

                <div className="p-6">
                  <textarea
                    name="notes"
                    value={formik.values.notes}
                    onChange={formik.handleChange}
                    rows={6}
                    className="w-full resize-none input"
                    readOnly={readOnly}
                  />
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="card">
              <div className="flex items-center gap-3 p-6 border-b border-border">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                  <Receipt size={20} className="text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-text">
                    {t("purchases.orderSummary")}
                  </h3>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex justify-between text-text">
                  <span className="font-medium">{t("purchases.subtotal")}</span>
                  <span className="font-bold">{subtotal.toFixed(2)} ر.س</span>
                </div>

                <div className="flex justify-between text-text">
                  <span className="font-medium">{t("purchases.tax")}</span>
                  <span className="font-bold">{taxValue.toFixed(2)} ر.س</span>
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="flex justify-between text-lg font-bold text-text">
                    <span>{t("purchases.total")}</span>
                    <span className="text-primary">
                      {grandTotal.toFixed(2)} ر.س
                    </span>
                  </div>
                </div>

                {/* Payment Status */}
                <div className="pt-4 border-t border-border">
                  <label className="block mb-3 text-sm font-medium text-text">
                    {t("purchases.status")}
                  </label>

                  <select
                    name="status"
                    value={formik.values.status}
                    onChange={formik.handleChange}
                    className="w-full input"
                  >
                    <option value="Ordered">{t("purchases.ordered")}</option>
                    <option value="Delivered">
                      {t("purchases.delivered")}
                    </option>
                    <option value="Cancelled">
                      {t("purchases.cancelled")}
                    </option>
                  </select>

                  {isEditMode && (
                    <p className="mt-2 text-xs text-muted">
                      {t("purchases.onlyStatusEditable")}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-4 mt-6 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => navigate("/purchases")}
              className="flex items-center justify-center gap-2 px-6 py-3 font-semibold transition-colors rounded-lg text-text bg-hover hover:bg-gray-300"
            >
              <ArrowLeft size={18} />
              {t("purchases.cancel")}
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 px-6 py-3 font-semibold text-white transition-colors rounded-lg bg-primary hover:bg-primary/90 disabled:opacity-50"
            >
              <Save size={18} />
              {isSubmitting ? t("common.saving") : t("purchases.save")}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
