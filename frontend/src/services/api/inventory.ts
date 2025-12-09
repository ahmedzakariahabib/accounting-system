import type {
  CreateInventoryPayload,
  InventoryItem,
  InventoryStats,
  UpdateInventoryPayload,
  UpdateQuantityPayload
} from "../../types/inventory";
import { api } from "../axios";

// GET ALL
export const getAllInventory = async (): Promise<InventoryItem[]> => {
  const res = await api.get("/api/v1/inventory");
  return Array.isArray(res.data?.data?.items)
    ? res.data.data.items
    : [];
};

// GET BY ID
export const getInventoryById = async (id: string): Promise<InventoryItem> => {
  const res = await api.get(`/api/v1/inventory/${id}`);
  // لو البيانات موجودة داخل "item" مباشرة
  return res.data.item;
};


// ADD
export const addInventoryItem = async (
  data: CreateInventoryPayload
): Promise<InventoryItem> => {
  const res = await api.post("/api/v1/inventory", data);
  return res.data.item; // ← الصحيح
};


// UPDATE
export const updateInventoryItem = async (
  id: string,
  data: UpdateInventoryPayload
): Promise<InventoryItem> => {
  const res = await api.patch(`/api/v1/inventory/${id}`, data);
  return res.data.item; // ← الصحيح
};

// DELETE
export const deleteInventoryItem = async (id: string): Promise<void> => {
  await api.delete(`/api/v1/inventory/${id}`);
};

// STATS
export const getInventoryStats = async (): Promise<InventoryStats> => {
  const res = await api.get("/api/v1/inventory/stats");
  return res.data.data.stats;
};

// UPDATE QUANTITY
export const updateQuantity = async (
  id: string,
  payload: UpdateQuantityPayload
): Promise<InventoryItem> => {
  const res = await api.patch(`/api/v1/inventory/${id}/quantity`, payload);
  return res.data.data.item;
};
