import { api, buildQuery } from "./api";

export interface NurseTask {
  _id: string;
  patient: { _id: string; firstName: string; lastName: string; uhid: string };
  admission: string;
  type: string;
  description: string;
  scheduledTime: string;
  status: string;
  completedAt?: string;
  notes?: string;
  createdAt: string;
}

export interface NurseTaskFilters {
  status?: string;
  type?: string;
  ward?: string;
  page?: number;
  limit?: number;
}

export const nurseApi = {
  listTasks: (filters?: NurseTaskFilters) =>
    api.get<NurseTask[]>(`/nurse/tasks${buildQuery(filters || {})}`),

  getTask: (id: string) => api.get<NurseTask>(`/nurse/tasks/${id}`),

  createTask: (data: { patientId: string; admissionId: string; type: string; description: string; scheduledTime: string }) =>
    api.post<NurseTask>("/nurse/tasks", data),

  updateTask: (id: string, data: Partial<NurseTask>) =>
    api.put<NurseTask>(`/nurse/tasks/${id}`, data),

  completeTask: (id: string, notes?: string) =>
    api.patch(`/nurse/tasks/${id}/complete`, { notes }),

  cancelTask: (id: string, reason: string) =>
    api.patch(`/nurse/tasks/${id}/cancel`, { reason }),

  getPatients: (ward?: string) =>
    api.get(`/nurse/patients${buildQuery({ ward })}`),

  addVitals: (patientId: string, vitals: any) =>
    api.post(`/nurse/patients/${patientId}/vitals`, vitals),

  getVitals: (patientId: string) =>
    api.get(`/nurse/patients/${patientId}/vitals`),

  stats: () => api.get("/nurse/stats"),
};
