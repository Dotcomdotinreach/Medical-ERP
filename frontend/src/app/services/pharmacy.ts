import { api, buildQuery } from "./api";

export interface StockItem {
  _id: string;
  name: string;
  genericName: string;
  category: string;
  form: string;
  strength: string;
  manufacturer: string;
  batchNumber: string;
  expiryDate: string;
  quantity: number;
  unitPrice: number;
  reorderLevel: number;
  gst: number;
  hsn: string;
  schedule: string;
  status: string;
  createdAt: string;
}

export interface Prescription {
  _id: string;
  prescriptionNumber: string;
  patient: { _id: string; firstName: string; lastName: string; uhid: string };
  doctor: { _id: string; name: string };
  encounter?: string;
  medications: { drug: string; dosage: string; frequency: string; duration: string; route: string; instructions: string }[];
  status: string;
  dispensedAt?: string;
  dispensedBy?: string;
  createdAt: string;
}

export interface PharmacyFilters {
  search?: string;
  category?: string;
  status?: string;
  expiringSoon?: boolean;
  page?: number;
  limit?: number;
}

export const pharmacyApi = {
  listStock: (filters?: PharmacyFilters) =>
    api.get<StockItem[]>(`/pharmacy/stock${buildQuery(filters || {})}`),

  getStockItem: (id: string) => api.get<StockItem>(`/pharmacy/stock/${id}`),

  addStock: (data: Partial<StockItem>) =>
    api.post<StockItem>("/pharmacy/stock", data),

  updateStock: (id: string, data: Partial<StockItem>) =>
    api.put<StockItem>(`/pharmacy/stock/${id}`, data),

  dispense: (prescriptionId: string, items: { stockItem: string; quantity: number }[]) =>
    api.post(`/pharmacy/prescriptions/${prescriptionId}/dispense`, { items }),

  listPrescriptions: (filters?: { status?: string; page?: number; limit?: number }) =>
    api.get<Prescription[]>(`/pharmacy/prescriptions${buildQuery(filters || {})}`),

  getPrescription: (id: string) => api.get<Prescription>(`/pharmacy/prescriptions/${id}`),

  createPrescription: (data: { patientId: string; doctorId: string; encounterId?: string; medications: Prescription["medications"] }) =>
    api.post<Prescription>("/pharmacy/prescriptions", data),

  stats: () => api.get("/pharmacy/stats"),
};
