/* ── Dialysis Center Management — Data ─────────────────────────────────────── */

export type DialysisType = "Hemodialysis" | "Peritoneal Dialysis" | "CRRT";
export type MachineStatus = "Available" | "In Use" | "Maintenance" | "Out of Service" | "Cleaning";
export type ChairStatus = "Available" | "Occupied" | "Reserved" | "Cleaning" | "Out of Service";
export type TreatmentStatus = "Scheduled" | "In Progress" | "Completed" | "Cancelled" | "Missed" | "Postponed";
export type AccessType = "AV Fistula" | "AV Graft" | "Central Venous Catheter" | "Peritoneal Catheter";
export type AccessStatus = "Functional" | "Compromised" | "Infected" | "Thrombosed" | "Stenosis" | "Under Observation";
export type ComplicationType = "Hypotension" | "Hypertension" | "Muscle Cramp" | "Arrhythmia" | "Access Problem" | "Bleeding" | "Air Embolism" | "Nausea" | "Chest Pain" | "None";
export type ComplicationSeverity = "Mild" | "Moderate" | "Severe" | "Life-Threatening";
export type EnrollmentStatus = "Active" | "Inactive" | "Transferred" | "Deceased" | "Withdrawn";
export type AppointmentStatus = "Confirmed" | "Pending" | "Completed" | "Cancelled" | "Missed" | "Walked In";
export type MaintenanceType = "Preventive" | "Corrective" | "Calibration" | "Emergency" | "Annual";
export type MaintenanceStatus = "Scheduled" | "In Progress" | "Completed" | "Overdue";
export type WaterQualityStatus = "Normal" | "Warning" | "Critical" | "Out of Range";

export interface DialysisPatient {
  id: string; uhid: string; name: string; age: number; gender: "Male" | "Female";
  bloodGroup: string; phone: string; diagnosis: string; primaryNephrologist: string;
  dialysisType: DialysisType; enrollmentDate: string; status: EnrollmentStatus;
  dryWeight: number; currentWeight: number; accessType: AccessType; accessSite: string;
  insuranceProvider: string; insurancePolicyNo: string; comorbidities: string[];
  lastSessionDate?: string; totalSessions: number; missedSessions: number;
}

export const DIALYSIS_PATIENTS: DialysisPatient[] = [
  { id: "DP-001", uhid: "UHID-2026-001", name: "Ramesh Sharma", age: 62, gender: "Male", bloodGroup: "B+", phone: "+91 98765 43210", diagnosis: "ESRD — Diabetic Nephropathy", primaryNephrologist: "Dr. Arjun Mehta", dialysisType: "Hemodialysis", enrollmentDate: "2025-03-15", status: "Active", dryWeight: 68, currentWeight: 70.2, accessType: "AV Fistula", accessSite: "Left Forearm", insuranceProvider: "Star Health", insurancePolicyNo: "SH-2025-4567", comorbidities: ["Type 2 DM", "Hypertension", "Anemia"], lastSessionDate: "2026-07-22", totalSessions: 156, missedSessions: 8 },
  { id: "DP-002", uhid: "UHID-2026-002", name: "Sunita Devi", age: 55, gender: "Female", bloodGroup: "A+", phone: "+91 87654 32109", diagnosis: "ESRD — Chronic Glomerulonephritis", primaryNephrologist: "Dr. Arjun Mehta", dialysisType: "Hemodialysis", enrollmentDate: "2025-06-20", status: "Active", dryWeight: 55, currentWeight: 56.8, accessType: "AV Fistula", accessSite: "Left Forearm", insuranceProvider: "ICICI Lombard", insurancePolicyNo: "IL-2025-7890", comorbidities: ["Hypertension"], lastSessionDate: "2026-07-23", totalSessions: 120, missedSessions: 5 },
  { id: "DP-003", uhid: "UHID-2026-003", name: "Vikram Patel", age: 48, gender: "Male", bloodGroup: "O-", phone: "+91 76543 21098", diagnosis: "ESRD — Polycystic Kidney Disease", primaryNephrologist: "Dr. Priya Nair", dialysisType: "Peritoneal Dialysis", enrollmentDate: "2025-09-10", status: "Active", dryWeight: 75, currentWeight: 76.1, accessType: "Peritoneal Catheter", accessSite: "Abdomen", insuranceProvider: "New India Assurance", insurancePolicyNo: "NIA-2025-1234", comorbidities: ["Hypertension", "Anemia"], lastSessionDate: "2026-07-23", totalSessions: 89, missedSessions: 3 },
  { id: "DP-004", uhid: "UHID-2026-004", name: "Anita Kumari", age: 70, gender: "Female", bloodGroup: "AB+", phone: "+91 65432 10987", diagnosis: "ESRD — Hypertensive Nephrosclerosis", primaryNephrologist: "Dr. Priya Nair", dialysisType: "Hemodialysis", enrollmentDate: "2024-12-01", status: "Active", dryWeight: 52, currentWeight: 53.5, accessType: "Central Venous Catheter", accessSite: "Right Internal Jugular", insuranceProvider: "Bajaj Allianz", insurancePolicyNo: "BA-2024-5678", comorbidities: ["Hypertension", "CHF", "Anemia"], lastSessionDate: "2026-07-21", totalSessions: 195, missedSessions: 12 },
  { id: "DP-005", uhid: "UHID-2026-005", name: "Mohammed Ali", age: 45, gender: "Male", bloodGroup: "B-", phone: "+91 54321 09876", diagnosis: "ESRD — IgA Nephropathy", primaryNephrologist: "Dr. Arjun Mehta", dialysisType: "Hemodialysis", enrollmentDate: "2025-11-05", status: "Active", dryWeight: 72, currentWeight: 73.4, accessType: "AV Fistula", accessSite: "Right Forearm", insuranceProvider: "Reliance General", insurancePolicyNo: "RG-2025-9012", comorbidities: ["Anemia"], lastSessionDate: "2026-07-23", totalSessions: 67, missedSessions: 2 },
  { id: "DP-006", uhid: "UHID-2026-006", name: "Kamala Devi", age: 58, gender: "Female", bloodGroup: "O+", phone: "+91 43210 98765", diagnosis: "ESRD — Diabetic Nephropathy", primaryNephrologist: "Dr. Priya Nair", dialysisType: "Hemodialysis", enrollmentDate: "2025-01-20", status: "Active", dryWeight: 58, currentWeight: 59.8, accessType: "AV Graft", accessSite: "Left Forearm", insuranceProvider: "United India", insurancePolicyNo: "UI-2025-3456", comorbidities: ["Type 2 DM", "Hypertension"], lastSessionDate: "2026-07-22", totalSessions: 142, missedSessions: 7 },
];

export interface DialysisMachine {
  id: string; name: string; model: string; manufacturer: string;
  status: MachineStatus; currentPatient?: string; chairId: string;
  lastCalibration: string; nextCalibration: string;
  totalHours: number; sessionsCompleted: number;
  lastMaintenance: string; nextMaintenance: string;
  disinfectionStatus: string; error?: string;
}

export const MACHINES: DialysisMachine[] = [
  { id: "DM-001", name: "Fresenius 5008S", model: "5008S", manufacturer: "Fresenius Medical Care", status: "In Use", currentPatient: "DP-001", chairId: "CH-01", lastCalibration: "2026-07-01", nextCalibration: "2026-10-01", totalHours: 4520, sessionsCompleted: 680, lastMaintenance: "2026-06-15", nextMaintenance: "2026-09-15", disinfectionStatus: "Completed" },
  { id: "DM-002", name: "Fresenius 5008S", model: "5008S", manufacturer: "Fresenius Medical Care", status: "In Use", currentPatient: "DP-002", chairId: "CH-02", lastCalibration: "2026-07-01", nextCalibration: "2026-10-01", totalHours: 3890, sessionsCompleted: 590, lastMaintenance: "2026-06-15", nextMaintenance: "2026-09-15", disinfectionStatus: "Completed" },
  { id: "DM-003", name: "Nipro Surdial X", model: "Surdial X", manufacturer: "Nipro", status: "Available", chairId: "CH-03", lastCalibration: "2026-07-10", nextCalibration: "2026-10-10", totalHours: 2100, sessionsCompleted: 320, lastMaintenance: "2026-07-01", nextMaintenance: "2026-10-01", disinfectionStatus: "Completed" },
  { id: "DM-004", name: "Baxter Prismaflex", model: "Prismaflex", manufacturer: "Baxter", status: "Available", chairId: "CH-04", lastCalibration: "2026-07-05", nextCalibration: "2026-10-05", totalHours: 1800, sessionsCompleted: 270, lastMaintenance: "2026-06-20", nextMaintenance: "2026-09-20", disinfectionStatus: "Completed" },
  { id: "DM-005", name: "Fresenius 5008S", model: "5008S", manufacturer: "Fresenius Medical Care", status: "Maintenance", error: "Blood leak detector calibration due", chairId: "CH-05", lastCalibration: "2026-04-01", nextCalibration: "2026-07-01", totalHours: 5200, sessionsCompleted: 790, lastMaintenance: "2026-07-20", nextMaintenance: "2026-07-25", disinfectionStatus: "Pending" },
  { id: "DM-006", name: "Nipro Surdial X", model: "Surdial X", manufacturer: "Nipro", status: "Cleaning", chairId: "CH-06", lastCalibration: "2026-07-15", nextCalibration: "2026-10-15", totalHours: 1200, sessionsCompleted: 180, lastMaintenance: "2026-07-10", nextMaintenance: "2026-10-10", disinfectionStatus: "In Progress" },
  { id: "DM-007", name: "Baxter AK 98", model: "AK 98", manufacturer: "Baxter", status: "Out of Service", error: "Major service required — pump replacement", chairId: "CH-07", lastCalibration: "2026-03-01", nextCalibration: "2026-06-01", totalHours: 6100, sessionsCompleted: 920, lastMaintenance: "2026-03-15", nextMaintenance: "2026-06-15", disinfectionStatus: "N/A" },
  { id: "DM-008", name: "Fresenius 5008A", model: "5008A", manufacturer: "Fresenius Medical Care", status: "Available", chairId: "CH-08", lastCalibration: "2026-07-20", nextCalibration: "2026-10-20", totalHours: 900, sessionsCompleted: 135, lastMaintenance: "2026-07-15", nextMaintenance: "2026-10-15", disinfectionStatus: "Completed" },
];

export interface TreatmentPlan {
  id: string; patientId: string; patientName: string;
  dialysisType: DialysisType; frequency: string; sessionDuration: number;
  dialyzerType: string; bloodFlowRate: number; dialysateFlowRate: number;
  dryWeight: number; targetUltrafiltration: number;
  anticoagulation: string; anticoagulationDose: string;
  medications: { name: string; dose: string; frequency: string }[];
  dietaryRecommendations: string; prescribedBy: string;
  startDate: string; reviewDate: string; status: string;
}

export const TREATMENT_PLANS: TreatmentPlan[] = [
  { id: "TP-001", patientId: "DP-001", patientName: "Ramesh Sharma", dialysisType: "Hemodialysis", frequency: "3x/week (Mon, Wed, Fri)", sessionDuration: 240, dialyzerType: "Fresenius FX 80", bloodFlowRate: 300, dialysateFlowRate: 500, dryWeight: 68, targetUltrafiltration: 2.2, anticoagulation: "Heparin", anticoagulationDose: "5000 IU bolus + 1000 IU/hr", medications: [{ name: "Erythropoietin", dose: "4000 IU", frequency: "3x/week" }, { name: "Iron Sucrose", dose: "100mg", frequency: "Weekly" }, { name: "Calcium Carbonate", dose: "500mg", frequency: "TID" }, { name: "Sevelamer", dose: "800mg", frequency: "TID with meals" }], dietaryRecommendations: "Low potassium, low phosphorus, fluid restriction 1L/day", prescribedBy: "Dr. Arjun Mehta", startDate: "2025-03-15", reviewDate: "2026-09-15", status: "Active" },
  { id: "TP-002", patientId: "DP-002", patientName: "Sunita Devi", dialysisType: "Hemodialysis", frequency: "3x/week (Tue, Thu, Sat)", sessionDuration: 240, dialyzerType: "Nipro EXCEL", bloodFlowRate: 280, dialysateFlowRate: 500, dryWeight: 55, targetUltrafiltration: 1.8, anticoagulation: "Heparin", anticoagulationDose: "4000 IU bolus + 800 IU/hr", medications: [{ name: "Erythropoietin", dose: "3000 IU", frequency: "3x/week" }, { name: "Iron Sucrose", dose: "100mg", frequency: "Bi-weekly" }, { name: "Amlodipine", dose: "5mg", frequency: "OD" }], dietaryRecommendations: "Low potassium, fluid restriction 800mL/day", prescribedBy: "Dr. Arjun Mehta", startDate: "2025-06-20", reviewDate: "2026-12-20", status: "Active" },
  { id: "TP-003", patientId: "DP-003", patientName: "Vikram Patel", dialysisType: "Peritoneal Dialysis", frequency: "CAPD 4 exchanges/day", sessionDuration: 30, dialyzerType: "N/A — CAPD", bloodFlowRate: 0, dialysateFlowRate: 0, dryWeight: 75, targetUltrafiltration: 1.5, anticoagulation: "None", anticoagulationDose: "N/A", medications: [{ name: "Erythropoietin", dose: "4000 IU", frequency: "Weekly (SC)" }, { name: "Calcium Carbonate", dose: "500mg", frequency: "TID" }], dietaryRecommendations: "High protein diet, low sodium, fluid restriction 1.5L/day", prescribedBy: "Dr. Priya Nair", startDate: "2025-09-10", reviewDate: "2026-03-10", status: "Active" },
];

export interface Appointment {
  id: string; patientId: string; patientName: string;
  date: string; time: string; duration: number;
  machineId?: string; chairId?: string;
  nephrologist: string; nurse: string;
  status: AppointmentStatus; type: DialysisType;
  notes?: string;
}

export const APPOINTMENTS: Appointment[] = [
  { id: "APT-001", patientId: "DP-001", patientName: "Ramesh Sharma", date: "2026-07-24", time: "08:00", duration: 240, machineId: "DM-001", chairId: "CH-01", nephrologist: "Dr. Arjun Mehta", nurse: "Nurse Lakshmi", status: "Confirmed", type: "Hemodialysis" },
  { id: "APT-002", patientId: "DP-002", patientName: "Sunita Devi", date: "2026-07-24", time: "08:00", duration: 240, machineId: "DM-002", chairId: "CH-02", nephrologist: "Dr. Arjun Mehta", nurse: "Nurse Priya", status: "Confirmed", type: "Hemodialysis" },
  { id: "APT-003", patientId: "DP-005", patientName: "Mohammed Ali", date: "2026-07-24", time: "08:00", duration: 240, machineId: "DM-003", chairId: "CH-03", nephrologist: "Dr. Arjun Mehta", nurse: "Nurse Lakshmi", status: "Confirmed", type: "Hemodialysis" },
  { id: "APT-004", patientId: "DP-004", patientName: "Anita Kumari", date: "2026-07-24", time: "13:00", duration: 240, machineId: "DM-004", chairId: "CH-04", nephrologist: "Dr. Priya Nair", nurse: "Nurse Priya", status: "Confirmed", type: "Hemodialysis" },
  { id: "APT-005", patientId: "DP-006", patientName: "Kamala Devi", date: "2026-07-24", time: "13:00", duration: 240, machineId: "DM-008", chairId: "CH-08", nephrologist: "Dr. Priya Nair", nurse: "Nurse Lakshmi", status: "Confirmed", type: "Hemodialysis" },
  { id: "APT-006", patientId: "DP-001", patientName: "Ramesh Sharma", date: "2026-07-26", time: "08:00", duration: 240, nephrologist: "Dr. Arjun Mehta", nurse: "Nurse Lakshmi", status: "Confirmed", type: "Hemodialysis" },
  { id: "APT-007", patientId: "DP-002", patientName: "Sunita Devi", date: "2026-07-26", time: "08:00", duration: 240, nephrologist: "Dr. Arjun Mehta", nurse: "Nurse Priya", status: "Pending", type: "Hemodialysis" },
  { id: "APT-008", patientId: "DP-003", patientName: "Vikram Patel", date: "2026-07-24", time: "09:00", duration: 30, nephrologist: "Dr. Priya Nair", nurse: "Nurse Priya", status: "Completed", type: "Peritoneal Dialysis" },
];

export interface TreatmentSession {
  id: string; patientId: string; patientName: string;
  appointmentId: string; machineId: string; chairId: string;
  date: string; startTime: string; endTime?: string;
  status: TreatmentStatus; preWeight: number; postWeight?: number;
  ultrafiltration: number; targetUF: number;
  bloodFlowRate: number; dialysateFlowRate: number;
  venousPressure: number; arterialPressure: number; tmp: number;
  complications: ComplicationType[];
  ktV?: number; urr?: number;
  nurse: string; nephrologist: string;
  sessionNotes?: string;
}

export const TREATMENT_SESSIONS: TreatmentSession[] = [
  { id: "TS-001", patientId: "DP-001", patientName: "Ramesh Sharma", appointmentId: "APT-001", machineId: "DM-001", chairId: "CH-01", date: "2026-07-22", startTime: "08:00", endTime: "12:00", status: "Completed", preWeight: 70.2, postWeight: 68.1, ultrafiltration: 2.1, targetUF: 2.2, bloodFlowRate: 300, dialysateFlowRate: 500, venousPressure: 180, arterialPressure: -220, tmp: 45, complications: ["None"], ktV: 1.4, urr: 72, nurse: "Nurse Lakshmi", nephrologist: "Dr. Arjun Mehta", sessionNotes: "Uncomplicated session. Patient tolerated well." },
  { id: "TS-002", patientId: "DP-002", patientName: "Sunita Devi", appointmentId: "APT-002", machineId: "DM-002", chairId: "CH-02", date: "2026-07-23", startTime: "08:00", endTime: "12:00", status: "Completed", preWeight: 56.8, postWeight: 55.1, ultrafiltration: 1.7, targetUF: 1.8, bloodFlowRate: 280, dialysateFlowRate: 500, venousPressure: 160, arterialPressure: -200, tmp: 40, complications: ["Hypotension"], ktV: 1.3, urr: 68, nurse: "Nurse Priya", nephrologist: "Dr. Arjun Mehta", sessionNotes: "Mild hypotension at 2hr mark — responded to fluid bolus." },
  { id: "TS-003", patientId: "DP-005", patientName: "Mohammed Ali", appointmentId: "APT-003", machineId: "DM-003", chairId: "CH-03", date: "2026-07-23", startTime: "08:00", status: "In Progress", preWeight: 73.4, ultrafiltration: 0.8, targetUF: 1.4, bloodFlowRate: 300, dialysateFlowRate: 500, venousPressure: 170, arterialPressure: -210, tmp: 42, complications: ["None"], nurse: "Nurse Lakshmi", nephrologist: "Dr. Arjun Mehta" },
];

export interface PreDialysisAssessment {
  id: string; patientId: string; patientName: string;
  assessmentDate: string; weight: number; bpSystolic: number; bpDiastolic: number;
  heartRate: number; respiratoryRate: number; temperature: number;
  edema: "None" | "Mild" | "Moderate" | "Severe";
  accessAssessment: string; accessPulse: string;
  labReview: string; readinessStatus: "Ready" | "Conditional" | "Not Ready";
  assessedBy: string; notes: string;
}

export const PRE_DIALYSIS_ASSESSMENTS: PreDialysisAssessment[] = [
  { id: "PDA-001", patientId: "DP-001", patientName: "Ramesh Sharma", assessmentDate: "2026-07-24T07:30:00", weight: 70.2, bpSystolic: 145, bpDiastolic: 88, heartRate: 78, respiratoryRate: 18, temperature: 98.4, edema: "Mild", accessAssessment: "AV Fistula — thrill palpable, no erythema", accessPulse: "Strong thrill", labReview: "K+ 5.2, Hb 10.2, BUN 65 — within range", readinessStatus: "Ready", assessedBy: "Nurse Lakshmi", notes: "Patient well hydrated. Ready for dialysis." },
  { id: "PDA-002", patientId: "DP-002", patientName: "Sunita Devi", assessmentDate: "2026-07-24T07:45:00", weight: 56.8, bpSystolic: 155, bpDiastolic: 92, heartRate: 82, respiratoryRate: 20, temperature: 98.2, edema: "Mild", accessAssessment: "AV Fistula — thrill palpable, bruit audible", accessPulse: "Good thrill", labReview: "K+ 4.8, Hb 9.8, BUN 58 — within range", readinessStatus: "Ready", assessedBy: "Nurse Priya", notes: "BP slightly elevated — monitor during session." },
  { id: "PDA-003", patientId: "DP-005", patientName: "Mohammed Ali", assessmentDate: "2026-07-24T07:30:00", weight: 73.4, bpSystolic: 138, bpDiastolic: 82, heartRate: 74, respiratoryRate: 16, temperature: 98.6, edema: "None", accessAssessment: "AV Fistula — excellent thrill, no complications", accessPulse: "Strong thrill", labReview: "K+ 4.5, Hb 11.0, BUN 52 — within range", readinessStatus: "Ready", assessedBy: "Nurse Lakshmi", notes: "Excellent access. Ready for treatment." },
];

export interface MedicationRecord {
  id: string; patientId: string; patientName: string;
  sessionId: string; date: string;
  medications: { name: string; dose: string; route: string; time: string; administeredBy: string; verified: boolean }[];
}

export const MEDICATION_RECORDS: MedicationRecord[] = [
  { id: "MED-001", patientId: "DP-001", patientName: "Ramesh Sharma", sessionId: "TS-001", date: "2026-07-22", medications: [
    { name: "Heparin", dose: "5000 IU", route: "IV Bolus", time: "08:00", administeredBy: "Nurse Lakshmi", verified: true },
    { name: "Heparin", dose: "1000 IU/hr", route: "IV Infusion", time: "08:00", administeredBy: "Nurse Lakshmi", verified: true },
    { name: "Erythropoietin", dose: "4000 IU", route: "SC", time: "11:30", administeredBy: "Nurse Lakshmi", verified: true },
    { name: "Iron Sucrose", dose: "100mg", route: "IV", time: "11:30", administeredBy: "Nurse Lakshmi", verified: true },
  ]},
  { id: "MED-002", patientId: "DP-002", patientName: "Sunita Devi", sessionId: "TS-002", date: "2026-07-23", medications: [
    { name: "Heparin", dose: "4000 IU", route: "IV Bolus", time: "08:00", administeredBy: "Nurse Priya", verified: true },
    { name: "Heparin", dose: "800 IU/hr", route: "IV Infusion", time: "08:00", administeredBy: "Nurse Priya", verified: true },
    { name: "Amlodipine", dose: "5mg", route: "PO", time: "08:30", administeredBy: "Nurse Priya", verified: true },
  ]},
];

export interface LabResult {
  id: string; patientId: string; patientName: string;
  testDate: string; creatinine: number; bun: number;
  potassium: number; sodium: number; hemoglobin: number;
  calcium: number; phosphate: number; albumin: number;
  ph: number; bicarbonate: number;
  ktV?: number; urr?: number;
  criticalAlerts: string[];
}

export const LAB_RESULTS: LabResult[] = [
  { id: "LR-001", patientId: "DP-001", patientName: "Ramesh Sharma", testDate: "2026-07-22", creatinine: 8.2, bun: 65, potassium: 5.2, sodium: 138, hemoglobin: 10.2, calcium: 9.1, phosphate: 5.8, albumin: 3.8, ph: 7.35, bicarbonate: 22, ktV: 1.4, urr: 72, criticalAlerts: ["Potassium slightly elevated"] },
  { id: "LR-002", patientId: "DP-002", patientName: "Sunita Devi", testDate: "2026-07-23", creatinine: 7.5, bun: 58, potassium: 4.8, sodium: 140, hemoglobin: 9.8, calcium: 8.8, phosphate: 5.2, albumin: 3.6, ph: 7.32, bicarbonate: 21, ktV: 1.3, urr: 68, criticalAlerts: [] },
  { id: "LR-003", patientId: "DP-003", patientName: "Vikram Patel", testDate: "2026-07-20", creatinine: 6.8, bun: 52, potassium: 4.5, sodium: 142, hemoglobin: 10.5, calcium: 9.3, phosphate: 4.8, albumin: 3.9, ph: 7.38, bicarbonate: 24, criticalAlerts: [] },
  { id: "LR-004", patientId: "DP-004", patientName: "Anita Kumari", testDate: "2026-07-21", creatinine: 9.1, bun: 72, potassium: 5.8, sodium: 136, hemoglobin: 8.5, calcium: 8.5, phosphate: 6.2, albumin: 3.2, ph: 7.28, bicarbonate: 19, ktV: 1.1, urr: 55, criticalAlerts: ["Potassium HIGH", "Phosphate HIGH", "Albumin LOW", "KtV below target"] },
];

export interface VascularAccess {
  id: string; patientId: string; patientName: string;
  accessType: AccessType; accessSite: string; creationDate: string;
  status: AccessStatus; flowRate: number;
  lastAssessment: string; complications: string[];
  interventions: string[];
}

export const VASCULAR_ACCESSES: VascularAccess[] = [
  { id: "VA-001", patientId: "DP-001", patientName: "Ramesh Sharma", accessType: "AV Fistula", accessSite: "Left Forearm", creationDate: "2024-12-15", status: "Functional", flowRate: 450, lastAssessment: "2026-07-22", complications: [], interventions: [] },
  { id: "VA-002", patientId: "DP-002", patientName: "Sunita Devi", accessType: "AV Fistula", accessSite: "Left Forearm", creationDate: "2025-03-20", status: "Functional", flowRate: 420, lastAssessment: "2026-07-23", complications: [], interventions: [] },
  { id: "VA-003", patientId: "DP-003", patientName: "Vikram Patel", accessType: "Peritoneal Catheter", accessSite: "Abdomen", creationDate: "2025-08-10", status: "Functional", flowRate: 0, lastAssessment: "2026-07-20", complications: [], interventions: [] },
  { id: "VA-004", patientId: "DP-004", patientName: "Anita Kumari", accessType: "Central Venous Catheter", accessSite: "Right Internal Jugular", creationDate: "2025-06-01", status: "Under Observation", flowRate: 300, lastAssessment: "2026-07-21", complications: ["Mild erythema at exit site"], interventions: ["Antibiotic ointment applied"] },
  { id: "VA-005", patientId: "DP-005", patientName: "Mohammed Ali", accessType: "AV Fistula", accessSite: "Right Forearm", creationDate: "2025-08-05", status: "Functional", flowRate: 480, lastAssessment: "2026-07-23", complications: [], interventions: [] },
  { id: "VA-006", patientId: "DP-006", patientName: "Kamala Devi", accessType: "AV Graft", accessSite: "Left Forearm", creationDate: "2024-10-20", status: "Functional", flowRate: 400, lastAssessment: "2026-07-22", complications: [], interventions: [] },
];

export interface MachineMaintenanceRecord {
  id: string; machineId: string; machineName: string;
  type: MaintenanceType; description: string;
  scheduledDate: string; completedDate?: string;
  status: MaintenanceStatus; technician: string;
  cost: number; notes: string;
}

export const MACHINE_MAINTENANCE: MachineMaintenanceRecord[] = [
  { id: "MM-001", machineId: "DM-005", machineName: "Fresenius 5008S (DM-005)", type: "Preventive", description: "Blood leak detector calibration", scheduledDate: "2026-07-25", status: "Scheduled", technician: "Biomedical Team", cost: 5000, notes: "Scheduled quarterly calibration" },
  { id: "MM-002", machineId: "DM-007", machineName: "Baxter AK 98 (DM-007)", type: "Corrective", description: "Major service — pump replacement", scheduledDate: "2026-07-28", status: "Scheduled", technician: "Baxter Service", cost: 45000, notes: "Vendor service engineer visiting" },
  { id: "MM-003", machineId: "DM-001", machineName: "Fresenius 5008S (DM-001)", type: "Preventive", description: "Quarterly PM — all systems check", scheduledDate: "2026-06-15", completedDate: "2026-06-15", status: "Completed", technician: "Biomedical Team", cost: 8000, notes: "All parameters normal" },
  { id: "MM-004", machineId: "DM-002", machineName: "Fresenius 5008S (DM-002)", type: "Calibration", description: "Annual calibration — pressure sensors", scheduledDate: "2026-07-01", completedDate: "2026-07-01", status: "Completed", technician: "Fresenius Service", cost: 12000, notes: "Calibrated successfully" },
];

export interface Consumable {
  id: string; name: string; category: string;
  stock: number; minStock: number; unit: string;
  batchNumber: string; expiryDate: string;
  supplier: string; cost: number;
}

export const CONSUMABLES: Consumable[] = [
  { id: "CON-001", name: "Fresenius FX 80 Dialyzer", category: "Dialyzer", stock: 24, minStock: 10, unit: "pieces", batchNumber: "BAT-FX80-001", expiryDate: "2027-06-30", supplier: "Fresenius Medical Care", cost: 2500 },
  { id: "CON-002", name: "Nipro EXCEL Dialyzer", category: "Dialyzer", stock: 18, minStock: 10, unit: "pieces", batchNumber: "BAT-NE-001", expiryDate: "2027-03-31", supplier: "Nipro", cost: 2200 },
  { id: "CON-003", name: "Blood Tubing Set", category: "Tubing", stock: 45, minStock: 20, unit: "pieces", batchNumber: "BAT-BTS-001", expiryDate: "2027-09-30", supplier: "Fresenius Medical Care", cost: 350 },
  { id: "CON-004", name: "Heparin Sodium 5000 IU", category: "Anticoagulant", stock: 120, minStock: 50, unit: "vials", batchNumber: "BAT-HEP-001", expiryDate: "2027-12-31", supplier: "Gland Pharma", cost: 45 },
  { id: "CON-005", name: "Dialysis Needles 15G", category: "Needles", stock: 200, minStock: 100, unit: "pieces", batchNumber: "BAT-DN-001", expiryDate: "2027-08-31", supplier: "B. Braun", cost: 15 },
  { id: "CON-006", name: "Normal Saline 0.9% 500mL", category: "Fluid", stock: 80, minStock: 40, unit: "bottles", batchNumber: "BAT-NS-001", expiryDate: "2027-06-30", supplier: "Baxter", cost: 25 },
  { id: "CON-007", name: "Dialysate concentrate (Acid)", category: "Dialysate", stock: 15, minStock: 8, unit: "containers", batchNumber: "BAT-DC-001", expiryDate: "2027-10-31", supplier: "Fresenius Medical Care", cost: 1200 },
  { id: "CON-008", name: "Dialysate concentrate (Bicarb)", category: "Dialysate", stock: 15, minStock: 8, unit: "containers", batchNumber: "BAT-DB-001", expiryDate: "2027-10-31", supplier: "Fresenius Medical Care", cost: 800 },
  { id: "CON-009", name: "Erythropoietin 4000 IU", category: "Medication", stock: 60, minStock: 30, unit: "vials", batchNumber: "BAT-EPO-001", expiryDate: "2027-05-31", supplier: "Dr. Reddy's", cost: 350 },
  { id: "CON-010", name: "Iron Sucrose 100mg", category: "Medication", stock: 40, minStock: 20, unit: "vials", batchNumber: "BAT-IS-001", expiryDate: "2027-09-30", supplier: "Sun Pharma", cost: 85 },
];

export interface WaterQualityLog {
  id: string; date: string; roPermeateConductivity: number;
  dialysateConductivity: number; endotoxin: number;
  chlorineResidual: number; pH: number; hardness: number;
  status: WaterQualityStatus; testedBy: string; notes: string;
}

export const WATER_QUALITY: WaterQualityLog[] = [
  { id: "WQ-001", date: "2026-07-23", roPermeateConductivity: 5.2, dialysateConductivity: 13.8, endotoxin: 0.12, chlorineResidual: 0, pH: 7.0, hardness: 0, status: "Normal", testedBy: "Tech. Rajesh", notes: "All parameters within limits" },
  { id: "WQ-002", date: "2026-07-22", roPermeateConductivity: 5.0, dialysateConductivity: 13.5, endotoxin: 0.10, chlorineResidual: 0, pH: 7.1, hardness: 0, status: "Normal", testedBy: "Tech. Rajesh", notes: "All parameters within limits" },
  { id: "WQ-003", date: "2026-07-21", roPermeateConductivity: 8.5, dialysateConductivity: 15.2, endotoxin: 0.15, chlorineResidual: 0, pH: 6.8, hardness: 2, status: "Warning", testedBy: "Tech. Rajesh", notes: "RO permeate conductivity elevated — membrane inspection scheduled" },
];

export interface QualityRecord {
  id: string; testType: string; testDate: string;
  result: "Pass" | "Fail" | "Pending";
  performedBy: string; verifiedBy: string; notes: string;
  nextDue: string; capaRequired: boolean;
}

export const QUALITY_RECORDS: QualityRecord[] = [
  { id: "QR-001", testType: "Water Quality — Daily", testDate: "2026-07-23", result: "Pass", performedBy: "Tech. Rajesh", verifiedBy: "Dr. Arjun Mehta", notes: "RO permeate conductivity 5.2 µS/cm", nextDue: "2026-07-24", capaRequired: false },
  { id: "QR-002", testType: "Machine Disinfection — DM-001", testDate: "2026-07-23", result: "Pass", performedBy: "Tech. Rajesh", verifiedBy: "Dr. Arjun Mehta", notes: "Citric acid disinfection completed", nextDue: "2026-07-24", capaRequired: false },
  { id: "QR-003", testType: "Machine Disinfection — DM-002", testDate: "2026-07-23", result: "Pass", performedBy: "Tech. Rajesh", verifiedBy: "Dr. Arjun Mehta", notes: "Citric acid disinfection completed", nextDue: "2026-07-24", capaRequired: false },
  { id: "QR-004", testType: "Endotoxin Testing", testDate: "2026-07-20", result: "Pass", performedBy: "Tech. Anjali", verifiedBy: "Dr. Arjun Mehta", notes: "All samples < 0.25 EU/mL", nextDue: "2026-08-20", capaRequired: false },
  { id: "QR-005", testType: "RO Membrane Integrity", testDate: "2026-07-21", result: "Fail", performedBy: "Tech. Rajesh", verifiedBy: "Dr. Arjun Mehta", notes: "Conductivity elevated — membrane replacement recommended", nextDue: "2026-07-28", capaRequired: true },
];

export interface AuditLog {
  id: string; timestamp: string; user: string; action: string;
  resource: string; details: string; severity: "Info" | "Warning" | "Critical";
}

export const AUDIT_LOGS: AuditLog[] = [
  { id: "AUD-001", timestamp: "2026-07-23T08:00:00", user: "Nurse Lakshmi", action: "Treatment Started", resource: "TS-003", details: "Dialysis started — Mohammed Ali — DM-003 — CH-03", severity: "Info" },
  { id: "AUD-002", timestamp: "2026-07-23T07:45:00", user: "Nurse Priya", action: "Assessment Complete", resource: "PDA-002", details: "Pre-dialysis assessment — Sunita Devi — Ready", severity: "Info" },
  { id: "AUD-003", timestamp: "2026-07-23T07:30:00", user: "Nurse Lakshmi", action: "Assessment Complete", resource: "PDA-003", details: "Pre-dialysis assessment — Mohammed Ali — Ready", severity: "Info" },
  { id: "AUD-004", timestamp: "2026-07-22T12:00:00", user: "Nurse Lakshmi", action: "Treatment Completed", resource: "TS-001", details: "Dialysis completed — Ramesh Sharma — Kt/V 1.4 — UF 2.1L", severity: "Info" },
  { id: "AUD-005", timestamp: "2026-07-22T10:30:00", user: "Nurse Priya", action: "Complication", resource: "TS-002", details: "Hypotension — Sunita Devi — responded to fluid bolus", severity: "Warning" },
  { id: "AUD-006", timestamp: "2026-07-22T08:00:00", user: "Nurse Priya", action: "Treatment Started", resource: "TS-002", details: "Dialysis started — Sunita Devi — DM-002 — CH-02", severity: "Info" },
  { id: "AUD-007", timestamp: "2026-07-21T09:00:00", user: "Tech. Rajesh", action: "Water Quality Warning", resource: "WQ-003", details: "RO permeate conductivity elevated — 8.5 µS/cm", severity: "Warning" },
  { id: "AUD-008", timestamp: "2026-07-21T08:00:00", user: "Tech. Rajesh", action: "Machine Maintenance", resource: "MM-002", details: "Baxter AK 98 (DM-007) — Major service scheduled", severity: "Critical" },
];

/* ── Dialysis KPIs ────────────────────────────────────────────────────────── */
export const DIALYSIS_KPI = {
  totalPatients: 6,
  activePatients: 6,
  todaySessions: 5,
  activeTreatments: 1,
  completedToday: 2,
  missedToday: 0,
  availableMachines: 4,
  totalMachines: 8,
  availableChairs: 3,
  totalChairs: 8,
  avgKtV: 1.35,
  avgURR: 67,
  complicationRate: 5.2,
  missedSessionRate: 3.8,
  machineUtilization: 62.5,
  waterQualityCompliance: 96.7,
};

/* ── Helpers ──────────────────────────────────────────────────────────────── */
export function machineStatusTone(s: MachineStatus): "success" | "warning" | "danger" | "info" {
  switch (s) { case "Available": return "success"; case "In Use": return "info"; case "Cleaning": return "warning"; case "Maintenance": case "Out of Service": return "danger"; default: return "info"; }
}
export function chairStatusTone(s: ChairStatus): "success" | "warning" | "danger" | "info" {
  switch (s) { case "Available": return "success"; case "Occupied": case "Reserved": return "info"; case "Cleaning": return "warning"; case "Out of Service": return "danger"; default: return "info"; }
}
export function treatmentStatusTone(s: TreatmentStatus): "success" | "warning" | "danger" | "info" {
  switch (s) { case "Completed": return "success"; case "In Progress": return "info"; case "Scheduled": return "warning"; case "Cancelled": case "Missed": return "danger"; default: return "warning"; }
}
export function accessStatusTone(s: AccessStatus): "success" | "warning" | "danger" | "info" {
  switch (s) { case "Functional": return "success"; case "Under Observation": return "warning"; case "Compromised": case "Infected": case "Thrombosed": case "Stenosis": return "danger"; default: return "info"; }
}
export function appointmentStatusTone(s: AppointmentStatus): "success" | "warning" | "danger" | "info" {
  switch (s) { case "Confirmed": case "Completed": return "success"; case "Pending": return "warning"; case "Cancelled": case "Missed": return "danger"; case "Walked In": return "info"; default: return "info"; }
}
export function enrollmentStatusTone(s: EnrollmentStatus): "success" | "warning" | "danger" | "info" {
  switch (s) { case "Active": return "success"; case "Inactive": case "Withdrawn": return "warning"; case "Transferred": case "Deceased": return "danger"; default: return "info"; }
}
export function maintenanceStatusTone(s: MaintenanceStatus): "success" | "warning" | "danger" | "info" {
  switch (s) { case "Completed": return "success"; case "Scheduled": return "info"; case "In Progress": return "warning"; case "Overdue": return "danger"; default: return "info"; }
}
export function waterQualityTone(s: WaterQualityStatus): "success" | "warning" | "danger" | "info" {
  switch (s) { case "Normal": return "success"; case "Warning": return "warning"; case "Critical": case "Out of Range": return "danger"; default: return "info"; }
}
export function formatCurrency(n: number): string { return `Rs.${n.toLocaleString("en-IN")}`; }
