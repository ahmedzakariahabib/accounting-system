/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "../axios";
import type { Customer } from "../../types/customers";
import toast from "react-hot-toast";

/* -------------------------------------------------------
   🔸 Get All Customers
------------------------------------------------------- */
export const fetchCustomers = async (): Promise<Customer[]> => {
  try {
    const response = await api.get("/api/v1/customer");
    return response.data.data.customers as Customer[];
  } catch (err: any) {
    toast.error("حدث خطأ أثناء جلب العملاء ❌");
    console.error("fetchCustomers error:", err);
    throw err;
  }
};

/* -------------------------------------------------------
   🔸 Get One Customer by ID
------------------------------------------------------- */
export const fetchCustomerById = async (id: string): Promise<Customer> => {
  try {
    const response = await api.get(`/api/v1/customer/${id}`);
    return response.data.customer as Customer;
  } catch (err: any) {
    toast.error("فشل في تحميل بيانات العميل ❌");
    console.error("fetchCustomerById error:", err);
    throw err;
  }
};

/* -------------------------------------------------------
   🔸 Add New Customer
------------------------------------------------------- */
export const addCustomer = async (values: Omit<Customer, "_id" | "id">) => {
  try {
    const response = await api.post("/api/v1/customer", values);
    toast.success("تمت إضافة العميل بنجاح 🎉");
    return response.data;
  } catch (err: any) {
    const msg = err.response?.data?.message || "فشل في إضافة العميل ❌";
    toast.error(msg);
    console.error("addCustomer error:", err);
    throw err;
  }
};

/* -------------------------------------------------------
   🔸 Update Customer
------------------------------------------------------- */
export const updateCustomer = async (id: string, values: Partial<Customer>) => {
  try {
    const response = await api.patch(`/api/v1/customer/${id}`, values);
    toast.success("تم تعديل بيانات العميل بنجاح 🎉");
    return response.data;
  } catch (err: any) {
    const msg = err.response?.data?.message || "فشل تعديل بيانات العميل ❌";
    toast.error(msg);
    console.error("updateCustomer error:", err);
    throw err;
  }
};

/* -------------------------------------------------------
   🔸 Delete Customer
------------------------------------------------------- */
export const deleteCustomer = async (id: string) => {
  try {
    await api.delete(`/api/v1/customer/${id}`);
    toast.success("تم حذف العميل بنجاح 🗑️");
  } catch (err: any) {
    const msg = err.response?.data?.message || "فشل حذف العميل ❌";
    toast.error(msg);
    console.error("deleteCustomer error:", err);
    throw err;
  }
};
