/* ── Oncology Management System — Data ────────────────────────────────────── */

export type CancerType = "Breast" | "Lung" | "Colorectal" | "Head & Neck" | "Gastric" | "Prostate" | "Ovarian" | "Cervical" | "Hepatocellular" | "Pancreatic" | "Lymphoma" | "Leukemia" | "Multiple Myeloma" | "Sarcoma" | "Brain";
export type Stage = "I" | "II" | "III" | "IV" | "IA" | "IB" | "IIA" | "IIB" | "IIIA" | "IIIB" | "IIIC";
export type TreatmentIntent = "Curative" | "Palliative" | "Neoadjuvant" | "Adjuvant" | "Concurrent" | "Maintenance";
export type TreatmentStatus = "Planned" | "In Progress" | "Completed" | "On Hold" | "Discontinued" | "Cancelled";
export type ECOGStatus = "0" | "1" | "2" | "3" | "4";
export type CTCAEGrade = "Grade 1" | "Grade 2" | "Grade 3" | "Grade 4" | "Grade 5";
export type RECISTResponse = "CR" | "PR" | "SD" | "PD" | "NE";
export type InfusionStatus = "Scheduled" | "In Progress" | "Completed" | "Delayed" | "Cancelled";
export type TumorBoardStatus = "Scheduled" | "In Progress" | "Completed" | "Pending Review";
export type RegistryStatus = "Active" | "Closed" | "Lost to Follow-up" | "Deceased";
export type ScreeningStatus = "Due" | "Completed" | "Abnormal" | "Referred";
export type PalliativeStatus = "Active" | "Stable" | "Escalated" | "Transitioned";

export interface CancerPatient {
  id: string; patientId: string; uhid: string; name: string;
  age: number; gender: "Male" | "Female"; phone: string;
  cancerType: CancerType; primarySite: string; histology: string;
  diagnosisDate: string; stage: Stage; ajccStage: string;
  ecogStatus: ECOGStatus; treatmentIntent: TreatmentIntent;
  treatmentStatus: TreatmentStatus; assignedOncologist: string;
  tnmT: string; tnmN: string; tnmM: string;
  biomarkers: string[]; molecularProfile: string;
  registryId: string; screeningDate?: string;
  insuranceProvider: string; insurancePolicyNo: string;
  lastVisit: string; nextVisit: string;
  status: string;
}

export const CANCER_PATIENTS: CancerPatient[] = [
  { id: "ONC-001", patientId: "P-1001", uhid: "UHID-ONC-001", name: "Priya Sharma", age: 45, gender: "Female", phone: "+91 98765 43210", cancerType: "Breast", primarySite: "Left Breast — Upper Outer Quadrant", histology: "Invasive Ductal Carcinoma", diagnosisDate: "2026-03-15", stage: "IIA", ajccStage: "pT2N0M0 — Stage IIA", ecogStatus: "1", treatmentIntent: "Curative", treatmentStatus: "In Progress", assignedOncologist: "Dr. Rajesh Oncologist", tnmT: "T2", tnmN: "N0", tnmM: "M0", biomarkers: ["ER Positive (90%)", "PR Positive (75%)", "HER2 Negative (1+)", "Ki-67: 25%"], molecularProfile: "Luminal B", registryId: "CR-2026-001", insuranceProvider: "Star Health", insurancePolicyNo: "SH-ONC-001", lastVisit: "2026-07-20", nextVisit: "2026-08-03", status: "Active" },
  { id: "ONC-002", patientId: "P-1002", uhid: "UHID-ONC-002", name: "Rajesh Kumar", age: 58, gender: "Male", phone: "+91 87654 32109", cancerType: "Lung", primarySite: "Right Upper Lobe", histology: "Non-Small Cell Lung Adenocarcinoma", diagnosisDate: "2026-04-10", stage: "IIIB", ajccStage: "cT3N2M0 — Stage IIIB", ecogStatus: "2", treatmentIntent: "Concurrent", treatmentStatus: "In Progress", assignedOncologist: "Dr. Rajesh Oncologist", tnmT: "T3", tnmN: "N2", tnmM: "M0", biomarkers: ["PD-L1: 60%", "EGFR: Wild Type", "ALK: Negative", "ROS1: Negative"], molecularProfile: "PD-L1 High", registryId: "CR-2026-002", insuranceProvider: "ICICI Lombard", insurancePolicyNo: "IL-ONC-002", lastVisit: "2026-07-18", nextVisit: "2026-07-25", status: "Active" },
  { id: "ONC-003", patientId: "P-1003", uhid: "UHID-ONC-003", name: "Anita Patel", age: 52, gender: "Female", phone: "+91 76543 21098", cancerType: "Colorectal", primarySite: "Sigmoid Colon", histology: "Moderately Differentiated Adenocarcinoma", diagnosisDate: "2026-01-20", stage: "III", ajccStage: "pT3N1M0 — Stage IIIA", ecogStatus: "1", treatmentIntent: "Adjuvant", treatmentStatus: "In Progress", assignedOncologist: "Dr. Sunita Oncologist", tnmT: "T3", tnmN: "N1", tnmM: "M0", biomarkers: ["KRAS: Wild Type", "NRAS: Wild Type", "BRAF: Wild Type", "MSI-High"], molecularProfile: "MSI-H — Mismatch Repair Deficient", registryId: "CR-2026-003", insuranceProvider: "New India Assurance", insurancePolicyNo: "NIA-ONC-003", lastVisit: "2026-07-15", nextVisit: "2026-08-05", status: "Active" },
  { id: "ONC-004", patientId: "P-1004", uhid: "UHID-ONC-004", name: "Vikram Singh", age: 62, gender: "Male", phone: "+91 65432 10987", cancerType: "Head & Neck", primarySite: "Right Tongue — Base", histology: "Squamous Cell Carcinoma", diagnosisDate: "2026-02-05", stage: "IVA", ajccStage: "cT4aN2bM0 — Stage IVA", ecogStatus: "1", treatmentIntent: "Curative", treatmentStatus: "In Progress", assignedOncologist: "Dr. Rajesh Oncologist", tnmT: "T4a", tnmN: "N2b", tnmM: "M0", biomarkers: ["HPV: Positive", "P16: Positive", "PD-L1: 40%"], molecularProfile: "HPV-Positive", registryId: "CR-2026-004", insuranceProvider: "Bajaj Allianz", insurancePolicyNo: "BA-ONC-004", lastVisit: "2026-07-22", nextVisit: "2026-07-29", status: "Active" },
  { id: "ONC-005", patientId: "P-1005", uhid: "UHID-ONC-005", name: "Sunita Devi", age: 48, gender: "Female", phone: "+91 54321 09876", cancerType: "Ovarian", primarySite: "Left Ovary", histology: "High-Grade Serous Carcinoma", diagnosisDate: "2026-05-12", stage: "IIIC", ajccStage: "pT3cN1M0 — Stage IIIC", ecogStatus: "2", treatmentIntent: "Palliative", treatmentStatus: "In Progress", assignedOncologist: "Dr. Sunita Oncologist", tnmT: "T3c", tnmN: "N1", tnmM: "M0", biomarkers: ["BRCA1: Positive", "HRD: Positive", "CA-125: 180"], molecularProfile: "BRCA1 Mutated — HRD Positive", registryId: "CR-2026-005", insuranceProvider: "United India", insurancePolicyNo: "UI-ONC-005", lastVisit: "2026-07-10", nextVisit: "2026-07-24", status: "Active" },
  { id: "ONC-006", patientId: "P-1006", uhid: "UHID-ONC-006", name: "Mohammed Ali", age: 55, gender: "Male", phone: "+91 43210 98765", cancerType: "Gastric", primarySite: "Gastroesophageal Junction", histology: "Poorly Differentiated Adenocarcinoma", diagnosisDate: "2026-06-01", stage: "IV", ajccStage: "cT3N3M1 — Stage IV", ecogStatus: "3", treatmentIntent: "Palliative", treatmentStatus: "Planned", assignedOncologist: "Dr. Sunita Oncologist", tnmT: "T3", tnmN: "N3", tnmM: "M1", biomarkers: ["HER2: Negative", "PD-L1: 15%", "MSI: Stable"], molecularProfile: "Microsatellite Stable", registryId: "CR-2026-006", insuranceProvider: "Star Health", insurancePolicyNo: "SH-ONC-006", lastVisit: "2026-07-05", nextVisit: "2026-07-26", status: "Active" },
  { id: "ONC-007", patientId: "P-1007", uhid: "UHID-ONC-007", name: "Kavita Reddy", age: 38, gender: "Female", phone: "+91 32109 87654", cancerType: "Cervical", primarySite: "Cervix — Ectocervix", histology: "Squamous Cell Carcinoma — Keratinizing", diagnosisDate: "2026-04-20", stage: "IIB", ajccStage: "pT2bN0M0 — Stage IIB", ecogStatus: "1", treatmentIntent: "Curative", treatmentStatus: "Completed", assignedOncologist: "Dr. Sunita Oncologist", tnmT: "T2b", tnmN: "N0", tnmM: "M0", biomarkers: ["HPV: 18 Positive", "P16: Positive"], molecularProfile: "HPV-18", registryId: "CR-2026-007", insuranceProvider: "Reliance General", insurancePolicyNo: "RG-ONC-007", lastVisit: "2026-07-18", nextVisit: "2026-10-18", status: "Active" },
  { id: "ONC-008", patientId: "P-1008", uhid: "UHID-ONC-008", name: "Deepak Gupta", age: 67, gender: "Male", phone: "+91 21098 76543", cancerType: "Prostate", primarySite: "Prostate — Peripheral Zone", histology: "Gleason 4+3=7 Adenocarcinoma", diagnosisDate: "2026-02-28", stage: "IIA", ajccStage: "pT2cN0M0 — Stage IIA", ecogStatus: "0", treatmentIntent: "Curative", treatmentStatus: "Completed", assignedOncologist: "Dr. Rajesh Oncologist", tnmT: "T2c", tnmN: "N0", tnmM: "M0", biomarkers: ["PSA: 12.5", "Gleason: 4+3=7", "Decipher: 0.62"], molecularProfile: "Intermediate Risk", registryId: "CR-2026-008", insuranceProvider: "New India Assurance", insurancePolicyNo: "NIA-ONC-008", lastVisit: "2026-07-12", nextVisit: "2026-08-12", status: "Active" },
];

export interface ChemoProtocol {
  id: string; patientId: string; patientName: string;
  protocolName: string; cycleNumber: number; totalCycles: number;
  regimen: string[]; bsa: number; treatmentIntent: TreatmentIntent;
  status: TreatmentStatus; startDate: string; nextCycleDate: string;
  oncologist: string; verificationStatus: string;
  premedication: string[]; supportiveCare: string[];
}

export const CHEMO_PROTOCOLS: ChemoProtocol[] = [
  { id: "CP-001", patientId: "ONC-001", patientName: "Priya Sharma", protocolName: "AC → T", cycleNumber: 3, totalCycles: 8, regimen: ["Doxorubicin 60 mg/m²", "Cyclophosphamide 600 mg/m²"], bsa: 1.62, treatmentIntent: "Adjuvant", status: "In Progress", startDate: "2026-06-01", nextCycleDate: "2026-07-27", oncologist: "Dr. Rajesh Oncologist", verificationStatus: "Verified", premedication: ["Ondansetron 8mg", "Dexamethasone 8mg", "Aprepitant 125mg"], supportiveCare: ["Filgrastim 5mcg/kg", "Omeprazole 20mg"] },
  { id: "CP-002", patientId: "ONC-002", patientName: "Rajesh Kumar", protocolName: "Concurrent ChemoRT", cycleNumber: 4, totalCycles: 6, regimen: ["Cisplatin 50 mg/m² Weekly", "RT 60 Gy/30 fractions"], bsa: 1.85, treatmentIntent: "Concurrent", status: "In Progress", startDate: "2026-06-15", nextCycleDate: "2026-07-28", oncologist: "Dr. Rajesh Oncologist", verificationStatus: "Verified", premedication: ["Ondansetron 8mg", "Hydration 1L NS"], supportiveCare: ["Amlodipine 5mg", "Lansoprazole 30mg"] },
  { id: "CP-003", patientId: "ONC-003", patientName: "Anita Patel", protocolName: "FOLFOX", cycleNumber: 6, totalCycles: 12, regimen: ["Oxaliplatin 85 mg/m²", "Leucovorin 400 mg/m²", "5-FU 400 mg/m² bolus", "5-FU 2400 mg/m² 46h infusion"], bsa: 1.58, treatmentIntent: "Adjuvant", status: "In Progress", startDate: "2026-05-10", nextCycleDate: "2026-07-25", oncologist: "Dr. Sunita Oncologist", verificationStatus: "Verified", premedication: ["Ondansetron 8mg", "Dexamethasone 8mg"], supportiveCare: ["Pyridoxine 50mg", "Calcium gluconate"] },
];

export interface InfusionSession {
  id: string; patientId: string; patientName: string;
  chairId: string; protocolName: string; cycleNumber: number;
  scheduledTime: string; startTime?: string; endTime?: string;
  status: InfusionStatus; nurse: string;
  pumpId: string; medication: string; volume: number;
  rate: number; monitoringNotes: string;
}

export const INFUSION_SESSIONS: InfusionSession[] = [
  { id: "INF-001", patientId: "ONC-001", patientName: "Priya Sharma", chairId: "IC-03", protocolName: "AC → T", cycleNumber: 3, scheduledTime: "09:00", startTime: "09:15", status: "In Progress", nurse: "Nurse Priya", pumpId: "PUMP-05", medication: "Doxorubicin + Cyclophosphamide", volume: 500, rate: 150, monitoringNotes: "Vitals stable. No nausea reported. Premedication given." },
  { id: "INF-002", patientId: "ONC-003", patientName: "Anita Patel", chairId: "IC-01", protocolName: "FOLFOX", cycleNumber: 6, scheduledTime: "10:30", status: "Scheduled", nurse: "Nurse Kavitha", pumpId: "PUMP-02", medication: "Oxaliplatin + 5-FU", volume: 750, rate: 120, monitoringNotes: "Pre-chemo labs reviewed. Ready for infusion." },
  { id: "INF-003", patientId: "ONC-002", patientName: "Rajesh Kumar", chairId: "IC-05", protocolName: "Weekly Cisplatin", cycleNumber: 4, scheduledTime: "11:00", status: "Completed", nurse: "Nurse Lakshmi", pumpId: "PUMP-08", medication: "Cisplatin 92mg", volume: 1000, rate: 200, monitoringNotes: "Infusion completed. Mild nausea. Ondansetron given." },
];

export interface RadiationSession {
  id: string; patientId: string; patientName: string;
  treatmentSite: string; machine: string; technique: string;
  prescribedDose: string; deliveredDose: string;
  fractionsPlanned: number; fractionsDelivered: number;
  lastSession: string; nextSession: string;
  status: TreatmentStatus; oncologist: string;
}

export const RADIATION_SESSIONS: RadiationSession[] = [
  { id: "RT-001", patientId: "ONC-002", patientName: "Rajesh Kumar", treatmentSite: "Right Upper Lobe + Mediastinum", machine: "LINAC — Varian TrueBeam", technique: "IMRT", prescribedDose: "60 Gy / 30 fractions", deliveredDose: "48 Gy / 24 fractions", fractionsPlanned: 30, fractionsDelivered: 24, lastSession: "2026-07-22", nextSession: "2026-07-25", status: "In Progress", oncologist: "Dr. Rajesh Oncologist" },
  { id: "RT-002", patientId: "ONC-004", patientName: "Vikram Singh", treatmentSite: "Right Tongue + Bilateral Neck", machine: "LINAC — Elekta Versa HD", technique: "VMAT", prescribedDose: "70 Gy / 35 fractions", deliveredDose: "56 Gy / 28 fractions", fractionsPlanned: 35, fractionsDelivered: 28, lastSession: "2026-07-23", nextSession: "2026-07-25", status: "In Progress", oncologist: "Dr. Rajesh Oncologist" },
  { id: "RT-003", patientId: "ONC-007", patientName: "Kavita Reddy", treatmentSite: "Cervix + Parametria + Pelvic Nodes", machine: "LINAC — Varian TrueBeam", technique: "EBRT + Brachytherapy", prescribedDose: "50 Gy EBRT + 30 Gy brachy", deliveredDose: "50 Gy + 30 Gy", fractionsPlanned: 25, fractionsDelivered: 25, lastSession: "2026-07-01", nextSession: "N/A", status: "Completed", oncologist: "Dr. Sunita Oncologist" },
];

export interface TumorBoard {
  id: string; meetingDate: string; time: string;
  title: string; caseCount: number;
  participants: string[]; status: TumorBoardStatus;
  casesPresented: string[]; decisions: string[];
}

export const TUMOR_BOARDS: TumorBoard[] = [
  { id: "TB-001", meetingDate: "2026-07-25", time: "10:00", title: "Weekly MDT — Breast & Lung", caseCount: 4, participants: ["Dr. Rajesh Oncologist", "Dr. Sunita Oncologist", "Dr. Priya Radiologist", "Dr. Asha Pathologist", "Dr. Mohan Surgeon"], status: "Scheduled", casesPresented: ["ONC-001", "ONC-002", "ONC-009", "ONC-010"], decisions: [] },
  { id: "TB-002", meetingDate: "2026-07-18", time: "10:00", title: "Weekly MDT — GI & Gynae", caseCount: 3, participants: ["Dr. Rajesh Oncologist", "Dr. Sunita Oncologist", "Dr. Asha Pathologist", "Dr. Mohan Surgeon"], status: "Completed", casesPresented: ["ONC-003", "ONC-005", "ONC-007"], decisions: ["ONC-003 — Continue FOLFOX x6 more cycles", "ONC-005 — Switch to Olaparib maintenance", "ONC-007 — Surveillance — 3-monthly PET-CT"] },
  { id: "TB-003", meetingDate: "2026-07-11", time: "10:00", title: "Weekly MDT — Head & Neck", caseCount: 2, participants: ["Dr. Rajesh Oncologist", "Dr. Priya Radiologist", "Dr. Asha Pathologist", "Dr. Mohan Surgeon"], status: "Completed", casesPresented: ["ONC-004", "ONC-011"], decisions: ["ONC-004 — Continue concurrent chemoRT — response favorable", "ONC-011 — Refer for TORS evaluation"] },
];

export interface ResponseAssessment {
  id: string; patientId: string; patientName: string;
  assessmentDate: string; recistResponse: RECISTResponse;
  targetLesionChange: number; nonTargetStatus: string;
  newLesions: boolean; overallResponse: string;
  imagingModality: string; nextPlan: string;
  assessedBy: string;
}

export const RESPONSE_ASSESSMENTS: ResponseAssessment[] = [
  { id: "RA-001", patientId: "ONC-001", patientName: "Priya Sharma", assessmentDate: "2026-07-15", recistResponse: "PR", targetLesionChange: -35, nonTargetStatus: "Stable", newLesions: false, overallResponse: "Partial Response", imagingModality: "PET-CT", nextPlan: "Continue AC → T protocol. Next cycle 27 Jul.", assessedBy: "Dr. Rajesh Oncologist" },
  { id: "RA-002", patientId: "ONC-002", patientName: "Rajesh Kumar", assessmentDate: "2026-07-10", recistResponse: "PR", targetLesionChange: -42, nonTargetStatus: "Improved", newLesions: false, overallResponse: "Partial Response", imagingModality: "CT Chest", nextPlan: "Continue concurrent chemoRT. Good response.", assessedBy: "Dr. Rajesh Oncologist" },
  { id: "RA-003", patientId: "ONC-005", patientName: "Sunita Devi", assessmentDate: "2026-07-05", recistResponse: "SD", targetLesionChange: -12, nonTargetStatus: "Stable", newLesions: false, overallResponse: "Stable Disease", imagingModality: "PET-CT", nextPlan: "Switch to Olaparib maintenance per BRCA1 status.", assessedBy: "Dr. Sunita Oncologist" },
];

export interface ScreeningRecord {
  id: string; patientName: string; age: number;
  screeningType: string; riskLevel: string;
  familyHistory: string; geneticRisk: string;
  screeningResult: string; referralStatus: string;
  screeningDate: string; nextScreening: string;
  status: ScreeningStatus;
}

export const SCREENING_RECORDS: ScreeningRecord[] = [
  { id: "SCR-001", patientName: "Lakshmi Devi", age: 42, screeningType: "Mammography", riskLevel: "Moderate", familyHistory: "Mother — Breast Cancer (age 55)", geneticRisk: "BRCA Not Tested", screeningResult: "BI-RADS 4 — Suspicious", referralStatus: "Referred for Biopsy", screeningDate: "2026-07-10", nextScreening: "Post-biopsy", status: "Abnormal" },
  { id: "SCR-002", patientName: "Anjali Nair", age: 55, screeningType: "Colonoscopy", riskLevel: "High", familyHistory: "Father — Colorectal Cancer (age 50)", geneticRisk: "Lynch Syndrome Suspected", screeningResult: "2 Polyps — Removed", referralStatus: "Histopathology Pending", screeningDate: "2026-07-15", nextScreening: "1 year", status: "Completed" },
  { id: "SCR-003", patientName: "Meena Kumari", age: 35, screeningType: "Pap Smear + HPV", riskLevel: "Low", familyHistory: "None", geneticRisk: "Low", screeningResult: "Normal", referralStatus: "Routine", screeningDate: "2026-07-20", nextScreening: "3 years", status: "Completed" },
];

export interface PalliativeRecord {
  id: string; patientId: string; patientName: string;
  painScore: number; painLocation: string;
  symptomBurden: string; performanceStatus: string;
  careGoals: string; advanceDirective: boolean;
  familyMeeting: string; medications: string[];
  lastAssessment: string; status: PalliativeStatus;
}

export const PALLIATIVE_RECORDS: PalliativeRecord[] = [
  { id: "PAL-001", patientId: "ONC-006", patientName: "Mohammed Ali", painScore: 6, painLocation: "Epigastrium — Radiating to back", symptomBurden: "Nausea, Anorexia, Weight loss, Fatigue", performanceStatus: "ECOG 3", careGoals: "Symptom control — Quality of life", advanceDirective: true, familyMeeting: "2026-07-10 — Family counselled. Goals of care discussed.", medications: ["Morphine 10mg Q4H", "Ondansetron 8mg Q8H", "Dexamethasone 4mg daily", "Megestrol 160mg daily"], lastAssessment: "2026-07-20", status: "Active" },
];

export interface AuditLog {
  id: string; timestamp: string; user: string; action: string;
  resource: string; details: string; severity: "Info" | "Warning" | "Critical";
}

export const AUDIT_LOGS: AuditLog[] = [
  { id: "AUD-001", timestamp: "2026-07-24T09:15:00", user: "Nurse Priya", action: "Infusion Started", resource: "INF-001", details: "Priya Sharma — AC Cycle 3 — Doxorubicin + Cyclophosphamide", severity: "Info" },
  { id: "AUD-002", timestamp: "2026-07-23T14:00:00", user: "Dr. Rajesh Oncologist", action: "Tumor Board", resource: "TB-003", details: "H&N cases reviewed. ONC-004 — continue chemoRT.", severity: "Info" },
  { id: "AUD-003", timestamp: "2026-07-22T11:00:00", user: "Dr. Rajesh Oncologist", action: "Response Assessment", resource: "RA-002", details: "Rajesh Kumar — PR — 42% reduction. Continue treatment.", severity: "Info" },
  { id: "AUD-004", timestamp: "2026-07-20T10:00:00", user: "Dr. Sunita Oncologist", action: "Treatment Plan", resource: "ONC-005", details: "Sunita Devi — Switch to Olaparib maintenance. MDT approved.", severity: "Info" },
  { id: "AUD-005", timestamp: "2026-07-18T09:00:00", user: "Dr. Asha Pathologist", action: "Histopathology", resource: "ONC-006", details: "Mohammed Ali — Gastric biopsy — Poorly diff. adenoca. HER2 negative.", severity: "Warning" },
  { id: "AUD-006", timestamp: "2026-07-15T16:00:00", user: "Dr. Sunita Oncologist", action: "Toxicity Alert", resource: "ONC-003", details: "Anita Patel — Grade 3 Neuropathy — Oxaliplatin dose reduced.", severity: "Warning" },
];

/* ── Oncology KPIs ───────────────────────────────────────────────────────── */
export const ONCOLOGY_KPI = {
  activePatients: 8,
  todayInfusions: 3,
  radiationSessions: 4,
  tumorBoardMeetings: 1,
  criticalAlerts: 2,
  followUpVisits: 5,
  clinicalTrialEnrollment: 0,
  totalInfusionChairs: 8,
  availableChairs: 5,
  chemotherapyVolume: 45,
  survivalRate5Year: 68.5,
  clinicalTrialCount: 3,
};

/* ── Helpers ──────────────────────────────────────────────────────────────── */
export function treatmentIntentTone(t: TreatmentIntent): "success" | "warning" | "danger" | "info" {
  switch (t) { case "Curative": return "success"; case "Adjuvant": case "Neoadjuvant": return "info"; case "Palliative": return "warning"; case "Concurrent": case "Maintenance": return "info"; default: return "info"; }
}
export function treatmentStatusTone(s: TreatmentStatus): "success" | "warning" | "danger" | "info" {
  switch (s) { case "Completed": return "success"; case "In Progress": return "info"; case "Planned": return "warning"; case "On Hold": case "Cancelled": return "danger"; case "Discontinued": return "danger"; default: return "info"; }
}
export function ecogTone(e: ECOGStatus): "success" | "warning" | "danger" | "info" {
  switch (e) { case "0": case "1": return "success"; case "2": return "warning"; case "3": case "4": return "danger"; default: return "info"; }
}
export function recistTone(r: RECISTResponse): "success" | "warning" | "danger" | "info" {
  switch (r) { case "CR": return "success"; case "PR": return "info"; case "SD": return "warning"; case "PD": return "danger"; default: return "info"; }
}
export function infusionStatusTone(s: InfusionStatus): "success" | "warning" | "danger" | "info" {
  switch (s) { case "Completed": return "success"; case "In Progress": return "info"; case "Scheduled": return "warning"; case "Delayed": case "Cancelled": return "danger"; default: return "info"; }
}
export function tbStatusTone(s: TumorBoardStatus): "success" | "warning" | "danger" | "info" {
  switch (s) { case "Completed": return "success"; case "In Progress": return "info"; case "Scheduled": return "warning"; case "Pending Review": return "danger"; default: return "info"; }
}
export function registryStatusTone(s: RegistryStatus): "success" | "warning" | "danger" | "info" {
  switch (s) { case "Active": return "success"; case "Closed": return "info"; case "Lost to Follow-up": return "warning"; case "Deceased": return "danger"; default: return "info"; }
}
export function palliativeStatusTone(s: PalliativeStatus): "success" | "warning" | "danger" | "info" {
  switch (s) { case "Stable": return "success"; case "Active": return "info"; case "Escalated": return "warning"; case "Transitioned": return "danger"; default: return "info"; }
}
export function formatCurrency(n: number): string { return `Rs.${n.toLocaleString("en-IN")}`; }
