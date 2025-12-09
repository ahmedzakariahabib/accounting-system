import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Save, X, Mail, Shield, Key, User2, UserCog } from "lucide-react";
import { useUsers, type User } from "../../context/UsersContext";
import { useEffect, useState } from "react";
import i18n from "../../i18n/i18n";

export function UserForm() {
  const { getUserById, updateUser, addUser } = useUsers();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isArabic = i18n.language === "ar";

  const userId = searchParams.get("id");
  const isEdit = Boolean(userId);

  /* -------------------------------------------------------
     Formik initial values
  ------------------------------------------------------- */

  const [formData, setFormData] = useState<Partial<User>>({
    name: "",
    email: "",
    role: "inventory",
    status: "inactive",
    password: "",
  });

  useEffect(() => {
    if (!isEdit || !userId) return;

    (async () => {
      const data = await getUserById(userId);
      if (data) {
        setFormData({
          ...data,
          password: "", // password is never shown
        });
      }
    })();
  }, [isEdit, userId, getUserById]);

  /* -------------------------------------------------------
     Yup Validation Schema
  ------------------------------------------------------- */

  const validationSchema = Yup.object({
    name: Yup.string().min(3, t("min3letters")).required(t("required")),
    email: Yup.string().email(t("invalidEmail")).required(t("required")),
    role: Yup.string().required(t("required")),
    status: Yup.string().required(t("required")),
    password: isEdit
      ? Yup.string().notRequired()
      : Yup.string().min(6, t("min6letters")).required(t("required")),
  });

  /* -------------------------------------------------------
     Options
  ------------------------------------------------------- */

  const roles = [
    { value: "admin", label: t("users.admin") },
    { value: "cashier", label: t("users.cashier") },
    { value: "inventory", label: t("users.inventory") },
  ];



  return (
    <main className="flex-1 p-6 bg-background">
      <div className="flex flex-col gap-8 mx-auto max-w-7xl">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
              <UserCog size={24} className="text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-text">
                {isEdit ? t("users.editTitle") : t("users.addTitle")}
              </h1>
              <p className="mt-2 text-muted">
                {t("Users.pleaseEnterChanges")}
              </p>
            </div>
          </div>
        </div>
        <div className="w-full max-w-7xl card" dir={isArabic ? "rtl" : "ltr"}>
          {/* Header */}
          <div className="flex items-center gap-3 p-6 border-b border-border">
            <button
              onClick={() => navigate("/users")}
              type="button"
              className="flex items-center justify-center w-10 h-10 transition-colors rounded-lg text-text hover:bg-hover"
            >
              <ArrowLeft size={20} />
            </button>

            <div>
              <h2 className="text-xl font-bold text-text">
                {isEdit ? t("users.editTitle") : t("users.addTitle")}
              </h2>
              <p className="mt-1 text-sm text-muted">
                {isEdit
                  ? t("users.editDescription")
                  : t("users.addDescription")}
              </p>
            </div>
          </div>

          {/* -------------------------------------------------------
         Formik Form
      ------------------------------------------------------- */}
          <Formik
            initialValues={formData}
            validationSchema={validationSchema}
            enableReinitialize
            onSubmit={async (values, { setSubmitting }) => {
              if (isEdit && userId) {
                console.log(values)
                await updateUser(userId, values);
              } else {
                await addUser(values);
              }
              setSubmitting(false);
              navigate("/users");
            }}
          >
            {({ isSubmitting }) => (
              <Form className="flex flex-col">
                <div className="grid grid-cols-1 p-8 md:grid-cols-2 gap-x-8 gap-y-6">
                  {/* Name */}
                  <div className="flex flex-col">
                    <label className="flex items-center gap-2 mb-3 text-sm font-medium text-text">
                      <User2 size={16} />
                      {t("users.name")}
                      <span className="text-red-500">*</span>
                    </label>

                    <Field
                      name="name"
                      placeholder={t("users.name")}
                      className="input"
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="error-text"
                    />
                  </div>

                  {/* Email */}
                  <div className="flex flex-col">
                    <label className="flex items-center gap-2 mb-3 text-sm font-medium text-text">
                      <Mail size={16} />
                      {t("users.email")}
                      <span className="text-red-500">*</span>
                    </label>

                    <Field
                      name="email"
                      type="email"
                      placeholder={t("users.email")}
                      className="input"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="error-text"
                    />
                  </div>

                  {/* Password (only when adding) */}
                  {!isEdit && (
                    <div className="flex flex-col">
                      <label className="flex items-center gap-2 mb-3 text-sm font-medium text-text">
                        <Key size={16} />
                        {t("users.password")}
                        <span className="text-red-500">*</span>
                      </label>

                      <Field
                        name="password"
                        type="password"
                        placeholder={t("users.password")}
                        className="input"
                      />
                      <ErrorMessage
                        name="password"
                        component="div"
                        className="error-text"
                      />
                    </div>
                  )}

                  {/* Role */}
                  <div className="flex flex-col">
                    <label className="flex items-center gap-2 mb-3 text-sm font-medium text-text">
                      <Shield size={16} />
                      {t("users.role")}
                      <span className="text-red-500">*</span>
                    </label>

                    <Field as="select" name="role" className="input">
                      {roles.map((r) => (
                        <option key={r.value} value={r.value}>
                          {r.label}
                        </option>
                      ))}
                    </Field>

                    <ErrorMessage
                      name="role"
                      component="div"
                      className="error-text"
                    />
                  </div>

                  {/* Status */}
                  {/* <div className="flex flex-col">
                    <label className="flex items-center gap-2 mb-3 text-sm font-medium text-text">
                      <Shield size={16} />
                      {t("users.status")}
                      <span className="text-red-500">*</span>
                    </label>

                    <Field as="select" name="status" className="input">
                      {statuses.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </Field>

                    <ErrorMessage
                      name="status"
                      component="div"
                      className="error-text"
                    />
                  </div> */}
                </div>

                {/* -------------------------------------------------------
               Buttons
            ------------------------------------------------------- */}
                <div className="flex items-center justify-end gap-4 p-6 border-t border-border bg-background rounded-b-xl">
                  <button
                    type="button"
                    onClick={() => navigate("/users")}
                    className="flex items-center gap-2 px-6 py-3 font-semibold transition-colors rounded-lg text-text bg-hover hover:bg-gray-300 dark:hover:bg-gray-600"
                    disabled={isSubmitting}
                  >
                    <X size={18} />
                    {t("users.cancel")}
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-6 py-3 font-semibold text-white transition-colors rounded-lg bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save size={18} />
                    {isSubmitting ? t("users.saving") : t("users.save")}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </main>
  );
}
