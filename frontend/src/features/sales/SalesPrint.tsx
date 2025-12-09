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
import { fetchSingleSale } from "../../services/api/sales";
import QRCode from "react-qr-code";
import { useRef } from "react";

export default function SalesPrint() {
  const { t } = useTranslation();
  const { id } = useParams();
  const isArabic = i18n.language === "ar";
  const printRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["sale", id],
    queryFn: () => fetchSingleSale(id!),
    enabled: !!id,
  });

  const sale = data ?? null; // ✅ تم التعديل

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

  if (isError || !sale) {
    return (
      <div className="flex items-center justify-center min-h-screen p-8 bg-background">
        <div className="text-center">
          <Receipt size={48} className="mx-auto text-red-600 mb-4" />
          <h2 className="mt-4 text-xl font-bold text-text">{t("sales.notFound")}</h2>
          <Link
            to="/sales"
            className="inline-flex items-center gap-2 px-6 py-3 mt-6 font-semibold text-white transition-colors rounded-lg bg-primary hover:bg-primary/90"
          >
            {isArabic ? <ArrowRight size={18} /> : <ArrowLeft size={18} />}
            {t("sales.back")}
          </Link>
        </div>
      </div>
    );
  }

  // -------------------------------------------------
  // Items array
  // -------------------------------------------------
  const items = Array.isArray(sale.items) ? sale.items : [];

  const subtotal = items.reduce(
    (sum: number, item: any) =>
      sum + (item.total || item.unitPrice * item.quantity || 0),
    0
  );
const taxRate = sale.taxRate ?? 15;
const tax = subtotal * taxRate / 100;
const discount = sale.discount ?? 0;

// ✅ Wrap nullish coalescing part in parentheses
const grandTotal = (sale.grandTotal ?? (subtotal + tax - discount));


  const customerName = sale.customer?.name ?? "—";

  const qrData = JSON.stringify({
    seller: "Vogue Venture",
    vat_amount: tax,
    total_with_vat: grandTotal,
    invoice_date: sale.saleDate,
    invoice_id: sale._id,
    timestamp: new Date().toISOString(),
  });

  const copyToClipboard = async () => {
    const invoiceText = `
      Vogue Venture - Sale Invoice
      Invoice #: ${sale.invoiceNumber.slice(0, 8).toUpperCase()}
      Date: ${new Date(sale.saleDate).toLocaleDateString()}
      Customer: ${customerName}
      Total: ${grandTotal.toFixed(2)} ر.س
    `;

    try {
      await navigator.clipboard.writeText(invoiceText);
      alert(t("sales.copiedToClipboard"));
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <section className="min-h-screen bg-background">
      <div className="max-w-4xl p-4 mx-auto md:p-6">
        {/* Header Actions */}
        <div className="flex flex-col gap-4 mb-6 no-print sm:flex-row sm:justify-between sm:items-center">
          <Link
            to="/sales"
            className="flex items-center justify-center gap-2 px-4 py-3 font-semibold transition-colors rounded-lg text-text bg-hover hover:bg-gray-300 w-fit"
          >
            {isArabic ? <ArrowRight size={18} /> : <ArrowLeft size={18} />}
            {t("sales.back")}
          </Link>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-2 px-4 py-3 font-semibold text-primary border border-primary transition-colors rounded-lg bg-white hover:bg-gray-100 hover:underline"
            >
              <Copy size={18} />
              {t("sales.copy")}
            </button>

            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-3 font-semibold text-white transition-colors rounded-lg bg-primary hover:bg-primary/90"
            >
              <Printer size={18} />
              {t("sales.print")}
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
                  <p className="text-muted">{t("sales.companyType")}</p>
                  <p className="mt-1 text-sm text-muted">VAT: 310456789100003</p>
                </div>
              </div>

              <div className="text-right">
                <div className="inline-flex flex-col p-4 rounded-lg bg-primary/5">
                  <span className="text-lg font-bold text-primary">{t("sales.saleInvoice")}</span>
                  <span className="font-mono text-muted">#{sale.invoiceNumber.slice(0, 8).toUpperCase()}</span>
                </div>

                <div className="mt-3 space-y-1 text-sm text-muted">
                  <p>{t("sales.date")}: <span className="font-medium text-text">{new Date(sale.saleDate).toLocaleDateString("en-GB")}</span></p>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="p-6 border-b border-border md:p-8">
            <div className="flex gap-3 items-start">
              <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-full bg-primary/10">
                <User size={20} className="text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text">{t("sales.customer")}</h3>
                <p className="font-medium text-text">{customerName}</p>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="p-6 md:p-8">
            <div className="border rounded-lg overflow-hidden border-border">
              <table className="w-full">
                <thead className="bg-table-header">
                  <tr>
                    <th className="px-4 py-3 text-sm font-semibold text-right text-text">#</th>
                    <th className="px-4 py-3 text-sm font-semibold text-right text-text">{t("sales.itemName")}</th>
                    <th className="px-4 py-3 text-sm font-semibold text-center text-text">{t("sales.quantity")}</th>
                    <th className="px-4 py-3 text-sm font-semibold text-left text-text">{t("sales.unitPrice")}</th>
                    <th className="px-4 py-3 text-sm font-semibold text-left text-text">{t("sales.total")}</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-border">
                  {items.map((item: any, i: number) => (
                    <tr key={i} className="hover:bg-hover">
                      <td className="px-4 py-3 text-sm text-text">{i + 1}</td>
                      <td className="px-4 py-3 text-sm font-medium text-text">{item.itemName}</td>
                      <td className="px-4 py-3 text-sm text-center text-text">{item.quantity}</td>
                      <td className="px-4 py-3 text-sm text-text">{item.unitPrice.toFixed(2)} ر.س</td>
                      <td className="px-4 py-3 text-sm font-medium text-text">{(item.total ?? item.unitPrice * item.quantity).toFixed(2)} ر.س</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary + Notes */}
            <div className="grid grid-cols-1 gap-8 mt-8 lg:grid-cols-2">
              {sale.notes && (
                <div className="p-4 border rounded-lg h-fit bg-hover border-border">
                  <h3 className="mb-2 font-semibold text-primary">{t("sales.notes")}</h3>
                  <p className="text-text whitespace-pre-wrap">{sale.notes}</p>
                </div>
              )}

              {/* Summary */}
              <div>
                <div className="space-y-3">
                  <div className="flex justify-between py-2">
                    <span className="text-muted">{t("sales.subtotal")}</span>
                    <span className="font-medium text-text">{subtotal.toFixed(2)} ر.س</span>
                  </div>

                  <div className="flex justify-between py-2">
                    <span className="text-muted">{t("sales.tax")} ({taxRate}%)</span>
                    <span className="font-medium text-text">{tax.toFixed(2)} ر.س</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between py-2 text-red-600">
                      <span>{t("sales.discount")}</span>
                      <span className="font-medium">-{discount.toFixed(2)} ر.س</span>
                    </div>
                  )}

                  <div className="my-3 border-t border-border" />

                  <div className="flex justify-between p-4 rounded-lg font-bold text-xl bg-primary/5">
                    <span className="text-text">{t("sales.total")}</span>
                    <span className="text-primary">{grandTotal.toFixed(2)} ر.س</span>
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
                  <p className="mt-2 text-sm text-muted">ZATCA Compliant QR Code</p>
                </div>

                {/* Footer */}
                <div className="pt-4 mt-8 text-center border-t border-border">
                  <p className="text-sm text-muted">{t("sales.thankYou")}</p>
                  <p className="mt-2 text-xs text-muted">{t("sales.termsAndConditions")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
