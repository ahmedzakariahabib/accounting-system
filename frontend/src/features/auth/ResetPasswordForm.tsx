import { Formik, Form, Field, ErrorMessage } from "formik";
import { resetPasswordSchema } from "../../utils/validators";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Eye, EyeClosed, Store } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { resetPasswordApi } from "../../services/api/auth.api";
import toast from "react-hot-toast";
import { useResetPassword } from "../../context/ResetPasswordContext";
import { useNavigate } from "react-router-dom";

export default function ResetPasswordForm() {
  const { t } = useTranslation();
  const { email, otp } = useResetPassword(); // ← صحيح
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: resetPasswordApi,
    onSuccess: () => {
      toast.success(t("reset.success"));
      navigate("/");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "حدث خطأ أثناء إعادة التعيين");
    },
  });

  return (
    <main className="flex items-center justify-center flex-1 w-full p-6 lg:w-1/2">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-primary/10 text-primary">
            <Store size={32} />
          </div>
          <h1 className="text-3xl font-bold">{t("reset.title")}</h1>
        </div>

        <div className="p-8 border shadow-sm rounded-xl bg-card-light dark:bg-card-dark">
          <Formik
            initialValues={{otp,  newPassword: "", confirmNewPassword: "" }}
            validationSchema={resetPasswordSchema}
            onSubmit={(values) =>
              mutate({
                email,
                otp,
                newPassword: values.newPassword,
              })
            }
          >
            {() => (
              <Form className="space-y-6">
                {/* New Password */}
                <div>
                  <label className="flex flex-col">
                    <p className="pb-2 text-sm font-medium text-text-light dark:text-text-dark">
                      {t("reset.newPassword")}
                    </p>
                    <div className="relative flex items-stretch flex-1 w-full">
                      <Field
                        type={showPassword ? "text" : "password"}
                        name="newPassword"
                        placeholder={t("reset.newPasswordPlaceholder")}
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

                {/* Confirm Password */}
                <div>
                  <label className="flex flex-col">
                    <p className="pb-2 text-sm font-medium text-text-light dark:text-text-dark">
                      {t("reset.confirmPassword")}
                    </p>
                    <div className="relative flex items-stretch flex-1 w-full">
                      <Field
                        type={showConfirm ? "text" : "password"}
                        name="confirmNewPassword"
                        placeholder={t("reset.confirmPasswordPlaceholder")}
                        className="flex flex-1 w-full min-w-0 px-4 py-3 pr-12 overflow-hidden text-base font-normal leading-normal border rounded-lg resize-none form-input border-border-light bg-background-light text-text-light placeholder:text-muted-light focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20 dark:border-border-dark dark:bg-background-dark dark:text-text-dark dark:placeholder:text-muted-dark"
                      />
                      <button
                        type="button"
                        aria-label="Toggle password visibility"
                        className="absolute inset-y-0 right-0 flex items-center justify-center px-4 text-muted-light dark:text-muted-dark"
                        onClick={() => setShowConfirm((prev) => !prev)}
                      >
                        {showConfirm ? <Eye /> : <EyeClosed />}
                      </button>
                    </div>
                  </label>
                  <ErrorMessage
                    name="confirmPassword"
                    component="p"
                    className="mt-1 text-sm text-red-500"
                  />
                </div>

                {/* Submit */}
                <div>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="flex h-12 w-full min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-primary px-5 text-base font-bold text-white shadow-sm transition-opacity hover:opacity-90 disabled:opacity-60"
                  >
                    {isPending ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin" />
                        {t("reset.loading")}
                      </span>
                    ) : (
                      <span className="truncate">{t("reset.button")}</span>
                    )}
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
