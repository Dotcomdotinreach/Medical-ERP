/* ------------------------------------------------------------------ */
/* Realistic mock hospital data for Meridian Multi-Speciality Hospital */
/* ------------------------------------------------------------------ */

export type PatientStatus = "OPD" | "IPD" | "Emergency" | "Discharged";
export type Gender = "Male" | "Female" | "Other";

export interface Patient {
  uhid: string;
  first: string;
  last: string;
  gender: Gender;
  dob: string;        // ISO
  age: number;
  blood: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  aadhaar: string;
  insurance: string;
  emergencyContact: string;
  emergencyRelation: string;
  status: PatientStatus;
  lastVisit: string;
  conditions: string[];
  allergies: string[];
}

export const DEPARTMENTS = [
  "General Medicine", "Cardiology", "Orthopaedics", "Paediatrics", "Gynaecology",
  "Neurology", "Dermatology", "ENT", "Ophthalmology", "Gastroenterology",
  "Nephrology", "Pulmonology", "Psychiatry", "Emergency Medicine",
];

export interface Doctor {
  id: string;
  name: string;
  dept: string;
  qualification: string;
  available: boolean;
  room: string;
  fee: number;
}

export const DOCTORS: Doctor[] = [
  { id: "D-101", name: "Dr. Arjun Mehta", dept: "Cardiology", qualification: "MD, DM (Cardiology)", available: true, room: "C-204", fee: 800 },
  { id: "D-102", name: "Dr. Kavya Nair", dept: "General Medicine", qualification: "MBBS, MD", available: true, room: "G-110", fee: 500 },
  { id: "D-103", name: "Dr. Rohan Deshmukh", dept: "Orthopaedics", qualification: "MS (Ortho)", available: false, room: "O-305", fee: 700 },
  { id: "D-104", name: "Dr. Sneha Iyer", dept: "Paediatrics", qualification: "MD (Paediatrics)", available: true, room: "P-101", fee: 600 },
  { id: "D-105", name: "Dr. Vikram Rao", dept: "Neurology", qualification: "DM (Neurology)", available: true, room: "N-402", fee: 1000 },
  { id: "D-106", name: "Dr. Ananya Gupta", dept: "Gynaecology", qualification: "MS (OBG)", available: false, room: "GY-208", fee: 700 },
  { id: "D-107", name: "Dr. Imran Sheikh", dept: "Emergency Medicine", qualification: "MD (Emergency)", available: true, room: "ER-01", fee: 0 },
  { id: "D-108", name: "Dr. Priya Malhotra", dept: "Dermatology", qualification: "MD (Dermatology)", available: true, room: "DM-102", fee: 600 },
  { id: "D-109", name: "Dr. Rajesh Kulkarni", dept: "ENT", qualification: "MS (ENT)", available: true, room: "ENT-201", fee: 500 },
  { id: "D-110", name: "Dr. Nisha Sharma", dept: "Ophthalmology", qualification: "MS (Ophthalmology)", available: true, room: "EYE-103", fee: 700 },
  { id: "D-111", name: "Dr. Sanjay Patil", dept: "Gastroenterology", qualification: "DM (Gastro)", available: true, room: "GAS-301", fee: 900 },
  { id: "D-112", name: "Dr. Meera Joshi", dept: "Nephrology", qualification: "DM (Nephrology)", available: false, room: "NEPH-204", fee: 1000 },
  { id: "D-113", name: "Dr. Amit Verma", dept: "Pulmonology", qualification: "MD (Pulmonology)", available: true, room: "PUL-105", fee: 700 },
  { id: "D-114", name: "Dr. Seema Kapoor", dept: "Psychiatry", qualification: "MD (Psychiatry)", available: true, room: "PSY-102", fee: 800 },
];

export const PATIENTS: Patient[] = [
  { uhid: "MRD-2026-004821", first: "Rajesh", last: "Kumar", gender: "Male", dob: "1979-05-12", age: 47, blood: "B+",
    phone: "+91 98201 44582", email: "rajesh.kumar@gmail.com", address: "14, Shivaji Nagar, Baner Road", city: "Pune", state: "Maharashtra",
    aadhaar: "XXXX XXXX 4821", insurance: "Star Health – Family Optima", emergencyContact: "+91 98201 90011", emergencyRelation: "Wife",
    status: "IPD", lastVisit: "2026-07-20", conditions: ["Hypertension", "Type 2 Diabetes"], allergies: ["Penicillin"] },
  { uhid: "MRD-2026-004822", first: "Meena", last: "Patil", gender: "Female", dob: "1991-11-03", age: 34, blood: "O+",
    phone: "+91 90284 33127", email: "meena.patil@outlook.com", address: "Flat 302, Green Meadows, Kothrud", city: "Pune", state: "Maharashtra",
    aadhaar: "XXXX XXXX 7734", insurance: "HDFC Ergo – Optima Secure", emergencyContact: "+91 90284 88190", emergencyRelation: "Husband",
    status: "OPD", lastVisit: "2026-07-22", conditions: ["Hypothyroidism"], allergies: [] },
  { uhid: "MRD-2026-004823", first: "Aarav", last: "Sharma", gender: "Male", dob: "2019-02-18", age: 7, blood: "A+",
    phone: "+91 99870 11245", email: "sharma.family@gmail.com", address: "22, Lake View Residency, Hinjewadi", city: "Pune", state: "Maharashtra",
    aadhaar: "XXXX XXXX 1120", insurance: "None", emergencyContact: "+91 99870 11246", emergencyRelation: "Father",
    status: "OPD", lastVisit: "2026-07-21", conditions: ["Asthma"], allergies: ["Dust mites"] },
  { uhid: "MRD-2026-004824", first: "Lakshmi", last: "Iyer", gender: "Female", dob: "1955-08-29", age: 70, blood: "AB+",
    phone: "+91 94220 56701", email: "l.iyer55@gmail.com", address: "8, Brahmin Colony, Sadashiv Peth", city: "Pune", state: "Maharashtra",
    aadhaar: "XXXX XXXX 9902", insurance: "Senior Citizen Mediclaim", emergencyContact: "+91 94220 56702", emergencyRelation: "Son",
    status: "Emergency", lastVisit: "2026-07-22", conditions: ["Coronary Artery Disease", "Osteoarthritis"], allergies: ["Sulfa drugs"] },
  { uhid: "MRD-2026-004825", first: "Mohammed", last: "Ansari", gender: "Male", dob: "1988-01-07", age: 38, blood: "O-",
    phone: "+91 98765 43210", email: "m.ansari@yahoo.com", address: "45, Camp Area, MG Road", city: "Pune", state: "Maharashtra",
    aadhaar: "XXXX XXXX 3345", insurance: "ICICI Lombard – Complete Health", emergencyContact: "+91 98765 43211", emergencyRelation: "Brother",
    status: "Discharged", lastVisit: "2026-07-15", conditions: ["Fractured tibia"], allergies: [] },
  { uhid: "MRD-2026-004826", first: "Sunita", last: "Reddy", gender: "Female", dob: "1972-06-21", age: 54, blood: "B-",
    phone: "+91 90000 12345", email: "sunita.reddy@gmail.com", address: "19, Jubilee Hills Road No 3", city: "Hyderabad", state: "Telangana",
    aadhaar: "XXXX XXXX 6678", insurance: "Aditya Birla Activ Health", emergencyContact: "+91 90000 12346", emergencyRelation: "Daughter",
    status: "OPD", lastVisit: "2026-07-19", conditions: ["Migraine"], allergies: ["Aspirin"] },
];

export type QueueState = "Waiting" | "Called" | "In Consultation" | "Completed" | "Skipped";
export interface QueueEntry {
  token: string;
  patient: string;
  uhid: string;
  doctor: string;
  dept: string;
  state: QueueState;
  priority: "Normal" | "Priority" | "Emergency";
  waitMins: number;
}

export const QUEUE: QueueEntry[] = [
  { token: "A-018", patient: "Meena Patil", uhid: "MRD-2026-004822", doctor: "Dr. Kavya Nair", dept: "General Medicine", state: "In Consultation", priority: "Normal", waitMins: 0 },
  { token: "A-019", patient: "Sunita Reddy", uhid: "MRD-2026-004826", doctor: "Dr. Kavya Nair", dept: "General Medicine", state: "Called", priority: "Normal", waitMins: 2 },
  { token: "C-007", patient: "Rajesh Kumar", uhid: "MRD-2026-004821", doctor: "Dr. Arjun Mehta", dept: "Cardiology", state: "Waiting", priority: "Priority", waitMins: 12 },
  { token: "P-004", patient: "Aarav Sharma", uhid: "MRD-2026-004823", doctor: "Dr. Sneha Iyer", dept: "Paediatrics", state: "Waiting", priority: "Normal", waitMins: 18 },
  { token: "ER-02", patient: "Lakshmi Iyer", uhid: "MRD-2026-004824", doctor: "Dr. Imran Sheikh", dept: "Emergency Medicine", state: "Called", priority: "Emergency", waitMins: 0 },
  { token: "A-020", patient: "Ganesh More", uhid: "MRD-2026-004830", doctor: "Dr. Kavya Nair", dept: "General Medicine", state: "Waiting", priority: "Normal", waitMins: 25 },
  { token: "C-008", patient: "Deepak Joshi", uhid: "MRD-2026-004831", doctor: "Dr. Arjun Mehta", dept: "Cardiology", state: "Completed", priority: "Normal", waitMins: 0 },
];

export type BedState = "Available" | "Occupied" | "Cleaning" | "Reserved";
export interface Bed {
  id: string;
  ward: string;
  type: string;
  state: BedState;
  patient?: string;
}

export const WARDS = ["General Ward A", "General Ward B", "ICU", "Private Rooms", "Maternity", "Paediatric Ward"];

export const BEDS: Bed[] = [
  { id: "GA-01", ward: "General Ward A", type: "General", state: "Occupied", patient: "Rajesh Kumar" },
  { id: "GA-02", ward: "General Ward A", type: "General", state: "Available" },
  { id: "GA-03", ward: "General Ward A", type: "General", state: "Cleaning" },
  { id: "GA-04", ward: "General Ward A", type: "General", state: "Occupied", patient: "Suresh Pawar" },
  { id: "GA-05", ward: "General Ward A", type: "General", state: "Available" },
  { id: "GA-06", ward: "General Ward A", type: "General", state: "Reserved" },
  { id: "IC-01", ward: "ICU", type: "ICU", state: "Occupied", patient: "Lakshmi Iyer" },
  { id: "IC-02", ward: "ICU", type: "ICU", state: "Available" },
  { id: "IC-03", ward: "ICU", type: "ICU", state: "Occupied", patient: "Anil Kulkarni" },
  { id: "IC-04", ward: "ICU", type: "ICU", state: "Cleaning" },
  { id: "PR-01", ward: "Private Rooms", type: "Deluxe", state: "Occupied", patient: "Mohammed Ansari" },
  { id: "PR-02", ward: "Private Rooms", type: "Deluxe", state: "Available" },
  { id: "PR-03", ward: "Private Rooms", type: "Suite", state: "Reserved" },
  { id: "MT-01", ward: "Maternity", type: "General", state: "Occupied", patient: "Pooja Salunkhe" },
  { id: "MT-02", ward: "Maternity", type: "General", state: "Available" },
  { id: "PD-01", ward: "Paediatric Ward", type: "General", state: "Available" },
];

export interface Registration {
  uhid: string;
  name: string;
  type: string;
  dept: string;
  time: string;
  amount: number;
}

export const RECENT_REGISTRATIONS: Registration[] = [
  { uhid: "MRD-2026-004826", name: "Sunita Reddy", type: "OPD", dept: "Neurology", time: "10:42 AM", amount: 1000 },
  { uhid: "MRD-2026-004825", name: "Mohammed Ansari", type: "IPD", dept: "Orthopaedics", time: "10:18 AM", amount: 700 },
  { uhid: "MRD-2026-004824", name: "Lakshmi Iyer", type: "Emergency", dept: "Emergency Medicine", time: "09:55 AM", amount: 0 },
  { uhid: "MRD-2026-004823", name: "Aarav Sharma", type: "OPD", dept: "Paediatrics", time: "09:30 AM", amount: 600 },
  { uhid: "MRD-2026-004822", name: "Meena Patil", type: "OPD", dept: "General Medicine", time: "09:12 AM", amount: 500 },
];

/** Hourly OPD footfall for the dashboard chart. */
export const FOOTFALL = [
  { hour: "8 AM", patients: 12 },
  { hour: "9 AM", patients: 34 },
  { hour: "10 AM", patients: 48 },
  { hour: "11 AM", patients: 41 },
  { hour: "12 PM", patients: 29 },
  { hour: "1 PM", patients: 18 },
  { hour: "2 PM", patients: 26 },
  { hour: "3 PM", patients: 37 },
  { hour: "4 PM", patients: 22 },
];

export function generateUHID(): string {
  const n = 4827 + Math.floor(Math.random() * 900);
  return `MRD-2026-00${n}`;
}
