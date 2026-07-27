import { api, buildQuery } from "./api";

export interface Admission {
  _id: string;
  admissionNumber: string;
  patient: { _id: string; firstName: string; lastName: string; uhid: string };
  doctor: { _id: string; name: string };
  department: string;
  bed?: { _id: string; bedNumber: string; ward: string };
  type: string;
  status: string;
  reason: string;
  diagnosis?: string;
  admittedAt: string;
  expectedDischarge?: string;
  dischargedAt?: string;
  dischargeSummary?: string;
  createdAt: string;
}

export interface AdmissionFilters {
  status?: string;
  department?: string;
  doctor?: string;
  page?: number;
  limit?: number;
}

export const admissionApi = {
  list: (filters?: AdmissionFilters) =>
    api.get<Admission[]>(`/ipd/admissions${buildQuery(filters || {})}`),

  get: (id: string) => api.get<Admission>(`/ipd/admissions/${id}`),

  create: (data: { patientId: string; doctorId: string; department: string; bedId?: string; type: string; reason: string; diagnosis?: string }) =>
    api.post<Admission>("/ipd/admissions", data),

  update: (id: string, data: Partial<Admission>) =>
    api.put<Admission>(`/ipd/admissions/${id}`, data),

  discharge: (id: string, data: { dischargeSummary: string; diagnosis?: string }) =>
    api.patch(`/ipd/admissions/${id}/discharge`, data),

  transfer: (id: string, data: { newBedId: string; reason: string }) =>
    api.patch(`/ipd/admissions/${id}/transfer`, data),

  stats: () => api.get("/ipd/stats"),
};
