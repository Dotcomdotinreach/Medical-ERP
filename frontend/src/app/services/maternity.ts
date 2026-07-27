import { api, buildQuery } from "./api";

export interface PatientRecord {
  _id: string;
  patient: { _id: string; firstName: string; lastName: string; uhid: string };
  gestationWeek: number;
  deliveryMethod: string;
  babyWeight: number;
  babyGender: string;
  complications: string[];
  status: string;
  createdAt: string;
}

export interface DeliveryRoom {
  _id: string;
  roomNumber: string;
  status: string;
  currentPatient?: string;
}

export interface MaternityStats {
  totalPatients: number;
  deliveriesToday: number;
  cSectionRate: number;
  avgLengthOfStay: number;
}

export const maternityApi = {
  listPatients: (filters?: { status?: string; gestationWeek?: number; page?: number; limit?: number }) =>
    api.get<PatientRecord[]>(`/maternity/patients${buildQuery(filters || {})}`),

  getPatient: (id: string) => api.get<PatientRecord>(`/maternity/patients/${id}`),

  createPatient: (data: Partial<PatientRecord>) =>
    api.post<PatientRecord>("/maternity/patients", data),

  updateStatus: (id: string, status: string) =>
    api.patch(`/maternity/patients/${id}/status`, { status }),

  updateRecord: (id: string, data: Partial<PatientRecord>) =>
    api.put<PatientRecord>(`/maternity/patients/${id}`, data),

  listRooms: (filters?: { status?: string; page?: number; limit?: number }) =>
    api.get<DeliveryRoom[]>(`/maternity/rooms${buildQuery(filters || {})}`),

  updateRoomStatus: (id: string, status: string) =>
    api.patch(`/maternity/rooms/${id}/status`, { status }),

  stats: () => api.get<MaternityStats>("/maternity/stats"),
};
