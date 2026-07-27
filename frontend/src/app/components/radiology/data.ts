/* ------------------------------------------------------------------ */
/* Realistic mock radiology data for Meridian Multi-Speciality Hospital */
/* ------------------------------------------------------------------ */

export type Modality = "CT" | "MRI" | "X-Ray" | "Ultrasound" | "Mammography" | "PET-CT" | "Fluoroscopy" | "2D Echo" | "Portable X-Ray";
export type StudyStatus = "Ordered" | "Scheduled" | "Checked In" | "In Progress" | "Acquired" | "Uploaded" | "Under Review" | "Reported" | "Signed Off" | "Delivered" | "Rejected";
export type StudyPriority = "Routine" | "Urgent" | "STAT";
export type FindingSeverity = "Normal" | "Mild" | "Moderate" | "Severe" | "Critical";
export type EquipmentStatus = "Online" | "Offline" | "Maintenance" | "Warm-up" | "Error";

export interface ImagingOrder {
  orderId: string;
  studyId: string;
  dicomUid: string;
  patientName: string;
  uhid: string;
  age: number;
  gender: "Male" | "Female";
  blood: string;
  orderingDoctor: string;
  department: string;
  priority: StudyPriority;
  orderTime: string;
  scheduledTime: string;
  study: string;
  modality: Modality;
  bodyPart: string;
  contrast: boolean;
  contrastType?: string;
  status: StudyStatus;
  technician?: string;
  radiologist?: string;
  room?: string;
  imageCount?: number;
  doseMgy?: number;
  preparationNotes?: string;
}

export interface AIFinding {
  id: string;
  studyId: string;
  finding: string;
  severity: FindingSeverity;
  confidence: number;
  location: string;
  measurement?: string;
  aiSuggestion: string;
  status: "Pending Review" | "Accepted" | "Rejected" | "Modified";
}

export interface Equipment {
  id: string;
  name: string;
  manufacturer: string;
  model: string;
  modality: Modality;
  department: string;
  room: string;
  status: EquipmentStatus;
  lastMaintenance: string;
  nextMaintenance: string;
  calibrationDue: string;
  errorCount: number;
  serialNumber: string;
  installDate: string;
  dailyCapacity: number;
  studiesToday: number;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  detail: string;
  studyId?: string;
  patientName?: string;
  ipAddress: string;
}

/* ------------------------------------------------------------------ */
/* Imaging Orders                                                      */
/* ------------------------------------------------------------------ */

export const IMAGING_ORDERS: ImagingOrder[] = [
  {
    orderId: "RAD-2026-0722-001", studyId: "STU-2026-0722-001", dicomUid: "1.2.840.113619.2.384.12345",
    patientName: "Rajesh Kumar", uhid: "MRD-2026-004821", age: 47, gender: "Male", blood: "B+",
    orderingDoctor: "Dr. Arjun Mehta", department: "Cardiology", priority: "Urgent",
    orderTime: "08:15 AM", scheduledTime: "09:00 AM",
    study: "CT Coronary Angiography", modality: "CT", bodyPart: "Heart",
    contrast: true, contrastType: "Iohexol 350 mg/mL",
    status: "Under Review", technician: "Vikram Singh", radiologist: "Dr. Priya Menon",
    room: "CT-01", imageCount: 324, doseMgy: 12.4,
  },
  {
    orderId: "RAD-2026-0722-002", studyId: "STU-2026-0722-002", dicomUid: "1.2.840.113619.2.384.12346",
    patientName: "Meena Patil", uhid: "MRD-2026-004822", age: 34, gender: "Female", blood: "O+",
    orderingDoctor: "Dr. Kavya Nair", department: "General Medicine", priority: "Routine",
    orderTime: "09:00 AM", scheduledTime: "10:30 AM",
    study: "MRI Lumbar Spine", modality: "MRI", bodyPart: "L-Spine",
    contrast: false,
    status: "Scheduled", technician: "Arun Kulkarni", radiologist: "Dr. Sanjay Gupta",
    room: "MRI-01",
  },
  {
    orderId: "RAD-2026-0722-003", studyId: "STU-2026-0722-003", dicomUid: "1.2.840.113619.2.384.12347",
    patientName: "Aarav Sharma", uhid: "MRD-2026-004823", age: 7, gender: "Male", blood: "A+",
    orderingDoctor: "Dr. Sneha Iyer", department: "Paediatrics", priority: "STAT",
    orderTime: "09:30 AM", scheduledTime: "09:45 AM",
    study: "Chest X-Ray PA View", modality: "X-Ray", bodyPart: "Chest",
    contrast: false,
    status: "Signed Off", technician: "Priya Deshpande", radiologist: "Dr. Priya Menon",
    room: "XR-01", imageCount: 1, doseMgy: 0.02,
  },
  {
    orderId: "RAD-2026-0722-004", studyId: "STU-2026-0722-004", dicomUid: "1.2.840.113619.2.384.12348",
    patientName: "Lakshmi Iyer", uhid: "MRD-2026-004824", age: 70, gender: "Female", blood: "AB+",
    orderingDoctor: "Dr. Imran Sheikh", department: "Emergency Medicine", priority: "STAT",
    orderTime: "09:55 AM", scheduledTime: "10:00 AM",
    study: "CT Brain without Contrast", modality: "CT", bodyPart: "Brain",
    contrast: false,
    status: "Reported", technician: "Vikram Singh", radiologist: "Dr. Meera Rajan",
    room: "CT-01", imageCount: 256, doseMgy: 2.1,
  },
  {
    orderId: "RAD-2026-0722-005", studyId: "STU-2026-0722-005", dicomUid: "1.2.840.113619.2.384.12349",
    patientName: "Sunita Reddy", uhid: "MRD-2026-004826", age: 54, gender: "Female", blood: "B-",
    orderingDoctor: "Dr. Vikram Rao", department: "Neurology", priority: "Routine",
    orderTime: "10:15 AM", scheduledTime: "11:00 AM",
    study: "MRI Brain with Contrast", modality: "MRI", bodyPart: "Brain",
    contrast: true, contrastType: "Gadobutrol 1mmol/mL",
    status: "Checked In",
  },
  {
    orderId: "RAD-2026-0722-006", studyId: "STU-2026-0722-006", dicomUid: "1.2.840.113619.2.384.12350",
    patientName: "Ganesh More", uhid: "MRD-2026-004830", age: 62, gender: "Male", blood: "O+",
    orderingDoctor: "Dr. Kavya Nair", department: "General Medicine", priority: "Routine",
    orderTime: "10:45 AM", scheduledTime: "02:00 PM",
    study: "Ultrasound Abdomen", modality: "Ultrasound", bodyPart: "Abdomen",
    contrast: false,
    status: "Ordered",
  },
  {
    orderId: "RAD-2026-0722-007", studyId: "STU-2026-0722-007", dicomUid: "1.2.840.113619.2.384.12351",
    patientName: "Deepak Joshi", uhid: "MRD-2026-004831", age: 41, gender: "Male", blood: "A-",
    orderingDoctor: "Dr. Arjun Mehta", department: "Cardiology", priority: "Urgent",
    orderTime: "11:00 AM", scheduledTime: "11:30 AM",
    study: "2D Echocardiography", modality: "2D Echo", bodyPart: "Heart",
    contrast: false,
    status: "Acquired", technician: "Priya Deshpande", radiologist: "Dr. Arjun Mehta",
    room: "US-01", imageCount: 48,
  },
  {
    orderId: "RAD-2026-0722-008", studyId: "STU-2026-0722-008", dicomUid: "1.2.840.113619.2.384.12352",
    patientName: "Pooja Salunkhe", uhid: "MRD-2026-004832", age: 28, gender: "Female", blood: "O+",
    orderingDoctor: "Dr. Ananya Gupta", department: "Gynaecology", priority: "Routine",
    orderTime: "11:30 AM", scheduledTime: "03:00 PM",
    study: "Obstetric Ultrasound", modality: "Ultrasound", bodyPart: "Pelvis",
    contrast: false,
    status: "Ordered",
  },
  {
    orderId: "RAD-2026-0722-009", studyId: "STU-2026-0722-009", dicomUid: "1.2.840.113619.2.384.12353",
    patientName: "Anil Kulkarni", uhid: "MRD-2026-004833", age: 58, gender: "Male", blood: "B+",
    orderingDoctor: "Dr. Imran Sheikh", department: "Emergency Medicine", priority: "STAT",
    orderTime: "12:00 PM", scheduledTime: "12:15 PM",
    study: "CT Chest with Contrast", modality: "CT", bodyPart: "Chest",
    contrast: true, contrastType: "Iohexol 350 mg/mL",
    status: "Uploaded", technician: "Arun Kulkarni", radiologist: "Dr. Priya Menon",
    room: "CT-02", imageCount: 412, doseMgy: 8.7,
  },
  {
    orderId: "RAD-2026-0722-010", studyId: "STU-2026-0722-010", dicomUid: "1.2.840.113619.2.384.12354",
    patientName: "Rajesh Kumar", uhid: "MRD-2026-004821", age: 47, gender: "Male", blood: "B+",
    orderingDoctor: "Dr. Arjun Mehta", department: "Cardiology", priority: "Routine",
    orderTime: "02:00 PM", scheduledTime: "03:30 PM",
    study: "Chest X-Ray PA View", modality: "Portable X-Ray", bodyPart: "Chest",
    contrast: false,
    status: "Scheduled",
  },
];

/* ------------------------------------------------------------------ */
/* Equipment                                                           */
/* ------------------------------------------------------------------ */

export const EQUIPMENT: Equipment[] = [
  { id: "EQ-001", name: "CT Scanner", manufacturer: "Siemens Healthineers", model: "Somatom Force", modality: "CT", department: "Radiology", room: "CT-01", status: "Online", lastMaintenance: "2026-07-10", nextMaintenance: "2026-10-10", calibrationDue: "2026-08-01", errorCount: 0, serialNumber: "SN-SIE-2020-CT01", installDate: "2020-03-15", dailyCapacity: 40, studiesToday: 8 },
  { id: "EQ-002", name: "CT Scanner", manufacturer: "GE Healthcare", model: "Revolution CT", modality: "CT", department: "Radiology", room: "CT-02", status: "Online", lastMaintenance: "2026-07-15", nextMaintenance: "2026-10-15", calibrationDue: "2026-08-05", errorCount: 0, serialNumber: "SN-GE-2021-CT02", installDate: "2021-06-20", dailyCapacity: 45, studiesToday: 6 },
  { id: "EQ-003", name: "MRI Scanner", manufacturer: "Siemens Healthineers", model: "MAGNETOM Vida 3T", modality: "MRI", department: "Radiology", room: "MRI-01", status: "Online", lastMaintenance: "2026-07-01", nextMaintenance: "2026-10-01", calibrationDue: "2026-08-10", errorCount: 0, serialNumber: "SN-SIE-2019-MR01", installDate: "2019-11-10", dailyCapacity: 20, studiesToday: 4 },
  { id: "EQ-004", name: "MRI Scanner", manufacturer: "GE Healthcare", model: "SIGNA Premier 3.0T", modality: "MRI", department: "Radiology", room: "MRI-02", status: "Maintenance", lastMaintenance: "2026-07-22", nextMaintenance: "2026-07-22", calibrationDue: "2026-07-22", errorCount: 1, serialNumber: "SN-GE-2020-MR02", installDate: "2020-08-25", dailyCapacity: 22, studiesToday: 0 },
  { id: "EQ-005", name: "Digital X-Ray", manufacturer: "Philips Healthcare", model: "DigitalDiagnost C50", modality: "X-Ray", department: "Radiology", room: "XR-01", status: "Online", lastMaintenance: "2026-07-18", nextMaintenance: "2026-08-18", calibrationDue: "2026-08-15", errorCount: 0, serialNumber: "SN-PHI-2021-XR01", installDate: "2021-02-28", dailyCapacity: 60, studiesToday: 12 },
  { id: "EQ-006", name: "Portable X-Ray", manufacturer: "Fujifilm", model: "FDR Smart X", modality: "Portable X-Ray", department: "Radiology", room: "Portable", status: "Online", lastMaintenance: "2026-07-20", nextMaintenance: "2026-08-20", calibrationDue: "2026-09-01", errorCount: 0, serialNumber: "SN-FUJ-2022-XP01", installDate: "2022-01-15", dailyCapacity: 30, studiesToday: 5 },
  { id: "EQ-007", name: "Ultrasound", manufacturer: "Philips Healthcare", model: "EPIQ Elite", modality: "Ultrasound", department: "Radiology", room: "US-01", status: "Online", lastMaintenance: "2026-07-12", nextMaintenance: "2026-08-12", calibrationDue: "2026-09-15", errorCount: 0, serialNumber: "SN-PHI-2020-US01", installDate: "2020-05-10", dailyCapacity: 35, studiesToday: 7 },
  { id: "EQ-008", name: "Mammography", manufacturer: "Hologic", model: "3Dimensions", modality: "Mammography", department: "Radiology", room: "MG-01", status: "Online", lastMaintenance: "2026-07-08", nextMaintenance: "2026-10-08", calibrationDue: "2026-08-20", errorCount: 0, serialNumber: "SN-HOL-2021-MG01", installDate: "2021-04-12", dailyCapacity: 25, studiesToday: 3 },
];

/* ------------------------------------------------------------------ */
/* AI Findings                                                         */
/* ------------------------------------------------------------------ */

export const AI_FINDINGS: AIFinding[] = [
  { id: "AI-001", studyId: "STU-2026-0722-001", finding: "Left anterior descending artery — 70% stenosis at mid segment", severity: "Severe", confidence: 94.2, location: "LAD mid", measurement: "Diameter stenosis 70%", aiSuggestion: "Significant stenosis. Recommend interventional cardiology consult.", status: "Pending Review" },
  { id: "AI-002", studyId: "STU-2026-0722-001", finding: "Right coronary artery — mild calcification", severity: "Mild", confidence: 88.5, location: "RCA proximal", aiSuggestion: "Mild atherosclerotic changes. Correlate with clinical presentation.", status: "Pending Review" },
  { id: "AI-003", studyId: "STU-2026-0722-004", finding: "Acute left MCA territory infarct — early cytotoxic edema", severity: "Critical", confidence: 96.8, location: "Left MCA territory", measurement: "ASPECTS score 7", aiSuggestion: "Acute ischemic stroke. Urgent neurology and neurointerventional consult.", status: "Accepted" },
  { id: "AI-004", studyId: "STU-2026-0722-004", finding: "Mass effect with midline shift 4mm to right", severity: "Severe", confidence: 91.3, location: "Midline structures", measurement: "4mm rightward shift", aiSuggestion: "Significant mass effect. Consider neurosurgical evaluation.", status: "Accepted" },
  { id: "AI-005", studyId: "STU-2026-0722-007", finding: "Mild mitral regurgitation", severity: "Mild", confidence: 85.7, location: "Mitral valve", aiSuggestion: "Trace to mild MR. No significant LV dysfunction. Follow-up in 12 months.", status: "Pending Review" },
  { id: "AI-006", studyId: "STU-2026-0722-009", finding: "Right lower lobe consolidation with air bronchograms", severity: "Moderate", confidence: 92.1, location: "RLL", measurement: "3.2 x 2.8 cm", aiSuggestion: "Pneumonia. Correlate with clinical and laboratory findings.", status: "Pending Review" },
];

/* ------------------------------------------------------------------ */
/* Audit logs                                                          */
/* ------------------------------------------------------------------ */

export const AUDIT_LOGS: AuditEntry[] = [
  { id: "AUD-001", timestamp: "2026-07-22 08:15:00", user: "Dr. Arjun Mehta", role: "Consultant", action: "Order Created", detail: "CT Coronary Angiography ordered for Rajesh Kumar", studyId: "STU-2026-0722-001", patientName: "Rajesh Kumar", ipAddress: "10.0.1.101" },
  { id: "AUD-002", timestamp: "2026-07-22 08:30:00", user: "Scheduling Desk", role: "Receptionist", action: "Study Scheduled", detail: "CT-01 reserved for 09:00 AM — Dr. Priya Menon assigned", studyId: "STU-2026-0722-001", patientName: "Rajesh Kumar", ipAddress: "10.0.2.201" },
  { id: "AUD-003", timestamp: "2026-07-22 08:55:00", user: "Vikram Singh", role: "CT Technician", action: "Patient Checked In", detail: "Consent verified. Pregnancy test N/A. Contrast allergy check: Negative.", studyId: "STU-2026-0722-001", patientName: "Rajesh Kumar", ipAddress: "10.0.3.301" },
  { id: "AUD-004", timestamp: "2026-07-22 09:00:00", user: "Vikram Singh", role: "CT Technician", action: "Image Acquisition Started", detail: "CT Coronary Angiography protocol initiated on Somatom Force", studyId: "STU-2026-0722-001", patientName: "Rajesh Kumar", ipAddress: "10.0.3.301" },
  { id: "AUD-005", timestamp: "2026-07-22 09:12:00", user: "Vikram Singh", role: "CT Technician", action: "DICOM Upload Complete", detail: "324 images uploaded to PACS. Study UID: 1.2.840.113619.2.384.12345", studyId: "STU-2026-0722-001", patientName: "Rajesh Kumar", ipAddress: "10.0.3.301" },
  { id: "AUD-006", timestamp: "2026-07-22 09:15:00", user: "AI System", role: "Automated", action: "AI Analysis Complete", detail: "LAD 70% stenosis detected. Confidence: 94.2%. Critical finding flagged.", studyId: "STU-2026-0722-001", patientName: "Rajesh Kumar", ipAddress: "10.0.0.1" },
  { id: "AUD-007", timestamp: "2026-07-22 09:30:00", user: "Dr. Priya Menon", role: "Radiologist", action: "Report Started", detail: "Dictation initiated for CT Coronary Angiography", studyId: "STU-2026-0722-001", patientName: "Rajesh Kumar", ipAddress: "10.0.4.401" },
  { id: "AUD-008", timestamp: "2026-07-22 09:55:00", user: "Dr. Imran Sheikh", role: "Consultant", action: "STAT Order Created", detail: "CT Brain without contrast ordered for Lakshmi Iyer — acute onset right hemiplegia", studyId: "STU-2026-0722-004", patientName: "Lakshmi Iyer", ipAddress: "10.0.1.105" },
  { id: "AUD-009", timestamp: "2026-07-22 10:00:00", user: "Vikram Singh", role: "CT Technician", action: "STAT Scan Completed", detail: "CT Brain completed. 256 images acquired. Critical finding: left MCA infarct.", studyId: "STU-2026-0722-004", patientName: "Lakshmi Iyer", ipAddress: "10.0.3.301" },
  { id: "AUD-010", timestamp: "2026-07-22 10:30:00", user: "Dr. Meera Rajan", role: "Radiologist", action: "Critical Finding Communicated", detail: "Acute left MCA infarct communicated to Dr. Imran Sheikh by phone. Read-back confirmed.", studyId: "STU-2026-0722-004", patientName: "Lakshmi Iyer", ipAddress: "10.0.4.402" },
];

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

export function generateStudyId(): string {
  const n = 20260722011 + Math.floor(Math.random() * 90);
  return `STU-${n}`;
}

export function studyStatusTone(s: StudyStatus): "brand" | "success" | "warning" | "danger" | "info" | "neutral" {
  switch (s) {
    case "Ordered": return "info";
    case "Scheduled": return "info";
    case "Checked In": return "brand";
    case "In Progress": return "warning";
    case "Acquired": return "brand";
    case "Uploaded": return "brand";
    case "Under Review": return "warning";
    case "Reported": return "success";
    case "Signed Off": return "success";
    case "Delivered": return "neutral";
    case "Rejected": return "danger";
    default: return "neutral";
  }
}

export function equipmentStatusTone(s: EquipmentStatus): "success" | "warning" | "danger" | "neutral" {
  switch (s) {
    case "Online": return "success";
    case "Warm-up": return "warning";
    case "Maintenance": return "warning";
    case "Offline": return "danger";
    case "Error": return "danger";
    default: return "neutral";
  }
}

export function severityTone(s: FindingSeverity): "success" | "info" | "warning" | "danger" {
  switch (s) {
    case "Normal": return "success";
    case "Mild": return "info";
    case "Moderate": return "warning";
    case "Severe": return "danger";
    case "Critical": return "danger";
    default: return "info";
  }
}

export const STUDY_TEMPLATES: Record<string, string> = {
  "CT Coronary Angiography": "Heart. Non-gated or ECG-gated CT angiography of the coronary arteries. IV Iohexol 350 mg/mL at 5 mL/s. 120 kVp. Automatic exposure control.",
  "CT Brain without Contrast": "Brain. Non-contrast CT. 120 kVp, 300 mAs. 5mm axial slices. Bone and soft tissue windows.",
  "CT Chest with Contrast": "Chest. IV Iohexol 350 mg/mL at 4 mL/s. 120 kVp. Lung and mediastinal windows. 1.25mm thin sections.",
  "MRI Lumbar Spine": "L-Spine. Sagittal T1, T2, STIR. Axial T2. 3T MRI. No contrast. 3mm slices.",
  "MRI Brain with Contrast": "Brain. Axial T1, T2, FLAIR, DWI. Sagittal T1. Post-gadolinium T1 with fat sat. 3T MRI.",
  "Chest X-Ray PA View": "Chest PA view. 117 kVp, 2.5 mAs. Upright position. Full inspiration.",
  "Ultrasound Abdomen": "Upper and lower abdomen. Linear and curvilinear transducers. Fasting 8 hours.",
  "Obstetric Ultrasound": "Obstetric. Transabdominal. Full bladder. Single and biometry measurements.",
  "2D Echocardiography": "Transthoracic echo. M-mode, 2D, Colour Doppler, PW/CW Doppler. Parasternal, apical, subcostal views.",
  "Portable X-Ray": "Portable. AP view. Bedside. 80 kVp, 2 mAs.",
};

export function priorityTone(p: StudyPriority): "danger" | "warning" | "info" {
  return p === "STAT" ? "danger" : p === "Urgent" ? "warning" : "info";
}
