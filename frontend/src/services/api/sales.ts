import toast from "react-hot-toast";
import { api } from "../axios";
import type { NewInvoiceFormValues, Sale } from "../../types/sales";

//  Get All Sales
type SalesResponse = {
  data: {
    sales: Sale[];
  };
};

export const fetchSales = async (): Promise<Sale[]> => {
  try {
    const response = await api.get<SalesResponse>("/api/v1/sales");
    return response.data.data.sales;
  } catch (error) {
    console.error(" خطأ في تحميل المبيعات:", error);
    toast.error("حدث خطأ أثناء تحميل المبيعات ");
    return [];
  }
};

//  Add New Sale
export const handleFormSales = async (
  values: NewInvoiceFormValues
): Promise<void> => {
  try {
    await api.post("/api/v1/sales", values);
    toast.success("تمت إضافة الفاتورة بنجاح! ");
  } catch (error) {
    console.error(" فشل في إضافة الفاتورة:", error);
    toast.error("فشل في إضافة الفاتورة. تحقق من جميع البيانات.");
  }
};

//  Delete One Sale
export const deleteOneSale = async (id: string): Promise<void> => {
  try {
    await api.delete(`/api/v1/sales/${id}`);
    toast.success("تم حذف الفاتورة بنجاح! ");
  } catch (error) {
    console.error(" تعذر حذف الفاتورة:", error);
    toast.error("تعذر حذف الفاتورة.");
  }
};

//  Get Single Sale
//  Get Single Sale
export const fetchSingleSale = async (id: string): Promise<Sale> => {
  try {
    const res = await api.get(`/api/v1/sales/${id}`);

    return res.data.sale;
  } catch (error) {
    console.error("فشل في تحميل تفاصيل الفاتورة:", error);
    toast.error("فشل في تحميل تفاصيل الفاتورة.");
    throw error;
  }
};

export const updateSale = async (
  id: string,
  paymentStatus: string
): Promise<void> => {
  try {
    await api.patch(`/api/v1/sales/${id}`, { paymentStatus });
    toast.success("تم تحديث حالة الدفع بنجاح!");
  } catch (error) {
    console.error("فشل في تحديث الفاتورة:", error);
    toast.error("فشل في تحديث حالة الدفع.");
    throw error;
  }
};
