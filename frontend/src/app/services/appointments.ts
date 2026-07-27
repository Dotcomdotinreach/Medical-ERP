import { api, buildQuery } from "./api";

export interface Appointment {
  _id: string;
  patient: { _id: string; firstName: string; lastName: string; uhid: string };
  doctor: { _id: string; name: string; department: string };
  date: string;
  timeSlot: string;
  type: string;
  status: string;
  reason?: string;
  notes?: string;
  createdAt: string;
}

export interface AppointmentFilters {
  status?: string;
  doctor?: string;
  date?: string;
  type?: string;
  page?: number;
  limit?: number;
}

export const appointmentApi = {
  list: (filters?: AppointmentFilters) =>
    api.get<Appointment[]>(`/appointments${buildQuery(filters || {})}`),

  get: (id: string) => api.get<Appointment>(`/appointments/${id}`),

  create: (data: Partial<Appointment>) =>
    api.post<Appointment>("/appointments", data),

  update: (id: string, data: Partial<Appointment>) =>
    api.put<Appointment>(`/appointments/${id}`, data),

  cancel: (id: string, reason?: string) =>
    api.patch(`/appointments/${id}/cancel`, { reason }),

  checkIn: (id: string) =>
    api.patch(`/appointments/${id}/check-in`),
};
