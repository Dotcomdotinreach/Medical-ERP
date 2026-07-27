/* ── Maternity, Obstetrics & Labor Room — Data ─────────────────────────────── */

export type RiskLevel = "Low" | "Moderate" | "High" | "Very High";
export type LaborStatus = "Not in Labor" | "Early Labor" | "Active Labor" | "Transition" | "Delivery" | "Postpartum";
export type DeliveryType = "Normal Vaginal" | "Assisted Vaginal" | "Vacuum" | "Forceps" | "Cesarean Section" | "Emergency Cesarean" | "None";
export type DeliveryOutcome = "Live Birth" | "Stillbirth" | "Miscarriage" | "None";
export type NICUStatus = "Not Required" | "Referred" | "Admitted" | "Discharged" | "Stabilized";
export type PostpartumStatus = "Recovery" | "Stable" | "Complication" | "Discharged";
export type ANCVisitStatus = "Completed" | "Scheduled" | "Missed" | "Cancelled";
export type PartographStatus = "Normal" | "Alert" | "Action Required" | "Not Started";
export type CTGClassification = "Normal" | "Suspicious" | "Pathological" | "Unsatisfactory";
export type Trimester = "First" | "Second" | "Third";

export interface Mother {
  id: string; uhid: string; name: string; age: number; phone: string;
  bloodGroup: string; gravida: number; para: number; abortions: number;
  livingChildren: number; lmp: string; edd: string; ancRegistered: boolean;
  riskLevel: RiskLevel; currentGestationalAge: string; currentWeight: number;
  bpSystolic: number; bpDiastolic: number; rhFactor: string;
  insuranceProvider: string; insurancePolicyNo: string;
  husbandName: string; emergencyContact: string;
  allergies: string[]; medicalHistory: string[];
  totalANCVisits: number; deliveryType?: DeliveryType; deliveryDate?: string;
  laborStatus: LaborStatus; roomAssignment?: string;
  status: string;
}

export const MOTHERS: Mother[] = [
  { id: "MTH-001", uhid: "UHID-M-001", name: "Priya Devi Sharma", age: 28, phone: "+91 98765 43210", bloodGroup: "B+", gravida: 2, para: 1, abortions: 0, livingChildren: 1, lmp: "2026-01-05", edd: "2026-10-12", ancRegistered: true, riskLevel: "Low", currentGestationalAge: "30w 2d", currentWeight: 68, bpSystolic: 118, bpDiastolic: 76, rhFactor: "Positive", insuranceProvider: "Star Health", insurancePolicyNo: "SH-M-001", husbandName: "Rajesh Sharma", emergencyContact: "+91 98765 43211", allergies: ["None"], medicalHistory: [], totalANCVisits: 8, laborStatus: "Not in Labor", status: "Active" },
  { id: "MTH-002", uhid: "UHID-M-002", name: "Anita Patel", age: 32, phone: "+91 87654 32109", bloodGroup: "A+", gravida: 3, para: 2, abortions: 0, livingChildren: 2, lmp: "2026-02-10", edd: "2026-11-16", ancRegistered: true, riskLevel: "Moderate", currentGestationalAge: "24w 6d", currentWeight: 72, bpSystolic: 128, bpDiastolic: 84, rhFactor: "Positive", insuranceProvider: "ICICI Lombard", insurancePolicyNo: "IL-M-002", husbandName: "Vikram Patel", emergencyContact: "+91 87654 32110", allergies: ["Penicillin"], medicalHistory: ["GDM in previous pregnancy"], totalANCVisits: 6, laborStatus: "Not in Labor", status: "Active" },
  { id: "MTH-003", uhid: "UHID-M-003", name: "Sunita Kumari", age: 22, phone: "+91 76543 21098", bloodGroup: "O-", gravida: 1, para: 0, abortions: 0, livingChildren: 0, lmp: "2025-12-20", edd: "2026-09-27", ancRegistered: true, riskLevel: "High", currentGestationalAge: "32w 5d", currentWeight: 62, bpSystolic: 142, bpDiastolic: 92, rhFactor: "Negative", insuranceProvider: "New India Assurance", insurancePolicyNo: "NIA-M-003", husbandName: "Amit Kumar", emergencyContact: "+91 76543 21099", allergies: ["None"], medicalHistory: ["PIH — current pregnancy", "Rh negative"], totalANCVisits: 10, laborStatus: "Not in Labor", status: "Active" },
  { id: "MTH-004", uhid: "UHID-M-004", name: "Kavitha Reddy", age: 35, phone: "+91 65432 10987", bloodGroup: "AB+", gravida: 4, para: 3, abortions: 0, livingChildren: 3, lmp: "2026-03-01", edd: "2026-12-06", ancRegistered: true, riskLevel: "Moderate", currentGestationalAge: "21w 2d", currentWeight: 75, bpSystolic: 122, bpDiastolic: 80, rhFactor: "Positive", insuranceProvider: "Bajaj Allianz", insurancePolicyNo: "BA-M-004", husbandName: "Suresh Reddy", emergencyContact: "+91 65432 10988", allergies: ["None"], medicalHistory: ["Previous LSCS"], totalANCVisits: 5, laborStatus: "Not in Labor", status: "Active" },
  { id: "MTH-005", uhid: "UHID-M-005", name: "Meena Singh", age: 29, phone: "+91 54321 09876", bloodGroup: "B-", gravida: 1, para: 0, abortions: 1, livingChildren: 0, lmp: "2026-04-15", edd: "2027-01-20", ancRegistered: true, riskLevel: "Low", currentGestationalAge: "14w 3d", currentWeight: 58, bpSystolic: 112, bpDiastolic: 72, rhFactor: "Negative", insuranceProvider: "United India", insurancePolicyNo: "UI-M-005", husbandName: "Deepak Singh", emergencyContact: "+91 54321 09877", allergies: ["None"], medicalHistory: ["Previous missed abortion"], totalANCVisits: 3, laborStatus: "Not in Labor", status: "Active" },
  { id: "MTH-006", uhid: "UHID-M-006", name: "Lakshmi Nair", age: 26, phone: "+91 43210 98765", bloodGroup: "O+", gravida: 1, para: 0, abortions: 0, livingChildren: 0, lmp: "2026-05-10", edd: "2027-02-15", ancRegistered: true, riskLevel: "Low", currentGestationalAge: "10w 4d", currentWeight: 55, bpSystolic: 108, bpDiastolic: 68, rhFactor: "Positive", insuranceProvider: "Reliance General", insurancePolicyNo: "RG-M-006", husbandName: "Arun Nair", emergencyContact: "+91 43210 98766", allergies: ["None"], medicalHistory: [], totalANCVisits: 2, laborStatus: "Not in Labor", status: "Active" },
  { id: "MTH-007", uhid: "UHID-M-007", name: "Fatima Begum", age: 38, phone: "+91 32109 87654", bloodGroup: "A-", gravida: 5, para: 4, abortions: 0, livingChildren: 4, lmp: "2026-06-01", edd: "2027-03-08", ancRegistered: true, riskLevel: "High", currentGestationalAge: "8w 0d", currentWeight: 70, bpSystolic: 135, bpDiastolic: 88, rhFactor: "Negative", insuranceProvider: "Star Health", insurancePolicyNo: "SH-M-007", husbandName: "Ahmed Begum", emergencyContact: "+91 32109 87655", allergies: ["Sulfa drugs"], medicalHistory: ["Chronic Hypertension", "Previous pre-eclampsia", "Rh negative"], totalANCVisits: 1, laborStatus: "Not in Labor", status: "Active" },
  { id: "MTH-008", uhid: "UHID-M-008", name: "Geeta Joshi", age: 30, phone: "+91 21098 76543", bloodGroup: "B+", gravida: 2, para: 1, abortions: 0, livingChildren: 1, lmp: "2025-11-01", edd: "2026-08-07", ancRegistered: true, riskLevel: "Very High", currentGestationalAge: "37w 1d", currentWeight: 78, bpSystolic: 152, bpDiastolic: 98, rhFactor: "Positive", insuranceProvider: "New India Assurance", insurancePolicyNo: "NIA-M-008", husbandName: "Mohan Joshi", emergencyContact: "+91 21098 76544", allergies: ["None"], medicalHistory: ["PIH", "GDM", "Previous LSCS"], totalANCVisits: 12, laborStatus: "Active Labor", roomAssignment: "LR-01", status: "In Labor" },
];

export interface ANCV {
  id: string; motherId: string; motherName: string; visitNumber: number;
  visitDate: string; gestationalAge: string; weight: number;
  bpSystolic: number; bpDiastolic: number; fundalHeight: number;
  fetalHeartRate: number; presentation: string; edema: string;
  urineProtein: string; urineSugar: string; hb: number;
  medications: string[]; vaccinations: string[]; supplements: string[];
  nextVisitDate: string; obstetrician: string; notes: string;
  status: ANCVisitStatus;
}

export const ANC_VISITS: ANCV[] = [
  { id: "ANC-001", motherId: "MTH-001", motherName: "Priya Devi Sharma", visitNumber: 8, visitDate: "2026-07-20", gestationalAge: "30w 2d", weight: 68, bpSystolic: 118, bpDiastolic: 76, fundalHeight: 28, fetalHeartRate: 142, presentation: "Cephalic", edema: "None", urineProtein: "Negative", urineSugar: "Negative", hb: 11.2, medications: ["Iron Sucrose"], vaccinations: ["Tdap"], supplements: ["Iron", "Calcium", "Folic Acid"], nextVisitDate: "2026-08-03", obstetrician: "Dr. Sunita Menon", notes: "Normal ANC visit. Baby growing well.", status: "Completed" },
  { id: "ANC-002", motherId: "MTH-001", motherName: "Priya Devi Sharma", visitNumber: 7, visitDate: "2026-07-06", gestationalAge: "28w 2d", weight: 66.5, bpSystolic: 115, bpDiastolic: 74, fundalHeight: 26, fetalHeartRate: 140, presentation: "Cephalic", edema: "None", urineProtein: "Negative", urineSugar: "Negative", hb: 10.8, medications: ["Iron Sucrose"], vaccinations: [], supplements: ["Iron", "Calcium", "Folic Acid"], nextVisitDate: "2026-07-20", obstetrician: "Dr. Sunita Menon", notes: "Hb slightly low — increased iron supplementation.", status: "Completed" },
  { id: "ANC-003", motherId: "MTH-003", motherName: "Sunita Kumari", visitNumber: 10, visitDate: "2026-07-22", gestationalAge: "32w 5d", weight: 62, bpSystolic: 142, bpDiastolic: 92, fundalHeight: 30, fetalHeartRate: 148, presentation: "Cephalic", edema: "Mild", urineProtein: "Trace", urineSugar: "Negative", hb: 10.0, medications: ["Labetalol", "Methyldopa"], vaccinations: ["Tdap"], supplements: ["Iron", "Calcium"], nextVisitDate: "2026-07-29", obstetrician: "Dr. Sunita Menon", notes: "BP elevated — monitor closely. Anti-hypertensive started.", status: "Completed" },
  { id: "ANC-004", motherId: "MTH-008", motherName: "Geeta Joshi", visitNumber: 12, visitDate: "2026-07-23", gestationalAge: "37w 1d", weight: 78, bpSystolic: 152, bpDiastolic: 98, fundalHeight: 35, fetalHeartRate: 144, presentation: "Cephalic", edema: "Moderate", urineProtein: "1+", urineSugar: "Negative", hb: 9.5, medications: ["Labetalol", "Methyldopa", "Magnesium Sulfate"], vaccinations: [], supplements: ["Iron", "Calcium"], nextVisitDate: "2026-07-25", obstetrician: "Dr. Sunita Menon", notes: "Pre-eclampsia worsening — admitted for observation.", status: "Completed" },
];

export interface Ultrasound {
  id: string; motherId: string; motherName: string;
  scanType: string; scanDate: string; gestationalAge: string;
  biparietalDiameter: number; femurLength: number; abdominalCircumference: number;
  estimatedFetalWeight: number; placentaPosition: string; amnioticFluidIndex: number;
  nuchalTranslucency?: number; ntScanDone?: boolean;
  anomalyScreened: boolean; growthScanDone: boolean;
  dopplerAssessment?: string; findings: string;
  performedBy: string; reportedBy: string;
}

export const ULTRASOUNDS: Ultrasound[] = [
  { id: "US-001", motherId: "MTH-001", motherName: "Priya Devi Sharma", scanType: "Growth Scan", scanDate: "2026-07-15", gestationalAge: "29w 5d", biparietalDiameter: 7.8, femurLength: 5.9, abdominalCircumference: 25.6, estimatedFetalWeight: 1420, placentaPosition: "Posterior fundal", amnioticFluidIndex: 14, anomalyScreened: true, growthScanDone: true, dopplerAssessment: "Normal Umbilical Artery Doppler", findings: "Normal growth. Adequate amniotic fluid. Placenta normal.", performedBy: "Dr. Priya Radiologist", reportedBy: "Dr. Priya Radiologist" },
  { id: "US-002", motherId: "MTH-001", motherName: "Priya Devi Sharma", scanType: "Anomaly Scan", scanDate: "2026-05-01", gestationalAge: "20w 3d", biparietalDiameter: 4.8, femurLength: 3.2, abdominalCircumference: 15.8, estimatedFetalWeight: 350, placentaPosition: "Anterior", amnioticFluidIndex: 12, anomalyScreened: true, growthScanDone: false, findings: "No structural anomalies detected. Normal anatomy.", performedBy: "Dr. Priya Radiologist", reportedBy: "Dr. Priya Radiologist" },
  { id: "US-003", motherId: "MTH-003", motherName: "Sunita Kumari", scanType: "Growth Scan", scanDate: "2026-07-18", gestationalAge: "32w 2d", biparietalDiameter: 8.2, femurLength: 6.2, abdominalCircumference: 27.1, estimatedFetalWeight: 1680, placentaPosition: "Lateral", amnioticFluidIndex: 11, anomalyScreened: true, growthScanDone: true, dopplerAssessment: "Mildly increased UA resistance", findings: "Growth appropriate for gestational age. Mild UA resistance — monitor.", performedBy: "Dr. Priya Radiologist", reportedBy: "Dr. Priya Radiologist" },
  { id: "US-004", motherId: "MTH-008", motherName: "Geeta Joshi", scanType: "Growth Scan", scanDate: "2026-07-10", gestationalAge: "36w 1d", biparietalDiameter: 9.0, femurLength: 6.8, abdominalCircumference: 32.0, estimatedFetalWeight: 2650, placentaPosition: "Anterior", amnioticFluidIndex: 9, anomalyScreened: true, growthScanDone: true, dopplerAssessment: "Normal Umbilical Artery Doppler", findings: "Growth appropriate. AFI slightly low — monitor.", performedBy: "Dr. Priya Radiologist", reportedBy: "Dr. Priya Radiologist" },
];

export interface RiskAssessment {
  id: string; motherId: string; motherName: string;
  assessmentDate: string; maternalAge: number; gravida: number;
  gestationalDiabetes: boolean; gdmScreenResult: string;
  pregnancyInducedHypertension: boolean; pihtResult: string;
  preEclampsiaRisk: RiskLevel; preEclampsiaScore: number;
  previousCesarean: boolean; previousCesareanCount: number;
  multiplePregnancy: boolean; placentaDisorders: string;
  overallRisk: RiskLevel; riskFactors: string[];
  carePlan: string; assessedBy: string;
}

export const RISK_ASSESSMENTS: RiskAssessment[] = [
  { id: "RA-001", motherId: "MTH-001", motherName: "Priya Devi Sharma", assessmentDate: "2026-07-20", maternalAge: 28, gravida: 2, gestationalDiabetes: false, gdmScreenResult: "Negative", pregnancyInducedHypertension: false, pihtResult: "Normal", preEclampsiaRisk: "Low", preEclampsiaScore: 2, previousCesarean: false, previousCesareanCount: 0, multiplePregnancy: false, placentaDisorders: "None", overallRisk: "Low", riskFactors: [], carePlan: "Routine ANC. Continue supplements. Next visit in 2 weeks.", assessedBy: "Dr. Sunita Menon" },
  { id: "RA-002", motherId: "MTH-003", motherName: "Sunita Kumari", assessmentDate: "2026-07-22", maternalAge: 22, gravida: 1, gestationalDiabetes: false, gdmScreenResult: "Negative", pregnancyInducedHypertension: true, pihtResult: "BP 142/92 — Stage 1 PIH", preEclampsiaRisk: "High", preEclampsiaScore: 7, previousCesarean: false, previousCesareanCount: 0, multiplePregnancy: false, placentaDisorders: "None", overallRisk: "High", riskFactors: ["PIH", "Rh negative", "Primigravida"], carePlan: "Anti-hypertensive therapy. Weekly BP monitoring. Urine protein surveillance. Delivery planning at 37 weeks.", assessedBy: "Dr. Sunita Menon" },
  { id: "RA-003", motherId: "MTH-008", motherName: "Geeta Joshi", assessmentDate: "2026-07-23", maternalAge: 30, gravida: 2, gestationalDiabetes: true, gdmScreenResult: "GDM — on insulin", pregnancyInducedHypertension: true, pihtResult: "BP 152/98 — Stage 2 PIH", preEclampsiaRisk: "Very High", preEclampsiaScore: 9, previousCesarean: true, previousCesareanCount: 1, multiplePregnancy: false, placentaDisorders: "None", overallRisk: "Very High", riskFactors: ["PIH", "GDM", "Previous LSCS", "Advanced maternal age"], carePlan: "Admitted. IV Magnesium Sulfate. Blood pressure management. Emergency LSCS if deterioration.", assessedBy: "Dr. Sunita Menon" },
];

export interface LaborAdmission {
  id: string; motherId: string; motherName: string;
  admissionTime: string; gestationalAge: string;
  contractions: string; cervicalDilatation: number;
  cervicalEffacement: number; membraneStatus: string;
  painScore: number; presentingPart: string;
  obstetrician: string; midwife: string;
  laborRoom: string; status: LaborStatus;
  admissionNotes: string;
}

export const LABOR_ADMISSIONS: LaborAdmission[] = [
  { id: "LA-001", motherId: "MTH-008", motherName: "Geeta Joshi", admissionTime: "2026-07-23T14:00:00", gestationalAge: "37w 1d", contractions: "Every 5 minutes, lasting 45 seconds", cervicalDilatation: 4, cervicalEffacement: 70, membraneStatus: "Intact", painScore: 7, presentingPart: "Cephalic — LOA", obstetrician: "Dr. Sunita Menon", midwife: "Nurse Lakshmi", laborRoom: "LR-01", status: "Active Labor", admissionNotes: "Admitted in active labor. Cervix 4cm dilated. Contractions regular. CTG initiated." },
];

export interface Partograph {
  id: string; admissionId: string; motherId: string; motherName: string;
  startTime: string; cervicalDilatation: number[];
  descentOfHead: number[]; fetalHeartRate: number[];
  maternalPulse: number[]; bpSystolic: number[]; bpDiastolic: number[];
  contractions: string[]; urineOutput: number[];
  status: PartographStatus; obstetrician: string;
}

export const PARTOGRAPHS: Partograph[] = [
  { id: "PG-001", admissionId: "LA-001", motherId: "MTH-008", motherName: "Geeta Joshi", startTime: "2026-07-23T14:00:00", cervicalDilatation: [4, 5, 6, 7, 8, 9], descentOfHead: [-1, 0, 1, 1, 2, 2], fetalHeartRate: [144, 140, 138, 136, 142, 140], maternalPulse: [88, 90, 92, 95, 98, 100], bpSystolic: [150, 148, 145, 142, 140, 138], bpDiastolic: [96, 94, 92, 90, 88, 86], contractions: ["30s/5min", "40s/4min", "45s/3min", "50s/3min", "55s/2min", "60s/2min"], urineOutput: [50, 40, 35, 30, 25, 20], status: "Normal", obstetrician: "Dr. Sunita Menon" },
];

export interface Newborn {
  id: string; motherId: string; motherName: string;
  birthDate: string; birthTime: string; birthWeight: number;
  length: number; headCircumference: number; gender: "Male" | "Female";
  apgar1min: number; apgar5min: number; apgar10min: number;
  deliveryType: string; deliveryOutcome: DeliveryOutcome;
  identificationBand: string; vitaminKGiven: boolean;
  birthVaccinations: string[]; newbornScreening: string[];
  nicuStatus: NICUStatus; nicuReason?: string;
  cryingAtBirth: boolean; breathingSpontaneously: boolean;
  babyId: string; status: string;
}

export const NEWBORNS: Newborn[] = [];

export interface PostpartumCare {
  id: string; motherId: string; motherName: string;
  assessmentDate: string; bpSystolic: number; bpDiastolic: number;
  heartRate: number; temperature: number;
  uterineInvolution: string; bleeding: string;
  painScore: number; episiotomyStatus: string;
  breastStatus: string; urinationStatus: string;
  medications: string[]; notes: string;
  status: PostpartumStatus;
}

export const POSTPARTUM_CARES: PostpartumCare[] = [];

export interface LactationSupport {
  id: string; motherId: string; motherName: string;
  assessmentDate: string; latchScore: number; feedingFrequency: string;
  milkSupply: "Adequate" | "Insufficient" | "Excessive" | "Building Up";
  breastfeedingInitiated: boolean; breastfeedingTime: string;
  supplementsNeeded: boolean; counsellingProvided: boolean;
  educationTopics: string[]; followUpDate: string;
  assessedBy: string; notes: string;
}

export const LACTATION_SUPPORTS: LactationSupport[] = [];

export interface AuditLog {
  id: string; timestamp: string; user: string; action: string;
  resource: string; details: string; severity: "Info" | "Warning" | "Critical";
}

export const AUDIT_LOGS: AuditLog[] = [
  { id: "AUD-001", timestamp: "2026-07-23T14:00:00", user: "Dr. Sunita Menon", action: "Labor Admission", resource: "LA-001", details: "Geeta Joshi admitted — Active Labor — 37w 1d", severity: "Info" },
  { id: "AUD-002", timestamp: "2026-07-23T10:00:00", user: "Dr. Sunita Menon", action: "ANC Visit", resource: "ANC-004", details: "Geeta Joshi — ANC visit 12 — Pre-eclampsia worsening", severity: "Warning" },
  { id: "AUD-003", timestamp: "2026-07-22T11:00:00", user: "Dr. Sunita Menon", action: "Risk Assessment", resource: "RA-003", details: "Geeta Joshi — Very High Risk — PIH + GDM + Previous LSCS", severity: "Critical" },
  { id: "AUD-004", timestamp: "2026-07-22T09:00:00", user: "Dr. Sunita Menon", action: "ANC Visit", resource: "ANC-003", details: "Sunita Kumari — ANC visit 10 — BP elevated", severity: "Warning" },
  { id: "AUD-005", timestamp: "2026-07-20T10:30:00", user: "Dr. Sunita Menon", action: "ANC Visit", resource: "ANC-001", details: "Priya Devi Sharma — ANC visit 8 — Normal", severity: "Info" },
  { id: "AUD-006", timestamp: "2026-07-15T14:00:00", user: "Dr. Priya Radiologist", action: "Ultrasound", resource: "US-001", details: "Priya Devi Sharma — Growth Scan — Normal findings", severity: "Info" },
  { id: "AUD-007", timestamp: "2026-07-10T15:00:00", user: "Dr. Priya Radiologist", action: "Ultrasound", resource: "US-004", details: "Geeta Joshi — Growth Scan — AFI slightly low", severity: "Warning" },
];

/* ── Maternity KPIs ───────────────────────────────────────────────────────── */
export const MATERNITY_KPI = {
  totalMothers: 8,
  activeMothers: 8,
  todayANCVisits: 2,
  laborAdmissions: 1,
  deliveriesToday: 0,
  highRiskPregnancies: 2,
  nicuTransfers: 0,
  laborRooms: 4,
  laborRoomsAvailable: 3,
  totalDeliveriesThisMonth: 45,
  cesareanRate: 28.5,
  nicuAdmissionRate: 8.2,
  maternalMortality: 0,
  pretermRate: 12.5,
};

/* ── Helpers ──────────────────────────────────────────────────────────────── */
export function riskLevelTone(r: RiskLevel): "success" | "warning" | "danger" | "info" {
  switch (r) { case "Low": return "success"; case "Moderate": return "warning"; case "High": case "Very High": return "danger"; default: return "info"; }
}
export function laborStatusTone(s: LaborStatus): "success" | "warning" | "danger" | "info" {
  switch (s) { case "Not in Labor": return "success"; case "Early Labor": return "info"; case "Active Labor": case "Transition": return "warning"; case "Delivery": case "Postpartum": return "danger"; default: return "info"; }
}
export function deliveryTypeTone(d: DeliveryType): "success" | "warning" | "danger" | "info" {
  switch (d) { case "Normal Vaginal": return "success"; case "Assisted Vaginal": case "Vacuum": case "Forceps": return "warning"; case "Cesarean Section": case "Emergency Cesarean": return "danger"; default: return "info"; }
}
export function nicuStatusTone(s: NICUStatus): "success" | "warning" | "danger" | "info" {
  switch (s) { case "Not Required": case "Discharged": case "Stabilized": return "success"; case "Referred": return "warning"; case "Admitted": return "danger"; default: return "info"; }
}
export function postpartumStatusTone(s: PostpartumStatus): "success" | "warning" | "danger" | "info" {
  switch (s) { case "Recovery": case "Stable": return "success"; case "Complication": return "danger"; case "Discharged": return "info"; default: return "info"; }
}
export function ancVisitStatusTone(s: ANCVisitStatus): "success" | "warning" | "danger" | "info" {
  switch (s) { case "Completed": return "success"; case "Scheduled": return "info"; case "Missed": return "danger"; case "Cancelled": return "warning"; default: return "info"; }
}
export function partographStatusTone(s: PartographStatus): "success" | "warning" | "danger" | "info" {
  switch (s) { case "Normal": return "success"; case "Alert": return "warning"; case "Action Required": return "danger"; case "Not Started": return "info"; default: return "info"; }
}
export function ctgClassificationTone(c: CTGClassification): "success" | "warning" | "danger" | "info" {
  switch (c) { case "Normal": return "success"; case "Suspicious": return "warning"; case "Pathological": return "danger"; case "Unsatisfactory": return "info"; default: return "info"; }
}
export function formatCurrency(n: number): string { return `Rs.${n.toLocaleString("en-IN")}`; }
