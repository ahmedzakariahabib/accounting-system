import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Save, X } from "lucide-react";
import { fetchCustomerById } from "../../services/api/customers";
import type { Customer } from "../../types/customers";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

interface FormSuppliersProps {
  initialValues: Customer;
  onSubmit: (values: Customer) => void;
  isEdit?: boolean;
}

export default function FormCustomers({
  initialValues,
  onSubmit,
  isEdit = false,
}: FormSuppliersProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { ids } = useParams<{ ids: string }>();

  const validationSchema = Yup.object({
    name: Yup.string().min(3, "name main 3 letters").required(t("required")),
    email: Yup.string().email("email is in-valid").required(t("required")),
    phone: Yup.string()
      .matches(/^20\d{10}$/, t("invalid_Phone"))
      .required(t("required")),
    totalPurchases: Yup.string()
      .typeError(t("mustBeNumber"))
      .required(t("required")),
    lastPurchaseDate: Yup.date().required(t("required")),
  });

  const { data } = useQuery({
    queryKey: ["customer", ids],
    queryFn: () => fetchCustomerById(ids!),
    enabled: !!ids && isEdit,
  });
  console.log(data);

  const formInitialValues: Partial<Customer> =
    isEdit && data
      ? {
          name: data.name ?? "",
          email: data.email ?? "",
          phone: data.phone ?? "",
          totalPurchases: data.totalPurchases ?? "",
          lastPurchaseDate: data.lastPurchaseDate ?? "",
        }
      : initialValues;

  return (
    <div className="w-full max-w-7xl card">
      {/* Header */}
      <div className="flex items-center gap-3 p-6 border-b border-border">
        <button
          onClick={() => navigate("/customers")}
          className="flex items-center justify-center w-10 h-10 transition-colors rounded-lg text-text hover:bg-hover"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-xl font-bold text-text">
            {isEdit ? t("customers.editcustom") : t("customers.addNewcustom")}
          </h2>
          <p className="mt-1 text-sm text-muted">
            {isEdit
              ? t("customers.pleaseEnterChanges")
              : t("customers.addNewCustomerDescription")}
          </p>
        </div>
      </div>

      <Formik<Partial<Customer>>
        initialValues={formInitialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => onSubmit(values as Customer)}
        enableReinitialize
      >
        {({ isSubmitting }) => (
          <Form className="flex flex-col">
            <div className="grid grid-cols-1 p-8 md:grid-cols-2 gap-x-8 gap-y-6">
              {[
                {
                  name: "name",
                  label: t("customers.Customername"),
                  placeholder: "مثال: أحمد علي",
                  required: true,
                },
                {
                  name: "email",
                  label: t("customers.CustomerEmail"),
                  placeholder: "مثال: ahmed@gmail.com",
                  required: true,
                },
                {
                  name: "phone",
                  label: t("customers.Customerphone"),
                  placeholder: "مثال: 0501234567",
                  required: true,
                },
                {
                  name: "totalPurchases",
                  label: t("customers.totalInvoices"),
                  placeholder: "مثال: 6666.50",
                  type: "number",
                  required: true,
                },
                {
                  name: "lastPurchaseDate",
                  label: t("customers.lastTransaction"),
                  type: "date",
                  required: true,
                },
              ].map((field) => (
                <div key={field.name} className="flex flex-col">
                  <label
                    className="block mb-3 text-sm font-medium text-text"
                    htmlFor={field.name}
                  >
                    {field.label}
                    {field.required && (
                      <span className="ml-1 text-red-500"> *</span>
                    )}
                  </label>
                  <div className="relative">
                    <Field
                      id={field.name}
                      name={field.name || "text"}
                      type={field.type || "text"}
                      placeholder={field.placeholder}
                      className="input"
                    />
                  </div>
                  <ErrorMessage
                    name={field.name}
                    component="div"
                    className="mt-2 text-xs text-red-600 dark:text-red-400"
                  />
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-4 p-6 border-t border-border bg-background rounded-b-xl">
              <button
                type="button"
                onClick={() => navigate("/customers")}
                className="flex items-center gap-2 px-6 py-3 font-semibold transition-colors rounded-lg text-text bg-hover hover:bg-gray-300 dark:hover:bg-gray-600"
                disabled={isSubmitting}
              >
                <X size={18} />
                {t("cancel")}
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-3 font-semibold text-white transition-colors rounded-lg bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                <Save size={18} />
                {isSubmitting ? t("saving") : t("save")}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
