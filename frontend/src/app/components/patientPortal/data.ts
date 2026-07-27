/* ------------------------------------------------------------------ */
/* Patient Portal & Mobile App — Mock Data                             */
/* Meridian Multi-Speciality Hospital, Pune                             */
/* ------------------------------------------------------------------ */

export type AppointmentStatus = "Upcoming" | "Completed" | "Cancelled" | "Rescheduled" | "In Queue" | "Checked In";
export type ConsultationType = "In-Person" | "Video" | "Audio" | "Chat";
export type ReportStatus = "Normal" | "Abnormal" | "Critical" | "Pending" | "Completed";
export type MedicationStatus = "Active" | "Completed" | "Discontinued" | "On Hold";
export type ReminderStatus = "Taken" | "Skipped" | "Pending" | "Snoozed";
export type PaymentStatus = "Paid" | "Pending" | "Partial" | "Overdue" | "Refunded";
export type ClaimStatus = "Submitted" | "In Process" | "Approved" | "Rejected" | "Settled";
export type NotificationType = "Appointment" | "Lab Result" | "Prescription" | "Billing" | "Reminder" | "Emergency" | "General";
export type SOSStatus = "Idle" | "Activating" | "Active" | "Resolved";

export interface PatientProfile {
  id: string;
  name: string;
  uhid: string;
  mobile: string;
  email: string;
  dateOfBirth: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  bloodGroup: string;
  photo?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  emergencyContact: string;
  emergencyName: string;
  insuranceProvider?: string;
  policyNumber?: string;
  allergies: string[];
  chronicConditions: string[];
  language: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  uhid: string;
  bloodGroup: string;
  isPrimary: boolean;
  linkedAppointments: number;
  photo?: string;
}

export interface Appointment {
  id: string;
  appointmentNumber: string;
  patientId: string;
  patientName: string;
  doctorName: string;
  doctorSpecialty: string;
  department: string;
  date: string;
  time: string;
  consultationType: ConsultationType;
  status: AppointmentStatus;
  queueNumber?: number;
  tokenNumber?: string;
  room?: string;
  floor?: string;
  reason: string;
  notes?: string;
  fee: number;
  paymentStatus: PaymentStatus;
  followUp?: string;
  rating?: number;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  qualification: string;
  experience: number;
  rating: number;
  consultationFee: number;
  availableSlots: string[];
  hospital: string;
  department: string;
  languages: string[];
  avatar?: string;
}

export interface Prescription {
  id: string;
  prescriptionNumber: string;
  patientId: string;
  doctorName: string;
  specialty: string;
  date: string;
  diagnosis: string;
  medicines: Medicine[];
  instructions: string;
  followUp?: string;
  status: MedicationStatus;
}

export interface Medicine {
  id: string;
  name: string;
  genericName: string;
  dosage: string;
  frequency: string;
  duration: string;
  timing: string[];
  instructions: string;
  refillAt?: number;
  currentSupply?: number;
  category: string;
}

export interface LabReport {
  id: string;
  reportNumber: string;
  testName: string;
  testCategory: string;
  orderedBy: string;
  orderedDate: string;
  collectedDate?: string;
  resultDate?: string;
  status: ReportStatus;
  value?: string;
  unit?: string;
  referenceRange?: string;
  isAbnormal?: boolean;
  criticalFlag?: boolean;
  labName: string;
}

export interface RadiologyReport {
  id: string;
  reportNumber: string;
  studyType: "X-Ray" | "CT" | "MRI" | "Ultrasound" | "Mammography";
  studyName: string;
  bodyPart: string;
  orderedBy: string;
  orderedDate: string;
  completedDate?: string;
  status: ReportStatus;
  findings?: string;
  impression?: string;
  radiologist: string;
  hasDicomImages: boolean;
}

export interface MedicationReminder {
  id: string;
  medicineName: string;
  dosage: string;
  reminderTime: string;
  timing: "Morning" | "Afternoon" | "Evening" | "Night";
  status: ReminderStatus;
  prescribedBy: string;
  refillDate?: string;
  refillAt?: number;
  currentSupply?: number;
  notes?: string;
}

export interface InsurancePolicy {
  id: string;
  policyNumber: string;
  provider: string;
  policyType: string;
  coverageAmount: number;
  consumedAmount: number;
  remainingAmount: number;
  validFrom: string;
  validTill: string;
  cashlessEligible: boolean;
  tpaName: string;
  insuredName: string;
  relationship: string;
  groupNumber?: string;
}

export interface InsuranceClaim {
  id: string;
  claimNumber: string;
  policyId: string;
  invoiceNumber: string;
  hospitalName: string;
  admissionDate: string;
  dischargeDate?: string;
  claimAmount: number;
  approvedAmount?: number;
  status: ClaimStatus;
  filedDate: string;
  settlementDate?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  department: string;
  description: string;
  amount: number;
  gstAmount: number;
  discount: number;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  paymentStatus: PaymentStatus;
  paymentMode?: string;
}

export interface Teleconsultation {
  id: string;
  consultationId: string;
  doctorName: string;
  specialty: string;
  scheduledDate: string;
  scheduledTime: string;
  consultationType: "Video" | "Audio" | "Chat";
  status: "Scheduled" | "In Progress" | "Completed" | "Cancelled" | "Missed";
  joinUrl?: string;
  notes?: string;
  prescriptionId?: string;
  duration?: number;
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionLabel?: string;
  actionRoute?: string;
  priority: "High" | "Medium" | "Low";
}

export interface HealthPackage {
  id: string;
  name: string;
  category: string;
  description: string;
  tests: string[];
  price: number;
  originalPrice: number;
  duration: string;
  benefits: string[];
  popular?: boolean;
}

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  isPrimary: boolean;
}

export interface FeedbackEntry {
  id: string;
  appointmentId: string;
  doctorName: string;
  rating: number;
  comments: string;
  category: string;
  date: string;
}

/* ------------------------------------------------------------------ */
/* Patient Profile                                                      */
/* ------------------------------------------------------------------ */

export const PATIENT_PROFILE: PatientProfile = {
  id: "PAT-001",
  name: "Priya Sharma",
  uhid: "MRN-2024-001247",
  mobile: "+91 98765 43210",
  email: "priya.sharma@gmail.com",
  dateOfBirth: "1992-06-15",
  age: 34,
  gender: "Female",
  bloodGroup: "B+",
  address: "42, Koregaon Park, Lane 7",
  city: "Pune",
  state: "Maharashtra",
  pincode: "411001",
  emergencyContact: "+91 98765 43211",
  emergencyName: "Rahul Sharma",
  insuranceProvider: "Star Health Insurance",
  policyNumber: "SHI-2025-88712",
  allergies: ["Penicillin", "Sulfa Drugs"],
  chronicConditions: [],
  language: "English",
};

/* ------------------------------------------------------------------ */
/* Family Members                                                       */
/* ------------------------------------------------------------------ */

export const FAMILY_MEMBERS: FamilyMember[] = [
  { id: "FM-001", name: "Priya Sharma", relationship: "Self", age: 34, gender: "Female", uhid: "MRN-2024-001247", bloodGroup: "B+", isPrimary: true, linkedAppointments: 8 },
  { id: "FM-002", name: "Rahul Sharma", relationship: "Husband", age: 37, gender: "Male", uhid: "MRN-2024-001248", bloodGroup: "A+", isPrimary: false, linkedAppointments: 3 },
  { id: "FM-003", name: "Ananya Sharma", relationship: "Daughter", age: 8, gender: "Female", uhid: "MRN-2024-001249", bloodGroup: "B+", isPrimary: false, linkedAppointments: 5 },
  { id: "FM-004", name: "Vikram Sharma", relationship: "Father", age: 62, gender: "Male", uhid: "MRN-2024-001250", bloodGroup: "O+", isPrimary: false, linkedAppointments: 12 },
];

/* ------------------------------------------------------------------ */
/* Doctors                                                              */
/* ------------------------------------------------------------------ */

export const DOCTORS: Doctor[] = [
  { id: "DOC-001", name: "Dr. Meera Joshi", specialty: "General Medicine", qualification: "MBBS, MD (Internal Medicine)", experience: 18, rating: 4.8, consultationFee: 800, availableSlots: ["09:00", "09:30", "10:00", "10:30", "11:00", "14:00", "14:30", "15:00"], hospital: "Meridian Multi-Speciality Hospital", department: "General Medicine", languages: ["English", "Hindi", "Marathi"] },
  { id: "DOC-002", name: "Dr. Arjun Mehta", specialty: "Cardiology", qualification: "MBBS, DM (Cardiology), FACC", experience: 22, rating: 4.9, consultationFee: 1200, availableSlots: ["10:00", "10:30", "11:00", "14:00", "14:30"], hospital: "Meridian Multi-Speciality Hospital", department: "Cardiology", languages: ["English", "Hindi"] },
  { id: "DOC-003", name: "Dr. Sneha Kapoor", specialty: "Dermatology", qualification: "MBBS, MD (Dermatology), DVD", experience: 12, rating: 4.7, consultationFee: 900, availableSlots: ["09:00", "09:30", "10:00", "11:00", "11:30", "15:00", "15:30"], hospital: "Meridian Multi-Speciality Hospital", department: "Dermatology", languages: ["English", "Hindi", "Kannada"] },
  { id: "DOC-004", name: "Dr. Rajesh Kulkarni", specialty: "Orthopaedics", qualification: "MBBS, MS (Ortho), DNB", experience: 20, rating: 4.6, consultationFee: 1000, availableSlots: ["09:00", "10:00", "11:00", "14:00", "16:00"], hospital: "Meridian Multi-Speciality Hospital", department: "Orthopaedics", languages: ["English", "Hindi", "Marathi"] },
  { id: "DOC-005", name: "Dr. Priya Nair", specialty: "Gynaecology", qualification: "MBBS, MS (OBG), DNB", experience: 15, rating: 4.8, consultationFee: 1000, availableSlots: ["09:00", "09:30", "10:00", "10:30", "14:00", "14:30"], hospital: "Meridian Multi-Speciality Hospital", department: "Obstetrics & Gynaecology", languages: ["English", "Hindi", "Tamil"] },
  { id: "DOC-006", name: "Dr. Imran Sheikh", specialty: "Pulmonology", qualification: "MBBS, MD (Pulmonology), FCCP", experience: 14, rating: 4.5, consultationFee: 900, availableSlots: ["10:00", "11:00", "14:00", "15:00", "16:00"], hospital: "Meridian Multi-Speciality Hospital", department: "Pulmonology", languages: ["English", "Hindi", "Urdu"] },
  { id: "DOC-007", name: "Dr. Kavita Deshmukh", specialty: "Paediatrics", qualification: "MBBS, MD (Paediatrics), IAP Fellowship", experience: 16, rating: 4.9, consultationFee: 800, availableSlots: ["09:00", "09:30", "10:00", "10:30", "11:00", "14:00", "14:30"], hospital: "Meridian Multi-Speciality Hospital", department: "Paediatrics", languages: ["English", "Hindi", "Marathi"] },
  { id: "DOC-008", name: "Dr. Suresh Patil", specialty: "ENT", qualification: "MBBS, MS (ENT), DLO", experience: 19, rating: 4.4, consultationFee: 800, availableSlots: ["09:00", "10:00", "11:00", "14:00", "15:00"], hospital: "Meridian Multi-Speciality Hospital", department: "ENT", languages: ["English", "Hindi", "Marathi"] },
];

/* ------------------------------------------------------------------ */
/* Appointments                                                         */
/* ------------------------------------------------------------------ */

export const APPOINTMENTS: Appointment[] = [
  { id: "APT-001", appointmentNumber: "APT-2026-07891", patientId: "PAT-001", patientName: "Priya Sharma", doctorName: "Dr. Meera Joshi", doctorSpecialty: "General Medicine", department: "General Medicine", date: "2026-07-25", time: "10:00", consultationType: "In-Person", status: "Upcoming", queueNumber: 5, tokenNumber: "T-042", room: "305", floor: "3rd Floor", reason: "Annual health checkup", fee: 800, paymentStatus: "Paid" },
  { id: "APT-002", appointmentNumber: "APT-2026-07845", patientId: "PAT-001", patientName: "Priya Sharma", doctorName: "Dr. Arjun Mehta", doctorSpecialty: "Cardiology", department: "Cardiology", date: "2026-07-20", time: "14:00", consultationType: "In-Person", status: "Completed", room: "410", floor: "4th Floor", reason: "Cardiac follow-up", fee: 1200, paymentStatus: "Paid", rating: 5, followUp: "2026-08-20" },
  { id: "APT-003", appointmentNumber: "APT-2026-07812", patientId: "PAT-001", patientName: "Priya Sharma", doctorName: "Dr. Sneha Kapoor", doctorSpecialty: "Dermatology", department: "Dermatology", date: "2026-07-15", time: "11:00", consultationType: "Video", status: "Completed", reason: "Skin rash consultation", fee: 900, paymentStatus: "Paid", rating: 4 },
  { id: "APT-004", appointmentNumber: "APT-2026-07798", patientId: "PAT-001", patientName: "Priya Sharma", doctorName: "Dr. Priya Nair", doctorSpecialty: "Gynaecology", department: "OBG", date: "2026-07-28", time: "09:30", consultationType: "In-Person", status: "Upcoming", room: "202", floor: "2nd Floor", reason: "Routine checkup", fee: 1000, paymentStatus: "Pending" },
  { id: "APT-005", appointmentNumber: "APT-2026-07756", patientId: "PAT-001", patientName: "Priya Sharma", doctorName: "Dr. Meera Joshi", doctorSpecialty: "General Medicine", department: "General Medicine", date: "2026-06-20", time: "09:00", consultationType: "In-Person", status: "Completed", reason: "Fever and cold", fee: 800, paymentStatus: "Paid", rating: 5 },
  { id: "APT-006", appointmentNumber: "APT-2026-07920", patientId: "PAT-001", patientName: "Priya Sharma", doctorName: "Dr. Kavita Deshmukh", doctorSpecialty: "Paediatrics", department: "Paediatrics", date: "2026-07-26", time: "14:30", consultationType: "In-Person", status: "Upcoming", room: "105", floor: "1st Floor", reason: "Ananya vaccination", fee: 800, paymentStatus: "Paid" },
];

/* ------------------------------------------------------------------ */
/* Prescriptions                                                        */
/* ------------------------------------------------------------------ */

export const PRESCRIPTIONS: Prescription[] = [
  { id: "RX-001", prescriptionNumber: "RX-2026-04521", patientId: "PAT-001", doctorName: "Dr. Meera Joshi", specialty: "General Medicine", date: "2026-06-20", diagnosis: "Viral Upper Respiratory Infection", medicines: [
    { id: "MED-001", name: "Azithromycin 500mg", genericName: "Azithromycin", dosage: "500mg", frequency: "Once daily", duration: "5 days", timing: ["Morning"], instructions: "Take after food", refillAt: 5, currentSupply: 3, category: "Antibiotic" },
    { id: "MED-002", name: "Paracetamol 650mg", genericName: "Paracetamol", dosage: "650mg", frequency: "Twice daily", duration: "3 days", timing: ["Morning", "Night"], instructions: "Take as needed for fever", category: "Analgesic" },
    { id: "MED-003", name: "Cetirizine 10mg", genericName: "Cetirizine", dosage: "10mg", frequency: "Once daily", duration: "5 days", timing: ["Night"], instructions: "Take before bedtime", category: "Antihistamine" },
  ], instructions: "Rest for 3 days. Drink plenty of fluids. Avoid cold items.", followUp: "2026-07-05", status: "Completed" },
  { id: "RX-002", prescriptionNumber: "RX-2026-04598", patientId: "PAT-001", doctorName: "Dr. Arjun Mehta", specialty: "Cardiology", date: "2026-07-20", diagnosis: "Essential Hypertension — Controlled", medicines: [
    { id: "MED-004", name: "Amlodipine 5mg", genericName: "Amlodipine Besylate", dosage: "5mg", frequency: "Once daily", duration: "Ongoing", timing: ["Morning"], instructions: "Take at the same time daily", refillAt: 15, currentSupply: 22, category: "Antihypertensive" },
    { id: "MED-005", name: "Aspirin 75mg", genericName: "Aspirin", dosage: "75mg", frequency: "Once daily", duration: "Ongoing", timing: ["Morning"], instructions: "Take after food. Do not crush.", refillAt: 15, currentSupply: 18, category: "Antiplatelet" },
  ], instructions: "Continue medication. Monitor blood pressure daily. Low-salt diet recommended.", followUp: "2026-08-20", status: "Active" },
  { id: "RX-003", prescriptionNumber: "RX-2026-04612", patientId: "PAT-001", doctorName: "Dr. Sneha Kapoor", specialty: "Dermatology", date: "2026-07-15", diagnosis: "Contact Dermatitis — Left forearm", medicines: [
    { id: "MED-006", name: "Betamethasone Valerate 0.1% Cream", genericName: "Betamethasone", dosage: "0.1% Cream", frequency: "Twice daily", duration: "7 days", timing: ["Morning", "Night"], instructions: "Apply thin layer on affected area", category: "Topical Steroid" },
    { id: "MED-007", name: "Allegra 120mg", genericName: "Fexofenadine", dosage: "120mg", frequency: "Once daily", duration: "7 days", timing: ["Morning"], instructions: "Take before food", category: "Antihistamine" },
  ], instructions: "Avoid contact with irritants. Use cotton gloves when cleaning.", status: "Completed" },
];

/* ------------------------------------------------------------------ */
/* Laboratory Reports                                                   */
/* ------------------------------------------------------------------ */

export const LAB_REPORTS: LabReport[] = [
  { id: "LR-001", reportNumber: "LAB-2026-08934", testName: "Complete Blood Count (CBC)", testCategory: "Haematology", orderedBy: "Dr. Meera Joshi", orderedDate: "2026-07-20", collectedDate: "2026-07-20", resultDate: "2026-07-20", status: "Normal", value: "Within normal limits", labName: "Meridian Central Lab" },
  { id: "LR-002", reportNumber: "LAB-2026-08935", testName: "Lipid Profile", testCategory: "Biochemistry", orderedBy: "Dr. Arjun Mehta", orderedDate: "2026-07-20", collectedDate: "2026-07-20", resultDate: "2026-07-21", status: "Abnormal", value: "Total Cholesterol: 242 mg/dL", unit: "mg/dL", referenceRange: "< 200 mg/dL", isAbnormal: true, labName: "Meridian Central Lab" },
  { id: "LR-003", reportNumber: "LAB-2026-08936", testName: "HbA1c (Glycated Haemoglobin)", testCategory: "Biochemistry", orderedBy: "Dr. Meera Joshi", orderedDate: "2026-07-20", collectedDate: "2026-07-20", resultDate: "2026-07-21", status: "Normal", value: "5.4%", unit: "%", referenceRange: "< 5.7%", labName: "Meridian Central Lab" },
  { id: "LR-004", reportNumber: "LAB-2026-08937", testName: "Thyroid Profile (TSH, T3, T4)", testCategory: "Endocrinology", orderedBy: "Dr. Meera Joshi", orderedDate: "2026-07-20", collectedDate: "2026-07-20", resultDate: "2026-07-21", status: "Normal", value: "TSH: 2.8 mIU/L", unit: "mIU/L", referenceRange: "0.4 - 4.0 mIU/L", labName: "Meridian Central Lab" },
  { id: "LR-005", reportNumber: "LAB-2026-08938", testName: "Vitamin D (25-Hydroxy)", testCategory: "Biochemistry", orderedBy: "Dr. Meera Joshi", orderedDate: "2026-07-20", collectedDate: "2026-07-20", resultDate: "2026-07-21", status: "Abnormal", value: "18 ng/mL", unit: "ng/mL", referenceRange: "30 - 100 ng/mL", isAbnormal: true, labName: "Meridian Central Lab" },
  { id: "LR-006", reportNumber: "LAB-2026-08939", testName: "Liver Function Test (LFT)", testCategory: "Biochemistry", orderedBy: "Dr. Arjun Mehta", orderedDate: "2026-07-20", collectedDate: "2026-07-20", resultDate: "2026-07-21", status: "Normal", value: "All parameters within normal limits", labName: "Meridian Central Lab" },
  { id: "LR-007", reportNumber: "LAB-2026-08950", testName: "Urine Routine & Microscopy", testCategory: "Pathology", orderedBy: "Dr. Meera Joshi", orderedDate: "2026-07-20", collectedDate: "2026-07-20", status: "Pending", labName: "Meridian Central Lab" },
  { id: "LR-008", reportNumber: "LAB-2026-08951", testName: "Iron Studies", testCategory: "Biochemistry", orderedBy: "Dr. Meera Joshi", orderedDate: "2026-07-20", collectedDate: "2026-07-20", status: "Pending", labName: "Meridian Central Lab" },
];

/* ------------------------------------------------------------------ */
/* Radiology Reports                                                    */
/* ------------------------------------------------------------------ */

export const RADIOLOGY_REPORTS: RadiologyReport[] = [
  { id: "RR-001", reportNumber: "RAD-2026-03241", studyType: "X-Ray", studyName: "Chest X-Ray (PA View)", bodyPart: "Chest", orderedBy: "Dr. Meera Joshi", orderedDate: "2026-07-20", completedDate: "2026-07-20", status: "Normal", findings: "Clear lung fields. Normal cardiac silhouette. No pleural effusion or pneumothorax.", impression: "Normal chest radiograph.", radiologist: "Dr. Vikram Rao", hasDicomImages: true },
  { id: "RR-002", reportNumber: "RAD-2026-03242", studyType: "Ultrasound", studyName: "Abdomen & Pelvis Ultrasound", bodyPart: "Abdomen", orderedBy: "Dr. Priya Nair", orderedDate: "2026-07-18", completedDate: "2026-07-18", status: "Normal", findings: "Liver, gallbladder, pancreas, spleen, both kidneys — normal. No calculi. Uterus and adnexa normal.", impression: "Normal ultrasound abdomen and pelvis.", radiologist: "Dr. Vikram Rao", hasDicomImages: true },
  { id: "RR-003", reportNumber: "RAD-2026-03200", studyType: "MRI", studyName: "MRI Brain with Contrast", bodyPart: "Brain", orderedBy: "Dr. Arjun Mehta", orderedDate: "2026-07-05", completedDate: "2026-07-05", status: "Normal", findings: "No intracranial mass lesion. No evidence of infarction. Ventricular system normal. No abnormal enhancement.", impression: "Normal MRI brain study.", radiologist: "Dr. Anjali Bhatt", hasDicomImages: true },
];

/* ------------------------------------------------------------------ */
/* Medication Reminders                                                 */
/* ------------------------------------------------------------------ */

export const MEDICATION_REMINDERS: MedicationReminder[] = [
  { id: "REM-001", medicineName: "Amlodipine 5mg", dosage: "5mg", reminderTime: "08:00", timing: "Morning", status: "Taken", prescribedBy: "Dr. Arjun Mehta", refillDate: "2026-08-05", refillAt: 15, currentSupply: 22, notes: "Take after breakfast" },
  { id: "REM-002", medicineName: "Aspirin 75mg", dosage: "75mg", reminderTime: "08:00", timing: "Morning", status: "Taken", prescribedBy: "Dr. Arjun Mehta", refillDate: "2026-08-05", refillAt: 15, currentSupply: 18, notes: "Take after food" },
  { id: "REM-003", medicineName: "Vitamin D3 60K", dosage: "60,000 IU", reminderTime: "10:00", timing: "Morning", status: "Pending", prescribedBy: "Dr. Meera Joshi", refillAt: 4, currentSupply: 2, notes: "Once weekly — Sunday" },
  { id: "REM-004", medicineName: "Calcium + Vitamin D3", dosage: "500mg + 250IU", reminderTime: "20:00", timing: "Night", status: "Pending", prescribedBy: "Dr. Meera Joshi", refillAt: 15, currentSupply: 20, notes: "Take after dinner" },
];

/* ------------------------------------------------------------------ */
/* Insurance Policies                                                   */
/* ------------------------------------------------------------------ */

export const INSURANCE_POLICY: InsurancePolicy = {
  id: "INS-001",
  policyNumber: "SHI-2025-88712",
  provider: "Star Health Insurance",
  policyType: "Individual",
  coverageAmount: 500000,
  consumedAmount: 85000,
  remainingAmount: 415000,
  validFrom: "2025-04-01",
  validTill: "2026-03-31",
  cashlessEligible: true,
  tpaName: "MDIndia TPA",
  insuredName: "Priya Sharma",
  relationship: "Self",
};

export const INSURANCE_CLAIMS: InsuranceClaim[] = [
  { id: "CLM-001", claimNumber: "CLM-2026-00421", policyId: "INS-001", invoiceNumber: "INV-2026-03245", hospitalName: "Meridian Multi-Speciality Hospital", admissionDate: "2026-05-10", dischargeDate: "2026-05-12", claimAmount: 85000, approvedAmount: 78000, status: "Settled", filedDate: "2026-05-13", settlementDate: "2026-06-01" },
];

/* ------------------------------------------------------------------ */
/* Invoices & Payments                                                  */
/* ------------------------------------------------------------------ */

export const INVOICES: Invoice[] = [
  { id: "INV-001", invoiceNumber: "INV-2026-03245", date: "2026-05-12", department: "IPD", description: "Day Care Procedure — Dr. Arjun Mehta", amount: 85000, gstAmount: 5100, discount: 0, totalAmount: 90100, paidAmount: 78000, balanceAmount: 0, paymentStatus: "Paid", paymentMode: "Insurance" },
  { id: "INV-002", invoiceNumber: "INV-2026-03312", date: "2026-07-20", department: "OPD", description: "Consultation — Dr. Arjun Mehta (Cardiology)", amount: 1200, gstAmount: 0, discount: 0, totalAmount: 1200, paidAmount: 1200, balanceAmount: 0, paymentStatus: "Paid", paymentMode: "UPI" },
  { id: "INV-003", invoiceNumber: "INV-2026-03318", date: "2026-07-20", department: "Pathology", description: "Blood Investigation Package — Annual Health Check", amount: 3800, gstAmount: 0, discount: 200, totalAmount: 3600, paidAmount: 3600, balanceAmount: 0, paymentStatus: "Paid", paymentMode: "Card" },
  { id: "INV-004", invoiceNumber: "INV-2026-03340", date: "2026-07-28", department: "OPD", description: "Consultation — Dr. Priya Nair (Gynaecology)", amount: 1000, gstAmount: 0, discount: 0, totalAmount: 1000, paidAmount: 0, balanceAmount: 1000, paymentStatus: "Pending" },
];

/* ------------------------------------------------------------------ */
/* Teleconsultation                                                     */
/* ------------------------------------------------------------------ */

export const TELECONSULTATIONS: Teleconsultation[] = [
  { id: "TC-001", consultationId: "TEL-2026-00891", doctorName: "Dr. Sneha Kapoor", specialty: "Dermatology", scheduledDate: "2026-07-15", scheduledTime: "11:00", consultationType: "Video", status: "Completed", duration: 18, notes: "Reviewed skin rash. Prescribed topical medication.", prescriptionId: "RX-003" },
  { id: "TC-002", consultationId: "TEL-2026-00920", doctorName: "Dr. Meera Joshi", specialty: "General Medicine", scheduledDate: "2026-07-25", scheduledTime: "16:00", consultationType: "Video", status: "Scheduled", joinUrl: "https://meridian.health/video/TEL-2026-00920" },
];

/* ------------------------------------------------------------------ */
/* Notifications                                                        */
/* ------------------------------------------------------------------ */

export const NOTIFICATIONS: Notification[] = [
  { id: "NTF-001", type: "Appointment", title: "Appointment Confirmed", message: "Your appointment with Dr. Meera Joshi on 25 Jul at 10:00 AM has been confirmed. Token: T-042.", timestamp: "2026-07-22 15:30", read: false, priority: "High" },
  { id: "NTF-002", type: "Lab Result", title: "Lab Report Ready", message: "Your Lipid Profile report is ready. Total Cholesterol is slightly elevated.", timestamp: "2026-07-21 14:00", read: false, actionLabel: "View Report", priority: "High" },
  { id: "NTF-003", type: "Reminder", title: "Medication Reminder", message: "Time to take Amlodipine 5mg and Aspirin 75mg.", timestamp: "2026-07-23 08:00", read: false, priority: "Medium" },
  { id: "NTF-004", type: "Billing", title: "Payment Receipt", message: "Payment of Rs 1,200 received for consultation with Dr. Arjun Mehta. Receipt: RCT-2026-0891.", timestamp: "2026-07-20 14:30", read: true, priority: "Low" },
  { id: "NTF-005", type: "Prescription", title: "Prescription Updated", message: "Dr. Sneha Kapoor has updated your prescription for Contact Dermatitis.", timestamp: "2026-07-15 12:00", read: true, priority: "Medium" },
  { id: "NTF-006", type: "General", title: "Health Package Offer", message: "Exclusive 20% discount on Annual Executive Health Package. Valid till 31 Aug 2026.", timestamp: "2026-07-20 10:00", read: true, actionLabel: "View Package", priority: "Low" },
  { id: "NTF-007", type: "Appointment", title: "Appointment Reminder", message: "Reminder: You have an appointment with Dr. Kavita Deshmukh on 26 Jul at 2:30 PM for Ananya's vaccination.", timestamp: "2026-07-25 09:00", read: false, priority: "High" },
];

/* ------------------------------------------------------------------ */
/* Emergency Contacts                                                   */
/* ------------------------------------------------------------------ */

export const EMERGENCY_CONTACTS: EmergencyContact[] = [
  { id: "EC-001", name: "Rahul Sharma", relationship: "Husband", phone: "+91 98765 43211", isPrimary: true },
  { id: "EC-002", name: "Vikram Sharma", relationship: "Father", phone: "+91 98765 43212", isPrimary: false },
  { id: "EC-003", name: "Dr. Meera Joshi", relationship: "Family Physician", phone: "+91 98765 43200", isPrimary: false },
];

/* ------------------------------------------------------------------ */
/* Health Packages                                                       */
/* ------------------------------------------------------------------ */

export const HEALTH_PACKAGES: HealthPackage[] = [
  { id: "HP-001", name: "Annual Executive Health Check", category: "Preventive", description: "Comprehensive health screening with 40+ tests including cardiac, metabolic, and organ function assessment.", tests: ["Complete Blood Count", "Lipid Profile", "Liver Function Test", "Kidney Function Test", "Thyroid Profile", "HbA1c", "Chest X-Ray", "ECG", "Ultrasound Abdomen", "Eye Examination", "Dental Checkup"], price: 4999, originalPrice: 7500, duration: "Half Day", benefits: ["Free doctor consultation", "Breakfast included", "Same-day reports", "Digital health record"], popular: true },
  { id: "HP-002", name: "Women's Wellness Package", category: "Preventive", description: "Specialized health package for women including gynaecological and bone health assessment.", tests: ["CBC", "Thyroid Profile", "Iron Studies", "Vitamin D", "Pap Smear", "Mammography", "Bone Density (DEXA)", "Pelvic Ultrasound", "Breast Ultrasound"], price: 5999, originalPrice: 8500, duration: "Full Day", benefits: ["Gynaecologist consultation", "Nutritionist session", "Diet plan", "Digital reports"] },
  { id: "HP-003", name: "Cardiac Health Package", category: "Preventive", description: "Cardiac screening for patients with risk factors or family history of heart disease.", tests: ["ECG", "Echocardiography", "Treadmill Test (TMT)", "Lipid Profile", "Blood Sugar (Fasting & PP)", "HbA1c", "hs-CRP", "Homocysteine", "Carotid Doppler"], price: 6999, originalPrice: 10000, duration: "Full Day", benefits: ["Cardiologist consultation", "Lifestyle counselling", "Risk assessment report", "Follow-up plan"] },
  { id: "HP-004", name: "Paediatric Vaccination Package", category: "Vaccination", description: "Complete vaccination schedule for children aged 0-6 years as per IAP guidelines.", tests: ["BCG", "OPV", "Hepatitis B", "Pentavalent", "Rotavirus", "MMR", "Varicella", "PCV", "Influenza", "Typhoid", "Hepatitis A"], price: 15000, originalPrice: 20000, duration: "Multi-visit", benefits: ["Paediatrician supervision", "Vaccination card", "Digital reminders", "Adverse event monitoring"] },
  { id: "HP-005", name: "Corporate Wellness Plan", category: "Corporate", description: "Annual health plan for corporate employees with preventive checkups and teleconsultation.", tests: ["Annual Physical", "Blood Tests", "Vision Screening", "Audiometry", "Spirometry", "Stress Assessment"], price: 3999, originalPrice: 5500, duration: "Annual", benefits: ["Unlimited teleconsultations", "24/7 nurse helpline", "Mental health support", "Wellness app access"] },
  { id: "HP-006", name: "Senior Citizen Health Package", category: "Preventive", description: "Comprehensive health assessment designed for individuals above 60 years.", tests: ["CBC", "Lipid Profile", "Liver Function", "Kidney Function", "Thyroid", "HbA1c", "PSA (Men)", "Bone Density", "Eye Exam", "Audiometry", "ECG", "Chest X-Ray", "Ultrasound"], price: 5499, originalPrice: 8000, duration: "Full Day", benefits: ["Geriatrician consultation", "Physiotherapy session", "Diet plan", "Priority scheduling"] },
];

/* ------------------------------------------------------------------ */
/* Health Score                                                         */
/* ------------------------------------------------------------------ */

export const HEALTH_SCORE = {
  overall: 82,
  cardiac: 78,
  metabolic: 88,
  mental: 85,
  physical: 75,
  nutrition: 80,
};

/* ------------------------------------------------------------------ */
/* Helpers                                                              */
/* ------------------------------------------------------------------ */

export function appointmentStatusTone(s: AppointmentStatus): "success" | "warning" | "danger" | "info" | "brand" | "neutral" {
  switch (s) {
    case "Completed": return "success";
    case "Upcoming": return "info";
    case "In Queue": return "warning";
    case "Checked In": return "brand";
    case "Cancelled": return "danger";
    case "Rescheduled": return "warning";
    default: return "neutral";
  }
}

export function reportStatusTone(s: ReportStatus): "success" | "warning" | "danger" | "info" | "neutral" {
  switch (s) {
    case "Normal": return "success";
    case "Completed": return "success";
    case "Abnormal": return "warning";
    case "Critical": return "danger";
    case "Pending": return "info";
    default: return "neutral";
  }
}

export function paymentStatusTone(s: PaymentStatus): "success" | "warning" | "danger" | "info" | "neutral" {
  switch (s) {
    case "Paid": return "success";
    case "Pending": return "warning";
    case "Partial": return "warning";
    case "Overdue": return "danger";
    case "Refunded": return "info";
    default: return "neutral";
  }
}

export function claimStatusTone(s: ClaimStatus): "success" | "warning" | "danger" | "info" | "neutral" {
  switch (s) {
    case "Approved": case "Settled": return "success";
    case "Submitted": case "In Process": return "info";
    case "Rejected": return "danger";
    default: return "neutral";
  }
}

export function formatINR(amount: number): string {
  return "Rs " + amount.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

export function timeAgo(timestamp: string): string {
  const now = new Date("2026-07-23T12:00:00");
  const then = new Date(timestamp);
  const diffMin = Math.floor((now.getTime() - then.getTime()) / 60000);
  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH}h ago`;
  const diffD = Math.floor(diffH / 24);
  return `${diffD}d ago`;
}
