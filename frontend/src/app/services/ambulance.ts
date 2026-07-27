import { api, buildQuery } from "./api";

export interface AmbulanceDispatch {
  _id: string;
  callId: string;
  patient?: { _id: string; firstName: string; lastName: string; uhid: string };
  location: { address: string; lat: number; lng: number };
  emergencyType: string;
  priority: string;
  status: string;
  ambulance?: { _id: string; vehicleNumber: string; driver: string };
  eta: number;
  notes?: string;
  createdAt: string;
}

export const ambulanceApi = {
  listDispatches: (filters?: { status?: string; priority?: string; page?: number; limit?: number }) =>
    api.get<AmbulanceDispatch[]>(`/ambulance/dispatches${buildQuery(filters || {})}`),
  getDispatch: (id: string) => api.get<AmbulanceDispatch>(`/ambulance/dispatches/${id}`),
  updateStatus: (id: string, status: string) =>
    api.patch(`/ambulance/dispatches/${id}/status`, { status }),
  createDispatch: (data: any) => api.post<AmbulanceDispatch>("/ambulance/dispatches", data),
  stats: () => api.get("/ambulance/stats"),
};
