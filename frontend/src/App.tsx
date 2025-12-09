import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";
import { setYupLocale } from "./utils/yupLocale";
import cookies from "js-cookie";
import { useTranslation } from "react-i18next";
import "./i18n/i18n";
import { AppProviders } from "./context/AppProviders";

const queryClient = new QueryClient();
setYupLocale();

export default function App() {
  const { i18n } = useTranslation();
  const lng = cookies.get("i18next") || "en";

  useEffect(() => {
    window.document.dir = i18n.dir();
  }, [lng]);
  return (
    <QueryClientProvider client={queryClient}>
      <AppProviders>
        <AppRoutes />
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: { background: "#333", color: "#fff" },
          }}
        />
      </AppProviders>
    </QueryClientProvider>
  );
}
