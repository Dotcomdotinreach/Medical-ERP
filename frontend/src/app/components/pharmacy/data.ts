/* ------------------------------------------------------------------ */
/* Realistic mock pharmacy data for Meridian Multi-Speciality Hospital  */
/* ------------------------------------------------------------------ */

export type PrescriptionStatus = "Pending" | "Verified" | "Dispensing" | "Dispensed" | "Billed" | "Delivered" | "Cancelled";
export type MedicationStatus = "In Stock" | "Low Stock" | "Out of Stock" | "Expired" | "Quarantine" | "Reserved";
export type DrugSchedule = "H" | "H1" | "X" | "N/A";
export type ReturnStatus = "Pending" | "Accepted" | "Rejected" | "Disposed" | "Restocked";
export type POStatus = "Draft" | "Pending Approval" | "Approved" | "Ordered" | "Received" | "Cancelled";
export type InsuranceStatus = "Pending" | "Approved" | "Partial" | "Rejected" | "Claimed";

export interface Prescription {
  rxId: string;
  patientName: string;
  uhid: string;
  age: number;
  gender: "Male" | "Female";
  orderingDoctor: string;
  department: string;
  priority: "Routine" | "Urgent" | "STAT";
  rxTime: string;
  status: PrescriptionStatus;
  medications: Medication[];
  allergies: string[];
  clinicalNotes: string;
  insurance: string;
  totalAmount: number;
}

export interface Medication {
  id: string;
  genericName: string;
  brandName: string;
  manufacturer: string;
  strength: string;
  dosageForm: string;
  quantity: number;
  frequency: string;
  duration: string;
  route: string;
  instructions: string;
  schedule: DrugSchedule;
  unitPrice: number;
  totalPrice: number;
  batchNumber: string;
  expiryDate: string;
  rackLocation: string;
}

export interface StockItem {
  id: string;
  genericName: string;
  brandName: string;
  manufacturer: string;
  strength: string;
  dosageForm: string;
  schedule: DrugSchedule;
  batchNumber: string;
  lotNumber: string;
  expiryDate: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unitPrice: number;
  mrp: number;
  rackLocation: string;
  supplier: string;
  lastReceived: string;
  status: MedicationStatus;
}

export interface Supplier {
  id: string;
  name: string;
  contact: string;
  email: string;
  address: string;
  city: string;
  rating: number;
  leadTime: string;
  lastOrder: string;
  totalOrders: number;
  paymentTerms: string;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  detail: string;
  rxId?: string;
  patientName?: string;
  ipAddress: string;
}

/* ------------------------------------------------------------------ */
/* Medicines data                                                      */
/* ------------------------------------------------------------------ */

export const MEDICATIONS: Medication[] = [
  { id: "MED-001", genericName: "Paracetamol", brandName: "Crocin 650", manufacturer: "GlaxoSmithKline", strength: "650 mg", dosageForm: "Tablet", quantity: 30, frequency: "TID", duration: "5 days", route: "Oral", instructions: "Take after food", schedule: "N/A", unitPrice: 2.5, totalPrice: 75, batchNumber: "BAT-2026-0891", expiryDate: "2027-06-30", rackLocation: "A-01-03" },
  { id: "MED-002", genericName: "Amoxicillin", brandName: "Amoxicillin 500", manufacturer: "Cipla", strength: "500 mg", dosageForm: "Capsule", quantity: 21, frequency: "TID", duration: "7 days", route: "Oral", instructions: "Take with water, complete full course", schedule: "N/A", unitPrice: 8.5, totalPrice: 178.5, batchNumber: "BAT-2026-0755", expiryDate: "2027-03-15", rackLocation: "A-02-01" },
  { id: "MED-003", genericName: "Pantoprazole", brandName: "Pantocid 40", manufacturer: "Alkem", strength: "40 mg", dosageForm: "Tablet", quantity: 14, frequency: "OD", duration: "14 days", route: "Oral", instructions: "Take 30 min before breakfast", schedule: "N/A", unitPrice: 5.2, totalPrice: 72.8, batchNumber: "BAT-2026-0622", expiryDate: "2027-09-30", rackLocation: "A-01-05" },
  { id: "MED-004", genericName: "Metformin", brandName: "Glycomet 500", manufacturer: "USV", strength: "500 mg", dosageForm: "Tablet", quantity: 60, frequency: "BID", duration: "30 days", route: "Oral", instructions: "Take with meals", schedule: "N/A", unitPrice: 3.8, totalPrice: 228, batchNumber: "BAT-2026-0534", expiryDate: "2027-12-31", rackLocation: "A-03-02" },
  { id: "MED-005", genericName: "Insulin Glargine", brandName: "Lantus SoloStar", manufacturer: "Sanofi", strength: "100 IU/mL", dosageForm: "Injection", quantity: 5, frequency: "OD", duration: "30 days", route: "Subcutaneous", instructions: "Inject subcutaneously at same time daily", schedule: "N/A", unitPrice: 1420, totalPrice: 7100, batchNumber: "BAT-2026-1102", expiryDate: "2027-04-30", rackLocation: "C-01-01" },
  { id: "MED-006", genericName: "Ceftriaxone", brandName: "Ceftriaxone 1g", manufacturer: "Lupin", strength: "1 g", dosageForm: "Injection", quantity: 10, frequency: "OD", duration: "5 days", route: "IV", instructions: "Reconstitute with 10mL sterile water. Infuse over 30 min.", schedule: "N/A", unitPrice: 85, totalPrice: 850, batchNumber: "BAT-2026-0988", expiryDate: "2027-08-15", rackLocation: "B-02-01" },
  { id: "MED-007", genericName: "Meropenem", brandName: "Meropenem 1g", manufacturer: "Cipla", strength: "1 g", dosageForm: "Injection", quantity: 3, frequency: "TID", duration: "3 days", route: "IV", instructions: "Infuse over 3 hours. Administer within 1 hour of reconstitution.", schedule: "N/A", unitPrice: 680, totalPrice: 6120, batchNumber: "BAT-2026-1205", expiryDate: "2027-01-30", rackLocation: "B-02-03" },
  { id: "MED-008", genericName: "Ondansetron", brandName: "Emeset 4", manufacturer: "Cipla", strength: "4 mg", dosageForm: "Tablet", quantity: 10, frequency: "PRN", duration: "5 days", route: "Oral", instructions: "Take 30 min before chemotherapy", schedule: "N/A", unitPrice: 6.5, totalPrice: 65, batchNumber: "BAT-2026-0812", expiryDate: "2027-05-31", rackLocation: "A-04-01" },
  { id: "MED-009", genericName: "Salbutamol", brandName: "Asthalin Inhaler", manufacturer: "Cipla", strength: "100 mcg/dose", dosageForm: "Inhaler", quantity: 1, frequency: "PRN", duration: "30 days", route: "Inhalation", instructions: "Shake well, 2 puffs as needed for breathlessness", schedule: "N/A", unitPrice: 125, totalPrice: 125, batchNumber: "BAT-2026-0744", expiryDate: "2027-11-30", rackLocation: "D-01-01" },
  { id: "MED-010", genericName: "Heparin", brandName: "Heparin 5000 IU", manufacturer: "Pfizer", strength: "5000 IU/mL", dosageForm: "Injection", quantity: 10, frequency: "BID", duration: "5 days", route: "Subcutaneous", instructions: "Inject subcutaneously in abdomen. Rotate sites.", schedule: "H", unitPrice: 95, totalPrice: 950, batchNumber: "BAT-2026-1055", expiryDate: "2027-02-28", rackLocation: "B-01-02" },
  { id: "MED-011", genericName: "Morphine", brandName: "Morphine 10 mg", manufacturer: "CDSCO", strength: "10 mg/mL", dosageForm: "Injection", quantity: 2, frequency: "Q4H", duration: "PRN", route: "IV", instructions: "For severe pain. Controlled substance — dual authorization required.", schedule: "H", unitPrice: 45, totalPrice: 90, batchNumber: "BAT-2026-1301", expiryDate: "2027-07-31", rackLocation: "E-01-01" },
  { id: "MED-012", genericName: "Diclofenac", brandName: "Voltaren 50", manufacturer: "Novartis", strength: "50 mg", dosageForm: "Tablet", quantity: 30, frequency: "BID", duration: "15 days", route: "Oral", instructions: "Take after food. Avoid if history of GI bleeding.", schedule: "N/A", unitPrice: 3.2, totalPrice: 96, batchNumber: "BAT-2026-0698", expiryDate: "2027-10-31", rackLocation: "A-02-04" },
];

/* ------------------------------------------------------------------ */
/* Prescriptions                                                       */
/* ------------------------------------------------------------------ */

export const PRESCRIPTIONS: Prescription[] = [
  {
    rxId: "RX-2026-0722-001", patientName: "Rajesh Kumar", uhid: "MRD-2026-004821", age: 47, gender: "Male",
    orderingDoctor: "Dr. Arjun Mehta", department: "Cardiology", priority: "Urgent", rxTime: "08:30 AM",
    status: "Verified", medications: MEDICATIONS.slice(0, 4),
    allergies: ["Penicillin"], clinicalNotes: "Post-angioplasty. Start dual antiplatelet therapy. Monitor blood sugar.",
    insurance: "Star Health — Family Optima", totalAmount: 554.3,
  },
  {
    rxId: "RX-2026-0722-002", patientName: "Meena Patil", uhid: "MRD-2026-004822", age: 34, gender: "Female",
    orderingDoctor: "Dr. Kavya Nair", department: "General Medicine", priority: "Routine", rxTime: "09:15 AM",
    status: "Dispensing", medications: [MEDICATIONS[2], MEDICATIONS[7]],
    allergies: [], clinicalNotes: "Hypothyroidism — continue current medication. GERD symptomatic.",
    insurance: "HDFC Ergo — Optima Secure", totalAmount: 137.8,
  },
  {
    rxId: "RX-2026-0722-003", patientName: "Aarav Sharma", uhid: "MRD-2026-004823", age: 7, gender: "Male",
    orderingDoctor: "Dr. Sneha Iyer", department: "Paediatrics", priority: "STAT", rxTime: "09:45 AM",
    status: "Pending", medications: [MEDICATIONS[0], MEDICATIONS[1]],
    allergies: ["Dust mites"], clinicalNotes: "Acute exacerbation of asthma. Start antibiotics for secondary infection.",
    insurance: "None", totalAmount: 253.5,
  },
  {
    rxId: "RX-2026-0722-004", patientName: "Lakshmi Iyer", uhid: "MRD-2026-004824", age: 70, gender: "Female",
    orderingDoctor: "Dr. Imran Sheikh", department: "Emergency Medicine", priority: "STAT", rxTime: "10:00 AM",
    status: "Pending", medications: [MEDICATIONS[4], MEDICATIONS[5], MEDICATIONS[9]],
    allergies: ["Sulfa drugs"], clinicalNotes: "Acute coronary syndrome. Start heparin drip. Insulin for stress hyperglycemia.",
    insurance: "Senior Citizen Mediclaim", totalAmount: 8900,
  },
  {
    rxId: "RX-2026-0722-005", patientName: "Sunita Reddy", uhid: "MRD-2026-004826", age: 54, gender: "Female",
    orderingDoctor: "Dr. Vikram Rao", department: "Neurology", priority: "Routine", rxTime: "10:30 AM",
    status: "Pending", medications: [MEDICATIONS[11], MEDICATIONS[2]],
    allergies: ["Aspirin"], clinicalNotes: "Migraine prophylaxis. Continue pantoprazole for gastritis.",
    insurance: "Aditya Birla Activ Health", totalAmount: 168.8,
  },
  {
    rxId: "RX-2026-0722-006", patientName: "Ganesh More", uhid: "MRD-2026-004830", age: 62, gender: "Male",
    orderingDoctor: "Dr. Kavya Nair", department: "General Medicine", priority: "Routine", rxTime: "11:00 AM",
    status: "Pending", medications: [MEDICATIONS[3], MEDICATIONS[2]],
    allergies: [], clinicalNotes: "Type 2 DM — uncontrolled. Increase metformin. Add PPI for gastric protection.",
    insurance: "New India Assurance", totalAmount: 300.8,
  },
  {
    rxId: "RX-2026-0722-007", patientName: "Deepak Joshi", uhid: "MRD-2026-004831", age: 41, gender: "Male",
    orderingDoctor: "Dr. Arjun Mehta", department: "Cardiology", priority: "Urgent", rxTime: "11:30 AM",
    status: "Pending", medications: [MEDICATIONS[0], MEDICATIONS[2], MEDICATIONS[3]],
    allergies: [], clinicalNotes: "Post-angiography. Continue dual antiplatelet. Monitor renal function.",
    insurance: "ICICI Lombard — Complete Health", totalAmount: 401.6,
  },
  {
    rxId: "RX-2026-0722-008", patientName: "Anil Kulkarni", uhid: "MRD-2026-004833", age: 58, gender: "Male",
    orderingDoctor: "Dr. Imran Sheikh", department: "Emergency Medicine", priority: "STAT", rxTime: "12:15 PM",
    status: "Pending", medications: [MEDICATIONS[6], MEDICATIONS[5], MEDICATIONS[10]],
    allergies: [], clinicalNotes: "Sepsis. Start meropenem + ceftriaxone empiric. Morphine for pain.",
    insurance: "Star Health — Family Optima", totalAmount: 7060,
  },
];

/* ------------------------------------------------------------------ */
/* Stock inventory                                                     */
/* ------------------------------------------------------------------ */

export const STOCK: StockItem[] = [
  { id: "STK-001", genericName: "Paracetamol", brandName: "Crocin 650", manufacturer: "GlaxoSmithKline", strength: "650 mg", dosageForm: "Tablet", schedule: "N/A", batchNumber: "BAT-2026-0891", lotNumber: "LOT-0891", expiryDate: "2027-06-30", currentStock: 1200, minStock: 200, maxStock: 3000, unitPrice: 2.5, mrp: 3.5, rackLocation: "A-01-03", supplier: "MedPlus Pharma", lastReceived: "2026-07-10", status: "In Stock" },
  { id: "STK-002", genericName: "Amoxicillin", brandName: "Amoxicillin 500", manufacturer: "Cipla", strength: "500 mg", dosageForm: "Capsule", schedule: "N/A", batchNumber: "BAT-2026-0755", lotNumber: "LOT-0755", expiryDate: "2027-03-15", currentStock: 450, minStock: 100, maxStock: 2000, unitPrice: 8.5, mrp: 12, rackLocation: "A-02-01", supplier: "Alkem Labs", lastReceived: "2026-07-05", status: "In Stock" },
  { id: "STK-003", genericName: "Insulin Glargine", brandName: "Lantus SoloStar", manufacturer: "Sanofi", strength: "100 IU/mL", dosageForm: "Injection", schedule: "N/A", batchNumber: "BAT-2026-1102", lotNumber: "LOT-1102", expiryDate: "2027-04-30", currentStock: 8, minStock: 10, maxStock: 50, unitPrice: 1420, mrp: 1680, rackLocation: "C-01-01", supplier: "Sanofi India", lastReceived: "2026-07-15", status: "Low Stock" },
  { id: "STK-004", genericName: "Ceftriaxone", brandName: "Ceftriaxone 1g", manufacturer: "Lupin", strength: "1 g", dosageForm: "Injection", schedule: "N/A", batchNumber: "BAT-2026-0988", lotNumber: "LOT-0988", expiryDate: "2027-08-15", currentStock: 120, minStock: 30, maxStock: 200, unitPrice: 85, mrp: 110, rackLocation: "B-02-01", supplier: "Lupin Pharma", lastReceived: "2026-07-08", status: "In Stock" },
  { id: "STK-005", genericName: "Meropenem", brandName: "Meropenem 1g", manufacturer: "Cipla", strength: "1 g", dosageForm: "Injection", schedule: "N/A", batchNumber: "BAT-2026-1205", lotNumber: "LOT-1205", expiryDate: "2027-01-30", currentStock: 15, minStock: 20, maxStock: 100, unitPrice: 680, mrp: 850, rackLocation: "B-02-03", supplier: "Cipla Pharma", lastReceived: "2026-07-12", status: "Low Stock" },
  { id: "STK-006", genericName: "Morphine", brandName: "Morphine 10 mg", manufacturer: "CDSCO", strength: "10 mg/mL", dosageForm: "Injection", schedule: "H", batchNumber: "BAT-2026-1301", lotNumber: "LOT-1301", expiryDate: "2027-07-31", currentStock: 5, minStock: 2, maxStock: 20, unitPrice: 45, mrp: 60, rackLocation: "E-01-01", supplier: "Government Supply", lastReceived: "2026-07-01", status: "In Stock" },
  { id: "STK-007", genericName: "Heparin", brandName: "Heparin 5000 IU", manufacturer: "Pfizer", strength: "5000 IU/mL", dosageForm: "Injection", schedule: "H", batchNumber: "BAT-2026-1055", lotNumber: "LOT-1055", expiryDate: "2027-02-28", currentStock: 25, minStock: 15, maxStock: 80, unitPrice: 95, mrp: 120, rackLocation: "B-01-02", supplier: "Pfizer India", lastReceived: "2026-07-18", status: "In Stock" },
  { id: "STK-008", genericName: "Pantoprazole", brandName: "Pantocid 40", manufacturer: "Alkem", strength: "40 mg", dosageForm: "Tablet", schedule: "N/A", batchNumber: "BAT-2026-0622", lotNumber: "LOT-0622", expiryDate: "2027-09-30", currentStock: 800, minStock: 150, maxStock: 2000, unitPrice: 5.2, mrp: 7.5, rackLocation: "A-01-05", supplier: "Alkem Labs", lastReceived: "2026-07-10", status: "In Stock" },
  { id: "STK-009", genericName: "Metformin", brandName: "Glycomet 500", manufacturer: "USV", strength: "500 mg", dosageForm: "Tablet", schedule: "N/A", batchNumber: "BAT-2026-0534", lotNumber: "LOT-0534", expiryDate: "2027-12-31", currentStock: 2500, minStock: 300, maxStock: 5000, unitPrice: 3.8, mrp: 5.5, rackLocation: "A-03-02", supplier: "USV Pharma", lastReceived: "2026-07-01", status: "In Stock" },
  { id: "STK-010", genericName: "Ondansetron", brandName: "Emeset 4", manufacturer: "Cipla", strength: "4 mg", dosageForm: "Tablet", schedule: "N/A", batchNumber: "BAT-2026-0812", lotNumber: "LOT-0812", expiryDate: "2027-05-31", currentStock: 300, minStock: 50, maxStock: 1000, unitPrice: 6.5, mrp: 9, rackLocation: "A-04-01", supplier: "Cipla Pharma", lastReceived: "2026-07-05", status: "In Stock" },
  { id: "STK-011", genericName: "Diclofenac", brandName: "Voltaren 50", manufacturer: "Novartis", strength: "50 mg", dosageForm: "Tablet", schedule: "N/A", batchNumber: "BAT-2026-0698", lotNumber: "LOT-0698", expiryDate: "2025-10-31", currentStock: 500, minStock: 100, maxStock: 2000, unitPrice: 3.2, mrp: 4.8, rackLocation: "A-02-04", supplier: "Novartis India", lastReceived: "2026-06-15", status: "Expired" },
  { id: "STK-012", genericName: "Salbutamol", brandName: "Asthalin Inhaler", manufacturer: "Cipla", strength: "100 mcg/dose", dosageForm: "Inhaler", schedule: "N/A", batchNumber: "BAT-2026-0744", lotNumber: "LOT-0744", expiryDate: "2027-11-30", currentStock: 45, minStock: 10, maxStock: 100, unitPrice: 125, mrp: 165, rackLocation: "D-01-01", supplier: "Cipla Pharma", lastReceived: "2026-07-15", status: "In Stock" },
];

/* ------------------------------------------------------------------ */
/* Suppliers                                                           */
/* ------------------------------------------------------------------ */

export const SUPPLIERS: Supplier[] = [
  { id: "SUP-001", name: "MedPlus Pharma Distribution", contact: "+91 22 4567 8900", email: "orders@medplus.co.in", address: "14, Andheri Kurla Road", city: "Mumbai", rating: 4.5, leadTime: "2-3 days", lastOrder: "2026-07-10", totalOrders: 156, paymentTerms: "Net 30" },
  { id: "SUP-002", name: "Alkem Laboratories", contact: "+91 22 6218 5000", email: "pharma@alkem.co.in", address: "Alkem House, Senapati Bapat Marg", city: "Mumbai", rating: 4.3, leadTime: "3-5 days", lastOrder: "2026-07-08", totalOrders: 89, paymentTerms: "Net 45" },
  { id: "SUP-003", name: "Cipla Pharma Distribution", contact: "+91 22 2481 4444", email: "supply@cipla.com", address: "Cipla Ltd, Gulmohar Park", city: "Mumbai", rating: 4.7, leadTime: "1-2 days", lastOrder: "2026-07-12", totalOrders: 234, paymentTerms: "Net 30" },
  { id: "SUP-004", name: "Lupin Pharma", contact: "+91 22 6676 2000", email: "orders@lupinpharma.com", address: "Lupin Research Park, Pimpri", city: "Pune", rating: 4.4, leadTime: "2-4 days", lastOrder: "2026-07-05", totalOrders: 112, paymentTerms: "Net 30" },
  { id: "SUP-005", name: "Sanofi India", contact: "+91 22 2820 6000", email: "pharma@sanofi.in", address: "Sanofi House, C.T.S. 16290", city: "Mumbai", rating: 4.6, leadTime: "3-5 days", lastOrder: "2026-07-15", totalOrders: 67, paymentTerms: "Net 60" },
  { id: "SUP-006", name: "Pfizer India", contact: "+91 22 6693 5000", email: "supply@pfizer.co.in", address: "Pfizer Ltd, Vikhroli West", city: "Mumbai", rating: 4.8, leadTime: "2-3 days", lastOrder: "2026-07-18", totalOrders: 198, paymentTerms: "Net 45" },
];

/* ------------------------------------------------------------------ */
/* Audit logs                                                          */
/* ------------------------------------------------------------------ */

export const AUDIT_LOGS: AuditEntry[] = [
  { id: "AUD-001", timestamp: "2026-07-22 08:30:00", user: "Dr. Arjun Mehta", role: "Consultant", action: "Prescription Created", detail: "Rx for Rajesh Kumar — Aspirin, Atorvastatin, Pantoprazole, Metformin", rxId: "RX-2026-0722-001", patientName: "Rajesh Kumar", ipAddress: "10.0.1.101" },
  { id: "AUD-002", timestamp: "2026-07-22 08:35:00", user: "Priya Kulkarni", role: "Clinical Pharmacist", action: "Drug Interaction Check", detail: "No significant interactions detected. Allergy alert: Penicillin — no penicillin-class drugs prescribed.", rxId: "RX-2026-0722-001", patientName: "Rajesh Kumar", ipAddress: "10.0.5.501" },
  { id: "AUD-003", timestamp: "2026-07-22 08:40:00", user: "Priya Kulkarni", role: "Clinical Pharmacist", action: "Prescription Verified", detail: "Clinical validation complete. Prescriptions approved for dispensing.", rxId: "RX-2026-0722-001", patientName: "Rajesh Kumar", ipAddress: "10.0.5.501" },
  { id: "AUD-004", timestamp: "2026-07-22 09:00:00", user: "Rahul Deshmukh", role: "Dispensing Pharmacist", action: "Barcode Verification", detail: "Medicine barcode scanned — Paracetamol 650mg, Batch BAT-2026-0891 verified.", rxId: "RX-2026-0722-001", patientName: "Rajesh Kumar", ipAddress: "10.0.5.502" },
  { id: "AUD-005", timestamp: "2026-07-22 09:05:00", user: "Rahul Deshmukh", role: "Dispensing Pharmacist", action: "Medication Dispensed", detail: "4 medications dispensed to Rajesh Kumar. Total: ₹554.30.", rxId: "RX-2026-0722-001", patientName: "Rajesh Kumar", ipAddress: "10.0.5.502" },
  { id: "AUD-006", timestamp: "2026-07-22 09:15:00", user: "Dr. Imran Sheikh", role: "Consultant", action: "STAT Prescription Created", detail: "STAT Rx for Lakshmi Iyer — Insulin, Ceftriaxone, Heparin", rxId: "RX-2026-0722-004", patientName: "Lakshmi Iyer", ipAddress: "10.0.1.105" },
  { id: "AUD-007", timestamp: "2026-07-22 09:20:00", user: "Priya Kulkarni", role: "Clinical Pharmacist", action: "Critical Interaction Alert", detail: "Heparin + Aspirin interaction detected — increased bleeding risk. Doctor notified.", rxId: "RX-2026-0722-004", patientName: "Lakshmi Iyer", ipAddress: "10.0.5.501" },
  { id: "AUD-008", timestamp: "2026-07-22 09:25:00", user: "Dr. Imran Sheikh", role: "Consultant", action: "Interaction Acknowledged", detail: "Heparin-Aspirin interaction acknowledged. Proceed with dispensing per clinical judgment.", rxId: "RX-2026-0722-004", patientName: "Lakshmi Iyer", ipAddress: "10.0.1.105" },
  { id: "AUD-009", timestamp: "2026-07-22 10:00:00", user: "Rahul Deshmukh", role: "Dispensing Pharmacist", action: "Emergency Dispensing", detail: "STAT medications dispensed for Lakshmi Iyer — override authorization for controlled drug.", rxId: "RX-2026-0722-004", patientName: "Lakshmi Iyer", ipAddress: "10.0.5.502" },
  { id: "AUD-010", timestamp: "2026-07-22 11:00:00", user: "Neha Patil", role: "Inventory Pharmacist", action: "Low Stock Alert", detail: "Insulin Glargine — 8 units remaining (min: 10). Purchase order generated.", ipAddress: "10.0.5.503" },
];

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

export function prescriptionStatusTone(s: PrescriptionStatus): "brand" | "success" | "warning" | "danger" | "info" | "neutral" {
  switch (s) {
    case "Pending": return "info";
    case "Verified": return "brand";
    case "Dispensing": return "warning";
    case "Dispensed": return "success";
    case "Billed": return "success";
    case "Delivered": return "neutral";
    case "Cancelled": return "danger";
    default: return "neutral";
  }
}

export function stockStatusTone(s: MedicationStatus): "success" | "warning" | "danger" | "info" | "neutral" {
  switch (s) {
    case "In Stock": return "success";
    case "Low Stock": return "warning";
    case "Out of Stock": return "danger";
    case "Expired": return "danger";
    case "Quarantine": return "warning";
    case "Reserved": return "info";
    default: return "neutral";
  }
}

export function poStatusTone(s: POStatus): "brand" | "success" | "warning" | "danger" | "info" | "neutral" {
  switch (s) {
    case "Draft": return "neutral";
    case "Pending Approval": return "warning";
    case "Approved": return "brand";
    case "Ordered": return "info";
    case "Received": return "success";
    case "Cancelled": return "danger";
    default: return "neutral";
  }
}

export function insuranceStatusTone(s: InsuranceStatus): "success" | "warning" | "danger" | "info" {
  switch (s) {
    case "Approved": return "success";
    case "Pending": return "warning";
    case "Partial": return "warning";
    case "Rejected": return "danger";
    case "Claimed": return "info";
    default: return "info";
  }
}

export function scheduleBadge(s: DrugSchedule): string {
  switch (s) {
    case "H": return "bg-danger/10 text-danger";
    case "H1": return "bg-danger/10 text-danger";
    case "X": return "bg-warning/10 text-[#b45309]";
    default: return "";
  }
}

export function expiryStatus(date: string): "valid" | "near" | "expired" {
  const d = new Date(date);
  const now = new Date();
  const diff = d.getTime() - now.getTime();
  const days = diff / (1000 * 60 * 60 * 24);
  if (days < 0) return "expired";
  if (days < 90) return "near";
  return "valid";
}
