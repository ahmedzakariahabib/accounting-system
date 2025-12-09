import { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import { LangButton } from "../ui/LangButton";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n/i18n";
import { ThemeSwitcher } from "../../features/settings/ThemeSwitcher";
import { useAuth } from "../../context/AuthProvider";

export function Topbar() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{ name: string; path: string }[]>([]);
  const [showResults, setShowResults] = useState(false);
  const { logout } = useAuth();

  const sections = [
    { name: "Login", path: "/login" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Sales", path: "/sales" },
    { name: "New Sale", path: "/sales/new" },
    { name: "Purchases", path: "/purchases" },
    { name: "Inventory", path: "/inventory" },
    { name: "Add Item", path: "/inventory/new" },
    { name: "Suppliers", path: "/suppliers" },
    { name: "Customers", path: "/customers" },
    { name: "Reports", path: "/reports" },
    { name: "Users", path: "/users" },
    { name: "Settings", path: "/settings" },
    { name: "Profile", path: "/profile" },
    { name: "Change Password", path: "/password/change" },
    { name: "Invoice Print", path: "/invoice/print" },
    { name: "404 Page", path: "*" },
  ];

  const handleSelect = (path: string) => {
    navigate(path);
    setShowResults(false);
    setQuery("");
  };

  const handleSearch = (value: string) => {
    setQuery(value);
    if (value.trim() === "") {
      setShowResults(false);
      return;
    }

    const filtered = sections.filter((s) =>
      s.name.toLowerCase().includes(value.toLowerCase())
    );
    setResults(filtered);
    setShowResults(true);
  };

  // إغلاق القائمة لما تضغط خارجها
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-10 bg-white border-b border-solid dark:bg-background-dark whitespace-nowrap border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
      {/* Search Input */}
      <div className="relative min-w-40 !h-10 max-w-64">
        <div className="flex items-stretch w-full h-full rounded-lg">
          <div className="flex items-center justify-center pl-4 rounded-l-lg text-text-light-secondary dark:text-text-dark-secondary bg-background-light dark:bg-background-dark">
            <Search size={20} />
          </div>
          <input
            className="flex flex-1 w-full h-full px-4 pl-2 text-base border-none rounded-r-lg bg-background-light dark:bg-background-dark text-text-light-primary dark:text-text-dark-primary placeholder:text-text-light-secondary dark:placeholder:text-text-dark-secondary focus:outline-none"
            placeholder={t("topbar.searchPlaceholder")}
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        {/* نتائج البحث */}
        {showResults && (
          <div className="absolute left-0 right-0 z-50 flex flex-col mt-1 border rounded-lg shadow-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark">
            {results.length > 0 ? (
              results.map((r) => (
                <button
                  key={r.path}
                  onClick={() => handleSelect(r.path)}
                  className="w-full px-4 py-2 text-left transition-colors hover:bg-primary/10"
                >
                  {r.name}
                </button>
              ))
            ) : (
              <div className="px-4 py-2 text-sm text-text-light-secondary dark:text-text-dark-secondary">
                {t("topbar.noResults")}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Side Actions */}
      <div
        className="relative flex items-center justify-end flex-1 gap-6"
        ref={menuRef}
      >
        <LangButton />

        <ThemeSwitcher />

        {/* Avatar + Dropdown */}
        <div className="relative">
          <img
            onClick={() => setOpen(!open)}
            className="bg-center bg-no-repeat bg-cover border rounded-full cursor-pointer aspect-square size-10 border-border-light dark:border-border-dark"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDcS0Rf-sqkOeLSRrZ6aIb3eaMbNEngePqOtJSc_kW_kpb_G7xQR849BjmjSYc8DMlg9VBwEjzj6MeBJKzb3rE5x6ccpJUFM5F0JMhHO2wdP_fvtphKkgVRGnMcuuKdalxq0BuFlv2yWi4_u8BYy2QlvWv0hfRcHJOnj25XWurVtXybMWDNP_2SmwQnmB2SfroM1wVtEi04ORI88E5CmPYTbYURS4QGU535bJdpHM-b7-sCTnjlRLPaV47mlhgcnF-uFm2FJN3p-A"
            alt="User Avatar"
          />

          {open && (
            <div
              className={`absolute  w-40 mt-2 border rounded-lg shadow-md border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark
            ${i18n.language === "ar" ? "left-0" : "right-0"}
            `}
            >
              <button
                onClick={() => navigate("/profile")}
                className="block w-full px-4 py-2 text-sm text-left hover:bg-primary/10"
              >
                {t("topbar.profile")}
              </button>
              <button
                onClick={() => navigate("/settings")}
                className="block w-full px-4 py-2 text-sm text-left hover:bg-primary/10"
              >
                {t("topbar.settings")}
              </button>
              <button
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="block w-full px-4 py-2 text-sm text-left text-red-500 hover:bg-primary/10"
              >
                {t("topbar.logout")}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
