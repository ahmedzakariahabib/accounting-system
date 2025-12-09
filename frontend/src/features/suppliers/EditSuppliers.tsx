import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import FormSuppliers from "./FormSuppliers";
import { UserCog, AlertCircle } from "lucide-react";
import { updateSupplier } from "../../services/api/suppliers";
import type { Supplier } from "../../types/Suppliers";

export default function EditSupplier() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const initialCustomer: Supplier = {
    name: "",
    email: "",
    company: "",
    contactNumber: "",
    address:"",
  };

  if (!id) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 p-8 text-center bg-background">
        <div className="p-4 bg-red-100 rounded-full dark:bg-red-900/30">
          <AlertCircle size={48} className="text-red-600 dark:text-red-400" />
        </div>
        <h2 className="mt-4 text-xl font-bold text-text">
          {t("supplierNotFound")}
        </h2>
        <p className="mt-2 text-muted">{t("supplierNotFoundDescription")}</p>
        <button
          onClick={() => navigate("/suppliers")}
          className="px-6 py-3 mt-6 font-semibold text-white transition-colors rounded-lg bg-primary hover:bg-primary/90"
        >
          {t("backToSuppliers")}
        </button>
      </div>
    );
  }

  const handleSubmit = async (values: Supplier) => {
    await updateSupplier(id, values);
    navigate("/suppliers");
  };
  return (
    <main className="flex-1 p-6 bg-background">
      <div className="flex flex-col gap-8 mx-auto max-w-7xl">
        {/* Page Header */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
              <UserCog size={24} className="text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-text">
                {t("suppliers.editSupplier")}
              </h1>
              <p className="mt-2 text-muted">
                {t("suppliers.pleaseEnterChanges")}
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <FormSuppliers
          initialValues={initialCustomer}
          onSubmit={handleSubmit}
          isEdit={true}
        />
      </div>
    </main>
  );
}
