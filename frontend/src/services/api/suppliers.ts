/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Supplier } from "../../types/Suppliers";
import { api } from "../axios"; // ✅ استخدام الـ instance الجاهز
import toast from "react-hot-toast";

// ✅ Get All Suppliers
export const fetchSuppliers = async (): Promise<Supplier[]> => {
  try {
    const { data } = await api.get("/api/v1/suppliers");
    return data.data.suppliers as Supplier[];
  } catch (error: any) {
    toast.error("فشل في جلب الموردين ❌");
    console.error("fetchSuppliers error:", error);
    throw error;
  }
};

// ✅ Get Single Supplier by ID
export const fetchSupplierById = async (id: string): Promise<Supplier> => {
  try {
    const { data } = await api.get(`/api/v1/suppliers/${id}`);
    return data.supplier as Supplier;
  } catch (error: any) {
    toast.error("فشل في جلب بيانات المورد ❌");
    console.error("fetchSupplierById error:", error);
    throw error;
  }
};

// ✅ Add New Supplier
export const addSupplier = async (values: Supplier): Promise<void> => {
  try {
    await api.post("/api/v1/suppliers", values);
    toast.success("تمت إضافة المورد بنجاح 🎉");
  } catch (error: any) {
    const msg = error.response?.data?.message || "فشل في إضافة المورد ❌";
    toast.error(msg);
    console.error("addSupplier error:", error);
    throw error;
  }
};

// ✅ Update Supplier
export const updateSupplier = async (id: string, values: Supplier): Promise<void> => {
  try {
    await api.patch(`/api/v1/suppliers/${id}`, values);
    toast.success("تم تعديل بيانات المورد بنجاح 🎉");
  } catch (error: any) {
    const msg = error.response?.data?.message || "فشل في تعديل بيانات المورد ❌";
    toast.error(msg);
    console.error("updateSupplier error:", error);
    throw error;
  }
};

// ✅ Delete Supplier
export const deleteSupplier = async (id: string): Promise<void> => {
  try {
    await api.delete(`/api/v1/suppliers/${id}`);
    toast.success("تم حذف المورد بنجاح 🗑️");
  } catch (error: any) {
    const msg = error.response?.data?.message || "فشل في حذف المورد ❌";
    toast.error(msg);
    console.error("deleteSupplier error:", error);
    throw error;
  }
};
