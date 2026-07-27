/* ------------------------------------------------------------------ */
/* Realistic mock IPD data for Meridian Multi-Speciality Hospital       */
/* ------------------------------------------------------------------ */

export type BedStatus = "Available" | "Occupied" | "Reserved" | "Cleaning" | "Maintenance" | "Blocked";
export type RoomType = "General" | "Semi-Private" | "Private" | "Deluxe" | "Suite" | "Isolation" | "ICU" | "NICU" | "CCU";
export type AdmissionStatus = "Requested" | "Approved" | "Admitted" | "Transferred" | "Discharged" | "Cancelled";
export type TransferStatus = "Pending" | "In Transit" | "Completed" | "Cancelled";
export type CleaningStatus = "Pending" | "In Progress" | "Completed" | "Inspected" | "Ready";
export type DischargeStatus = "Planning" | "Ready" | "Approved" | "Discharged";
export type IsolationType = "Contact" | "Droplet" | "Airborne" | "Negative Pressure";

export interface Ward {
  id: string;
  name: string;
  type: string;
  floor: number;
  totalBeds: number;
  occupiedBeds: number;
  availableBeds: number;
  reservedBeds: number;
  cleaningBeds: number;
  headNurse: string;
  department: string;
}

export interface Room {
  id: string;
  number: string;
  wardId: string;
  wardName: string;
  type: RoomType;
  totalBeds: number;
  occupiedBeds: number;
  status: "Active" | "Maintenance" | "Out of Service";
  floor: number;
  hasAC: boolean;
  hasTV: boolean;
  hasAttachedBath: boolean;
}

export interface Bed {
  id: string;
  number: string;
  roomId: string;
  roomNumber: string;
  wardId: string;
  wardName: string;
  status: BedStatus;
  patientName?: string;
  uhid?: string;
  doctor?: string;
  admissionDate?: string;
  expectedDischarge?: string;
  lengthOfStay?: number;
  cleaningStaff?: string;
  cleaningStartTime?: string;
  cleaningEndTime?: string;
}

export interface Inpatient {
  uhid: string;
  admissionId: string;
  patientName: string;
  age: number;
  gender: "Male" | "Female";
  blood: string;
  doctor: string;
  department: string;
  ward: string;
  room: string;
  bed: string;
  admissionDate: string;
  expectedDischarge: string;
  lengthOfStay: number;
  diagnosis: string;
  insurance: string;
  status: AdmissionStatus;
  isolation?: IsolationType;
  clinicalStatus: "Stable" | "Guarded" | "Critical" | "Improving";
}

export interface AdmissionRequest {
  requestId: string;
  patientName: string;
  uhid: string;
  age: number;
  gender: "Male" | "Female";
  doctor: string;
  department: string;
  priority: "Routine" | "Urgent" | "Emergency";
  diagnosis: string;
  requestTime: string;
  insurance: string;
  estimatedStay: number;
  specialRequirements?: string;
}

export interface TransferRecord {
  transferId: string;
  patientName: string;
  uhid: string;
  fromWard: string;
  fromRoom: string;
  fromBed: string;
  toWard: string;
  toRoom: string;
  toBed: string;
  reason: string;
  requestTime: string;
  status: TransferStatus;
  requestedBy: string;
  transportTeam: string;
}

export interface CleaningRequest {
  requestId: string;
  bedId: string;
  bedNumber: string;
  roomNumber: string;
  wardName: string;
  patientName: string;
  dischargeTime: string;
  assignedTo: string;
  status: CleaningStatus;
  requestTime: string;
  startTime?: string;
  endTime?: string;
  inspectionBy?: string;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  detail: string;
  patientName?: string;
  bedId?: string;
  ipAddress: string;
}

/* ------------------------------------------------------------------ */
/* Wards                                                               */
/* ------------------------------------------------------------------ */

export const WARDS: Ward[] = [
  { id: "WD-01", name: "General Ward A", type: "Medical", floor: 1, totalBeds: 30, occupiedBeds: 22, availableBeds: 5, reservedBeds: 2, cleaningBeds: 1, headNurse: "Sunita Kute", department: "General Medicine" },
  { id: "WD-02", name: "General Ward B", type: "Surgical", floor: 1, totalBeds: 28, occupiedBeds: 20, availableBeds: 4, reservedBeds: 2, cleaningBeds: 2, headNurse: "Anita Deshmukh", department: "Surgery" },
  { id: "WD-03", name: "Cardiac Ward", type: "Cardiology", floor: 2, totalBeds: 20, occupiedBeds: 16, availableBeds: 2, reservedBeds: 1, cleaningBeds: 1, headNurse: "Priya Kulkarni", department: "Cardiology" },
  { id: "WD-04", name: "Orthopedic Ward", type: "Orthopedics", floor: 2, totalBeds: 18, occupiedBeds: 12, availableBeds: 4, reservedBeds: 1, cleaningBeds: 1, headNurse: "Rekha Jadhav", department: "Orthopaedics" },
  { id: "WD-05", name: "Paediatric Ward", type: "Paediatrics", floor: 3, totalBeds: 16, occupiedBeds: 10, availableBeds: 4, reservedBeds: 1, cleaningBeds: 1, headNurse: "Kavita Sharma", department: "Paediatrics" },
  { id: "WD-06", name: "Gynaecology Ward", type: "Gynaecology", floor: 3, totalBeds: 14, occupiedBeds: 9, availableBeds: 3, reservedBeds: 1, cleaningBeds: 1, headNurse: "Meena Patil", department: "Gynaecology" },
  { id: "WD-07", name: "ICU", type: "Critical Care", floor: 4, totalBeds: 12, occupiedBeds: 10, availableBeds: 1, reservedBeds: 0, cleaningBeds: 1, headNurse: "Lata Bhave", department: "Critical Care" },
  { id: "WD-08", name: "CCU", type: "Cardiac Care", floor: 4, totalBeds: 8, occupiedBeds: 6, availableBeds: 1, reservedBeds: 1, cleaningBeds: 0, headNurse: "Suman Khandekar", department: "Cardiology" },
  { id: "WD-09", name: "NICU", type: "Neonatal", floor: 4, totalBeds: 10, occupiedBeds: 7, availableBeds: 2, reservedBeds: 1, cleaningBeds: 0, headNurse: "Asha More", department: "Paediatrics" },
  { id: "WD-10", name: "Emergency Observation", type: "Emergency", floor: 0, totalBeds: 8, occupiedBeds: 5, availableBeds: 2, reservedBeds: 0, cleaningBeds: 1, headNurse: "Neha Patil", department: "Emergency Medicine" },
];

/* ------------------------------------------------------------------ */
/* Rooms                                                               */
/* ------------------------------------------------------------------ */

export const ROOMS: Room[] = [
  { id: "RM-101", number: "101", wardId: "WD-01", wardName: "General Ward A", type: "General", totalBeds: 6, occupiedBeds: 5, status: "Active", floor: 1, hasAC: true, hasTV: false, hasAttachedBath: false },
  { id: "RM-102", number: "102", wardId: "WD-01", wardName: "General Ward A", type: "General", totalBeds: 6, occupiedBeds: 4, status: "Active", floor: 1, hasAC: true, hasTV: false, hasAttachedBath: false },
  { id: "RM-103", number: "103", wardId: "WD-01", wardName: "General Ward A", type: "Semi-Private", totalBeds: 4, occupiedBeds: 3, status: "Active", floor: 1, hasAC: true, hasTV: true, hasAttachedBath: true },
  { id: "RM-201", number: "201", wardId: "WD-03", wardName: "Cardiac Ward", type: "Private", totalBeds: 2, occupiedBeds: 2, status: "Active", floor: 2, hasAC: true, hasTV: true, hasAttachedBath: true },
  { id: "RM-202", number: "202", wardId: "WD-03", wardName: "Cardiac Ward", type: "Semi-Private", totalBeds: 4, occupiedBeds: 3, status: "Active", floor: 2, hasAC: true, hasTV: true, hasAttachedBath: true },
  { id: "RM-301", number: "301", wardId: "WD-05", wardName: "Paediatric Ward", type: "General", totalBeds: 4, occupiedBeds: 3, status: "Active", floor: 3, hasAC: true, hasTV: true, hasAttachedBath: false },
  { id: "RM-401", number: "401", wardId: "WD-07", wardName: "ICU", type: "ICU", totalBeds: 4, occupiedBeds: 4, status: "Active", floor: 4, hasAC: true, hasTV: false, hasAttachedBath: false },
  { id: "RM-402", number: "402", wardId: "WD-07", wardName: "ICU", type: "ICU", totalBeds: 4, occupiedBeds: 3, status: "Active", floor: 4, hasAC: true, hasTV: false, hasAttachedBath: false },
  { id: "RM-403", number: "403", wardId: "WD-07", wardName: "ICU", type: "ICU", totalBeds: 4, occupiedBeds: 3, status: "Active", floor: 4, hasAC: true, hasTV: false, hasAttachedBath: false },
  { id: "RM-ISO-01", number: "ISO-01", wardId: "WD-01", wardName: "General Ward A", type: "Isolation", totalBeds: 2, occupiedBeds: 1, status: "Active", floor: 1, hasAC: true, hasTV: true, hasAttachedBath: true },
];

/* ------------------------------------------------------------------ */
/* Beds                                                                */
/* ------------------------------------------------------------------ */

export const BEDS: Bed[] = [
  { id: "B-101-A", number: "101-A", roomId: "RM-101", roomNumber: "101", wardId: "WD-01", wardName: "General Ward A", status: "Occupied", patientName: "Rajesh Kumar", uhid: "MRD-2026-004821", doctor: "Dr. Arjun Mehta", admissionDate: "2026-07-20", expectedDischarge: "2026-07-25", lengthOfStay: 2 },
  { id: "B-101-B", number: "101-B", roomId: "RM-101", roomNumber: "101", wardId: "WD-01", wardName: "General Ward A", status: "Occupied", patientName: "Ganesh More", uhid: "MRD-2026-004830", doctor: "Dr. Kavya Nair", admissionDate: "2026-07-21", expectedDischarge: "2026-07-24", lengthOfStay: 1 },
  { id: "B-101-C", number: "101-C", roomId: "RM-101", roomNumber: "101", wardId: "WD-01", wardName: "General Ward A", status: "Available" },
  { id: "B-102-A", number: "102-A", roomId: "RM-102", roomNumber: "102", wardId: "WD-01", wardName: "General Ward A", status: "Occupied", patientName: "Deepak Joshi", uhid: "MRD-2026-004831", doctor: "Dr. Arjun Mehta", admissionDate: "2026-07-19", expectedDischarge: "2026-07-26", lengthOfStay: 3 },
  { id: "B-201-A", number: "201-A", roomId: "RM-201", roomNumber: "201", wardId: "WD-03", wardName: "Cardiac Ward", status: "Occupied", patientName: "Lakshmi Iyer", uhid: "MRD-2026-004824", doctor: "Dr. Arjun Mehta", admissionDate: "2026-07-18", expectedDischarge: "2026-07-28", lengthOfStay: 4, isolation: "Contact" },
  { id: "B-401-A", number: "401-A", roomId: "RM-401", roomNumber: "401", wardId: "WD-07", wardName: "ICU", status: "Occupied", patientName: "Anil Kulkarni", uhid: "MRD-2026-004833", doctor: "Dr. Imran Sheikh", admissionDate: "2026-07-22", expectedDischarge: "2026-07-29", lengthOfStay: 0, isolation: "Airborne" },
  { id: "B-402-A", number: "402-A", roomId: "RM-402", roomNumber: "402", wardId: "WD-07", wardName: "ICU", status: "Cleaning", cleaningStaff: "Ramesh Jadhav", cleaningStartTime: "2026-07-22 10:00" },
  { id: "B-103-A", number: "103-A", roomId: "RM-103", roomNumber: "103", wardId: "WD-01", wardName: "General Ward A", status: "Reserved", patientName: "Sunita Reddy", uhid: "MRD-2026-004826" },
  { id: "B-ISO-01", number: "ISO-01-A", roomId: "RM-ISO-01", roomNumber: "ISO-01", wardId: "WD-01", wardName: "General Ward A", status: "Occupied", patientName: "Mohammed Ansari", uhid: "MRD-2026-004825", doctor: "Dr. Sneha Iyer", admissionDate: "2026-07-21", expectedDischarge: "2026-07-25", lengthOfStay: 1, isolation: "Droplet" },
  { id: "B-301-A", number: "301-A", roomId: "RM-301", roomNumber: "301", wardId: "WD-05", wardName: "Paediatric Ward", status: "Occupied", patientName: "Aarav Sharma", uhid: "MRD-2026-004823", doctor: "Dr. Sneha Iyer", admissionDate: "2026-07-22", expectedDischarge: "2026-07-25", lengthOfStay: 0 },
  { id: "B-101-D", number: "101-D", roomId: "RM-101", roomNumber: "101", wardId: "WD-01", wardName: "General Ward A", status: "Maintenance" },
  { id: "B-202-A", number: "202-A", roomId: "RM-202", roomNumber: "202", wardId: "WD-03", wardName: "Cardiac Ward", status: "Available" },
  { id: "B-202-B", number: "202-B", roomId: "RM-202", roomNumber: "202", wardId: "WD-03", wardName: "Cardiac Ward", status: "Occupied", patientName: "Pooja Salunkhe", uhid: "MRD-2026-004832", doctor: "Dr. Ananya Gupta", admissionDate: "2026-07-22", expectedDischarge: "2026-07-24", lengthOfStay: 0 },
];

/* ------------------------------------------------------------------ */
/* Inpatients                                                          */
/* ------------------------------------------------------------------ */

export const INPATIENTS: Inpatient[] = [
  { uhid: "MRD-2026-004821", admissionId: "ADM-2026-0722-001", patientName: "Rajesh Kumar", age: 47, gender: "Male", blood: "B+", doctor: "Dr. Arjun Mehta", department: "Cardiology", ward: "General Ward A", room: "101", bed: "101-A", admissionDate: "2026-07-20", expectedDischarge: "2026-07-25", lengthOfStay: 2, diagnosis: "Post-angioplasty observation", insurance: "Star Health — Family Optima", status: "Admitted", clinicalStatus: "Improving" },
  { uhid: "MRD-2026-004830", admissionId: "ADM-2026-0722-002", patientName: "Ganesh More", age: 62, gender: "Male", blood: "O+", doctor: "Dr. Kavya Nair", department: "General Medicine", ward: "General Ward A", room: "101", bed: "101-B", admissionDate: "2026-07-21", expectedDischarge: "2026-07-24", lengthOfStay: 1, diagnosis: "Uncontrolled diabetes — DKA", insurance: "New India Assurance", status: "Admitted", clinicalStatus: "Stable" },
  { uhid: "MRD-2026-004831", admissionId: "ADM-2026-0722-003", patientName: "Deepak Joshi", age: 41, gender: "Male", blood: "A-", doctor: "Dr. Arjun Mehta", department: "Cardiology", ward: "General Ward A", room: "102", bed: "102-A", admissionDate: "2026-07-19", expectedDischarge: "2026-07-26", lengthOfStay: 3, diagnosis: "Post-angiography monitoring", insurance: "ICICI Lombard", status: "Admitted", clinicalStatus: "Stable" },
  { uhid: "MRD-2026-004824", admissionId: "ADM-2026-0722-004", patientName: "Lakshmi Iyer", age: 70, gender: "Female", blood: "AB+", doctor: "Dr. Arjun Mehta", department: "Cardiology", ward: "Cardiac Ward", room: "201", bed: "201-A", admissionDate: "2026-07-18", expectedDischarge: "2026-07-28", lengthOfStay: 4, diagnosis: "Acute coronary syndrome", insurance: "Senior Citizen Mediclaim", status: "Admitted", clinicalStatus: "Guarded", isolation: "Contact" },
  { uhid: "MRD-2026-004833", admissionId: "ADM-2026-0722-005", patientName: "Anil Kulkarni", age: 58, gender: "Male", blood: "B+", doctor: "Dr. Imran Sheikh", department: "Emergency Medicine", ward: "ICU", room: "401", bed: "401-A", admissionDate: "2026-07-22", expectedDischarge: "2026-07-29", lengthOfStay: 0, diagnosis: "Sepsis — on vasopressors", insurance: "Star Health — Family Optima", status: "Admitted", clinicalStatus: "Critical", isolation: "Airborne" },
  { uhid: "MRD-2026-004825", admissionId: "ADM-2026-0722-006", patientName: "Mohammed Ansari", age: 38, gender: "Male", blood: "O-", doctor: "Dr. Sneha Iyer", department: "Orthopaedics", ward: "General Ward A", room: "ISO-01", bed: "ISO-01-A", admissionDate: "2026-07-21", expectedDischarge: "2026-07-25", lengthOfStay: 1, diagnosis: "Post-op ORIF tibia — MRSA screen", insurance: "ICICI Lombard", status: "Admitted", clinicalStatus: "Stable", isolation: "Droplet" },
  { uhid: "MRD-2026-004823", admissionId: "ADM-2026-0722-007", patientName: "Aarav Sharma", age: 7, gender: "Male", blood: "A+", doctor: "Dr. Sneha Iyer", department: "Paediatrics", ward: "Paediatric Ward", room: "301", bed: "301-A", admissionDate: "2026-07-22", expectedDischarge: "2026-07-25", lengthOfStay: 0, diagnosis: "Acute asthma exacerbation", insurance: "None", status: "Admitted", clinicalStatus: "Improving" },
  { uhid: "MRD-2026-004832", admissionId: "ADM-2026-0722-008", patientName: "Pooja Salunkhe", age: 28, gender: "Female", blood: "O+", doctor: "Dr. Ananya Gupta", department: "Gynaecology", ward: "Cardiac Ward", room: "202", bed: "202-B", admissionDate: "2026-07-22", expectedDischarge: "2026-07-24", lengthOfStay: 0, diagnosis: "Post-C-section recovery", insurance: "HDFC Ergo", status: "Admitted", clinicalStatus: "Stable" },
];

/* ------------------------------------------------------------------ */
/* Admission Requests                                                  */
/* ------------------------------------------------------------------ */

export const ADMISSION_REQUESTS: AdmissionRequest[] = [
  { requestId: "REQ-2026-0722-001", patientName: "Sunita Reddy", uhid: "MRD-2026-004826", age: 54, gender: "Female", doctor: "Dr. Vikram Rao", department: "Neurology", priority: "Urgent", diagnosis: "Transient ischemic attack — observe 24 hrs", requestTime: "09:00 AM", insurance: "Aditya Birla Activ Health", estimatedStay: 2, specialRequirements: "Neurological monitoring q2h" },
  { requestId: "REQ-2026-0722-002", patientName: "Vikram Patil", uhid: "MRD-2026-004840", age: 55, gender: "Male", doctor: "Dr. Rohan Deshmukh", department: "Orthopaedics", priority: "Routine", diagnosis: " elective knee replacement — Left TKR", requestTime: "10:30 AM", insurance: "Star Health — Family Optima", estimatedStay: 5 },
  { requestId: "REQ-2026-0722-003", patientName: "Kavita Joshi", uhid: "MRD-2026-004841", age: 65, gender: "Female", doctor: "Dr. Kavya Nair", department: "General Medicine", priority: "Emergency", diagnosis: "Severe dehydration — acute gastroenteritis", requestTime: "11:15 AM", insurance: "New India Assurance", estimatedStay: 3 },
];

/* ------------------------------------------------------------------ */
/* Transfer Records                                                    */
/* ------------------------------------------------------------------ */

export const TRANSFERS: TransferRecord[] = [
  { transferId: "TRF-2026-0722-001", patientName: "Rajesh Kumar", uhid: "MRD-2026-004821", fromWard: "General Ward A", fromRoom: "101", fromBed: "101-A", toWard: "Cardiac Ward", toRoom: "202", toBed: "202-A", reason: "Upgrade to cardiac monitoring", requestTime: "10:00 AM", status: "Pending", requestedBy: "Dr. Arjun Mehta", transportTeam: "Ward Boy — Sunil" },
  { transferId: "TRF-2026-0721-002", patientName: "Anil Kulkarni", uhid: "MRD-2026-004833", fromWard: "Emergency Observation", fromRoom: "ER-01", fromBed: "ER-01-A", toWard: "ICU", toRoom: "401", toBed: "401-A", reason: "Critical — needs ICU level care", requestTime: "Yesterday", status: "Completed", requestedBy: "Dr. Imran Sheikh", transportTeam: "Critical Care Team" },
];

/* ------------------------------------------------------------------ */
/* Cleaning Requests                                                   */
/* ------------------------------------------------------------------ */

export const CLEANING_REQUESTS: CleaningRequest[] = [
  { requestId: "CLN-2026-0722-001", bedId: "B-402-A", bedNumber: "402-A", roomNumber: "402", wardName: "ICU", patientName: "Previous Patient", dischargeTime: "2026-07-22 09:30", assignedTo: "Ramesh Jadhav", status: "In Progress", requestTime: "2026-07-22 09:35", startTime: "2026-07-22 10:00" },
  { requestId: "CLN-2026-0721-002", bedId: "B-102-B", bedNumber: "102-B", roomNumber: "102", wardName: "General Ward A", patientName: "Suresh Pawar", dischargeTime: "2026-07-21 14:00", assignedTo: "Vishal Mane", status: "Completed", requestTime: "2026-07-21 14:05", startTime: "2026-07-21 14:30", endTime: "2026-07-21 15:15", inspectionBy: "Sunita Kute" },
];

/* ------------------------------------------------------------------ */
/* Audit logs                                                          */
/* ------------------------------------------------------------------ */

export const AUDIT_LOGS: AuditEntry[] = [
  { id: "AUD-001", timestamp: "2026-07-22 08:00:00", user: "Dr. Arjun Mehta", role: "Consultant", action: "Admission Requested", detail: "Admission request for Rajesh Kumar — post-angioplasty observation", patientName: "Rajesh Kumar", ipAddress: "10.0.1.101" },
  { id: "AUD-002", timestamp: "2026-07-22 08:15:00", user: "Admission Desk", role: "Admission Executive", action: "Bed Allocated", detail: "Bed 101-A allocated in General Ward A. Room 101.", patientName: "Rajesh Kumar", bedId: "B-101-A", ipAddress: "10.0.2.201" },
  { id: "AUD-003", timestamp: "2026-07-22 08:30:00", user: "Ward Clerk", role: "Ward Clerk", action: "Patient Admitted", detail: "Rajesh Kumar admitted. Admission ID: ADM-2026-0722-001.", patientName: "Rajesh Kumar", ipAddress: "10.0.2.202" },
  { id: "AUD-004", timestamp: "2026-07-22 09:30:00", user: "Dr. Imran Sheikh", role: "Consultant", action: "ICU Transfer Requested", detail: "Anil Kulkarni transferred from ER to ICU — sepsis, needs vasopressors.", patientName: "Anil Kulkarni", ipAddress: "10.0.1.105" },
  { id: "AUD-005", timestamp: "2026-07-22 09:35:00", user: "Bed Manager", role: "Bed Manager", action: "ICU Bed Allocated", detail: "Bed 401-A allocated in ICU. Patient in critical condition.", patientName: "Anil Kulkarni", bedId: "B-401-A", ipAddress: "10.0.2.203" },
  { id: "AUD-006", timestamp: "2026-07-22 10:00:00", user: "Dr. Arjun Mehta", role: "Consultant", action: "Transfer Requested", detail: "Rajesh Kumar — General Ward A to Cardiac Ward for cardiac monitoring upgrade.", patientName: "Rajesh Kumar", ipAddress: "10.0.1.101" },
  { id: "AUD-007", timestamp: "2026-07-22 10:00:00", user: "Housekeeping Supervisor", role: "Housekeeping Supervisor", action: "Cleaning Initiated", detail: "Bed 402-A ICU — post-discharge cleaning started. Assigned: Ramesh Jadhav.", bedId: "B-402-A", ipAddress: "10.0.6.601" },
  { id: "AUD-008", timestamp: "2026-07-22 10:30:00", user: "Dr. Imran Sheikh", role: "Consultant", action: "Isolation Ordered", detail: "Anil Kulkarni — airborne isolation for suspected pulmonary tuberculosis.", patientName: "Anil Kulkarni", ipAddress: "10.0.1.105" },
  { id: "AUD-009", timestamp: "2026-07-22 11:00:00", user: "Nursing Supervisor", role: "Nursing Supervisor", action: "Bedside Status Updated", detail: "All inpatient vitals recorded. ICU patient stable on vasopressors.", ipAddress: "10.0.6.602" },
  { id: "AUD-010", timestamp: "2026-07-22 11:30:00", user: "Bed Manager", role: "Bed Manager", action: "Occupancy Alert", detail: "ICU occupancy at 83%. 2 beds available. Monitor closely.", ipAddress: "10.0.2.203" },
];

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

export function bedStatusTone(s: BedStatus): "success" | "warning" | "danger" | "info" | "brand" | "neutral" {
  switch (s) {
    case "Available": return "success";
    case "Occupied": return "danger";
    case "Reserved": return "info";
    case "Cleaning": return "warning";
    case "Maintenance": return "warning";
    case "Blocked": return "danger";
    default: return "neutral";
  }
}

export function admissionStatusTone(s: AdmissionStatus): "brand" | "success" | "warning" | "danger" | "info" | "neutral" {
  switch (s) {
    case "Requested": return "info";
    case "Approved": return "brand";
    case "Admitted": return "success";
    case "Transferred": return "warning";
    case "Discharged": return "neutral";
    case "Cancelled": return "danger";
    default: return "neutral";
  }
}

export function transferStatusTone(s: TransferStatus): "brand" | "success" | "warning" | "info" {
  switch (s) {
    case "Pending": return "warning";
    case "In Transit": return "info";
    case "Completed": return "success";
    case "Cancelled": return "info";
    default: return "info";
  }
}

export function cleaningStatusTone(s: CleaningStatus): "brand" | "success" | "warning" | "info" {
  switch (s) {
    case "Pending": return "info";
    case "In Progress": return "warning";
    case "Completed": return "brand";
    case "Inspected": return "success";
    case "Ready": return "success";
    default: return "info";
  }
}

export function clinicalStatusTone(s: Inpatient["clinicalStatus"]): "success" | "warning" | "danger" | "brand" {
  switch (s) {
    case "Stable": return "success";
    case "Improving": return "brand";
    case "Guarded": return "warning";
    case "Critical": return "danger";
    default: return "success";
  }
}

export function occupancyColor(pct: number): string {
  if (pct >= 90) return "text-danger";
  if (pct >= 75) return "text-[#b45309]";
  return "text-success";
}

export function isolationBadge(type: IsolationType): string {
  switch (type) {
    case "Contact": return "bg-info/10 text-[#0369a1]";
    case "Droplet": return "bg-warning/10 text-[#b45309]";
    case "Airborne": return "bg-danger/10 text-danger";
    case "Negative Pressure": return "bg-danger/10 text-danger";
    default: return "";
  }
}
