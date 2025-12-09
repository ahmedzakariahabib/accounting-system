/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Building, Printer, Save, Eye, EyeOff } from "lucide-react";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { useTranslation } from "react-i18next";
import { useSettings } from "../../context/SettingsContext";
import toast from "react-hot-toast";

export function CompanyForm() {
  const { t } = useTranslation();
  const { settings, updateSettings } = useSettings();
  const [isLoading, setIsLoading] = useState(false);

  //  منع الـ render قبل تحميل settings
  if (!settings)
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-b-2 rounded-full animate-spin border-primary"></div>
      </div>
    );

  //  Local form state
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [form, setForm] = useState(settings);

  //  Sync when settings change
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    setForm(settings);
  }, [settings]);

  //  Update field values
  const updateField =
    (key: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value =
        e.target.type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : e.target.value;

      setForm((prev) => ({ ...prev, [key]: value }));
    };

  // Save changes
  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateSettings(form);
      toast.success("تم حفظ الإعدادات بنجاح ✔️");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("حدث خطأ أثناء الحفظ");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="pb-8 space-y-6">
      {/* ------------------------ Company Info ------------------------ */}
      <section className="card">
        <div className="flex items-center gap-3 p-6 border-b border-border">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
            <Building size={20} className="text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-text">
              {t("company.info.title")}
            </h2>
            <p className="text-sm text-muted">{t("company.info.subtitle")}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
          <InputGroup
            name="companyName"
            label={t("company.info.name")}
            value={form.companyName}
            onChange={updateField("companyName")}
            placeholder="أدخل اسم الشركة"
          />

          <InputGroup
            name="companyAddress"
            label={t("company.info.address")}
            value={form.address}
            onChange={updateField("address")}
            placeholder="أدخل عنوان الشركة"
          />

          <InputGroup
            name="companyPhone"
            label={t("company.info.phone")}
            value={form.phoneNumber}
            onChange={updateField("phoneNumber")}
            type="tel"
            placeholder="أدخل رقم الهاتف"
          />

          <InputGroup
            name="companyEmail"
            label={t("company.info.email")}
            value={form.email}
            type="email"
            onChange={updateField("email")}
            placeholder="أدخل البريد الإلكتروني"
          />

          <InputGroup
            name="companyTax"
            label={t("company.info.tax")}
            value={form.taxId}
            onChange={updateField("taxId")}
            full
            placeholder="أدخل الرقم الضريبي"
          />
        </div>
      </section>

      {/* ------------------------ Print Settings ------------------------ */}
      <section className="card">
        <div className="flex items-center gap-3 p-6 border-b border-border">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
            <Printer size={20} className="text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-text">
              {t("company.print.title")}
            </h2>
            <p className="text-sm text-muted">{t("company.print.subtitle")}</p>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Paper Size */}
          <div className="space-y-3">
            <label className="font-medium text-text">
              {t("company.print.paper")}
            </label>
            <div className="flex gap-3">
              {[
                { value: "A4", label: "A4", desc: "الحجم القياسي" },
                { value: "Letter", label: "Letter", desc: "الحجم الأمريكي" },
                { value: "A5", label: "A5", desc: "نصف حجم A4" },
              ].map((size) => (
                <label key={size.value} className="flex-1 cursor-pointer">
                  <input
                    type="radio"
                    name="paper-size"
                    value={size.value}
                    checked={form.paperSize === size.value}
                    onChange={updateField("paperSize")}
                    className="hidden"
                  />
                  <div
                    className={`p-4 border rounded-lg text-center transition-all duration-200 ${
                      form.paperSize === size.value
                        ? "border-primary bg-primary/10 ring-1 ring-primary"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="font-medium text-text">{size.label}</div>
                    <div className="mt-1 text-xs text-muted">{size.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Invoice Template */}
          <div className="space-y-3">
            <label className="font-medium text-text">
              {t("company.print.template")}
            </label>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {[
                { value: "Modern", label: "حديث" },
                { value: "Classic", label: "كلاسيكي" },
                { value: "Simple", label: "بسيط" },
                { value: "Professional", label: "احترافي" },
              ].map((template) => (
                <label key={template.value} className="cursor-pointer">
                  <input
                    type="radio"
                    name="invoiceTemplate"
                    value={template.value}
                    checked={form.defaultInvoiceTemplate === template.value}
                    onChange={updateField("defaultInvoiceTemplate")}
                    className="hidden"
                  />
                  <div
                    className={`p-4 border rounded-lg text-center transition-all duration-200 ${
                      form.defaultInvoiceTemplate === template.value
                        ? "border-primary bg-primary/10 ring-1 ring-primary"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="text-sm font-medium text-text">
                      {template.label}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Checkboxes */}
          <div className="p-4 space-y-4 rounded-lg bg-background">
            <Checkbox
              label={t("company.print.showDetails")}
              description="عرض تفاصيل الشركة في الفواتير"
              checked={form.showCompanyDetails}
              onChange={updateField("showCompanyDetails")}
            />
          </div>
        </div>
      </section>

      {/* ------------------------ Appearance ------------------------ */}
      <section className="card">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                {form.darkMode === true ? (
                  <EyeOff size={20} className="text-primary" />
                ) : (
                  <Eye size={20} className="text-primary" />
                )}
              </div>
              <div>
                <h3 className="font-medium text-text">
                  {t("company.appearance.darkMode")}
                </h3>
                <p className="text-sm text-muted">تغيير مظهر التطبيق</p>
              </div>
            </div>
            <ThemeSwitcher />
          </div>
        </div>
      </section>

      {/* Save button */}
      <div className="sticky flex justify-end bottom-6">
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="w-auto px-8 py-3 btn-primary hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
              <span className="mr-2">جاري الحفظ...</span>
            </>
          ) : (
            <>
              <Save size={18} />
              <span className="mr-2">{t("company.button.save")}</span>
            </>
          )}
        </button>
      </div>
    </main>
  );
}

/* ------------------------ Small reusable components ------------------------ */

function InputGroup({
  label,
  name,
  value,
  onChange,
  type = "text",
  full,
  placeholder,
}: any) {
  return (
    <div className={`flex flex-col ${full ? "md:col-span-2" : ""}`}>
      <label className="mb-2 text-sm font-medium text-text">{label}</label>
      <input
        name={name}
        className="input"
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
}
function Checkbox({ label, description, checked, onChange }: any) {
  return (
    <label className="flex items-start gap-3 cursor-pointer group">
      {/* Custom Checkbox */}
      <div className="relative flex items-center justify-center flex-shrink-0 mt-0.5">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="sr-only peer"
        />
        {/* Custom Checkbox Design */}
        <div
          className={`
          w-5 h-5 border-2 rounded-md transition-all duration-300 ease-out
          flex items-center justify-center
          peer-focus:ring-2 peer-focus:ring-primary/30 peer-focus:ring-offset-2
          ${
            checked
              ? "bg-primary border-primary shadow-primary/25"
              : "bg-background border-border hover:border-primary/60 hover:bg-primary/5"
          }
        `}
        >
          {/* Check Icon */}
          {checked && (
            <svg
              className="w-3 h-3 text-white animate-scale-in"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </div>

        {/* Ripple Effect */}
        <div className="absolute inset-0 transition-all duration-200 scale-150 rounded-md opacity-0 pointer-events-none peer-active:scale-100 peer-active:opacity-100 bg-primary/20"></div>
      </div>

      {/* Content */}
      <div className="flex-1 transition-all duration-300">
        <div
          className={`
          font-semibold transition-all duration-300
          ${
            checked
              ? "text-primary translate-x-1"
              : "text-text group-hover:text-primary/90"
          }
        `}
        >
          {label}
        </div>
        {description && (
          <div
            className={`
            mt-1.5 text-sm transition-all duration-300
            ${
              checked
                ? "text-primary/90 translate-x-1"
                : "text-muted group-hover:text-primary/70"
            }
          `}
          >
            {description}
          </div>
        )}
      </div>

      {/* Active Indicator */}
      {checked && (
        <div className="w-1.5 h-1.5 rounded-full bg-primary ml-2 mt-2 animate-pulse"></div>
      )}
    </label>
  );
}
