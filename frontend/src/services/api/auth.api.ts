import { api } from "../axios";

// 🔹 تسجيل الدخول
export const loginApi = async (data: { email: string; password: string }) => {
  const res = await api.post("/api/v1/auth/signin", data);
  return res.data;
};

// 🔹 إرسال كود OTP (Forgot Password)
export const sendOtpApi = async (data: { email: string }) => {
  const res = await api.post("/api/v1/auth/send-otp", data);
  return res.data;
};

// 🔹 التحقق من OTP
export const verifyOtpApi = async (data: { email: string; otp: string }) => {
  const res = await api.post("/api/v1/auth/verrify-otp", data);
  return res.data;
};

// 🔹 نسيان كلمة المرور
export const forgotPasswordApi = async (data: { email: string }) => {
  const res = await api.post("/api/v1/auth/forgot-password", data);
  return res.data;
};

// 🔹 إعادة تعيين كلمة المرور
export const resetPasswordApi = async (data: {
  email: string;
  otp: string;
  newPassword: string;
}) => {
  const res = await api.post("/api/v1/auth/reset-password", data);
  return res.data;
};

// 🔹 إنشاء مستخدم (Admin Only)
export const signupApi = async (data: {
  email: string;
  name: string;
  password: string;
  rePassword: string;
  role: string;
}) => {
  const res = await api.post("/api/v1/auth/signup", data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });
  return res.data;
};

// 🔹 إرسال كود تحقق الإيميل
export const verificationEmailApi = async (data: { email: string }) => {
  const res = await api.post("/api/v1/auth/email_verification", data);
  return res.data;
};

// 🔹 التحقق من كود الإيميل
export const verifyEmailApi = async (data: { email: string; otp: string }) => {
  const res = await api.post("/api/v1/auth/email_verification/verify", data);
  return res.data;
};
