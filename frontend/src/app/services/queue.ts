import { api, buildQuery } from "./api";

export interface QueueEntry {
  _id: string;
  tokenNumber: number;
  patient: { _id: string; firstName: string; lastName: string; uhid: string };
  department: string;
  doctor?: { _id: string; name: string };
  type: string;
  status: string;
  priority: string;
  calledAt?: string;
  arrivedAt?: string;
  createdAt: string;
}

export interface QueueFilters {
  status?: string;
  department?: string;
  type?: string;
  page?: number;
  limit?: number;
}

export const queueApi = {
  list: (filters?: QueueFilters) =>
    api.get<QueueEntry[]>(`/queue${buildQuery(filters || {})}`),

  get: (id: string) => api.get<QueueEntry>(`/queue/${id}`),

  create: (data: { patientId: string; department: string; doctorId?: string; type?: string; priority?: string }) =>
    api.post<QueueEntry>("/queue", data),

  callNext: (department: string) =>
    api.patch<QueueEntry>("/queue/call-next", { department }),

  markArrived: (id: string) =>
    api.patch<QueueEntry>(`/queue/${id}/arrived`),

  markServing: (id: string) =>
    api.patch<QueueEntry>(`/queue/${id}/serving`),

  markComplete: (id: string) =>
    api.patch<QueueEntry>(`/queue/${id}/complete`),

  markNoShow: (id: string) =>
    api.patch<QueueEntry>(`/queue/${id}/no-show`),

  cancel: (id: string) =>
    api.patch<QueueEntry>(`/queue/${id}/cancel`),

  stats: () => api.get("/queue/stats"),
};
