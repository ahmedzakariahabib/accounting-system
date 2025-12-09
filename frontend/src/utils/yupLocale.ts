import * as Yup from "yup";
import i18n from "../lib/i18n";

export const setYupLocale = () => {
  Yup.setLocale({
    mixed: {
      required: () =>
        i18n.language === "ar" ? "هذا الحقل مطلوب" : "This field is required",
    },
    string: {
      email: () =>
        i18n.language === "ar" ? "إيميل غير صالح" : "Invalid email address",
      min: ({ min }) =>
        i18n.language === "ar"
          ? `يجب ألا تقل عن ${min} أحرف`
          : `Must be at least ${min} characters`,
    },
  });
};
