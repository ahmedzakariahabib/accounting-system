import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { fetchSinglePurchase } from "../../services/api/purchases";
import { useQuery } from "@tanstack/react-query";
import { Typography } from "@mui/material";
import toast from "react-hot-toast";
import FormPurchases from "./FormPurchases";

export default function EditPurchases() {
  const { t } = useTranslation();
  const { id } = useParams();

  // جلب بيانات الفاتورة
  const { data: purchase, isLoading, isError } = useQuery({
    queryKey: ["purchase", id],
    queryFn: () => fetchSinglePurchase(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <Typography align="center" sx={{ mt: 4 }}>
        جارٍ تحميل الفاتورة...
      </Typography>
    );
  }

  if (isError || !purchase) {
    toast.error("حدث خطأ أثناء تحميل الفاتورة أو غير موجودة");
    return (
      <Typography color="error" align="center" sx={{ mt: 4 }}>
        {t("saleNotFound")}
      </Typography>
    );
  }

  return (
    <main className="flex-1 p-8">
      <div className="flex flex-col gap-8">
        {/* تمرير الفاتورة للـ Form */}
        <FormPurchases purchaseData={purchase} />
      </div>
    </main>
  );
}
