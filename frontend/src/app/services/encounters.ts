import { api, buildQuery } from "./api";

export interface Encounter {
  _id: string;
  encounterNumber: string;
  patient: { _id: string; firstName: string; lastName: string; uhid: string };
  doctor: { _id: string; name: string };
  type: string;
  status: string;
  chiefComplaint?: string;
  vitals?: { temperature: number; heartRate: number; bloodPressure: string; respiratoryRate: number; oxygenSaturation: number; weight: number };
  diagnosis?: string[];
  notes?: string;
  createdAt: string;
}

export interface EncounterFilters {
  status?: string;
  type?: string;
  patient?: string;
  doctor?: string;
  page?: number;
  limit?: number;
}

export const encounterApi = {
  list: (filters?: EncounterFilters) =>
    api.get<Encounter[]>(`/encounters${buildQuery(filters || {})}`),

  get: (id: string) => api.get<Encounter>(`/encounters/${id}`),

  create: (data: { patientId: string; doctorId: string; type: string; chiefComplaint?: string }) =>
    api.post<Encounter>("/encounters", data),

  update: (id: string, data: Partial<Encounter>) =>
    api.put<Encounter>(`/encounters/${id}`, data),

  addVitals: (id: string, vitals: Encounter["vitals"]) =>
    api.patch(`/encounters/${id}/vitals`, vitals),

  addDiagnosis: (id: string, diagnosis: string[]) =>
    api.patch(`/encounters/${id}/diagnosis`, { diagnosis }),

  addNotes: (id: string, notes: string) =>
    api.patch(`/encounters/${id}/notes`, { notes }),

  complete: (id: string) =>
    api.patch(`/encounters/${id}/complete`),
};
