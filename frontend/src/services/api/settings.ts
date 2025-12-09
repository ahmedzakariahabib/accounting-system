import { api } from "../axios";

export const getAllSettings = async () => {
  const res = await api.get("/api/v1/settings");
  return res.data.settings; // يرجّع Object واحد فقط
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateSettings = async (body: any) => {
  const allowed = {
    companyName: body.companyName,
    address: body.address,
    phoneNumber: body.phoneNumber,
    email: body.email,
    taxId: body.taxId,
    paperSize: body.paperSize,
    defaultInvoiceTemplate: body.defaultInvoiceTemplate,
    showCompanyDetails: body.showCompanyDetails,
    darkMode: body.darkMode,
  };

  const { data } = await api.patch("/api/v1/settings", allowed);
  return data;
};

