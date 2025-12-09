export interface SupplierInfo {
  _id: string;
  name: string;
  email: string;
}

export type InventoryStatus = "In Stock" | "Out of Stock";

export interface InventoryItem {
  _id: string;
  itemName: string;
  category: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
  lowStockThreshold: number;
  sku: string;
  supplier: SupplierInfo | null;
  lastRestocked?: string | null;
  stockStatus: InventoryStatus;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryStats {
  totalItems: number;
  totalQuantity: number;
  lowStockCount: number;
}

export interface UpdateQuantityPayload {
  operation: "add" | "subtract";
  quantity: number;
}

export interface CreateInventoryPayload {
  itemName: string;
  category: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
  lowStockThreshold: number;
  sku: string;
  supplier: string;
}

export interface UpdateInventoryPayload {
  itemName?: string;
  category?: string;
  size?: string;
  color?: string;
  quantity?: number;
  price?: number;
  lowStockThreshold?: number;
  sku?: string;
  supplier?: string;
}
