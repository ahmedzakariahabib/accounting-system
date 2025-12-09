import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Save, X } from "lucide-react";
import { fetchSupplierById } from "../../services/api/suppliers";
import { useQuery } from "@tanstack/react-query";
import type { Supplier } from "../../types/Suppliers";

interface FormSuppliersProps {
  initialValues: Supplier;
  onSubmit: (values: Supplier) => Promise<void>;
  isEdit?: boolean;
}

export default function FormSuppliers({
  initialValues,
  onSubmit,
  isEdit = false,
}: FormSuppliersProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // ✅ جلب بيانات المورد في وضع التعديل
  const { data, isFetching } = useQuery({
    queryKey: ["supplier", id],
    queryFn: () => fetchSupplierById(id!),
    enabled: !!id && isEdit,
  });

  // ✅ مخطط التحقق باستخدام Yup
  const validationSchema = Yup.object({
    name: Yup.string().min(3, t("min3letters")).required(t("required")),
    company: Yup.string().min(3, t("min3letters")).required(t("required")),
    email: Yup.string().email(t("invalidEmail")).required(t("required")),
    contactNumber: Yup.string()
      .matches(/^05\d{8}$/, t("invalidPhone"))
      .required(t("required")),
    address: Yup.string().required(t("required")),
  });

  // ✅ تحديد القيم الأولية (إما من البيانات أو من props)
  const formInitialValues: Supplier =
    isEdit && data
      ? {
          name: data.name ?? "",
          company: data.company ?? "",
          email: data.email ?? "",
          contactNumber: data.contactNumber ?? "",
          address: data.address ?? "",
        }
      : initialValues;

  // ✅ حالة تحميل أثناء جلب البيانات في وضع التعديل
  if (isEdit && isFetching) {
    return (
      <div className="flex items-center justify-center p-8 text-muted">
        {t("loading")}...
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl card">
      {/* Header */}
      <div className="flex items-center gap-3 p-6 border-b border-border">
        <button
          onClick={() => navigate("/suppliers")}
          type="button"
          className="flex items-center justify-center w-10 h-10 transition-colors rounded-lg text-text hover:bg-hover"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-xl font-bold text-text">
            {isEdit ? t("suppliers.editSupplier") : t("suppliers.addNewSupplier")}
          </h2>
          <p className="mt-1 text-sm text-muted">
            {isEdit
              ? t("suppliers.pleaseEnterChanges")
              : t("suppliers.addNewSupplierDescription")}
          </p>
        </div>
      </div>

      {/* ✅ Formik */}
      <Formik
        initialValues={formInitialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          await onSubmit(values);
          setSubmitting(false);
        }}
        enableReinitialize
      >
        {({ isSubmitting }) => (
          <Form className="flex flex-col">
            <div className="grid grid-cols-1 p-8 md:grid-cols-2 gap-x-8 gap-y-6">
              {[
                {
                  name: "name",
                  label: t("suppliers.supplierName"),
                  placeholder: "مثال: أحمد علي",
                },
                {
                  name: "email",
                  label: t("suppliers.email"),
                  placeholder: "مثال: ahmed@gmail.com",
                },
                {
                  name: "company",
                  label: t("suppliers.supplierCompany"),
                  placeholder: "مثال: شركة الأقمشة الحديثة",
                },
                {
                  name: "contactNumber",
                  label: t("suppliers.phone"),
                  placeholder: "مثال: 0501234567",
                },
                {
                  name: "address",
                  label: t("suppliers.address"),
                  placeholder: "مثال: جدة - شارع فلسطين",
                },
              ].map((field) => (
                <div key={field.name} className="flex flex-col">
                  <label
                    htmlFor={field.name}
                    className="block mb-3 text-sm font-medium text-text"
                  >
                    {field.label}
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <Field
                    id={field.name}
                    name={field.name}
                    type="text"
                    placeholder={field.placeholder}
                    className="input"
                  />

                  <ErrorMessage
                    name={field.name}
                    component="div"
                    className="mt-2 text-xs text-red-600 dark:text-red-400"
                  />
                </div>
              ))}
            </div>

            {/* ✅ الأزرار */}
            <div className="flex items-center justify-end gap-4 p-6 border-t border-border bg-background rounded-b-xl">
              <button
                type="button"
                onClick={() => navigate("/suppliers")}
                className="flex items-center gap-2 px-6 py-3 font-semibold transition-colors rounded-lg text-text bg-hover hover:bg-gray-300 dark:hover:bg-gray-600"
                disabled={isSubmitting}
              >
                <X size={18} />
                {t("suppliers.cancel")}
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-3 font-semibold text-white transition-colors rounded-lg bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={18} />
                {isSubmitting ? t("suppliers.saving") : t("suppliers.save")}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
