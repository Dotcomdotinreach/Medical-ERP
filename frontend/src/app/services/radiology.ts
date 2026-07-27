import { api, buildQuery } from "./api";

export interface ImagingOrder {
  _id: string;
  orderId: string;
  patient: { _id: string; firstName: string; lastName: string; uhid: string };
  doctor: { _id: string; name: string };
  modality: string;
  priority: string;
  status: string;
  bodyPart: string;
  clinicalIndication?: string;
  scheduledDate?: string;
  results?: string;
  findings?: string;
  impressions?: string;
  recommendations?: string;
  protocol?: string;
  studyDate?: string;
  series?: string[];
  createdAt: string;
}

export interface RadFilters {
  status?: string;
  modality?: string;
  priority?: string;
  page?: number;
  limit?: number;
}

export const radiologyApi = {
  listOrders: (filters?: RadFilters) =>
    api.get<ImagingOrder[]>(`/radiology/orders${buildQuery(filters || {})}`),

  getOrder: (id: string) => api.get<ImagingOrder>(`/radiology/orders/${id}`),

  createOrder: (data: { patientId: string; doctorId: string; modality: string; bodyPart: string; priority?: string; clinicalIndication?: string; protocol?: string }) =>
    api.post<ImagingOrder>("/radiology/orders", data),

  updateStatus: (id: string, status: string) =>
    api.patch(`/radiology/orders/${id}/status`, { status }),

  addFindings: (id: string, data: { findings: string; impressions: string; recommendations: string }) =>
    api.post(`/radiology/orders/${id}/findings`, data),

  schedule: (id: string, data: { date: string; room?: string; technician?: string }) =>
    api.patch(`/radiology/orders/${id}/schedule`, data),

  stats: () => api.get("/radiology/stats"),
};
