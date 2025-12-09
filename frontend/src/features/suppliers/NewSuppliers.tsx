import { useTranslation } from "react-i18next";
import { UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { addSupplier } from "../../services/api/suppliers";
import FormSuppliers from "./FormSuppliers";
import type { Supplier } from "../../types/Suppliers";

export default function NewSupplier() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const initialValues: Supplier = {
    name: "",
    email: "",
    company: "",
    contactNumber: "",
    address: "",
  };

  const handleSubmit = async (values: Supplier) => {
    await addSupplier(values);
    navigate("/suppliers");
  };

  return (
    <main className="flex-1 p-6 bg-background">
      <div className="flex flex-col gap-8 mx-auto max-w-7xl">
        {/* Page Header */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
              <UserPlus size={24} className="text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-text">
                {t("suppliers.addNewSupplier")}
              </h1>
              <p className="mt-2 text-muted">
                {t("suppliers.addNewSupplierDescription")}
              </p>
            </div>
          </div>
        </div>

        {/* ✅ فقط استدعاء المكون */}
        <FormSuppliers
          initialValues={initialValues}
          onSubmit={handleSubmit}
          isEdit={false}
        />
      </div>
    </main>
  );
}
