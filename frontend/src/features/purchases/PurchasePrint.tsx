/* eslint-disable @typescript-eslint/no-explicit-any */
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  ArrowRight,
  Printer,
  Building,
  Receipt,
  User,
  Copy,
} from "lucide-react";
import i18n from "../../i18n/i18n";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchSinglePurchase } from "../../services/api/purchases";
import QRCode from "react-qr-code";
import { useRef } from "react";

export default function PurchasesPrint() {
  
  const { t } = useTranslation();
  const { id } = useParams();
  const isArabic = i18n.language === "ar";
  const printRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["purchase", id],
    queryFn: () => fetchSinglePurchase(id!),
    enabled: !!id,
  });

  const purchase = data?.purchase ?? data ?? null;

if (typeof purchase === "number") {
  return null; // أو صفحة خطأ
}


  const copyToClipboard = async () => {
    const invoiceText = `
      Vogue Venture - Purchase Invoice
      Invoice #: ${purchase?._id?.slice(0, 8).toUpperCase()}
      Date: ${
        purchase?.purchaseDate
          ? new Date(purchase.purchaseDate).toLocaleDateString()
          : ""
      }
      Supplier: ${purchase?.supplierName}
      Total: ${purchase?.totalAmount?.toFixed(2)} ر.س
    `;

    try {
      await navigator.clipboard.writeText(invoiceText);
      alert(t("purchases.copiedToClipboard"));
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  // -------------------------------------------------
  // FIX: If purchase is number OR null => Stop here
  // -------------------------------------------------
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen p-8 bg-background">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-bold text-text">{t("loading")}</h2>
        </div>
      </div>
    );
  }

  if (isError || !purchase || typeof purchase === "number") {
    return (
      <div className="flex items-center justify-center min-h-screen p-8 bg-background">
        <div className="text-center">
          <Receipt size={48} className="mx-auto text-red-600 mb-4" />
          <h2 className="mt-4 text-xl font-bold text-text">
            {t("purchases.notFound")}
          </h2>
          <p className="mt-2 text-muted">{t("purchases.invoiceNotFound")}</p>
          <Link
            to="/purchases"
            className="inline-flex items-center gap-2 px-6 py-3 mt-6 font-semibold text-white transition-colors rounded-lg bg-primary hover:bg-primary/90"
          >
            {isArabic ? <ArrowRight size={18} /> : <ArrowLeft size={18} />}
            {t("purchases.backToList")}
          </Link>
        </div>
      </div>
    );
  }

  // -------------------------------------------------
  // FIX: Items always must be array to avoid TypeScript errors
  // -------------------------------------------------
  const items = Array.isArray(purchase.items) ? purchase.items : [];

  const subtotal = items.reduce(
    (sum: number, item: any) =>
      sum + (item.totalPrice || item.quantity * item.unitPrice || 0),
    0
  );

  const taxRate = purchase.taxRate ?? 15;
  const tax = purchase.taxAmount ?? (subtotal * taxRate) / 100;
  const discount = purchase.discount ?? 0;
  const grandTotal = purchase.totalAmount ?? subtotal + tax - discount;

  const qrData = JSON.stringify({
    seller: "Vogue Venture",
    vat_number: "310456789100003",
    vat_amount: tax,
    total_with_vat: grandTotal,
    invoice_date: purchase.purchaseDate,
    invoice_id: purchase._id,
    timestamp: new Date().toISOString(),
  });

  return (
    <section className="min-h-screen bg-background">
      <div className="max-w-4xl p-4 mx-auto md:p-6">
        {/* Header Actions */}
        <div className="flex flex-col gap-4 mb-6 no-print sm:flex-row sm:justify-between sm:items-center">
          <Link
            to="/purchases"
            className="flex items-center justify-center gap-2 px-4 py-3 font-semibold transition-colors rounded-lg text-text bg-hover hover:bg-gray-300 w-fit"
          >
            {isArabic ? <ArrowRight size={18} /> : <ArrowLeft size={18} />}
            {t("purchases.back")}
          </Link>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-2 px-4 py-3 font-semibold text-primary border border-primary transition-colors rounded-lg bg-white hover:bg-gray-100 hover:underline"
            >
              <Copy size={18} />
              {t("purchases.copy")}
            </button>

            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-3 font-semibold text-white transition-colors rounded-lg bg-primary hover:bg-primary/90"
            >
              <Printer size={18} />
              {t("purchases.print")}
            </button>
          </div>
        </div>

        {/* Invoice Card */}
        <div ref={printRef} className="card printable-area invoice">
          {/* Company Header */}
          <div className="p-6 border-b border-border md:p-8">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
              <div className="flex gap-4">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                  <Building size={32} className="text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-text">Vogue Venture</h1>
                  <p className="text-muted">{t("purchases.companyType")}</p>
                  <p className="mt-1 text-sm text-muted">VAT: 310456789100003</p>
                </div>
              </div>

              <div className="text-right">
                <div className="inline-flex flex-col p-4 rounded-lg bg-primary/5">
                  <span className="text-lg font-bold text-primary">
                    {t("purchases.purchaseInvoice")}
                  </span>
                  <span className="font-mono text-muted">
                    #{purchase._id?.slice(0, 8).toUpperCase()}
                  </span>
                </div>

                <div className="mt-3 space-y-1 text-sm text-muted">
                  <p>
                    {t("purchases.date")}:{" "}
                    <span className="font-medium text-text">
                      {purchase.purchaseDate
                        ? new Date(purchase.purchaseDate).toLocaleDateString(
                            "en-GB"
                          )
                        : "N/A"}
                    </span>
                  </p>

                  {purchase.dueDate && (
                    <p>
                      {t("purchases.dueDate")}:{" "}
                      <span className="font-medium text-text">
                        {new Date(purchase.dueDate).toLocaleDateString("en-GB")}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Supplier Information */}
          <div className="p-6 border-b border-border md:p-8">
            <div className="flex gap-3 items-start">
              <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-full bg-primary/10">
                <User size={20} className="text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text">
                  {t("purchases.supplier")}
                </h3>
                <p className="font-medium text-text">
                  {purchase.supplierName}
                </p>
                {purchase.supplierVAT && (
                  <p className="mt-1 text-sm text-muted">
                    {t("purchases.vatNumber")}: {purchase.supplierVAT}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="p-6 md:p-8">
            <div className="border rounded-lg overflow-hidden border-border">
              <table className="w-full">
                <thead className="bg-table-header">
                  <tr>
                    <th className="px-4 py-3 text-sm font-semibold text-right text-text">
                      #
                    </th>
                    <th className="px-4 py-3 text-sm font-semibold text-right text-text">
                      {t("purchases.itemName")}
                    </th>
                    <th className="px-4 py-3 text-sm font-semibold text-center text-text">
                      {t("purchases.quantity")}
                    </th>
                    <th className="px-4 py-3 text-sm font-semibold text-left text-text">
                      {t("purchases.unitPrice")}
                    </th>
                    <th className="px-4 py-3 text-sm font-semibold text-left text-text">
                      {t("purchases.total")}
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-border">
                  {items.map((item: any, i: number) => (
                    <tr key={i} className="hover:bg-hover">
                      <td className="px-4 py-3 text-sm text-text">{i + 1}</td>
                      <td className="px-4 py-3 text-sm font-medium text-text">
                        {item.itemName}
                      </td>
                      <td className="px-4 py-3 text-sm text-center text-text">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-3 text-sm text-text">
                        {item.unitPrice?.toFixed(2)} ر.س
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-text">
                        {(
                          item.totalPrice ||
                          item.quantity * item.unitPrice ||
                          0
                        ).toFixed(2)}{" "}
                        ر.س
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary + Notes */}
            <div className="grid grid-cols-1 gap-8 mt-8 lg:grid-cols-2">
              {purchase.notes && (
                <div className="p-4 border rounded-lg h-fit bg-hover border-border">
                  <h3 className="mb-2 font-semibold text-primary">
                    {t("purchases.notes")}
                  </h3>
                  <p className="text-text whitespace-pre-wrap">
                    {purchase.notes}
                  </p>
                </div>
              )}

              {/* Summary */}
              <div>
                <div className="space-y-3">
                  <div className="flex justify-between py-2">
                    <span className="text-muted">
                      {t("purchases.subtotal")}
                    </span>
                    <span className="font-medium text-text">
                      {subtotal.toFixed(2)} ر.س
                    </span>
                  </div>

                  <div className="flex justify-between py-2">
                    <span className="text-muted">
                      {t("purchases.tax")} ({taxRate}%)
                    </span>
                    <span className="font-medium text-text">
                      {tax.toFixed(2)} ر.س
                    </span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between py-2 text-red-600">
                      <span>{t("purchases.discount")}</span>
                      <span className="font-medium">
                        -{discount.toFixed(2)} ر.س
                      </span>
                    </div>
                  )}

                  <div className="my-3 border-t border-border" />

                  <div className="flex justify-between p-4 rounded-lg font-bold text-xl bg-primary/5">
                    <span className="text-text">
                      {t("purchases.total")}
                    </span>
                    <span className="text-primary">
                      {grandTotal.toFixed(2)} ر.س
                    </span>
                  </div>
                </div>

                {/* QR Code */}
                <div className="mt-8 text-center">
                  <div className="inline-block p-4 bg-white border rounded-lg border-border">
                    <QRCode
                      value={qrData}
                      size={120}
                      style={{
                        height: "auto",
                        maxWidth: "100%",
                        width: "100%",
                      }}
                    />
                  </div>
                  <p className="mt-2 text-sm text-muted">
                    ZATCA Compliant QR Code
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    {t("purchases.scanForVerification")}
                  </p>
                </div>

                {/* Footer */}
                <div className="pt-4 mt-8 text-center border-t border-border">
                  <p className="text-sm text-muted">
                    {t("purchases.thankYou")}
                  </p>
                  <p className="mt-2 text-xs text-muted">
                    {t("purchases.termsAndConditions")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
