/* ------------------------------------------------------------------ */
/* Hospital Administration & Command Center — Mock Data                  */
/* Meridian Multi-Speciality Hospital, Pune                             */
/* ------------------------------------------------------------------ */

export type AlertSeverity = "Critical" | "High" | "Medium" | "Low";
export type AlertStatus = "Active" | "Acknowledged" | "Resolved" | "Escalated";
export type IncidentSeverity = "Sentinel" | "Major" | "Minor" | "Near Miss";
export type IncidentStatus = "Open" | "Investigating" | "Resolved" | "Closed";
export type ComplianceStatus = "Compliant" | "Partial" | "Non-Compliant" | "Under Review";
export type DepartmentType = "Clinical" | "Support" | "Administrative";

export interface HospitalCensus {
  date: string;
  opdVisits: number;
  ipdAdmissions: number;
  ipdDischarges: number;
  emergencyCases: number;
  surgeries: number;
  births: number;
  deaths: number;
  totalBeds: number;
  occupiedBeds: number;
  icuBeds: number;
  icuOccupied: number;
  otRooms: number;
  otInUse: number;
  averageLOS: number;
  bedOccupancy: number;
}

export interface DepartmentKPI {
  id: string;
  name: string;
  type: DepartmentType;
  opdVisits: number;
  ipdPatients: number;
  staffOnDuty: number;
  bedOccupancy: number;
  revenue: number;
  satisfaction: number;
  pendingTasks: number;
  alerts: number;
  status: "Normal" | "Busy" | "Critical" | "Overloaded";
}

export interface BedStatus {
  ward: string;
  totalBeds: number;
  occupied: number;
  available: number;
  reserved: number;
  cleaning: number;
  maintenance: number;
}

export interface OTStatus {
  roomNumber: string;
  status: "In Use" | "Available" | "Cleaning" | "Maintenance";
  currentSurgery?: string;
  surgeon?: string;
  startTime?: string;
  estimatedEnd?: string;
  nextSurgery?: string;
  nextSurgeon?: string;
  nextTime?: string;
}

export interface StaffRecord {
  id: string;
  name: string;
  role: string;
  department: string;
  status: "On Duty" | "Off Duty" | "On Leave" | "On Call";
  shift: string;
  specialization?: string;
  experience: number;
  rating: number;
  workload: number;
}

export interface FinancialKPI {
  metric: string;
  value: number;
  target: number;
  unit: string;
  trend: number;
  category: "Revenue" | "Expense" | "Collection" | "Profitability";
}

export interface QualityMetric {
  id: string;
  name: string;
  category: string;
  score: number;
  target: number;
  status: ComplianceStatus;
  lastAudit: string;
  nextAudit: string;
}

export interface InfectionData {
  id: string;
  type: string;
  department: string;
  patients: number;
  rate: number;
  target: number;
  trend: number;
  handHygieneCompliance: number;
  isolationPatients: number;
}

export interface IncidentRecord {
  id: string;
  incidentNumber: string;
  type: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  reportedDate: string;
  reportedBy: string;
  department: string;
  description: string;
  rootCause?: string;
  correctiveAction?: string;
  resolvedDate?: string;
}

export interface ReportDefinition {
  id: string;
  name: string;
  category: string;
  frequency: string;
  lastGenerated: string;
  nextScheduled: string;
  format: string[];
}

export interface AlertRecord {
  id: string;
  type: string;
  severity: AlertSeverity;
  status: AlertStatus;
  title: string;
  message: string;
  timestamp: string;
  department?: string;
  acknowledgedBy?: string;
  resolvedDate?: string;
}

/* ------------------------------------------------------------------ */
/* Hospital Census                                                       */
/* ------------------------------------------------------------------ */

export const HOSPITAL_CENSUS: HospitalCensus = {
  date: "2026-07-23",
  opdVisits: 847,
  ipdAdmissions: 62,
  ipdDischarges: 48,
  emergencyCases: 128,
  surgeries: 34,
  births: 8,
  deaths: 2,
  totalBeds: 450,
  occupiedBeds: 410,
  icuBeds: 45,
  icuOccupied: 38,
  otRooms: 12,
  otInUse: 9,
  averageLOS: 3.8,
  bedOccupancy: 91.1,
};

/* ------------------------------------------------------------------ */
/* Department KPIs                                                       */
/* ------------------------------------------------------------------ */

export const DEPARTMENT_KPIS: DepartmentKPI[] = [
  { id: "DEPT-001", name: "General Medicine", type: "Clinical", opdVisits: 185, ipdPatients: 62, staffOnDuty: 18, bedOccupancy: 88, revenue: 1250000, satisfaction: 4.7, pendingTasks: 12, alerts: 1, status: "Normal" },
  { id: "DEPT-002", name: "Cardiology", type: "Clinical", opdVisits: 92, ipdPatients: 38, staffOnDuty: 14, bedOccupancy: 92, revenue: 2100000, satisfaction: 4.8, pendingTasks: 8, alerts: 0, status: "Busy" },
  { id: "DEPT-003", name: "Orthopaedics", type: "Clinical", opdVisits: 78, ipdPatients: 45, staffOnDuty: 12, bedOccupancy: 85, revenue: 1800000, satisfaction: 4.6, pendingTasks: 6, alerts: 0, status: "Normal" },
  { id: "DEPT-004", name: "Neurology", type: "Clinical", opdVisits: 56, ipdPatients: 28, staffOnDuty: 10, bedOccupancy: 78, revenue: 1650000, satisfaction: 4.5, pendingTasks: 5, alerts: 1, status: "Normal" },
  { id: "DEPT-005", name: "Oncology", type: "Clinical", opdVisits: 42, ipdPatients: 35, staffOnDuty: 15, bedOccupancy: 94, revenue: 3200000, satisfaction: 4.7, pendingTasks: 10, alerts: 2, status: "Critical" },
  { id: "DEPT-006", name: "Paediatrics", type: "Clinical", opdVisits: 120, ipdPatients: 32, staffOnDuty: 11, bedOccupancy: 72, revenue: 980000, satisfaction: 4.9, pendingTasks: 4, alerts: 0, status: "Normal" },
  { id: "DEPT-007", name: "Obstetrics & Gynaecology", type: "Clinical", opdVisits: 95, ipdPatients: 40, staffOnDuty: 13, bedOccupancy: 82, revenue: 1450000, satisfaction: 4.8, pendingTasks: 7, alerts: 0, status: "Normal" },
  { id: "DEPT-008", name: "Emergency", type: "Clinical", opdVisits: 128, ipdPatients: 15, staffOnDuty: 22, bedOccupancy: 95, revenue: 890000, satisfaction: 4.3, pendingTasks: 18, alerts: 3, status: "Overloaded" },
  { id: "DEPT-009", name: "Radiology", type: "Support", opdVisits: 210, ipdPatients: 0, staffOnDuty: 8, bedOccupancy: 0, revenue: 780000, satisfaction: 4.6, pendingTasks: 15, alerts: 1, status: "Busy" },
  { id: "DEPT-010", name: "Laboratory", type: "Support", opdVisits: 340, ipdPatients: 0, staffOnDuty: 12, bedOccupancy: 0, revenue: 620000, satisfaction: 4.5, pendingTasks: 22, alerts: 0, status: "Busy" },
  { id: "DEPT-011", name: "Pharmacy", type: "Support", opdVisits: 0, ipdPatients: 0, staffOnDuty: 10, bedOccupancy: 0, revenue: 1100000, satisfaction: 4.4, pendingTasks: 8, alerts: 2, status: "Normal" },
  { id: "DEPT-012", name: "Administration", type: "Administrative", opdVisits: 0, ipdPatients: 0, staffOnDuty: 15, bedOccupancy: 0, revenue: 0, satisfaction: 4.2, pendingTasks: 25, alerts: 0, status: "Normal" },
];

/* ------------------------------------------------------------------ */
/* Bed Status                                                            */
/* ------------------------------------------------------------------ */

export const BED_STATUS: BedStatus[] = [
  { ward: "General Ward A", totalBeds: 60, occupied: 54, available: 4, reserved: 1, cleaning: 1, maintenance: 0 },
  { ward: "General Ward B", totalBeds: 60, occupied: 52, available: 5, reserved: 2, cleaning: 1, maintenance: 0 },
  { ward: "Semi-Private", totalBeds: 40, occupied: 36, available: 2, reserved: 1, cleaning: 1, maintenance: 0 },
  { ward: "Private Rooms", totalBeds: 30, occupied: 28, available: 1, reserved: 1, cleaning: 0, maintenance: 0 },
  { ward: "Deluxe Suite", totalBeds: 20, occupied: 18, available: 1, reserved: 0, cleaning: 1, maintenance: 0 },
  { ward: "ICU - Medical", totalBeds: 20, occupied: 18, available: 1, reserved: 1, cleaning: 0, maintenance: 0 },
  { ward: "ICU - Surgical", totalBeds: 15, occupied: 12, available: 2, reserved: 0, cleaning: 1, maintenance: 0 },
  { ward: "ICU - Cardiac", totalBeds: 10, occupied: 8, available: 1, reserved: 1, cleaning: 0, maintenance: 0 },
  { ward: "Emergency beds", totalBeds: 25, occupied: 22, available: 2, reserved: 0, cleaning: 1, maintenance: 0 },
  { ward: "Isolation", totalBeds: 10, occupied: 6, available: 3, reserved: 0, cleaning: 1, maintenance: 0 },
  { ward: "Paediatric", totalBeds: 30, occupied: 22, available: 6, reserved: 1, cleaning: 1, maintenance: 0 },
  { ward: "Maternity", totalBeds: 25, occupied: 20, available: 3, reserved: 1, cleaning: 1, maintenance: 0 },
  { ward: "Day Care", totalBeds: 15, occupied: 10, available: 4, reserved: 0, cleaning: 1, maintenance: 0 },
  { ward: "OT Recovery", totalBeds: 12, occupied: 8, available: 2, reserved: 1, cleaning: 1, maintenance: 0 },
  { ward: "Burns Unit", totalBeds: 8, occupied: 5, available: 2, reserved: 1, cleaning: 0, maintenance: 0 },
  { ward: "Nephrology (Dialysis)", totalBeds: 10, occupied: 8, available: 1, reserved: 0, cleaning: 1, maintenance: 0 },
];

/* ------------------------------------------------------------------ */
/* OT Status                                                             */
/* ------------------------------------------------------------------ */

export const OT_STATUS: OTStatus[] = [
  { roomNumber: "OT-01", status: "In Use", currentSurgery: "CABG", surgeon: "Dr. Arjun Mehta", startTime: "08:00", estimatedEnd: "14:00", nextSurgery: "Mitral Valve Repair", nextSurgeon: "Dr. Arjun Mehta", nextTime: "15:00" },
  { roomNumber: "OT-02", status: "In Use", currentSurgery: "Total Knee Replacement", surgeon: "Dr. Rajesh Kulkarni", startTime: "09:00", estimatedEnd: "13:00", nextSurgery: "Hip Hemiarthroplasty", nextSurgeon: "Dr. Rajesh Kulkarni", nextTime: "14:30" },
  { roomNumber: "OT-03", status: "In Use", currentSurgery: "Laparoscopic Cholecystectomy", surgeon: "Dr. Sanjay Gupta", startTime: "10:00", estimatedEnd: "12:30" },
  { roomNumber: "OT-04", status: "In Use", currentSurgery: "Craniotomy for SDH", surgeon: "Dr. Amit Bhatt", startTime: "07:30", estimatedEnd: "15:00" },
  { roomNumber: "OT-05", status: "Cleaning", nextSurgery: "C-Section", nextSurgeon: "Dr. Priya Nair", nextTime: "13:00" },
  { roomNumber: "OT-06", status: "Available" },
  { roomNumber: "OT-07", status: "In Use", currentSurgery: "Appendectomy", surgeon: "Dr. Sanjay Gupta", startTime: "11:00", estimatedEnd: "13:00" },
  { roomNumber: "OT-08", status: "In Use", currentSurgery: "Spinal Fusion L4-L5", surgeon: "Dr. Rajesh Kulkarni", startTime: "08:30", estimatedEnd: "14:30" },
  { roomNumber: "OT-09", status: "In Use", currentSurgery: "Coronary Angioplasty", surgeon: "Dr. Arjun Mehta", startTime: "10:30", estimatedEnd: "12:30" },
  { roomNumber: "OT-10", status: "In Use", currentSurgery: "Hysterectomy", surgeon: "Dr. Priya Nair", startTime: "09:30", estimatedEnd: "13:30" },
  { roomNumber: "OT-11", status: "Maintenance" },
  { roomNumber: "OT-12", status: "Available" },
];

/* ------------------------------------------------------------------ */
/* Staff Records                                                         */
/* ------------------------------------------------------------------ */

export const STAFF_RECORDS: StaffRecord[] = [
  { id: "STF-001", name: "Dr. Meera Joshi", role: "Consultant", department: "General Medicine", status: "On Duty", shift: "Morning (8AM-2PM)", specialization: "Internal Medicine", experience: 18, rating: 4.8, workload: 85 },
  { id: "STF-002", name: "Dr. Arjun Mehta", role: "Consultant", department: "Cardiology", status: "On Duty", shift: "Morning (8AM-2PM)", specialization: "Interventional Cardiology", experience: 22, rating: 4.9, workload: 92 },
  { id: "STF-003", name: "Dr. Rajesh Kulkarni", role: "Consultant", department: "Orthopaedics", status: "On Duty", shift: "Morning (8AM-2PM)", specialization: "Joint Replacement", experience: 20, rating: 4.6, workload: 88 },
  { id: "STF-004", name: "Dr. Priya Nair", role: "Consultant", department: "Obstetrics & Gynaecology", status: "On Duty", shift: "Morning (8AM-2PM)", specialization: "High-Risk Pregnancy", experience: 15, rating: 4.8, workload: 78 },
  { id: "STF-005", name: "Dr. Sanjay Gupta", role: "Consultant", department: "General Surgery", status: "On Duty", shift: "Morning (8AM-2PM)", specialization: "Laparoscopic Surgery", experience: 16, rating: 4.5, workload: 90 },
  { id: "STF-006", name: "Dr. Amit Bhatt", role: "Consultant", department: "Neurosurgery", status: "On Duty", shift: "Morning (8AM-2PM)", specialization: "Cranial Surgery", experience: 19, rating: 4.7, workload: 95 },
  { id: "STF-007", name: "Dr. Sneha Kapoor", role: "Consultant", department: "Dermatology", status: "Off Duty", shift: "Afternoon (2PM-8PM)", specialization: "Dermatology", experience: 12, rating: 4.7, workload: 0 },
  { id: "STF-008", name: "Dr. Imran Sheikh", role: "Consultant", department: "Pulmonology", status: "On Duty", shift: "Morning (8AM-2PM)", specialization: "Pulmonology", experience: 14, rating: 4.5, workload: 72 },
  { id: "STF-009", name: "Dr. Kavita Deshmukh", role: "Consultant", department: "Paediatrics", status: "On Duty", shift: "Morning (8AM-2PM)", specialization: "Paediatrics", experience: 16, rating: 4.9, workload: 68 },
  { id: "STF-010", name: "Dr. Vikram Rao", role: "Consultant", department: "Radiology", status: "On Duty", shift: "Morning (8AM-2PM)", specialization: "Interventional Radiology", experience: 21, rating: 4.6, workload: 82 },
  { id: "STF-011", name: "Nurse Asha Kamble", role: "Staff Nurse", department: "ICU", status: "On Duty", shift: "Morning (7AM-1PM)", experience: 10, rating: 4.7, workload: 90 },
  { id: "STF-012", name: "Nurse Priya More", role: "Staff Nurse", department: "Emergency", status: "On Duty", shift: "Morning (7AM-1PM)", experience: 8, rating: 4.5, workload: 88 },
  { id: "STF-013", name: "Ravi Kumar", role: "Lab Technician", department: "Laboratory", status: "On Duty", shift: "Morning (8AM-2PM)", experience: 6, rating: 4.4, workload: 85 },
  { id: "STF-014", name: "Suresh Patil", role: "OT Technician", department: "Operation Theater", status: "On Duty", shift: "Morning (8AM-2PM)", experience: 12, rating: 4.6, workload: 92 },
  { id: "STF-015", name: "Neha Deshpande", role: "Store Manager", department: "Inventory", status: "On Duty", shift: "Morning (9AM-5PM)", experience: 8, rating: 4.5, workload: 75 },
];

/* ------------------------------------------------------------------ */
/* Financial KPIs                                                        */
/* ------------------------------------------------------------------ */

export const FINANCIAL_KPIS: FinancialKPI[] = [
  { metric: "Today's Revenue", value: 18500000, target: 20000000, unit: "INR", trend: 8.2, category: "Revenue" },
  { metric: "Monthly Revenue", value: 485000000, target: 550000000, unit: "INR", trend: 12.5, category: "Revenue" },
  { metric: "OPD Revenue", value: 8500000, target: 9000000, unit: "INR", trend: 5.8, category: "Revenue" },
  { metric: "IPD Revenue", value: 62000000, target: 70000000, unit: "INR", trend: 10.2, category: "Revenue" },
  { metric: "Surgery Revenue", value: 38000000, target: 42000000, unit: "INR", trend: 15.3, category: "Revenue" },
  { metric: "Collection Rate", value: 94.2, target: 95, unit: "%", trend: 1.8, category: "Collection" },
  { metric: "Insurance Claims Pending", value: 12500000, target: 0, unit: "INR", trend: -5.2, category: "Collection" },
  { metric: "Outstanding Dues", value: 32000000, target: 25000000, unit: "INR", trend: -8.5, category: "Collection" },
  { metric: "Operating Expenses", value: 42000000, target: 40000000, unit: "INR", trend: 4.8, category: "Expense" },
  { metric: "EBITDA", value: 18500000, target: 20000000, unit: "INR", trend: 14.2, category: "Profitability" },
  { metric: "EBITDA Margin", value: 26.8, target: 28, unit: "%", trend: 2.1, category: "Profitability" },
  { metric: "Revenue Per Bed", value: 41111, target: 44444, unit: "INR", trend: 8.5, category: "Revenue" },
];

/* ------------------------------------------------------------------ */
/* Quality Metrics                                                       */
/* ------------------------------------------------------------------ */

export const QUALITY_METRICS: QualityMetric[] = [
  { id: "QM-001", name: "Patient Identification", category: "NABH", score: 98, target: 100, status: "Compliant", lastAudit: "2026-07-01", nextAudit: "2026-10-01" },
  { id: "QM-002", name: "Medication Safety", category: "NABH", score: 95, target: 100, status: "Compliant", lastAudit: "2026-07-01", nextAudit: "2026-10-01" },
  { id: "QM-003", name: "Surgical Safety Checklist", category: "NABH", score: 100, target: 100, status: "Compliant", lastAudit: "2026-07-15", nextAudit: "2026-10-15" },
  { id: "QM-004", name: "Hand Hygiene Compliance", category: "NABH", score: 88, target: 95, status: "Partial", lastAudit: "2026-07-20", nextAudit: "2026-08-20" },
  { id: "QM-005", name: "Fall Prevention", category: "NABH", score: 92, target: 100, status: "Compliant", lastAudit: "2026-07-01", nextAudit: "2026-10-01" },
  { id: "QM-006", name: "Pressure Ulcer Prevention", category: "NABH", score: 96, target: 100, status: "Compliant", lastAudit: "2026-07-01", nextAudit: "2026-10-01" },
  { id: "QM-007", name: "ICU Infection Rate", category: "JCI", score: 91, target: 95, status: "Partial", lastAudit: "2026-06-15", nextAudit: "2026-09-15" },
  { id: "QM-008", name: "Medication Reconciliation", category: "JCI", score: 94, target: 100, status: "Partial", lastAudit: "2026-07-01", nextAudit: "2026-10-01" },
  { id: "QM-009", name: "Discharge Planning", category: "JCI", score: 89, target: 95, status: "Partial", lastAudit: "2026-07-01", nextAudit: "2026-10-01" },
  { id: "QM-010", name: "Clinical Documentation", category: "JCI", score: 87, target: 95, status: "Partial", lastAudit: "2026-07-15", nextAudit: "2026-10-15" },
  { id: "QM-011", name: "Blood Transfusion Safety", category: "NABH", score: 100, target: 100, status: "Compliant", lastAudit: "2026-07-01", nextAudit: "2026-10-01" },
  { id: "QM-012", name: "Informed Consent", category: "NABH", score: 97, target: 100, status: "Compliant", lastAudit: "2026-07-01", nextAudit: "2026-10-01" },
];

/* ------------------------------------------------------------------ */
/* Infection Control Data                                                */
/* ------------------------------------------------------------------ */

export const INFECTION_DATA: InfectionData[] = [
  { id: "INF-001", type: "Central Line-Associated BSI (CLABSI)", department: "ICU", patients: 3, rate: 1.2, target: 1.0, trend: -0.3, handHygieneCompliance: 88, isolationPatients: 2 },
  { id: "INF-002", type: "Catheter-Associated UTI (CAUTI)", department: "ICU", patients: 5, rate: 2.1, target: 2.0, trend: 0.2, handHygieneCompliance: 88, isolationPatients: 1 },
  { id: "INF-003", type: "Surgical Site Infection (SSI)", department: "OT", patients: 4, rate: 1.8, target: 1.5, trend: -0.1, handHygieneCompliance: 92, isolationPatients: 0 },
  { id: "INF-004", type: "Ventilator-Associated Pneumonia (VAP)", department: "ICU", patients: 2, rate: 0.8, target: 1.0, trend: -0.2, handHygieneCompliance: 88, isolationPatients: 1 },
  { id: "INF-005", type: "MRSA Infection", department: "General", patients: 1, rate: 0.3, target: 0.5, trend: -0.1, handHygieneCompliance: 88, isolationPatients: 1 },
];

/* ------------------------------------------------------------------ */
/* Incidents                                                              */
/* ------------------------------------------------------------------ */

export const INCIDENTS: IncidentRecord[] = [
  { id: "INC-001", incidentNumber: "ISR-2026-00124", type: "Patient Safety", severity: "Major", status: "Investigating", reportedDate: "2026-07-22", reportedBy: "Nurse Asha Kamble", department: "ICU", description: "Patient fell from bed during night shift. Minor bruising observed. Bed rails were in lowered position." },
  { id: "INC-002", incidentNumber: "ISR-2026-00123", type: "Medication Error", severity: "Major", status: "Investigating", reportedDate: "2026-07-21", reportedBy: "Pharmacist Deepak", department: "Pharmacy", description: "Wrong dosage dispensed for Metformin 500mg — patient received 1000mg. Error caught before administration." },
  { id: "INC-003", incidentNumber: "ISR-2026-00122", type: "Equipment Failure", severity: "Minor", status: "Resolved", reportedDate: "2026-07-20", reportedBy: "Biomedical Team", department: "Radiology", description: "CT scanner calibration drift detected during morning QC. Scanner offline for 4 hours." },
  { id: "INC-004", incidentNumber: "ISR-2026-00121", type: "Patient Safety", severity: "Sentinel", status: "Open", reportedDate: "2026-07-23", reportedBy: "Dr. Meera Joshi", department: "Emergency", description: "Wrong blood unit transfused to patient. Blood bank verification process failure identified." },
  { id: "INC-005", incidentNumber: "ISR-2026-00120", type: "Staff Incident", severity: "Minor", status: "Closed", reportedDate: "2026-07-19", reportedBy: "HR Manager", department: "Administration", description: "Needle stick injury to nurse during phlebotomy. PEP protocol initiated." },
];

/* ------------------------------------------------------------------ */
/* Alerts                                                                */
/* ------------------------------------------------------------------ */

export const ALERTS: AlertRecord[] = [
  { id: "ALT-001", type: "Bed Shortage", severity: "Critical", status: "Active", title: "ICU Bed Shortage", message: "ICU occupancy at 84.4%. Only 7 beds available across all ICU units.", timestamp: "2026-07-23 14:30", department: "ICU" },
  { id: "ALT-002", type: "Emergency Overload", severity: "Critical", status: "Active", title: "Emergency Department Overload", message: "22/25 emergency beds occupied. 3 patients in waiting area. Average wait: 45 min.", timestamp: "2026-07-23 14:25", department: "Emergency" },
  { id: "ALT-003", type: "Low Stock", severity: "High", status: "Active", title: "Critical Blood Bank Alert", message: "O-negative blood units: 2 remaining. Minimum threshold: 5 units.", timestamp: "2026-07-23 14:15", department: "Laboratory" },
  { id: "ALT-004", type: "Equipment", severity: "High", status: "Acknowledged", title: "CT Scanner Downtime", message: "CT scanner #2 offline for calibration. Expected back online: 16:00.", timestamp: "2026-07-23 12:00", department: "Radiology" },
  { id: "ALT-005", type: "Compliance", severity: "Medium", status: "Active", title: "NABH Audit Due", message: "NABH annual surveillance audit scheduled for August 15. 12 gaps identified.", timestamp: "2026-07-23 09:00", department: "Quality" },
  { id: "ALT-006", type: "Revenue", severity: "Medium", status: "Active", title: "Insurance Claims Delay", message: "Rs 1.25 Cr in insurance claims pending > 30 days. 45 claims require follow-up.", timestamp: "2026-07-23 10:00", department: "Finance" },
  { id: "ALT-007", type: "Low Stock", severity: "High", status: "Active", title: "N95 Masks Out of Stock", message: "Zero stock of N95 respirator masks. Emergency procurement initiated.", timestamp: "2026-07-23 08:00", department: "Inventory" },
  { id: "ALT-008", type: "Quality", severity: "Medium", status: "Acknowledged", title: "Hand Hygiene Below Target", message: "Hand hygiene compliance at 88% vs 95% target. Ward A and ICU below threshold.", timestamp: "2026-07-23 08:30", department: "Infection Control" },
];

/* ------------------------------------------------------------------ */
/* Reports                                                                */
/* ------------------------------------------------------------------ */

export const REPORTS: ReportDefinition[] = [
  { id: "RPT-001", name: "Daily Operations Summary", category: "Operational", frequency: "Daily", lastGenerated: "2026-07-23 08:00", nextScheduled: "2026-07-24 08:00", format: ["PDF", "Excel"] },
  { id: "RPT-002", name: "Revenue Collection Report", category: "Financial", frequency: "Daily", lastGenerated: "2026-07-23 09:00", nextScheduled: "2026-07-24 09:00", format: ["PDF", "Excel"] },
  { id: "RPT-003", name: "Bed Occupancy Report", category: "Operational", frequency: "Daily", lastGenerated: "2026-07-23 07:00", nextScheduled: "2026-07-24 07:00", format: ["PDF"] },
  { id: "RPT-004", name: "OT Utilization Report", category: "Operational", frequency: "Weekly", lastGenerated: "2026-07-21 08:00", nextScheduled: "2026-07-28 08:00", format: ["PDF", "Excel"] },
  { id: "RPT-005", name: "Staff Attendance & Workload", category: "HR", frequency: "Daily", lastGenerated: "2026-07-23 08:00", nextScheduled: "2026-07-24 08:00", format: ["Excel"] },
  { id: "RPT-006", name: "Infection Control Dashboard", category: "Quality", frequency: "Weekly", lastGenerated: "2026-07-21 08:00", nextScheduled: "2026-07-28 08:00", format: ["PDF"] },
  { id: "RPT-007", name: "Financial P&L Statement", category: "Financial", frequency: "Monthly", lastGenerated: "2026-07-01 08:00", nextScheduled: "2026-08-01 08:00", format: ["PDF", "Excel"] },
  { id: "RPT-008", name: "NABH Compliance Scorecard", category: "Quality", frequency: "Quarterly", lastGenerated: "2026-07-01 08:00", nextScheduled: "2026-10-01 08:00", format: ["PDF"] },
  { id: "RPT-009", name: "Patient Satisfaction Analysis", category: "Patient Experience", frequency: "Monthly", lastGenerated: "2026-07-01 08:00", nextScheduled: "2026-08-01 08:00", format: ["PDF", "Excel"] },
  { id: "RPT-010", name: "Equipment Maintenance Schedule", category: "Assets", frequency: "Monthly", lastGenerated: "2026-07-01 08:00", nextScheduled: "2026-08-01 08:00", format: ["Excel"] },
];

/* ------------------------------------------------------------------ */
/* Helpers                                                               */
/* ------------------------------------------------------------------ */

export function formatINR(amount: number): string {
  if (amount >= 10000000) return "Rs " + (amount / 10000000).toFixed(2) + " Cr";
  if (amount >= 100000) return "Rs " + (amount / 100000).toFixed(2) + " L";
  return "Rs " + amount.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

export function formatCompact(n: number): string {
  if (n >= 10000000) return (n / 10000000).toFixed(1) + " Cr";
  if (n >= 100000) return (n / 100000).toFixed(1) + " L";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return n.toString();
}

export function alertSeverityTone(s: AlertSeverity): "danger" | "warning" | "info" | "neutral" {
  switch (s) {
    case "Critical": return "danger";
    case "High": return "warning";
    case "Medium": return "info";
    case "Low": return "neutral";
  }
}

export function incidentSeverityTone(s: IncidentSeverity): "danger" | "warning" | "info" | "neutral" {
  switch (s) {
    case "Sentinel": return "danger";
    case "Major": return "warning";
    case "Minor": return "info";
    case "Near Miss": return "neutral";
  }
}

export function complianceTone(s: ComplianceStatus): "success" | "warning" | "danger" | "info" {
  switch (s) {
    case "Compliant": return "success";
    case "Partial": return "warning";
    case "Non-Compliant": return "danger";
    case "Under Review": return "info";
  }
}
