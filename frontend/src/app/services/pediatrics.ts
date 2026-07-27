import { api, buildQuery } from "./api";

export interface PediatricPatient {
  _id: string;
  patient: { _id: string; firstName: string; lastName: string; uhid: string };
  guardian: { name: string; phone: string; relation: string };
  age: number;
  weight: number;
  height: number;
  allergies: string[];
  diagnosis: string;
  status: string;
  createdAt: string;
}

export interface Neonate {
  _id: string;
  patient: { _id: string; firstName: string; lastName: string; uhid: string };
  birthWeight: number;
  gestationalAge: number;
  apgarScore: number;
  status: string;
  createdAt: string;
}

export interface PediatricStats {
  totalPatients: number;
  activeNeonates: number;
  todayAdmissions: number;
  currentOccupancy: number;
}

export const pediatricsApi = {
  listPatients: (filters?: { status?: string; ageRange?: string; page?: number; limit?: number }) =>
    api.get< PediatricPatient[]>(`/pediatrics/patients${buildQuery(filters || {})}`),

  getPatient: (id: string) => api.get< PediatricPatient>(`/pediatrics/patients/${id}`),

  listNeonates: (filters?: { status?: string; gestationalAge?: number; page?: number; limit?: number }) =>
    api.get<Neonate[]>(`/pediatrics/neonates${buildQuery(filters || {})}`),

  updateStatus: (id: string, status: string) =>
    api.patch(`/pediatrics/patients/${id}/status`, { status }),

  stats: () => api.get< PediatricStats>("/pediatrics/stats"),
};
