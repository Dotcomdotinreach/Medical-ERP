import { api, buildQuery } from "./api";

export interface Donor {
  _id: string;
  name: string;
  age: number;
  gender: string;
  bloodGroup: string;
  phone: string;
  lastDonation?: string;
  donations: number;
  status: string;
}

export interface BloodUnit {
  _id: string;
  unitNumber: string;
  donorId?: string;
  donorName?: string;
  bloodGroup: string;
  component: string;
  volume: number;
  collectionDate: string;
  expiryDate: string;
  status: string;
  storageLocation: string;
  screeningResult?: string;
  crossmatchResult?: string;
}

export interface BloodRequest {
  _id: string;
  requestId: string;
  patient: { _id: string; firstName: string; lastName: string; uhid: string };
  bloodGroup: string;
  component: string;
  units: number;
  priority: string;
  status: string;
  purpose: string;
  createdAt: string;
}

export interface Crossmatch {
  _id: string;
  patient: { _id: string; firstName: string; lastName: string };
  patientBg: string;
  donorUnit: string;
  donorBg: string;
  method: string;
  result: string;
  testedBy: string;
  createdAt: string;
}

export interface Transfusion {
  _id: string;
  patient: { _id: string; firstName: string; lastName: string };
  unit: string;
  bloodGroup: string;
  component: string;
  flowRate: number;
  startedAt?: string;
  completedAt?: string;
  status: string;
  reactions?: string;
  createdAt: string;
}

export const bloodBankApi = {
  listDonors: (filters?: { status?: string; bloodGroup?: string; search?: string; page?: number; limit?: number }) =>
    api.get<Donor[]>(`/blood-bank/donors${buildQuery(filters || {})}`),

  getDonor: (id: string) => api.get<Donor>(`/blood-bank/donors/${id}`),

  createDonor: (data: Partial<Donor>) =>
    api.post<Donor>("/blood-bank/donors", data),

  listUnits: (filters?: { bloodGroup?: string; status?: string; search?: string; page?: number; limit?: number }) =>
    api.get<BloodUnit[]>(`/blood-bank/units${buildQuery(filters || {})}`),

  getUnit: (id: string) => api.get<BloodUnit>(`/blood-bank/units/${id}`),

  listRequests: (filters?: { status?: string; priority?: string; page?: number; limit?: number }) =>
    api.get<BloodRequest[]>(`/blood-bank/requests${buildQuery(filters || {})}`),

  updateRequest: (id: string, data: { status: string }) =>
    api.patch(`/blood-bank/requests/${id}`, data),

  listCrossmatches: (filters?: { status?: string; page?: number; limit?: number }) =>
    api.get<Crossmatch[]>(`/blood-bank/crossmatches${buildQuery(filters || {})}`),

  updateCrossmatch: (id: string, result: string) =>
    api.patch(`/blood-bank/crossmatches/${id}`, { result }),

  listTransfusions: (filters?: { status?: string; page?: number; limit?: number }) =>
    api.get<Transfusion[]>(`/blood-bank/transfusions${buildQuery(filters || {})}`),

  createTransfusion: (data: { patientId: string; unitId: string; bloodGroup: string; component: string }) =>
    api.post<Transfusion>("/blood-bank/transfusions", data),

  stats: () => api.get("/blood-bank/stats"),
};
