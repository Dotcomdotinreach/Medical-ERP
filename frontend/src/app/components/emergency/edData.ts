/* ------------------------------------------------------------------ */
/* Emergency Department mock data                                       */
/* ------------------------------------------------------------------ */

export type Triage = "Red" | "Orange" | "Yellow" | "Green" | "Blue";
export type EDStage =
  | "Registration" | "Triage" | "Doctor" | "Lab" | "Radiology"
  | "Treatment" | "Observation" | "Disposition";
export type EDStatus = "Waiting" | "Under Treatment" | "Observation" | "Completed";

export const TRIAGE_META: Record<Triage, { label: string; color: string; sla: string; sev: number }> = {
  Red: { label: "Resuscitation", color: "#dc2626", sla: "Immediate", sev: 1 },
  Orange: { label: "Emergent", color: "#f59e0b", sla: "≤ 10 min", sev: 2 },
  Yellow: { label: "Urgent", color: "#eab308", sla: "≤ 60 min", sev: 3 },
  Green: { label: "Less urgent", color: "#16a34a", sla: "≤ 120 min", sev: 4 },
  Blue: { label: "Non-urgent", color: "#0ea5e9", sla: "≤ 240 min", sev: 5 },
};

export interface Vitals {
  hr: number;      // heart rate
  sbp: number;     // systolic
  dbp: number;     // diastolic
  temp: number;    // °C
  rr: number;      // respiratory rate
  spo2: number;    // %
  pain: number;    // 0-10
}

export interface EDCase {
  id: string;
  uhid: string;
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  blood: string;
  complaint: string;
  diagnosis: string;
  triage: Triage;
  status: EDStatus;
  stage: EDStage;
  arrival: string;       // time
  arrivalMode: "Ambulance" | "Walk-in" | "Police" | "Referral";
  doctor: string;
  nurse: string;
  bed: string;
  allergies: string[];
  history: string[];
  vitals: Vitals;
}

export const ED_CASES: EDCase[] = [
  { id: "ER-2026-0912", uhid: "MRD-2026-004824", name: "Lakshmi Iyer", age: 70, gender: "Female", blood: "AB+",
    complaint: "Sudden chest pain, breathlessness", diagnosis: "Acute Coronary Syndrome (suspected STEMI)",
    triage: "Red", status: "Under Treatment", stage: "Treatment", arrival: "09:55", arrivalMode: "Ambulance",
    doctor: "Dr. Imran Sheikh", nurse: "Sr. Anjali Deshpande", bed: "RESUS-1",
    allergies: ["Sulfa drugs"], history: ["Coronary Artery Disease", "Osteoarthritis"],
    vitals: { hr: 128, sbp: 92, dbp: 60, temp: 36.9, rr: 26, spo2: 89, pain: 8 } },
  { id: "ER-2026-0913", uhid: "MRD-2026-005001", name: "Sandeep Rathore", age: 34, gender: "Male", blood: "B+",
    complaint: "Road traffic accident — head & leg injury", diagnosis: "Head injury, closed tibia fracture",
    triage: "Orange", status: "Under Treatment", stage: "Radiology", arrival: "10:12", arrivalMode: "Ambulance",
    doctor: "Dr. Rohan Deshmukh", nurse: "Sr. Rekha Menon", bed: "TR-2",
    allergies: [], history: [], vitals: { hr: 104, sbp: 118, dbp: 78, temp: 37.1, rr: 20, spo2: 96, pain: 7 } },
  { id: "ER-2026-0914", uhid: "MRD-2026-005002", name: "Farida Begum", age: 58, gender: "Female", blood: "O+",
    complaint: "Slurred speech, right-side weakness", diagnosis: "Acute ischaemic stroke (window active)",
    triage: "Red", status: "Under Treatment", stage: "Doctor", arrival: "10:28", arrivalMode: "Ambulance",
    doctor: "Dr. Vikram Rao", nurse: "Sr. Fatima Khan", bed: "RESUS-2",
    allergies: ["Aspirin"], history: ["Hypertension", "Atrial Fibrillation"],
    vitals: { hr: 96, sbp: 176, dbp: 98, temp: 36.7, rr: 18, spo2: 97, pain: 2 } },
  { id: "ER-2026-0915", uhid: "MRD-2026-005003", name: "Aarav Sharma", age: 7, gender: "Male", blood: "A+",
    complaint: "Severe asthma attack", diagnosis: "Acute exacerbation of asthma",
    triage: "Orange", status: "Under Treatment", stage: "Treatment", arrival: "10:40", arrivalMode: "Walk-in",
    doctor: "Dr. Sneha Iyer", nurse: "Sr. Rekha Menon", bed: "PED-1",
    allergies: ["Dust mites"], history: ["Asthma"], vitals: { hr: 122, sbp: 100, dbp: 66, temp: 37.0, rr: 32, spo2: 91, pain: 3 } },
  { id: "ER-2026-0916", uhid: "MRD-2026-005004", name: "Ganpat Yadav", age: 45, gender: "Male", blood: "B-",
    complaint: "Snake bite — right foot", diagnosis: "Viper envenomation, local swelling",
    triage: "Yellow", status: "Observation", stage: "Observation", arrival: "09:20", arrivalMode: "Referral",
    doctor: "Dr. Kavya Nair", nurse: "Sr. Anjali Deshpande", bed: "OBS-3",
    allergies: [], history: [], vitals: { hr: 88, sbp: 126, dbp: 82, temp: 37.3, rr: 18, spo2: 98, pain: 5 } },
  { id: "ER-2026-0917", uhid: "MRD-2026-005005", name: "Neha Kulkarni", age: 24, gender: "Female", blood: "A-",
    complaint: "Deliberate drug overdose", diagnosis: "Paracetamol poisoning",
    triage: "Orange", status: "Waiting", stage: "Triage", arrival: "11:02", arrivalMode: "Police",
    doctor: "—", nurse: "—", bed: "—", allergies: [], history: ["Depression"],
    vitals: { hr: 92, sbp: 112, dbp: 72, temp: 36.8, rr: 16, spo2: 99, pain: 1 } },
  { id: "ER-2026-0918", uhid: "MRD-2026-005006", name: "Ramesh Gupta", age: 61, gender: "Male", blood: "O+",
    complaint: "Fall — wrist pain", diagnosis: "Suspected Colles fracture",
    triage: "Green", status: "Waiting", stage: "Triage", arrival: "11:08", arrivalMode: "Walk-in",
    doctor: "—", nurse: "—", bed: "—", allergies: [], history: [], vitals: { hr: 78, sbp: 132, dbp: 84, temp: 36.6, rr: 15, spo2: 99, pain: 4 } },
  { id: "ER-2026-0919", uhid: "MRD-2026-005007", name: "Sunita Pawar", age: 39, gender: "Female", blood: "B+",
    complaint: "Seizure episode", diagnosis: "First unprovoked seizure — post-ictal",
    triage: "Yellow", status: "Observation", stage: "Observation", arrival: "10:50", arrivalMode: "Ambulance",
    doctor: "Dr. Vikram Rao", nurse: "Sr. Fatima Khan", bed: "OBS-1",
    allergies: [], history: [], vitals: { hr: 84, sbp: 120, dbp: 78, temp: 37.2, rr: 17, spo2: 98, pain: 0 } },
];

export interface Ambulance {
  id: string;
  vehicle: string;
  driver: string;
  paramedic: string;
  condition: string;
  triage: Triage;
  etaMins: number;
  distanceKm: number;
  equipment: { oxygen: boolean; ventilator: boolean; defibrillator: boolean };
}

export const AMBULANCES: Ambulance[] = [
  { id: "AMB-07", vehicle: "MH-12-AB-4521", driver: "Suresh More", paramedic: "Vishal Jadhav",
    condition: "RTA — polytrauma, unconscious", triage: "Red", etaMins: 4, distanceKm: 2.1,
    equipment: { oxygen: true, ventilator: true, defibrillator: true } },
  { id: "AMB-03", vehicle: "MH-14-CD-8890", driver: "Ravi Shinde", paramedic: "Pooja Kadam",
    condition: "Cardiac — chest pain, stable", triage: "Orange", etaMins: 9, distanceKm: 5.4,
    equipment: { oxygen: true, ventilator: false, defibrillator: true } },
  { id: "AMB-11", vehicle: "MH-12-EF-2277", driver: "Amit Borkar", paramedic: "Sana Shaikh",
    condition: "Burn injury — 20% TBSA", triage: "Orange", etaMins: 14, distanceKm: 8.7,
    equipment: { oxygen: true, ventilator: false, defibrillator: false } },
];

export interface EDDoctor { id: string; name: string; speciality: string; exp: number; load: number; wait: string; available: boolean }
export const ED_DOCTORS: EDDoctor[] = [
  { id: "D-107", name: "Dr. Imran Sheikh", speciality: "Emergency Medicine", exp: 12, load: 3, wait: "Now", available: true },
  { id: "D-105", name: "Dr. Vikram Rao", speciality: "Neurology", exp: 18, load: 2, wait: "5 min", available: true },
  { id: "D-101", name: "Dr. Arjun Mehta", speciality: "Cardiology", exp: 15, load: 1, wait: "Now", available: true },
  { id: "D-103", name: "Dr. Rohan Deshmukh", speciality: "Orthopaedics / Trauma", exp: 10, load: 4, wait: "12 min", available: true },
  { id: "D-108", name: "Dr. Priyanka Sen", speciality: "General Surgery", exp: 8, load: 2, wait: "8 min", available: false },
];

export interface EDNurse { id: string; name: string; shift: string; assigned: number; available: boolean }
export const ED_NURSES: EDNurse[] = [
  { id: "N-21", name: "Sr. Anjali Deshpande", shift: "Morning (7–3)", assigned: 2, available: true },
  { id: "N-22", name: "Sr. Rekha Menon", shift: "Morning (7–3)", assigned: 3, available: true },
  { id: "N-23", name: "Sr. Fatima Khan", shift: "Morning (7–3)", assigned: 2, available: true },
  { id: "N-24", name: "Sr. Meghana Patil", shift: "Morning (7–3)", assigned: 1, available: true },
];

export const ED_BEDS = { total: 24, occupied: 17, resus: { total: 4, free: 1 }, icuFree: 2, otFree: 1 };

export const HOURLY_ARRIVALS = [
  { hour: "6 AM", cases: 3 }, { hour: "7 AM", cases: 5 }, { hour: "8 AM", cases: 8 },
  { hour: "9 AM", cases: 12 }, { hour: "10 AM", cases: 15 }, { hour: "11 AM", cases: 11 },
  { hour: "12 PM", cases: 7 },
];

export const TRIAGE_DISTRIBUTION = [
  { name: "Red", value: 4, color: "#dc2626" },
  { name: "Orange", value: 9, color: "#f59e0b" },
  { name: "Yellow", value: 12, color: "#eab308" },
  { name: "Green", value: 8, color: "#16a34a" },
  { name: "Blue", value: 3, color: "#0ea5e9" },
];

/** Simulated ECG-like waveform + vitals trend for monitoring screen. */
export const VITALS_TREND = Array.from({ length: 12 }, (_, i) => ({
  t: `${i * 5}m`,
  hr: 120 + Math.round(Math.sin(i / 1.5) * 8),
  spo2: 90 + Math.round(Math.cos(i / 2) * 3),
  sbp: 95 + Math.round(Math.sin(i / 2) * 6),
}));

export const LAB_TESTS = [
  { group: "Haematology", tests: ["CBC", "Coagulation Profile (PT/INR)", "ESR"] },
  { group: "Biochemistry", tests: ["Blood Sugar (Random)", "Electrolytes (Na/K/Cl)", "LFT", "KFT"] },
  { group: "Cardiac", tests: ["Troponin-I", "CK-MB", "D-Dimer"] },
  { group: "Others", tests: ["Urine Routine", "ABG", "Blood Grouping"] },
];

export const RADIOLOGY_TESTS = [
  { name: "X-Ray", desc: "Chest / limb / spine", icon: "xray" },
  { name: "CT Scan", desc: "Head / abdomen / trauma", icon: "ct" },
  { name: "MRI", desc: "Brain / spine", icon: "mri" },
  { name: "Ultrasound", desc: "FAST / abdomen", icon: "usg" },
  { name: "Portable X-Ray", desc: "Bedside imaging", icon: "portable" },
];
