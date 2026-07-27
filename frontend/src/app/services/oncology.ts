import { api, buildQuery } from "./api";

export interface ChemotherapySession {
  _id: string;
  sessionId: string;
  patient: { _id: string; firstName: string; lastName: string; uhid: string };
  regimen: string;
  cycle: number;
  totalCycles: number;
  status: string;
  scheduledDate: string;
  administeredBy: string;
  preAssessment?: string;
  postAssessment?: string;
  sideEffects?: string[];
  notes?: string;
  createdAt: string;
}

export interface TumorBoardReview {
  _id: string;
  patientId: string;
  caseName: string;
  findings: string;
  recommendations: string[];
  attendees: string[];
  date: string;
  nextReview?: string;
}

export interface OncologyStats {
  totalPatients: number;
  activeSessions: number;
  scheduledToday: number;
  tumorBoardMeetings: number;
}

export const oncologyApi = {
  listSessions: (filters?: { status?: string; date?: string; page?: number; limit?: number }) =>
    api.get<ChemotherapySession[]>(`/oncology/sessions${buildQuery(filters || {})}`),

  getSession: (id: string) => api.get<ChemotherapySession>(`/oncology/sessions/${id}`),

  createSession: (data: { patientId: string; regimen: string; cycle: number; totalCycles: number; scheduledDate: string }) =>
    api.post<ChemotherapySession>("/oncology/sessions", data),

  updateStatus: (id: string, status: string) =>
    api.patch(`/oncology/sessions/${id}/status`, { status }),

  completeSession: (id: string, assessment: string) =>
    api.patch(`/oncology/sessions/${id}/complete`, { assessment }),

  listTumorBoards: (filters?: { date?: string; page?: number; limit?: number }) =>
    api.get<TumorBoardReview[]>(`/oncology/tumor-board${buildQuery(filters || {})}`),

  createTumorBoard: (data: { patientId: string; caseName: string; findings: string; recommendations: string[] }) =>
    api.post<TumorBoardReview>("/oncology/tumor-board", data),

  stats: () => api.get<OncologyStats>("/oncology/stats"),
};
