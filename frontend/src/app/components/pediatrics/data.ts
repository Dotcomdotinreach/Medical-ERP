/* ── Pediatrics & Neonatal ICU (NICU) — Data ──────────────────────────────── */

export type BabyGender = "Male" | "Female";
export type BirthType = "Normal" | "Cesarean" | "Assisted" | "Emergency Cesarean";
export type NICUStatus = "Not Required" | "Admitted" | "Monitoring" | "Stable" | "Critical" | "Discharged" | "Referred";
export type NICUBedType = "Incubator" | "Radiant Warmer" | "Open Cot" | "Phototherapy";
export type VentilatorMode = "SIMV" | "A/C" | "CPAP" | "HFNC" | "NIPPV" | "Weaning" | "None";
export type FeedingType = "Breastfeeding" | "EBM" | "Donor Milk" | "Formula" | "Tube Feeding" | "TPN" | "Mixed";
export type VaccinationStatus = "Given" | "Due" | "Missed" | "Overdue" | "Contraindicated";
export type DevelopmentStatus = "On Track" | "Delayed" | "At Risk" | "Referred";
export type PhototherapyStatus = "Not Required" | "Active" | "Completed" | "Paused";
export type AdmissionStatus = "Admitted" | "Monitoring" | "Stable" | "Critical" | "Discharged" | "Referred";
export type DischargeStatus = "Not Ready" | "Ready" | "Discharged" | "Against Medical Advice";
export type RiskLevel = "Low" | "Moderate" | "High" | "Critical";

export interface Baby {
  id: string; babyId: string; uhid: string; name: string;
  gender: BabyGender; dateOfBirth: string; timeOfBirth: string;
  birthWeight: number; birthLength: number; headCircumference: number;
  gestationalAge: string; gestationalWeeks: number;
  birthType: BirthType; apgar1min: number; apgar5min: number; apgar10min: number;
  motherId: string; motherName: string;
  guardianName: string; guardianPhone: string; guardianRelation: string;
  bloodGroup: string; rhFactor: string;
  nicuStatus: NICUStatus; nicuBed?: string; nicuAdmissionDate?: string;
  admissionReason?: string; assignedNeonatologist: string;
  assignedNurse: string;
  currentWeight: number; currentLength: number; currentHeadCircumference: number;
  temperature: number; heartRate: number; respiratoryRate: number; spo2: number;
  respiratoryStatus: string; congenitalAnomalies: string[];
  vaccinationsDone: number; vaccinationsDue: number;
  status: string; lastUpdated: string;
}

export const BABIES: Baby[] = [
  { id: "BAB-001", babyId: "NB-001", uhid: "UHID-NB-001", name: "Aarav Sharma", gender: "Male", dateOfBirth: "2026-07-20", timeOfBirth: "03:42", birthWeight: 2850, birthLength: 49, headCircumference: 34, gestationalAge: "38w 2d", gestationalWeeks: 38, birthType: "Normal", apgar1min: 8, apgar5min: 9, apgar10min: 10, motherId: "MTH-001", motherName: "Priya Devi Sharma", guardianName: "Rajesh Sharma", guardianPhone: "+91 98765 43211", guardianRelation: "Father", bloodGroup: "B+", rhFactor: "Positive", nicuStatus: "Not Required", currentWeight: 3100, currentLength: 51, currentHeadCircumference: 35, temperature: 36.8, heartRate: 142, respiratoryRate: 38, spo2: 98, respiratoryStatus: "Spontaneous", congenitalAnomalies: [], vaccinationsDone: 2, vaccinationsDue: 3, status: "Active", lastUpdated: "2026-07-24T08:00:00" },
  { id: "BAB-002", babyId: "NB-002", uhid: "UHID-NB-002", name: "Diya Patel", gender: "Female", dateOfBirth: "2026-07-18", timeOfBirth: "14:15", birthWeight: 1650, birthLength: 41, headCircumference: 29, gestationalAge: "32w 4d", gestationalWeeks: 32, birthType: "Cesarean", apgar1min: 6, apgar5min: 7, apgar10min: 8, motherId: "MTH-003", motherName: "Sunita Kumari", guardianName: "Amit Kumar", guardianPhone: "+91 76543 21099", guardianRelation: "Father", bloodGroup: "O-", rhFactor: "Negative", nicuStatus: "Admitted", nicuBed: "NICU-03", nicuAdmissionDate: "2026-07-18", admissionReason: "Prematurity — RDS", assignedNeonatologist: "Dr. Priya Neonatologist", assignedNurse: "Nurse Kavitha", currentWeight: 1820, currentLength: 43, currentHeadCircumference: 30, temperature: 36.5, heartRate: 156, respiratoryRate: 52, spo2: 94, respiratoryStatus: "CPAP Support", congenitalAnomalies: [], vaccinationsDone: 0, vaccinationsDue: 2, status: "Active", lastUpdated: "2026-07-24T07:30:00" },
  { id: "BAB-003", babyId: "NB-003", uhid: "UHID-NB-003", name: "Rohan Singh", gender: "Male", dateOfBirth: "2026-07-15", timeOfBirth: "09:30", birthWeight: 3200, birthLength: 50, headCircumference: 35, gestationalAge: "39w 0d", gestationalWeeks: 39, birthType: "Normal", apgar1min: 9, apgar5min: 10, apgar10min: 10, motherId: "MTH-005", motherName: "Meena Singh", guardianName: "Deepak Singh", guardianPhone: "+91 54321 09877", guardianRelation: "Father", bloodGroup: "A+", rhFactor: "Positive", nicuStatus: "Not Required", currentWeight: 3400, currentLength: 52, currentHeadCircumference: 35.5, temperature: 37.0, heartRate: 138, respiratoryRate: 36, spo2: 99, respiratoryStatus: "Spontaneous", congenitalAnomalies: [], vaccinationsDone: 3, vaccinationsDue: 2, status: "Active", lastUpdated: "2026-07-24T09:00:00" },
  { id: "BAB-004", babyId: "NB-004", uhid: "UHID-NB-004", name: "Ananya Reddy", gender: "Female", dateOfBirth: "2026-07-10", timeOfBirth: "22:10", birthWeight: 1200, birthLength: 38, headCircumference: 27, gestationalAge: "28w 1d", gestationalWeeks: 28, birthType: "Emergency Cesarean", apgar1min: 3, apgar5min: 5, apgar10min: 7, motherId: "MTH-004", motherName: "Kavitha Reddy", guardianName: "Suresh Reddy", guardianPhone: "+91 65432 10988", guardianRelation: "Father", bloodGroup: "AB+", rhFactor: "Positive", nicuStatus: "Critical", nicuBed: "NICU-01", nicuAdmissionDate: "2026-07-10", admissionReason: "Extreme prematurity — RDS — PDA", assignedNeonatologist: "Dr. Priya Neonatologist", assignedNurse: "Nurse Lakshmi", currentWeight: 1380, currentLength: 40, currentHeadCircumference: 28, temperature: 36.3, heartRate: 168, respiratoryRate: 64, spo2: 88, respiratoryStatus: "Ventilator — SIMV", congenitalAnomalies: ["PDA — small"], vaccinationsDone: 0, vaccinationsDue: 1, status: "Active", lastUpdated: "2026-07-24T06:00:00" },
  { id: "BAB-005", babyId: "NB-005", uhid: "UHID-NB-005", name: "Kavya Nair", gender: "Female", dateOfBirth: "2026-07-22", timeOfBirth: "06:20", birthWeight: 2400, birthLength: 46, headCircumference: 32, gestationalAge: "36w 3d", gestationalWeeks: 36, birthType: "Normal", apgar1min: 7, apgar5min: 8, apgar10min: 9, motherId: "MTH-006", motherName: "Lakshmi Nair", guardianName: "Arun Nair", guardianPhone: "+91 43210 98766", guardianRelation: "Father", bloodGroup: "O+", rhFactor: "Positive", nicuStatus: "Monitoring", nicuBed: "NICU-05", nicuAdmissionDate: "2026-07-22", admissionReason: "Late preterm — feeding difficulty", assignedNeonatologist: "Dr. Priya Neonatologist", assignedNurse: "Nurse Priya", currentWeight: 2500, currentLength: 47, currentHeadCircumference: 32.5, temperature: 36.7, heartRate: 148, respiratoryRate: 42, spo2: 96, respiratoryStatus: "Spontaneous", congenitalAnomalies: [], vaccinationsDone: 1, vaccinationsDue: 2, status: "Active", lastUpdated: "2026-07-24T07:00:00" },
  { id: "BAB-006", babyId: "NB-006", uhid: "UHID-NB-006", name: "Arjun Joshi", gender: "Male", dateOfBirth: "2026-07-23", timeOfBirth: "18:45", birthWeight: 3500, birthLength: 52, headCircumference: 36, gestationalAge: "40w 1d", gestationalWeeks: 40, birthType: "Normal", apgar1min: 9, apgar5min: 10, apgar10min: 10, motherId: "MTH-008", motherName: "Geeta Joshi", guardianName: "Mohan Joshi", guardianPhone: "+91 21098 76544", guardianRelation: "Father", bloodGroup: "B+", rhFactor: "Positive", nicuStatus: "Not Required", currentWeight: 3600, currentLength: 52, currentHeadCircumference: 36, temperature: 37.1, heartRate: 135, respiratoryRate: 34, spo2: 99, respiratoryStatus: "Spontaneous", congenitalAnomalies: [], vaccinationsDone: 2, vaccinationsDue: 2, status: "Active", lastUpdated: "2026-07-24T08:30:00" },
  { id: "BAB-007", babyId: "NB-007", uhid: "UHID-NB-007", name: "Meera Begum", gender: "Female", dateOfBirth: "2026-07-19", timeOfBirth: "11:05", birthWeight: 1800, birthLength: 42, headCircumference: 30, gestationalAge: "33w 5d", gestationalWeeks: 33, birthType: "Cesarean", apgar1min: 5, apgar5min: 7, apgar10min: 8, motherId: "MTH-007", motherName: "Fatima Begum", guardianName: "Ahmed Begum", guardianPhone: "+91 32109 87655", guardianRelation: "Father", bloodGroup: "A-", rhFactor: "Negative", nicuStatus: "Admitted", nicuBed: "NICU-04", nicuAdmissionDate: "2026-07-19", admissionReason: "Preterm — jaundice — phototherapy", assignedNeonatologist: "Dr. Priya Neonatologist", assignedNurse: "Nurse Kavitha", currentWeight: 1950, currentLength: 43, currentHeadCircumference: 30.5, temperature: 36.6, heartRate: 152, respiratoryRate: 48, spo2: 92, respiratoryStatus: "Phototherapy Active", congenitalAnomalies: [], vaccinationsDone: 0, vaccinationsDue: 2, status: "Active", lastUpdated: "2026-07-24T06:45:00" },
  { id: "BAB-008", babyId: "NB-008", uhid: "UHID-NB-008", name: "Vihaan Gupta", gender: "Male", dateOfBirth: "2026-06-25", timeOfBirth: "16:30", birthWeight: 4100, birthLength: 54, headCircumference: 37, gestationalAge: "41w 0d", gestationalWeeks: 41, birthType: "Normal", apgar1min: 8, apgar5min: 9, apgar10min: 10, motherId: "MTH-002", motherName: "Anita Patel", guardianName: "Vikram Patel", guardianPhone: "+91 87654 32110", guardianRelation: "Father", bloodGroup: "A+", rhFactor: "Positive", nicuStatus: "Discharged", nicuBed: "", nicuAdmissionDate: "2026-06-25", admissionReason: "Transient tachypnea — resolved", assignedNeonatologist: "Dr. Priya Neonatologist", assignedNurse: "Nurse Priya", currentWeight: 4500, currentLength: 56, currentHeadCircumference: 38, temperature: 37.0, heartRate: 130, respiratoryRate: 32, spo2: 99, respiratoryStatus: "Spontaneous", congenitalAnomalies: [], vaccinationsDone: 4, vaccinationsDue: 1, status: "Discharged", lastUpdated: "2026-07-20T10:00:00" },
];

export interface NICUBed {
  id: string; bedNumber: string; type: NICUBedType; status: "Occupied" | "Available" | "Maintenance" | "Cleaning";
  currentBaby?: string; admissionDate?: string;
  temperature: number; humidity: number;
  lastCleaned: string; lastCalibrated: string;
  maintenanceStatus: string;
}

export const NICU_BEDS: NICUBed[] = [
  { id: "NICU-01", bedNumber: "NICU-01", type: "Incubator", status: "Occupied", currentBaby: "Ananya Reddy", admissionDate: "2026-07-10", temperature: 36.5, humidity: 65, lastCleaned: "2026-07-23", lastCalibrated: "2026-07-20", maintenanceStatus: "OK" },
  { id: "NICU-02", bedNumber: "NICU-02", type: "Incubator", status: "Available", temperature: 36.8, humidity: 60, lastCleaned: "2026-07-24", lastCalibrated: "2026-07-22", maintenanceStatus: "OK" },
  { id: "NICU-03", bedNumber: "NICU-03", type: "Incubator", status: "Occupied", currentBaby: "Diya Patel", admissionDate: "2026-07-18", temperature: 36.4, humidity: 62, lastCleaned: "2026-07-23", lastCalibrated: "2026-07-21", maintenanceStatus: "OK" },
  { id: "NICU-04", bedNumber: "NICU-04", type: "Phototherapy", status: "Occupied", currentBaby: "Meera Begum", admissionDate: "2026-07-19", temperature: 36.6, humidity: 58, lastCleaned: "2026-07-23", lastCalibrated: "2026-07-19", maintenanceStatus: "OK" },
  { id: "NICU-05", bedNumber: "NICU-05", type: "Radiant Warmer", status: "Occupied", currentBaby: "Kavya Nair", admissionDate: "2026-07-22", temperature: 36.7, humidity: 55, lastCleaned: "2026-07-24", lastCalibrated: "2026-07-22", maintenanceStatus: "OK" },
  { id: "NICU-06", bedNumber: "NICU-06", type: "Radiant Warmer", status: "Available", temperature: 36.8, humidity: 56, lastCleaned: "2026-07-24", lastCalibrated: "2026-07-23", maintenanceStatus: "OK" },
  { id: "NICU-07", bedNumber: "NICU-07", type: "Open Cot", status: "Available", temperature: 36.9, humidity: 50, lastCleaned: "2026-07-24", lastCalibrated: "2026-07-24", maintenanceStatus: "OK" },
  { id: "NICU-08", bedNumber: "NICU-08", type: "Incubator", status: "Maintenance", temperature: 0, humidity: 0, lastCleaned: "2026-07-22", lastCalibrated: "2026-07-15", maintenanceStatus: "Heating element replacement" },
];

export interface GrowthRecord {
  id: string; babyId: string; babyName: string;
  recordDate: string; ageWeeks: number;
  weight: number; length: number; headCircumference: number;
  weightPercentile: number; lengthPercentile: number; hcPercentile: number;
  bmi: number; weightVelocity: number;
  nutritionStatus: string; feedingType: FeedingType;
  notes: string;
}

export const GROWTH_RECORDS: GrowthRecord[] = [
  { id: "GR-001", babyId: "BAB-001", babyName: "Aarav Sharma", recordDate: "2026-07-24", ageWeeks: 40, weight: 3100, length: 51, headCircumference: 35, weightPercentile: 45, lengthPercentile: 50, hcPercentile: 55, bmi: 11.9, weightVelocity: 25, nutritionStatus: "Adequate", feedingType: "Breastfeeding", notes: "Thriving well. Exclusive breastfeeding established." },
  { id: "GR-002", babyId: "BAB-001", babyName: "Aarav Sharma", recordDate: "2026-07-17", ageWeeks: 39, weight: 2900, length: 50, headCircumference: 34.5, weightPercentile: 42, lengthPercentile: 48, hcPercentile: 52, bmi: 11.6, weightVelocity: 20, nutritionStatus: "Adequate", feedingType: "Breastfeeding", notes: "Weight gain appropriate." },
  { id: "GR-003", babyId: "BAB-002", babyName: "Diya Patel", recordDate: "2026-07-24", ageWeeks: 34, weight: 1820, length: 43, headCircumference: 30, weightPercentile: 25, lengthPercentile: 30, hcPercentile: 28, bmi: 9.9, weightVelocity: 15, nutritionStatus: "Improving", feedingType: "EBM", notes: "Catch-up growth progressing. EBM via OG tube." },
  { id: "GR-004", babyId: "BAB-004", babyName: "Ananya Reddy", recordDate: "2026-07-24", ageWeeks: 32, weight: 1380, length: 40, headCircumference: 28, weightPercentile: 10, lengthPercentile: 12, hcPercentile: 15, bmi: 8.6, weightVelocity: 12, nutritionStatus: "Low", feedingType: "TPN", notes: "Extra-uterine growth restriction. TPN + minimal enteral feeds." },
  { id: "GR-005", babyId: "BAB-005", babyName: "Kavya Nair", recordDate: "2026-07-24", ageWeeks: 37, weight: 2500, length: 47, headCircumference: 32.5, weightPercentile: 35, lengthPercentile: 40, hcPercentile: 38, bmi: 11.3, weightVelocity: 18, nutritionStatus: "Adequate", feedingType: "Mixed", notes: "Transitioning to full oral feeds. Mixed feeding." },
  { id: "GR-006", babyId: "BAB-006", babyName: "Arjun Joshi", recordDate: "2026-07-24", ageWeeks: 41, weight: 3600, length: 52, headCircumference: 36, weightPercentile: 55, lengthPercentile: 52, hcPercentile: 58, bmi: 13.3, weightVelocity: 22, nutritionStatus: "Adequate", feedingType: "Breastfeeding", notes: "Healthy term baby. Exclusive breastfeeding." },
];

export interface Vaccination {
  id: string; babyId: string; babyName: string;
  vaccineName: string; doseNumber: number; dueDate: string;
  givenDate?: string; status: VaccinationStatus; site?: string;
  batchNumber?: string; manufacturer?: string;
  nextDueDate: string; administeredBy?: string;
  aefiReported: boolean; aefiDetails?: string;
}

export const VACCINATIONS: Vaccination[] = [
  { id: "VAC-001", babyId: "BAB-001", babyName: "Aarav Sharma", vaccineName: "BCG", doseNumber: 1, dueDate: "2026-07-20", givenDate: "2026-07-20", status: "Given", site: "Left Upper Arm", batchNumber: "BCG-2026-001", manufacturer: "Serum Institute", nextDueDate: "N/A", administeredBy: "Nurse Priya", aefiReported: false },
  { id: "VAC-002", babyId: "BAB-001", babyName: "Aarav Sharma", vaccineName: "Hepatitis B — Birth Dose", doseNumber: 1, dueDate: "2026-07-20", givenDate: "2026-07-20", status: "Given", site: "Right Thigh", batchNumber: "HEPB-2026-010", manufacturer: "Bharat Biotech", nextDueDate: "2026-08-20", administeredBy: "Nurse Priya", aefiReported: false },
  { id: "VAC-003", babyId: "BAB-001", babyName: "Aarav Sharma", vaccineName: "OPV — 0 Dose", doseNumber: 0, dueDate: "2026-07-20", givenDate: "2026-07-20", status: "Given", site: "Oral", batchNumber: "OPV-2026-020", manufacturer: "Bharat Biotech", nextDueDate: "2026-09-20", administeredBy: "Nurse Priya", aefiReported: false },
  { id: "VAC-004", babyId: "BAB-001", babyName: "Aarav Sharma", vaccineName: "Pentavalent — 1", doseNumber: 1, dueDate: "2026-09-20", status: "Due", nextDueDate: "2026-09-20", aefiReported: false },
  { id: "VAC-005", babyId: "BAB-003", babyName: "Rohan Singh", vaccineName: "BCG", doseNumber: 1, dueDate: "2026-07-15", givenDate: "2026-07-15", status: "Given", site: "Left Upper Arm", batchNumber: "BCG-2026-001", manufacturer: "Serum Institute", nextDueDate: "N/A", administeredBy: "Nurse Priya", aefiReported: false },
  { id: "VAC-006", babyId: "BAB-003", babyName: "Rohan Singh", vaccineName: "Hepatitis B — Birth Dose", doseNumber: 1, dueDate: "2026-07-15", givenDate: "2026-07-15", status: "Given", site: "Right Thigh", batchNumber: "HEPB-2026-010", manufacturer: "Bharat Biotech", nextDueDate: "2026-08-15", administeredBy: "Nurse Priya", aefiReported: false },
  { id: "VAC-007", babyId: "BAB-003", babyName: "Rohan Singh", vaccineName: "OPV — 0 Dose", doseNumber: 0, dueDate: "2026-07-15", givenDate: "2026-07-15", status: "Given", site: "Oral", batchNumber: "OPV-2026-020", manufacturer: "Bharat Biotech", nextDueDate: "2026-09-15", administeredBy: "Nurse Priya", aefiReported: false },
  { id: "VAC-008", babyId: "BAB-003", babyName: "Rohan Singh", vaccineName: "Pentavalent — 1", doseNumber: 1, dueDate: "2026-08-15", status: "Due", nextDueDate: "2026-08-15", aefiReported: false },
  { id: "VAC-009", babyId: "BAB-003", babyName: "Rohan Singh", vaccineName: "Rotavirus — 1", doseNumber: 1, dueDate: "2026-08-15", status: "Due", nextDueDate: "2026-08-15", aefiReported: false },
  { id: "VAC-010", babyId: "BAB-006", babyName: "Arjun Joshi", vaccineName: "BCG", doseNumber: 1, dueDate: "2026-07-23", givenDate: "2026-07-23", status: "Given", site: "Left Upper Arm", batchNumber: "BCG-2026-001", manufacturer: "Serum Institute", nextDueDate: "N/A", administeredBy: "Nurse Kavitha", aefiReported: false },
  { id: "VAC-011", babyId: "BAB-006", babyName: "Arjun Joshi", vaccineName: "Hepatitis B — Birth Dose", doseNumber: 1, dueDate: "2026-07-23", givenDate: "2026-07-23", status: "Given", site: "Right Thigh", batchNumber: "HEPB-2026-010", manufacturer: "Bharat Biotech", nextDueDate: "2026-08-23", administeredBy: "Nurse Kavitha", aefiReported: false },
  { id: "VAC-012", babyId: "BAB-006", babyName: "Arjun Joshi", vaccineName: "Pentavalent — 1", doseNumber: 1, dueDate: "2026-09-23", status: "Due", nextDueDate: "2026-09-23", aefiReported: false },
  { id: "VAC-013", babyId: "BAB-002", babyName: "Diya Patel", vaccineName: "BCG", doseNumber: 1, dueDate: "2026-08-18", status: "Due", nextDueDate: "2026-08-18", aefiReported: false },
  { id: "VAC-014", babyId: "BAB-002", babyName: "Diya Patel", vaccineName: "Hepatitis B — Birth Dose", doseNumber: 1, dueDate: "2026-07-18", status: "Missed", nextDueDate: "2026-08-01", aefiReported: false },
];

export interface VentilatorRecord {
  id: string; babyId: string; babyName: string;
  deviceId: string; mode: VentilatorMode;
  pip: number; peep: number; rate: number; fio2: number;
  map: number; ieRatio: string; ttube: number;
  spo2Target: number; alarmStatus: string;
  weaningStatus: string; startDateTime: string;
  notes: string;
}

export const VENTILATOR_RECORDS: VentilatorRecord[] = [
  { id: "VR-001", babyId: "BAB-004", babyName: "Ananya Reddy", deviceId: "Dräger Babylog VN500", mode: "SIMV", pip: 22, peep: 5, rate: 30, fio2: 45, map: 11, ieRatio: "1:2", ttube: 0, spo2Target: 92, alarmStatus: "Normal", weaningStatus: "Trial — decreasing rate", startDateTime: "2026-07-10T23:00:00", notes: "Weaning trial in progress. Rate decreased from 40 to 30." },
];

export interface CPAPRecord {
  id: string; babyId: string; babyName: string;
  deviceId: string; peep: number; fio2: number;
  flow: number; spo2Target: number; alarmStatus: string;
  startDateTime: string; duration: string; notes: string;
}

export const CPAP_RECORDS: CPAPRecord[] = [
  { id: "CPAP-001", babyId: "BAB-002", babyName: "Diya Patel", deviceId: "Fisher & Paykel MR810", peep: 6, fio2: 30, flow: 8, spo2Target: 93, alarmStatus: "Normal", startDateTime: "2026-07-22T10:00:00", duration: "48h ongoing", notes: "CPAP for RDS. Stable on current settings." },
];

export interface PhototherapyRecord {
  id: string; babyId: string; babyName: string;
  deviceId: string; bilirubinLevel: number;
  bilirubinTrend: string; treatmentHours: number;
  eyeProtection: boolean; sessionsCompleted: number;
  totalSessionsRequired: number; status: PhototherapyStatus;
  startDateTime: string; lastReading: string;
  notes: string;
}

export const PHOTOTHERAPY_RECORDS: PhototherapyRecord[] = [
  { id: "PT-001", babyId: "BAB-007", babyName: "Meera Begum", deviceId: "BiliLed — Wipro GE", bilirubinLevel: 14.2, bilirubinTrend: "Decreasing", treatmentHours: 36, eyeProtection: true, sessionsCompleted: 3, totalSessionsRequired: 4, status: "Active", startDateTime: "2026-07-21T08:00:00", lastReading: "2026-07-24T06:00:00", notes: "Bilirubin responding well to phototherapy. Last reading 14.2 mg/dL. Eye shields in place." },
];

export interface FeedingRecord {
  id: string; babyId: string; babyName: string;
  recordDate: string; feedingType: FeedingType;
  volume: number; frequency: string; route: string;
  totalIntake24h: number;urineOutput24h: number;
  notes: string;
}

export const FEEDING_RECORDS: FeedingRecord[] = [
  { id: "FR-001", babyId: "BAB-001", babyName: "Aarav Sharma", recordDate: "2026-07-24", feedingType: "Breastfeeding", volume: 0, frequency: "8–10 times/day", route: "Oral", totalIntake24h: 480,urineOutput24h: 6, notes: "Exclusive breastfeeding. Adequate voiding. Good latch." },
  { id: "FR-002", babyId: "BAB-002", babyName: "Diya Patel", recordDate: "2026-07-24", feedingType: "EBM", volume: 15, frequency: "Every 3 hours", route: "OG Tube", totalIntake24h: 120,urineOutput24h: 2.5, notes: "EBM via OG tube. Increasing volume gradually. Target 160 mL/kg/day." },
  { id: "FR-003", babyId: "BAB-004", babyName: "Ananya Reddy", recordDate: "2026-07-24", feedingType: "TPN", volume: 0, frequency: "Continuous", route: "IV", totalIntake24h: 85,urineOutput24h: 1.2, notes: "TPN + minimal enteral trophic feeds (5 mL Q3H). Goal: advance feeds as tolerated." },
  { id: "FR-004", babyId: "BAB-005", babyName: "Kavya Nair", recordDate: "2026-07-24", feedingType: "Mixed", volume: 30, frequency: "Every 2.5 hours", route: "Oral + OG Tube", totalIntake24h: 300,urineOutput24h: 4, notes: "Mixed feeding — breast + top-up formula. Improving oral feeding." },
];

export interface MedicationRecord {
  id: string; babyId: string; babyName: string;
  medicationName: string; dose: string; route: string;
  frequency: string; startTime: string; endTime?: string;
  duration: string; indication: string;
  prescribedBy: string; status: "Active" | "Completed" | "Discontinued";
  notes: string;
}

export const MEDICATION_RECORDS: MedicationRecord[] = [
  { id: "MED-001", babyId: "BAB-004", babyName: "Ananya Reddy", medicationName: "Caffeine Citrate", dose: "20 mg/kg loading, then 5 mg/kg/day", route: "IV", frequency: "Once daily", startTime: "2026-07-10", duration: "Ongoing", indication: "Apnea of prematurity", prescribedBy: "Dr. Priya Neonatologist", status: "Active", notes: "Caffeine for apnea prophylaxis. No apneic episodes in last 48h." },
  { id: "MED-002", babyId: "BAB-004", babyName: "Ananya Reddy", medicationName: "Surfactant (Curosurf)", dose: "200 mg/kg", route: "Intratracheal", frequency: "As needed", startTime: "2026-07-10", duration: "Single dose", indication: "RDS", prescribedBy: "Dr. Priya Neonatologist", status: "Completed", notes: "Initial surfactant given at birth. No repeat doses needed." },
  { id: "MED-003", babyId: "BAB-002", babyName: "Diya Patel", medicationName: "Ampicillin", dose: "50 mg/kg/dose", route: "IV", frequency: "Every 8 hours", startTime: "2026-07-22", duration: "5 days", indication: "Early onset sepsis prophylaxis", prescribedBy: "Dr. Priya Neonatologist", status: "Active", notes: "Started for suspected EOS. Blood culture pending." },
  { id: "MED-004", babyId: "BAB-007", babyName: "Meera Begum", medicationName: "Phenobarbitone", dose: "20 mg/kg loading, then 5 mg/kg/day", route: "IV", frequency: "Once daily", startTime: "2026-07-19", duration: "Ongoing", indication: "Neonatal seizures", prescribedBy: "Dr. Priya Neonatologist", status: "Active", notes: "Seizures controlled. Maintenance dose ongoing." },
];

export interface DischargeRecord {
  id: string; babyId: string; babyName: string;
  dischargeDate: string; dischargeType: string;
  clinicalClearance: boolean; vaccinationClearance: boolean;
  parentEducation: boolean; feedingAdvice: string;
  followUpDate: string; followUpDepartment: string;
  dischargeWeight: number; dischargeDiagnosis: string;
  medicationsOnDischarge: string[];
  parentInstructions: string;
  status: DischargeStatus;
}

export const DISCHARGE_RECORDS: DischargeRecord[] = [
  { id: "DC-001", babyId: "BAB-008", babyName: "Vihaan Gupta", dischargeDate: "2026-06-28", dischargeType: "Routine", clinicalClearance: true, vaccinationClearance: true, parentEducation: true, feedingAdvice: "Exclusive breastfeeding for 6 months. Vitamin D drops daily.", followUpDate: "2026-07-28", followUpDepartment: "Pediatric OPD", dischargeWeight: 4200, dischargeDiagnosis: "Transient tachypnea of newborn — resolved", medicationsOnDischarge: ["Vitamin D 400 IU daily"], parentInstructions: "Continue breastfeeding. Return if fever, poor feeding, or respiratory distress.", status: "Discharged" },
];

export interface PediatricOPD {
  id: string; babyId: string; babyName: string;
  visitDate: string; ageAtVisit: string;
  chiefComplaint: string; history: string;
  temperature: number; weight: number; length: number;
  headCircumference?: number;
  physicalExamination: string; diagnosis: string;
  prescription: string; labOrders: string;
  followUpPlan: string; pediatrician: string;
}

export const PEDIATRIC_OPDS: PediatricOPD[] = [
  { id: "OPD-001", babyId: "BAB-008", babyName: "Vihaan Gupta", visitDate: "2026-07-25", ageAtVisit: "4 weeks", chiefComplaint: "Follow-up — routine check-up", history: "Feeding well. No fever. Bowel movements normal.", temperature: 37.0, weight: 4500, length: 56, headCircumference: 38, physicalExamination: "Active, alert. Fontanelle flat. No jaundice. Chest clear. Abdomen soft. Umbilicus dry.", diagnosis: "Healthy term infant — normal check-up", prescription: "Continue Vitamin D 400 IU daily", labOrders: "None", followUpPlan: "2-month vaccination visit", pediatrician: "Dr. Rajesh Pediatrician" },
  { id: "OPD-002", babyId: "BAB-001", babyName: "Aarav Sharma", visitDate: "2026-07-28", ageAtVisit: "1 week", chiefComplaint: "Poor feeding — 1 day", history: "Mother reports baby not latching well since yesterday. Reduced wet diapers.", temperature: 37.2, weight: 2950, length: 49, physicalExamination: "Mild dehydration. Weight loss 8%. No fever. Alert but irritable.", diagnosis: "Dehydration — likely due to poor feeding technique", prescription: "Supportive feeding. Return if no improvement in 24h.", labOrders: "Bilirubin — total & direct", followUpPlan: "Tomorrow — weight check & bilirubin follow-up", pediatrician: "Dr. Rajesh Pediatrician" },
];

export interface AuditLog {
  id: string; timestamp: string; user: string; action: string;
  resource: string; details: string; severity: "Info" | "Warning" | "Critical";
}

export const AUDIT_LOGS: AuditLog[] = [
  { id: "AUD-001", timestamp: "2026-07-24T07:00:00", user: "Dr. Priya Neonatologist", action: "NICU Assessment", resource: "BAB-004", details: "Ananya Reddy — Ventilator weaning trial — rate decreased to 30", severity: "Info" },
  { id: "AUD-002", timestamp: "2026-07-24T06:45:00", user: "Dr. Priya Neonatologist", action: "Phototherapy Review", resource: "BAB-007", details: "Meera Begum — Bilirubin 14.2 mg/dL — improving", severity: "Info" },
  { id: "AUD-003", timestamp: "2026-07-24T06:00:00", user: "Nurse Kavitha", action: "NICU Monitoring", resource: "BAB-004", details: "Ananya Reddy — SpO2 low at 88% — FiO2 adjusted", severity: "Warning" },
  { id: "AUD-004", timestamp: "2026-07-23T14:00:00", user: "Dr. Rajesh Pediatrician", action: "Pediatric OPD", resource: "OPD-002", details: "Aarav Sharma — Poor feeding — dehydration", severity: "Warning" },
  { id: "AUD-005", timestamp: "2026-07-23T10:00:00", user: "Nurse Priya", action: "Vaccination", resource: "VAC-010", details: "Arjun Joshi — BCG + Hep B given", severity: "Info" },
  { id: "AUD-006", timestamp: "2026-07-22T08:00:00", user: "Dr. Priya Neonatologist", action: "NICU Admission", resource: "BAB-005", details: "Kavya Nair — Late preterm — feeding difficulty", severity: "Info" },
  { id: "AUD-007", timestamp: "2026-07-21T16:00:00", user: "Dr. Priya Neonatologist", action: "Critical Alert", resource: "BAB-004", details: "Ananya Reddy — Apnea episode — resolved with stimulation", severity: "Critical" },
];

/* ── Pediatric KPIs ───────────────────────────────────────────────────────── */
export const PEDIATRICS_KPI = {
  totalBabies: 8,
  activeNICU: 4,
  availableNICUBeds: 3,
  criticalBabies: 1,
  todayOPDVisits: 2,
  vaccinationsDue: 6,
  dischargesToday: 0,
  emergencyAdmissions: 0,
  totalNICUBeds: 8,
  nicuOccupancy: 50,
  avgLengthOfStay: 8.5,
  ventilatorUtilization: 12.5,
  mortalityRate: 0,
  infectionRate: 2.1,
  vaccinationCoverage: 85,
};

/* ── Helpers ──────────────────────────────────────────────────────────────── */
export function nicuStatusTone(s: NICUStatus): "success" | "warning" | "danger" | "info" {
  switch (s) { case "Not Required": case "Discharged": return "success"; case "Stable": case "Monitoring": return "info"; case "Admitted": return "warning"; case "Critical": case "Referred": return "danger"; default: return "info"; }
}
export function bedStatusTone(s: string): "success" | "warning" | "danger" | "info" {
  switch (s) { case "Available": return "success"; case "Occupied": return "warning"; case "Maintenance": case "Cleaning": return "danger"; default: return "info"; }
}
export function vaccinationStatusTone(s: VaccinationStatus): "success" | "warning" | "danger" | "info" {
  switch (s) { case "Given": return "success"; case "Due": return "info"; case "Missed": case "Overdue": return "danger"; case "Contraindicated": return "warning"; default: return "info"; }
}
export function developmentStatusTone(s: DevelopmentStatus): "success" | "warning" | "danger" | "info" {
  switch (s) { case "On Track": return "success"; case "Delayed": case "At Risk": return "warning"; case "Referred": return "danger"; default: return "info"; }
}
export function phototherapyStatusTone(s: PhototherapyStatus): "success" | "warning" | "danger" | "info" {
  switch (s) { case "Not Required": case "Completed": return "success"; case "Active": return "warning"; case "Paused": return "info"; default: return "info"; }
}
export function admissionStatusTone(s: AdmissionStatus): "success" | "warning" | "danger" | "info" {
  switch (s) { case "Discharged": return "success"; case "Admitted": case "Monitoring": return "warning"; case "Stable": return "info"; case "Critical": case "Referred": return "danger"; default: return "info"; }
}
export function riskLevelTone(r: RiskLevel): "success" | "warning" | "danger" | "info" {
  switch (r) { case "Low": return "success"; case "Moderate": return "warning"; case "High": case "Critical": return "danger"; default: return "info"; }
}
export function formatCurrency(n: number): string { return `Rs.${n.toLocaleString("en-IN")}`; }
