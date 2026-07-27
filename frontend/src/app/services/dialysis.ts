import { api, buildQuery } from "./api";

export interface DialysisSession {
  _id: string;
  sessionId: string;
  patient: { _id: string; firstName: string; lastName: string; uhid: string };
  machine: string;
  dialyzers: string;
  bloodFlow: number;
  dialysateFlow: number;
  duration: number;
  startTime: string;
  endTime?: string;
  status: string;
  type: string;
  vascularAccess: string;
  preWeight: number;
  postWeight?: number;
  complications?: string[];
  notes?: string;
  createdAt: string;
}

export interface DialysisMachine {
  _id: string;
  machineId: string;
  name: string;
  model: string;
  status: string;
  lastMaintenance: string;
  nextMaintenance: string;
  waterSystem: string;
  currentSession?: string;
}

export interface DialysisStats {
  totalMachines: number;
  activeSessionsToday: number;
  completedToday: number;
  utilizationRate: number;
}

export const dialysisApi = {
  listSessions: (filters?: { date?: string; status?: string; machine?: string; page?: number; limit?: number }) =>
    api.get<DialysisSession[]>(`/dialysis/sessions${buildQuery(filters || {})}`),

  getSession: (id: string) => api.get<DialysisSession>(`/dialysis/sessions/${id}`),

 createSession: (data: { patientId: string; machine: string; type: string; vascularAccess: string; preWeight: number }) =>
    api.post<DialysisSession>("/dialysis/sessions", data),

  updateStatus: (id: string, status: string, data?: Partial<DialysisSession>) =>
    api.patch(`/dialysis/sessions/${id}/status`, { status, ...data }),

  completeSession: (id: string, postWeight: number, notes?: string) =>
    api.patch(`/dialysis/sessions/${id}/complete`, { postWeight, notes }),

  listMachines: (filters?: { status?: string; page?: number; limit?: number }) =>
    api.get<DialysisMachine[]>(`/dialysis/machines${buildQuery(filters || {})}`),

  updateMachineStatus: (id: string, status: string) =>
    api.patch(`/dialysis/machines/${id}/status`, { status }),

  stats: () => api.get<DialysisStats>("/dialysis/stats"),
};
