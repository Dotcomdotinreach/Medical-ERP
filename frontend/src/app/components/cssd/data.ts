/* ── CSSD — Central Sterile Services Department Data ───────────────────────── */

export type InstrumentStatus = "Available" | "In Use" | "Under Maintenance" | "Retired" | "Quarantined" | "In Sterilization" | "Awaiting Repair";
export type TrayStatus = "Assembled" | "Packed" | "Sterilized" | "Issued" | "Returned" | "Awaiting Assembly" | "Failed" | "Quarantined";
export type SterilityStatus = "Sterile" | "Non-Sterile" | "Expired" | "Compromised" | "Unknown";
export type CycleStatus = "Running" | "Completed" | "Failed" | "Aborted" | "Standby";
export type CleaningStatus = "Pending" | "In Progress" | "Completed" | "Failed";
export type InspectionResult = "Pass" | "Fail" | "Repair Required" | "Pending";
export type AutoclaveStatus = "Running" | "Idle" | "Standby" | "Maintenance" | "Error";
export type IssueStatus = "Requested" | "Issued" | "Returned" | "Overdue" | "Partially Returned";
export type SterilizationType = "Steam" | "Plasma" | "ETO" | "Dry Heat";
export type PackagingType = "CSR Wrap" | "Peel Pouch" | "Container" | "Vacuum Bag";
export type MaintenanceType = "Preventive" | "Corrective" | "Calibration" | "AMC" | "Emergency";

export interface Instrument {
  id: string; barcode: string; rfid: string; name: string; category: string;
  manufacturer: string; model: string; purchaseDate: string; cost: number;
  status: InstrumentStatus; currentLocation: string; lifecycleCount: number;
  maxCycles: number; maintenanceDue: string; lastCalibration: string;
  nextCalibration: string; warrantyExpiry: string;
  condition: "Excellent" | "Good" | "Fair" | "Poor" | "Retired"; department: string;
}

export const INSTRUMENTS: Instrument[] = [
  { id: "INS-001", barcode: "BC-INS-001", rfid: "RF-1001", name: "Mayo Scissors 14cm", category: "Cutting & Dissection", manufacturer: "Karl Storz", model: "MS-140", purchaseDate: "2023-01-15", cost: 4500, status: "Available", currentLocation: "CSSD Store A", lifecycleCount: 245, maxCycles: 500, maintenanceDue: "2026-09-15", lastCalibration: "2026-06-01", nextCalibration: "2026-12-01", warrantyExpiry: "2028-01-15", condition: "Good", department: "CSSD" },
  { id: "INS-002", barcode: "BC-INS-002", rfid: "RF-1002", name: "Kelly Forceps 16cm", category: "Clamping & Occlusion", manufacturer: "Aesculap", model: "KF-160", purchaseDate: "2022-06-10", cost: 3200, status: "In Use", currentLocation: "OT-1", lifecycleCount: 312, maxCycles: 500, maintenanceDue: "2026-08-10", lastCalibration: "2026-03-15", nextCalibration: "2026-09-15", warrantyExpiry: "2027-06-10", condition: "Good", department: "OT" },
  { id: "INS-003", barcode: "BC-INS-003", rfid: "RF-1003", name: "Babcock Forceps 18cm", category: "Clamping & Occlusion", manufacturer: "Karl Storz", model: "BF-180", purchaseDate: "2023-04-20", cost: 3800, status: "In Sterilization", currentLocation: "Autoclave-2", lifecycleCount: 189, maxCycles: 500, maintenanceDue: "2027-04-20", lastCalibration: "2026-07-01", nextCalibration: "2027-01-01", warrantyExpiry: "2028-04-20", condition: "Excellent", department: "CSSD" },
  { id: "INS-004", barcode: "BC-INS-004", rfid: "RF-1004", name: "Mosquito Forceps 12cm", category: "Clamping & Occlusion", manufacturer: "Aesculap", model: "MF-120", purchaseDate: "2022-09-05", cost: 2800, status: "Available", currentLocation: "CSSD Store B", lifecycleCount: 287, maxCycles: 500, maintenanceDue: "2026-09-05", lastCalibration: "2026-04-01", nextCalibration: "2026-10-01", warrantyExpiry: "2027-09-05", condition: "Good", department: "CSSD" },
  { id: "INS-005", barcode: "BC-INS-005", rfid: "RF-1005", name: "Langenbeck Retractor", category: "Retraction", manufacturer: "Medline", model: "LR-200", purchaseDate: "2021-12-01", cost: 5500, status: "Under Maintenance", currentLocation: "Biomedical Workshop", lifecycleCount: 412, maxCycles: 500, maintenanceDue: "2026-07-25", lastCalibration: "2026-01-15", nextCalibration: "2026-07-15", warrantyExpiry: "2026-12-01", condition: "Fair", department: "CSSD" },
  { id: "INS-006", barcode: "BC-INS-006", rfid: "RF-1006", name: "Army-Navy Retractor", category: "Retraction", manufacturer: "Karl Storz", model: "ANR-180", purchaseDate: "2023-02-14", cost: 4200, status: "Available", currentLocation: "CSSD Store A", lifecycleCount: 156, maxCycles: 500, maintenanceDue: "2027-02-14", lastCalibration: "2026-05-01", nextCalibration: "2026-11-01", warrantyExpiry: "2028-02-14", condition: "Excellent", department: "CSSD" },
  { id: "INS-007", barcode: "BC-INS-007", rfid: "RF-1007", name: "Metzenbaum Scissors 18cm", category: "Cutting & Dissection", manufacturer: "Aesculap", model: "MZ-180", purchaseDate: "2022-11-20", cost: 5200, status: "Quarantined", currentLocation: "Quarantine Zone", lifecycleCount: 488, maxCycles: 500, maintenanceDue: "2026-07-20", lastCalibration: "2026-02-01", nextCalibration: "2026-08-01", warrantyExpiry: "2027-11-20", condition: "Poor", department: "CSSD" },
  { id: "INS-008", barcode: "BC-INS-008", rfid: "RF-1008", name: "Needle Holder 16cm", category: "Suturing", manufacturer: "Medline", model: "NH-160", purchaseDate: "2024-01-10", cost: 6800, status: "Available", currentLocation: "CSSD Store A", lifecycleCount: 89, maxCycles: 500, maintenanceDue: "2027-01-10", lastCalibration: "2026-07-01", nextCalibration: "2027-01-01", warrantyExpiry: "2029-01-10", condition: "Excellent", department: "CSSD" },
  { id: "INS-009", barcode: "BC-INS-009", rfid: "RF-1009", name: "Allis Tissue Forceps 18cm", category: "Grasping", manufacturer: "Karl Storz", model: "AT-180", purchaseDate: "2023-06-05", cost: 3600, status: "In Use", currentLocation: "OT-3", lifecycleCount: 201, maxCycles: 500, maintenanceDue: "2027-06-05", lastCalibration: "2026-06-01", nextCalibration: "2026-12-01", warrantyExpiry: "2028-06-05", condition: "Good", department: "OT" },
  { id: "INS-010", barcode: "BC-INS-010", rfid: "RF-1010", name: "Kocher Forceps 20cm", category: "Clamping & Occlusion", manufacturer: "Aesculap", model: "KC-200", purchaseDate: "2022-04-18", cost: 3400, status: "Retired", currentLocation: "Retired Store", lifecycleCount: 500, maxCycles: 500, maintenanceDue: "N/A", lastCalibration: "2026-03-01", nextCalibration: "N/A", warrantyExpiry: "2027-04-18", condition: "Retired", department: "CSSD" },
  { id: "INS-011", barcode: "BC-INS-011", rfid: "RF-1011", name: "Deaver Retractor 25cm", category: "Retraction", manufacturer: "Medline", model: "DR-250", purchaseDate: "2023-08-22", cost: 4800, status: "Available", currentLocation: "CSSD Store B", lifecycleCount: 134, maxCycles: 500, maintenanceDue: "2027-08-22", lastCalibration: "2026-07-01", nextCalibration: "2027-01-01", warrantyExpiry: "2028-08-22", condition: "Good", department: "CSSD" },
  { id: "INS-012", barcode: "BC-INS-012", rfid: "RF-1012", name: "Weitlaner Retractor 16cm", category: "Retraction", manufacturer: "Karl Storz", model: "WR-160", purchaseDate: "2024-03-10", cost: 5100, status: "In Sterilization", currentLocation: "Autoclave-1", lifecycleCount: 67, maxCycles: 500, maintenanceDue: "2027-03-10", lastCalibration: "2026-07-15", nextCalibration: "2027-01-15", warrantyExpiry: "2029-03-10", condition: "Excellent", department: "CSSD" },
];

export interface Tray {
  id: string; name: string; procedureType: string; instrumentCount: number;
  actualCount: number; status: TrayStatus; barcode: string; rfid: string;
  version: number; sterilityStatus: SterilityStatus; expiryDate: string;
  lastSterilized: string; assignedOT?: string; assemblyTechnician: string;
  packedBy: string; sterilizedBy: string; location: string;
}

export const TRAYS: Tray[] = [
  { id: "TRAY-001", name: "General Surgery Set A", procedureType: "Laparotomy", instrumentCount: 45, actualCount: 45, status: "Sterilized", barcode: "BC-TRAY-001", rfid: "RF-T001", version: 3, sterilityStatus: "Sterile", expiryDate: "2026-07-30", lastSterilized: "2026-07-23T06:00:00", location: "Sterile Store A-12", assemblyTechnician: "Ramesh Gupta", packedBy: "Suresh Yadav", sterilizedBy: "Amit Verma" },
  { id: "TRAY-002", name: "Orthopedic Instrument Set", procedureType: "ORIF Fracture", instrumentCount: 62, actualCount: 60, status: "Assembled", barcode: "BC-TRAY-002", rfid: "RF-T002", version: 2, sterilityStatus: "Non-Sterile", expiryDate: "", lastSterilized: "", location: "Assembly Area", assemblyTechnician: "Ramesh Gupta", packedBy: "", sterilizedBy: "", assignedOT: "OT-2" },
  { id: "TRAY-003", name: "Laparoscopic Tray", procedureType: "Laparoscopic Cholecystectomy", instrumentCount: 28, actualCount: 28, status: "Issued", barcode: "BC-TRAY-003", rfid: "RF-T003", version: 5, sterilityStatus: "Sterile", expiryDate: "2026-07-29", lastSterilized: "2026-07-22T14:00:00", assignedOT: "OT-1", location: "OT-1", assemblyTechnician: "Vikram Singh", packedBy: "Suresh Yadav", sterilizedBy: "Amit Verma" },
  { id: "TRAY-004", name: "Caesarean Section Set", procedureType: "Emergency C-Section", instrumentCount: 38, actualCount: 38, status: "Returned", barcode: "BC-TRAY-004", rfid: "RF-T004", version: 4, sterilityStatus: "Non-Sterile", expiryDate: "", lastSterilized: "2026-07-21T08:00:00", location: "Decontamination Area", assemblyTechnician: "Priya Sharma", packedBy: "Suresh Yadav", sterilizedBy: "Amit Verma" },
  { id: "TRAY-005", name: "Cardiac Surgery Tray", procedureType: "CABG", instrumentCount: 78, actualCount: 78, status: "Sterilized", barcode: "BC-TRAY-005", rfid: "RF-T005", version: 6, sterilityStatus: "Sterile", expiryDate: "2026-08-01", lastSterilized: "2026-07-23T04:00:00", location: "Sterile Store A-05", assemblyTechnician: "Vikram Singh", packedBy: "Suresh Yadav", sterilizedBy: "Amit Verma" },
  { id: "TRAY-006", name: "Minor Surgery Tray", procedureType: "Excision Biopsy", instrumentCount: 18, actualCount: 18, status: "Packed", barcode: "BC-TRAY-006", rfid: "RF-T006", version: 2, sterilityStatus: "Non-Sterile", expiryDate: "", lastSterilized: "", location: "Packing Area", assemblyTechnician: "Priya Sharma", packedBy: "Suresh Yadav", sterilizedBy: "" },
  { id: "TRAY-007", name: "Neurosurgery Tray", procedureType: "Craniotomy", instrumentCount: 85, actualCount: 84, status: "Failed", barcode: "BC-TRAY-007", rfid: "RF-T007", version: 3, sterilityStatus: "Compromised", expiryDate: "", lastSterilized: "2026-07-22T22:00:00", location: "Quarantine Zone", assemblyTechnician: "Ramesh Gupta", packedBy: "Suresh Yadav", sterilizedBy: "Amit Verma" },
  { id: "TRAY-008", name: "ENT Set", procedureType: "Tonsillectomy", instrumentCount: 22, actualCount: 22, status: "Sterilized", barcode: "BC-TRAY-008", rfid: "RF-T008", version: 2, sterilityStatus: "Sterile", expiryDate: "2026-07-31", lastSterilized: "2026-07-23T08:00:00", location: "Sterile Store B-08", assemblyTechnician: "Priya Sharma", packedBy: "Suresh Yadav", sterilizedBy: "Amit Verma" },
  { id: "TRAY-009", name: "Urology Tray", procedureType: "TURP", instrumentCount: 35, actualCount: 35, status: "Awaiting Assembly", barcode: "BC-TRAY-009", rfid: "RF-T009", version: 1, sterilityStatus: "Non-Sterile", expiryDate: "", lastSterilized: "", location: "Inspection Area", assemblyTechnician: "", packedBy: "", sterilizedBy: "" },
  { id: "TRAY-010", name: "Ophthalmic Tray", procedureType: "Cataract Surgery", instrumentCount: 30, actualCount: 30, status: "Sterilized", barcode: "BC-TRAY-010", rfid: "RF-T010", version: 4, sterilityStatus: "Sterile", expiryDate: "2026-08-02", lastSterilized: "2026-07-23T02:00:00", location: "Sterile Store A-01", assemblyTechnician: "Vikram Singh", packedBy: "Suresh Yadav", sterilizedBy: "Amit Verma" },
];

export interface Autoclave {
  id: string; name: string; model: string; manufacturer: string; status: AutoclaveStatus;
  currentCycle?: string; temperature: number; pressure: number;
  cycleTimeRemaining: number; totalCycleTime: number; cyclesCompleted: number;
  lastMaintenance: string; nextMaintenance: string; location: string; error?: string;
}

export const AUTOCLAVES: Autoclave[] = [
  { id: "ACL-001", name: "Autoclave-1", model: "HS 66", manufacturer: "Getinge", status: "Running", currentCycle: "Steam - General Surgery Set", temperature: 134, pressure: 2.1, cycleTimeRemaining: 8, totalCycleTime: 45, cyclesCompleted: 12, lastMaintenance: "2026-07-01", nextMaintenance: "2026-10-01", location: "CSSD Sterilization Room" },
  { id: "ACL-002", name: "Autoclave-2", model: "HS 66", manufacturer: "Getinge", status: "Running", currentCycle: "Steam - Cardiac Tray", temperature: 134, pressure: 2.1, cycleTimeRemaining: 22, totalCycleTime: 60, cyclesCompleted: 8, lastMaintenance: "2026-07-01", nextMaintenance: "2026-10-01", location: "CSSD Sterilization Room" },
  { id: "ACL-003", name: "Autoclave-3", model: "V-HP", manufacturer: "Steris", status: "Idle", temperature: 22, pressure: 0, cycleTimeRemaining: 0, totalCycleTime: 0, cyclesCompleted: 15, lastMaintenance: "2026-06-15", nextMaintenance: "2026-09-15", location: "CSSD Sterilization Room" },
  { id: "ACL-004", name: "Plasma Sterilizer", model: "STERRAD 100S", manufacturer: "ASP", status: "Standby", temperature: 50, pressure: 0, cycleTimeRemaining: 0, totalCycleTime: 0, cyclesCompleted: 6, lastMaintenance: "2026-06-20", nextMaintenance: "2026-09-20", location: "CSSD Sterilization Room" },
  { id: "ACL-005", name: "ETO Chamber", model: "EO 2000", manufacturer: "Steris", status: "Maintenance", error: "Seal replacement required", temperature: 0, pressure: 0, cycleTimeRemaining: 0, totalCycleTime: 0, cyclesCompleted: 0, lastMaintenance: "2026-07-20", nextMaintenance: "2026-07-25", location: "CSSD Sterilization Room" },
];

export interface SterilizationCycle {
  id: string; batchNumber: string; autoclaveId: string; autoclaveName: string;
  type: SterilizationType; loadDetails: string; trayIds: string[];
  operator: string; startTime: string; endTime?: string; status: CycleStatus;
  temperature: number; pressure: number; exposureTime: number; dryTime: number;
  totalCycleTime: number; biologicalIndicator?: string; chemicalIndicator?: string;
  bowieDickTest?: string; notes?: string;
}

export const CYCLES: SterilizationCycle[] = [
  { id: "CYC-001", batchNumber: "BN-2026-07-042", autoclaveId: "ACL-001", autoclaveName: "Autoclave-1", type: "Steam", loadDetails: "General Surgery Set A + ENT Set", trayIds: ["TRAY-001", "TRAY-008"], operator: "Amit Verma", startTime: "2026-07-23T06:00:00", endTime: "2026-07-23T06:45:00", status: "Completed", temperature: 134, pressure: 2.1, exposureTime: 18, dryTime: 15, totalCycleTime: 45, biologicalIndicator: "Pass", chemicalIndicator: "Pass", bowieDickTest: "Pass" },
  { id: "CYC-002", batchNumber: "BN-2026-07-043", autoclaveId: "ACL-002", autoclaveName: "Autoclave-2", type: "Steam", loadDetails: "Cardiac Surgery Tray", trayIds: ["TRAY-005"], operator: "Amit Verma", startTime: "2026-07-23T04:00:00", endTime: "2026-07-23T05:00:00", status: "Completed", temperature: 134, pressure: 2.1, exposureTime: 25, dryTime: 20, totalCycleTime: 60, biologicalIndicator: "Pass", chemicalIndicator: "Pass", bowieDickTest: "Pass" },
  { id: "CYC-003", batchNumber: "BN-2026-07-044", autoclaveId: "ACL-001", autoclaveName: "Autoclave-1", type: "Steam", loadDetails: "Ophthalmic Tray", trayIds: ["TRAY-010"], operator: "Amit Verma", startTime: "2026-07-23T02:00:00", endTime: "2026-07-23T02:45:00", status: "Completed", temperature: 134, pressure: 2.1, exposureTime: 18, dryTime: 15, totalCycleTime: 45, biologicalIndicator: "Pass", chemicalIndicator: "Pass", bowieDickTest: "Pass" },
  { id: "CYC-004", batchNumber: "BN-2026-07-045", autoclaveId: "ACL-002", autoclaveName: "Autoclave-2", type: "Steam", loadDetails: "Neurosurgery Tray (REJECTED - Biological Indicator FAIL)", trayIds: ["TRAY-007"], operator: "Amit Verma", startTime: "2026-07-22T22:00:00", endTime: "2026-07-22T23:00:00", status: "Failed", temperature: 134, pressure: 2.1, exposureTime: 25, dryTime: 20, totalCycleTime: 60, biologicalIndicator: "FAIL", chemicalIndicator: "Pass", bowieDickTest: "Pass", notes: "Biological indicator showed growth after incubation. Tray quarantined." },
  { id: "CYC-005", batchNumber: "BN-2026-07-046", autoclaveId: "ACL-001", autoclaveName: "Autoclave-1", type: "Steam", loadDetails: "General Surgery Set A + Minor Surgery Tray", trayIds: ["TRAY-001", "TRAY-006"], operator: "Amit Verma", startTime: "2026-07-23T10:00:00", status: "Running", temperature: 134, pressure: 2.1, exposureTime: 18, dryTime: 15, totalCycleTime: 45 },
  { id: "CYC-006", batchNumber: "BN-2026-07-041", autoclaveId: "ACL-004", autoclaveName: "Plasma Sterilizer", type: "Plasma", loadDetails: "Laparoscopic Tray (heat-sensitive)", trayIds: ["TRAY-003"], operator: "Vikram Singh", startTime: "2026-07-22T14:00:00", endTime: "2026-07-22T16:00:00", status: "Completed", temperature: 50, pressure: 0, exposureTime: 60, dryTime: 30, totalCycleTime: 120, biologicalIndicator: "Pass", chemicalIndicator: "Pass" },
];

export interface DepartmentRequest {
  id: string; department: string; requestedBy: string; procedureType: string;
  trayId: string; trayName: string; requestedTime: string; requiredTime: string;
  status: IssueStatus; priority: "Emergency" | "Urgent" | "Routine";
  issuedTime?: string; returnedTime?: string;
  missingInstruments?: string[]; damagedInstruments?: string[];
}

export const DEPT_REQUESTS: DepartmentRequest[] = [
  { id: "REQ-001", department: "OT-1", requestedBy: "Dr. Rajesh Mehta", procedureType: "Laparoscopic Cholecystectomy", trayId: "TRAY-003", trayName: "Laparoscopic Tray", requestedTime: "2026-07-22T10:00:00", requiredTime: "2026-07-22T12:00:00", status: "Issued", priority: "Urgent", issuedTime: "2026-07-22T11:30:00" },
  { id: "REQ-002", department: "OT-2", requestedBy: "Dr. Suresh Kumar", procedureType: "ORIF Femur Fracture", trayId: "TRAY-002", trayName: "Orthopedic Instrument Set", requestedTime: "2026-07-23T08:00:00", requiredTime: "2026-07-23T10:00:00", status: "Requested", priority: "Urgent" },
  { id: "REQ-003", department: "OT-3", requestedBy: "Dr. Priya Sharma", procedureType: "Emergency C-Section", trayId: "TRAY-004", trayName: "Caesarean Section Set", requestedTime: "2026-07-21T02:00:00", requiredTime: "2026-07-21T02:30:00", status: "Returned", priority: "Emergency", issuedTime: "2026-07-21T02:15:00", returnedTime: "2026-07-21T05:30:00" },
  { id: "REQ-004", department: "Emergency", requestedBy: "Dr. Meera Joshi", procedureType: "Emergency Thoracotomy", trayId: "TRAY-001", trayName: "General Surgery Set A", requestedTime: "2026-07-23T03:00:00", requiredTime: "2026-07-23T03:15:00", status: "Issued", priority: "Emergency", issuedTime: "2026-07-23T03:10:00" },
  { id: "REQ-005", department: "OT-1", requestedBy: "Dr. Kavita Singh", procedureType: "Cataract Surgery", trayId: "TRAY-010", trayName: "Ophthalmic Tray", requestedTime: "2026-07-23T09:00:00", requiredTime: "2026-07-23T11:00:00", status: "Requested", priority: "Routine" },
  { id: "REQ-006", department: "ICU", requestedBy: "Nurse Kavita Iyer", procedureType: "Bedside Procedure Kit", trayId: "TRAY-006", trayName: "Minor Surgery Tray", requestedTime: "2026-07-23T07:00:00", requiredTime: "2026-07-23T08:00:00", status: "Requested", priority: "Urgent" },
];

export interface DecontaminationRecord {
  id: string; trayId: string; trayName: string; receivedFrom: string;
  receivedTime: string; operator: string; sortingComplete: boolean;
  preCleaned: boolean; disinfected: boolean; decontaminationComplete: boolean;
  status: CleaningStatus; startTime: string; endTime?: string; notes: string;
}

export const DECONTAMINATION: DecontaminationRecord[] = [
  { id: "DEC-001", trayId: "TRAY-004", trayName: "Caesarean Section Set", receivedFrom: "OT-3", receivedTime: "2026-07-21T05:35:00", operator: "Ramesh Gupta", sortingComplete: true, preCleaned: true, disinfected: true, decontaminationComplete: true, status: "Completed", startTime: "2026-07-21T05:40:00", endTime: "2026-07-21T06:15:00", notes: "Heavy blood contamination - extended pre-clean" },
  { id: "DEC-002", trayId: "TRAY-007", trayName: "Neurosurgery Tray", receivedFrom: "OT-2", receivedTime: "2026-07-22T23:15:00", operator: "Ramesh Gupta", sortingComplete: true, preCleaned: true, disinfected: true, decontaminationComplete: true, status: "Completed", startTime: "2026-07-22T23:20:00", endTime: "2026-07-22T23:55:00", notes: "Returned from failed sterilization - reprocessing" },
  { id: "DEC-003", trayId: "TRAY-009", trayName: "Urology Tray", receivedFrom: "OT-1", receivedTime: "2026-07-23T08:30:00", operator: "Vikram Singh", sortingComplete: true, preCleaned: true, disinfected: false, decontaminationComplete: false, status: "In Progress", startTime: "2026-07-23T08:35:00", notes: "Routine decontamination" },
];

export interface QualityRecord {
  id: string; type: string; testDate: string; batchNumber: string;
  autoclaveId: string; autoclaveName: string; operator: string;
  result: "Pass" | "Fail" | "Pending"; notes: string;
}

export const QUALITY_RECORDS: QualityRecord[] = [
  { id: "QC-001", type: "Biological Indicator", testDate: "2026-07-23T07:00:00", batchNumber: "BN-2026-07-042", autoclaveId: "ACL-001", autoclaveName: "Autoclave-1", operator: "Amit Verma", result: "Pass", notes: "Geobacillus stearothermophilus — no growth after 48h incubation" },
  { id: "QC-002", type: "Biological Indicator", testDate: "2026-07-23T05:00:00", batchNumber: "BN-2026-07-043", autoclaveId: "ACL-002", autoclaveName: "Autoclave-2", operator: "Amit Verma", result: "Pass", notes: "Geobacillus stearothermophilus — no growth after 48h incubation" },
  { id: "QC-003", type: "Biological Indicator", testDate: "2026-07-22T23:00:00", batchNumber: "BN-2026-07-045", autoclaveId: "ACL-002", autoclaveName: "Autoclave-2", operator: "Amit Verma", result: "Fail", notes: "Biological indicator positive — tray quarantined. Autoclave inspection ordered." },
  { id: "QC-004", type: "Bowie-Dick Test", testDate: "2026-07-23T06:00:00", batchNumber: "N/A", autoclaveId: "ACL-001", autoclaveName: "Autoclave-1", operator: "Amit Verma", result: "Pass", notes: "Uniform color change across test sheet — steam penetration adequate" },
  { id: "QC-005", type: "Bowie-Dick Test", testDate: "2026-07-23T04:00:00", batchNumber: "N/A", autoclaveId: "ACL-002", autoclaveName: "Autoclave-2", operator: "Amit Verma", result: "Pass", notes: "Uniform color change — steam penetration confirmed" },
  { id: "QC-006", type: "Chemical Indicator", testDate: "2026-07-23T06:45:00", batchNumber: "BN-2026-07-042", autoclaveId: "ACL-001", autoclaveName: "Autoclave-1", operator: "Amit Verma", result: "Pass", notes: "All internal chemical indicators reached endpoint" },
  { id: "QC-007", type: "Sterility Validation", testDate: "2026-07-20", batchNumber: "BN-2026-07-038", autoclaveId: "ACL-001", autoclaveName: "Autoclave-1", operator: "Amit Verma", result: "Pass", notes: "Quarterly sterility validation — all samples negative" },
];

export interface MaintenanceRecord {
  id: string; equipmentId: string; equipmentName: string; type: MaintenanceType;
  description: string; scheduledDate: string; completedDate?: string;
  status: "Scheduled" | "In Progress" | "Completed" | "Overdue";
  technician: string; cost: number; notes: string;
}

export const MAINTENANCE: MaintenanceRecord[] = [
  { id: "MNT-001", equipmentId: "ACL-001", equipmentName: "Autoclave-1", type: "Preventive", description: "Quarterly PM — seal inspection, gasket check, calibration", scheduledDate: "2026-10-01", status: "Scheduled", technician: "Biomedical Team", cost: 15000, notes: "Scheduled quarterly" },
  { id: "MNT-002", equipmentId: "ACL-005", equipmentName: "ETO Chamber", type: "Corrective", description: "Seal replacement — ETO gas leak detected during cycle", scheduledDate: "2026-07-25", status: "Scheduled", technician: "Steris Service", cost: 45000, notes: "Vendor service engineer visiting on 25th July" },
  { id: "MNT-003", equipmentId: "INS-005", equipmentName: "Langenbeck Retractor (INS-005)", type: "Calibration", description: "Spring mechanism calibration — tension inconsistent", scheduledDate: "2026-07-22", completedDate: "2026-07-22", status: "Completed", technician: "Biomedical Team", cost: 2000, notes: "Calibrated — returned to CSSD" },
  { id: "MNT-004", equipmentId: "ACL-002", equipmentName: "Autoclave-2", type: "AMC", description: "Annual Maintenance Contract — full service", scheduledDate: "2026-07-01", completedDate: "2026-07-01", status: "Completed", technician: "Getinge Service", cost: 180000, notes: "Annual AMC renewed" },
  { id: "MNT-005", equipmentId: "ACL-003", equipmentName: "Autoclave-3", type: "Preventive", description: "Monthly PM — filter cleaning, water quality check", scheduledDate: "2026-07-15", completedDate: "2026-07-15", status: "Completed", technician: "Biomedical Team", cost: 5000, notes: "Completed — all parameters normal" },
  { id: "MNT-006", equipmentId: "INS-007", equipmentName: "Metzenbaum Scissors (INS-007)", type: "Emergency", description: "Blade alignment repair — cutting edge damaged", scheduledDate: "2026-07-20", status: "Scheduled", technician: "External Vendor", cost: 3500, notes: "Awaiting vendor pickup" },
];

export interface AuditLog {
  id: string; timestamp: string; user: string; action: string; resource: string;
  details: string; severity: "Info" | "Warning" | "Critical";
}

export const AUDIT_LOGS: AuditLog[] = [
  { id: "AUD-001", timestamp: "2026-07-23T06:45:00", user: "Amit Verma", action: "Cycle Complete", resource: "CYC-001", details: "Steam sterilization completed — Batch BN-2026-07-042 — All indicators PASS", severity: "Info" },
  { id: "AUD-002", timestamp: "2026-07-23T06:00:00", user: "Amit Verma", action: "Cycle Started", resource: "CYC-005", details: "Steam cycle started — Autoclave-1 — General Surgery Set A + Minor Surgery Tray", severity: "Info" },
  { id: "AUD-003", timestamp: "2026-07-23T03:10:00", user: "Ramesh Gupta", action: "Tray Issued", resource: "REQ-004", details: "Emergency release — General Surgery Set A issued to Emergency — Dr. Meera Joshi", severity: "Warning" },
  { id: "AUD-004", timestamp: "2026-07-22T23:00:00", user: "Amit Verma", action: "Cycle Failed", resource: "CYC-004", details: "Biological indicator FAIL — Batch BN-2026-07-045 — Neurosurgery Tray quarantined", severity: "Critical" },
  { id: "AUD-005", timestamp: "2026-07-22T16:00:00", user: "Vikram Singh", action: "Cycle Complete", resource: "CYC-006", details: "Plasma sterilization completed — Batch BN-2026-07-041 — Laparoscopic Tray", severity: "Info" },
  { id: "AUD-006", timestamp: "2026-07-22T11:30:00", user: "Suresh Yadav", action: "Tray Issued", resource: "REQ-001", details: "Laparoscopic Tray issued to OT-1 — Dr. Rajesh Mehta — Laparoscopic Cholecystectomy", severity: "Info" },
  { id: "AUD-007", timestamp: "2026-07-21T05:35:00", user: "Ramesh Gupta", action: "Received", resource: "DEC-001", details: "Caesarean Section Set received from OT-3 — heavy blood contamination", severity: "Info" },
  { id: "AUD-008", timestamp: "2026-07-20T10:00:00", user: "Ramesh Gupta", action: "Instrument Retired", resource: "INS-010", details: "Kocher Forceps INS-010 retired — reached max lifecycle (500 cycles)", severity: "Warning" },
];

/* ── CSSD KPIs ────────────────────────────────────────────────────────────── */
export const CSSD_KPI = {
  todayCycles: 6,
  completedCycles: 4,
  runningCycles: 1,
  failedCycles: 1,
  pendingReturns: 2,
  availableSterileTrays: 4,
  totalInstruments: 12,
  quarantinedInstruments: 1,
  maintenanceDue: 2,
  otRequests: 3,
  emergencyRequests: 1,
  avgTurnaroundTime: 3.5,
  sterilizationCompliance: 98.5,
  instrumentUtilization: 78,
  trayUtilization: 82,
};

/* ── Helpers ──────────────────────────────────────────────────────────────── */
export function instrumentStatusTone(s: InstrumentStatus): "success" | "warning" | "danger" | "info" {
  switch (s) { case "Available": return "success"; case "In Use": case "In Sterilization": return "info"; case "Under Maintenance": case "Awaiting Repair": return "warning"; case "Quarantined": case "Retired": return "danger"; default: return "info"; }
}
export function trayStatusTone(s: TrayStatus): "success" | "warning" | "danger" | "info" {
  switch (s) { case "Sterilized": return "success"; case "Issued": case "Returned": return "info"; case "Assembled": case "Packed": return "warning"; case "Failed": case "Quarantined": return "danger"; default: return "warning"; }
}
export function sterilityTone(s: SterilityStatus): "success" | "warning" | "danger" | "info" {
  switch (s) { case "Sterile": return "success"; case "Non-Sterile": return "warning"; case "Expired": case "Compromised": return "danger"; default: return "info"; }
}
export function cycleStatusTone(s: CycleStatus): "success" | "warning" | "danger" | "info" {
  switch (s) { case "Completed": return "success"; case "Running": return "info"; case "Failed": case "Aborted": return "danger"; default: return "warning"; }
}
export function autoclaveStatusTone(s: AutoclaveStatus): "success" | "warning" | "danger" | "info" {
  switch (s) { case "Idle": case "Standby": return "success"; case "Running": return "info"; case "Maintenance": case "Error": return "danger"; default: return "info"; }
}
export function issueStatusTone(s: IssueStatus): "success" | "warning" | "danger" | "info" {
  switch (s) { case "Issued": return "success"; case "Requested": return "info"; case "Returned": return "info"; case "Overdue": return "danger"; default: return "warning"; }
}
export function priorityTone(p: string): "success" | "warning" | "danger" | "info" {
  switch (p) { case "Emergency": return "danger"; case "Urgent": return "warning"; default: return "success"; }
}
export function formatCurrency(n: number): string { return `Rs.${n.toLocaleString("en-IN")}`; }
