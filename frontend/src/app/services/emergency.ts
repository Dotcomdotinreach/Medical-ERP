import { api, buildQuery } from "./api";

export interface EmergencyEntry {
  _id: string;
  triageNumber: string;
  patient: { _id: string; firstName: string; lastName: string; uhid: string };
  triageLevel: string;
  chiefComplaint: string;
  arrivalMode: string;
  status: string;
  assignedDoctor?: { _id: string; name: string };
  bed?: { _id: string; bedNumber: string };
  vitals?: { temperature: number; heartRate: number; bloodPressure: string; respiratoryRate: number; oxygenSaturation: number };
  notes?: string;
  createdAt: string;
}

export interface EmergencyFilters {
  status?: string;
  triageLevel?: string;
  page?: number;
  limit?: number;
}

export const emergencyApi = {
  list: (filters?: EmergencyFilters) =>
    api.get<EmergencyEntry[]>(`/emergency${buildQuery(filters || {})}`),

  get: (id: string) => api.get<EmergencyEntry>(`/emergency/${id}`),

  create: (data: { patientId: string; triageLevel: string; chiefComplaint: string; arrivalMode: string; vitals?: EmergencyEntry["vitals"] }) =>
    api.post<EmergencyEntry>("/emergency", data),

  update: (id: string, data: Partial<EmergencyEntry>) =>
    api.put<EmergencyEntry>(`/emergency/${id}`, data),

  assignDoctor: (id: string, doctorId: string) =>
    api.patch(`/emergency/${id}/assign-doctor`, { doctorId }),

  admit: (id: string, data: { bedId?: string; department: string; diagnosis: string }) =>
    api.patch(`/emergency/${id}/admit`, data),

  discharge: (id: string, data: { disposition: string; notes?: string }) =>
    api.patch(`/emergency/${id}/discharge`, data),

  triage: (id: string, data: { triageLevel: string; notes?: string }) =>
    api.patch(`/emergency/${id}/triage`, data),

  stats: () => api.get("/emergency/stats"),
};
