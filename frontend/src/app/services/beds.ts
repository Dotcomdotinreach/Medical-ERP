import { api, buildQuery } from "./api";

export interface Bed {
  _id: string;
  bedNumber: string;
  ward: string;
  floor: string;
  type: string;
  status: string;
  patient?: { _id: string; firstName: string; lastName: string; uhid: string };
  admission?: string;
  features: string[];
  rate: number;
  createdAt: string;
}

export interface BedFilters {
  status?: string;
  ward?: string;
  floor?: string;
  type?: string;
  page?: number;
  limit?: number;
}

export const bedApi = {
  list: (filters?: BedFilters) =>
    api.get<Bed[]>(`/beds${buildQuery(filters || {})}`),

  get: (id: string) => api.get<Bed>(`/beds/${id}`),

  create: (data: Partial<Bed>) =>
    api.post<Bed>("/beds", data),

  update: (id: string, data: Partial<Bed>) =>
    api.put<Bed>(`/beds/${id}`, data),

  assign: (id: string, patientId: string, admissionId: string) =>
    api.patch(`/beds/${id}/assign`, { patientId, admissionId }),

  discharge: (id: string) =>
    api.patch(`/beds/${id}/discharge`),

  stats: () => api.get("/beds/stats"),
};
