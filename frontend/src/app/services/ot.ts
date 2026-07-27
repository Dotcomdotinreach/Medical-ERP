import { api, buildQuery } from "./api";

export interface Surgery {
  _id: string;
  surgeryId: string;
  patient: { _id: string; firstName: string; lastName: string; uhid: string };
  doctor: { _id: string; name: string };
  procedure: string;
  type: string;
  priority: string;
  status: string;
  scheduledDate: string;
  scheduledTime: string;
  estimatedDuration: number;
  otRoom?: string;
  anesthesiaType: string;
  preOpDiagnosis?: string;
  postOpDiagnosis?: string;
  notes?: string;
  createdAt: string;
}

export interface OtRoom {
  _id: string;
  roomNumber: string;
  name: string;
  status: string;
  currentSurgery?: string;
  cleaningStatus: string;
}

export interface OtStats {
  totalSurgeries: number;
  scheduledToday: number;
  completedToday: number;
  cancelledToday: number;
  orUtilization: number;
}

export const otApi = {
  listSurgeries: (filters?: { status?: string; date?: string; priority?: string; page?: number; limit?: number }) =>
    api.get<Surgery[]>(`/ot/surgeries${buildQuery(filters || {})}`),

  getSurgery: (id: string) => api.get<Surgery>(`/ot/surgeries/${id}`),

  createSurgery: (data: { patientId: string; doctorId: string; procedure: string; type: string; priority: string; scheduledDate: string; scheduledTime: string; estimatedDuration: number; anesthesiaType: string; preOpDiagnosis?: string }) =>
    api.post<Surgery>("/ot/surgeries", data),

  updateStatus: (id: string, status: string) =>
    api.patch(`/ot/surgeries/${id}/status`, { status }),

  updateSurgery: (id: string, data: Partial<Surgery>) =>
    api.put<Surgery>(`/ot/surgeries/${id}`, data),

  addNote: (id: string, note: string) =>
    api.patch(`/ot/surgeries/${id}/note`, { note }),

  listRooms: (filters?: { status?: string; page?: number; limit?: number }) =>
    api.get<OtRoom[]>(`/ot/rooms${buildQuery(filters || {})}`),

  updateRoomStatus: (id: string, status: string) =>
    api.patch(`/ot/rooms/${id}/status`, { status }),

  getSchedule: (date: string) =>
    api.get(`/ot/schedule${buildQuery({ date })}`),

  stats: () => api.get<OtStats>("/ot/stats"),
};
