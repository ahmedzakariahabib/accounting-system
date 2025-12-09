import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import FormSales from "./FormSales";
import { fetchSingleSale } from "../../services/api/sales";
import { Typography } from "@mui/material";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import type { NewInvoiceFormValues, Sale } from "../../types/sales";

export default function EditSales() {
  const { t } = useTranslation();
  const { id } = useParams();

  // جلب بيانات الفاتورة
  const { data: saleData, isLoading, isError } = useQuery({
    queryKey: ["sale", id],
    queryFn: () => fetchSingleSale(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return <Typography align="center" sx={{ mt: 4 }}>جارٍ تحميل الفاتورة...</Typography>;
  }

  if (isError || !saleData) {
    toast.error("حدث خطأ أثناء تحميل الفاتورة أو غير موجودة");
    return (
      <Typography color="error" align="center" sx={{ mt: 4 }}>
        {t("saleNotFound")}
      </Typography>
    );
  }

  function mapSaleToFormValues(sale: Sale): NewInvoiceFormValues {
  return {
    ...sale,
    customer: typeof sale.customer === "string" ? sale.customer : sale.customer._id,
    saleDate: sale.saleDate ? new Date(sale.saleDate).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
    items: sale.items?.map(item => ({
      itemName: item.itemName || "",
      quantity: item.quantity || 1,
      unitPrice: item.unitPrice || 0,
    })) || [{ itemName: "", quantity: 1, unitPrice: 0 }],
    discount: sale.discount || 0,
    taxRate: sale.taxRate || 15,
    notes: sale.notes || "",
    paymentStatus: sale.paymentStatus || "Pending",
  };
}


  return (
    <main className="flex-1 p-8">
      <div className="flex flex-col gap-8">
        {/* FormSales في وضع التعديل (Edit Mode) */}
<FormSales saleData={saleData ? mapSaleToFormValues(saleData) : undefined} />
      </div>
    </main>
  );
}
