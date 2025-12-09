import { useTranslation } from "react-i18next";
import { UserPlus } from "lucide-react";
import FormCustomers from "./FormCustomers";
import type { Customer } from "../../types/customers";
import { addCustomer } from "../../services/api/customers";
import { useNavigate } from "react-router-dom";

export default function NewCustomers() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const initialValues: Customer = {
    name: "",
    phone: "",
    email: "",
    totalPurchases: "",
    lastPurchaseDate: "",
  };

  const handleSubmit = async (values: Customer) => {
    try {
      await addCustomer(values);
      navigate("/customers"); // ✅ يرجع لصفحة العملاء بعد الإضافة
    } catch (error) {
      console.error("❌ Error adding customer:", error);
    }
  };

  return (
    <main className="flex-1 p-6 bg-background">
      <div className="flex flex-col gap-8 mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
              <UserPlus size={24} className="text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-text">
                {t("customers.addNewcustom")}
              </h1>
              <p className="mt-2 text-muted">
                {t("customers.addNewCustomerDescription")}
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <FormCustomers
          initialValues={initialValues}
          onSubmit={handleSubmit}
          isEdit={false}
        />
      </div>
    </main>
  );
}
