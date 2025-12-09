import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
  withCredentials: true,
});

// 🟦 Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      // الباك عندكم يستخدم header اسمه (token)
      config.headers.token = token;

      // لو حبيت تستخدم Authorization فيما بعد هتكون جاهزة:
      // config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn("⚠️ No token found in localStorage!");
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// // 🟥 Optional: Response Interceptor (لو التوكن خلص)
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       console.warn("🔒 Token expired — redirecting to login...");
//       localStorage.removeItem("token");
//       window.location.href = "/"; // login
//     }
//     return Promise.reject(error);
//   }
// );
