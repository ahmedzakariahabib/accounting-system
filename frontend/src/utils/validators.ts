import * as Yup from "yup";
import i18n from "../i18n/i18n";
const t = i18n.t.bind(i18n);


/* -------------------------------------------------
  Login Validation
-------------------------------------------------- */
export const loginSchema = Yup.object({
  email: Yup.string()
    .email(t("validation.emailInvalid"))
    .required(t("validation.emailRequired")),
  password: Yup.string().required(t("validation.passwordRequired")),
});

/* -------------------------------------------------
  Forgot Password Validation
-------------------------------------------------- */
export const verificationSchema = Yup.object({
  email: Yup.string()
    .email(t("validation.emailInvalid"))
    .required(t("validation.emailRequired")),
});
/* -------------------------------------------------
  Forgot Password Validation
-------------------------------------------------- */
export const forgotSchema = Yup.object({
  email: Yup.string()
    .email(t("validation.emailInvalid"))
    .required(t("validation.emailRequired")),
});

/* -------------------------------------------------
  OTP Verification Validation
-------------------------------------------------- */
export const otpSchema = Yup.object({
  otp: Yup.string()
    .required(t("validation.otpRequired"))
    .matches(/^[0-9]{4,6}$/, t("validation.otpInvalid")),
});

/* -------------------------------------------------
 ✅ Reset Password Validation
-------------------------------------------------- */
export const resetPasswordSchema = Yup.object({
  otp: Yup.string()
    .required(t("validation.otpRequired"))
    .matches(/^[0-9]{4,6}$/, t("validation.otpInvalid")),
  newPassword: Yup.string()
    .required(t("validation.newPasswordRequired"))
    .min(8, t("validation.passwordMin"))
    .matches(/[A-Z]/, t("validation.passwordUppercase"))
    .matches(/[a-z]/, t("validation.passwordLowercase"))
    .matches(/[0-9]/, t("validation.passwordNumber"))
    .matches(/[@$!%*?&]/, t("validation.passwordSymbol")),
});

/* -------------------------------------------------
 ✅ Signup Validation
-------------------------------------------------- */
export const signupSchema = Yup.object({
  name: Yup.string()
    .required(t("validation.nameRequired"))
    .min(3, t("validation.nameMin")),
  email: Yup.string()
    .email(t("validation.emailInvalid"))
    .required(t("validation.emailRequired")),
  password: Yup.string()
    .required(t("validation.passwordRequired"))
    .min(8, t("validation.passwordMin"))
    .matches(/[A-Z]/, t("validation.passwordUppercase"))
    .matches(/[a-z]/, t("validation.passwordLowercase"))
    .matches(/[0-9]/, t("validation.passwordNumber"))
    .matches(/[@$!%*?&]/, t("validation.passwordSymbol")),
  rePassword: Yup.string()
    .required(t("validation.rePasswordRequired"))
    .oneOf([Yup.ref("password")], t("validation.rePasswordMismatch")),
});
