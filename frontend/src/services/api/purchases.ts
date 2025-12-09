import toast from "react-hot-toast";
import { api } from "../axios";
import type { NewPurchaseFormValues, Purchase } from "../../types/purchases";

// ===============================
// Get All Purchases
// ===============================
type PurchasesResponse = {
  data: {
    purchases: Purchase[];
  };
};

export const fetchPurchases = async (): Promise<Purchase[]> => {
  try {
    const response = await api.get<PurchasesResponse>("/api/v1/purchases");
    return response.data.data.purchases;
  } catch (error) {
    console.error("❌ خطأ في تحميل المشتريات:", error);
    toast.error("حدث خطأ أثناء تحميل المشتريات");
    return [];
  }
};

// ===============================
// Add New Purchase
// ===============================
export const handleFormPurchases = async (
  values: NewPurchaseFormValues
): Promise<void> => {
  try {
    await api.post("/api/v1/purchases", values);
    toast.success("تمت إضافة فاتورة المشتريات بنجاح! 🎉");
  } catch (error) {
    console.error("❌ فشل في إضافة الفاتورة:", error);
    toast.error("فشل في إضافة الفاتورة. تحقق من البيانات.");
  }
};

// ===============================
// Delete Purchase
// ===============================
export const deleteOnePurchase = async (id: string): Promise<void> => {
  try {
    await api.delete(`/api/v1/purchases/${id}`);
    toast.success("تم حذف الفاتورة بنجاح! 🗑️");
  } catch (error) {
    console.error("❌ تعذر حذف الفاتورة:", error);
    toast.error("تعذر حذف الفاتورة.");
  }
};

// ===============================
// Get Single Purchase
// ===============================
export const fetchSinglePurchase = async (
  id: string
): Promise<Purchase> => {
  try {
    const res = await api.get(`/api/v1/purchases/${id}`);
    return res.data.purchase;
  } catch (error) {
    console.error("❌ فشل في تحميل تفاصيل الفاتورة:", error);
    toast.error("فشل في تحميل تفاصيل الفاتورة.");
    throw error;
  }
};

// ===============================
// Update Purchase Status
// ===============================
export const updatePurchase = async (
  id: string,
  status: string
): Promise<void> => {
  try {
    await api.patch(`/api/v1/purchases/${id}`, { status });
    toast.success("تم تحديث حالة الفاتورة بنجاح!");
  } catch (error) {
    console.error("❌ فشل في تحديث الفاتورة:", error);
    toast.error("فشل في تحديث بيانات الفاتورة.");
  }
};
