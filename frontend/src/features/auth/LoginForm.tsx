import { Formik, Form, Field, ErrorMessage } from "formik";
import { useMutation } from "@tanstack/react-query";
import { loginSchema } from "../../utils/validators";
import { useAuth } from "../../context/AuthProvider";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useState } from "react";
import { loginApi } from "../../services/api/auth.api";
import { Eye, EyeClosed, Store } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ApiError {
  response?: { data?: { message?: string } };
  message?: string;
}

export default function LoginForm() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      const normalizeRole = (
        backendRole: string
      ): "admin" | "cashier" | "inventory" => {
        const r = backendRole.toLowerCase();

        if (r === "admin") return "admin";
        if (r === "cashier") return "cashier";
        if (r === "inventory") return "inventory";

        // fallback لو جايلك قيم تانية زي owner, manager, staff
        return "cashier";
      };

      const role = normalizeRole(data.user.role);
      login({ ...data.user, role }, data.token);

      toast.success(t("login.success"));
      navigate("/dashboard");
    },
    onError: (error: ApiError) => {
      toast.error(error.response?.data?.message || t("login.error"));
    },
  });

  return (
    <main className="flex items-center justify-center flex-1 w-full p-6 lg:w-1/2">
      <div className="w-full max-w-md space-y-8">
        {/* Header Section */}
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-primary/10 text-primary">
            <Store size={32} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-text-light dark:text-text-dark">
            {t("login.title")}
          </h1>
          <p className="mt-2 text-muted-light dark:text-muted-dark">
            {t("login.subtitle")}
          </p>
        </div>

        {/* Form Container */}
        <div className="p-8 border shadow-sm rounded-xl border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark">
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={loginSchema}
            onSubmit={(values, { setSubmitting }) => {
              mutate(values, { onSettled: () => setSubmitting(false) });
            }}
          >
            {() => (
              <Form className="space-y-6">
                {/* Email Field */}
                <div>
                  <label className="flex flex-col">
                    <p className="pb-2 text-sm font-medium text-text-light dark:text-text-dark">
                      {t("login.emailLabel")}
                    </p>
                    <Field
                      type="email"
                      name="email"
                      placeholder={t("login.emailPlaceholder")}
                      className="flex flex-1 w-full min-w-0 px-4 py-3 overflow-hidden text-base font-normal leading-normal border rounded-lg resize-none form-input border-border-light bg-background-light text-text-light placeholder:text-muted-light focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20 dark:border-border-dark dark:bg-background-dark dark:text-text-dark dark:placeholder:text-muted-dark"
                    />
                  </label>
                  <ErrorMessage
                    name="email"
                    component="p"
                    className="mt-1 text-sm text-red-500"
                  />
                </div>

                {/* Password Field */}
                <div>
                  <label className="flex flex-col">
                    <div className="flex items-center justify-between pb-2">
                      <p className="text-sm font-medium text-text-light dark:text-text-dark">
                        {t("login.passwordLabel")}
                      </p>
                      <Link
                        to="/forgot-password"
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        {t("login.forgot")}
                      </Link>
                    </div>
                    <div className="relative flex items-stretch flex-1 w-full">
                      <Field
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder={t("login.passwordPlaceholder")}
                        className="flex flex-1 w-full min-w-0 px-4 py-3 pr-12 overflow-hidden text-base font-normal leading-normal border rounded-lg resize-none form-input border-border-light bg-background-light text-text-light placeholder:text-muted-light focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20 dark:border-border-dark dark:bg-background-dark dark:text-text-dark dark:placeholder:text-muted-dark"
                      />
                      <button
                        type="button"
                        aria-label="Toggle password visibility"
                        className="absolute inset-y-0 right-0 flex items-center justify-center px-4 text-muted-light dark:text-muted-dark"
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        {showPassword ? <Eye /> : <EyeClosed />}
                      </button>
                    </div>
                  </label>
                  <ErrorMessage
                    name="password"
                    component="p"
                    className="mt-1 text-sm text-red-500"
                  />
                </div>

                {/* Submit Button */}
                <div className="flex flex-col gap-2">
                  <button
                    type="submit"
                    disabled={isPending}
                    className="flex h-12 w-full min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-primary px-5 text-base font-bold text-white shadow-sm transition-opacity hover:opacity-90 disabled:opacity-60"
                  >
                    {isPending ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin" />
                        {t("login.loading")}
                      </span>
                    ) : (
                      <span className="truncate">{t("login.button")}</span>
                    )}
                  </button>
                  <button
                  onClick={()=> navigate("/email-verification")}
                    disabled={isPending}
                    className="flex h-12 w-full min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-white border border-primary px-5 text-base font-bold text-primary shadow-sm transition-opacity hover:opacity-90 disabled:opacity-60"
                  >
                    {isPending ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin" />
                        {t("verification.loading")}
                      </span>
                    ) : (
                      <span className="truncate">{t("verification.button")}</span>
                    )}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>

        {/* Support Text */}
        <p className="text-sm text-center text-muted-light dark:text-muted-dark">
          {t("login.supportText")}{" "}
          <a className="font-medium text-primary hover:underline" href="#">
            {t("login.supportEmail")}
          </a>
        </p>
      </div>
    </main>
  );
}
