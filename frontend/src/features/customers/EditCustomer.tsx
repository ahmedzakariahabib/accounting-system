import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { UserCog, AlertCircle } from "lucide-react";
import FormCustomers from "./FormCustomers";
import type { Customer } from "../../types/customers";
import { updateCustomer } from "../../services/api/customers";

export default function EditCustomer() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { ids } = useParams<{ ids: string }>();

  if (!ids) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 p-8 text-center bg-background">
        <div className="p-4 bg-red-100 rounded-full dark:bg-red-900/30">
          <AlertCircle size={48} className="text-red-600 dark:text-red-400" />
        </div>
        <h2 className="mt-4 text-xl font-bold text-text">
          {t("customers.notFound")}
        </h2>
        <p className="mt-2 text-muted">
          {t("customers.notFoundDescription")}
        </p>
        <button
          onClick={() => navigate("/customers")}
          className="px-6 py-3 mt-6 font-semibold text-white transition-colors rounded-lg bg-primary hover:bg-primary/90"
        >
          {t("back")}
        </button>
      </div>
    );
  }

  const handleSubmit = async (values: Customer) => {
    try {
      await updateCustomer(ids, values);
      navigate("/customers"); // ✅ بعد التعديل يرجع لصفحة العملاء
    } catch (error) {
      console.error("❌ Error updating customer:", error);
    }
  };

  const initialCustomer: Customer = {
    name: "",
    email: "",
    phone: "",
    totalPurchases: "",
    lastPurchaseDate: "",
  };

  return (
    <main className="flex-1 p-6 bg-background">
      <div className="flex flex-col gap-8 mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
              <UserCog size={24} className="text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-text">
                {t("customers.editcustom")}
              </h1>
              <p className="mt-2 text-muted">
                {t("customers.pleaseEnterChanges")}
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <FormCustomers
          initialValues={initialCustomer}
          onSubmit={handleSubmit}
          isEdit={true}
        />
      </div>
    </main>
  );
}
