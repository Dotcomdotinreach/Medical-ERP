import { api, buildQuery } from "./api";

export interface Patient {
  _id: string;
  uhid: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  phone: string;
  email?: string;
  address?: { line1: string; city: string; state: string; pincode: string };
  bloodGroup?: string;
  emergencyContact?: { name: string; phone: string; relation: string };
  abhaId?: string;
  status?: string;
  createdAt: string;
}

export interface PatientFilters {
  search?: string;
  status?: string;
  gender?: string;
  page?: number;
  limit?: number;
}

export const patientApi = {
  list: (filters?: PatientFilters) =>
    api.get<Patient[]>(`/patients${buildQuery(filters || {})}`),

  get: (id: string) => api.get<Patient>(`/patients/${id}`),

  create: (data: Partial<Patient>) =>
    api.post<Patient>("/patients", data),

  update: (id: string, data: Partial<Patient>) =>
    api.put<Patient>(`/patients/${id}`, data),

  search: (q: string) =>
    api.get<Patient[]>(`/patients${buildQuery({ search: q })}`),
};
