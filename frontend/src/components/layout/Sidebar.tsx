import { LayoutDashboard, ReceiptText, ShoppingCart, Package, Users, UserCog, FileBarChart, Settings, UserCircle } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import { useSettings } from "../../context/SettingsContext";

export function Sidebar() {
  const location = useLocation();
  const { t } = useTranslation();
  const { settings } = useSettings();
  const { user } = useAuth();

  // ⭐ حل مشكلة hooks
  const safeSettings = settings ?? {
    companyName: "",
    logo: "",
    theme: "light",
  };

  const role = user?.role || "cashier";

  // تطبيق الثيم
  useEffect(() => {
    const theme = localStorage.getItem("theme") || safeSettings.darkMode || "light";
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [safeSettings.darkMode]);

  const sections = useMemo(() => {
    const base = [
      { url: "/dashboard", icon: LayoutDashboard, label: t("sidebar.dashboard") },
    ];

    const admin = [
      { url: "/sales", icon: ReceiptText, label: t("sidebar.sales") },
      { url: "/purchases", icon: ShoppingCart, label: t("sidebar.purchases") },
      { url: "/inventory", icon: Package, label: t("sidebar.inventory") },
      { url: "/customers", icon: Users, label: t("sidebar.customers") },
      { url: "/suppliers", icon: UserCog, label: t("sidebar.suppliers") },
      { url: "/reports", icon: FileBarChart, label: t("sidebar.reports") },
      { url: "/users", icon: UserCog, label: t("sidebar.users") },
      { url: "/settings", icon: Settings, label: t("sidebar.settings") },
      { url: "/profile", icon: UserCircle, label: t("sidebar.profile") },
    ];

    const cashier = [
      { url: "/sales", icon: ReceiptText, label: t("sidebar.sales") },
      { url: "/profile", icon: UserCircle, label: t("sidebar.profile") },
    ];

    const inventory = [
      { url: "/purchases", icon: ShoppingCart, label: t("sidebar.purchases") },
      { url: "/inventory", icon: Package, label: t("sidebar.inventory") },
      { url: "/suppliers", icon: UserCog, label: t("sidebar.suppliers") },
      { url: "/profile", icon: UserCircle, label: t("sidebar.profile") },
    ];

    switch (role) {
      case "admin":
        return [...base, ...admin];
      case "cashier":
        return [...base, ...cashier];
      case "inventory":
        return [...base, ...inventory];
      default:
        return base;
    }
  }, [role, t]);

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  return (
    <aside className="flex flex-col w-64 p-4 bg-white border-r dark:bg-background-dark dark:border-border-dark border-border-light">
      {/* Header */}
      <div className="flex items-center gap-3 px-3 py-2 mb-6">
        <img
          className="object-cover w-10 h-10 rounded-full"
          alt={safeSettings.companyName}
          src={safeSettings.image || "/default-logo.png"}
        />
        <div>
          <h1 className="text-base font-medium">{safeSettings.companyName || "..."}</h1>
          <p className="text-sm capitalize opacity-70">{role}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2">
        {sections.map(({ url, icon: Icon, label }) => (
          <Link
            key={url}
            to={url}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
              isActive(url)
                ? "bg-primary/20 text-primary"
                : "text-gray-600 dark:text-gray-300 hover:bg-primary/10 hover:text-primary"
            }`}
          >
            <Icon size={20} />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
