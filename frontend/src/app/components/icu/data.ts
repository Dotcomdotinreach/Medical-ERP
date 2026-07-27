/* ------------------------------------------------------------------ */
/* Realistic mock ICU data for Meridian Multi-Speciality Hospital       */
/* ------------------------------------------------------------------ */

export type ICUBedStatus = "Occupied" | "Available" | "Cleaning" | "Reserved" | "Maintenance" | "Blocked";
export type CriticalityLevel = "Critical" | "Serious" | "Stable" | "Improving" | "Deteriorating";
export type VentilatorMode = "SIMV" | "AC/VC" | "AC/PC" | "PSV" | "CPAP" | "NIV" | "Offline";
export type IsolationLevel = "None" | "Contact" | "Droplet" | "Airborne" | "Negative Pressure";
export type AdmissionSource = "Emergency" | "OT" | "Ward" | "Other Hospital" | "Direct";
export type CodeBlueStatus = "Active" | "Resolved" | "Deceased" | "Cancelled";
export type TransferDestination = "Ward" | "Step-Down" | "Other Hospital" | "Home" | "Deceased";
export type SedationScale = "RASS -4" | "RASS -3" | "RASS -2" | "RASS -1" | "RASS 0" | "RASS +1" | "RASS +2" | "RASS +3" | "RASS +4";
export type PainScale = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10";

export interface ICUBed {
  id: string;
  number: string;
  roomId: string;
  roomNumber: string;
  status: ICUBedStatus;
  type: "Medical" | "Surgical" | "Cardiac" | "Neuro" | "Isolation" | "Negative Pressure";
  onVentilator: boolean;
  hasMonitor: boolean;
  hasInfusionPumps: boolean;
  patientName?: string;
  uhid?: string;
  intensivist?: string;
  nurse?: string;
  admissionDate?: string;
  isolationLevel: IsolationLevel;
}

export interface ICUPatient {
  uhid: string;
  admissionId: string;
  patientName: string;
  age: number;
  gender: "Male" | "Female";
  blood: string;
  intensivist: string;
  primaryNurse: string;
  department: string;
  bed: string;
  bedId: string;
  admissionDate: string;
  admissionSource: AdmissionSource;
  diagnosis: string;
  secondaryDiagnosis?: string;
  criticality: CriticalityLevel;
  isolationLevel: IsolationLevel;
  onVentilator: boolean;
  ventilatorMode?: VentilatorMode;
  daysInICU: number;
  gcs: number;
  sofa: number;
  apache: number;
  news2: number;
}

export interface VentilatorRecord {
  patientName: string;
  bed: string;
  mode: VentilatorMode;
  settings: {
    fio2: number;
    peep: number;
    tv: number;
    rr: number;
    ipap?: number;
    map?: number;
    pmax?: number;
    pplat?: number;
  };
  alarms: { parameter: string; status: "Normal" | "Warning" | "Critical" }[];
  startTime: string;
  lastChecked: string;
}

export interface InfusionPump {
  id: string;
  drugName: string;
  concentration: string;
  rate: string;
  doseUnit: string;
  remainingVolume: string;
  batteryPercent: number;
  occlusionStatus: "Normal" | "Occluded" | "Air Detected" | "Done";
  status: "Running" | "Paused" | "Stopped" | "Alarm";
  patientName: string;
  startTime: string;
}

export interface ClinicalScore {
  patientName: string;
  apacheII: number;
  sofa: number;
  gcs: { eye: number; verbal: number; motor: number; total: number };
  news2: number;
  qsofa: number;
  sepsisScreen: "Positive" | "Negative";
  painScore: number;
  sedationScale: SedationScale;
  assessedBy: string;
  assessedAt: string;
  trend: { date: string; sofa: number; apache: number; gcs: number }[];
}

export interface MedicationRecord {
  patientName: string;
  medications: { name: string; type: string; dose: string; route: string; frequency: string; status: "Active" | "Completed" | "Paused" | "Pending" }[];
}

export interface DailyRound {
  patientName: string;
  bed: string;
  intensivist: string;
  roundTime: string;
  vitalsSummary: string;
  labSummary: string;
  ventSummary: string;
  fluidBalance: string;
  nutritionSummary: string;
  todaysGoals: string[];
  consultNotes: string;
  plan: string;
}

export interface CodeBlueRecord {
  id: string;
  patientName: string;
  bed: string;
  activatedBy: string;
  activatedAt: string;
  teamLead: string;
  teamMembers: string[];
  duration: number;
  interventions: string[];
  defibrillations: number;
  medications: string[];
  outcome: "ROSC" | "Deceased" | "Transferred" | "Continue CPR";
  status: CodeBlueStatus;
  postCodeNotes: string;
}

export interface FamilyUpdate {
  patientName: string;
  contactName: string;
  contactRelation: string;
  contactPhone: string;
  updates: { date: string; time: string; update: string; givenBy: string }[];
  meetingHistory: { date: string; time: string; notes: string; conductedBy: string }[];
  nextMeeting: string;
  consentRequests: string[];
}

export interface RecoveryAssessment {
  patientName: string;
  ventilatorWeaning: "Not Started" | "In Progress" | "Completed" | "Failed";
  sedationAssessment: string;
  mobilityAssessment: string;
  neurologicalStatus: string;
  readinessForTransfer: boolean;
  doctorApproval: boolean;
  nurseApproval: boolean;
}

export interface EquipmentItem {
  id: string;
  name: string;
  category: string;
  status: "In Use" | "Available" | "Under Maintenance" | "Alarm" | "Reserved";
  assignedTo?: string;
  bedNumber?: string;
  lastServiced?: string;
  nextService?: string;
  errorLog?: string;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  detail: string;
  patientName?: string;
  ipAddress: string;
}

/* ------------------------------------------------------------------ */
/* ICU Beds                                                             */
/* ------------------------------------------------------------------ */

export const ICU_BEDS: ICUBed[] = [
  { id: "ICU-B01", number: "B01", roomId: "ICU-R01", roomNumber: "ICU-01", status: "Occupied", type: "Cardiac", onVentilator: true, hasMonitor: true, hasInfusionPumps: true, patientName: "Rajesh Kumar", uhid: "MRD-2026-004821", intensivist: "Dr. Imran Sheikh", nurse: "Lata Bhave", admissionDate: "2026-07-22", isolationLevel: "None" },
  { id: "ICU-B02", number: "B02", roomId: "ICU-R02", roomNumber: "ICU-02", status: "Occupied", type: "Medical", onVentilator: true, hasMonitor: true, hasInfusionPumps: true, patientName: "Anil Kulkarni", uhid: "MRD-2026-004833", intensivist: "Dr. Imran Sheikh", nurse: "Suman Khandekar", admissionDate: "2026-07-21", isolationLevel: "Airborne" },
  { id: "ICU-B03", number: "B03", roomId: "ICU-R03", roomNumber: "ICU-03", status: "Occupied", type: "Surgical", onVentilator: true, hasMonitor: true, hasInfusionPumps: true, patientName: "Ganesh More", uhid: "MRD-2026-004830", intensivist: "Dr. Kavya Nair", nurse: "Asha Kute", admissionDate: "2026-07-22", isolationLevel: "None" },
  { id: "ICU-B04", number: "B04", roomId: "ICU-R04", roomNumber: "ICU-04", status: "Occupied", type: "Neuro", onVentilator: true, hasMonitor: true, hasInfusionPumps: true, patientName: "Lakshmi Iyer", uhid: "MRD-2026-004824", intensivist: "Dr. Imran Sheikh", nurse: "Priya Deshmukh", admissionDate: "2026-07-20", isolationLevel: "None" },
  { id: "ICU-B05", number: "B05", roomId: "ICU-R05", roomNumber: "ICU-05", status: "Occupied", type: "Medical", onVentilator: false, hasMonitor: true, hasInfusionPumps: true, patientName: "Mohammed Ansari", uhid: "MRD-2026-004825", intensivist: "Dr. Kavya Nair", nurse: "Anita Jadhav", admissionDate: "2026-07-22", isolationLevel: "Droplet" },
  { id: "ICU-B06", number: "B06", roomId: "ICU-R06", roomNumber: "ICU-06", status: "Available", type: "Medical", onVentilator: true, hasMonitor: true, hasInfusionPumps: true, isolationLevel: "None" },
  { id: "ICU-B07", number: "B07", roomId: "ICU-R07", roomNumber: "ICU-07", status: "Cleaning", type: "Isolation", onVentilator: true, hasMonitor: true, hasInfusionPumps: true, isolationLevel: "Negative Pressure" },
  { id: "ICU-B08", number: "B08", roomId: "ICU-R08", roomNumber: "ICU-08", status: "Reserved", type: "Cardiac", onVentilator: true, hasMonitor: true, hasInfusionPumps: true, isolationLevel: "None" },
  { id: "ICU-B09", number: "B09", roomId: "ICU-R09", roomNumber: "ICU-09", status: "Available", type: "Surgical", onVentilator: true, hasMonitor: true, hasInfusionPumps: true, isolationLevel: "None" },
  { id: "ICU-B10", number: "B10", roomId: "ICU-R10", roomNumber: "ICU-10", status: "Available", type: "Medical", onVentilator: false, hasMonitor: true, hasInfusionPumps: true, isolationLevel: "None" },
  { id: "ICU-B11", number: "B11", roomId: "ICU-R11", roomNumber: "ICU-11", status: "Maintenance", type: "Neuro", onVentilator: true, hasMonitor: false, hasInfusionPumps: true, isolationLevel: "None" },
  { id: "ICU-B12", number: "B12", roomId: "ICU-R12", roomNumber: "ICU-12", status: "Available", type: "Medical", onVentilator: true, hasMonitor: true, hasInfusionPumps: true, isolationLevel: "None" },
];

/* ------------------------------------------------------------------ */
/* ICU Patients                                                         */
/* ------------------------------------------------------------------ */

export const ICU_PATIENTS: ICUPatient[] = [
  { uhid: "MRD-2026-004821", admissionId: "ICU-ADM-001", patientName: "Rajesh Kumar", age: 47, gender: "Male", blood: "B+", intensivist: "Dr. Imran Sheikh", primaryNurse: "Lata Bhave", department: "Cardiology", bed: "B01", bedId: "ICU-B01", admissionDate: "2026-07-22", admissionSource: "OT", diagnosis: "Post-CABG cardiogenic shock", criticality: "Critical", isolationLevel: "None", onVentilator: true, ventilatorMode: "AC/VC", daysInICU: 1, gcs: 8, sofa: 9, apache: 22, news2: 12 },
  { uhid: "MRD-2026-004833", admissionId: "ICU-ADM-002", patientName: "Anil Kulkarni", age: 58, gender: "Male", blood: "B+", intensivist: "Dr. Imran Sheikh", primaryNurse: "Suman Khandekar", department: "Emergency Medicine", bed: "B02", bedId: "ICU-B02", admissionDate: "2026-07-21", admissionSource: "Emergency", diagnosis: "Septic shock — multi-organ dysfunction", criticality: "Critical", isolationLevel: "Airborne", onVentilator: true, ventilatorMode: "SIMV", daysInICU: 2, gcs: 6, sofa: 11, apache: 28, news2: 14 },
  { uhid: "MRD-2026-004830", admissionId: "ICU-ADM-003", patientName: "Ganesh More", age: 62, gender: "Male", blood: "O+", intensivist: "Dr. Kavya Nair", primaryNurse: "Asha Kute", department: "General Medicine", bed: "B03", bedId: "ICU-B03", admissionDate: "2026-07-22", admissionSource: "Ward", diagnosis: "Acute MI — post-PCI observation", criticality: "Serious", isolationLevel: "None", onVentilator: false, daysInICU: 1, gcs: 14, sofa: 3, apache: 12, news2: 7 },
  { uhid: "MRD-2026-004824", admissionId: "ICU-ADM-004", patientName: "Lakshmi Iyer", age: 70, gender: "Female", blood: "AB+", intensivist: "Dr. Imran Sheikh", primaryNurse: "Priya Deshmukh", department: "Cardiology", bed: "B04", bedId: "ICU-B04", admissionDate: "2026-07-20", admissionSource: "Emergency", diagnosis: "Stroke — ICH with raised ICP", criticality: "Critical", isolationLevel: "None", onVentilator: true, ventilatorMode: "AC/PC", daysInICU: 3, gcs: 5, sofa: 8, apache: 24, news2: 11 },
  { uhid: "MRD-2026-004825", admissionId: "ICU-ADM-005", patientName: "Mohammed Ansari", age: 38, gender: "Male", blood: "O-", intensivist: "Dr. Kavya Nair", primaryNurse: "Anita Jadhav", department: "Orthopaedics", bed: "B05", bedId: "ICU-B05", admissionDate: "2026-07-22", admissionSource: "OT", diagnosis: "Polytrauma — post-operative ICU care", criticality: "Serious", isolationLevel: "Droplet", onVentilator: false, daysInICU: 1, gcs: 13, sofa: 4, apache: 14, news2: 6 },
];

/* ------------------------------------------------------------------ */
/* Ventilator Records                                                   */
/* ------------------------------------------------------------------ */

export const VENTILATOR_RECORDS: VentilatorRecord[] = [
  {
    patientName: "Rajesh Kumar", bed: "B01", mode: "AC/VC",
    settings: { fio2: 50, peep: 8, tv: 450, rr: 14, pmax: 35, pplat: 28 },
    alarms: [
      { parameter: "SpO2", status: "Normal" },
      { parameter: "Ppeak", status: "Normal" },
      { parameter: "MV", status: "Normal" },
      { parameter: "Apnea", status: "Normal" },
    ],
    startTime: "2026-07-22 18:00", lastChecked: "2026-07-23 06:00",
  },
  {
    patientName: "Anil Kulkarni", bed: "B02", mode: "SIMV",
    settings: { fio2: 60, peep: 10, tv: 400, rr: 16, ipap: 18, pmax: 32, pplat: 30 },
    alarms: [
      { parameter: "SpO2", status: "Warning" },
      { parameter: "Ppeak", status: "Warning" },
      { parameter: "MV", status: "Normal" },
      { parameter: "Apnea", status: "Normal" },
    ],
    startTime: "2026-07-21 22:00", lastChecked: "2026-07-23 06:30",
  },
  {
    patientName: "Lakshmi Iyer", bed: "B04", mode: "AC/PC",
    settings: { fio2: 45, peep: 6, tv: 380, rr: 12, ipap: 16, pmax: 28, pplat: 24 },
    alarms: [
      { parameter: "SpO2", status: "Normal" },
      { parameter: "Ppeak", status: "Normal" },
      { parameter: "MV", status: "Normal" },
      { parameter: "Apnea", status: "Normal" },
    ],
    startTime: "2026-07-20 20:00", lastChecked: "2026-07-23 05:00",
  },
];

/* ------------------------------------------------------------------ */
/* Infusion Pumps                                                       */
/* ------------------------------------------------------------------ */

export const INFUSION_PUMPS: InfusionPump[] = [
  { id: "PUMP-01", drugName: "Noradrenaline", concentration: "4mg in 50ml NS", rate: "0.15 mcg/kg/min", doseUnit: "mcg/kg/min", remainingVolume: "38ml", batteryPercent: 92, occlusionStatus: "Normal", status: "Running", patientName: "Rajesh Kumar", startTime: "2026-07-22 18:30" },
  { id: "PUMP-02", drugName: "Dobutamine", concentration: "250mg in 50ml NS", rate: "5 mcg/kg/min", doseUnit: "mcg/kg/min", remainingVolume: "42ml", batteryPercent: 88, occlusionStatus: "Normal", status: "Running", patientName: "Rajesh Kumar", startTime: "2026-07-22 19:00" },
  { id: "PUMP-03", drugName: "Propofol", concentration: "200mg in 100ml", rate: "30 ml/hr", doseUnit: "ml/hr", remainingVolume: "72ml", batteryPercent: 95, occlusionStatus: "Normal", status: "Running", patientName: "Anil Kulkarni", startTime: "2026-07-21 22:30" },
  { id: "PUMP-04", drugName: "Fentanyl", concentration: "250mcg in 50ml NS", rate: "50 mcg/hr", doseUnit: "mcg/hr", remainingVolume: "44ml", batteryPercent: 78, occlusionStatus: "Normal", status: "Running", patientName: "Anil Kulkarni", startTime: "2026-07-21 22:30" },
  { id: "PUMP-05", drugName: "Vasopressin", concentration: "20U in 100ml NS", rate: "0.03 U/min", doseUnit: "U/min", remainingVolume: "85ml", batteryPercent: 100, occlusionStatus: "Normal", status: "Running", patientName: "Anil Kulkarni", startTime: "2026-07-22 04:00" },
  { id: "PUMP-06", drugName: "Insulin", concentration: "50U in 50ml NS", rate: "4 units/hr", doseUnit: "units/hr", remainingVolume: "46ml", batteryPercent: 65, occlusionStatus: "Normal", status: "Running", patientName: "Lakshmi Iyer", startTime: "2026-07-21 08:00" },
  { id: "PUMP-07", drugName: "Mannitol", concentration: "20% 500ml", rate: "125 ml/hr", doseUnit: "ml/hr", remainingVolume: "320ml", batteryPercent: 82, occlusionStatus: "Normal", status: "Running", patientName: "Lakshmi Iyer", startTime: "2026-07-21 10:00" },
  { id: "PUMP-08", drugName: "Heparin", concentration: "25000U in 500ml NS", rate: "800 U/hr", doseUnit: "U/hr", remainingVolume: "410ml", batteryPercent: 90, occlusionStatus: "Normal", status: "Running", patientName: "Ganesh More", startTime: "2026-07-22 06:00" },
];

/* ------------------------------------------------------------------ */
/* Clinical Scores                                                      */
/* ------------------------------------------------------------------ */

export const CLINICAL_SCORES: ClinicalScore[] = [
  {
    patientName: "Rajesh Kumar", apacheII: 22, sofa: 9,
    gcs: { eye: 2, verbal: 2, motor: 4, total: 8 },
    news2: 12, qsofa: 3, sepsisScreen: "Negative", painScore: 0, sedationScale: "RASS -3",
    assessedBy: "Dr. Imran Sheikh", assessedAt: "2026-07-23 06:00",
    trend: [
      { date: "Jul 22", sofa: 11, apache: 25, gcs: 7 },
      { date: "Jul 23", sofa: 9, apache: 22, gcs: 8 },
    ],
  },
  {
    patientName: "Anil Kulkarni", apacheII: 28, sofa: 11,
    gcs: { eye: 1, verbal: 1, motor: 4, total: 6 },
    news2: 14, qsofa: 3, sepsisScreen: "Positive", painScore: 0, sedationScale: "RASS -4",
    assessedBy: "Dr. Imran Sheikh", assessedAt: "2026-07-23 06:30",
    trend: [
      { date: "Jul 21", sofa: 9, apache: 24, gcs: 8 },
      { date: "Jul 22", sofa: 10, apache: 26, gcs: 7 },
      { date: "Jul 23", sofa: 11, apache: 28, gcs: 6 },
    ],
  },
  {
    patientName: "Lakshmi Iyer", apacheII: 24, sofa: 8,
    gcs: { eye: 1, verbal: 1, motor: 3, total: 5 },
    news2: 11, qsofa: 2, sepsisScreen: "Negative", painScore: 0, sedationScale: "RASS -4",
    assessedBy: "Dr. Imran Sheikh", assessedAt: "2026-07-23 05:00",
    trend: [
      { date: "Jul 20", sofa: 6, apache: 20, gcs: 7 },
      { date: "Jul 21", sofa: 7, apache: 22, gcs: 6 },
      { date: "Jul 22", sofa: 8, apache: 24, gcs: 5 },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Medication Records                                                   */
/* ------------------------------------------------------------------ */

export const MEDICATION_RECORDS: MedicationRecord[] = [
  {
    patientName: "Rajesh Kumar",
    medications: [
      { name: "Noradrenaline", type: "Vasopressor", dose: "0.15 mcg/kg/min", route: "IV Infusion", frequency: "Continuous", status: "Active" },
      { name: "Dobutamine", type: "Inotrope", dose: "5 mcg/kg/min", route: "IV Infusion", frequency: "Continuous", status: "Active" },
      { name: "Enoxaparin", type: "Anticoagulant", dose: "40mg", route: "SC", frequency: "Once daily", status: "Active" },
      { name: "Pantoprazole", type: "PPI", dose: "40mg", route: "IV", frequency: "Once daily", status: "Active" },
      { name: "Paracetamol", type: "Analgesic", dose: "1g", route: "IV", frequency: "QID PRN", status: "Active" },
      { name: "Insulin", type: "Antidiabetic", dose: "Variable", route: "IV Infusion", frequency: "Sliding scale", status: "Active" },
    ],
  },
  {
    patientName: "Anil Kulkarni",
    medications: [
      { name: "Noradrenaline", type: "Vasopressor", dose: "0.2 mcg/kg/min", route: "IV Infusion", frequency: "Continuous", status: "Active" },
      { name: "Vasopressin", type: "Vasopressor", dose: "0.03 U/min", route: "IV Infusion", frequency: "Continuous", status: "Active" },
      { name: "Meropenem", type: "Antibiotic", dose: "1g", route: "IV", frequency: "Q8H", status: "Active" },
      { name: "Vancomycin", type: "Antibiotic", dose: "1g", route: "IV", frequency: "Q12H", status: "Active" },
      { name: "Propofol", type: "Sedation", dose: "30 ml/hr", route: "IV Infusion", frequency: "Continuous", status: "Active" },
      { name: "Fentanyl", type: "Analgesia", dose: "50 mcg/hr", route: "IV Infusion", frequency: "Continuous", status: "Active" },
      { name: "Hydrocortisone", type: "Steroid", dose: "200mg", route: "IV", frequency: "Q8H", status: "Active" },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Daily Rounds                                                         */
/* ------------------------------------------------------------------ */

export const DAILY_ROUNDS: DailyRound[] = [
  {
    patientName: "Rajesh Kumar", bed: "B01", intensivist: "Dr. Imran Sheikh", roundTime: "08:00",
    vitalsSummary: "HR 82, BP 110/65, SpO2 98% on FiO2 50%, Temp 37.2°C, CVP 12 cmH2O",
    labSummary: "WBC 11.2, Cr 1.4, Lactate 3.2 (improving), Troponin trending down",
    ventSummary: "AC/VC, FiO2 50%, PEEP 8, TV 450, RR 14. Spontaneous breathing trial planned for today.",
    fluidBalance: "Intake 2800ml, Output 2200ml (UO 1800ml). Net +600ml.",
    nutritionSummary: "Toleraling Ryle's tube feeds 50ml/hr. Dietitian review pending.",
    todaysGoals: ["Wean noradrenaline if BP allows", "Spontaneous breathing trial at 10:00", "Chest physiotherapy", "Lactate re-check at 14:00"],
    consultNotes: "Cardiology: Continue current inotrope regimen. Echo tomorrow AM.",
    plan: "Continue current management. SBT at 10:00. Wean vasopressors if stable.",
  },
  {
    patientName: "Anil Kulkarni", bed: "B02", intensivist: "Dr. Imran Sheikh", roundTime: "08:15",
    vitalsSummary: "HR 98, BP 92/58 on dual vasopressors, SpO2 94% on FiO2 60%, Temp 38.6°C",
    labSummary: "WBC 18.4, Procalcitonin 8.2, Cr 2.1 (rising), Lactate 4.8, Blood culture pending",
    ventSummary: "SIMV, FiO2 60%, PEEP 10, TV 400, RR 16. High PEEP for ARDS. Plateau pressure 28.",
    fluidBalance: "Intake 4200ml, Output 1800ml (UO 1200ml). Net +2400ml. Mildly fluid positive.",
    nutritionSummary: "NPO. TPN started at 60 ml/hr.",
    todaysGoals: ["Optimize antibiotic coverage pending culture", "Continue lung-protective ventilation", "Target MAP > 65", "Urgent nephrology consult for AKI"],
    consultNotes: "Infectious Disease: Add Vancomycin pending MRSA screen. Nephrology: Acute tubular necrosis likely. May need CRRT.",
    plan: "Aggressive sepsis management. Lung-protective ventilation. Nephrology consult STAT.",
  },
];

/* ------------------------------------------------------------------ */
/* Code Blue Records                                                    */
/* ------------------------------------------------------------------ */

export const CODE_BLUE_RECORDS: CodeBlueRecord[] = [
  {
    id: "CB-001", patientName: "Rajesh Kumar", bed: "B01", activatedBy: "Lata Bhave (ICU Nurse)",
    activatedAt: "2026-07-22 14:30", teamLead: "Dr. Imran Sheikh",
    teamMembers: ["Dr. Imran Sheikh", "Dr. Suresh Patil", "Lata Bhave", "Suman Khandekar", "Ramesh Jadhav"],
    duration: 12,
    interventions: ["CPR initiated", "Epinephrine 1mg IV", "Intubation confirmed", "Rhythm check — VF", "Defibrillation 200J", "Return of ROSC"],
    defibrillations: 1,
    medications: ["Epinephrine 1mg IV x2", "Amiodarone 300mg IV"],
    outcome: "ROSC",
    status: "Resolved",
    postCodeNotes: "ROSC achieved after 12 minutes. Patient stabilized on vasopressors. Continuous monitoring. Echo to assess cardiac function.",
  },
];

/* ------------------------------------------------------------------ */
/* Family Updates                                                       */
/* ------------------------------------------------------------------ */

export const FAMILY_UPDATES: FamilyUpdate[] = [
  {
    patientName: "Rajesh Kumar", contactName: "Sunita Kumar", contactRelation: "Wife", contactPhone: "+91 98765 43210",
    updates: [
      { date: "2026-07-23", time: "08:00", update: "Patient stable on ventilator. Heart function improving.", givenBy: "Dr. Imran Sheikh" },
      { date: "2026-07-22", time: "18:00", update: "Patient shifted to ICU after cardiac surgery. Stable condition.", givenBy: "ICU Nurse Lata" },
      { date: "2026-07-22", time: "10:00", update: "CABG surgery completed successfully. Patient in recovery.", givenBy: "Dr. Arjun Mehta" },
    ],
    meetingHistory: [
      { date: "2026-07-23", time: "07:30", notes: "Family updated on current status. They expressed concern about ventilator duration. Explained expected 24-48 hours.", conductedBy: "Dr. Imran Sheikh" },
    ],
    nextMeeting: "2026-07-23 14:00",
    consentRequests: ["Consent for blood products (already signed)", "Consent for dialysis if needed (pending)"],
  },
  {
    patientName: "Anil Kulkarni", contactName: "Fatima Ansari", contactRelation: "Wife", contactPhone: "+91 98765 11111",
    updates: [
      { date: "2026-07-23", time: "08:15", update: "Patient critical. On maximum ventilator support. Fighting severe infection.", givenBy: "Dr. Imran Sheikh" },
      { date: "2026-07-22", time: "16:00", update: "Condition deteriorating. Kidneys showing signs of stress.", givenBy: "Dr. Kavya Nair" },
    ],
    meetingHistory: [
      { date: "2026-07-22", time: "15:00", notes: "Detailed discussion about patient's critical condition. Family understands gravity. Requested daily updates.", conductedBy: "Dr. Imran Sheikh" },
    ],
    nextMeeting: "2026-07-23 15:00",
    consentRequests: ["Consent for CRRT (if needed)", "Consent for tracheostomy (if prolonged ventilation)"],
  },
];

/* ------------------------------------------------------------------ */
/* Recovery Assessments                                                 */
/* ------------------------------------------------------------------ */

export const RECOVERY_ASSESSMENTS: RecoveryAssessment[] = [
  { patientName: "Ganesh More", ventilatorWeaning: "Completed", sedationAssessment: "RASS 0 — Alert and calm", mobilityAssessment: "Sitting at edge of bed with assistance", neurologicalStatus: "Oriented x3, GCS 14", readinessForTransfer: true, doctorApproval: true, nurseApproval: true },
  { patientName: "Mohammed Ansari", ventilatorWeaning: "Not Started", sedationAssessment: "RASS -1 — Drowsy", mobilityAssessment: "Bed rest, passive ROM exercises", neurologicalStatus: "Oriented x2, GCS 13", readinessForTransfer: false, doctorApproval: false, nurseApproval: false },
];

/* ------------------------------------------------------------------ */
/* Equipment                                                            */
/* ------------------------------------------------------------------ */

export const ICU_EQUIPMENT: EquipmentItem[] = [
  { id: "EQ-ICU-01", name: "Ventilator — Hamilton G5", category: "Ventilator", status: "In Use", bedNumber: "B01", lastServiced: "2026-07-01", nextService: "2026-08-01" },
  { id: "EQ-ICU-02", name: "Ventilator — Dräger V500", category: "Ventilator", status: "In Use", bedNumber: "B02", lastServiced: "2026-07-05", nextService: "2026-08-05" },
  { id: "EQ-ICU-03", name: "Ventilator — Hamilton C6", category: "Ventilator", status: "In Use", bedNumber: "B04", lastServiced: "2026-06-20", nextService: "2026-07-20" },
  { id: "EQ-ICU-04", name: "Ventilator — Dräger V800", category: "Ventilator", status: "Available", lastServiced: "2026-07-10", nextService: "2026-08-10" },
  { id: "EQ-ICU-05", name: "Patient Monitor — Philips MX800", category: "Monitor", status: "In Use", bedNumber: "B01", lastServiced: "2026-07-01", nextService: "2026-10-01" },
  { id: "EQ-ICU-06", name: "Patient Monitor — GE CARESCAPE B650", category: "Monitor", status: "In Use", bedNumber: "B02", lastServiced: "2026-07-05", nextService: "2026-10-05" },
  { id: "EQ-ICU-07", name: "Patient Monitor — Philips MX550", category: "Monitor", status: "Available" },
  { id: "EQ-ICU-08", name: "Infusion Pump — Alaris System", category: "Infusion Pump", status: "In Use", bedNumber: "B01", lastServiced: "2026-07-01", nextService: "2026-09-01" },
  { id: "EQ-ICU-09", name: "Infusion Pump — Alaris System", category: "Infusion Pump", status: "In Use", bedNumber: "B02", lastServiced: "2026-07-01", nextService: "2026-09-01" },
  { id: "EQ-ICU-10", name: "Defibrillator — Philips HeartStart FRx", category: "Defibrillator", status: "Available", lastServiced: "2026-07-15", nextService: "2026-10-15" },
  { id: "EQ-ICU-11", name: "Dialysis Machine — Fresenius 5008S", category: "Dialysis", status: "In Use", bedNumber: "B04", lastServiced: "2026-07-10", nextService: "2026-08-10" },
  { id: "EQ-ICU-12", name: "Dialysis Machine — Fresenius 5008S", category: "Dialysis", status: "Available", lastServiced: "2026-07-12", nextService: "2026-08-12" },
  { id: "EQ-ICU-13", name: "ICP Monitor — Raumedic Neurovent-P", category: "Monitor", status: "In Use", bedNumber: "B04", lastServiced: "2026-07-18", nextService: "2026-08-18" },
  { id: "EQ-ICU-14", name: "Portable X-Ray — Siemens Cios Spin", category: "Imaging", status: "Available", lastServiced: "2026-07-01", nextService: "2026-10-01" },
  { id: "EQ-ICU-15", name: "ECG Machine — Philips PageWriter TC70", category: "ECG", status: "Available", lastServiced: "2026-07-20", nextService: "2026-10-20" },
];

/* ------------------------------------------------------------------ */
/* Audit Logs                                                           */
/* ------------------------------------------------------------------ */

export const AUDIT_LOGS: AuditEntry[] = [
  { id: "AUD-ICU-001", timestamp: "2026-07-22 18:00:00", user: "Dr. Imran Sheikh", role: "Intensivist", action: "ICU Admission", detail: "Rajesh Kumar admitted to ICU B01. Post-CABG cardiogenic shock. Intubated and ventilated.", patientName: "Rajesh Kumar", ipAddress: "10.0.4.401" },
  { id: "AUD-ICU-002", timestamp: "2026-07-22 18:30:00", user: "ICU Nurse", role: "ICU Nurse", action: "Ventilator Setup", detail: "Hamilton G5 ventilator set up for Rajesh Kumar. Mode: AC/VC. FiO2 50%, PEEP 8.", patientName: "Rajesh Kumar", ipAddress: "10.0.4.402" },
  { id: "AUD-ICU-003", timestamp: "2026-07-22 22:00:00", user: "Dr. Imran Sheikh", role: "Intensivist", action: "ICU Admission", detail: "Anil Kulkarni admitted to ICU B02. Septic shock, multi-organ dysfunction.", patientName: "Anil Kulkarni", ipAddress: "10.0.4.401" },
  { id: "AUD-ICU-004", timestamp: "2026-07-22 14:30:00", user: "Lata Bhave", role: "ICU Nurse", action: "Code Blue Activated", detail: "Code Blue activated for Rajesh Kumar — cardiac arrest. CPR initiated.", patientName: "Rajesh Kumar", ipAddress: "10.0.4.403" },
  { id: "AUD-ICU-005", timestamp: "2026-07-22 14:42:00", user: "Dr. Imran Sheikh", role: "Intensivist", action: "Code Blue Resolved", detail: "ROSC achieved for Rajesh Kumar after 12 minutes. Patient stabilized.", patientName: "Rajesh Kumar", ipAddress: "10.0.4.401" },
  { id: "AUD-ICU-006", timestamp: "2026-07-23 06:00:00", user: "Dr. Imran Sheikh", role: "Intensivist", action: "Daily Round", detail: "Morning round completed for ICU B01 (Rajesh Kumar). Plan: SBT at 10:00.", patientName: "Rajesh Kumar", ipAddress: "10.0.4.401" },
  { id: "AUD-ICU-007", timestamp: "2026-07-23 06:15:00", user: "Dr. Imran Sheikh", role: "Intensivist", action: "Clinical Score Updated", detail: "APACHE II 22, SOFA 9, GCS 8 for Rajesh Kumar. Improving trend.", patientName: "Rajesh Kumar", ipAddress: "10.0.4.401" },
  { id: "AUD-ICU-008", timestamp: "2026-07-23 06:30:00", user: "Dr. Imran Sheikh", role: "Intensivist", action: "Sepsis Alert", detail: "Anil Kulkarni — qSOFA 3, Procalcitonin 8.2. Sepsis protocol activated.", patientName: "Anil Kulkarni", ipAddress: "10.0.4.401" },
];

/* ------------------------------------------------------------------ */
/* Helpers                                                              */
/* ------------------------------------------------------------------ */

export function criticalityTone(s: CriticalityLevel): "success" | "warning" | "danger" | "brand" | "info" {
  switch (s) {
    case "Stable": return "success";
    case "Improving": return "brand";
    case "Serious": return "warning";
    case "Critical": return "danger";
    case "Deteriorating": return "danger";
    default: return "info";
  }
}

export function bedStatusTone(s: ICUBedStatus): "success" | "warning" | "danger" | "info" | "brand" {
  switch (s) {
    case "Available": return "success";
    case "Occupied": return "danger";
    case "Cleaning": return "warning";
    case "Reserved": return "info";
    case "Maintenance": return "warning";
    case "Blocked": return "danger";
    default: return "info";
  }
}

export function ventModeTone(mode: VentilatorMode): "success" | "warning" | "info" {
  switch (mode) {
    case "Offline": return "success";
    case "CPAP": return "success";
    case "PSV": return "brand";
    case "SIMV": return "warning";
    case "AC/VC": return "info";
    case "AC/PC": return "info";
    case "NIV": return "warning";
    default: return "info";
  }
}
