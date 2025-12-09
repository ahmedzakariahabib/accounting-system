import { Formik, Form, Field, ErrorMessage } from "formik";
import { useMutation } from "@tanstack/react-query";
import { otpSchema } from "../../utils/validators";
import { verifyEmailApi } from "../../services/api/auth.api";
import { useTranslation } from "react-i18next";
import { Store } from "lucide-react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";

export default function OtpEmailForm() {
  const { t } = useTranslation();
const { state } = useLocation();
const email = state?.email;
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: verifyEmailApi,
    onSuccess: () => {
      toast.success(t("otp.success"));
      navigate("/");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t("otp.error"));
    },
  });

  return (
    <main className="flex items-center justify-center flex-1 w-full p-6 lg:w-1/2">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-primary/10 text-primary">
            <Store size={32} />
          </div>
          <h1 className="text-3xl font-bold">{t("otp.title")}</h1>
        </div>

        <div className="p-8 border shadow-sm rounded-xl bg-card-light dark:bg-card-dark">
          <Formik
            initialValues={{ otp: "" }}
            validationSchema={otpSchema}
            onSubmit={(values) => mutate({ ...values, email })}
          >
            {() => (
              <Form className="space-y-6">
                {/* Code Field */}
                <div>
                  <label className="flex flex-col">
                    <p className="pb-2 text-sm font-medium text-text-light dark:text-text-dark">
                      {t("otp.codeLabel")}
                    </p>
                    <Field
                      type="text"
                      name="otp"
                      placeholder={t("otp.codePlaceholder")}
                      maxLength={6}
                      className="flex flex-1 w-full min-w-0 px-4 py-3 overflow-hidden text-center tracking-[8px] text-lg font-bold border rounded-lg form-input border-border-light bg-background-light text-text-light placeholder:text-muted-light focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20 dark:border-border-dark dark:bg-background-dark dark:text-text-dark dark:placeholder:text-muted-dark"
                    />
                  </label>
                  <ErrorMessage
                    name="code"
                    component="p"
                    className="mt-1 text-sm text-center text-red-500"
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
                        {t("otp.loading")}
                      </span>
                    ) : (
                      <span className="truncate">{t("otp.button")}</span>
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
