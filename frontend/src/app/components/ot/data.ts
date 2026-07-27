/* ------------------------------------------------------------------ */
/* Realistic mock Operation Theater data for Meridian Multi-Speciality  */
/* ------------------------------------------------------------------ */

export type SurgeryStatus =
  | "Scheduled" | "Confirmed" | "Pre-Op Ready" | "In Progress"
  | "Closing" | "Completed" | "Cancelled" | "Emergency";
export type OTRoomStatus = "Available" | "Occupied" | "Cleaning" | "Reserved" | "Maintenance";
export type AnesthesiaType = "General" | "Regional" | "Local" | "Spinal" | "Epidural" | "MAC";
export type ASAClass = "I" | "II" | "III" | "IV" | "V";
export type PacuPhase = "Phase I" | "Phase II" | "Phase III" | "Discharged";
export type SterilityStatus = "Sterile" | "Unsterile" | "Decontaminated" | "Expired";
export type ChecklistPhase = "Sign In" | "Time Out" | "Sign Out";
export type TurnoverStatus = "Pending" | "In Progress" | "Disinfection" | "Inspection" | "Ready";
export type Priority = "Routine" | "Urgent" | "Emergency";
export type ConsentType = "Procedure" | "Anesthesia" | "Blood Transfusion" | "Implant";
export type ConsentStatus = "Pending" | "Signed" | "Verified" | "Rejected";
export type TransferDestination = "ICU" | "Ward" | "Step-Down Unit" | "Home";
export type EquipmentStatus = "Available" | "In Use" | "Under Maintenance" | "Reserved";
export type ProcedureOutcome = "Routine" | "Complicated" | "Converted" | "Aborted";

export interface Surgeon {
  id: string;
  name: string;
  specialty: string;
  availability: "Available" | "In Surgery" | "On Call" | "Off Duty";
}

export interface Anesthesiologist {
  id: string;
  name: string;
  availability: "Available" | "In Surgery" | "On Call" | "Off Duty";
}

export interface OTRoom {
  id: string;
  number: string;
  name: string;
  floor: number;
  status: OTRoomStatus;
  type: "General" | "Cardiac" | "Neuro" | "Ortho" | "Laparoscopic" | "Hybrid";
  currentSurgery?: string;
  equipment: string[];
  lastSterilized?: string;
  ac: boolean;
}

export interface Surgery {
  id: string;
  uhid: string;
  patientName: string;
  age: number;
  gender: "Male" | "Female";
  blood: string;
  procedure: string;
  procedureCode: string;
  surgeon: string;
  surgeonId: string;
  assistantSurgeon?: string;
  anesthesiologist: string;
  anesthesiaType: AnesthesiaType;
  otRoom: string;
  otRoomId: string;
  scheduledDate: string;
  scheduledTime: string;
  estimatedDuration: number;
  actualStartTime?: string;
  actualEndTime?: string;
  status: SurgeryStatus;
  priority: Priority;
  diagnosis: string;
  laterality?: "Left" | "Right" | "Bilateral";
  asaClass: ASAClass;
  riskScore: string;
  consentStatus: ConsentStatus;
  whoChecklistComplete: boolean;
  notes?: string;
}

export interface PreOpAssessment {
  surgeryId: string;
  patientName: string;
  uhid: string;
  asaClass: ASAClass;
  riskScore: string;
  airwayAssessment: string;
  allergies: string;
  currentMedications: string;
  labClearance: boolean;
  radiologyClearance: boolean;
  anesthesiaClearance: boolean;
  surgicalClearance: boolean;
  notes: string;
}

export interface Consent {
  id: string;
  surgeryId: string;
  patientName: string;
  uhid: string;
  consentType: ConsentType;
  status: ConsentStatus;
  signedBy?: string;
  witnessBy?: string;
  signedAt?: string;
  verifiedBy?: string;
  verifiedAt?: string;
}

export interface TeamAssignment {
  surgeryId: string;
  patientName: string;
  procedure: string;
  primarySurgeon: string;
  assistantSurgeon?: string;
  anesthesiologist: string;
  scrubNurse: string;
  circulatingNurse: string;
  technician?: string;
  perfusionist?: string;
}

export interface EquipmentItem {
  id: string;
  name: string;
  category: string;
  status: EquipmentStatus;
  sterilizationStatus: SterilityStatus;
  sterilizedAt?: string;
  expiresAt?: string;
  assignedTo?: string;
  surgeryId?: string;
}

export interface AnesthesiaRecord {
  surgeryId: string;
  patientName: string;
  anesthesiaType: AnesthesiaType;
  inductionTime: string;
  intubationTime: string;
  extubationTime?: string;
  drugs: { name: string; dose: string; time: string }[];
  vitals: { time: string; bp: string; hr: number; spo2: number; etco2: number; temp: number }[];
  ventilatorSettings: { tv: number; rr: number; fio2: number; peep: number };
  complications?: string;
}

export interface IntraOpDoc {
  surgeryId: string;
  procedureNotes: string;
  implantsUsed: string[];
  bloodProducts: { type: string; units: number; time: string }[];
  specimens: { name: string; container: string; time: string }[];
  complications: string[];
  estimatedBloodLoss: number;
  fluidBalance: { intake: number; output: number };
}

export interface PacuRecord {
  surgeryId: string;
  patientName: string;
  uhid: string;
  arrivalTime: string;
  phase: PacuPhase;
  aldreteScore: number;
  painScore: number;
  vitals: { time: string; bp: string; hr: number; spo2: number; rr: number; temp: number }[];
  medications: { name: string; dose: string; route: string; time: string }[];
  dischargeCriteriaMet: boolean;
  dischargeTime?: string;
  destination: TransferDestination;
  receivingUnit?: string;
  receivingNurse?: string;
}

export interface TurnoverRecord {
  surgeryId: string;
  otRoom: string;
  otRoomId: string;
  previousSurgery: string;
  nextSurgery?: string;
  status: TurnoverStatus;
  cleaningAssignedTo: string;
  cleaningStarted?: string;
  cleaningEnded?: string;
  disinfectionDone: boolean;
  inspectionDone: boolean;
  inspectionBy?: string;
  roomReady: boolean;
  turnoverTime?: number;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  detail: string;
  patientName?: string;
  surgeryId?: string;
  ipAddress: string;
}

/* ------------------------------------------------------------------ */
/* Surgeons                                                             */
/* ------------------------------------------------------------------ */

export const SURGEONS: Surgeon[] = [
  { id: "SG-01", name: "Dr. Arjun Mehta", specialty: "Cardiac Surgery", availability: "In Surgery" },
  { id: "SG-02", name: "Dr. Sneha Iyer", specialty: "Orthopaedics", availability: "Available" },
  { id: "SG-03", name: "Dr. Vikram Rao", specialty: "Neurosurgery", availability: "Available" },
  { id: "SG-04", name: "Dr. Kavya Nair", specialty: "General Surgery", availability: "In Surgery" },
  { id: "SG-05", name: "Dr. Rohan Deshmukh", specialty: "Orthopaedics", availability: "On Call" },
  { id: "SG-06", name: "Dr. Ananya Gupta", specialty: "Gynaecology", availability: "Available" },
  { id: "SG-07", name: "Dr. Priya Kulkarni", specialty: "Ophthalmology", availability: "Available" },
  { id: "SG-08", name: "Dr. Imran Sheikh", specialty: "General Surgery", availability: "Off Duty" },
];

/* ------------------------------------------------------------------ */
/* Anesthesiologists                                                    */
/* ------------------------------------------------------------------ */

export const ANESTHESIOLOGISTS: Anesthesiologist[] = [
  { id: "AN-01", name: "Dr. Suresh Patil", availability: "In Surgery" },
  { id: "AN-02", name: "Dr. Meena Bhatt", availability: "Available" },
  { id: "AN-03", name: "Dr. Rakesh Kulkarni", availability: "On Call" },
  { id: "AN-04", name: "Dr. Nandini Sharma", availability: "Available" },
];

/* ------------------------------------------------------------------ */
/* OT Rooms                                                             */
/* ------------------------------------------------------------------ */

export const OT_ROOMS: OTRoom[] = [
  { id: "OT-01", number: "OT-1", name: "Major OT-1", floor: 2, status: "Occupied", type: "Cardiac", currentSurgery: "CABG — Rajesh Kumar", equipment: ["Heart-Lung Machine", "Defibrillator", "C-Arm"], lastSterilized: "2026-07-22 06:00", ac: true },
  { id: "OT-02", number: "OT-2", name: "Major OT-2", floor: 2, status: "Occupied", type: "Ortho", currentSurgery: "TKR — Vikram Patil", equipment: ["C-Arm", "Tourniquet", "Arthroscopy Stack"], lastSterilized: "2026-07-22 06:30", ac: true },
  { id: "OT-03", number: "OT-3", name: "Major OT-3", floor: 2, status: "Available", type: "Neuro", equipment: ["Microscope", "Navigation System", "C-Arm"], lastSterilized: "2026-07-22 08:00", ac: true },
  { id: "OT-04", number: "OT-4", name: "Minor OT-1", floor: 2, status: "Available", type: "General", equipment: ["Laparoscopic Stack", "Electrocautery"], lastSterilized: "2026-07-22 07:30", ac: true },
  { id: "OT-05", number: "OT-5", name: "Minor OT-2", floor: 2, status: "Cleaning", type: "Laparoscopic", equipment: ["Laparoscopic Stack", "Harmonic Scalpel"], ac: true },
  { id: "OT-06", number: "OT-6", name: "Emergency OT", floor: 1, status: "Available", type: "General", equipment: ["Full Surgical Tray", "Defibrillator"], lastSterilized: "2026-07-22 05:00", ac: true },
  { id: "OT-07", number: "OT-7", name: "Hybrid OT", floor: 2, status: "Reserved", type: "Hybrid", equipment: ["C-Arm Flat Panel", "Navigation", "Microscope", "I-Arm"], lastSterilized: "2026-07-22 04:00", ac: true },
  { id: "OT-08", number: "OT-8", name: "Day Surgery-1", floor: 3, status: "Available", type: "General", equipment: ["Basic Surgical Tray"], lastSterilized: "2026-07-22 07:00", ac: true },
];

/* ------------------------------------------------------------------ */
/* Surgeries (today = 2026-07-23)                                      */
/* ------------------------------------------------------------------ */

export const SURGERIES: Surgery[] = [
  { id: "SRG-001", uhid: "MRD-2026-004821", patientName: "Rajesh Kumar", age: 47, gender: "Male", blood: "B+", procedure: "CABG (Triple Bypass)", procedureCode: "CPT-33533", surgeon: "Dr. Arjun Mehta", surgeonId: "SG-01", assistantSurgeon: "Dr. Kavya Nair", anesthesiologist: "Dr. Suresh Patil", anesthesiaType: "General", otRoom: "OT-1", otRoomId: "OT-01", scheduledDate: "2026-07-23", scheduledTime: "07:30", estimatedDuration: 240, actualStartTime: "07:45", status: "In Progress", priority: "Urgent", diagnosis: "Triple vessel coronary artery disease", asaClass: "III", riskScore: "High", consentStatus: "Verified", whoChecklistComplete: true },
  { id: "SRG-002", uhid: "MRD-2026-004840", patientName: "Vikram Patil", age: 55, gender: "Male", blood: "O+", procedure: "Total Knee Replacement (Left)", procedureCode: "CPT-27447", surgeon: "Dr. Sneha Iyer", surgeonId: "SG-02", anesthesiologist: "Dr. Meena Bhatt", anesthesiaType: "Spinal", otRoom: "OT-2", otRoomId: "OT-02", scheduledDate: "2026-07-23", scheduledTime: "08:00", estimatedDuration: 150, actualStartTime: "08:15", status: "In Progress", priority: "Routine", diagnosis: "Severe osteoarthritis left knee", asaClass: "II", riskScore: "Low", consentStatus: "Verified", whoChecklistComplete: true },
  { id: "SRG-003", uhid: "MRD-2026-004841", patientName: "Kavita Joshi", age: 65, gender: "Female", blood: "A-", procedure: "Laparoscopic Cholecystectomy", procedureCode: "CPT-47562", surgeon: "Dr. Kavya Nair", surgeonId: "SG-04", anesthesiologist: "Dr. Nandini Sharma", anesthesiaType: "General", otRoom: "OT-4", otRoomId: "OT-04", scheduledDate: "2026-07-23", scheduledTime: "09:00", estimatedDuration: 90, status: "Scheduled", priority: "Routine", diagnosis: "Symptomatic gallstones", asaClass: "II", riskScore: "Low", consentStatus: "Signed", whoChecklistComplete: false },
  { id: "SRG-004", uhid: "MRD-2026-004842", patientName: "Priya Sharma", age: 34, gender: "Female", blood: "AB+", procedure: "Cesarean Section", procedureCode: "CPT-59510", surgeon: "Dr. Ananya Gupta", surgeonId: "SG-06", anesthesiologist: "Dr. Rakesh Kulkarni", anesthesiaType: "Regional", otRoom: "OT-3", otRoomId: "OT-03", scheduledDate: "2026-07-23", scheduledTime: "10:00", estimatedDuration: 60, status: "Scheduled", priority: "Urgent", diagnosis: "Breech presentation — planned LSCS", asaClass: "I", riskScore: "Low", consentStatus: "Verified", whoChecklistComplete: false },
  { id: "SRG-005", uhid: "MRD-2026-004843", patientName: "Mohammed Ansari", age: 38, gender: "Male", blood: "O-", procedure: "Inguinal Hernia Repair (Right)", procedureCode: "CPT-49505", surgeon: "Dr. Imran Sheikh", surgeonId: "SG-08", anesthesiologist: "Dr. Meena Bhatt", anesthesiaType: "General", otRoom: "OT-5", otRoomId: "OT-05", scheduledDate: "2026-07-23", scheduledTime: "11:00", estimatedDuration: 75, status: "Scheduled", priority: "Routine", diagnosis: "Right indirect inguinal hernia", asaClass: "I", riskScore: "Low", consentStatus: "Pending", whoChecklistComplete: false },
  { id: "SRG-006", uhid: "MRD-2026-004844", patientName: "Lakshmi Iyer", age: 70, gender: "Female", blood: "AB+", procedure: "Hip Hemiarthroplasty (Right)", procedureCode: "CPT-27125", surgeon: "Dr. Sneha Iyer", surgeonId: "SG-02", anesthesiologist: "Dr. Suresh Patil", anesthesiaType: "Spinal", otRoom: "OT-7", otRoomId: "OT-07", scheduledDate: "2026-07-23", scheduledTime: "13:00", estimatedDuration: 120, status: "Scheduled", priority: "Urgent", diagnosis: "Right femoral neck fracture", asaClass: "III", riskScore: "Medium", consentStatus: "Signed", whoChecklistComplete: false },
  { id: "SRG-007", uhid: "MRD-2026-004845", patientName: "Arun Verma", age: 52, gender: "Male", blood: "B+", procedure: "Craniotomy — Tumor Excision", procedureCode: "CPT-61510", surgeon: "Dr. Vikram Rao", surgeonId: "SG-03", anesthesiologist: "Dr. Nandini Sharma", anesthesiaType: "General", otRoom: "OT-3", otRoomId: "OT-03", scheduledDate: "2026-07-23", scheduledTime: "14:00", estimatedDuration: 300, status: "Scheduled", priority: "Routine", diagnosis: "Right temporal glioblastoma", asaClass: "II", riskScore: "High", consentStatus: "Verified", whoChecklistComplete: false },
  { id: "SRG-008", uhid: "MRD-2026-004846", patientName: "Sunita Reddy", age: 54, gender: "Female", blood: "O+", procedure: "Laparoscopic Hysterectomy", procedureCode: "CPT-58571", surgeon: "Dr. Ananya Gupta", surgeonId: "SG-06", anesthesiologist: "Dr. Meena Bhatt", anesthesiaType: "General", otRoom: "OT-5", otRoomId: "OT-05", scheduledDate: "2026-07-23", scheduledTime: "15:00", estimatedDuration: 120, status: "Scheduled", priority: "Routine", diagnosis: "Large uterine fibroids — menorrhagia", asaClass: "II", riskScore: "Low", consentStatus: "Pending", whoChecklistComplete: false },
  { id: "SRG-009", uhid: "MRD-2026-004847", patientName: "Ravi Gaikwad", age: 62, gender: "Male", blood: "A+", procedure: "Cataract Surgery — Phaco (Right)", procedureCode: "CPT-66984", surgeon: "Dr. Priya Kulkarni", surgeonId: "SG-07", anesthesiologist: "Dr. Rakesh Kulkarni", anesthesiaType: "Local", otRoom: "OT-8", otRoomId: "OT-08", scheduledDate: "2026-07-23", scheduledTime: "09:30", estimatedDuration: 30, status: "Completed", priority: "Routine", diagnosis: "Right senile cataract — Grade III", asaClass: "I", riskScore: "Low", consentStatus: "Verified", whoChecklistComplete: true, actualStartTime: "09:35", actualEndTime: "10:02" },
];

/* ------------------------------------------------------------------ */
/* Pre-Operative Assessments                                            */
/* ------------------------------------------------------------------ */

export const PRE_OP_ASSESSMENTS: PreOpAssessment[] = [
  { surgeryId: "SRG-001", patientName: "Rajesh Kumar", uhid: "MRD-2026-004821", asaClass: "III", riskScore: "High", airwayAssessment: "Mallampati II — Normal airway", allergies: "Penicillin", currentMedications: "Metoprolol 50mg, Aspirin 75mg, Atorvastatin 20mg", labClearance: true, radiologyClearance: true, anesthesiaClearance: true, surgicalClearance: true, notes: "Dual antiplatelet stopped 5 days pre-op. Bridging with heparin." },
  { surgeryId: "SRG-002", patientName: "Vikram Patil", uhid: "MRD-2026-004840", asaClass: "II", riskScore: "Low", airwayAssessment: "Mallampati I — Normal", allergies: "NKDA", currentMedications: "Amlodipine 5mg, Paracetamol PRN", labClearance: true, radiologyClearance: true, anesthesiaClearance: true, surgicalClearance: true, notes: "Routine pre-op. No contraindications." },
  { surgeryId: "SRG-003", patientName: "Kavita Joshi", uhid: "MRD-2026-004841", asaClass: "II", riskScore: "Low", airwayAssessment: "Mallampati II — Normal", allergies: "Sulfa drugs", currentMedications: "Omeprazole 20mg", labClearance: true, radiologyClearance: true, anesthesiaClearance: true, surgicalClearance: true, notes: "ERCP performed last week. CBD clear." },
  { surgeryId: "SRG-004", patientName: "Priya Sharma", uhid: "MRD-2026-004842", asaClass: "I", riskScore: "Low", airwayAssessment: "Mallampati I — Normal", allergies: "NKDA", currentMedications: "Iron supplements, Folic acid", labClearance: true, radiologyClearance: true, anesthesiaClearance: true, surgicalClearance: true, notes: "G2P1. Previous LSCS scar. Breech at 38 weeks." },
];

/* ------------------------------------------------------------------ */
/* Consents                                                             */
/* ------------------------------------------------------------------ */

export const CONSENTS: Consent[] = [
  { id: "CON-001", surgeryId: "SRG-001", patientName: "Rajesh Kumar", uhid: "MRD-2026-004821", consentType: "Procedure", status: "Verified", signedBy: "Rajesh Kumar", witnessBy: "Dr. Kavya Nair", signedAt: "2026-07-22 16:00", verifiedBy: "Dr. Arjun Mehta", verifiedAt: "2026-07-22 16:30" },
  { id: "CON-002", surgeryId: "SRG-001", patientName: "Rajesh Kumar", uhid: "MRD-2026-004821", consentType: "Anesthesia", status: "Verified", signedBy: "Rajesh Kumar", witnessBy: "OT Nurse", signedAt: "2026-07-22 16:00", verifiedBy: "Dr. Suresh Patil", verifiedAt: "2026-07-22 16:45" },
  { id: "CON-003", surgeryId: "SRG-001", patientName: "Rajesh Kumar", uhid: "MRD-2026-004821", consentType: "Blood Transfusion", status: "Verified", signedBy: "Rajesh Kumar", witnessBy: "Dr. Kavya Nair", signedAt: "2026-07-22 16:05", verifiedBy: "Dr. Suresh Patil", verifiedAt: "2026-07-22 16:50" },
  { id: "CON-004", surgeryId: "SRG-002", patientName: "Vikram Patil", uhid: "MRD-2026-004840", consentType: "Procedure", status: "Verified", signedBy: "Vikram Patil", witnessBy: "OT Nurse", signedAt: "2026-07-22 17:00", verifiedBy: "Dr. Sneha Iyer", verifiedAt: "2026-07-22 17:30" },
  { id: "CON-005", surgeryId: "SRG-002", patientName: "Vikram Patil", uhid: "MRD-2026-004840", consentType: "Implant", status: "Verified", signedBy: "Vikram Patil", witnessBy: "OT Nurse", signedAt: "2026-07-22 17:05", verifiedBy: "Dr. Sneha Iyer", verifiedAt: "2026-07-22 17:35" },
  { id: "CON-006", surgeryId: "SRG-003", patientName: "Kavita Joshi", uhid: "MRD-2026-004841", consentType: "Procedure", status: "Signed", signedBy: "Kavita Joshi", witnessBy: "Ward Nurse", signedAt: "2026-07-22 18:00" },
  { id: "CON-007", surgeryId: "SRG-005", patientName: "Mohammed Ansari", uhid: "MRD-2026-004843", consentType: "Procedure", status: "Pending" },
  { id: "CON-008", surgeryId: "SRG-006", patientName: "Lakshmi Iyer", uhid: "MRD-2026-004844", consentType: "Procedure", status: "Signed", signedBy: "Lakshmi Iyer (Son)", witnessBy: "Ward Nurse", signedAt: "2026-07-22 15:00" },
];

/* ------------------------------------------------------------------ */
/* Team Assignments                                                     */
/* ------------------------------------------------------------------ */

export const TEAM_ASSIGNMENTS: TeamAssignment[] = [
  { surgeryId: "SRG-001", patientName: "Rajesh Kumar", procedure: "CABG (Triple Bypass)", primarySurgeon: "Dr. Arjun Mehta", assistantSurgeon: "Dr. Kavya Nair", anesthesiologist: "Dr. Suresh Patil", scrubNurse: "Asha Kute", circulatingNurse: "Sunita Shinde", technician: "Ramesh Jadhav", perfusionist: "Sanjay Mane" },
  { surgeryId: "SRG-002", patientName: "Vikram Patil", procedure: "TKR (Left)", primarySurgeon: "Dr. Sneha Iyer", anesthesiologist: "Dr. Meena Bhatt", scrubNurse: "Priya Deshmukh", circulatingNurse: "Anita Jadhav", technician: "Vishal Mane" },
  { surgeryId: "SRG-003", patientName: "Kavita Joshi", procedure: "Lap Chole", primarySurgeon: "Dr. Kavya Nair", anesthesiologist: "Dr. Nandini Sharma", scrubNurse: "Meena Kute", circulatingNurse: "Kavita Patil" },
  { surgeryId: "SRG-004", patientName: "Priya Sharma", procedure: "LSCS", primarySurgeon: "Dr. Ananya Gupta", anesthesiologist: "Dr. Rakesh Kulkarni", scrubNurse: "Lata Bhave", circulatingNurse: "Neha Patil" },
];

/* ------------------------------------------------------------------ */
/* Equipment & Instruments                                              */
/* ------------------------------------------------------------------ */

export const EQUIPMENT: EquipmentItem[] = [
  { id: "EQ-01", name: "Major Surgical Tray A", category: "Instrument Set", status: "In Use", sterilizationStatus: "Sterile", sterilizedAt: "2026-07-22 06:00", expiresAt: "2026-07-25 06:00", surgeryId: "SRG-001" },
  { id: "EQ-02", name: "Ortho Instrument Set", category: "Instrument Set", status: "In Use", sterilizationStatus: "Sterile", sterilizedAt: "2026-07-22 06:30", expiresAt: "2026-07-25 06:30", surgeryId: "SRG-002" },
  { id: "EQ-03", name: "Laparoscopic Stack", category: "Equipment", status: "Available", sterilizationStatus: "Sterile", sterilizedAt: "2026-07-22 07:30", expiresAt: "2026-07-25 07:30" },
  { id: "EQ-04", name: "C-Arm Fluoroscopy", category: "Equipment", status: "In Use", sterilizationStatus: "Sterile", surgeryId: "SRG-001" },
  { id: "EQ-05", name: "Heart-Lung Machine", category: "Equipment", status: "In Use", sterilizationStatus: "Sterile", surgeryId: "SRG-001" },
  { id: "EQ-06", name: "Neurosurgery Microscope", category: "Equipment", status: "Available", sterilizationStatus: "Sterile", sterilizedAt: "2026-07-22 08:00", expiresAt: "2026-07-25 08:00" },
  { id: "EQ-07", name: "TKR Implant Set — Smith+Nephew", category: "Implant", status: "Reserved", sterilizationStatus: "Sterile", sterilizedAt: "2026-07-22 07:00", expiresAt: "2026-07-25 07:00", surgeryId: "SRG-002" },
  { id: "EQ-08", name: "Drapes & Gowns Pack", category: "Consumable", status: "Available", sterilizationStatus: "Sterile", sterilizedAt: "2026-07-22 05:00", expiresAt: "2026-07-24 05:00" },
  { id: "EQ-09", name: "Diathermy Unit", category: "Equipment", status: "Available", sterilizationStatus: "Sterile" },
  { id: "EQ-10", name: "Anaesthesia Machine", category: "Equipment", status: "In Use", sterilizationStatus: "Sterile", surgeryId: "SRG-001" },
  { id: "EQ-11", name: "Suction Unit", category: "Equipment", status: "Available", sterilizationStatus: "Sterile" },
  { id: "EQ-12", name: "Phaco Handpiece", category: "Equipment", status: "Available", sterilizationStatus: "Sterile", sterilizedAt: "2026-07-22 08:30", expiresAt: "2026-07-25 08:30" },
];

/* ------------------------------------------------------------------ */
/* Anesthesia Records                                                   */
/* ------------------------------------------------------------------ */

export const ANESTHESIA_RECORDS: AnesthesiaRecord[] = [
  {
    surgeryId: "SRG-001", patientName: "Rajesh Kumar", anesthesiaType: "General", inductionTime: "07:40", intubationTime: "07:45",
    drugs: [
      { name: "Propofol", dose: "200mg", time: "07:40" },
      { name: "Fentanyl", dose: "200mcg", time: "07:41" },
      { name: "Rocuronium", dose: "60mg", time: "07:42" },
      { name: "Sevoflurane", dose: "2%", time: "07:45" },
      { name: "Noradrenaline", dose: "0.1mcg/kg/min", time: "08:15" },
    ],
    vitals: [
      { time: "07:45", bp: "130/80", hr: 72, spo2: 100, etco2: 35, temp: 36.4 },
      { time: "08:00", bp: "118/72", hr: 68, spo2: 100, etco2: 34, temp: 36.2 },
      { time: "08:30", bp: "105/65", hr: 74, spo2: 99, etco2: 36, temp: 36.1 },
      { time: "09:00", bp: "110/68", hr: 76, spo2: 100, etco2: 35, temp: 36.0 },
    ],
    ventilatorSettings: { tv: 500, rr: 12, fio2: 50, peep: 5 },
  },
  {
    surgeryId: "SRG-002", patientName: "Vikram Patil", anesthesiaType: "Spinal", inductionTime: "08:05", intubationTime: "08:10",
    drugs: [
      { name: "Bupivacaine 0.5%", dose: "15mg Intrathecal", time: "08:05" },
      { name: "Midazolam", dose: "2mg IV", time: "08:06" },
      { name: "Fentanyl", dose: "50mcg Intrathecal", time: "08:06" },
    ],
    vitals: [
      { time: "08:10", bp: "135/82", hr: 74, spo2: 99, etco2: 0, temp: 36.5 },
      { time: "08:30", bp: "118/70", hr: 68, spo2: 99, etco2: 0, temp: 36.3 },
      { time: "09:00", bp: "122/74", hr: 70, spo2: 100, etco2: 0, temp: 36.2 },
    ],
    ventilatorSettings: { tv: 0, rr: 0, fio2: 0, peep: 0 },
  },
];

/* ------------------------------------------------------------------ */
/* PACU Records                                                         */
/* ------------------------------------------------------------------ */

export const PACU_RECORDS: PacuRecord[] = [
  {
    surgeryId: "SRG-009", patientName: "Ravi Gaikwad", uhid: "MRD-2026-004847", arrivalTime: "10:10", phase: "Phase II", aldreteScore: 9, painScore: 2,
    vitals: [
      { time: "10:15", bp: "130/80", hr: 72, spo2: 98, rr: 16, temp: 36.5 },
      { time: "10:30", bp: "128/78", hr: 70, spo2: 99, rr: 14, temp: 36.6 },
    ],
    medications: [{ name: "Paracetamol", dose: "1g", route: "IV", time: "10:15" }],
    dischargeCriteriaMet: true, dischargeTime: "10:45", destination: "Home", receivingUnit: "OPD",
  },
];

/* ------------------------------------------------------------------ */
/* Turnover Records                                                     */
/* ------------------------------------------------------------------ */

export const TURNOVER_RECORDS: TurnoverRecord[] = [
  { surgeryId: "SRG-009", otRoom: "Day Surgery-1", otRoomId: "OT-08", previousSurgery: "Cataract — Ravi Gaikwad", status: "In Progress", cleaningAssignedTo: "Ramesh Jadhav", cleaningStarted: "10:05", disinfectionDone: false, inspectionDone: false, roomReady: false, turnoverTime: 25 },
  { surgeryId: "SRG-001", otRoom: "Major OT-1", otRoomId: "OT-01", previousSurgery: "CABG — Rajesh Kumar", status: "Pending", cleaningAssignedTo: "Sunil Mane", disinfectionDone: false, inspectionDone: false, roomReady: false },
];

/* ------------------------------------------------------------------ */
/* Audit Logs                                                           */
/* ------------------------------------------------------------------ */

export const AUDIT_LOGS: AuditEntry[] = [
  { id: "AUD-OT-001", timestamp: "2026-07-23 07:30:00", user: "OT Coordinator", role: "OT Coordinator", action: "Surgery Started", detail: "CABG — Rajesh Kumar started in OT-1. Surgeon: Dr. Arjun Mehta.", patientName: "Rajesh Kumar", surgeryId: "SRG-001", ipAddress: "10.0.3.301" },
  { id: "AUD-OT-002", timestamp: "2026-07-23 07:45:00", user: "Dr. Suresh Patil", role: "Anesthesiologist", action: "Anesthesia Induction", detail: "General anesthesia induced for CABG — Rajesh Kumar.", patientName: "Rajesh Kumar", surgeryId: "SRG-001", ipAddress: "10.0.3.302" },
  { id: "AUD-OT-003", timestamp: "2026-07-23 08:00:00", user: "OT Coordinator", role: "OT Coordinator", action: "Surgery Started", detail: "TKR (Left) — Vikram Patil started in OT-2. Surgeon: Dr. Sneha Iyer.", patientName: "Vikram Patil", surgeryId: "SRG-002", ipAddress: "10.0.3.301" },
  { id: "AUD-OT-004", timestamp: "2026-07-23 08:15:00", user: "Dr. Meena Bhatt", role: "Anesthesiologist", action: "Spinal Anesthesia", detail: "Spinal anesthesia administered for TKR — Vikram Patil.", patientName: "Vikram Patil", surgeryId: "SRG-002", ipAddress: "10.0.3.303" },
  { id: "AUD-OT-005", timestamp: "2026-07-23 09:35:00", user: "Dr. Priya Kulkarni", role: "Surgeon", action: "Procedure Started", detail: "Cataract surgery — Phaco started for Ravi Gaikwad in OT-8.", patientName: "Ravi Gaikwad", surgeryId: "SRG-009", ipAddress: "10.0.3.304" },
  { id: "AUD-OT-006", timestamp: "2026-07-23 10:02:00", user: "Dr. Priya Kulkarni", role: "Surgeon", action: "Procedure Completed", detail: "Cataract surgery completed for Ravi Gaikwad. Duration: 27 min. Outcome: Routine.", patientName: "Ravi Gaikwad", surgeryId: "SRG-009", ipAddress: "10.0.3.304" },
  { id: "AUD-OT-007", timestamp: "2026-07-23 10:10:00", user: "PACU Nurse", role: "PACU Nurse", action: "PACU Transfer", detail: "Ravi Gaikwad transferred to PACU. Aldrete Score: 9.", patientName: "Ravi Gaikwad", surgeryId: "SRG-009", ipAddress: "10.0.3.305" },
  { id: "AUD-OT-008", timestamp: "2026-07-23 10:45:00", user: "PACU Nurse", role: "PACU Nurse", action: "PACU Discharge", detail: "Ravi Gaikwad discharged from PACU. Destination: Home/OPD.", patientName: "Ravi Gaikwad", surgeryId: "SRG-009", ipAddress: "10.0.3.305" },
];

/* ------------------------------------------------------------------ */
/* Helpers                                                              */
/* ------------------------------------------------------------------ */

export function surgeryStatusTone(s: SurgeryStatus): "brand" | "success" | "warning" | "danger" | "info" | "neutral" {
  switch (s) {
    case "Scheduled": return "info";
    case "Confirmed": return "brand";
    case "Pre-Op Ready": return "success";
    case "In Progress": return "warning";
    case "Closing": return "warning";
    case "Completed": return "success";
    case "Cancelled": return "danger";
    case "Emergency": return "danger";
    default: return "neutral";
  }
}

export function otRoomStatusTone(s: OTRoomStatus): "brand" | "success" | "warning" | "danger" | "info" {
  switch (s) {
    case "Available": return "success";
    case "Occupied": return "danger";
    case "Cleaning": return "warning";
    case "Reserved": return "info";
    case "Maintenance": return "warning";
    default: return "info";
  }
}

export function consentStatusTone(s: ConsentStatus): "success" | "warning" | "info" | "danger" {
  switch (s) {
    case "Verified": return "success";
    case "Signed": return "warning";
    case "Pending": return "info";
    case "Rejected": return "danger";
    default: return "info";
  }
}
