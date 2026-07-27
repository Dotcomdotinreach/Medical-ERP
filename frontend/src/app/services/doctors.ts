import { api, buildQuery } from "./api";

export interface Doctor {
  _id: string;
  name: string;
  department: string;
  specialization: string[];
  qualification: string[];
  experience: number;
  phone: string;
  email: string;
  consultingFee: number;
  availableDays: string[];
  availableSlots: { day: string; slots: string[] }[];
  status: string;
}

export interface DoctorFilters {
  search?: string;
  department?: string;
  specialization?: string;
  page?: number;
  limit?: number;
}

export const doctorApi = {
  list: (filters?: DoctorFilters) =>
    api.get<Doctor[]>(`/doctors${buildQuery(filters || {})}`),

  get: (id: string) => api.get<Doctor>(`/doctors/${id}`),

  getSlots: (id: string, date: string) =>
    api.get<{ slots: string[] }>(`/doctors/${id}/slots${buildQuery({ date })}`),
};
