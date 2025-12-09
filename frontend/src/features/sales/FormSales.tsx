/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { useNavigate, useParams } from "react-router-dom";
import i18n from "../../i18n/i18n";
import { useFormik } from "formik";
import {
  fetchSingleSale,
  handleFormSales,
  updateSale,
} from "../../services/api/sales";
import { useQuery } from "@tanstack/react-query";
import { fetchCustomers } from "../../services/api/customers";
import type { NewInvoiceFormValues } from "../../types/sales";
import React from "react";
import { getAllInventory, updateQuantity } from "../../services/api/inventory";
import type { InventoryItem } from "../../types/inventory";

export default function FormSales({
  saleData,
}: {
  saleData?: NewInvoiceFormValues;
}) {
  const { t } = useTranslation();
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id; // إذا هناك id فهذا وضع التعديل
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // جلب العملاء من الـ API
  const { data: customers = [], isLoading: loadingCustomers } = useQuery({
    queryKey: ["customer"],
    queryFn: fetchCustomers,
  });

  // جلب بيانات الفاتورة في وضع التعديل
  const {
    data: sale,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["sale", id],
    queryFn: () => fetchSingleSale(id!),
    enabled: !!id,
  });

  const { data: inventory = [] } = useQuery({
    queryKey: ["inventory"],
    queryFn: getAllInventory,
  });
  const handleSelectInventory = (index: number, selectedId: string) => {
    if (readOnly) return;

    const product: InventoryItem | undefined = inventory.find(
      (item) => item._id === selectedId
    );

    if (!product) return;

    // Clone the current items array
    const updatedItems = [...formik.values.items];

    updatedItems[index] = {
      ...updatedItems[index],
      itemName: product.itemName,
      unitPrice: product.price,
      inventoryId: product._id,

      maxQuantity: product.quantity,
    };

    // Cap quantity if it exceeds stock
    if (updatedItems[index].quantity > product.quantity) {
      updatedItems[index].quantity = product.quantity;
    }

    formik.setFieldValue("items", updatedItems);
  };

  // فورميك
  const formik = useFormik<NewInvoiceFormValues>({
    initialValues: {
      customer: "",
      saleDate: new Date().toISOString().split("T")[0],
      discount: 0,
      taxRate: 15,
      items: [{ itemName: "", quantity: 1, unitPrice: 0 }],
      notes: "",
      paymentStatus: "Pending",
    },
    enableReinitialize: true, // مهم: يسمح بإعادة تعيين القيم عند تغيير البيانات
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        if (isEditMode && id) {
          // ✅ تعديل فقط paymentStatus
          await updateSale(id, values.paymentStatus);
        } else {
          // ✅ إضافة فاتورة جديدة
          await handleFormSales(values);
          // خصم الكميات بعد إضافة الفاتورة
          
          await Promise.all(
            values.items
              .filter((item) => item.inventoryId) // فقط العناصر المرتبطة بالمخزون
              .map((item) =>
                updateQuantity(item.inventoryId, {
                  operation: "subtract",
                  quantity: item.quantity,
                })
              )
          );
        }
        navigate("/sales");
      } catch (error) {
        console.error(error);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  // تحديث القيم عند تحميل بيانات الفاتورة
  React.useEffect(() => {
    if (sale && isEditMode) {
      formik.setValues({
        customer:
          typeof sale.customer === "string"
            ? sale.customer
            : sale.customer?._id || "",
        saleDate: sale.saleDate
          ? new Date(sale.saleDate).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        discount: sale.discount || 0,
        taxRate: sale.taxRate || 15,
        items: sale.items?.map((item: any) => ({
          itemName: item.itemName || "",
          quantity: item.quantity || 1,
          unitPrice: item.unitPrice || 0,
        })) || [{ itemName: "", quantity: 1, unitPrice: 0 }],
        notes: sale.notes || "",
        paymentStatus: sale.paymentStatus || "Pending",
      });
    }
  }, [sale, isEditMode]);

  // تعديل صنف داخل الفاتورة
  type Item = { itemName: string; quantity: number; unitPrice: number };

  const updateItem = (index: number, key: keyof Item, value: any) => {
    if (isEditMode) return;

    const items = [...formik.values.items];

    // فحص المخزون قبل تعديل الكمية
    if (key === "quantity") {
      const max = items[index].maxQuantity ?? 0;

      if (value > max) {
        alert(`❌ لا يمكنك إضافة كمية أكبر من المخزون (${max})`);
        return;
      }
    }

    items[index][key] =
      key === "quantity" || key === "unitPrice" ? Number(value) : value;

    formik.setFieldValue("items", items);
  };

  const addItem = () => {
    if (isEditMode) return;

    formik.setFieldValue("items", [
  ...formik.values.items,
  {
    itemName: "",
    quantity: 1,
    unitPrice: 0,
    inventoryId: "",
    maxQuantity: 0
  }
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

  // حقل قراءة فقط عند وضع التعديل
  const readOnly = isEditMode;

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
        {/* ---------------- Header ---------------- */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/sales")}
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
                  {id ? t("sales.editSale") : t("sales.newSale")}
                </h1>
                <p className="mt-1 text-muted">
                  {id
                    ? t("sales.editSaleDescription")
                    : t("sales.newSaleDescription")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ---------------- Form ---------------- */}
        <form onSubmit={formik.handleSubmit} className="space-y-5">
          {/* 👤 Customer & Date */}
          <div className="card">
            <div className="flex items-center gap-3 p-6 border-b border-border">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                <User size={20} className="text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-text">
                  {t("sales.customerInformation")}
                </h2>
                <p className="mt-1 text-sm text-muted">
                  {t("sales.customerInformationDescription")}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2">
              {/* اختيار العميل */}
              <div className="flex flex-col gap-3">
                <label className="text-sm font-medium text-text">
                  {t("sales.customerName")}
                </label>

                {loadingCustomers ? (
                  <p className="text-sm text-muted">جارٍ تحميل العملاء...</p>
                ) : (
                  <select
                    name="customer"
                    value={formik.values.customer}
                    onChange={formik.handleChange}
                    className="input"
                    disabled={readOnly}
                  >
                    <option value="">-- اختر العميل --</option>
                    {customers.map((c: any) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-sm font-medium text-text">
                  {t("sales.saleDate")}
                </label>
                <input
                  type="date"
                  name="saleDate"
                  value={formik.values.saleDate}
                  onChange={formik.handleChange}
                  className="input"
                  readOnly={readOnly}
                />
              </div>
            </div>
          </div>

          {/* 📦 Items Table */}
          <div className="card">
            <div className="flex items-center gap-3 p-6 border-b border-border">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                <Package size={20} className="text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-text">
                  {t("sales.itemsDetails")}
                </h2>
                <p className="mt-1 text-sm text-muted">
                  {t("sales.itemsDetailsDescription")}
                </p>
              </div>
            </div>

            <div className="p-6 overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-4 py-3 text-sm font-semibold text-left text-text">
                      {t("sales.itemName")}
                    </th>
                    <th className="px-4 py-3 text-sm font-semibold text-center text-text">
                      {t("sales.quantity")}
                    </th>
                    <th className="px-4 py-3 text-sm font-semibold text-center text-text">
                      {t("sales.price")}
                    </th>
                    <th className="px-4 py-3 text-sm font-semibold text-center text-text">
                      {t("sales.total")}
                    </th>
                    {!readOnly && (
                      <th className="px-4 py-3 text-sm font-semibold text-center text-text">
                        {t("sales.actions")}
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
                        <select
                          className="w-full text-sm input"
                          value={item.inventoryId || ""}
                          onChange={(e) =>
                            handleSelectInventory(i, e.target.value)
                          }
                          disabled={readOnly}
                        >
                          <option value="">-- اختر الصنف --</option>
                          {inventory.map((inv) => (
                            <option key={inv._id} value={inv._id}>
                              {inv.itemName} — (المتوفر: {inv.quantity})
                            </option>
                          ))}
                        </select>
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
                            className="p-2 transition-colors rounded-lg text-muted hover:text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>

              {!readOnly && (
                <button
                  type="button"
                  onClick={addItem}
                  className="flex items-center gap-2 px-4 py-3 mt-6 text-sm font-semibold transition-colors rounded-lg bg-primary/10 text-primary hover:bg-primary/20 w-fit"
                >
                  <Plus size={16} />
                  {t("sales.addItem")}
                </button>
              )}
            </div>
          </div>

          {/* 💰 Summary + Notes */}
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
                      {t("sales.notes")}
                    </h2>
                    <p className="mt-1 text-sm text-muted">
                      {t("sales.notesDescription")}
                    </p>
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
                    {t("sales.orderSummary")}
                  </h3>
                  <p className="mt-1 text-sm text-muted">
                    {t("sales.orderSummaryDescription")}
                  </p>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between text-text">
                  <span className="font-medium">{t("sales.subtotal")}</span>
                  <span className="font-bold">{subtotal.toFixed(2)} ر.س</span>
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-text">
                    {t("sales.discount")} (ر.س)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    max={subtotal}
                    name="discount"
                    value={formik.values.discount}
                    onChange={formik.handleChange}
                    className="text-sm text-center w-28 input"
                    readOnly={readOnly}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-text">
                    {t("sales.taxRate")} (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    name="taxRate"
                    value={formik.values.taxRate}
                    onChange={formik.handleChange}
                    className="w-20 text-sm text-center input"
                    readOnly={readOnly}
                  />
                </div>

                <div className="flex justify-between text-text">
                  <span className="font-medium">
                    {t("sales.tax")} ({formik.values.taxRate}%)
                  </span>
                  <span className="font-bold">{taxValue.toFixed(2)} ر.س</span>
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="flex justify-between text-lg font-bold text-text">
                    <span>{t("sales.grandTotal")}</span>
                    <span className="text-primary">
                      {grandTotal.toFixed(2)} ر.س
                    </span>
                  </div>
                </div>

                {/* Payment Status - هذا الحقل فقط القابل للتعديل في وضع التعديل */}
                <div className="pt-4 border-t border-border">
                  <label className="block mb-3 text-sm font-medium text-text">
                    {t("sales.paymentStatus")}
                  </label>
                  <select
                    name="paymentStatus"
                    value={formik.values.paymentStatus}
                    onChange={formik.handleChange}
                    className="w-full input"
                  >
                    <option value="Paid">{t("invoices.table.paid")}</option>
                    <option value="Pending">
                      {t("invoices.table.pending")}
                    </option>
                    <option value="Overdue">
                      {t("invoices.table.overdue")}
                    </option>
                  </select>
                  {isEditMode && (
                    <p className="mt-2 text-xs text-muted">
                      {t("sales.onlyPaymentStatusEditable")}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-4 mt-6 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => navigate("/sales")}
              className="flex items-center justify-center gap-2 px-6 py-3 font-semibold transition-colors rounded-lg text-text bg-hover hover:bg-gray-300"
            >
              <ArrowLeft size={18} />
              {t("sales.cancel")}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 px-6 py-3 font-semibold text-white transition-colors rounded-lg bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={18} />
              {isSubmitting ? t("common.saving") : t("sales.save")}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
