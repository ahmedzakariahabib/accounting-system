import { useTranslation } from "react-i18next";
import { CompanyForm } from "./CompanyForm";

export function SettingsPage() {
      const { t } = useTranslation();
    
  return (
    <>
      <div className="flex flex-wrap justify-between gap-3 mb-8">
        <div className="flex flex-col gap-2">
          <p className="text-text-light-primary dark:text-dark-primary text-4xl font-black leading-tight tracking-[-0.033em]">
           {t("sidebar.settings")}
          </p>
          <p className="text-base font-normal leading-normal text-text-light-secondary dark:text-dark-secondary">
            
           {t("company.subtitle")}
          </p>
        </div>
      </div>
      <CompanyForm />
    </>
  );
}
