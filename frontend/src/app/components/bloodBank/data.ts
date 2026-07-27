/* ── Blood Bank & Transfusion Medicine — Data ──────────────────────────────── */

export type BloodGroup = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
export type ComponentType = "Whole Blood" | "Packed RBC" | "Platelets" | "Fresh Frozen Plasma" | "Cryoprecipitate";
export type BloodUnitStatus = "Available" | "Reserved" | "Issued" | "Transfused" | "Expired" | "Discarded" | "Quarantined" | "Under Testing" | "In Processing";
export type DonorStatus = "Eligible" | "Deferred" | "Under Screening" | "Donated Today" | "Ineligible";
export type DonationType = "Voluntary" | "Replacement" | "Autologous";
export type CollectionStatus = "Scheduled" | "In Progress" | "Completed" | "Deferral" | "Incomplete";
export type ScreeningResult = "Pass" | "Fail" | "Pending" | "Conditional";
export type TestResult = "Non-Reactive" | "Reactive" | "Pending" | "Invalid";
export type CrossmatchResult = "Compatible" | "Incompatible" | "Pending";
export type ReservationStatus = "Active" | "Expired" | "Released" | "Converted";
export type IssueStatus = "Pending" | "Issued" | "Delivered" | "Returned";
export type TransfusionStatus = "Scheduled" | "In Progress" | "Completed" | "Stopped" | "Reaction" | "Cancelled";
export type ReactionType = "None" | "Febrile Non-Hemolytic" | "Allergic" | "Hemolytic" | "TRALI" | "TACO" | "Septic" | "Delayed";
export type ReactionSeverity = "Mild" | "Moderate" | "Severe" | "Life-Threatening";
export type DisposalReason = "Expired" | "Damaged" | "Failed QC" | "Contaminated" | "Positive Screen" | "Incomplete Label";
export type ColdChainStatus = "Normal" | "Warning" | "Critical" | "Excursion";

export interface Donor {
  id: string; name: string; age: number; gender: "Male" | "Female"; bloodGroup: BloodGroup;
  phone: string; email?: string; address: string; aadhaarLast4: string;
  donationType: DonationType; totalDonations: number; lastDonationDate?: string;
  status: DonorStatus; registrationDate: string; weight: number; hemoglobin: number;
  eligibleUntil: string; medicalClearance: boolean; consentGiven: boolean;
}

export const DONORS: Donor[] = [
  { id: "DON-001", name: "Rajesh Kumar Singh", age: 32, gender: "Male", bloodGroup: "O+", phone: "+91 98765 43210", address: "45 MG Road, Mumbai 400001", aadhaarLast4: "7890", donationType: "Voluntary", totalDonations: 5, lastDonationDate: "2026-04-15", status: "Eligible", registrationDate: "2025-01-10", weight: 72, hemoglobin: 14.2, eligibleUntil: "2026-07-15", medicalClearance: true, consentGiven: true },
  { id: "DON-002", name: "Priya Sharma", age: 28, gender: "Female", bloodGroup: "A+", phone: "+91 87654 32109", address: "12 Nehru Nagar, Delhi 110001", aadhaarLast4: "3456", donationType: "Voluntary", totalDonations: 3, lastDonationDate: "2026-05-20", status: "Eligible", registrationDate: "2025-03-15", weight: 58, hemoglobin: 12.8, eligibleUntil: "2026-08-20", medicalClearance: true, consentGiven: true },
  { id: "DON-003", name: "Amit Patel", age: 45, gender: "Male", bloodGroup: "B+", phone: "+91 76543 21098", address: "78 Civil Hospital Road, Ahmedabad 380001", aadhaarLast4: "1234", donationType: "Replacement", totalDonations: 8, lastDonationDate: "2026-06-01", status: "Eligible", registrationDate: "2024-06-01", weight: 80, hemoglobin: 15.1, eligibleUntil: "2026-09-01", medicalClearance: true, consentGiven: true },
  { id: "DON-004", name: "Sunita Devi", age: 35, gender: "Female", bloodGroup: "AB+", phone: "+91 65432 10987", address: "23 Station Road, Jaipur 302001", aadhaarLast4: "5678", donationType: "Voluntary", totalDonations: 2, lastDonationDate: "2026-07-01", status: "Donated Today", registrationDate: "2025-07-01", weight: 55, hemoglobin: 11.9, eligibleUntil: "2026-10-01", medicalClearance: true, consentGiven: true },
  { id: "DON-005", name: "Vikram Mehta", age: 52, gender: "Male", bloodGroup: "O-", phone: "+91 54321 09876", address: "90 Park Street, Kolkata 700001", aadhaarLast4: "9012", donationType: "Voluntary", totalDonations: 12, lastDonationDate: "2026-03-10", status: "Eligible", registrationDate: "2023-03-10", weight: 85, hemoglobin: 16.0, eligibleUntil: "2026-06-10", medicalClearance: true, consentGiven: true },
  { id: "DON-006", name: "Anita Reddy", age: 29, gender: "Female", bloodGroup: "A-", phone: "+91 43210 98765", address: "56 Jubilee Hills, Hyderabad 500033", aadhaarLast4: "4567", donationType: "Voluntary", totalDonations: 1, lastDonationDate: "2026-07-10", status: "Eligible", registrationDate: "2026-07-10", weight: 60, hemoglobin: 12.5, eligibleUntil: "2026-10-10", medicalClearance: true, consentGiven: true },
  { id: "DON-007", name: "Mohammed Khan", age: 40, gender: "Male", bloodGroup: "B-", phone: "+91 32109 87654", address: "34 Charminar Road, Hyderabad 500002", aadhaarLast4: "8901", donationType: "Replacement", totalDonations: 6, lastDonationDate: "2026-06-20", status: "Deferred", registrationDate: "2024-12-20", weight: 68, hemoglobin: 10.2, eligibleUntil: "2026-09-20", medicalClearance: false, consentGiven: true },
  { id: "DON-008", name: "Kavitha Nair", age: 33, gender: "Female", bloodGroup: "AB-", phone: "+91 21098 76543", address: "78 MG Road, Kochi 682011", aadhaarLast4: "2345", donationType: "Voluntary", totalDonations: 4, lastDonationDate: "2026-05-05", status: "Eligible", registrationDate: "2025-05-05", weight: 57, hemoglobin: 13.0, eligibleUntil: "2026-08-05", medicalClearance: true, consentGiven: true },
];

export interface BloodUnit {
  id: string; unitNumber: string; bloodGroup: BloodGroup; component: ComponentType;
  status: BloodUnitStatus; volume: number; collectionDate: string; expiryDate: string;
  storageLocation: string; temperature: number; donorId: string; donorName: string;
  collectionId: string; batchNumber: string; barcode: string; qrCode: string;
  crossmatchCompatible: boolean; testingComplete: boolean; qcPassed: boolean;
  reservedFor?: string; issuedTo?: string; issuedDate?: string;
}

export const BLOOD_UNITS: BloodUnit[] = [
  { id: "BU-001", unitNumber: "BLD-2026-07-001", bloodGroup: "O+", component: "Packed RBC", status: "Available", volume: 350, collectionDate: "2026-07-20", expiryDate: "2026-08-17", storageLocation: "Rack A-01", temperature: 4, donorId: "DON-001", donorName: "Rajesh Kumar Singh", collectionId: "COL-001", batchNumber: "BAT-001", barcode: "BC-BU-001", qrCode: "QR-BU-001", crossmatchCompatible: true, testingComplete: true, qcPassed: true },
  { id: "BU-002", unitNumber: "BLD-2026-07-002", bloodGroup: "A+", component: "Packed RBC", status: "Reserved", volume: 350, collectionDate: "2026-07-21", expiryDate: "2026-08-18", storageLocation: "Rack A-02", temperature: 4, donorId: "DON-002", donorName: "Priya Sharma", collectionId: "COL-002", batchNumber: "BAT-001", barcode: "BC-BU-002", qrCode: "QR-BU-002", crossmatchCompatible: true, testingComplete: true, qcPassed: true, reservedFor: "PAT-1001" },
  { id: "BU-003", unitNumber: "BLD-2026-07-003", bloodGroup: "B+", component: "Platelets", status: "Available", volume: 250, collectionDate: "2026-07-22", expiryDate: "2026-07-25", storageLocation: "Platelet Incubator-1", temperature: 22, donorId: "DON-003", donorName: "Amit Patel", collectionId: "COL-003", batchNumber: "BAT-002", barcode: "BC-BU-003", qrCode: "QR-BU-003", crossmatchCompatible: true, testingComplete: true, qcPassed: true },
  { id: "BU-004", unitNumber: "BLD-2026-07-004", bloodGroup: "AB+", component: "Fresh Frozen Plasma", status: "Available", volume: 200, collectionDate: "2026-07-22", expiryDate: "2027-07-22", storageLocation: "Freezer B-01", temperature: -30, donorId: "DON-004", donorName: "Sunita Devi", collectionId: "COL-004", batchNumber: "BAT-002", barcode: "BC-BU-004", qrCode: "QR-BU-004", crossmatchCompatible: true, testingComplete: true, qcPassed: true },
  { id: "BU-005", unitNumber: "BLD-2026-07-005", bloodGroup: "O-", component: "Packed RBC", status: "Issued", volume: 350, collectionDate: "2026-07-18", expiryDate: "2026-08-15", storageLocation: "Rack A-03", temperature: 4, donorId: "DON-005", donorName: "Vikram Mehta", collectionId: "COL-005", batchNumber: "BAT-001", barcode: "BC-BU-005", qrCode: "QR-BU-005", crossmatchCompatible: true, testingComplete: true, qcPassed: true, issuedTo: "PAT-1002", issuedDate: "2026-07-23T08:30:00" },
  { id: "BU-006", unitNumber: "BLD-2026-07-006", bloodGroup: "A-", component: "Cryoprecipitate", status: "Available", volume: 50, collectionDate: "2026-07-19", expiryDate: "2027-07-19", storageLocation: "Freezer B-02", temperature: -30, donorId: "DON-006", donorName: "Anita Reddy", collectionId: "COL-006", batchNumber: "BAT-001", barcode: "BC-BU-006", qrCode: "QR-BU-006", crossmatchCompatible: true, testingComplete: true, qcPassed: true },
  { id: "BU-007", unitNumber: "BLD-2026-07-007", bloodGroup: "B-", component: "Packed RBC", status: "Expired", volume: 350, collectionDate: "2026-06-20", expiryDate: "2026-07-18", storageLocation: "Disposal Area", temperature: 4, donorId: "DON-007", donorName: "Mohammed Khan", collectionId: "COL-007", batchNumber: "BAT-001", barcode: "BC-BU-007", qrCode: "QR-BU-007", crossmatchCompatible: false, testingComplete: true, qcPassed: false },
  { id: "BU-008", unitNumber: "BLD-2026-07-008", bloodGroup: "AB-", component: "Whole Blood", status: "Under Testing", volume: 450, collectionDate: "2026-07-23", expiryDate: "2026-08-20", storageLocation: "Testing Area", temperature: 4, donorId: "DON-008", donorName: "Kavitha Nair", collectionId: "COL-008", batchNumber: "BAT-003", barcode: "BC-BU-008", qrCode: "QR-BU-008", crossmatchCompatible: false, testingComplete: false, qcPassed: false },
  { id: "BU-009", unitNumber: "BLD-2026-07-009", bloodGroup: "O+", component: "Platelets", status: "Available", volume: 250, collectionDate: "2026-07-23", expiryDate: "2026-07-26", storageLocation: "Platelet Incubator-2", temperature: 22, donorId: "DON-001", donorName: "Rajesh Kumar Singh", collectionId: "COL-009", batchNumber: "BAT-003", barcode: "BC-BU-009", qrCode: "QR-BU-009", crossmatchCompatible: true, testingComplete: true, qcPassed: true },
  { id: "BU-010", unitNumber: "BLD-2026-07-010", bloodGroup: "O+", component: "Fresh Frozen Plasma", status: "Quarantined", volume: 200, collectionDate: "2026-07-21", expiryDate: "2027-07-21", storageLocation: "Quarantine Freezer", temperature: -30, donorId: "DON-001", donorName: "Rajesh Kumar Singh", collectionId: "COL-010", batchNumber: "BAT-002", barcode: "BC-BU-010", qrCode: "QR-BU-010", crossmatchCompatible: false, testingComplete: false, qcPassed: false },
  { id: "BU-011", unitNumber: "BLD-2026-07-011", bloodGroup: "A+", component: "Packed RBC", status: "Available", volume: 350, collectionDate: "2026-07-22", expiryDate: "2026-08-19", storageLocation: "Rack A-04", temperature: 4, donorId: "DON-002", donorName: "Priya Sharma", collectionId: "COL-011", batchNumber: "BAT-002", barcode: "BC-BU-011", qrCode: "QR-BU-011", crossmatchCompatible: true, testingComplete: true, qcPassed: true },
  { id: "BU-012", unitNumber: "BLD-2026-07-012", bloodGroup: "O-", component: "Packed RBC", status: "Discarded", volume: 350, collectionDate: "2026-06-15", expiryDate: "2026-07-13", storageLocation: "Disposal Area", temperature: 4, donorId: "DON-005", donorName: "Vikram Mehta", collectionId: "COL-012", batchNumber: "BAT-001", barcode: "BC-BU-012", qrCode: "QR-BU-012", crossmatchCompatible: false, testingComplete: true, qcPassed: false },
];

export interface Collection {
  id: string; donorId: string; donorName: string; bloodGroup: BloodGroup;
  collectionDate: string; volume: number; phlebotomist: string;
  status: CollectionStatus; bagId: string; bagType: string;
  hemoglobin: number; weight: number; bloodPressure: string;
  pulse: number; temperature: number; adverseReaction: boolean;
  notes: string;
}

export const COLLECTIONS: Collection[] = [
  { id: "COL-001", donorId: "DON-001", donorName: "Rajesh Kumar Singh", bloodGroup: "O+", collectionDate: "2026-07-20T09:00:00", volume: 350, phlebotomist: "Nurse Lakshmi", status: "Completed", bagId: "BAG-001", bagType: "CPDA-1", hemoglobin: 14.2, weight: 72, bloodPressure: "120/80", pulse: 72, temperature: 98.4, adverseReaction: false, notes: "Smooth collection" },
  { id: "COL-002", donorId: "DON-002", donorName: "Priya Sharma", bloodGroup: "A+", collectionDate: "2026-07-21T10:30:00", volume: 350, phlebotomist: "Nurse Lakshmi", status: "Completed", bagId: "BAG-002", bagType: "CPDA-1", hemoglobin: 12.8, weight: 58, bloodPressure: "110/70", pulse: 78, temperature: 98.2, adverseReaction: false, notes: "Donor comfortable" },
  { id: "COL-003", donorId: "DON-003", donorName: "Amit Patel", bloodGroup: "B+", collectionDate: "2026-07-22T08:15:00", volume: 350, phlebotomist: "Nurse Priya", status: "Completed", bagId: "BAG-003", bagType: "CPDA-1", hemoglobin: 15.1, weight: 80, bloodPressure: "125/82", pulse: 68, temperature: 98.6, adverseReaction: false, notes: "Good flow rate" },
  { id: "COL-004", donorId: "DON-004", donorName: "Sunita Devi", bloodGroup: "AB+", collectionDate: "2026-07-22T11:00:00", volume: 350, phlebotomist: "Nurse Priya", status: "Completed", bagId: "BAG-004", bagType: "CPDA-1", hemoglobin: 11.9, weight: 55, bloodPressure: "105/65", pulse: 82, temperature: 98.0, adverseReaction: false, notes: "Mild dizziness — resolved" },
  { id: "COL-005", donorId: "DON-005", donorName: "Vikram Mehta", bloodGroup: "O-", collectionDate: "2026-07-18T09:30:00", volume: 350, phlebotomist: "Nurse Lakshmi", status: "Completed", bagId: "BAG-005", bagType: "CPDA-1", hemoglobin: 16.0, weight: 85, bloodPressure: "130/85", pulse: 70, temperature: 98.4, adverseReaction: false, notes: "Regular donor" },
  { id: "COL-006", donorId: "DON-006", donorName: "Anita Reddy", bloodGroup: "A-", collectionDate: "2026-07-10T14:00:00", volume: 350, phlebotomist: "Nurse Priya", status: "Completed", bagId: "BAG-006", bagType: "CPDA-1", hemoglobin: 12.5, weight: 60, bloodPressure: "115/72", pulse: 76, temperature: 98.2, adverseReaction: false, notes: "First-time donor" },
  { id: "COL-007", donorId: "DON-007", donorName: "Mohammed Khan", bloodGroup: "B-", collectionDate: "2026-07-23T10:00:00", volume: 0, phlebotomist: "Nurse Lakshmi", status: "Deferral", bagId: "", bagType: "", hemoglobin: 10.2, weight: 68, bloodPressure: "118/76", pulse: 80, temperature: 99.1, adverseReaction: false, notes: "Low hemoglobin — deferred 3 months" },
  { id: "COL-008", donorId: "DON-008", donorName: "Kavitha Nair", bloodGroup: "AB-", collectionDate: "2026-07-23T11:30:00", volume: 450, phlebotomist: "Nurse Priya", status: "Completed", bagId: "BAG-008", bagType: "Whole Blood", hemoglobin: 13.0, weight: 57, bloodPressure: "112/68", pulse: 74, temperature: 98.3, adverseReaction: false, notes: "Whole blood collection for processing" },
];

export interface ComponentBatch {
  id: string; collectionId: string; bloodGroup: BloodGroup; processedDate: string;
  components: { type: ComponentType; volume: number; unitId: string; status: string }[];
  processedBy: string; centrifugeId: string; batchNumber: string;
}

export const COMPONENT_BATCHES: ComponentBatch[] = [
  { id: "CB-001", collectionId: "COL-001", bloodGroup: "O+", processedDate: "2026-07-20T14:00:00", components: [
    { type: "Packed RBC", volume: 350, unitId: "BU-001", status: "Available" },
    { type: "Platelets", volume: 250, unitId: "BU-009", status: "Available" },
    { type: "Fresh Frozen Plasma", volume: 200, unitId: "BU-010", status: "Quarantined" },
  ], processedBy: "Tech. Rajesh", centrifugeId: "CEN-001", batchNumber: "BAT-001" },
  { id: "CB-002", collectionId: "COL-002", bloodGroup: "A+", processedDate: "2026-07-21T15:00:00", components: [
    { type: "Packed RBC", volume: 350, unitId: "BU-002", status: "Reserved" },
    { type: "Platelets", volume: 250, unitId: "BU-011", status: "Available" },
  ], processedBy: "Tech. Rajesh", centrifugeId: "CEN-001", batchNumber: "BAT-001" },
  { id: "CB-003", collectionId: "COL-003", bloodGroup: "B+", processedDate: "2026-07-22T13:00:00", components: [
    { type: "Packed RBC", volume: 350, unitId: "BU-003", status: "Available" },
  ], processedBy: "Tech. Anjali", centrifugeId: "CEN-002", batchNumber: "BAT-002" },
];

export interface LabTest {
  id: string; unitId: string; bloodGroup: BloodGroup; testDate: string;
  aboGrouping: ScreeningResult; rhTyping: ScreeningResult;
  antibodyScreen: ScreeningResult; hiv: TestResult; hbsag: TestResult;
  hcv: TestResult; syphilis: TestResult; malaria: TestResult;
  nat: TestResult; hcvNat: TestResult;
  testedBy: string; verifiedBy: string; released: boolean;
  releaseDate?: string; quarantineReason?: string;
}

export const LAB_TESTS: LabTest[] = [
  { id: "LAB-001", unitId: "BU-001", bloodGroup: "O+", testDate: "2026-07-20T16:00:00", aboGrouping: "Pass", rhTyping: "Pass", antibodyScreen: "Pass", hiv: "Non-Reactive", hbsag: "Non-Reactive", hcv: "Non-Reactive", syphilis: "Non-Reactive", malaria: "Non-Reactive", nat: "Non-Reactive", hcvNat: "Non-Reactive", testedBy: "Tech. Meena", verifiedBy: "Dr. Suresh", released: true, releaseDate: "2026-07-21T08:00:00" },
  { id: "LAB-002", unitId: "BU-002", bloodGroup: "A+", testDate: "2026-07-21T17:00:00", aboGrouping: "Pass", rhTyping: "Pass", antibodyScreen: "Pass", hiv: "Non-Reactive", hbsag: "Non-Reactive", hcv: "Non-Reactive", syphilis: "Non-Reactive", malaria: "Non-Reactive", nat: "Non-Reactive", hcvNat: "Non-Reactive", testedBy: "Tech. Meena", verifiedBy: "Dr. Suresh", released: true, releaseDate: "2026-07-22T08:00:00" },
  { id: "LAB-003", unitId: "BU-003", bloodGroup: "B+", testDate: "2026-07-22T15:00:00", aboGrouping: "Pass", rhTyping: "Pass", antibodyScreen: "Pass", hiv: "Non-Reactive", hbsag: "Non-Reactive", hcv: "Non-Reactive", syphilis: "Non-Reactive", malaria: "Non-Reactive", nat: "Non-Reactive", hcvNat: "Non-Reactive", testedBy: "Tech. Anjali", verifiedBy: "Dr. Suresh", released: true, releaseDate: "2026-07-23T08:00:00" },
  { id: "LAB-004", unitId: "BU-008", bloodGroup: "AB-", testDate: "2026-07-23T14:00:00", aboGrouping: "Pending", rhTyping: "Pending", antibodyScreen: "Pending", hiv: "Pending", hbsag: "Pending", hcv: "Pending", syphilis: "Pending", malaria: "Pending", nat: "Pending", hcvNat: "Pending", testedBy: "Tech. Meena", verifiedBy: "", released: false },
  { id: "LAB-005", unitId: "BU-010", bloodGroup: "O+", testDate: "2026-07-22T16:00:00", aboGrouping: "Pass", rhTyping: "Pass", antibodyScreen: "Pass", hiv: "Reactive", hbsag: "Non-Reactive", hcv: "Non-Reactive", syphilis: "Non-Reactive", malaria: "Non-Reactive", nat: "Pending", hcvNat: "Pending", testedBy: "Tech. Meena", verifiedBy: "Dr. Suresh", released: false, quarantineReason: "HIV Reactive — quarantined for confirmatory testing" },
];

export interface BloodRequest {
  id: string; patientId: string; patientName: string; uhid: string;
  department: string; doctor: string; bloodGroup: BloodGroup;
  component: ComponentType; units: number; urgency: "Emergency" | "Urgent" | "Routine";
  requiredTime: string; requestedTime: string; clinicalIndication: string;
  approvalStatus: "Pending" | "Approved" | "Rejected";
  approvedBy?: string; approvedTime?: string;
}

export const BLOOD_REQUESTS: BloodRequest[] = [
  { id: "REQ-001", patientId: "PAT-1001", patientName: "Suresh Patel", uhid: "UHID-2026-001", department: "Surgery", doctor: "Dr. Rajesh Mehta", bloodGroup: "A+", component: "Packed RBC", units: 2, urgency: "Urgent", requiredTime: "2026-07-24T10:00:00", requestedTime: "2026-07-23T08:00:00", clinicalIndication: "Pre-operative — CABG scheduled", approvalStatus: "Approved", approvedBy: "Dr. Suresh", approvedTime: "2026-07-23T08:30:00" },
  { id: "REQ-002", patientId: "PAT-1002", patientName: "Lakshmi Iyer", uhid: "UHID-2026-002", department: "ICU", doctor: "Dr. Meera Joshi", bloodGroup: "O-", component: "Packed RBC", units: 3, urgency: "Emergency", requiredTime: "2026-07-23T06:00:00", requestedTime: "2026-07-23T05:30:00", clinicalIndication: "Post-partum hemorrhage — hemoglobin 6.2 g/dL", approvalStatus: "Approved", approvedBy: "Dr. Suresh", approvedTime: "2026-07-23T05:35:00" },
  { id: "REQ-003", patientId: "PAT-1003", patientName: "Arjun Reddy", uhid: "UHID-2026-003", department: "OT-2", doctor: "Dr. Priya Sharma", bloodGroup: "B+", component: "Platelets", units: 1, urgency: "Urgent", requiredTime: "2026-07-24T14:00:00", requestedTime: "2026-07-23T09:00:00", clinicalIndication: "Post-surgical — platelet count 45,000", approvalStatus: "Approved", approvedBy: "Dr. Suresh", approvedTime: "2026-07-23T09:15:00" },
  { id: "REQ-004", patientId: "PAT-1004", patientName: "Meena Kumari", uhid: "UHID-2026-004", department: "Hematology", doctor: "Dr. Anil Gupta", bloodGroup: "AB+", component: "Fresh Frozen Plasma", units: 4, urgency: "Emergency", requiredTime: "2026-07-23T12:00:00", requestedTime: "2026-07-23T11:00:00", clinicalIndication: "DIC — INR 4.2, fibrinogen 80 mg/dL", approvalStatus: "Approved", approvedBy: "Dr. Suresh", approvedTime: "2026-07-23T11:05:00" },
  { id: "REQ-005", patientId: "PAT-1005", patientName: "Vikram Singh", uhid: "UHID-2026-005", department: "General Ward", doctor: "Dr. Kavita Nair", bloodGroup: "O+", component: "Packed RBC", units: 1, urgency: "Routine", requiredTime: "2026-07-25T10:00:00", requestedTime: "2026-07-23T10:00:00", clinicalIndication: "Chronic anemia — hemoglobin 7.8 g/dL", approvalStatus: "Pending" },
];

export interface Crossmatch {
  id: string; requestId: string; patientId: string; patientName: string;
  patientBloodGroup: BloodGroup; donorUnitId: string; donorUnitNumber: string;
  donorBloodGroup: BloodGroup; method: string; result: CrossmatchResult;
  antibodyScreen: string; testDate: string; testedBy: string; verifiedBy: string;
  compatibleUnits: number; totalTested: number;
}

export const CROSSMATCHES: Crossmatch[] = [
  { id: "XM-001", requestId: "REQ-001", patientId: "PAT-1001", patientName: "Suresh Patel", patientBloodGroup: "A+", donorUnitId: "BU-002", donorUnitNumber: "BLD-2026-07-002", donorBloodGroup: "A+", method: "Immediate Spin + AHG", result: "Compatible", antibodyScreen: "Negative", testDate: "2026-07-23T09:00:00", testedBy: "Tech. Meena", verifiedBy: "Dr. Suresh", compatibleUnits: 2, totalTested: 3 },
  { id: "XM-002", requestId: "REQ-002", patientId: "PAT-1002", patientName: "Lakshmi Iyer", patientBloodGroup: "O-", donorUnitId: "BU-005", donorUnitNumber: "BLD-2026-07-005", donorBloodGroup: "O-", method: "Immediate Spin + AHG", result: "Compatible", antibodyScreen: "Negative", testDate: "2026-07-23T05:40:00", testedBy: "Tech. Anjali", verifiedBy: "Dr. Suresh", compatibleUnits: 3, totalTested: 4 },
  { id: "XM-003", requestId: "REQ-003", patientId: "PAT-1003", patientName: "Arjun Reddy", patientBloodGroup: "B+", donorUnitId: "BU-003", donorUnitNumber: "BLD-2026-07-003", donorBloodGroup: "B+", method: "Immediate Spin + AHG", result: "Compatible", antibodyScreen: "Negative", testDate: "2026-07-23T10:00:00", testedBy: "Tech. Meena", verifiedBy: "Dr. Suresh", compatibleUnits: 1, totalTested: 1 },
];

export interface Reservation {
  id: string; requestId: string; patientId: string; patientName: string;
  bloodGroup: BloodGroup; component: ComponentType; unitIds: string[];
  reservedBy: string; reservedTime: string; expiryTime: string;
  status: ReservationStatus; procedure?: string;
}

export const RESERVATIONS: Reservation[] = [
  { id: "RES-001", requestId: "REQ-001", patientId: "PAT-1001", patientName: "Suresh Patel", bloodGroup: "A+", component: "Packed RBC", unitIds: ["BU-002"], reservedBy: "Dr. Suresh", reservedTime: "2026-07-23T09:30:00", expiryTime: "2026-07-25T09:30:00", status: "Active", procedure: "CABG — 24 July 2026" },
  { id: "RES-002", requestId: "REQ-003", patientId: "PAT-1003", patientName: "Arjun Reddy", bloodGroup: "B+", component: "Platelets", unitIds: ["BU-003"], reservedBy: "Dr. Suresh", reservedTime: "2026-07-23T10:30:00", expiryTime: "2026-07-24T10:30:00", status: "Active", procedure: "Platelet transfusion — 24 July 2026" },
];

export interface BloodIssue {
  id: string; requestId: string; patientId: string; patientName: string;
  bloodGroup: BloodGroup; component: ComponentType; unitIds: string[];
  issueTime: string; issuedBy: string; verifiedBy: string;
  digitalSignature: string; transportStatus: "In Transit" | "Delivered" | "Received";
  deliveredTo: string; deliveredTime?: string;
}

export const BLOOD_ISSUES: BloodIssue[] = [
  { id: "ISS-001", requestId: "REQ-002", patientId: "PAT-1002", patientName: "Lakshmi Iyer", bloodGroup: "O-", component: "Packed RBC", unitIds: ["BU-005"], issueTime: "2026-07-23T06:15:00", issuedBy: "Dr. Suresh", verifiedBy: "Nurse Kavita", digitalSignature: "DS-2026-07-23-001", transportStatus: "Delivered", deliveredTo: "ICU Bed-05", deliveredTime: "2026-07-23T06:30:00" },
];

export interface Transfusion {
  id: string; issueId: string; patientId: string; patientName: string;
  bloodGroup: BloodGroup; component: ComponentType; unitId: string;
  startTime: string; endTime?: string; status: TransfusionStatus;
  nurse: string; doctor: string; bedsideVerifiedBy: string;
  twoPersonVerification: boolean; preVitals: { bp: string; hr: number; temp: number; rr: number };
  postVitals?: { bp: string; hr: number; temp: number; rr: number };
  outcome?: string; reaction?: ReactionType; reactionSeverity?: ReactionSeverity;
}

export const TRANSFUSIONS: Transfusion[] = [
  { id: "TRF-001", issueId: "ISS-001", patientId: "PAT-1002", patientName: "Lakshmi Iyer", bloodGroup: "O-", component: "Packed RBC", unitId: "BU-005", startTime: "2026-07-23T06:45:00", endTime: "2026-07-23T08:45:00", status: "Completed", nurse: "Nurse Kavita", doctor: "Dr. Meera Joshi", bedsideVerifiedBy: "Nurse Kavita", twoPersonVerification: true, preVitals: { bp: "90/60", hr: 110, temp: 98.8, rr: 22 }, postVitals: { bp: "105/70", hr: 92, temp: 98.6, rr: 18 }, outcome: "Successful — hemoglobin improved from 6.2 to 8.1 g/dL" },
];

export interface AdverseReaction {
  id: string; transfusionId: string; patientId: string; patientName: string;
  reactionType: ReactionType; severity: ReactionSeverity;
  onsetTime: string; symptoms: string[]; immediateActions: string;
  investigation: string; reportedBy: string; reportDate: string;
  haemovigilanceReported: boolean; capaRequired: boolean;
  outcome: string; regulatoryNotification: boolean;
}

export const ADVERSE_REACTIONS: AdverseReaction[] = [
  { id: "AR-001", transfusionId: "TRF-001", patientId: "PAT-1002", patientName: "Lakshmi Iyer", reactionType: "Febrile Non-Hemolytic", severity: "Mild", onsetTime: "2026-07-23T07:30:00", symptoms: ["Temperature rise to 38.5°C", "Chills", "Mild rigors"], immediateActions: "Slowed transfusion rate. Administered paracetamol 500mg. Monitored vitals every 15 minutes.", investigation: "Febrile non-hemolytic transfusion reaction confirmed. No hemolysis indicators.", reportedBy: "Nurse Kavita", reportDate: "2026-07-23T08:00:00", haemovigilanceReported: true, capaRequired: false, outcome: "Resolved — transfusion completed successfully after slowing rate", regulatoryNotification: false },
];

export interface BloodDisposal {
  id: string; unitId: string; unitNumber: string; bloodGroup: BloodGroup;
  component: ComponentType; disposalReason: DisposalReason;
  disposalDate: string; approvedBy: string; disposedBy: string;
  disposalMethod: string; weight: number; wasteBagId: string;
  witnessSignature: string; notes: string;
}

export const BLOOD_DISPOSALS: BloodDisposal[] = [
  { id: "DSP-001", unitId: "BU-007", unitNumber: "BLD-2026-07-007", bloodGroup: "B-", component: "Packed RBC", disposalReason: "Expired", disposalDate: "2026-07-19T10:00:00", approvedBy: "Dr. Suresh", disposedBy: "Tech. Rajesh", disposalMethod: "Biohazard Waste Disposal", weight: 0.4, wasteBagId: "WB-2026-07-001", witnessSignature: "WS-001", notes: "Expired on 2026-07-18 — 1 day past expiry" },
  { id: "DSP-002", unitId: "BU-012", unitNumber: "BLD-2026-07-012", bloodGroup: "O-", component: "Packed RBC", disposalReason: "Expired", disposalDate: "2026-07-14T10:00:00", approvedBy: "Dr. Suresh", disposedBy: "Tech. Anjali", disposalMethod: "Biohazard Waste Disposal", weight: 0.38, wasteBagId: "WB-2026-07-002", witnessSignature: "WS-002", notes: "Expired on 2026-07-13" },
];

export interface TemperatureLog {
  id: string; location: string; temperature: number; minTemp: number; maxTemp: number;
  timestamp: string; status: ColdChainStatus; alarmTriggered: boolean;
}

export const TEMPERATURE_LOGS: TemperatureLog[] = [
  { id: "TL-001", location: "Rack A (Refrigerator 1)", temperature: 4.2, minTemp: 1, maxTemp: 6, timestamp: "2026-07-23T12:00:00", status: "Normal", alarmTriggered: false },
  { id: "TL-002", location: "Rack A (Refrigerator 1)", temperature: 4.5, minTemp: 1, maxTemp: 6, timestamp: "2026-07-23T06:00:00", status: "Normal", alarmTriggered: false },
  { id: "TL-003", location: "Platelet Incubator-1", temperature: 22.1, minTemp: 20, maxTemp: 24, timestamp: "2026-07-23T12:00:00", status: "Normal", alarmTriggered: false },
  { id: "TL-004", location: "Freezer B (FFP)", temperature: -28.5, minTemp: -35, maxTemp: -18, timestamp: "2026-07-23T12:00:00", status: "Warning", alarmTriggered: false },
  { id: "TL-005", location: "Freezer B (FFP)", temperature: -17.2, minTemp: -35, maxTemp: -18, timestamp: "2026-07-22T03:00:00", status: "Critical", alarmTriggered: true },
  { id: "TL-006", location: "Quarantine Freezer", temperature: -30.1, minTemp: -35, maxTemp: -18, timestamp: "2026-07-23T12:00:00", status: "Normal", alarmTriggered: false },
];

export interface QualityControl {
  id: string; testType: string; testDate: string; equipmentId: string;
  equipmentName: string; result: "Pass" | "Fail" | "Pending";
  performedBy: string; verifiedBy: string; notes: string;
  capaRequired: boolean; nextDue: string;
}

export const QUALITY_CONTROLS: QualityControl[] = [
  { id: "QC-001", testType: "Daily Temperature Log", testDate: "2026-07-23", equipmentId: "REF-001", equipmentName: "Refrigerator 1", result: "Pass", performedBy: "Tech. Rajesh", verifiedBy: "Dr. Suresh", notes: "Temperature stable at 4.2°C", capaRequired: false, nextDue: "2026-07-24" },
  { id: "QC-002", testType: "Daily Temperature Log", testDate: "2026-07-23", equipmentId: "PLT-001", equipmentName: "Platelet Incubator-1", result: "Pass", performedBy: "Tech. Rajesh", verifiedBy: "Dr. Suresh", notes: "Temperature stable at 22.1°C", capaRequired: false, nextDue: "2026-07-24" },
  { id: "QC-003", testType: "Freezer Temperature Check", testDate: "2026-07-23", equipmentId: "FRZ-001", equipmentName: "Freezer B (FFP)", result: "Fail", performedBy: "Tech. Anjali", verifiedBy: "Dr. Suresh", notes: "Temperature excursion detected at 03:00 — rose to -17.2°C", capaRequired: true, nextDue: "2026-07-24" },
  { id: "QC-004", testType: "Centrifuge Calibration", testDate: "2026-07-22", equipmentId: "CEN-001", equipmentName: "Centrifuge-1", result: "Pass", performedBy: "Tech. Rajesh", verifiedBy: "Dr. Suresh", notes: "Annual calibration completed — all parameters within range", capaRequired: false, nextDue: "2027-07-22" },
  { id: "QC-005", testType: "ABO Reference Cell QC", testDate: "2026-07-23", equipmentId: "LAB-001", equipmentName: "Blood Grouping Lab", result: "Pass", performedBy: "Tech. Meena", verifiedBy: "Dr. Suresh", notes: "Reference cells A1, A2, B, O — all reacting as expected", capaRequired: false, nextDue: "2026-07-30" },
];

export interface AuditLog {
  id: string; timestamp: string; user: string; action: string; resource: string;
  details: string; severity: "Info" | "Warning" | "Critical";
}

export const AUDIT_LOGS: AuditLog[] = [
  { id: "AUD-001", timestamp: "2026-07-23T06:45:00", user: "Nurse Kavita", action: "Transfusion Started", resource: "TRF-001", details: "Transfusion started — O- Packed RBC — BU-005 — Patient: Lakshmi Iyer", severity: "Info" },
  { id: "AUD-002", timestamp: "2026-07-23T06:30:00", user: "Dr. Suresh", action: "Blood Issued", resource: "ISS-001", details: "Emergency blood issued — O- Packed RBC — BU-005 — to ICU Bed-05", severity: "Warning" },
  { id: "AUD-003", timestamp: "2026-07-23T06:15:00", user: "Dr. Suresh", action: "Crossmatch Approved", resource: "XM-002", details: "Crossmatch compatible — O- to O- — Patient: Lakshmi Iyer", severity: "Info" },
  { id: "AUD-004", timestamp: "2026-07-23T05:40:00", user: "Tech. Anjali", action: "Crossmatch Performed", resource: "XM-002", details: "Crossmatch performed — Immediate Spin + AHG — Compatible", severity: "Info" },
  { id: "AUD-005", timestamp: "2026-07-23T05:35:00", user: "Dr. Suresh", action: "Emergency Request Approved", resource: "REQ-002", details: "Emergency blood request approved — 3 units O- Packed RBC — Lakshmi Iyer", severity: "Warning" },
  { id: "AUD-006", timestamp: "2026-07-23T05:30:00", user: "Dr. Meera Joshi", action: "Blood Requested", resource: "REQ-002", details: "Emergency request — 3 units O- Packed RBC — Post-partum hemorrhage", severity: "Critical" },
  { id: "AUD-007", timestamp: "2026-07-22T16:00:00", user: "Tech. Meena", action: "Lab Test Failed", resource: "LAB-005", details: "HIV Reactive — BU-010 quarantined — confirmatory testing ordered", severity: "Critical" },
  { id: "AUD-008", timestamp: "2026-07-22T03:00:00", user: "System", action: "Temperature Alarm", resource: "TL-005", details: "Freezer B temperature excursion — rose to -17.2°C (limit: -18°C)", severity: "Critical" },
];

/* ── Blood Bank KPIs ──────────────────────────────────────────────────────── */
export const BB_KPI = {
  totalUnits: 12,
  availableUnits: 6,
  reservedUnits: 1,
  issuedUnits: 1,
  expiredUnits: 1,
  discardedUnits: 1,
  quarantinedUnits: 1,
  underTestingUnits: 1,
  todayDonations: 2,
  pendingRequests: 1,
  emergencyRequests: 1,
  pendingCrossmatch: 0,
  activeTransfusions: 0,
  completedTransfusions: 1,
  adverseReactions: 1,
  criticalBloodGroups: ["O-", "AB-"],
  lowStockGroups: ["A-", "B-", "AB-"],
  avgTurnaroundTime: 4.5,
  coldChainCompliance: 97.5,
  deferralRate: 12.5,
  discardRate: 8.3,
};

/* ── Helpers ──────────────────────────────────────────────────────────────── */
export function bloodGroupTone(g: BloodGroup): "success" | "warning" | "danger" | "info" {
  switch (g) { case "O-": case "AB-": return "danger"; case "O+": case "AB+": return "warning"; default: return "info"; }
}
export function unitStatusTone(s: BloodUnitStatus): "success" | "warning" | "danger" | "info" {
  switch (s) { case "Available": return "success"; case "Reserved": case "Issued": case "Transfused": return "info"; case "Expired": case "Discarded": return "danger"; case "Quarantined": case "Under Testing": case "In Processing": return "warning"; default: return "info"; }
}
export function donorStatusTone(s: DonorStatus): "success" | "warning" | "danger" | "info" {
  switch (s) { case "Eligible": return "success"; case "Donated Today": return "info"; case "Under Screening": return "warning"; case "Deferred": case "Ineligible": return "danger"; default: return "info"; }
}
export function collectionStatusTone(s: CollectionStatus): "success" | "warning" | "danger" | "info" {
  switch (s) { case "Completed": return "success"; case "In Progress": return "info"; case "Scheduled": return "warning"; case "Deferral": case "Incomplete": return "danger"; default: return "info"; }
}
export function screeningTone(s: ScreeningResult): "success" | "warning" | "danger" | "info" {
  switch (s) { case "Pass": return "success"; case "Pending": return "info"; case "Conditional": return "warning"; case "Fail": return "danger"; default: return "info"; }
}
export function testResultTone(r: TestResult): "success" | "warning" | "danger" | "info" {
  switch (r) { case "Non-Reactive": return "success"; case "Pending": return "info"; case "Reactive": return "danger"; case "Invalid": return "warning"; default: return "info"; }
}
export function crossmatchTone(r: CrossmatchResult): "success" | "warning" | "danger" | "info" {
  switch (r) { case "Compatible": return "success"; case "Pending": return "info"; case "Incompatible": return "danger"; default: return "info"; }
}
export function reservationStatusTone(s: ReservationStatus): "success" | "warning" | "danger" | "info" {
  switch (s) { case "Active": return "success"; case "Converted": return "info"; case "Expired": return "danger"; case "Released": return "warning"; default: return "info"; }
}
export function issueStatusTone(s: IssueStatus): "success" | "warning" | "danger" | "info" {
  switch (s) { case "Issued": case "Delivered": return "success"; case "Pending": return "info"; case "Returned": return "warning"; default: return "info"; }
}
export function transfusionStatusTone(s: TransfusionStatus): "success" | "warning" | "danger" | "info" {
  switch (s) { case "Completed": return "success"; case "In Progress": return "info"; case "Scheduled": return "warning"; case "Stopped": case "Reaction": case "Cancelled": return "danger"; default: return "info"; }
}
export function reactionSeverityTone(s: ReactionSeverity): "success" | "warning" | "danger" | "info" {
  switch (s) { case "Mild": return "info"; case "Moderate": return "warning"; case "Severe": case "Life-Threatening": return "danger"; default: return "info"; }
}
export function coldChainTone(s: ColdChainStatus): "success" | "warning" | "danger" | "info" {
  switch (s) { case "Normal": return "success"; case "Warning": return "warning"; case "Critical": case "Excursion": return "danger"; default: return "info"; }
}
export function approvalTone(s: string): "success" | "warning" | "danger" | "info" {
  switch (s) { case "Approved": return "success"; case "Pending": return "warning"; case "Rejected": return "danger"; default: return "info"; }
}
export function formatCurrency(n: number): string { return `Rs.${n.toLocaleString("en-IN")}`; }
