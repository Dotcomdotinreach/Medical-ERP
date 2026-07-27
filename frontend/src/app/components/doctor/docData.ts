// Module 04 — Doctor Workstation (EMR) mock data
// Realistic Indian patient records, ICD-10 diagnoses, labs, medicines & doctors.

export interface DoctorProfile {
  name: string;
  speciality: string;
  qualification: string;
  regNo: string; // Medical Council registration
  room: string;
}

export const DOCTOR: DoctorProfile = {
  name: "Dr. Ananya Deshpande",
  speciality: "Internal Medicine",
  qualification: "MBBS, MD (General Medicine)",
  regNo: "MMC-2011-45872",
  room: "OPD-214",
};

export type ApptStatus = "Scheduled" | "Checked In" | "In Consultation" | "Completed" | "Cancelled" | "Delayed";
export type ApptType = "New" | "Follow-up" | "Emergency" | "Tele-consult";

export interface Appointment {
  id: string;
  time: string;
  patientId: string;
  name: string;
  age: number;
  gender: "Male" | "Female";
  uhid: string;
  reason: string;
  type: ApptType;
  status: ApptStatus;
}

export const APPOINTMENTS: Appointment[] = [
  { id: "APT-01", time: "09:00", patientId: "P1", name: "Rajesh Kumar Nair", age: 54, gender: "Male", uhid: "MRD-2026-004821", reason: "Chest tightness, on follow-up for HTN", type: "Follow-up", status: "Completed" },
  { id: "APT-02", time: "09:30", patientId: "P2", name: "Sunita Menon", age: 47, gender: "Female", uhid: "MRD-2026-004890", reason: "Uncontrolled blood sugar, fatigue", type: "New", status: "In Consultation" },
  { id: "APT-03", time: "10:00", patientId: "P3", name: "Arjun Reddy", age: 32, gender: "Male", uhid: "MRD-2026-004912", reason: "Persistent cough x 3 weeks", type: "New", status: "Checked In" },
  { id: "APT-04", time: "10:30", patientId: "P4", name: "Fatima Sheikh", age: 63, gender: "Female", uhid: "MRD-2026-004803", reason: "Post-op review — cholecystectomy", type: "Follow-up", status: "Checked In" },
  { id: "APT-05", time: "11:00", patientId: "P5", name: "Vikram Joshi", age: 41, gender: "Male", uhid: "MRD-2026-004955", reason: "Migraine, recurrent headaches", type: "Tele-consult", status: "Scheduled" },
  { id: "APT-06", time: "11:30", patientId: "P6", name: "Lakshmi Iyer", age: 58, gender: "Female", uhid: "MRD-2026-004777", reason: "Breathlessness on exertion", type: "Follow-up", status: "Delayed" },
  { id: "APT-07", time: "12:00", patientId: "P7", name: "Mohammed Anwar", age: 29, gender: "Male", uhid: "MRD-2026-004999", reason: "Annual health check", type: "New", status: "Scheduled" },
  { id: "APT-08", time: "12:30", patientId: "P8", name: "Deepa Krishnan", age: 36, gender: "Female", uhid: "MRD-2026-004840", reason: "Rescheduled — thyroid review", type: "Follow-up", status: "Cancelled" },
];

export type ClinicalTriage = "Red" | "Orange" | "Yellow" | "Green";

export interface EmergencyRef {
  id: string;
  name: string;
  age: number;
  gender: "Male" | "Female";
  uhid: string;
  triage: ClinicalTriage;
  complaint: string;
  waiting: string;
  vitals: { hr: number; bp: string; spo2: number; temp: number };
}

export const EMERGENCY_REFERRALS: EmergencyRef[] = [
  { id: "ER-2026-0912", name: "Suresh Patel", age: 61, gender: "Male", uhid: "MRD-2026-005010", triage: "Red", complaint: "Acute chest pain, ? MI", waiting: "2 min", vitals: { hr: 118, bp: "90/60", spo2: 91, temp: 37.1 } },
  { id: "ER-2026-0913", name: "Kavya Rao", age: 24, gender: "Female", uhid: "MRD-2026-005011", triage: "Orange", complaint: "Severe asthma exacerbation", waiting: "6 min", vitals: { hr: 104, bp: "128/82", spo2: 93, temp: 37.4 } },
  { id: "ER-2026-0914", name: "Harpreet Singh", age: 38, gender: "Male", uhid: "MRD-2026-005012", triage: "Yellow", complaint: "Road traffic accident, forearm #", waiting: "14 min", vitals: { hr: 92, bp: "134/86", spo2: 98, temp: 36.9 } },
  { id: "ER-2026-0915", name: "Meera Pillai", age: 45, gender: "Female", uhid: "MRD-2026-005013", triage: "Green", complaint: "Mild laceration, left hand", waiting: "28 min", vitals: { hr: 78, bp: "120/78", spo2: 99, temp: 36.7 } },
];

export const TRIAGE_COLOR: Record<ClinicalTriage, string> = {
  Red: "#dc2626", Orange: "#ea580c", Yellow: "#f59e0b", Green: "#16a34a",
};

// ---- Full EMR patient (the active consult) ----------------------------------
export interface EmrPatient {
  id: string;
  name: string;
  age: number;
  gender: "Male" | "Female";
  uhid: string;
  blood: string;
  phone: string;
  chiefComplaint: string;
  allergies: string[];
  currentMeds: { name: string; dose: string }[];
  history: string[];
  surgical: { procedure: string; year: string }[];
  family: string[];
  vaccinations: { name: string; date: string }[];
  lifestyle: { label: string; value: string }[];
  admissions: { reason: string; ward: string; from: string; to: string }[];
  insurance: { provider: string; policy: string; validTill: string; coverage: string };
  emergencyContact: { name: string; relation: string; phone: string };
}

export const ACTIVE_PATIENT: EmrPatient = {
  id: "P2",
  name: "Sunita Menon",
  age: 47,
  gender: "Female",
  uhid: "MRD-2026-004890",
  blood: "B+",
  phone: "+91 98450 33217",
  chiefComplaint: "Uncontrolled blood sugar with fatigue and increased thirst for 2 weeks",
  allergies: ["Penicillin (rash)", "Sulfa drugs"],
  currentMeds: [
    { name: "Metformin", dose: "500 mg BD" },
    { name: "Telmisartan", dose: "40 mg OD" },
    { name: "Atorvastatin", dose: "10 mg HS" },
  ],
  history: ["Type 2 Diabetes Mellitus (2016)", "Essential Hypertension (2018)", "Dyslipidaemia (2019)"],
  surgical: [{ procedure: "LSCS (Caesarean)", year: "2004" }, { procedure: "Appendectomy", year: "1998" }],
  family: ["Father — Type 2 Diabetes, IHD", "Mother — Hypertension", "Sibling — Hypothyroidism"],
  vaccinations: [
    { name: "COVID-19 (Covishield) — 2 doses + booster", date: "Jan 2022" },
    { name: "Influenza (annual)", date: "Oct 2025" },
    { name: "Tetanus toxoid", date: "Mar 2021" },
  ],
  lifestyle: [
    { label: "Smoking", value: "Never" },
    { label: "Alcohol", value: "Occasional" },
    { label: "Diet", value: "Vegetarian" },
    { label: "Exercise", value: "Sedentary" },
  ],
  admissions: [
    { reason: "Diabetic ketoacidosis", ward: "General Medicine", from: "12 Feb 2023", to: "16 Feb 2023" },
    { reason: "Hypertensive urgency", ward: "General Medicine", from: "04 Aug 2021", to: "06 Aug 2021" },
  ],
  insurance: { provider: "Star Health Insurance", policy: "SH-IND-88214590", validTill: "31 Mar 2027", coverage: "₹5,00,000 Family Floater" },
  emergencyContact: { name: "Ravi Menon", relation: "Husband", phone: "+91 98450 11902" },
};

// ---- Vitals trend -----------------------------------------------------------
export const CURRENT_VITALS = {
  hr: 88, bpSys: 148, bpDia: 92, temp: 37.0, rr: 18, spo2: 97, pain: 2, height: 158, weight: 74,
};
export const BMI = +(CURRENT_VITALS.weight / ((CURRENT_VITALS.height / 100) ** 2)).toFixed(1);

export const VITALS_TREND = [
  { time: "Mar", hr: 82, bpSys: 152, bpDia: 96, spo2: 96 },
  { time: "Apr", hr: 85, bpSys: 150, bpDia: 94, spo2: 97 },
  { time: "May", hr: 80, bpSys: 146, bpDia: 90, spo2: 98 },
  { time: "Jun", hr: 90, bpSys: 149, bpDia: 93, spo2: 96 },
  { time: "Jul", hr: 88, bpSys: 148, bpDia: 92, spo2: 97 },
];

export const SUGAR_TREND = [
  { time: "Mar", fasting: 168, pp: 244 },
  { time: "Apr", fasting: 158, pp: 232 },
  { time: "May", fasting: 172, pp: 251 },
  { time: "Jun", fasting: 181, pp: 268 },
  { time: "Jul", fasting: 176, pp: 259 },
];

// ---- ICD-10 diagnosis catalogue --------------------------------------------
export interface Icd10 { code: string; label: string }
export const ICD10: Icd10[] = [
  { code: "E11.65", label: "Type 2 diabetes mellitus with hyperglycaemia" },
  { code: "E11.9", label: "Type 2 diabetes mellitus without complications" },
  { code: "I10", label: "Essential (primary) hypertension" },
  { code: "E78.5", label: "Hyperlipidaemia, unspecified" },
  { code: "R53.83", label: "Fatigue, other" },
  { code: "E11.22", label: "Type 2 diabetes with diabetic chronic kidney disease" },
  { code: "E11.40", label: "Type 2 diabetes with diabetic neuropathy" },
  { code: "R63.1", label: "Polydipsia" },
  { code: "N18.3", label: "Chronic kidney disease, stage 3" },
  { code: "I25.10", label: "Atherosclerotic heart disease of native coronary artery" },
];

// ---- Lab tests --------------------------------------------------------------
export interface LabTest { id: string; name: string; group: string; note?: string }
export const LAB_TESTS: LabTest[] = [
  { id: "cbc", name: "Complete Blood Count (CBC)", group: "Haematology" },
  { id: "fbs", name: "Fasting Blood Sugar", group: "Biochemistry" },
  { id: "ppbs", name: "Post-Prandial Blood Sugar", group: "Biochemistry" },
  { id: "hba1c", name: "HbA1c (Glycated Haemoglobin)", group: "Biochemistry", note: "3-month glycaemic control" },
  { id: "lft", name: "Liver Function Test (LFT)", group: "Biochemistry" },
  { id: "kft", name: "Kidney Function Test (KFT)", group: "Biochemistry" },
  { id: "lipid", name: "Lipid Profile", group: "Biochemistry" },
  { id: "electrolytes", name: "Serum Electrolytes (Na/K/Cl)", group: "Biochemistry" },
  { id: "troponin", name: "Troponin-I (cardiac)", group: "Cardiac Markers" },
  { id: "urine", name: "Urine Routine & Microscopy", group: "Pathology" },
  { id: "tsh", name: "Thyroid Profile (TSH, T3, T4)", group: "Endocrine" },
];

// ---- Radiology --------------------------------------------------------------
export interface RadTest { id: string; name: string; modality: string }
export const RAD_TESTS: RadTest[] = [
  { id: "cxr", name: "Chest X-Ray (PA view)", modality: "X-Ray" },
  { id: "usg", name: "USG Abdomen & Pelvis", modality: "Ultrasound" },
  { id: "ct", name: "CT Brain (plain)", modality: "CT" },
  { id: "mri", name: "MRI Spine (LS)", modality: "MRI" },
  { id: "ecg", name: "12-Lead ECG", modality: "ECG" },
  { id: "echo", name: "2D Echocardiography", modality: "Echo" },
];

// ---- Medicine catalogue -----------------------------------------------------
export interface Medicine { generic: string; brand: string; form: string }
export const MEDICINES: Medicine[] = [
  { generic: "Metformin", brand: "Glycomet", form: "500 mg tablet" },
  { generic: "Glimepiride", brand: "Amaryl", form: "2 mg tablet" },
  { generic: "Telmisartan", brand: "Telma", form: "40 mg tablet" },
  { generic: "Atorvastatin", brand: "Atorva", form: "10 mg tablet" },
  { generic: "Amlodipine", brand: "Amlong", form: "5 mg tablet" },
  { generic: "Insulin Glargine", brand: "Lantus", form: "100 IU/mL" },
  { generic: "Pantoprazole", brand: "Pantop", form: "40 mg tablet" },
  { generic: "Aspirin", brand: "Ecosprin", form: "75 mg tablet" },
  { generic: "Paracetamol", brand: "Dolo", form: "650 mg tablet" },
  { generic: "Amoxicillin + Clavulanate", brand: "Augmentin", form: "625 mg tablet" },
];

export const FREQUENCIES = ["OD (once daily)", "BD (twice daily)", "TDS (thrice daily)", "QID (four times)", "HS (bedtime)", "SOS (as needed)"];
export const MEAL_REL = ["Before food", "After food", "With food"];

// Known interactions for the demo drug-interaction checker.
export const INTERACTIONS: Record<string, string> = {
  "Aspirin+Telmisartan": "May reduce antihypertensive effect & increase renal risk — monitor BP and renal function.",
  "Glimepiride+Metformin": "Additive hypoglycaemia risk — counsel on symptoms, monitor blood sugar.",
};

export const DOCTOR_STATS = {
  appointments: 8, completed: 1, emergency: 4, admitted: 6, pendingLabs: 5, pendingRadiology: 3, messages: 4, pendingReports: 7,
};
