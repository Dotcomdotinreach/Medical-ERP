import { api, buildQuery } from "./api";

export interface Teleconsultation {
  _id: string;
  consultationId: string;
  patient: { _id: string; firstName: string; lastName: string; uhid: string };
  doctor: { _id: string; name: string };
  type: string;
  status: string;
  scheduledDate: string;
  scheduledTime: string;
  duration: number;
  platform: string;
  reason: string;
  notes?: string;
  prescription?: string;
  followUpDate?: string;
  createdAt: string;
}

export interface VideoRoom {
  _id: string;
  roomId: string;
  consultationId: string;
  status: string;
  startedAt?: string;
  endedAt?: string;
}

export interface TelemedicineStats {
  totalConsultations: number;
  completedToday: number;
  activeRooms: number;
  avgDuration: number;
}

export const telemedicineApi = {
  listConsultations: (filters?: { status?: string; date?: string; type?: string; page?: number; limit?: number }) =>
    api.get<Teleconsultation[]>(`/telemedicine/consultations${buildQuery(filters || {})}`),

  getConsultation: (id: string) => api.get<Teleconsultation>(`/telemedicine/consultations/${id}`),

  createConsultation: (data: { patientId: string; doctorId: string; type: string; scheduledDate: string; scheduledTime: string; reason: string }) =>
    api.post<Teleconsultation>("/telemedicine/consultations", data),

  updateStatus: (id: string, status: string) =>
    api.patch(`/telemedicine/consultations/${id}/status`, { status }),

  completeConsultation: (id: string, data: { notes: string; prescription?: string; followUpDate?: string }) =>
    api.patch(`/telemedicine/consultations/${id}/complete`, data),

  listRooms: (filters?: { status?: string; page?: number; limit?: number }) =>
    api.get<VideoRoom[]>(`/telemedicine/rooms${buildQuery(filters || {})}`),

  joinRoom: (roomId: string) =>
    api.patch(`/telemedicine/rooms/${roomId}/join`),

  endRoom: (roomId: string) =>
    api.patch(`/telemedicine/rooms/${roomId}/end`),

  stats: () => api.get<TelemedicineStats>("/telemedicine/stats"),
};
