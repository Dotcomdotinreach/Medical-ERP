/* ------------------------------------------------------------------ */
/* Ambulance Driver & Emergency Response — Mock Data                    */
/* Meridian Multi-Speciality Hospital, Pune                             */
/* ------------------------------------------------------------------ */

export type DispatchPriority = "Code Red" | "Code Yellow" | "Code Green";
export type DispatchStatus = "Pending" | "Accepted" | "En Route" | "On Scene" | "Transporting" | "At Hospital" | "Completed" | "Cancelled" | "Rejected";
export type TripStatus = "Active" | "Completed" | "Cancelled";
export type ShiftStatus = "On Duty" | "Off Duty" | "On Break";
export type VehicleStatus = "Available" | "Dispatched" | "In Service" | "Under Maintenance" | "Out of Service";
export type AlertType = "Dispatch" | "Route Change" | "Hospital" | "Equipment" | "Shift" | "Maintenance" | "System";
export type GCSLevel = "E1" | "E2" | "E3" | "E4" | "V1" | "V2" | "V3" | "V4" | "V5" | "M1" | "M2" | "M3" | "M4" | "M5" | "M6";
export type CaseOutcome = "Transported" | "Treated & Released" | "Patient Refused" | "Deceased" | "Cancelled";

export interface Driver {
  id: string;
  employeeId: string;
  name: string;
  phone: string;
  licenseNumber: string;
  licenseExpiry: string;
  certification: string;
  experience: number;
  rating: number;
  totalTrips: number;
  shiftStatus: ShiftStatus;
  avatar?: string;
}

export interface Ambulance {
  id: string;
  vehicleNumber: string;
  vehicleType: "ALS" | "BLS" | "NICU" | "MHEV";
  model: string;
  year: number;
  fuelLevel: number;
  mileage: number;
  status: VehicleStatus;
  lastServiceDate: string;
  nextServiceDate: string;
  equipment: EquipmentItem[];
  gpsEnabled: boolean;
  currentLat: number;
  currentLng: number;
}

export interface EquipmentItem {
  id: string;
  name: string;
  status: "OK" | "Low" | "Missing" | "Expired";
  quantity?: number;
  expiryDate?: string;
}

export interface Incident {
  id: string;
  incidentNumber: string;
  priority: DispatchPriority;
  status: DispatchStatus;
  callTime: string;
  acceptedTime?: string;
  enRouteTime?: string;
  onSceneTime?: string;
  atHospitalTime?: string;
  completedTime?: string;
  callerName: string;
  callerPhone: string;
  location: string;
  locationLat: number;
  locationLng: number;
  destinationHospital: string;
  hospitalLat: number;
  hospitalLng: number;
  patientName: string;
  patientAge: number;
  patientGender: "Male" | "Female";
  chiefComplaint: string;
  mechanismOfInjury?: string;
  triageTag?: string;
  assignedAmbulance?: string;
  assignedDriver?: string;
  distance?: number;
  eta?: number;
}

export interface VitalSigns {
  id: string;
  incidentId: string;
  timestamp: string;
  heartRate: number;
  systolic: number;
  diastolic: number;
  spo2: number;
  respiratoryRate: number;
  temperature: number;
  bloodGlucose: number;
  painScore: number;
  gcsEye: number;
  gcsVerbal: number;
  gcsMotor: number;
  gcsTotal: number;
  rhythm?: string;
}

export interface Treatment {
  id: string;
  incidentId: string;
  timestamp: string;
  type: string;
  description: string;
  medication?: string;
  dosage?: string;
  route?: string;
  administeredBy: string;
  notes?: string;
}

export interface PreNotification {
  id: string;
  incidentId: string;
  hospitalName: string;
  receivingDoctor: string;
  eta: number;
  patientSummary: string;
  chiefComplaint: string;
  vitalSummary: string;
  treatmentsGiven: string;
  alertType?: "Trauma" | "Stroke" | "STEMI" | "General";
  submittedAt: string;
  acknowledged: boolean;
}

export interface HandoverRecord {
  id: string;
  incidentId: string;
  receivingDoctor: string;
  receivingNurse: string;
  handoverTime: string;
  patientCondition: string;
  vitalsSummary: string;
  treatmentsSummary: string;
  medicationsGiven: string;
  attachments: string[];
  digitalSignature: boolean;
  confirmedByDoctor: boolean;
}

export interface FuelLog {
  id: string;
  vehicleId: string;
  date: string;
  fuelAmount: number;
  fuelCost: number;
  mileage: number;
  odometer: number;
  filledBy: string;
}

export interface VehicleInspection {
  id: string;
  vehicleId: string;
  date: string;
  driverId: string;
  tyres: "OK" | "Issue";
  lights: "OK" | "Issue";
  oxygenCylinders: "OK" | "Issue";
  defibrillator: "OK" | "Issue";
  monitor: "OK" | "Issue";
  suctionUnit: "OK" | "Issue";
  firstAidKit: "OK" | "Issue";
  stretcher: "OK" | "Issue";
  medicalSupplies: "OK" | "Issue";
  overallResult: "Pass" | "Fail" | "Conditional";
  notes?: string;
}

export interface Notification {
  id: string;
  type: AlertType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: "Critical" | "High" | "Medium" | "Low";
  incidentId?: string;
}

export interface TripRecord {
  id: string;
  incidentId: string;
  tripNumber: string;
  vehicleNumber: string;
  driverName: string;
  dispatchTime: string;
  arrivalTime: string;
  departureTime: string;
  tripDuration: number;
  distance: number;
  fuelUsed: number;
  outcome: CaseOutcome;
  patientName: string;
  hospitalName: string;
}

/* ------------------------------------------------------------------ */
/* Driver Profile                                                       */
/* ------------------------------------------------------------------ */

export const DRIVER: Driver = {
  id: "DRV-001",
  employeeId: "EMP-AMB-2024-0187",
  name: "Vikram Jadhav",
  phone: "+91 98765 43250",
  licenseNumber: "MH-12-2024-EMT-0187",
  licenseExpiry: "2028-03-15",
  certification: "ACLS + PALS Certified",
  experience: 8,
  rating: 4.8,
  totalTrips: 1247,
  shiftStatus: "On Duty",
};

/* ------------------------------------------------------------------ */
/* Ambulance Fleet                                                      */
/* ------------------------------------------------------------------ */

export const AMBULANCE: Ambulance = {
  id: "AMB-001",
  vehicleNumber: "MH-12-A-4521",
  vehicleType: "ALS",
  model: "Mercedes Sprinter 315 CDI",
  year: 2024,
  fuelLevel: 78,
  mileage: 34250,
  status: "Available",
  lastServiceDate: "2026-07-10",
  nextServiceDate: "2026-08-10",
  gpsEnabled: true,
  currentLat: 18.5204,
  currentLng: 73.8567,
  equipment: [
    { id: "EQ-001", name: "Defibrillator (Zoll X Series)", status: "OK" },
    { id: "EQ-002", name: "Patient Monitor (Masimo)", status: "OK" },
    { id: "EQ-003", name: "Suction Unit", status: "OK" },
    { id: "EQ-004", name: "Oxygen Cylinder (10L)", status: "OK", quantity: 2 },
    { id: "EQ-005", name: "IV Kit", status: "OK", quantity: 10 },
    { id: "EQ-006", name: "Spinal Board", status: "OK" },
    { id: "EQ-007", name: "Cervical Collar Set", status: "OK" },
    { id: "EQ-008", name: "First Aid Kit", status: "OK" },
    { id: "EQ-009", name: "Medication Bag", status: "OK" },
    { id: "EQ-010", name: "Stretcher (Powered)", status: "OK" },
    { id: "EQ-011", name: "Bag Valve Mask", status: "OK" },
    { id: "EQ-012", name: "Intubation Kit", status: "OK" },
  ],
};

/* ------------------------------------------------------------------ */
/* Active Incidents                                                     */
/* ------------------------------------------------------------------ */

export const INCIDENTS: Incident[] = [
  { id: "INC-001", incidentNumber: "EMS-2026-08934", priority: "Code Red", status: "Pending", callTime: "2026-07-23 14:32:00", callerName: "Rajesh Patil", callerPhone: "+91 98765 43210", location: "Pune-Mumbai Expressway, Km 42, Near Toll Plaza", locationLat: 18.5804, locationLng: 73.7867, destinationHospital: "Meridian Multi-Speciality Hospital", hospitalLat: 18.5204, hospitalLng: 73.8567, patientName: "Suresh Kumar", patientAge: 45, patientGender: "Male", chiefComplaint: "Road Traffic Accident — multiple injuries, conscious but distressed", mechanismOfInjury: "Head-on collision with truck", assignedAmbulance: "MH-12-A-4521", distance: 12.4, eta: 18 },
  { id: "INC-002", incidentNumber: "EMS-2026-08931", priority: "Code Red", status: "Accepted", callTime: "2026-07-23 14:15:00", acceptedTime: "2026-07-23 14:16:30", callerName: "Priya Sharma", callerPhone: "+91 98765 43211", location: "Koregaon Park, Lane 7, House No. 42", locationLat: 18.5362, locationLng: 73.8932, destinationHospital: "Meridian Multi-Speciality Hospital", hospitalLat: 18.5204, hospitalLng: 73.8567, patientName: "Vikram Sharma", patientAge: 62, patientGender: "Male", chiefComplaint: "Acute chest pain, suspected cardiac event — diaphoretic, BP 160/100", mechanismOfInjury: "Non-traumatic — spontaneous onset", assignedAmbulance: "MH-12-A-4521", assignedDriver: "DRV-001", distance: 3.2, eta: 8 },
  { id: "INC-003", incidentNumber: "EMS-2026-08928", priority: "Code Yellow", status: "En Route", callTime: "2026-07-23 13:50:00", acceptedTime: "2026-07-23 13:51:00", enRouteTime: "2026-07-23 13:53:00", callerName: "Amit Deshmukh", callerPhone: "+91 98765 43212", location: "Viman Nagar, Marvel Circle, Pune", locationLat: 18.5679, locationLng: 73.9143, destinationHospital: "Meridian Multi-Speciality Hospital", hospitalLat: 18.5204, hospitalLng: 73.8567, patientName: "Ananya Deshmukh", patientAge: 28, patientGender: "Female", chiefComplaint: "Ante-partum haemorrhage — 32 weeks pregnant", mechanismOfInjury: "Obstetric emergency", assignedAmbulance: "MH-12-B-3387", assignedDriver: "DRV-002", distance: 6.8, eta: 14 },
  { id: "INC-004", incidentNumber: "EMS-2026-08920", priority: "Code Green", status: "Completed", callTime: "2026-07-23 11:20:00", acceptedTime: "2026-07-23 11:21:00", enRouteTime: "2026-07-23 11:23:00", onSceneTime: "2026-07-23 11:35:00", atHospitalTime: "2026-07-23 11:58:00", completedTime: "2026-07-23 12:10:00", callerName: "Sunita Kulkarni", callerPhone: "+91 98765 43213", location: "Kothrud, Karve Road, Pune", locationLat: 18.5074, locationLng: 73.8077, destinationHospital: "Meridian Multi-Speciality Hospital", hospitalLat: 18.5204, hospitalLng: 73.8567, patientName: "Ganesh Kulkarni", patientAge: 72, patientGender: "Male", chiefComplaint: "Fall from height — hip fracture, conscious and oriented", mechanismOfInjury: "Fall from staircase", assignedAmbulance: "MH-12-A-4521", assignedDriver: "DRV-001", distance: 4.5, eta: 0 },
  { id: "INC-005", incidentNumber: "EMS-2026-08918", priority: "Code Yellow", status: "Completed", callTime: "2026-07-23 10:45:00", acceptedTime: "2026-07-23 10:46:00", enRouteTime: "2026-07-23 10:48:00", onSceneTime: "2026-07-23 11:00:00", atHospitalTime: "2026-07-23 11:22:00", completedTime: "2026-07-23 11:35:00", callerName: "Meena Devi", callerPhone: "+91 98765 43214", location: "Hadapsar, Magarpatta Road, Pune", locationLat: 18.5016, locationLng: 73.9320, destinationHospital: "Meridian Multi-Speciality Hospital", hospitalLat: 18.5204, hospitalLng: 73.8567, patientName: "Ravi Shankar", patientAge: 34, patientGender: "Male", chiefComplaint: "Seizure — generalized tonic-clonic, post-ictal state", mechanismOfInjury: "Known epilepsy — missed medication", assignedAmbulance: "MH-12-B-3387", assignedDriver: "DRV-002", distance: 8.1, eta: 0 },
  { id: "INC-006", incidentNumber: "EMS-2026-08940", priority: "Code Red", status: "Pending", callTime: "2026-07-23 14:38:00", callerName: "Hospital Dispatch", callerPhone: "+91 20 2567 8900", location: "Pune Railway Station, Platform 3", locationLat: 18.5286, locationLng: 73.8734, destinationHospital: "Meridian Multi-Speciality Hospital", hospitalLat: 18.5204, hospitalLng: 73.8567, patientName: "Unknown Male", patientAge: 35, patientGender: "Male", chiefComplaint: "Unconscious — possible stroke, found on platform", mechanismOfInjury: "Unknown — bystander call", distance: 1.8, eta: 5 },
];

/* ------------------------------------------------------------------ */
/* Vital Signs Records                                                  */
/* ------------------------------------------------------------------ */

export const VITAL_SIGNS: VitalSigns[] = [
  { id: "VS-001", incidentId: "INC-004", timestamp: "2026-07-23 11:40:00", heartRate: 88, systolic: 128, diastolic: 82, spo2: 96, respiratoryRate: 18, temperature: 36.8, bloodGlucose: 142, painScore: 7, gcsEye: 4, gcsVerbal: 5, gcsMotor: 6, gcsTotal: 15 },
  { id: "VS-002", incidentId: "INC-004", timestamp: "2026-07-23 11:50:00", heartRate: 85, systolic: 125, diastolic: 80, spo2: 97, respiratoryRate: 17, temperature: 36.7, bloodGlucose: 138, painScore: 6, gcsEye: 4, gcsVerbal: 5, gcsMotor: 6, gcsTotal: 15 },
  { id: "VS-003", incidentId: "INC-005", timestamp: "2026-07-23 11:05:00", heartRate: 102, systolic: 148, diastolic: 92, spo2: 95, respiratoryRate: 20, temperature: 37.2, bloodGlucose: 168, painScore: 2, gcsEye: 3, gcsVerbal: 4, gcsMotor: 5, gcsTotal: 12 },
  { id: "VS-004", incidentId: "INC-005", timestamp: "2026-07-23 11:15:00", heartRate: 92, systolic: 140, diastolic: 88, spo2: 97, respiratoryRate: 18, temperature: 37.0, bloodGlucose: 155, painScore: 1, gcsEye: 4, gcsVerbal: 5, gcsMotor: 6, gcsTotal: 15 },
  { id: "VS-005", incidentId: "INC-002", timestamp: "2026-07-23 14:20:00", heartRate: 108, systolic: 168, diastolic: 100, spo2: 94, respiratoryRate: 22, temperature: 37.1, bloodGlucose: 195, painScore: 9, gcsEye: 4, gcsVerbal: 4, gcsMotor: 6, gcsTotal: 14 },
];

/* ------------------------------------------------------------------ */
/* Treatments                                                           */
/* ------------------------------------------------------------------ */

export const TREATMENTS: Treatment[] = [
  { id: "TRT-001", incidentId: "INC-004", timestamp: "2026-07-23 11:42:00", type: "Immobilization", description: "Cervical collar applied. Patient immobilized on spinal board with head blocks.", administeredBy: "Vikram Jadhav" },
  { id: "TRT-002", incidentId: "INC-004", timestamp: "2026-07-23 11:45:00", type: "IV Access", description: "18G cannula inserted — left antecubital fossa. Normal Saline 500ml started.", administeredBy: "Vikram Jadhav" },
  { id: "TRT-003", incidentId: "INC-004", timestamp: "2026-07-23 11:48:00", type: "Medication", description: "Inj. Paracetamol 1g IV administered for pain management.", medication: "Paracetamol 1g", dosage: "1g", route: "IV", administeredBy: "Vikram Jadhav", notes: "Patient pain reduced from 8/10 to 5/10" },
  { id: "TRT-004", incidentId: "INC-005", timestamp: "2026-07-23 11:08:00", type: "Oxygen Therapy", description: "Supplemental O2 via non-rebreather mask at 15L/min. SpO2 improved from 92% to 97%.", administeredBy: "Vikram Jadhav" },
  { id: "TRT-005", incidentId: "INC-005", timestamp: "2026-07-23 11:12:00", type: "IV Access", description: "20G cannula — right antecubital. D5 Normal Saline 250ml started.", administeredBy: "Vikram Jadhav" },
  { id: "TRT-006", incidentId: "INC-002", timestamp: "2026-07-23 14:22:00", type: "Aspirin", description: "Aspirin 325mg administered. 12-lead ECG obtained — ST elevation in leads II, III, aVF.", medication: "Aspirin", dosage: "325mg", route: "Oral", administeredBy: "Vikram Jadhav", notes: "STEMI alert activated" },
  { id: "TRT-007", incidentId: "INC-002", timestamp: "2026-07-23 14:24:00", type: "IV Access", description: "18G cannula — left antecubital. Normal Saline 250ml bolus.", administeredBy: "Vikram Jadhav" },
  { id: "TRT-008", incidentId: "INC-002", timestamp: "2026-07-23 14:26:00", type: "Nitroglycerin", description: "Sublingual Nitroglycerin 0.4mg administered. BP monitoring.", medication: "Nitroglycerin", dosage: "0.4mg", route: "Sublingual", administeredBy: "Vikram Jadhav" },
];

/* ------------------------------------------------------------------ */
/* Pre-Notifications                                                    */
/* ------------------------------------------------------------------ */

export const PRE_NOTIFICATIONS: PreNotification[] = [
  { id: "PN-001", incidentId: "INC-004", hospitalName: "Meridian Multi-Speciality Hospital", receivingDoctor: "Dr. Meera Joshi", eta: 12, patientSummary: "72-year-old male, fall from staircase. Hip fracture suspected. Conscious, oriented GCS 15.", chiefComplaint: "Hip fracture — fall from height", vitalSummary: "HR 88, BP 128/82, SpO2 96%, RR 18, Pain 7/10", treatmentsGiven: "Cervical collar, spinal board, IV NS 500ml, Inj. Paracetamol 1g IV", submittedAt: "2026-07-23 11:50:00", acknowledged: true },
  { id: "PN-002", incidentId: "INC-002", hospitalName: "Meridian Multi-Speciality Hospital", receivingDoctor: "Dr. Arjun Mehta", eta: 8, patientSummary: "62-year-old male, acute chest pain. Suspected STEMI. Diaphoretic, BP 168/100.", chiefComplaint: "Suspected STEMI — acute coronary syndrome", vitalSummary: "HR 108, BP 168/100, SpO2 94%, RR 22, Pain 9/10", treatmentsGiven: "Aspirin 325mg, Nitroglycerin 0.4mg SL, IV NS 250ml, 12-lead ECG obtained", alertType: "STEMI", submittedAt: "2026-07-23 14:28:00", acknowledged: false },
  { id: "PN-003", incidentId: "INC-005", hospitalName: "Meridian Multi-Speciality Hospital", receivingDoctor: "Dr. Meera Joshi", eta: 0, patientSummary: "34-year-old male, generalized tonic-clonic seizure. Post-ictal. Known epilepsy — missed medication.", chiefComplaint: "Seizure — post-ictal state", vitalSummary: "HR 92, BP 140/88, SpO2 97%, RR 18, GCS 15 (improved from 12)", treatmentsGiven: "Oxygen NRB 15L, IV D5NS 250ml", submittedAt: "2026-07-23 11:20:00", acknowledged: true },
];

/* ------------------------------------------------------------------ */
/* Handover Records                                                     */
/* ------------------------------------------------------------------ */

export const HANDOVER_RECORDS: HandoverRecord[] = [
  { id: "HO-001", incidentId: "INC-004", receivingDoctor: "Dr. Meera Joshi", receivingNurse: "Nurse Asha", handoverTime: "2026-07-23 11:58:00", patientCondition: "Stable — conscious, oriented GCS 15. Left hip pain. No spinal tenderness.", vitalsSummary: "HR 85, BP 125/80, SpO2 97%, RR 17, Temp 36.7°C, Pain 6/10", treatmentsSummary: "Cervical collar applied, spinal board immobilization, left hip splinted.", medicationsGiven: "Inj. Paracetamol 1g IV", attachments: ["12-lead ECG", "Scene Photo", "Patient Photo"], digitalSignature: true, confirmedByDoctor: true },
  { id: "HO-002", incidentId: "INC-005", receivingDoctor: "Dr. Meera Joshi", receivingNurse: "Nurse Priya", handoverTime: "2026-07-23 11:22:00", patientCondition: "Stable — post-ictal, fully recovered. GCS 15. Oriented x3. No focal deficits.", vitalsSummary: "HR 92, BP 140/88, SpO2 97%, RR 18, Temp 37.0°C, Glucose 155", treatmentsSummary: "Supplemental oxygen, IV access established.", medicationsGiven: "None", attachments: ["Blood glucose report"], digitalSignature: true, confirmedByDoctor: true },
];

/* ------------------------------------------------------------------ */
/* Trip Records                                                         */
/* ------------------------------------------------------------------ */

export const TRIP_RECORDS: TripRecord[] = [
  { id: "TR-001", incidentId: "INC-004", tripNumber: "TRIP-2026-00891", vehicleNumber: "MH-12-A-4521", driverName: "Vikram Jadhav", dispatchTime: "2026-07-23 11:21:00", arrivalTime: "2026-07-23 11:35:00", departureTime: "2026-07-23 12:10:00", tripDuration: 49, distance: 4.5, fuelUsed: 1.2, outcome: "Transported", patientName: "Ganesh Kulkarni", hospitalName: "Meridian Multi-Speciality Hospital" },
  { id: "TR-002", incidentId: "INC-005", tripNumber: "TRIP-2026-00890", vehicleNumber: "MH-12-B-3387", driverName: "Rajesh More", dispatchTime: "2026-07-23 10:46:00", arrivalTime: "2026-07-23 11:00:00", departureTime: "2026-07-23 11:35:00", tripDuration: 49, distance: 8.1, fuelUsed: 2.1, outcome: "Transported", patientName: "Ravi Shankar", hospitalName: "Meridian Multi-Speciality Hospital" },
];

/* ------------------------------------------------------------------ */
/* Fuel Logs                                                            */
/* ------------------------------------------------------------------ */

export const FUEL_LOGS: FuelLog[] = [
  { id: "FL-001", vehicleId: "AMB-001", date: "2026-07-23", fuelAmount: 45, fuelCost: 4725, mileage: 34250, odometer: 34250, filledBy: "Vikram Jadhav" },
  { id: "FL-002", vehicleId: "AMB-001", date: "2026-07-20", fuelAmount: 52, fuelCost: 5460, mileage: 33890, odometer: 33890, filledBy: "Vikram Jadhav" },
  { id: "FL-003", vehicleId: "AMB-001", date: "2026-07-17", fuelAmount: 40, fuelCost: 4200, mileage: 33520, odometer: 33520, filledBy: "Vikram Jadhav" },
];

/* ------------------------------------------------------------------ */
/* Vehicle Inspection                                                   */
/* ------------------------------------------------------------------ */

export const LAST_INSPECTION: VehicleInspection = {
  id: "INS-001",
  vehicleId: "AMB-001",
  date: "2026-07-23 08:00:00",
  driverId: "DRV-001",
  tyres: "OK",
  lights: "OK",
  oxygenCylinders: "OK",
  defibrillator: "OK",
  monitor: "OK",
  suctionUnit: "OK",
  firstAidKit: "OK",
  stretcher: "OK",
  medicalSupplies: "OK",
  overallResult: "Pass",
  notes: "All equipment checked and restocked. Ready for service.",
};

/* ------------------------------------------------------------------ */
/* Notifications                                                        */
/* ------------------------------------------------------------------ */

export const NOTIFICATIONS: Notification[] = [
  { id: "NTF-001", type: "Dispatch", title: "Code Red — RTA", message: "Road Traffic Accident at Pune-Mumbai Expressway, Km 42. Multiple injuries. 2 patients.", timestamp: "2026-07-23 14:32:00", read: false, priority: "Critical", incidentId: "INC-001" },
  { id: "NTF-002", type: "Dispatch", title: "Code Red — Cardiac", message: "Chest pain — suspected STEMI. Koregaon Park, Lane 7. 62M, diaphoretic.", timestamp: "2026-07-23 14:15:00", read: false, priority: "Critical", incidentId: "INC-002" },
  { id: "NTF-003", type: "Hospital", title: "Pre-notification Acknowledged", message: "Meridian ER has acknowledged your pre-notification for Ganesh Kulkarni.", timestamp: "2026-07-23 11:52:00", read: true, priority: "Medium", incidentId: "INC-004" },
  { id: "NTF-004", type: "Equipment", title: "Defibrillator Battery Low", message: "Defibrillator battery at 65%. Schedule replacement before next shift.", timestamp: "2026-07-23 08:30:00", read: true, priority: "Medium" },
  { id: "NTF-005", type: "Shift", title: "Shift Reminder", message: "Your shift ends at 20:00. Complete pending documentation.", timestamp: "2026-07-23 19:30:00", read: false, priority: "Low" },
  { id: "NTF-006", type: "Maintenance", title: "Service Due", message: "Vehicle MH-12-A-4521 scheduled for service on 10 Aug 2026.", timestamp: "2026-07-23 08:00:00", read: true, priority: "Low" },
];

/* ------------------------------------------------------------------ */
/* Helpers                                                              */
/* ------------------------------------------------------------------ */

export function priorityTone(p: DispatchPriority): "danger" | "warning" | "success" {
  switch (p) {
    case "Code Red": return "danger";
    case "Code Yellow": return "warning";
    case "Code Green": return "success";
  }
}

export function dispatchStatusTone(s: DispatchStatus): "danger" | "warning" | "success" | "info" | "brand" | "neutral" {
  switch (s) {
    case "Pending": return "warning";
    case "Accepted": return "info";
    case "En Route": return "brand";
    case "On Scene": return "info";
    case "Transporting": return "brand";
    case "At Hospital": return "success";
    case "Completed": return "success";
    case "Cancelled": case "Rejected": return "danger";
    default: return "neutral";
  }
}

export function formatINR(amount: number): string {
  return "Rs " + amount.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

export function timeAgo(timestamp: string): string {
  const now = new Date("2026-07-23T14:40:00");
  const then = new Date(timestamp);
  const diffMin = Math.floor((now.getTime() - then.getTime()) / 60000);
  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH}h ago`;
  return `${Math.floor(diffH / 24)}d ago`;
}

export function gcsTotal(e: number, v: number, m: number): number {
  return e + v + m;
}
