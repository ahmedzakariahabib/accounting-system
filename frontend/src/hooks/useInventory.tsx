import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllInventory,
  deleteInventoryItem,
  updateQuantity,
  addInventoryItem,
  updateInventoryItem,
} from "../services/api/inventory";

import type {
  CreateInventoryPayload,
  UpdateInventoryPayload,
  UpdateQuantityPayload,
} from "../types/inventory";

// ALL ITEMS
export const useInventory = () => {
  return useQuery({
    queryKey: ["inventory"],
    queryFn: getAllInventory,
  });
};

// DELETE
export const useDeleteInventory = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteInventoryItem(id),
    onSuccess: () => client.invalidateQueries({ queryKey: ["inventory"] }),
  });
};

// ADD
export const useAddInventory = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateInventoryPayload) => addInventoryItem(data),
    onSuccess: () => client.invalidateQueries({ queryKey: ["inventory"] }),
  });
};

// UPDATE ITEM
export const useUpdateInventory = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateInventoryPayload }) =>
      updateInventoryItem(id, data),
    onSuccess: () => client.invalidateQueries({ queryKey: ["inventory"] }),
  });
};

// UPDATE QUANTITY
export const useUpdateQuantity = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateQuantityPayload }) =>
      updateQuantity(id, payload),
    onSuccess: () => client.invalidateQueries({ queryKey: ["inventory"] }),
  });
};
