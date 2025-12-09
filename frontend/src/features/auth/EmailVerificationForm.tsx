import { Formik, Form, Field, ErrorMessage } from "formik";
import { useMutation } from "@tanstack/react-query";
import { verificationSchema } from "../../utils/validators";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { verificationEmailApi } from "../../services/api/auth.api";
import { Store } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function EmailVerificationForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // 🟦 هنخزن الإيميل هنا بعد ما المستخدم يكتبه

  const { mutate, isPending } = useMutation({
    mutationFn: verificationEmailApi,

    onSuccess: (_, variables) => {
      toast.success(t("verify.success"));
      navigate("/otp-email", {
        state: { email: variables.email },
      });
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "حدث خطأ أثناء الإرسال");
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
            {t("verification.title")}
          </h1>
          <p className="mt-2 text-muted-light dark:text-muted-dark">
            {t("verification.subtitle")}
          </p>
        </div>

        {/* Form Container */}
        <div className="p-8 border shadow-sm rounded-xl border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark">
          <Formik
            initialValues={{ email: "" }}
            validationSchema={verificationSchema}
            onSubmit={(values) => mutate(values)}
          >
            {() => (
              <Form className="space-y-6">
                {/* Email Field */}
                <div>
                  <label className="flex flex-col">
                    <p className="pb-2 text-sm font-medium text-text-light dark:text-text-dark">
                      {t("verification.emailLabel")}
                    </p>
                    <Field
                      type="email"
                      name="email"
                      placeholder={t("verification.emailPlaceholder")}
                      className="flex flex-1 w-full min-w-0 px-4 py-3 overflow-hidden text-base font-normal leading-normal border rounded-lg resize-none form-input border-border-light bg-background-light text-text-light placeholder:text-muted-light focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20 dark:border-border-dark dark:bg-background-dark dark:text-text-dark dark:placeholder:text-muted-dark"
                    />
                  </label>
                  <ErrorMessage
                    name="email"
                    component="p"
                    className="mt-1 text-sm text-red-500"
                  />
                </div>

                {/* Submit Button */}
                <div>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="flex h-12 w-full min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-primary px-5 text-base font-bold text-white shadow-sm transition-opacity hover:opacity-90 disabled:opacity-60"
                  >
                    {isPending ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin" />
                        {t("verification.loading")}
                      </span>
                    ) : (
                      <span className="truncate">
                        {t("verification.button")}
                      </span>
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
