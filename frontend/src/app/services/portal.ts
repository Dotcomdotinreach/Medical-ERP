import { api, buildQuery } from "./api";

export const portalApi = {
  getAppointments: (filters?: { status?: string; page?: number; limit?: number }) =>
    api.get(`/portal/appointments${buildQuery(filters || {})}`),
  getLabResults: (filters?: { page?: number; limit?: number }) =>
    api.get(`/portal/lab-results${buildQuery(filters || {})}`),
  getInvoices: (filters?: { status?: string; page?: number; limit?: number }) =>
    api.get(`/portal/invoices${buildQuery(filters || {})}`),
  getPrescriptions: (filters?: { page?: number; limit?: number }) =>
    api.get(`/portal/prescriptions${buildQuery(filters || {})}`),
};