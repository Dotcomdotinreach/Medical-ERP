/* ------------------------------------------------------------------ */
/* Realistic mock laboratory data for Meridian Multi-Speciality Hospital */
/* ------------------------------------------------------------------ */

export type SampleType = "Blood" | "Urine" | "Stool" | "Sputum" | "CSF" | "Swab";
export type TubeType = "EDTA" | "Fluoride" | "SST" | "Plain" | "Citrate" | "Urine Container" | "Stool Container" | "Sterile Container" | "Culture Swab";
export type OrderPriority = "Routine" | "Urgent" | "STAT";
export type SampleStatus = "Ordered" | "Collected" | "In Transit" | "Received" | "Processing" | "Analyzed" | "Verified" | "Reported" | "Rejected";
export type QCStatus = "Pass" | "Fail" | "Pending" | "Recalibration";
export type AnalyzerStatus = "Online" | "Offline" | "Maintenance" | "Error" | "Idle";
export type InventoryCategory = "Reagent" | "Consumable" | "Calibrator" | "Control" | "Kit";

export interface LabTestOrder {
  orderId: string;
  specimenId: string;
  patientName: string;
  uhid: string;
  age: number;
  gender: "Male" | "Female";
  blood: string;
  orderingDoctor: string;
  department: string;
  priority: OrderPriority;
  orderTime: string;
  collectionTime: string;
  tests: string[];
  status: SampleStatus;
  sampleType: SampleType;
  tubeType: TubeType;
  collectorName?: string;
  collectionSite?: string;
  rejectionReason?: string;
  receivedBy?: string;
  receivedTime?: string;
  processingBy?: string;
  analyzerId?: string;
}

export interface QCRecord {
  id: string;
  testName: string;
  analyzer: string;
  level: "Normal" | "Abnormal" | "Critical";
  controlMaterial: string;
  lotNumber: string;
  expectedRange: string;
  observedValue: string;
  unit: string;
  status: QCStatus;
  runDate: string;
  runTime: string;
  operator: string;
  batchNumber: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: InventoryCategory;
  lotNumber: string;
  expiryDate: string;
  currentStock: number;
  minStock: number;
  unit: string;
  supplier: string;
  lastReceived: string;
  cost: number;
}

export interface Equipment {
  id: string;
  name: string;
  manufacturer: string;
  model: string;
  department: string;
  status: AnalyzerStatus;
  lastMaintenance: string;
  nextMaintenance: string;
  calibrationDue: string;
  errorCount: number;
  serialNumber: string;
  installDate: string;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  detail: string;
  specimenId?: string;
  patientName?: string;
  ipAddress: string;
}

export interface ResultEntry {
  specimenId: string;
  patientName: string;
  uhid: string;
  testName: string;
  observedValue: string;
  unit: string;
  referenceRange: string;
  abnormalFlag: "Normal" | "Low" | "High" | "Critical Low" | "Critical High" | "Borderline";
  comments: string;
  deltaCheck: boolean;
  previousValue?: string;
}

/* ------------------------------------------------------------------ */
/* Test Orders                                                         */
/* ------------------------------------------------------------------ */

export const TEST_ORDERS: LabTestOrder[] = [
  {
    orderId: "ORD-2026-0722-001", specimenId: "SP-2026-0722-001",
    patientName: "Rajesh Kumar", uhid: "MRD-2026-004821", age: 47, gender: "Male", blood: "B+",
    orderingDoctor: "Dr. Arjun Mehta", department: "Cardiology", priority: "Urgent",
    orderTime: "08:15 AM", collectionTime: "08:30 AM",
    tests: ["CBC", "Blood Sugar Fasting", "HbA1c", "Lipid Profile", "Troponin I"],
    status: "Processing", sampleType: "Blood", tubeType: "SST",
    collectorName: "Anita Deshmukh", collectionSite: "Left antecubital fossa",
    receivedBy: "Suresh Pawar", receivedTime: "08:45 AM",
    processingBy: "Ravi Verma", analyzerId: "ANC-001",
  },
  {
    orderId: "ORD-2026-0722-002", specimenId: "SP-2026-0722-002",
    patientName: "Meena Patil", uhid: "MRD-2026-004822", age: 34, gender: "Female", blood: "O+",
    orderingDoctor: "Dr. Kavya Nair", department: "General Medicine", priority: "Routine",
    orderTime: "09:00 AM", collectionTime: "09:15 AM",
    tests: ["Thyroid Profile", "Vitamin D", "KFT"],
    status: "Collected", sampleType: "Blood", tubeType: "SST",
    collectorName: "Anita Deshmukh", collectionSite: "Right antecubital fossa",
  },
  {
    orderId: "ORD-2026-0722-003", specimenId: "SP-2026-0722-003",
    patientName: "Aarav Sharma", uhid: "MRD-2026-004823", age: 7, gender: "Male", blood: "A+",
    orderingDoctor: "Dr. Sneha Iyer", department: "Paediatrics", priority: "STAT",
    orderTime: "09:30 AM", collectionTime: "09:35 AM",
    tests: ["CBC", "ESR", "CRP"],
    status: "Received", sampleType: "Blood", tubeType: "EDTA",
    collectorName: "Priya Kulkarni", collectionSite: "Left dorsalis pedis",
    receivedBy: "Suresh Pawar", receivedTime: "09:50 AM",
  },
  {
    orderId: "ORD-2026-0722-004", specimenId: "SP-2026-0722-004",
    patientName: "Lakshmi Iyer", uhid: "MRD-2026-004824", age: 70, gender: "Female", blood: "AB+",
    orderingDoctor: "Dr. Imran Sheikh", department: "Emergency Medicine", priority: "STAT",
    orderTime: "09:55 AM", collectionTime: "10:00 AM",
    tests: ["D-Dimer", "Troponin I", "CBC", "CRP", "Procalcitonin"],
    status: "Analyzed", sampleType: "Blood", tubeType: "Citrate",
    collectorName: "Priya Kulkarni", collectionSite: "Right antecubital fossa",
    receivedBy: "Suresh Pawar", receivedTime: "10:10 AM",
    processingBy: "Ravi Verma", analyzerId: "ANC-001",
  },
  {
    orderId: "ORD-2026-0722-005", specimenId: "SP-2026-0722-005",
    patientName: "Sunita Reddy", uhid: "MRD-2026-004826", age: 54, gender: "Female", blood: "B-",
    orderingDoctor: "Dr. Vikram Rao", department: "Neurology", priority: "Routine",
    orderTime: "10:15 AM", collectionTime: "10:30 AM",
    tests: ["LFT", "Lipid Profile", "HbA1c"],
    status: "Ordered", sampleType: "Blood", tubeType: "SST",
  },
  {
    orderId: "ORD-2026-0722-006", specimenId: "SP-2026-0722-006",
    patientName: "Ganesh More", uhid: "MRD-2026-004830", age: 62, gender: "Male", blood: "O+",
    orderingDoctor: "Dr. Kavya Nair", department: "General Medicine", priority: "Routine",
    orderTime: "10:45 AM", collectionTime: "",
    tests: ["Urine Routine", "Urine Culture"],
    status: "Ordered", sampleType: "Urine", tubeType: "Urine Container",
  },
  {
    orderId: "ORD-2026-0722-007", specimenId: "SP-2026-0722-007",
    patientName: "Deepak Joshi", uhid: "MRD-2026-004831", age: 41, gender: "Male", blood: "A-",
    orderingDoctor: "Dr. Arjun Mehta", department: "Cardiology", priority: "Urgent",
    orderTime: "11:00 AM", collectionTime: "11:10 AM",
    tests: ["CBC", "Blood Sugar PP", "LFT", "KFT", "Electrolytes"],
    status: "Collected", sampleType: "Blood", tubeType: "Fluoride",
    collectorName: "Anita Deshmukh", collectionSite: "Left antecubital fossa",
  },
  {
    orderId: "ORD-2026-0722-008", specimenId: "SP-2026-0722-008",
    patientName: "Pooja Salunkhe", uhid: "MRD-2026-004832", age: 28, gender: "Female", blood: "O+",
    orderingDoctor: "Dr. Ananya Gupta", department: "Gynaecology", priority: "Routine",
    orderTime: "11:30 AM", collectionTime: "",
    tests: ["CBC", "Blood Group", "HIV", "HBSAg", "VDRL"],
    status: "Ordered", sampleType: "Blood", tubeType: "SST",
  },
  {
    orderId: "ORD-2026-0722-009", specimenId: "SP-2026-0722-009",
    patientName: "Anil Kulkarni", uhid: "MRD-2026-004833", age: 58, gender: "Male", blood: "B+",
    orderingDoctor: "Dr. Imran Sheikh", department: "Emergency Medicine", priority: "STAT",
    orderTime: "12:00 PM", collectionTime: "12:05 PM",
    tests: ["Troponin I", "D-Dimer", "BNP", "CBC", "ABG"],
    status: "Received", sampleType: "Blood", tubeType: "Citrate",
    collectorName: "Priya Kulkarni", collectionSite: "Right antecubital fossa",
    receivedBy: "Suresh Pawar", receivedTime: "12:15 PM",
  },
  {
    orderId: "ORD-2026-0722-010", specimenId: "SP-2026-0722-010",
    patientName: "Rajesh Kumar", uhid: "MRD-2026-004821", age: 47, gender: "Male", blood: "B+",
    orderingDoctor: "Dr. Arjun Mehta", department: "Cardiology", priority: "Routine",
    orderTime: "02:00 PM", collectionTime: "",
    tests: ["Urine Albumin", "Serum Creatinine", "eGFR"],
    status: "Ordered", sampleType: "Blood", tubeType: "SST",
  },
];

/* ------------------------------------------------------------------ */
/* Analyzer instruments                                                */
/* ------------------------------------------------------------------ */

export const ANALYZERS = [
  { id: "ANC-001", name: "Sysmex XN-1000", type: "Haematology Analyzer", status: "Online" as AnalyzerStatus, samples: 12, capacity: 40, estTime: "15 min" },
  { id: "ANC-002", name: "Roche cobas 6800", type: "Immunoassay Analyzer", status: "Online" as AnalyzerStatus, samples: 8, capacity: 30, estTime: "22 min" },
  { id: "ANC-003", name: "Beckman Coulter AU5800", type: "Chemistry Analyzer", status: "Maintenance" as AnalyzerStatus, samples: 0, capacity: 45, estTime: "—" },
  { id: "ANC-004", name: "BD Phoenix M50", type: "Microbiology Analyzer", status: "Online" as AnalyzerStatus, samples: 3, capacity: 20, estTime: "45 min" },
  { id: "ANC-005", name: "Siemens Dimension EXL", type: "Chemistry Analyzer", status: "Online" as AnalyzerStatus, samples: 6, capacity: 35, estTime: "18 min" },
  { id: "ANC-006", name: "Abbott Alinity s", type: "Molecular Diagnostic", status: "Error" as AnalyzerStatus, samples: 0, capacity: 15, estTime: "—" },
];

/* ------------------------------------------------------------------ */
/* QC records                                                          */
/* ------------------------------------------------------------------ */

export const QC_RECORDS: QCRecord[] = [
  { id: "QC-001", testName: "CBC – WBC", analyzer: "Sysmex XN-1000", level: "Normal", controlMaterial: "Normal Control", lotNumber: "QC-2026-N-045", expectedRange: "4.5–11.0", observedValue: "6.8", unit: "×10³/µL", status: "Pass", runDate: "2026-07-22", runTime: "07:30", operator: "Ravi Verma", batchNumber: "B-2026-0722-01" },
  { id: "QC-002", testName: "CBC – Haemoglobin", analyzer: "Sysmex XN-1000", level: "Normal", controlMaterial: "Normal Control", lotNumber: "QC-2026-N-045", expectedRange: "12.0–17.5", observedValue: "14.2", unit: "g/dL", status: "Pass", runDate: "2026-07-22", runTime: "07:30", operator: "Ravi Verma", batchNumber: "B-2026-0722-01" },
  { id: "QC-003", testName: "Blood Glucose", analyzer: "Beckman AU5800", level: "Abnormal", controlMaterial: "Abnormal Control", lotNumber: "QC-2026-A-032", expectedRange: "250–350", observedValue: "285", unit: "mg/dL", status: "Pass", runDate: "2026-07-22", runTime: "07:45", operator: "Sunita Kute", batchNumber: "B-2026-0722-02" },
  { id: "QC-004", testName: "TSH", analyzer: "Roche cobas 6800", level: "Normal", controlMaterial: "PreciControl ClinChem", lotNumber: "QC-2026-T-018", expectedRange: "0.4–4.0", observedValue: "2.1", unit: "mIU/L", status: "Pass", runDate: "2026-07-22", runTime: "08:00", operator: "Ravi Verma", batchNumber: "B-2026-0722-03" },
  { id: "QC-005", testName: "Troponin I", analyzer: "Roche cobas 6800", level: "Critical", controlMaterial: "High Control", lotNumber: "QC-2026-H-011", expectedRange: "<0.04", observedValue: "0.03", unit: "ng/mL", status: "Pass", runDate: "2026-07-22", runTime: "08:00", operator: "Ravi Verma", batchNumber: "B-2026-0722-03" },
  { id: "QC-006", testName: "Prothrombin Time", analyzer: "Siemens Dimension", level: "Normal", controlMaterial: "Normal Control", lotNumber: "QC-2026-P-009", expectedRange: "11.0–13.5", observedValue: "14.2", unit: "sec", status: "Fail", runDate: "2026-07-22", runTime: "08:15", operator: "Sunita Kute", batchNumber: "B-2026-0722-04" },
  { id: "QC-007", testName: "Serum Creatinine", analyzer: "Beckman AU5800", level: "Normal", controlMaterial: "Normal Control", lotNumber: "QC-2026-N-045", expectedRange: "0.6–1.2", observedValue: "0.9", unit: "mg/dL", status: "Pass", runDate: "2026-07-22", runTime: "07:45", operator: "Sunita Kute", batchNumber: "B-2026-0722-02" },
  { id: "QC-008", testName: "Haemoglobin A1c", analyzer: "Siemens Dimension", level: "Normal", controlMaterial: "Normal Control", lotNumber: "QC-2026-H-011", expectedRange: "4.5–6.0", observedValue: "5.4", unit: "%", status: "Recalibration", runDate: "2026-07-22", runTime: "08:30", operator: "Ravi Verma", batchNumber: "B-2026-0722-04" },
];

/* ------------------------------------------------------------------ */
/* Result entries for specimen SP-2026-0722-001 (Rajesh Kumar)          */
/* ------------------------------------------------------------------ */

export const RESULT_ENTRIES: ResultEntry[] = [
  { specimenId: "SP-2026-0722-001", patientName: "Rajesh Kumar", uhid: "MRD-2026-004821", testName: "Haemoglobin", observedValue: "12.8", unit: "g/dL", referenceRange: "13.0–17.0", abnormalFlag: "Low", comments: "", deltaCheck: true, previousValue: "14.1" },
  { specimenId: "SP-2026-0722-001", patientName: "Rajesh Kumar", uhid: "MRD-2026-004821", testName: "WBC Count", observedValue: "8.2", unit: "×10³/µL", referenceRange: "4.5–11.0", abnormalFlag: "Normal", comments: "", deltaCheck: false },
  { specimenId: "SP-2026-0722-001", patientName: "Rajesh Kumar", uhid: "MRD-2026-004821", testName: "Platelet Count", observedValue: "185", unit: "×10³/µL", referenceRange: "150–400", abnormalFlag: "Normal", comments: "", deltaCheck: false },
  { specimenId: "SP-2026-0722-001", patientName: "Rajesh Kumar", uhid: "MRD-2026-004821", testName: "Fasting Blood Sugar", observedValue: "186", unit: "mg/dL", referenceRange: "70–100", abnormalFlag: "High", comments: "Uncontrolled diabetes — advise HbA1c review", deltaCheck: false },
  { specimenId: "SP-2026-0722-001", patientName: "Rajesh Kumar", uhid: "MRD-2026-004821", testName: "HbA1c", observedValue: "9.2", unit: "%", referenceRange: "4.5–6.0", abnormalFlag: "Critical High", comments: "Poor glycaemic control", deltaCheck: true, previousValue: "8.1" },
  { specimenId: "SP-2026-0722-001", patientName: "Rajesh Kumar", uhid: "MRD-2026-004821", testName: "Total Cholesterol", observedValue: "248", unit: "mg/dL", referenceRange: "<200", abnormalFlag: "High", comments: "", deltaCheck: false },
  { specimenId: "SP-2026-0722-001", patientName: "Rajesh Kumar", uhid: "MRD-2026-004821", testName: "LDL Cholesterol", observedValue: "168", unit: "mg/dL", referenceRange: "<100", abnormalFlag: "High", comments: "Recommend statin therapy review", deltaCheck: false },
  { specimenId: "SP-2026-0722-001", patientName: "Rajesh Kumar", uhid: "MRD-2026-004821", testName: "HDL Cholesterol", observedValue: "38", unit: "mg/dL", referenceRange: ">40", abnormalFlag: "Low", comments: "", deltaCheck: false },
  { specimenId: "SP-2026-0722-001", patientName: "Rajesh Kumar", uhid: "MRD-2026-004821", testName: "Triglycerides", observedValue: "210", unit: "mg/dL", referenceRange: "<150", abnormalFlag: "High", comments: "", deltaCheck: false },
  { specimenId: "SP-2026-0722-001", patientName: "Rajesh Kumar", uhid: "MRD-2026-004821", testName: "Troponin I", observedValue: "0.02", unit: "ng/mL", referenceRange: "<0.04", abnormalFlag: "Normal", comments: "Rule out acute MI", deltaCheck: false },
];

/* ------------------------------------------------------------------ */
/* Critical results requiring validation                               */
/* ------------------------------------------------------------------ */

export const CRITICAL_RESULTS = [
  { specimenId: "SP-2026-0722-004", patientName: "Lakshmi Iyer", uhid: "MRD-2026-004824", test: "D-Dimer", value: "2.8", unit: "µg/mL", threshold: "<0.5", doctor: "Dr. Imran Sheikh", department: "Emergency", time: "10:45 AM", status: "Pending Validation" },
  { specimenId: "SP-2026-0722-001", patientName: "Rajesh Kumar", uhid: "MRD-2026-004821", test: "HbA1c", value: "9.2", unit: "%", threshold: "4.5–6.0", doctor: "Dr. Arjun Mehta", department: "Cardiology", time: "11:00 AM", status: "Pending Validation" },
  { specimenId: "SP-2026-0722-009", patientName: "Anil Kulkarni", uhid: "MRD-2026-004833", test: "Troponin I", value: "0.58", unit: "ng/mL", threshold: "<0.04", doctor: "Dr. Imran Sheikh", department: "Emergency", time: "12:30 PM", status: "Notified" },
];

/* ------------------------------------------------------------------ */
/* Inventory                                                           */
/* ------------------------------------------------------------------ */

export const INVENTORY: InventoryItem[] = [
  { id: "INV-001", name: "Sysmex SLS-3000 Lyse", category: "Reagent", lotNumber: "R-2026-0891", expiryDate: "2027-03-15", currentStock: 24, minStock: 10, unit: "mL", supplier: "Sysmex India Pvt Ltd", lastReceived: "2026-07-01", cost: 12500 },
  { id: "INV-002", name: "Roche Troponin T Kit", category: "Kit", lotNumber: "K-2026-0442", expiryDate: "2026-12-30", currentStock: 3, minStock: 5, unit: "kit", supplier: "Roche Diagnostics India", lastReceived: "2026-06-15", cost: 45000 },
  { id: "INV-003", name: "EDTA Vacutainer (Purple)", category: "Consumable", lotNumber: "V-2026-1205", expiryDate: "2028-06-30", currentStock: 450, minStock: 200, unit: "pcs", supplier: "BD India", lastReceived: "2026-07-10", cost: 8 },
  { id: "INV-004", name: "SST Vacutainer (Gold)", category: "Consumable", lotNumber: "V-2026-1206", expiryDate: "2028-06-30", currentStock: 380, minStock: 200, unit: "pcs", supplier: "BD India", lastReceived: "2026-07-10", cost: 12 },
  { id: "INV-005", name: "Glucose Hexokinase Reagent", category: "Reagent", lotNumber: "R-2026-0788", expiryDate: "2026-11-20", currentStock: 8, minStock: 10, unit: "mL", supplier: "Beckman Coulter India", lastReceived: "2026-06-20", cost: 8200 },
  { id: "INV-006", name: "Normal Control Serum", category: "Control", lotNumber: "C-2026-0155", expiryDate: "2026-09-30", currentStock: 12, minStock: 5, unit: "vial", supplier: "Bio-Rad India", lastReceived: "2026-07-05", cost: 3200 },
  { id: "INV-007", name: "Procalcitonin Reagent", category: "Reagent", lotNumber: "R-2026-0903", expiryDate: "2027-01-15", currentStock: 2, minStock: 3, unit: "mL", supplier: "Roche Diagnostics India", lastReceived: "2026-06-28", cost: 18500 },
  { id: "INV-008", name: "Citrate Tube (Blue)", category: "Consumable", lotNumber: "V-2026-1207", expiryDate: "2028-06-30", currentStock: 320, minStock: 150, unit: "pcs", supplier: "BD India", lastReceived: "2026-07-10", cost: 10 },
  { id: "INV-009", name: "Urine Culture Media", category: "Kit", lotNumber: "K-2026-0334", expiryDate: "2026-10-25", currentStock: 15, minStock: 10, unit: "plate", supplier: "HiMedia Labs", lastReceived: "2026-07-08", cost: 180 },
  { id: "INV-010", name: "CBC Diluent", category: "Reagent", lotNumber: "R-2026-0812", expiryDate: "2027-04-10", currentStock: 18, minStock: 8, unit: "L", supplier: "Sysmex India Pvt Ltd", lastReceived: "2026-07-01", cost: 5600 },
];

/* ------------------------------------------------------------------ */
/* Equipment                                                           */
/* ------------------------------------------------------------------ */

export const EQUIPMENT: Equipment[] = [
  { id: "EQ-001", name: "Sysmex XN-1000", manufacturer: "Sysmex Corporation", model: "XN-1000", department: "Haematology", status: "Online", lastMaintenance: "2026-06-15", nextMaintenance: "2026-09-15", calibrationDue: "2026-07-30", errorCount: 0, serialNumber: "SN-SYS-2019-4521", installDate: "2019-08-20" },
  { id: "EQ-002", name: "Roche cobas 6800", manufacturer: "Roche Diagnostics", model: "cobas 6800", department: "Immunology", status: "Online", lastMaintenance: "2026-07-01", nextMaintenance: "2026-10-01", calibrationDue: "2026-08-15", errorCount: 1, serialNumber: "SN-ROC-2021-7834", installDate: "2021-03-10" },
  { id: "EQ-003", name: "Beckman Coulter AU5800", manufacturer: "Beckman Coulter", model: "AU5800", department: "Clinical Chemistry", status: "Maintenance", lastMaintenance: "2026-07-22", nextMaintenance: "2026-07-22", calibrationDue: "2026-07-22", errorCount: 2, serialNumber: "SN-BCK-2018-3190", installDate: "2018-11-05" },
  { id: "EQ-004", name: "BD Phoenix M50", manufacturer: "BD Biosciences", model: "Phoenix M50", department: "Microbiology", status: "Online", lastMaintenance: "2026-06-20", nextMaintenance: "2026-09-20", calibrationDue: "2026-08-01", errorCount: 0, serialNumber: "SN-BD-2020-5612", installDate: "2020-06-15" },
  { id: "EQ-005", name: "Siemens Dimension EXL", manufacturer: "Siemens Healthineers", model: "Dimension EXL", department: "Clinical Chemistry", status: "Online", lastMaintenance: "2026-07-10", nextMaintenance: "2026-10-10", calibrationDue: "2026-08-05", errorCount: 0, serialNumber: "SN-SIE-2022-9087", installDate: "2022-01-20" },
  { id: "EQ-006", name: "Abbott Alinity s", manufacturer: "Abbott Diagnostics", model: "Alinity s", department: "Molecular Diagnostics", status: "Error", lastMaintenance: "2026-07-15", nextMaintenance: "2026-08-15", calibrationDue: "2026-07-25", errorCount: 3, serialNumber: "SN-ABB-2023-1245", installDate: "2023-05-12" },
];

/* ------------------------------------------------------------------ */
/* Audit logs                                                          */
/* ------------------------------------------------------------------ */

export const AUDIT_LOGS: AuditEntry[] = [
  { id: "AUD-001", timestamp: "2026-07-22 08:15:00", user: "Dr. Arjun Mehta", role: "Consultant", action: "Order Created", detail: "Lab orders placed for Rajesh Kumar — CBC, Blood Sugar, HbA1c, Lipid Profile, Troponin I", specimenId: "SP-2026-0722-001", patientName: "Rajesh Kumar", ipAddress: "10.0.1.101" },
  { id: "AUD-002", timestamp: "2026-07-22 08:30:00", user: "Anita Deshmukh", role: "Phlebotomist", action: "Sample Collected", detail: "Blood drawn from left antecubital fossa — SST tube", specimenId: "SP-2026-0722-001", patientName: "Rajesh Kumar", ipAddress: "10.0.2.201" },
  { id: "AUD-003", timestamp: "2026-07-22 08:45:00", user: "Suresh Pawar", role: "Lab Technician", action: "Sample Received", detail: "Specimen received at lab — temperature verified 2–8°C", specimenId: "SP-2026-0722-001", patientName: "Rajesh Kumar", ipAddress: "10.0.3.301" },
  { id: "AUD-004", timestamp: "2026-07-22 09:00:00", user: "Ravi Verma", role: "Lab Scientist", action: "Analysis Started", detail: "Sample loaded onto Sysmex XN-1000 for CBC analysis", specimenId: "SP-2026-0722-001", patientName: "Rajesh Kumar", ipAddress: "10.0.3.302" },
  { id: "AUD-005", timestamp: "2026-07-22 09:55:00", user: "Dr. Imran Sheikh", role: "Consultant", action: "STAT Order Created", detail: "STAT orders placed for Lakshmi Iyer — D-Dimer, Troponin I, CBC, CRP, Procalcitonin", specimenId: "SP-2026-0722-004", patientName: "Lakshmi Iyer", ipAddress: "10.0.1.105" },
  { id: "AUD-006", timestamp: "2026-07-22 10:45:00", user: "Ravi Verma", role: "Lab Scientist", action: "Critical Value Detected", detail: "D-Dimer result: 2.8 µg/mL — exceeds critical threshold of 0.5", specimenId: "SP-2026-0722-004", patientName: "Lakshmi Iyer", ipAddress: "10.0.3.302" },
  { id: "AUD-007", timestamp: "2026-07-22 10:50:00", user: "Ravi Verma", role: "Lab Scientist", action: "Doctor Notified", detail: "Critical D-Dimer result communicated to Dr. Imran Sheikh by phone", specimenId: "SP-2026-0722-004", patientName: "Lakshmi Iyer", ipAddress: "10.0.3.302" },
  { id: "AUD-008", timestamp: "2026-07-22 11:00:00", user: "Dr. Imran Sheikh", role: "Consultant", action: "Critical Result Acknowledged", detail: "Read-back confirmed for D-Dimer 2.8 µg/mL", specimenId: "SP-2026-0722-004", patientName: "Lakshmi Iyer", ipAddress: "10.0.1.105" },
  { id: "AUD-009", timestamp: "2026-07-22 11:30:00", user: "Sunita Kute", role: "Lab Technician", action: "QC Failed", detail: "Prothrombin Time QC failed — expected 11.0–13.5, observed 14.2 sec. Recalibration initiated.", ipAddress: "10.0.3.303" },
  { id: "AUD-010", timestamp: "2026-07-22 12:00:00", user: "Ravi Verma", role: "Lab Scientist", action: "Result Verified", detail: "Lakshmi Iyer CBC and chemistry results verified — digitally signed", specimenId: "SP-2026-0722-004", patientName: "Lakshmi Iyer", ipAddress: "10.0.3.302" },
];

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

export function generateSpecimenId(): string {
  const n = 20260722000 + Math.floor(Math.random() * 900);
  return `SP-${n}`;
}

export function generateOrderId(): string {
  const n = 11 + Math.floor(Math.random() * 90);
  return `ORD-2026-0722-${String(n).padStart(3, "0")}`;
}

export function statusTone(s: SampleStatus): "brand" | "success" | "warning" | "danger" | "info" | "neutral" {
  switch (s) {
    case "Ordered": return "info";
    case "Collected": return "brand";
    case "In Transit": return "info";
    case "Received": return "brand";
    case "Processing": return "warning";
    case "Analyzed": return "success";
    case "Verified": return "success";
    case "Reported": return "neutral";
    case "Rejected": return "danger";
    default: return "neutral";
  }
}

export function analyzerStatusTone(s: AnalyzerStatus): "success" | "warning" | "danger" | "neutral" {
  switch (s) {
    case "Online": return "success";
    case "Idle": return "neutral";
    case "Maintenance": return "warning";
    case "Offline": return "danger";
    case "Error": return "danger";
    default: return "neutral";
  }
}

export function qcStatusTone(s: QCStatus): "success" | "danger" | "warning" | "info" {
  switch (s) {
    case "Pass": return "success";
    case "Fail": return "danger";
    case "Pending": return "warning";
    case "Recalibration": return "info";
    default: return "info";
  }
}

export function abnormalFlagTone(f: ResultEntry["abnormalFlag"]): string {
  switch (f) {
    case "Normal": return "text-success";
    case "Low": return "text-info";
    case "High": return "text-[#b45309]";
    case "Critical Low": return "text-danger";
    case "Critical High": return "text-danger";
    case "Borderline": return "text-warning";
    default: return "text-text-secondary";
  }
}

export const TEST_RANGES: Record<string, { range: string; unit: string }> = {
  "Haemoglobin": { range: "13.0–17.0", unit: "g/dL" },
  "WBC Count": { range: "4.5–11.0", unit: "×10³/µL" },
  "Platelet Count": { range: "150–400", unit: "×10³/µL" },
  "RBC Count": { range: "4.5–5.5", unit: "×10⁶/µL" },
  "Haematocrit": { range: "40–54", unit: "%" },
  "MCV": { range: "80–100", unit: "fL" },
  "MCH": { range: "27–33", unit: "pg" },
  "MCHC": { range: "32–36", unit: "g/dL" },
  "ESR": { range: "0–20", unit: "mm/hr" },
  "Blood Sugar Fasting": { range: "70–100", unit: "mg/dL" },
  "Blood Sugar PP": { range: "70–140", unit: "mg/dL" },
  "HbA1c": { range: "4.5–6.0", unit: "%" },
  "Total Cholesterol": { range: "<200", unit: "mg/dL" },
  "LDL Cholesterol": { range: "<100", unit: "mg/dL" },
  "HDL Cholesterol": { range: ">40", unit: "mg/dL" },
  "Triglycerides": { range: "<150", unit: "mg/dL" },
  "TSH": { range: "0.4–4.0", unit: "mIU/L" },
  "Free T3": { range: "2.3–4.2", unit: "pg/mL" },
  "Free T4": { range: "0.9–1.7", unit: "ng/dL" },
  "Vitamin D": { range: "30–100", unit: "ng/mL" },
  "Serum Creatinine": { range: "0.6–1.2", unit: "mg/dL" },
  "BUN": { range: "7–20", unit: "mg/dL" },
  "eGFR": { range: ">60", unit: "mL/min/1.73m²" },
  "Urea": { range: "15–40", unit: "mg/dL" },
  "Sodium": { range: "136–145", unit: "mEq/L" },
  "Potassium": { range: "3.5–5.0", unit: "mEq/L" },
  "Chloride": { range: "98–106", unit: "mEq/L" },
  "Calcium": { range: "8.5–10.5", unit: "mg/dL" },
  "Troponin I": { range: "<0.04", unit: "ng/mL" },
  "D-Dimer": { range: "<0.5", unit: "µg/mL" },
  "BNP": { range: "<100", unit: "pg/mL" },
  "CRP": { range: "<10", unit: "mg/L" },
  "Procalcitonin": { range: "<0.05", unit: "ng/mL" },
  "AST": { range: "5–40", unit: "U/L" },
  "ALT": { range: "7–56", unit: "U/L" },
  "ALP": { range: "44–147", unit: "U/L" },
  "Total Bilirubin": { range: "0.1–1.2", unit: "mg/dL" },
  "Direct Bilirubin": { range: "0.0–0.3", unit: "mg/dL" },
  "Albumin": { range: "3.5–5.0", unit: "g/dL" },
  "Urine Albumin": { range: "<30", unit: "mg/L" },
  "Urine Creatinine": { range: "20–320", unit: "mg/dL" },
};
