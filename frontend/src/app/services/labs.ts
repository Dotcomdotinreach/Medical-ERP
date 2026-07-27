import { api, buildQuery } from "./api";

export interface LabOrder {
  _id: string;
  orderId: string;
  patient: { _id: string; firstName: string; lastName: string; uhid: string };
  doctor: { _id: string; name: string };
  priority: string;
  status: string;
  clinicalHistory?: string;
  samples: { name: string; status: string; collectedAt?: string }[];
  tests: { name: string; status: string; result?: any }[];
  createdAt: string;
}

export interface LabResult {
  _id: string;
  order: string;
  test: string;
  value: string;
  unit: string;
  referenceRange: string;
  flag?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  createdAt: string;
}

export interface LabFilters {
  status?: string;
  priority?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

export const labApi = {
  listOrders: (filters?: LabFilters) =>
    api.get<LabOrder[]>(`/lab/orders${buildQuery(filters || {})}`),

  getOrder: (id: string) => api.get<LabOrder>(`/lab/orders/${id}`),

  createOrder: (data: { patientId: string; doctorId: string; tests: string[]; priority?: string; clinicalHistory?: string }) =>
    api.post<LabOrder>("/lab/orders", data),

  collectSample: (orderId: string, sampleIndex: number) =>
    api.patch(`/lab/orders/${orderId}/samples/${sampleIndex}/collect`),

  rejectSample: (orderId: string, sampleIndex: number, reason: string) =>
    api.patch(`/lab/orders/${orderId}/samples/${sampleIndex}/reject`, { reason }),

  addResult: (orderId: string, data: { test: string; value: string; unit: string; referenceRange: string; flag?: string }) =>
    api.post(`/lab/orders/${orderId}/results`, data),

  verifyResult: (orderId: string, resultId: string) =>
    api.patch(`/lab/orders/${orderId}/results/${resultId}/verify`),

  approveResult: (orderId: string) =>
    api.patch(`/lab/orders/${orderId}/approve`),

  cancelOrder: (orderId: string, reason: string) =>
    api.patch(`/lab/orders/${orderId}/cancel`, { reason }),

  stats: () => api.get("/lab/stats"),
};
