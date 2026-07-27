import { api, buildQuery } from "./api";

export interface Instrument {
  _id: string;
  instrumentId: string;
  name: string;
  category: string;
  serialNumber: string;
  manufacturer: string;
  sterilizationRequired: boolean;
  status: string;
  lastSterilized?: string;
  nextMaintenance?: string;
  lifecycleCount: number;
  maxLifecycle: number;
}

export interface Tray {
  _id: string;
  trayNumber: string;
  procedure: string;
  instruments: string[];
  status: string;
  sterilityDate?: string;
  createdAt: string;
}

export interface SterilizationCycle {
  _id: string;
  cycleId: string;
  autoclave: string;
  type: string;
  batch: string;
  temperature: number;
  pressure: number;
  duration: number;
  biologicalIndicator: string;
  chemicalIndicator: string;
  status: string;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
}

export interface CssdStats {
  totalInstruments: number;
  activeCycles: number;
  pendingTrays: number;
  pendingRequests: number;
}

export const cssdApi = {
  listInstruments: (filters?: { search?: string; status?: string; page?: number; limit?: number }) =>
    api.get<Instrument[]>(`/cssd/instruments${buildQuery(filters || {})}`),

  getInstrument: (id: string) => api.get<Instrument>(`/cssd/instruments/${id}`),

  listTrays: (filters?: { status?: string; search?: string; page?: number; limit?: number }) =>
    api.get<Tray[]>(`/cssd/trays${buildQuery(filters || {})}`),

  listCycles: (filters?: { status?: string; date?: string; page?: number; limit?: number }) =>
    api.get<SterilizationCycle[]>(`/cssd/cycles${buildQuery(filters || {})}`),

  updateInstrumentStatus: (id: string, status: string) =>
    api.patch(`/cssd/instruments/${id}/status`, { status }),

  updateTrayStatus: (id: string, status: string) =>
    api.patch(`/cssd/trays/${id}/status`, { status }),

  updateCycleStatus: (id: string, status: string) =>
    api.patch(`/cssd/cycles/${id}/status`, { status }),

  stats: () => api.get<CssdStats>("/cssd/stats"),
};
