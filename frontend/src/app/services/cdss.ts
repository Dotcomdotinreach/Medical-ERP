import { api, buildQuery } from "./api";

export const cdssApi = {
  listAlerts: (filters?: { status?: string; severity?: string; page?: number; limit?: number }) =>
    api.get(`/cdss/alerts${buildQuery(filters || {})}`),
  listGuidelines: (filters?: { specialty?: string; page?: number; limit?: number }) =>
    api.get(`/cdss/guidelines${buildQuery(filters || {})}`),
  listProtocols: (filters?: { active?: boolean; page?: number; limit?: number }) =>
    api.get(`/cdss/protocols${buildQuery(filters || {})}`),
  runClinicalCheck: (data: { patientId: string; type: string }) =>
    api.post("/cdss/check", data),
  stats: () => api.get("/cdss/stats"),
};