import { api, buildQuery } from "./api";

export interface InventoryItem {
  _id: string;
  name: string;
  category: string;
  sku: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  reorderLevel: number;
  supplier?: string;
  location?: string;
  expiryDate?: string;
  status: string;
  createdAt: string;
}

export interface InventoryFilters {
  search?: string;
  category?: string;
  status?: string;
  lowStock?: boolean;
  page?: number;
  limit?: number;
}

export const inventoryApi = {
  list: (filters?: InventoryFilters) =>
    api.get<InventoryItem[]>(`/inventory${buildQuery(filters || {})}`),

  get: (id: string) => api.get<InventoryItem>(`/inventory/${id}`),

  create: (data: Partial<InventoryItem>) =>
    api.post<InventoryItem>("/inventory", data),

  update: (id: string, data: Partial<InventoryItem>) =>
    api.put<InventoryItem>(`/inventory/${id}`, data),

  adjustStock: (id: string, data: { quantity: number; type: "in" | "out"; reason: string }) =>
    api.patch(`/inventory/${id}/adjust`, data),

  transfer: (id: string, data: { toLocation: string; quantity: number; reason: string }) =>
    api.patch(`/inventory/${id}/transfer`, data),

  stats: () => api.get("/inventory/stats"),
};
