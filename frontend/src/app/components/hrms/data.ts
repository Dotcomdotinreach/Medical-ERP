/* ── HRMS — Hospital Human Resource Management System Data ─────────────────── */

export type EmploymentStatus = "Active" | "On Notice" | "Terminated" | "Suspended" | "On Leave" | "Probation";
export type Gender = "Male" | "Female" | "Other";
export type MaritalStatus = "Single" | "Married" | "Divorced" | "Widowed";
export type EmploymentType = "Full-Time" | "Part-Time" | "Contract" | "Intern" | "Consultant";
export type ShiftType = "Morning" | "Evening" | "Night" | "On-Call" | "Flexible";
export type LeaveType = "Annual" | "Sick" | "Emergency" | "Maternity" | "Paternity" | "Compensatory" | "Unpaid";
export type LeaveStatus = "Pending" | "Approved" | "Rejected" | "Cancelled";
export type PayrollStatus = "Draft" | "Processing" | "Processed" | "Paid";
export type TrainingStatus = "Enrolled" | "In Progress" | "Completed" | "Overdue" | "Cancelled";
export type PerformanceRating = "Exceptional" | "Exceeds" | "Meets" | "Needs Improvement" | "Unsatisfactory";
export type IncidentType = "Workplace Injury" | "Needlestick" | "Violence" | "Exposure" | "Near Miss" | "Property Damage";
export type IncidentSeverity = "Critical" | "Major" | "Minor" | "Near Miss";
export type IncidentStatus = "Reported" | "Investigating" | "Resolved" | "Closed";
export type ExitType = "Resignation" | "Termination" | "Retirement" | "End of Contract" | "Abandoned";
export type CredentialType = "Medical Council" | "Nursing Council" | "Specialty Board" | "DEA" | "BLS" | "ACLS" | "PALS" | "NIHSS" | "Custom";
export type ApplicationStatus = "Applied" | "Screening" | "Interview" | "Offer" | "Hired" | "Rejected" | "Withdrawn";
export type OnboardingStatus = "Pending" | "In Progress" | "Completed" | "Overdue";
export type VaccinationStatus = "Completed" | "Scheduled" | "Overdue" | "Declined";

/* ── Employees ────────────────────────────────────────────────────────────── */
export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  gender: Gender;
  dob: string;
  maritalStatus: MaritalStatus;
  bloodGroup: string;
  employeeId: string;
  department: string;
  designation: string;
  employmentType: EmploymentType;
  status: EmploymentStatus;
  dateOfJoining: string;
  reportingManager: string;
  reportingManagerId: string;
  location: string;
  floor: string;
  qualifications: string[];
  experience: number;
  baseSalary: number;
  profileColor: string;
  avatar: string;
  probationEnd?: string;
  noticePeriod?: number;
  emergencyContact: string;
  emergencyPhone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export const EMPLOYEES: Employee[] = [
  { id: "EMP-001", name: "Dr. Rajesh Mehta", email: "rajesh.mehta@hospital.in", phone: "+91-98765-43210", gender: "Male", dob: "1978-05-12", maritalStatus: "Married", bloodGroup: "B+", employeeId: "HMS-2022-001", department: "Cardiology", designation: "Head of Department", employmentType: "Full-Time", status: "Active", dateOfJoining: "2022-03-15", reportingManager: "Dr. Arun Bhatia", reportingManagerId: "EMP-010", location: "Main Campus", floor: "3rd Floor", qualifications: ["MBBS", "MD Medicine", "DM Cardiology"], experience: 18, baseSalary: 280000, profileColor: "#0052CC", avatar: "RM", emergencyContact: "Sunita Mehta", emergencyPhone: "+91-98765-43211", address: "45 Linking Road, Bandra West", city: "Mumbai", state: "Maharashtra", pincode: "400050" },
  { id: "EMP-002", name: "Dr. Priya Sharma", email: "priya.sharma@hospital.in", phone: "+91-87654-32109", gender: "Female", dob: "1985-09-23", maritalStatus: "Single", bloodGroup: "A+", employeeId: "HMS-2022-002", department: "Emergency", designation: "Consultant", employmentType: "Full-Time", status: "Active", dateOfJoining: "2022-06-01", reportingManager: "Dr. Meera Joshi", reportingManagerId: "EMP-011", location: "Main Campus", floor: "Ground Floor", qualifications: ["MBBS", "MD Emergency Medicine"], experience: 12, baseSalary: 220000, profileColor: "#00875A", avatar: "PS", emergencyContact: "Vikram Sharma", emergencyPhone: "+91-87654-32110", address: "12 MG Road, Andheri East", city: "Mumbai", state: "Maharashtra", pincode: "400069" },
  { id: "EMP-003", name: "Nurse Ananya Desai", email: "ananya.desai@hospital.in", phone: "+91-76543-21098", gender: "Female", dob: "1990-03-17", maritalStatus: "Married", bloodGroup: "O+", employeeId: "HMS-2023-015", department: "ICU", designation: "Senior Nurse", employmentType: "Full-Time", status: "Active", dateOfJoining: "2023-01-10", reportingManager: "Nurse Kavita Iyer", reportingManagerId: "EMP-012", location: "Main Campus", floor: "2nd Floor", qualifications: ["B.Sc Nursing", "Critical Care Nursing"], experience: 8, baseSalary: 85000, profileColor: "#6554C0", avatar: "AD", emergencyContact: "Rohan Desai", emergencyPhone: "+91-76543-21099", address: "78 SV Road, Goregaon West", city: "Mumbai", state: "Maharashtra", pincode: "400062" },
  { id: "EMP-004", name: "Dr. Suresh Kumar", email: "suresh.kumar@hospital.in", phone: "+91-65432-10987", gender: "Male", dob: "1982-11-05", maritalStatus: "Married", bloodGroup: "AB+", employeeId: "HMS-2021-008", department: "Orthopedics", designation: "Consultant Surgeon", employmentType: "Full-Time", status: "Active", dateOfJoining: "2021-08-20", reportingManager: "Dr. Arun Bhatia", reportingManagerId: "EMP-010", location: "Main Campus", floor: "4th Floor", qualifications: ["MBBS", "MS Orthopedics", "MRCS"], experience: 15, baseSalary: 250000, profileColor: "#FF5630", avatar: "SK", emergencyContact: "Meena Kumar", emergencyPhone: "+91-65432-10988", address: "23 Juhu Lane, Juhu", city: "Mumbai", state: "Maharashtra", pincode: "400049" },
  { id: "EMP-005", name: "Ravi Shankar", email: "ravi.shankar@hospital.in", phone: "+91-54321-09876", gender: "Male", dob: "1988-07-28", maritalStatus: "Single", bloodGroup: "B-", employeeId: "HMS-2023-042", department: "Pharmacy", designation: "Chief Pharmacist", employmentType: "Full-Time", status: "Active", dateOfJoining: "2023-04-01", reportingManager: "Dr. Arun Bhatia", reportingManagerId: "EMP-010", location: "Main Campus", floor: "Ground Floor", qualifications: ["B.Pharm", "M.Pharm", "Pharm.D"], experience: 10, baseSalary: 95000, profileColor: "#FFAB00", avatar: "RS", emergencyContact: "Lata Shankar", emergencyPhone: "+91-54321-09877", address: "56 Hill Road, Bandra West", city: "Mumbai", state: "Maharashtra", pincode: "400050" },
  { id: "EMP-006", name: "Nurse Lakshmi Iyer", email: "lakshmi.iyer@hospital.in", phone: "+91-43210-98765", gender: "Female", dob: "1992-01-09", maritalStatus: "Married", bloodGroup: "O-", employeeId: "HMS-2023-028", department: "Pediatrics", designation: "Nurse Manager", employmentType: "Full-Time", status: "Active", dateOfJoining: "2023-02-14", reportingManager: "Nurse Kavita Iyer", reportingManagerId: "EMP-012", location: "Main Campus", floor: "3rd Floor", qualifications: ["B.Sc Nursing", "Pediatric Nursing"], experience: 7, baseSalary: 78000, profileColor: "#36B37E", avatar: "LI", emergencyContact: "Venkat Iyer", emergencyPhone: "+91-43210-98766", address: "91 Carter Road, Bandra West", city: "Mumbai", state: "Maharashtra", pincode: "400050" },
  { id: "EMP-007", name: "Amit Deshmukh", email: "amit.deshmukh@hospital.in", phone: "+91-32109-87654", gender: "Male", dob: "1995-04-15", maritalStatus: "Single", bloodGroup: "A-", employeeId: "HMS-2024-003", department: "Laboratory", designation: "Lab Technician", employmentType: "Full-Time", status: "Probation", dateOfJoining: "2024-01-15", reportingManager: "Dr. Neha Gupta", reportingManagerId: "EMP-013", location: "Main Campus", floor: "1st Floor", qualifications: ["B.Sc Medical Lab Technology", "DMLT"], experience: 3, baseSalary: 42000, profileColor: "#00B8D9", avatar: "AD2", probationEnd: "2024-07-15", emergencyContact: "Suman Deshmukh", emergencyPhone: "+91-32109-87655", address: "14 Powai Lake Road", city: "Mumbai", state: "Maharashtra", pincode: "400076" },
  { id: "EMP-008", name: "Dr. Kavita Singh", email: "kavita.singh@hospital.in", phone: "+91-21098-76543", gender: "Female", dob: "1980-08-21", maritalStatus: "Divorced", bloodGroup: "B+", employeeId: "HMS-2020-012", department: "Radiology", designation: "Senior Radiologist", employmentType: "Full-Time", status: "Active", dateOfJoining: "2020-11-05", reportingManager: "Dr. Arun Bhatia", reportingManagerId: "EMP-010", location: "Main Campus", floor: "1st Floor", qualifications: ["MBBS", "MD Radiology", "FRCR"], experience: 16, baseSalary: 240000, profileColor: "#FF8B00", avatar: "KS", emergencyContact: "Parent: H.S. Singh", emergencyPhone: "+91-21098-76544", address: "32 Malabar Hill", city: "Mumbai", state: "Maharashtra", pincode: "400006" },
  { id: "EMP-009", name: "Sneha Patil", email: "sneha.patil@hospital.in", phone: "+91-10987-65432", gender: "Female", dob: "1993-12-03", maritalStatus: "Single", bloodGroup: "O+", employeeId: "HMS-2024-018", department: "Reception", designation: "Front Desk Executive", employmentType: "Full-Time", status: "Active", dateOfJoining: "2024-03-01", reportingManager: "Neha Kapoor", reportingManagerId: "EMP-014", location: "Main Campus", floor: "Ground Floor", qualifications: ["BA", "Diploma in Hospital Administration"], experience: 4, baseSalary: 35000, profileColor: "#6554C0", avatar: "SP", emergencyContact: "Mohan Patil", emergencyPhone: "+91-10987-65433", address: "67 Dadar TT Circle", city: "Mumbai", state: "Maharashtra", pincode: "400014" },
  { id: "EMP-010", name: "Dr. Arun Bhatia", email: "arun.bhatia@hospital.in", phone: "+91-09876-54321", gender: "Male", dob: "1972-02-18", maritalStatus: "Married", bloodGroup: "A+", employeeId: "HMS-2018-001", department: "Administration", designation: "Medical Superintendent", employmentType: "Full-Time", status: "Active", dateOfJoining: "2018-06-01", reportingManager: "Board of Directors", reportingManagerId: "N/A", location: "Main Campus", floor: "5th Floor", qualifications: ["MBBS", "MS", "MHA", "FICS"], experience: 26, baseSalary: 450000, profileColor: "#0052CC", avatar: "AB", emergencyContact: "Dr. Meera Bhatia", emergencyPhone: "+91-09876-54322", address: "1 Marine Drive", city: "Mumbai", state: "Maharashtra", pincode: "400002" },
  { id: "EMP-011", name: "Dr. Meera Joshi", email: "meera.joshi@hospital.in", phone: "+91-98712-34567", gender: "Female", dob: "1979-06-30", maritalStatus: "Married", bloodGroup: "AB-", employeeId: "HMS-2019-005", department: "Emergency", designation: "HOD Emergency Medicine", employmentType: "Full-Time", status: "Active", dateOfJoining: "2019-01-15", reportingManager: "Dr. Arun Bhatia", reportingManagerId: "EMP-010", location: "Main Campus", floor: "Ground Floor", qualifications: ["MBBS", "MD Emergency Medicine", "FIPP"], experience: 17, baseSalary: 260000, profileColor: "#FF5630", avatar: "MJ", emergencyContact: "Sanjay Joshi", emergencyPhone: "+91-98712-34568", address: "88 Bandra Kurla Complex", city: "Mumbai", state: "Maharashtra", pincode: "400051" },
  { id: "EMP-012", name: "Nurse Kavita Iyer", email: "kavita.iyer@hospital.in", phone: "+91-87612-34567", gender: "Female", dob: "1983-10-14", maritalStatus: "Married", bloodGroup: "B+", employeeId: "HMS-2019-008", department: "Nursing", designation: "Nursing Superintendent", employmentType: "Full-Time", status: "Active", dateOfJoining: "2019-03-01", reportingManager: "Dr. Arun Bhatia", reportingManagerId: "EMP-010", location: "Main Campus", floor: "2nd Floor", qualifications: ["B.Sc Nursing", "M.Sc Nursing", "Certified Nurse Administrator"], experience: 14, baseSalary: 120000, profileColor: "#00875A", avatar: "KI", emergencyContact: "Rajiv Iyer", emergencyPhone: "+91-87612-34568", address: "42 Powai Garden", city: "Mumbai", state: "Maharashtra", pincode: "400076" },
  { id: "EMP-013", name: "Dr. Neha Gupta", email: "neha.gupta@hospital.in", phone: "+91-76512-34567", gender: "Female", dob: "1987-04-25", maritalStatus: "Single", bloodGroup: "O-", employeeId: "HMS-2021-015", department: "Laboratory", designation: "HOD Pathology", employmentType: "Full-Time", status: "Active", dateOfJoining: "2021-06-15", reportingManager: "Dr. Arun Bhatia", reportingManagerId: "EMP-010", location: "Main Campus", floor: "1st Floor", qualifications: ["MBBS", "MD Pathology", "FIACM"], experience: 11, baseSalary: 195000, profileColor: "#6554C0", avatar: "NG", emergencyContact: "Parent: R.K. Gupta", emergencyPhone: "+91-76512-34568", address: "15 Malad Link Road", city: "Mumbai", state: "Maharashtra", pincode: "400064" },
  { id: "EMP-014", name: "Neha Kapoor", email: "neha.kapoor@hospital.in", phone: "+91-65412-34567", gender: "Female", dob: "1991-08-07", maritalStatus: "Married", bloodGroup: "A+", employeeId: "HMS-2022-025", department: "Reception", designation: "Front Desk Manager", employmentType: "Full-Time", status: "Active", dateOfJoining: "2022-05-10", reportingManager: "Dr. Arun Bhatia", reportingManagerId: "EMP-010", location: "Main Campus", floor: "Ground Floor", qualifications: ["BBA", "Diploma in Hospitality"], experience: 6, baseSalary: 55000, profileColor: "#FFAB00", avatar: "NK", emergencyContact: "Aditya Kapoor", emergencyPhone: "+91-65412-34568", address: "29 Andheri Kurla Road", city: "Mumbai", state: "Maharashtra", pincode: "400069" },
  { id: "EMP-015", name: "Vikram Reddy", email: "vikram.reddy@hospital.in", phone: "+91-54312-34567", gender: "Male", dob: "1986-11-20", maritalStatus: "Married", bloodGroup: "B-", employeeId: "HMS-2023-055", department: "IT", designation: "IT Manager", employmentType: "Full-Time", status: "Active", dateOfJoining: "2023-06-01", reportingManager: "Dr. Arun Bhatia", reportingManagerId: "EMP-010", location: "Main Campus", floor: "5th Floor", qualifications: ["B.Tech CS", "M.Tech IT", "PMP"], experience: 9, baseSalary: 110000, profileColor: "#00B8D9", avatar: "VR", emergencyContact: "Priya Reddy", emergencyPhone: "+91-54312-34568", address: "88 Thane West", city: "Thane", state: "Maharashtra", pincode: "400601" },
  { id: "EMP-016", name: "Dr. Fatima Khan", email: "fatima.khan@hospital.in", phone: "+91-43212-34567", gender: "Female", dob: "1984-03-08", maritalStatus: "Married", bloodGroup: "O+", employeeId: "HMS-2020-022", department: "Pediatrics", designation: "Consultant Pediatrician", employmentType: "Full-Time", status: "On Notice", dateOfJoining: "2020-08-01", reportingManager: "Dr. Arun Bhatia", reportingManagerId: "EMP-010", location: "Main Campus", floor: "3rd Floor", qualifications: ["MBBS", "MD Pediatrics"], experience: 13, baseSalary: 200000, profileColor: "#FF8B00", avatar: "FK", noticePeriod: 30, emergencyContact: "Imran Khan", emergencyPhone: "+91-43212-34568", address: "50 Colaba Causeway", city: "Mumbai", state: "Maharashtra", pincode: "400005" },
  { id: "EMP-017", name: "Manoj Tiwari", email: "manoj.tiwari@hospital.in", phone: "+91-32112-34567", gender: "Male", dob: "1997-09-12", maritalStatus: "Single", bloodGroup: "A+", employeeId: "HMS-2025-001", department: "Housekeeping", designation: "Housekeeping Supervisor", employmentType: "Full-Time", status: "Active", dateOfJoining: "2025-01-15", reportingManager: "Suresh Naik", reportingManagerId: "EMP-018", location: "Main Campus", floor: "All Floors", qualifications: ["12th Pass", "Housekeeping Management Certificate"], experience: 2, baseSalary: 28000, profileColor: "#36B37E", avatar: "MT", emergencyContact: "Savitri Tiwari", emergencyPhone: "+91-32112-34568", address: "12 Govandi Station Road", city: "Mumbai", state: "Maharashtra", pincode: "400088" },
  { id: "EMP-018", name: "Suresh Naik", email: "suresh.naik@hospital.in", phone: "+91-21012-34567", gender: "Male", dob: "1980-06-22", maritalStatus: "Married", bloodGroup: "B+", employeeId: "HMS-2019-035", department: "Facilities", designation: "Facilities Manager", employmentType: "Full-Time", status: "Active", dateOfJoining: "2019-07-01", reportingManager: "Dr. Arun Bhatia", reportingManagerId: "EMP-010", location: "Main Campus", floor: "Basement", qualifications: ["Diploma in Facility Management", "B.Com"], experience: 12, baseSalary: 65000, profileColor: "#FF5630", avatar: "SN", emergencyContact: "Vijaya Naik", emergencyPhone: "+91-21012-34568", address: "33 Chembur Naka", city: "Mumbai", state: "Maharashtra", pincode: "400071" },
];

/* ── Departments ──────────────────────────────────────────────────────────── */
export interface Department {
  id: string;
  name: string;
  head: string;
  headId: string;
  employeeCount: number;
  budget: number;
  location: string;
  floor: string;
}

export const DEPARTMENTS: Department[] = [
  { id: "DEPT-001", name: "Cardiology", head: "Dr. Rajesh Mehta", headId: "EMP-001", employeeCount: 42, budget: 8500000, location: "Main Campus", floor: "3rd Floor" },
  { id: "DEPT-002", name: "Emergency", head: "Dr. Meera Joshi", headId: "EMP-011", employeeCount: 68, budget: 12000000, location: "Main Campus", floor: "Ground Floor" },
  { id: "DEPT-003", name: "ICU", head: "Nurse Kavita Iyer", headId: "EMP-012", employeeCount: 55, budget: 15000000, location: "Main Campus", floor: "2nd Floor" },
  { id: "DEPT-004", name: "Orthopedics", head: "Dr. Suresh Kumar", headId: "EMP-004", employeeCount: 35, budget: 6200000, location: "Main Campus", floor: "4th Floor" },
  { id: "DEPT-005", name: "Pediatrics", head: "Dr. Fatima Khan", headId: "EMP-016", employeeCount: 38, budget: 7800000, location: "Main Campus", floor: "3rd Floor" },
  { id: "DEPT-006", name: "Radiology", head: "Dr. Kavita Singh", headId: "EMP-008", employeeCount: 22, budget: 9500000, location: "Main Campus", floor: "1st Floor" },
  { id: "DEPT-007", name: "Laboratory", head: "Dr. Neha Gupta", headId: "EMP-013", employeeCount: 30, budget: 5400000, location: "Main Campus", floor: "1st Floor" },
  { id: "DEPT-008", name: "Pharmacy", head: "Ravi Shankar", headId: "EMP-005", employeeCount: 18, budget: 3200000, location: "Main Campus", floor: "Ground Floor" },
  { id: "DEPT-009", name: "Nursing", head: "Nurse Kavita Iyer", headId: "EMP-012", employeeCount: 180, budget: 22000000, location: "Main Campus", floor: "2nd Floor" },
  { id: "DEPT-010", name: "Administration", head: "Dr. Arun Bhatia", headId: "EMP-010", employeeCount: 25, budget: 4500000, location: "Main Campus", floor: "5th Floor" },
  { id: "DEPT-011", name: "Reception", head: "Neha Kapoor", headId: "EMP-014", employeeCount: 12, budget: 1800000, location: "Main Campus", floor: "Ground Floor" },
  { id: "DEPT-012", name: "IT", head: "Vikram Reddy", headId: "EMP-015", employeeCount: 8, budget: 2400000, location: "Main Campus", floor: "5th Floor" },
  { id: "DEPT-013", name: "Facilities", head: "Suresh Naik", headId: "EMP-018", employeeCount: 45, budget: 3600000, location: "Main Campus", floor: "Basement" },
  { id: "DEPT-014", name: "Housekeeping", head: "Manoj Tiwari", headId: "EMP-017", employeeCount: 60, budget: 2100000, location: "Main Campus", floor: "All Floors" },
];

/* ── Recruitment / Job Openings ───────────────────────────────────────────── */
export type JobStatus = "Open" | "On Hold" | "Closed" | "Filled";
export type Priority = "Critical" | "High" | "Medium" | "Low";

export interface JobOpening {
  id: string;
  title: string;
  department: string;
  hiringManager: string;
  positions: number;
  status: JobStatus;
  priority: Priority;
  dateOpened: string;
  dateClosed?: string;
  salaryRange: string;
  applicants: number;
  shortlisted: number;
  interviewed: number;
  offered: number;
  description: string;
  requirements: string[];
  type: EmploymentType;
}

export const JOB_OPENINGS: JobOpening[] = [
  { id: "JOB-001", title: "Intensivist", department: "ICU", hiringManager: "Dr. Arun Bhatia", positions: 2, status: "Open", priority: "Critical", dateOpened: "2026-07-01", salaryRange: "₹18-25 LPA", applicants: 34, shortlisted: 12, interviewed: 6, offered: 1, description: "Senior intensivist for 20-bed ICU", requirements: ["MD Critical Care", "5+ years experience", "Ventilator management"], type: "Full-Time" },
  { id: "JOB-002", title: "Staff Nurse — ICU", department: "ICU", hiringManager: "Nurse Kavita Iyer", positions: 6, status: "Open", priority: "High", dateOpened: "2026-07-10", salaryRange: "₹4.5-6.5 LPA", applicants: 89, shortlisted: 32, interviewed: 18, offered: 4, description: "ICU-trained nurses for critical care unit", requirements: ["B.Sc Nursing", "Critical Care Certification", "2+ years ICU experience"], type: "Full-Time" },
  { id: "JOB-003", title: "Radiology Technician", department: "Radiology", hiringManager: "Dr. Kavita Singh", positions: 2, status: "Open", priority: "Medium", dateOpened: "2026-07-15", salaryRange: "₹3.5-5 LPA", applicants: 21, shortlisted: 8, interviewed: 3, offered: 0, description: "CT/MRI technician for radiology department", requirements: ["B.Sc Radiology", "2+ years experience", "CT/MRI certification"], type: "Full-Time" },
  { id: "JOB-004", title: "Medical Records Officer", department: "Administration", hiringManager: "Dr. Arun Bhatia", positions: 1, status: "Open", priority: "Low", dateOpened: "2026-07-18", salaryRange: "₹3-4.5 LPA", applicants: 15, shortlisted: 5, interviewed: 2, offered: 0, description: "Medical records management and digitization", requirements: ["B.Lib/Health Information Management", "1+ years experience"], type: "Full-Time" },
  { id: "JOB-005", title: "Cardiology Fellow", department: "Cardiology", hiringManager: "Dr. Rajesh Mehta", positions: 1, status: "On Hold", priority: "Medium", dateOpened: "2026-06-15", salaryRange: "₹12-16 LPA", applicants: 42, shortlisted: 15, interviewed: 8, offered: 0, description: "Fellowship in interventional cardiology", requirements: ["DM Cardiology", "Research publications"], type: "Full-Time" },
  { id: "JOB-006", title: "Pharmacist", department: "Pharmacy", hiringManager: "Ravi Shankar", positions: 2, status: "Open", priority: "Medium", dateOpened: "2026-07-20", salaryRange: "₹3.5-5 LPA", applicants: 28, shortlisted: 10, interviewed: 4, offered: 1, description: "Hospital pharmacist for inpatient pharmacy", requirements: ["B.Pharm/D.Pharm", "Registered pharmacist", "Hospital experience preferred"], type: "Full-Time" },
];

/* ── Applicants ───────────────────────────────────────────────────────────── */
export interface Applicant {
  id: string;
  name: string;
  email: string;
  phone: string;
  jobId: string;
  appliedDate: string;
  status: ApplicationStatus;
  currentRound: string;
  experience: number;
  qualifications: string[];
  resumeScore: number;
  interviewScore?: number;
  notes: string;
  source: string;
}

export const APPLICANTS: Applicant[] = [
  { id: "APL-001", name: "Dr. Vikram Patel", email: "vikram.patel@email.com", phone: "+91-99887-76655", jobId: "JOB-001", appliedDate: "2026-07-03", status: "Interview", currentRound: "Technical Interview", experience: 8, qualifications: ["MBBS", "MD Critical Care"], resumeScore: 92, interviewScore: 88, notes: "Strong ICU experience at AIIMS", source: "LinkedIn" },
  { id: "APL-002", name: "Dr. Sanya Malhotra", email: "sanya.m@email.com", phone: "+91-88776-65544", jobId: "JOB-001", appliedDate: "2026-07-05", status: "Screening", currentRound: "Resume Review", experience: 6, qualifications: ["MBBS", "DA", "Critical Care"], resumeScore: 85, notes: "Good critical care background", source: "Naukri" },
  { id: "APL-003", name: "Nurse Priyanka Jha", email: "priyanka.jha@email.com", phone: "+91-77665-54433", jobId: "JOB-002", appliedDate: "2026-07-12", status: "Offer", currentRound: "Offer Stage", experience: 4, qualifications: ["B.Sc Nursing", "CCCN"], resumeScore: 88, interviewScore: 91, notes: "Excellent critical care skills", source: "Walk-in" },
  { id: "APL-004", name: "Nurse Deepa Nair", email: "deepa.nair@email.com", phone: "+91-66554-43322", jobId: "JOB-002", appliedDate: "2026-07-14", status: "Interview", currentRound: "Panel Interview", experience: 3, qualifications: ["B.Sc Nursing"], resumeScore: 78, notes: "Good potential, needs mentoring", source: "Referral" },
  { id: "APL-005", name: "Rajesh Verma", email: "rajesh.v@email.com", phone: "+91-55443-32211", jobId: "JOB-003", appliedDate: "2026-07-16", status: "Screening", currentRound: "Resume Review", experience: 5, qualifications: ["B.Sc Radiology", "CT/MRI Certified"], resumeScore: 82, notes: "Experienced in 3T MRI", source: "Indeed" },
  { id: "APL-006", name: "Ankita Sharma", email: "ankita.s@email.com", phone: "+91-44332-21100", jobId: "JOB-004", appliedDate: "2026-07-19", status: "Applied", currentRound: "Application Received", experience: 2, qualifications: ["B.Lib", "HIM Diploma"], resumeScore: 75, notes: "", source: "College Placement" },
  { id: "APL-007", name: "Dr. Amit Saxena", email: "amit.saxena@email.com", phone: "+91-33221-10099", jobId: "JOB-001", appliedDate: "2026-07-08", status: "Hired", currentRound: "Completed", experience: 10, qualifications: ["MBBS", "DM Critical Care", "FCCM"], resumeScore: 95, interviewScore: 93, notes: "Joined on 2026-07-22", source: "Direct" },
  { id: "APL-008", name: "Saurabh Kulkarni", email: "saurabh.k@email.com", phone: "+91-22110-09988", jobId: "JOB-006", appliedDate: "2026-07-21", status: "Interview", currentRound: "Hiring Manager Round", experience: 3, qualifications: ["B.Pharm", "Registered Pharmacist"], resumeScore: 80, interviewScore: 78, notes: "Good hospital pharmacy experience", source: "Naukri" },
];

/* ── Credentials ──────────────────────────────────────────────────────────── */
export interface Credential {
  id: string;
  employeeId: string;
  employeeName: string;
  type: CredentialType;
  name: string;
  number: string;
  issuedBy: string;
  issuedDate: string;
  expiryDate: string;
  status: "Valid" | "Expiring Soon" | "Expired" | "Pending Verification";
  daysToExpiry: number;
  documentUrl: string;
}

export const CREDENTIALS: Credential[] = [
  { id: "CRD-001", employeeId: "EMP-001", employeeName: "Dr. Rajesh Mehta", type: "Medical Council", name: "Maharashtra Medical Council", number: "MMC-2008-12345", issuedBy: "Maharashtra Medical Council", issuedDate: "2008-06-15", expiryDate: "2028-06-14", status: "Valid", daysToExpiry: 721, documentUrl: "#" },
  { id: "CRD-002", employeeId: "EMP-001", employeeName: "Dr. Rajesh Mehta", type: "Specialty Board", name: "DM Cardiology", number: "MCI-DM-2014-678", issuedBy: "Medical Council of India", issuedDate: "2014-05-20", expiryDate: "2026-05-19", status: "Expired", daysToExpiry: -65, documentUrl: "#" },
  { id: "CRD-003", employeeId: "EMP-002", employeeName: "Dr. Priya Sharma", type: "Medical Council", name: "Maharashtra Medical Council", number: "MMC-2014-54321", issuedBy: "Maharashtra Medical Council", issuedDate: "2014-08-10", expiryDate: "2028-08-09", status: "Valid", daysToExpiry: 778, documentUrl: "#" },
  { id: "CRD-004", employeeId: "EMP-003", employeeName: "Nurse Ananya Desai", type: "Nursing Council", name: "Maharashtra Nursing Council", number: "MNC-2016-9876", issuedBy: "Maharashtra Nursing Council", issuedDate: "2016-03-25", expiryDate: "2026-03-24", status: "Expired", daysToExpiry: -121, documentUrl: "#" },
  { id: "CRD-005", employeeId: "EMP-004", employeeName: "Dr. Suresh Kumar", type: "Medical Council", name: "Maharashtra Medical Council", number: "MMC-2011-11223", issuedBy: "Maharashtra Medical Council", issuedDate: "2011-04-18", expiryDate: "2027-04-17", status: "Valid", daysToExpiry: 268, documentUrl: "#" },
  { id: "CRD-006", employeeId: "EMP-008", employeeName: "Dr. Kavita Singh", type: "Medical Council", name: "Delhi Medical Council", number: "DMC-2010-44556", issuedBy: "Delhi Medical Council", issuedDate: "2010-07-22", expiryDate: "2026-07-21", status: "Expiring Soon", daysToExpiry: -2, documentUrl: "#" },
  { id: "CRD-007", employeeId: "EMP-008", employeeName: "Dr. Kavita Singh", type: "Specialty Board", name: "FRCR Radiology", number: "RCR-FRCR-2015-789", issuedBy: "Royal College of Radiologists", issuedDate: "2015-09-01", expiryDate: "2025-08-31", status: "Expired", daysToExpiry: -326, documentUrl: "#" },
  { id: "CRD-008", employeeId: "EMP-011", employeeName: "Dr. Meera Joshi", type: "BLS", name: "BLS Provider", number: "AHA-BLS-2024-1234", issuedBy: "American Heart Association", issuedDate: "2024-01-15", expiryDate: "2026-01-14", status: "Expired", daysToExpiry: -191, documentUrl: "#" },
  { id: "CRD-009", employeeId: "EMP-011", employeeName: "Dr. Meera Joshi", type: "ACLS", name: "ACLS Provider", number: "AHA-ACLS-2024-5678", issuedBy: "American Heart Association", issuedDate: "2024-01-15", expiryDate: "2026-01-14", status: "Expired", daysToExpiry: -191, documentUrl: "#" },
  { id: "CRD-010", employeeId: "EMP-012", employeeName: "Nurse Kavita Iyer", type: "Nursing Council", name: "Maharashtra Nursing Council", number: "MNC-2012-55667", issuedBy: "Maharashtra Nursing Council", issuedDate: "2012-02-10", expiryDate: "2027-02-09", status: "Valid", daysToExpiry: 200, documentUrl: "#" },
];

/* ── Attendance ───────────────────────────────────────────────────────────── */
export type AttendanceStatus = "Present" | "Absent" | "Late" | "Half Day" | "On Leave" | "Holiday" | "Week Off";

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  clockIn: string;
  clockOut: string;
  status: AttendanceStatus;
  hoursWorked: number;
  overtime: number;
  lateMinutes: number;
  shift: ShiftType;
  department: string;
}

export const ATTENDANCE: AttendanceRecord[] = [
  { id: "ATT-001", employeeId: "EMP-001", employeeName: "Dr. Rajesh Mehta", date: "2026-07-23", clockIn: "08:55", clockOut: "17:30", status: "Present", hoursWorked: 8.58, overtime: 0, lateMinutes: 0, shift: "Morning", department: "Cardiology" },
  { id: "ATT-002", employeeId: "EMP-002", employeeName: "Dr. Priya Sharma", date: "2026-07-23", clockIn: "07:58", clockOut: "20:05", status: "Present", hoursWorked: 12.12, overtime: 4.12, lateMinutes: 0, shift: "Morning", department: "Emergency" },
  { id: "ATT-003", employeeId: "EMP-003", employeeName: "Nurse Ananya Desai", date: "2026-07-23", clockIn: "06:02", clockOut: "14:05", status: "Present", hoursWorked: 8.05, overtime: 0, lateMinutes: 2, shift: "Morning", department: "ICU" },
  { id: "ATT-004", employeeId: "EMP-004", employeeName: "Dr. Suresh Kumar", date: "2026-07-23", clockIn: "09:45", clockOut: "18:00", status: "Late", hoursWorked: 8.25, overtime: 0, lateMinutes: 45, shift: "Morning", department: "Orthopedics" },
  { id: "ATT-005", employeeId: "EMP-005", employeeName: "Ravi Shankar", date: "2026-07-23", clockIn: "08:30", clockOut: "17:00", status: "Present", hoursWorked: 8.5, overtime: 0, lateMinutes: 0, shift: "Morning", department: "Pharmacy" },
  { id: "ATT-006", employeeId: "EMP-006", employeeName: "Nurse Lakshmi Iyer", date: "2026-07-23", clockIn: "", clockOut: "", status: "On Leave", hoursWorked: 0, overtime: 0, lateMinutes: 0, shift: "Morning", department: "Pediatrics" },
  { id: "ATT-007", employeeId: "EMP-007", employeeName: "Amit Deshmukh", date: "2026-07-23", clockIn: "08:58", clockOut: "17:05", status: "Present", hoursWorked: 8.12, overtime: 0, lateMinutes: 0, shift: "Morning", department: "Laboratory" },
  { id: "ATT-008", employeeId: "EMP-009", employeeName: "Sneha Patil", date: "2026-07-23", clockIn: "07:55", clockOut: "16:30", status: "Present", hoursWorked: 8.58, overtime: 0, lateMinutes: 0, shift: "Morning", department: "Reception" },
  { id: "ATT-009", employeeId: "EMP-010", employeeName: "Dr. Arun Bhatia", date: "2026-07-23", clockIn: "07:30", clockOut: "19:00", status: "Present", hoursWorked: 11.5, overtime: 3.5, lateMinutes: 0, shift: "Morning", department: "Administration" },
  { id: "ATT-010", employeeId: "EMP-015", employeeName: "Vikram Reddy", date: "2026-07-23", clockIn: "09:15", clockOut: "18:30", status: "Late", hoursWorked: 9.25, overtime: 1.25, lateMinutes: 15, shift: "Morning", department: "IT" },
  { id: "ATT-011", employeeId: "EMP-017", employeeName: "Manoj Tiwari", date: "2026-07-23", clockIn: "06:00", clockOut: "14:00", status: "Present", hoursWorked: 8, overtime: 0, lateMinutes: 0, shift: "Morning", department: "Housekeeping" },
  { id: "ATT-012", employeeId: "EMP-016", employeeName: "Dr. Fatima Khan", date: "2026-07-23", clockIn: "", clockOut: "", status: "On Leave", hoursWorked: 0, overtime: 0, lateMinutes: 0, shift: "Morning", department: "Pediatrics" },
];

/* ── Shifts ───────────────────────────────────────────────────────────────── */
export interface Shift {
  id: string;
  name: string;
  type: ShiftType;
  startTime: string;
  endTime: string;
  breakMinutes: number;
  color: string;
}

export const SHIFTS: Shift[] = [
  { id: "SHF-001", name: "Morning", type: "Morning", startTime: "06:00", endTime: "14:00", breakMinutes: 30, color: "#FFAB00" },
  { id: "SHF-002", name: "Evening", type: "Evening", startTime: "14:00", endTime: "22:00", breakMinutes: 30, color: "#FF8B00" },
  { id: "SHF-003", name: "Night", type: "Night", startTime: "22:00", endTime: "06:00", breakMinutes: 45, color: "#6554C0" },
  { id: "SHF-004", name: "On-Call", type: "On-Call", startTime: "00:00", endTime: "23:59", breakMinutes: 0, color: "#FF5630" },
  { id: "SHF-005", name: "General", type: "Flexible", startTime: "09:00", endTime: "18:00", breakMinutes: 60, color: "#00875A" },
];

export interface ShiftRoster {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  shiftId: string;
  department: string;
  status: "Confirmed" | "Tentative" | "Swap Requested" | "Off Duty";
}

export const SHIFT_ROSTER: ShiftRoster[] = [
  { id: "SR-001", employeeId: "EMP-001", employeeName: "Dr. Rajesh Mehta", date: "2026-07-24", shiftId: "SHF-005", department: "Cardiology", status: "Confirmed" },
  { id: "SR-002", employeeId: "EMP-002", employeeName: "Dr. Priya Sharma", date: "2026-07-24", shiftId: "SHF-001", department: "Emergency", status: "Confirmed" },
  { id: "SR-003", employeeId: "EMP-003", employeeName: "Nurse Ananya Desai", date: "2026-07-24", shiftId: "SHF-002", department: "ICU", status: "Confirmed" },
  { id: "SR-004", employeeId: "EMP-004", employeeName: "Dr. Suresh Kumar", date: "2026-07-24", shiftId: "SHF-005", department: "Orthopedics", status: "Confirmed" },
  { id: "SR-005", employeeId: "EMP-006", employeeName: "Nurse Lakshmi Iyer", date: "2026-07-24", shiftId: "SHF-003", department: "Pediatrics", status: "Swap Requested" },
  { id: "SR-006", employeeId: "EMP-007", employeeName: "Amit Deshmukh", date: "2026-07-24", shiftId: "SHF-001", department: "Laboratory", status: "Confirmed" },
  { id: "SR-007", employeeId: "EMP-009", employeeName: "Sneha Patil", date: "2026-07-24", shiftId: "SHF-005", department: "Reception", status: "Confirmed" },
  { id: "SR-008", employeeId: "EMP-011", employeeName: "Dr. Meera Joshi", date: "2026-07-24", shiftId: "SHF-004", department: "Emergency", status: "Tentative" },
];

/* ── Leave Requests ───────────────────────────────────────────────────────── */
export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  type: LeaveType;
  fromDate: string;
  toDate: string;
  days: number;
  reason: string;
  status: LeaveStatus;
  appliedDate: string;
  approvedBy?: string;
  comments?: string;
}

export const LEAVE_REQUESTS: LeaveRequest[] = [
  { id: "LV-001", employeeId: "EMP-006", employeeName: "Nurse Lakshmi Iyer", department: "Pediatrics", type: "Annual", fromDate: "2026-07-23", toDate: "2026-07-25", days: 3, reason: "Family function", status: "Approved", appliedDate: "2026-07-15", approvedBy: "Nurse Kavita Iyer", comments: "Approved — ensure handover to Night shift" },
  { id: "LV-002", employeeId: "EMP-016", employeeName: "Dr. Fatima Khan", department: "Pediatrics", type: "Annual", fromDate: "2026-07-23", toDate: "2026-08-21", days: 30, reason: "Notice period — serving notice", status: "Approved", appliedDate: "2026-06-23", approvedBy: "Dr. Arun Bhatia" },
  { id: "LV-003", employeeId: "EMP-004", employeeName: "Dr. Suresh Kumar", department: "Orthopedics", type: "Sick", fromDate: "2026-07-24", toDate: "2026-07-24", days: 1, reason: "Medical appointment", status: "Pending", appliedDate: "2026-07-23" },
  { id: "LV-004", employeeId: "EMP-009", employeeName: "Sneha Patil", department: "Reception", type: "Emergency", fromDate: "2026-07-25", toDate: "2026-07-25", days: 1, reason: "Family emergency", status: "Pending", appliedDate: "2026-07-23" },
  { id: "LV-005", employeeId: "EMP-003", employeeName: "Nurse Ananya Desai", department: "ICU", type: "Compensatory", fromDate: "2026-07-28", toDate: "2026-07-29", days: 2, reason: "Comp off for OT duty on 20th July", status: "Pending", appliedDate: "2026-07-22" },
  { id: "LV-006", employeeId: "EMP-017", employeeName: "Manoj Tiwari", department: "Housekeeping", type: "Sick", fromDate: "2026-07-20", toDate: "2026-07-21", days: 2, reason: "Fever", status: "Approved", appliedDate: "2026-07-20", approvedBy: "Suresh Naik" },
];

/* ── Payroll ──────────────────────────────────────────────────────────────── */
export interface Payslip {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  designation: string;
  month: string;
  basic: number;
  hra: number;
  conveyance: number;
  medical: number;
  special: number;
  overtime: number;
  bonus: number;
  grossEarnings: number;
  pf: number;
  esi: number;
  tds: number;
  professionalTax: number;
  totalDeductions: number;
  netPay: number;
  status: PayrollStatus;
  paidDate?: string;
}

export const PAYSLIPS: Payslip[] = [
  { id: "PAY-001", employeeId: "EMP-001", employeeName: "Dr. Rajesh Mehta", department: "Cardiology", designation: "HOD", month: "July 2026", basic: 140000, hra: 56000, conveyance: 8000, medical: 12500, special: 35000, overtime: 0, bonus: 0, grossEarnings: 251500, pf: 1800, esi: 0, tds: 42000, professionalTax: 2500, totalDeductions: 46300, netPay: 205200, status: "Processed", paidDate: "2026-07-01" },
  { id: "PAY-002", employeeId: "EMP-002", employeeName: "Dr. Priya Sharma", department: "Emergency", designation: "Consultant", month: "July 2026", basic: 110000, hra: 44000, conveyance: 8000, medical: 12500, special: 25000, overtime: 18500, bonus: 0, grossEarnings: 218000, pf: 1800, esi: 0, tds: 34000, professionalTax: 2500, totalDeductions: 38300, netPay: 179700, status: "Processed", paidDate: "2026-07-01" },
  { id: "PAY-003", employeeId: "EMP-003", employeeName: "Nurse Ananya Desai", department: "ICU", designation: "Senior Nurse", month: "July 2026", basic: 42500, hra: 17000, conveyance: 8000, medical: 12500, special: 5000, overtime: 0, bonus: 0, grossEarnings: 85000, pf: 1800, esi: 563, tds: 5000, professionalTax: 2000, totalDeductions: 9363, netPay: 75637, status: "Processed", paidDate: "2026-07-01" },
  { id: "PAY-004", employeeId: "EMP-004", employeeName: "Dr. Suresh Kumar", department: "Orthopedics", designation: "Consultant", month: "July 2026", basic: 125000, hra: 50000, conveyance: 8000, medical: 12500, special: 30000, overtime: 0, bonus: 0, grossEarnings: 225500, pf: 1800, esi: 0, tds: 36000, professionalTax: 2500, totalDeductions: 40300, netPay: 185200, status: "Processing" },
  { id: "PAY-005", employeeId: "EMP-009", employeeName: "Sneha Patil", department: "Reception", designation: "Front Desk Executive", month: "July 2026", basic: 17500, hra: 7000, conveyance: 8000, medical: 12500, special: 0, overtime: 0, bonus: 0, grossEarnings: 45000, pf: 1800, esi: 338, tds: 0, professionalTax: 200, totalDeductions: 2338, netPay: 42662, status: "Draft" },
  { id: "PAY-006", employeeId: "EMP-017", employeeName: "Manoj Tiwari", department: "Housekeeping", designation: "Supervisor", month: "July 2026", basic: 14000, hra: 5600, conveyance: 8000, medical: 12500, special: 0, overtime: 0, bonus: 0, grossEarnings: 40100, pf: 1800, esi: 301, tds: 0, professionalTax: 200, totalDeductions: 2301, netPay: 37799, status: "Draft" },
];

/* ── Training & CME ───────────────────────────────────────────────────────── */
export interface Training {
  id: string;
  title: string;
  type: "Mandatory" | "Optional" | "CME" | "Compliance" | "Onboarding";
  category: string;
  instructor: string;
  startDate: string;
  endDate: string;
  duration: string;
  credits?: number;
  enrolled: number;
  capacity: number;
  status: TrainingStatus;
  department: string;
  mandatory: boolean;
  renewalMonths?: number;
}

export const TRAININGS: Training[] = [
  { id: "TRN-001", title: "BLS Certification", type: "Mandatory", category: "Life Support", instructor: "AHA Certified Instructor", startDate: "2026-08-01", endDate: "2026-08-02", duration: "2 days", credits: 8, enrolled: 45, capacity: 50, status: "Enrolled", department: "All", mandatory: true, renewalMonths: 24 },
  { id: "TRN-002", title: "ACLS Provider Course", type: "Mandatory", category: "Life Support", instructor: "AHA Certified Instructor", startDate: "2026-08-15", endDate: "2026-08-17", duration: "3 days", credits: 16, enrolled: 28, capacity: 30, status: "Enrolled", department: "Emergency, ICU", mandatory: true, renewalMonths: 24 },
  { id: "TRN-003", title: "Infection Control & Hand Hygiene", type: "Compliance", category: "Safety", instructor: "Infection Control Nurse", startDate: "2026-07-25", endDate: "2026-07-25", duration: "1 day", credits: 4, enrolled: 180, capacity: 200, status: "Enrolled", department: "All", mandatory: true, renewalMonths: 12 },
  { id: "TRN-004", title: "Cardiac Intervention Workshop", type: "CME", category: "Clinical", instructor: "Dr. Rajesh Mehta", startDate: "2026-09-05", endDate: "2026-09-06", duration: "2 days", credits: 12, enrolled: 18, capacity: 25, status: "Enrolled", department: "Cardiology", mandatory: false },
  { id: "TRN-005", title: "Nursing Documentation & EMR", type: "Mandatory", category: "IT", instructor: "Vikram Reddy", startDate: "2026-07-28", endDate: "2026-07-28", duration: "4 hours", enrolled: 120, capacity: 150, status: "Enrolled", department: "Nursing", mandatory: true },
  { id: "TRN-006", title: "Workplace Safety & Needlestick Prevention", type: "Compliance", category: "Safety", instructor: "Safety Officer", startDate: "2026-07-10", endDate: "2026-07-10", duration: "2 hours", credits: 2, enrolled: 350, capacity: 400, status: "Completed", department: "All", mandatory: true, renewalMonths: 12 },
  { id: "TRN-007", title: "Emergency Preparedness Drill", type: "Mandatory", category: "Safety", instructor: "Emergency Team", startDate: "2026-06-15", endDate: "2026-06-15", duration: "Half day", enrolled: 280, capacity: 300, status: "Completed", department: "All", mandatory: true, renewalMonths: 6 },
  { id: "TRN-008", title: "Advanced Cardiac Life Support (ACLS) Renewal", type: "Mandatory", category: "Life Support", instructor: "AHA Certified", startDate: "2026-06-01", endDate: "2026-06-03", duration: "3 days", credits: 16, enrolled: 22, capacity: 25, status: "Completed", department: "Emergency, ICU, Cardiology", mandatory: true, renewalMonths: 24 },
];

/* ── Performance ──────────────────────────────────────────────────────────── */
export interface PerformanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  designation: string;
  reviewPeriod: string;
  reviewerName: string;
  overallRating: PerformanceRating;
  kpiScore: number;
  goalScore: number;
  feedbackScore: number;
  reviewDate: string;
  status: "Draft" | "Self Assessment" | "Manager Review" | "Completed" | "Calibration";
  goals: { name: string; target: number; actual: number; weight: number; }[];
  strengths: string[];
  improvements: string[];
  promotionRecommended: boolean;
}

export const PERFORMANCE: PerformanceRecord[] = [
  { id: "PER-001", employeeId: "EMP-001", employeeName: "Dr. Rajesh Mehta", department: "Cardiology", designation: "HOD", reviewPeriod: "Jan-Jun 2026", reviewerName: "Dr. Arun Bhatia", overallRating: "Exceptional", kpiScore: 96, goalScore: 94, feedbackScore: 92, reviewDate: "2026-07-15", status: "Completed", goals: [{ name: "Patient Satisfaction", target: 90, actual: 94, weight: 30 }, { name: "Procedures Performed", target: 200, actual: 225, weight: 25 }, { name: "Research Publications", target: 2, actual: 3, weight: 20 }, { name: "Team Mentoring", target: 85, actual: 92, weight: 25 }], strengths: ["Clinical excellence", "Leadership", "Research output"], improvements: ["Delegation", "Digital documentation"], promotionRecommended: false },
  { id: "PER-002", employeeId: "EMP-003", employeeName: "Nurse Ananya Desai", department: "ICU", designation: "Senior Nurse", reviewPeriod: "Jan-Jun 2026", reviewerName: "Nurse Kavita Iyer", overallRating: "Exceeds", kpiScore: 88, goalScore: 85, feedbackScore: 90, reviewDate: "2026-07-18", status: "Completed", goals: [{ name: "Patient Care Quality", target: 90, actual: 92, weight: 35 }, { name: "Medication Errors", target: 0, actual: 1, weight: 25 }, { name: "CME Credits", target: 20, actual: 24, weight: 20 }, { name: "Mentoring", target: 80, actual: 88, weight: 20 }], strengths: ["Critical care expertise", "Patient empathy", "Documentation"], improvements: ["Leadership visibility", "Shift coordination"], promotionRecommended: true },
  { id: "PER-003", employeeId: "EMP-002", employeeName: "Dr. Priya Sharma", department: "Emergency", designation: "Consultant", reviewPeriod: "Jan-Jun 2026", reviewerName: "Dr. Meera Joshi", overallRating: "Meets", kpiScore: 82, goalScore: 78, feedbackScore: 85, reviewDate: "2026-07-20", status: "Completed", goals: [{ name: "Triage Accuracy", target: 95, actual: 91, weight: 30 }, { name: "Patient Throughput", target: 40, actual: 38, weight: 25 }, { name: "Documentation", target: 90, actual: 85, weight: 25 }, { name: "Training", target: 10, actual: 8, weight: 20 }], strengths: ["Clinical decision-making", "Team player"], improvements: ["Documentation timeliness", "Mentoring juniors"], promotionRecommended: false },
  { id: "PER-004", employeeId: "EMP-007", employeeName: "Amit Deshmukh", department: "Laboratory", designation: "Lab Technician", reviewPeriod: "Jan-Jun 2026", reviewerName: "Dr. Neha Gupta", overallRating: "Meets", kpiScore: 78, goalScore: 75, feedbackScore: 80, reviewDate: "2026-07-22", status: "Self Assessment", goals: [{ name: "Sample Processing Accuracy", target: 99, actual: 98, weight: 35 }, { name: "Turnaround Time", target: 90, actual: 85, weight: 25 }, { name: "Equipment Maintenance", target: 95, actual: 92, weight: 20 }, { name: "Compliance", target: 100, actual: 100, weight: 20 }], strengths: ["Attention to detail", "Compliance"], improvements: ["Speed", "Multitasking"], promotionRecommended: false },
];

/* ── Staff Health ─────────────────────────────────────────────────────────── */
export interface StaffHealthRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  vaccinations: { name: string; date: string; nextDue: string; status: VaccinationStatus; }[];
  medicalFitness: "Fit" | "Unfit" | "Conditional";
  lastCheckup: string;
  nextCheckup: string;
  bloodPressure: string;
  bloodSugar: string;
  bmi: number;
  exposureIncidents: number;
  healthClearance: boolean;
}

export const STAFF_HEALTH: StaffHealthRecord[] = [
  { id: "HLT-001", employeeId: "EMP-001", employeeName: "Dr. Rajesh Mehta", department: "Cardiology", vaccinations: [{ name: "Hepatitis B", date: "2022-04-01", nextDue: "2027-04-01", status: "Completed" }, { name: "Influenza", date: "2025-12-15", nextDue: "2026-12-15", status: "Completed" }, { name: "COVID-19 Booster", date: "2025-09-01", nextDue: "2026-09-01", status: "Scheduled" }], medicalFitness: "Fit", lastCheckup: "2026-01-15", nextCheckup: "2027-01-15", bloodPressure: "128/82", bloodSugar: "95", bmi: 24.8, exposureIncidents: 0, healthClearance: true },
  { id: "HLT-002", employeeId: "EMP-003", employeeName: "Nurse Ananya Desai", department: "ICU", vaccinations: [{ name: "Hepatitis B", date: "2023-02-10", nextDue: "2028-02-10", status: "Completed" }, { name: "Influenza", date: "2025-11-20", nextDue: "2026-11-20", status: "Completed" }, { name: "Tetanus", date: "2024-06-01", nextDue: "2034-06-01", status: "Completed" }], medicalFitness: "Fit", lastCheckup: "2026-03-10", nextCheckup: "2027-03-10", bloodPressure: "118/76", bloodSugar: "88", bmi: 22.1, exposureIncidents: 1, healthClearance: true },
  { id: "HLT-003", employeeId: "EMP-002", employeeName: "Dr. Priya Sharma", department: "Emergency", vaccinations: [{ name: "Hepatitis B", date: "2022-07-01", nextDue: "2027-07-01", status: "Completed" }, { name: "Influenza", date: "2025-12-10", nextDue: "2026-12-10", status: "Completed" }], medicalFitness: "Fit", lastCheckup: "2026-02-20", nextCheckup: "2027-02-20", bloodPressure: "122/78", bloodSugar: "92", bmi: 23.5, exposureIncidents: 2, healthClearance: true },
  { id: "HLT-004", employeeId: "EMP-006", employeeName: "Nurse Lakshmi Iyer", department: "Pediatrics", vaccinations: [{ name: "Hepatitis B", date: "2023-03-15", nextDue: "2028-03-15", status: "Completed" }, { name: "Influenza", date: "2025-12-05", nextDue: "2026-12-05", status: "Completed" }, { name: "MMR", date: "2023-03-15", nextDue: "2028-03-15", status: "Completed" }], medicalFitness: "Conditional", lastCheckup: "2026-04-05", nextCheckup: "2026-10-05", bloodPressure: "130/85", bloodSugar: "102", bmi: 27.3, exposureIncidents: 0, healthClearance: true },
];

/* ── Incidents ────────────────────────────────────────────────────────────── */
export interface Incident {
  id: string;
  type: IncidentType;
  severity: IncidentSeverity;
  date: string;
  time: string;
  location: string;
  department: string;
  reportedBy: string;
  reportedById: string;
  description: string;
  injured?: string;
  injuredId?: string;
  status: IncidentStatus;
  investigationNotes?: string;
  correctiveActions?: string[];
  witnesses: string[];
}

export const INCIDENTS: Incident[] = [
  { id: "INC-001", type: "Needlestick", severity: "Major", date: "2026-07-20", time: "14:30", location: "ICU Bed 5", department: "ICU", reportedBy: "Nurse Ananya Desai", reportedById: "EMP-003", description: "Needlestick injury during blood draw from Hepatitis B positive patient. Needle went through double gloving.", injured: "Nurse Ananya Desai", injuredId: "EMP-003", status: "Investigating", investigationNotes: "Hepatitis B status of source patient confirmed positive. PEP initiated within 1 hour. Baseline serology done.", correctiveActions: ["Double-gloving protocol review", "Safety needle procurement", "Staff retraining"], witnesses: ["Nurse Priya Jha"] },
  { id: "INC-002", type: "Workplace Injury", severity: "Minor", date: "2026-07-18", time: "09:15", location: "Pharmacy Store", department: "Pharmacy", reportedBy: "Ravi Shankar", reportedById: "EMP-005", description: "Slip on wet floor while retrieving stock. Minor sprain to right ankle.", injured: "Ravi Shankar", injuredId: "EMP-005", status: "Resolved", correctiveActions: ["Wet floor sign placement improved", "Anti-slip mats installed"], witnesses: ["Amit Deshmukh"] },
  { id: "INC-003", type: "Exposure", severity: "Major", date: "2026-07-15", time: "22:45", location: "Emergency Bay 3", department: "Emergency", reportedBy: "Dr. Priya Sharma", reportedById: "EMP-002", description: "Splash of blood and body fluids to face during emergency intubation of trauma patient. Face shield was not worn.", injured: "Dr. Priya Sharma", injuredId: "EMP-002", status: "Closed", investigationNotes: "PPE compliance gap identified. Face shield was available but not used during rushed intubation.", correctiveActions: ["PPE compliance audit", "Emergency bay PPE checklist", "Mandatory face shield during intubation"], witnesses: ["Nurse Deepa Nair"] },
  { id: "INC-004", type: "Violence", severity: "Critical", date: "2026-07-12", time: "16:20", location: "Reception", department: "Reception", reportedBy: "Sneha Patil", reportedById: "EMP-009", description: "Patient attendant verbally abused and threatened front desk staff over billing dispute. Physical intimidation observed.", injured: "Sneha Patil", injuredId: "EMP-009", status: "Closed", investigationNotes: "Security responded within 2 minutes. Patient attendant issued warning. CCTV footage reviewed.", correctiveActions: ["Security presence increased at reception", "Panic button installation", "De-escalation training"], witnesses: ["Neha Kapoor", "Security Guard Raju"] },
  { id: "INC-005", type: "Near Miss", severity: "Near Miss", date: "2026-07-10", time: "11:00", location: "OT 2", department: "Operation Theater", reportedBy: "Dr. Suresh Kumar", reportedById: "EMP-004", description: "Wrong patient file brought to OT for scheduled surgery. Wrong site surgery prevented by surgeon timeout verification.", status: "Closed", correctiveActions: ["Patient verification process reinforced", "OT checklist updated"], witnesses: ["Nurse Kavita Iyer", "OT Technician"] },
];

/* ── Exit Management ──────────────────────────────────────────────────────── */
export interface ExitRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  designation: string;
  type: ExitType;
  lastWorkingDay: string;
  noticeDate: string;
  reason: string;
  status: "Initiated" | "Clearance In Progress" | "Settlement Pending" | "Completed";
  clearance: { IT: boolean; Library: boolean; Admin: boolean; Finance: boolean; HR: boolean; };
  assetsReturned: string[];
  knowledgeTransfer: boolean;
  exitInterviewDone: boolean;
  finalSettlement: number;
  experienceLetter: boolean;
}

export const EXITS: ExitRecord[] = [
  { id: "EXT-001", employeeId: "EMP-016", employeeName: "Dr. Fatima Khan", department: "Pediatrics", designation: "Consultant Pediatrician", type: "Resignation", lastWorkingDay: "2026-08-21", noticeDate: "2026-06-23", reason: "Relocating to Bangalore for family reasons", status: "Clearance In Progress", clearance: { IT: true, Library: false, Admin: true, Finance: false, HR: true }, assetsReturned: ["Laptop", "ID Card"], knowledgeTransfer: true, exitInterviewDone: true, finalSettlement: 0, experienceLetter: true },
];

/* ── Onboarding ───────────────────────────────────────────────────────────── */
export interface OnboardingRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  designation: string;
  dateOfJoining: string;
  reportingManager: string;
  status: OnboardingStatus;
  checklist: { item: string; done: boolean; dueBy?: string; completedDate?: string; }[];
  itAssets: string[];
  emailCreated: boolean;
  orientationDate: string;
  completionDate?: string;
}

export const ONBOARDINGS: OnboardingRecord[] = [
  { id: "ONB-001", employeeId: "EMP-007", employeeName: "Amit Deshmukh", department: "Laboratory", designation: "Lab Technician", dateOfJoining: "2024-01-15", reportingManager: "Dr. Neha Gupta", status: "Completed", checklist: [{ item: "Offer Letter Accepted", done: true, completedDate: "2024-01-10" }, { item: "Background Verification", done: true, completedDate: "2024-01-12" }, { item: "Document Submission", done: true, completedDate: "2024-01-15" }, { item: "IT Asset Allocation", done: true, completedDate: "2024-01-15" }, { item: "Email Creation", done: true, completedDate: "2024-01-15" }, { item: "Orientation", done: true, completedDate: "2024-01-16" }, { item: "Department Introduction", done: true, completedDate: "2024-01-16" }, { item: "Probation Review", done: true, completedDate: "2024-07-15" }], itAssets: ["Desktop PC", "Microscope Access Card"], emailCreated: true, orientationDate: "2024-01-16", completionDate: "2024-01-16" },
  { id: "ONB-002", employeeId: "EMP-017", employeeName: "Manoj Tiwari", department: "Housekeeping", designation: "Housekeeping Supervisor", dateOfJoining: "2025-01-15", reportingManager: "Suresh Naik", status: "Completed", checklist: [{ item: "Offer Letter Accepted", done: true, completedDate: "2025-01-10" }, { item: "Document Submission", done: true, completedDate: "2025-01-15" }, { item: "Orientation", done: true, completedDate: "2025-01-16" }, { item: "Department Introduction", done: true, completedDate: "2025-01-16" }], itAssets: [], emailCreated: false, orientationDate: "2025-01-16", completionDate: "2025-01-16" },
];

/* ── HR KPIs ──────────────────────────────────────────────────────────────── */
export const HR_KPI = {
  totalEmployees: 658,
  doctors: 142,
  nurses: 285,
  supportStaff: 231,
  openPositions: 14,
  attendanceToday: 89.2,
  pendingLeaves: 8,
  expiringLicenses: 5,
  expiringSoon: 12,
  upcomingTrainings: 4,
  avgTenure: 4.2,
  turnoverRate: 8.3,
  absenteeismRate: 3.7,
  trainingCompliance: 87,
  credentialCompliance: 91,
  employeeSatisfaction: 4.2,
  avgSalary: 82000,
  totalPayroll: 54000000,
  vacantPositions: 14,
  probationEmployees: 3,
};

/* ── Helpers ──────────────────────────────────────────────────────────────── */
export function empStatusTone(s: EmploymentStatus): "success" | "warning" | "danger" | "info" {
  switch (s) { case "Active": return "success"; case "Probation": return "info"; case "On Notice": return "warning"; case "On Leave": return "info"; case "Terminated": case "Suspended": return "danger"; default: return "neutral"; }
}
export function leaveStatusTone(s: LeaveStatus): "success" | "warning" | "danger" | "info" {
  switch (s) { case "Approved": return "success"; case "Pending": return "warning"; case "Rejected": return "danger"; default: return "info"; }
}
export function payrollStatusTone(s: PayrollStatus): "success" | "warning" | "danger" | "info" {
  switch (s) { case "Paid": case "Processed": return "success"; case "Processing": return "info"; case "Draft": return "warning"; default: return "info"; }
}
export function trainingStatusTone(s: TrainingStatus): "success" | "warning" | "danger" | "info" {
  switch (s) { case "Completed": return "success"; case "In Progress": case "Enrolled": return "info"; case "Overdue": return "danger"; default: return "warning"; }
}
export function performanceRatingTone(r: PerformanceRating): "success" | "warning" | "danger" | "info" {
  switch (r) { case "Exceptional": case "Exceeds": return "success"; case "Meets": return "info"; case "Needs Improvement": return "warning"; default: return "danger"; }
}
export function incidentSeverityTone(s: IncidentSeverity): "success" | "warning" | "danger" | "info" {
  switch (s) { case "Critical": return "danger"; case "Major": return "danger"; case "Minor": return "warning"; default: return "info"; }
}
export function incidentStatusTone(s: IncidentStatus): "success" | "warning" | "danger" | "info" {
  switch (s) { case "Closed": case "Resolved": return "success"; case "Investigating": return "warning"; default: return "danger"; }
}
export function credentialStatusTone(s: string): "success" | "warning" | "danger" | "info" {
  switch (s) { case "Valid": return "success"; case "Expiring Soon": return "warning"; case "Expired": return "danger"; default: return "info"; }
}
export function applicationStatusTone(s: ApplicationStatus): "success" | "warning" | "danger" | "info" {
  switch (s) { case "Hired": return "success"; case "Offer": return "info"; case "Interview": return "info"; case "Rejected": return "danger"; case "Withdrawn": return "warning"; default: return "warning"; }
}
export function jobStatusTone(s: JobStatus): "success" | "warning" | "danger" | "info" {
  switch (s) { case "Open": return "success"; case "Filled": return "info"; case "On Hold": return "warning"; default: return "danger"; }
}
export function formatCurrency(n: number): string { return `₹${(n / 1000).toFixed(1)}K`; }
export function formatCurrencyFull(n: number): string { return n >= 100000 ? `₹${(n / 100000).toFixed(1)}L` : `₹${n.toLocaleString("en-IN")}`; }
export function timeAgo(ts: string): string {
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}
