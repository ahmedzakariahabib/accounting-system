import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import {
  getAllSettings,
  updateSettings as updateAPI,
} from "../services/api/settings";

export interface CompanySettings {
  showLogo: boolean;
  autoPrint: boolean;
  companyName: string;
  address: string;
  phoneNumber: string;
  email: string;
  taxId: string;
  image?: string;
  paperSize: "A4" | "Letter" | "A5" | string;
  defaultInvoiceTemplate: string;
  showCompanyDetails: boolean;
  darkMode: boolean;

  _id?: string;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

const defaultSettings: CompanySettings = {
  companyName: "",
  address: "",
  phoneNumber: "",
  email: "",
  taxId: "",
  image: "",

  paperSize: "A4",
  defaultInvoiceTemplate: "Modern",
  showCompanyDetails: true,

  darkMode: false,
  showLogo: false,
  autoPrint: false,
};

interface SettingsContextType {
  settings: CompanySettings;
  updateSettings: (newSettings: Partial<CompanySettings>) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | null>(null);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<CompanySettings>(defaultSettings);

  // load from API or localStorage
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const apiSettings = await getAllSettings();
        setSettings(apiSettings);
      } catch (err) {
        console.error("Failed to load settings:", err);
      }
    };

    loadSettings();
  }, []);

  // update settings (frontend + backend)
  const updateSettings = async (newSettings: Partial<CompanySettings>) => {
    try {
      const updated = await updateAPI(newSettings);

      setSettings(updated.settings);
      localStorage.setItem("companySettings", JSON.stringify(updated.settings));
    } catch (err) {
      console.error("Update failed:", err);
      throw err;
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used inside SettingsProvider");
  return ctx;
};
