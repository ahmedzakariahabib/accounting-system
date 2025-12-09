"use client";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

export function LangButton() {
  const { i18n } = useTranslation();

  // تحديث اتجاه الصفحة حسب اللغة
  useEffect(() => {
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  // دالة لتغيير اللغة
  const toggleLanguage = (lang: "en" | "ar") => {
    i18n.changeLanguage(lang);
  };

  return (
      <div className="flex items-center gap-2 p-2 rounded-lg bg-card-light/50 dark:bg-card-dark/50 backdrop-blur-sm">
        <button
          onClick={() => toggleLanguage("en")}
          className={`px-3 py-1 text-sm font-semibold rounded-md transition-all duration-200 ${
            i18n.language === "en"
              ? "bg-primary/20 text-text-light dark:text-text-dark"
              : "text-muted-light dark:text-muted-dark hover:bg-black/5 dark:hover:bg-white/5"
          }`}
        >
          EN
        </button>

        <button
          onClick={() => toggleLanguage("ar")}
          className={`px-3 py-1 text-sm font-semibold rounded-md transition-all duration-200 ${
            i18n.language === "ar"
              ? "bg-primary/20 text-text-light dark:text-text-dark"
              : "text-muted-light dark:text-muted-dark hover:bg-black/5 dark:hover:bg-white/5"
          }`}
        >
          AR
        </button>
      </div>
    
  );
}
