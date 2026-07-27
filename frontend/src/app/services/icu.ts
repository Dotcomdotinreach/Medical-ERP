import { api, buildQuery } from "./api";

export interface IcuPatient {
  _id: string;
  patient: { _id: string; firstName: string; lastName: string; uhid: string };
  bed: { _id: string; bedNumber: string };
  admittingDoctor: { _id: string; name: string };
  admittingDiagnosis: string;
  status: string;
  ventilatorStatus: boolean;
  vitals: { temperature: number; heartRate: number; bloodPressure: string; respiratoryRate: number; oxygenSaturation: number; bloodGlucose?: number };
  medications: string[];
  isolation: string;
  createdAt: string;
}

export interface IcuBed {
  _id: string;
  bedId: string;
  bedNumber: string;
  status: string;
  patient?: { _id: string; firstName: string; lastName: string };
  ventilatorAssigned: boolean;
  monitorAssigned: boolean;
  ivPumpCount: number;
}

export interface Ventilator {
  _id: string;
  bedId: string;
  status: string;
  mode: string;
  tidalVolume: number;
  respiratoryRate: number;
  peep: number;
  fio2: number;
}

export interface IcuStats {
  totalBeds: number;
  occupiedBeds: number;
  ventilatedPatients: number;
  isolationPatients: number;
  averageLos: number;
}

export const icuApi = {
  listPatients: (filters?: { status?: string; isolation?: string; page?: number; limit?: number }) =>
    api.get<IcuPatient[]>(`/icu/patients${buildQuery(filters || {})}`),

  getPatient: (id: string) => api.get<IcuPatient>(`/icu/patients/${id}`),

  addVitals: (id: string, vitals: Partial<IcuPatient["vitals"]>) =>
    api.patch(`/icu/patients/${id}/vitals`, vitals),

  updateVentilator: (id: string, data: Ventilator) =>
    api.patch(`/icu/patients/${id}/ventilator`, data),

  listBeds: (filters?: { status?: string; page?: number; limit?: number }) =>
    api.get<IcuBed[]>(`/icu/beds${buildQuery(filters || {})}`),

  assignBed: (bedId: string, patientId: string) =>
    api.post(`/icu/beds/${bedId}/assign`, { patientId }),

  discharge: (id: string, data: { dischargeDiagnosis?: string; outcome: string }) =>
    api.patch(`/icu/patients/${id}/discharge`, data),

  stats: () => api.get<IcuStats>("/icu/stats"),
};
