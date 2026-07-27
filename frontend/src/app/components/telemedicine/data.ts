/* ── Telemedicine Provider Portal — Data ──────────────────────────────────── */

export type ConsultType = "Video" | "Audio" | "Chat" | "E-Consult";
export type ApptStatus = "Scheduled" | "Checked In" | "Waiting" | "In Progress" | "Completed" | "Cancelled" | "No Show";
export type ConsentStatus = "Pending" | "Signed" | "Declined" | "Expired";
export type PaymentStatus = "Pending" | "Paid" | "Refunded" | "Partial" | "Insurance";
export type MessageStatus = "Sent" | "Delivered" | "Read" | "Unread";
export type DocumentType = "Prescription" | "Lab Order" | "Radiology Order" | "Medical Certificate" | "Referral" | "Clinical Note" | "Consent Form";
export type ConnectivityStatus = "Excellent" | "Good" | "Fair" | "Poor" | "Disconnected";
export type SessionStatus = "Not Started" | "Connecting" | "Connected" | "On Hold" | "Ended";
export type SurveyRating = 1 | 2 | 3 | 4 | 5;

export interface Provider {
  id: string; name: string; specialty: string; qualification: string;
  experience: number; avatar: string; rating: number;
  consultationsToday: number; availability: string;
  consultationFee: number; languages: string[];
}

export const PROVIDERS: Provider[] = [
  { id: "DR-001", name: "Dr. Priya Sharma", specialty: "General Medicine", qualification: "MBBS, MD (Medicine)", experience: 12, avatar: "PS", rating: 4.8, consultationsToday: 14, availability: "9:00 AM - 5:00 PM", consultationFee: 800, languages: ["English", "Hindi", "Marathi"] },
  { id: "DR-002", name: "Dr. Rajesh Kumar", specialty: "Cardiology", qualification: "MBBS, DM (Cardiology)", experience: 18, avatar: "RK", rating: 4.9, consultationsToday: 10, availability: "10:00 AM - 4:00 PM", consultationFee: 1200, languages: ["English", "Hindi"] },
  { id: "DR-003", name: "Dr. Sunita Patel", specialty: "Dermatology", qualification: "MBBS, MD (Dermatology)", experience: 8, avatar: "SP", rating: 4.7, consultationsToday: 16, availability: "9:00 AM - 6:00 PM", consultationFee: 900, languages: ["English", "Hindi", "Gujarati"] },
  { id: "DR-004", name: "Dr. Mohan Reddy", specialty: "Orthopedics", qualification: "MBBS, MS (Ortho), DNB", experience: 15, avatar: "MR", rating: 4.6, consultationsToday: 8, availability: "11:00 AM - 5:00 PM", consultationFee: 1100, languages: ["English", "Telugu", "Hindi"] },
  { id: "DR-005", name: "Dr. Anjali Nair", specialty: "Pediatrics", qualification: "MBBS, MD (Pediatrics), IAP Fellow", experience: 10, avatar: "AN", rating: 4.9, consultationsToday: 18, availability: "8:00 AM - 4:00 PM", consultationFee: 750, languages: ["English", "Malayalam", "Hindi"] },
  { id: "DR-006", name: "Dr. Vikram Singh", specialty: "Psychiatry", qualification: "MBBS, MD (Psychiatry)", experience: 14, avatar: "VS", rating: 4.8, consultationsToday: 12, availability: "10:00 AM - 7:00 PM", consultationFee: 1000, languages: ["English", "Hindi", "Punjabi"] },
];

export interface VirtualAppointment {
  id: string; patientId: string; patientName: string; patientAge: number;
  patientGender: "Male" | "Female"; patientPhone: string; patientAvatar: string;
  providerId: string; providerName: string; specialty: string;
  consultType: ConsultType; appointmentTime: string; duration: number;
  status: ApptStatus; chiefComplaint: string;
  consentStatus: ConsentStatus; paymentStatus: PaymentStatus;
  paymentAmount: number; insuranceProvider?: string;
  checkInTime?: string; consultationStartTime?: string;
  vitals?: { bp: string; heartRate: number; temp: number; spo2: number; weight: number; };
  insuranceVerified: boolean; followUpRequired: boolean;
  urgencyLevel: "Routine" | "Urgent" | "Emergency";
}

export const VIRTUAL_APPOINTMENTS: VirtualAppointment[] = [
  { id: "VAP-001", patientId: "P-2001", patientName: "Amit Joshi", patientAge: 35, patientGender: "Male", patientPhone: "+91 98765 43210", patientAvatar: "AJ", providerId: "DR-001", providerName: "Dr. Priya Sharma", specialty: "General Medicine", consultType: "Video", appointmentTime: "2026-07-25T09:00:00", duration: 20, status: "Waiting", chiefComplaint: "Persistent cough for 2 weeks, mild fever", consentStatus: "Signed", paymentStatus: "Paid", paymentAmount: 800, checkInTime: "2026-07-25T08:52:00", vitals: { bp: "128/82", heartRate: 88, temp: 99.2, spo2: 96, weight: 72 }, insuranceVerified: true, followUpRequired: false, urgencyLevel: "Routine" },
  { id: "VAP-002", patientId: "P-2002", patientName: "Meera Gupta", patientAge: 52, patientGender: "Female", patientPhone: "+91 87654 32109", patientAvatar: "MG", providerId: "DR-002", providerName: "Dr. Rajesh Kumar", specialty: "Cardiology", consultType: "Video", appointmentTime: "2026-07-25T09:30:00", duration: 30, status: "Scheduled", chiefComplaint: "Chest pain, shortness of breath on exertion", consentStatus: "Signed", paymentStatus: "Paid", paymentAmount: 1200, insuranceProvider: "Star Health", insuranceVerified: true, followUpRequired: true, urgencyLevel: "Urgent" },
  { id: "VAP-003", patientId: "P-2003", patientName: "Ravi Teja", patientAge: 28, patientGender: "Male", patientPhone: "+91 76543 21098", patientAvatar: "RT", providerId: "DR-003", providerName: "Dr. Sunita Patel", specialty: "Dermatology", consultType: "Video", appointmentTime: "2026-07-25T10:00:00", duration: 15, status: "Checked In", chiefComplaint: "Recurring skin rash on forearms, itching", consentStatus: "Signed", paymentStatus: "Paid", paymentAmount: 900, checkInTime: "2026-07-25T09:48:00", insuranceVerified: false, followUpRequired: true, urgencyLevel: "Routine" },
  { id: "VAP-004", patientId: "P-2004", patientName: "Sunita Devi", patientAge: 45, patientGender: "Female", patientPhone: "+91 65432 10987", patientAvatar: "SD", providerId: "DR-005", providerName: "Dr. Anjali Nair", specialty: "Pediatrics", consultType: "Audio", appointmentTime: "2026-07-25T10:30:00", duration: 15, status: "In Progress", chiefComplaint: "Child (age 4) — high fever since morning, refusal to eat", consentStatus: "Signed", paymentStatus: "Paid", paymentAmount: 750, consultationStartTime: "2026-07-25T10:32:00", vitals: { bp: "98/60", heartRate: 120, temp: 102.4, spo2: 97, weight: 16 }, insuranceVerified: true, followUpRequired: false, urgencyLevel: "Urgent" },
  { id: "VAP-005", patientId: "P-2005", patientName: "Kavitha Reddy", patientAge: 38, patientGender: "Female", patientPhone: "+91 54321 09876", patientAvatar: "KR", providerId: "DR-006", providerName: "Dr. Vikram Singh", specialty: "Psychiatry", consultType: "Video", appointmentTime: "2026-07-25T11:00:00", duration: 45, status: "Scheduled", chiefComplaint: "Anxiety, sleep disturbance for 3 months", consentStatus: "Pending", paymentStatus: "Paid", paymentAmount: 1000, insuranceVerified: true, followUpRequired: true, urgencyLevel: "Routine" },
  { id: "VAP-006", patientId: "P-2006", patientName: "Deepak Nair", patientAge: 62, patientGender: "Male", patientPhone: "+91 43210 98765", patientAvatar: "DN", providerId: "DR-004", providerName: "Dr. Mohan Reddy", specialty: "Orthopedics", consultType: "Video", appointmentTime: "2026-07-25T11:30:00", duration: 20, status: "Scheduled", chiefComplaint: "Right knee pain, difficulty climbing stairs", consentStatus: "Signed", paymentStatus: "Insurance", paymentAmount: 1100, insuranceProvider: "ICICI Lombard", insuranceVerified: true, followUpRequired: true, urgencyLevel: "Routine" },
  { id: "VAP-007", patientId: "P-2007", patientName: "Lakshmi Iyer", patientAge: 29, patientGender: "Female", patientPhone: "+91 32109 87654", patientAvatar: "LI", providerId: "DR-001", providerName: "Dr. Priya Sharma", specialty: "General Medicine", consultType: "Chat", appointmentTime: "2026-07-25T12:00:00", duration: 10, status: "Completed", chiefComplaint: "Headache, need prescription renewal", consentStatus: "Signed", paymentStatus: "Paid", paymentAmount: 800, consultationStartTime: "2026-07-25T12:02:00", insuranceVerified: false, followUpRequired: false, urgencyLevel: "Routine" },
  { id: "VAP-008", patientId: "P-2008", patientName: "Arjun Patel", patientAge: 19, patientGender: "Male", patientPhone: "+91 21098 76543", patientAvatar: "AP", providerId: "DR-003", providerName: "Dr. Sunita Patel", specialty: "Dermatology", consultType: "Video", appointmentTime: "2026-07-25T14:00:00", duration: 15, status: "Cancelled", chiefComplaint: "Acne treatment follow-up", consentStatus: "Signed", paymentStatus: "Refunded", paymentAmount: 900, insuranceVerified: false, followUpRequired: false, urgencyLevel: "Routine" },
];

export interface WaitingRoomPatient {
  id: string; patientName: string; patientAvatar: string;
  checkInTime: string; estimatedWait: number;
  consentStatus: ConsentStatus; identityVerified: boolean;
  connectivityStatus: ConnectivityStatus; consultType: ConsultType;
  chiefComplaint: string; urgencyLevel: string;
  paymentStatus: PaymentStatus; readyForConsultation: boolean;
}

export const WAITING_ROOM: WaitingRoomPatient[] = [
  { id: "VAP-001", patientName: "Amit Joshi", patientAvatar: "AJ", checkInTime: "08:52", estimatedWait: 3, consentStatus: "Signed", identityVerified: true, connectivityStatus: "Excellent", consultType: "Video", chiefComplaint: "Persistent cough for 2 weeks, mild fever", urgencyLevel: "Routine", paymentStatus: "Paid", readyForConsultation: true },
  { id: "VAP-003", patientName: "Ravi Teja", patientAvatar: "RT", checkInTime: "09:48", estimatedWait: 8, consentStatus: "Signed", identityVerified: true, connectivityStatus: "Good", consultType: "Video", chiefComplaint: "Recurring skin rash on forearms, itching", urgencyLevel: "Routine", paymentStatus: "Paid", readyForConsultation: true },
];

export interface ClinicalNote {
  id: string; patientId: string; patientName: string;
  providerId: string; providerName: string;
  consultationDate: string; soapNote: {
    subjective: string; objective: string; assessment: string; plan: string;
  };
  icd10Codes: string[]; snomedCodes: string[];
  vitals: { bp: string; heartRate: number; temp: number; spo2: number; weight: number; };
  aiGenerated: boolean; savedToEMR: boolean;
}

export const CLINICAL_NOTES: ClinicalNote[] = [
  { id: "CN-001", patientId: "P-2007", patientName: "Lakshmi Iyer", providerId: "DR-001", providerName: "Dr. Priya Sharma", consultationDate: "2026-07-25", soapNote: { subjective: "Patient reports intermittent frontal headaches for 1 week. Taking OTC paracetamol with partial relief. No nausea/vomiting. Sleep disturbed.", objective: "Patient appears comfortable. No acute distress. Vital signs stable. Neurological examination normal.", assessment: "Tension-type headache, likely stress-related. Rule out migraine.", plan: "1. Tab Naproxen 250mg BD x 5 days\n2. Stress management counseling\n3. Adequate hydration\n4. Follow up if no improvement in 1 week" }, icd10Codes: ["G44.2", "R51"], snomedCodes: ["25064002", "398091005"], vitals: { bp: "118/76", heartRate: 74, temp: 98.4, spo2: 98, weight: 58 }, aiGenerated: true, savedToEMR: true },
];

export interface Prescription {
  id: string; patientId: string; patientName: string;
  providerId: string; providerName: string;
  consultationDate: string; medications: {
    name: string; strength: string; form: string;
    frequency: string; duration: string; instructions: string;
    quantity: number; refills: number;
  }[];
  pharmacyNotes: string; digitallySigned: boolean;
  sentToPharmacy: boolean; sentToPatientPortal: boolean;
  drugInteractions: string[]; allergyAlerts: string[];
}

export const PRESCRIPTIONS: Prescription[] = [
  { id: "RX-001", patientId: "P-2007", patientName: "Lakshmi Iyer", providerId: "DR-001", providerName: "Dr. Priya Sharma", consultationDate: "2026-07-25", medications: [
    { name: "Naproxen", strength: "250mg", form: "Tablet", frequency: "BD (Morning & Evening)", duration: "5 days", instructions: "Take after food", quantity: 10, refills: 0 },
    { name: "Omeprazole", strength: "20mg", form: "Capsule", frequency: "Once daily (before breakfast)", duration: "5 days", instructions: "Take on empty stomach", quantity: 5, refills: 0 },
  ], pharmacyNotes: "Generic substitution permitted. Patient has no known drug allergies.", digitallySigned: true, sentToPharmacy: true, sentToPatientPortal: true, drugInteractions: [], allergyAlerts: [] },
];

export interface LabOrder {
  id: string; patientId: string; patientName: string;
  providerId: string; providerName: string;
  orderDate: string; tests: { name: string; category: string; priority: string; }[];
  clinicalNotes: string; status: string; diagnosticPackage?: string;
  expectedResultDate: string; sentToLab: boolean;
}

export const LAB_ORDERS: LabOrder[] = [
  { id: "LAB-001", patientId: "P-2001", patientName: "Amit Joshi", providerId: "DR-001", providerName: "Dr. Priya Sharma", orderDate: "2026-07-25", tests: [
    { name: "Complete Blood Count (CBC)", category: "Hematology", priority: "Urgent" },
    { name: "C-Reactive Protein (CRP)", category: "Biochemistry", priority: "Urgent" },
    { name: "Chest X-Ray PA View", category: "Radiology", priority: "Routine" },
  ], clinicalNotes: "Persistent cough with low-grade fever. Rule out lower respiratory tract infection.", status: "Ordered", expectedResultDate: "2026-07-26", sentToLab: true },
];

export interface RadiologyOrder {
  id: string; patientId: string; patientName: string;
  providerId: string; providerName: string;
  orderDate: string; study: string; bodyPart: string;
  indication: string; priority: string; status: string;
  clinicalNotes: string; sentToRadiology: boolean;
}

export const RADIOLOGY_ORDERS: RadiologyOrder[] = [
  { id: "RAD-001", patientId: "P-2001", patientName: "Amit Joshi", providerId: "DR-001", providerName: "Dr. Priya Sharma", orderDate: "2026-07-25", study: "Chest X-Ray", bodyPart: "Chest PA View", indication: "Persistent cough, fever", priority: "Urgent", status: "Ordered", clinicalNotes: "Rule out pneumonia, bronchitis", sentToRadiology: true },
  { id: "RAD-002", patientId: "P-2006", patientName: "Deepak Nair", providerId: "DR-004", providerName: "Dr. Mohan Reddy", orderDate: "2026-07-25", study: "MRI Right Knee", bodyPart: "Right Knee (AP + Lateral)", indication: "Chronic knee pain, difficulty climbing stairs", priority: "Routine", status: "Ordered", clinicalNotes: "Suspect osteoarthritis. Rule out meniscal tear.", sentToRadiology: true },
];

export interface SecureMessage {
  id: string; senderId: string; senderName: string;
  receiverId: string; receiverName: string;
  content: string; timestamp: string;
  status: MessageStatus; hasAttachment: boolean;
  attachmentName?: string; consultationId?: string;
  quickTemplate?: string;
}

export const SECURE_MESSAGES: SecureMessage[] = [
  { id: "MSG-001", senderId: "P-2001", senderName: "Amit Joshi", receiverId: "DR-001", receiverName: "Dr. Priya Sharma", content: "Doctor, I've uploaded my previous chest X-ray reports for your reference.", timestamp: "2026-07-25T08:45:00", status: "Read", hasAttachment: true, attachmentName: "chest_xray_2025.pdf", consultationId: "VAP-001" },
  { id: "MSG-002", senderId: "DR-001", senderName: "Dr. Priya Sharma", receiverId: "P-2001", receiverName: "Amit Joshi", content: "Thank you, Amit. I've reviewed them. Please join the waiting room 5 minutes before your appointment.", timestamp: "2026-07-25T08:48:00", status: "Read", hasAttachment: false, consultationId: "VAP-001" },
  { id: "MSG-003", senderId: "P-2004", senderName: "Sunita Devi", receiverId: "DR-005", receiverName: "Dr. Anjali Nair", content: "Doctor, my son's temperature is still 102.4F. Should I give paracetamol now or wait for the consultation?", timestamp: "2026-07-25T10:15:00", status: "Unread", hasAttachment: false, consultationId: "VAP-004" },
];

export interface BillingRecord {
  id: string; appointmentId: string; patientName: string;
  providerName: string; specialty: string;
  consultationFee: number; platformFee: number;
  taxAmount: number; totalAmount: number;
  discount: number; netAmount: number;
  paymentMethod: string; paymentStatus: PaymentStatus;
  transactionId?: string; invoiceDate: string;
  insuranceClaim?: { provider: string; claimId: string; approvedAmount: number; status: string; };
  refundAmount?: number; refundDate?: string;
}

export const BILLING_RECORDS: BillingRecord[] = [
  { id: "INV-001", appointmentId: "VAP-001", patientName: "Amit Joshi", providerName: "Dr. Priya Sharma", specialty: "General Medicine", consultationFee: 800, platformFee: 50, taxAmount: 153, totalAmount: 1003, discount: 0, netAmount: 1003, paymentMethod: "UPI", paymentStatus: "Paid", transactionId: "UPI-TXN-20260725-001", invoiceDate: "2026-07-25", insuranceClaim: { provider: "Star Health", claimId: "SH-CLM-001", approvedAmount: 600, status: "Approved" } },
  { id: "INV-002", appointmentId: "VAP-004", patientName: "Sunita Devi", providerName: "Dr. Anjali Nair", specialty: "Pediatrics", consultationFee: 750, platformFee: 50, taxAmount: 144, totalAmount: 944, discount: 0, netAmount: 944, paymentMethod: "Credit Card", paymentStatus: "Paid", transactionId: "CC-TXN-20260725-002", invoiceDate: "2026-07-25", insuranceClaim: { provider: "New India Assurance", claimId: "NIA-CLM-002", approvedAmount: 500, status: "Pending" } },
  { id: "INV-003", appointmentId: "VAP-008", patientName: "Arjun Patel", providerName: "Dr. Sunita Patel", specialty: "Dermatology", consultationFee: 900, platformFee: 50, taxAmount: 171, totalAmount: 1121, discount: 0, netAmount: 1121, paymentMethod: "UPI", paymentStatus: "Refunded", transactionId: "UPI-TXN-20260725-003", invoiceDate: "2026-07-25", refundAmount: 1121, refundDate: "2026-07-25" },
];

export interface ConsentRecord {
  id: string; patientId: string; patientName: string;
  consentType: string; consentText: string;
  signedDate?: string; expiryDate: string;
  status: ConsentStatus; verifiedBy: string;
  auditTrail: { action: string; timestamp: string; user: string; }[];
}

export const CONSENT_RECORDS: ConsentRecord[] = [
  { id: "CON-001", patientId: "P-2001", patientName: "Amit Joshi", consentType: "Telemedicine Consent", consentText: "I, Amit Joshi, hereby consent to receive medical consultation via telemedicine platform. I understand that the consultation is conducted remotely and may have limitations compared to in-person visits.", signedDate: "2026-07-25T08:50:00", expiryDate: "2026-07-25", status: "Signed", verifiedBy: "System (OTP Verified)", auditTrail: [{ action: "Consent Presented", timestamp: "2026-07-25T08:45:00", user: "System" }, { action: "OTP Sent", timestamp: "2026-07-25T08:48:00", user: "System" }, { action: "Consent Signed", timestamp: "2026-07-25T08:50:00", user: "Patient" }] },
  { id: "CON-002", patientId: "P-2005", patientName: "Kavitha Reddy", consentType: "Psychiatric Consultation Consent", consentText: "I understand that psychiatric teleconsultation requires additional privacy measures. I consent to the recording of the session for medical records. I understand my right to confidentiality with statutory exceptions.", status: "Pending", expiryDate: "2026-07-25", verifiedBy: "", auditTrail: [{ action: "Consent Presented", timestamp: "2026-07-25T09:00:00", user: "System" }] },
];

export interface FollowUpPlan {
  id: string; patientId: string; patientName: string;
  providerId: string; providerName: string;
  nextVisitDate: string; visitType: ConsultType;
  reason: string; instructions: string;
  reminderSet: boolean; recurring: boolean;
  referralRequired: boolean; referralSpecialty?: string;
  telemedicineEligible: boolean; notified: boolean;
}

export const FOLLOW_UP_PLANS: FollowUpPlan[] = [
  { id: "FU-001", patientId: "P-2007", patientName: "Lakshmi Iyer", providerId: "DR-001", providerName: "Dr. Priya Sharma", nextVisitDate: "2026-08-01", visitType: "Video", reason: "Follow-up for tension headache — assess response to treatment", instructions: "Continue Naproxen if needed. Practice relaxation techniques. Keep headache diary.", reminderSet: true, recurring: false, referralRequired: false, telemedicineEligible: true, notified: true },
  { id: "FU-002", patientId: "P-2002", patientName: "Meera Gupta", providerId: "DR-002", providerName: "Dr. Rajesh Kumar", nextVisitDate: "2026-08-08", visitType: "Video", reason: "Cardiology follow-up — ECG review, medication titration", instructions: "Bring latest ECG. Continue current medications. Avoid strenuous activity.", reminderSet: true, recurring: true, referralRequired: false, telemedicineEligible: true, notified: false },
];

export interface ProviderAnalytic {
  metric: string; value: string | number; trend: "up" | "down" | "stable";
  change: string; period: string;
}

export const PROVIDER_ANALYTICS: ProviderAnalytic[] = [
  { metric: "Total Consultations", value: 142, trend: "up", change: "+12%", period: "This Month" },
  { metric: "Avg Consultation Time", value: "18.5 min", trend: "down", change: "-2 min", period: "This Month" },
  { metric: "Patient Satisfaction", value: "4.7/5", trend: "up", change: "+0.2", period: "This Month" },
  { metric: "No-show Rate", value: "8.2%", trend: "down", change: "-1.5%", period: "This Month" },
  { metric: "Revenue", value: "Rs.1,18,400", trend: "up", change: "+15%", period: "This Month" },
  { metric: "Repeat Patients", value: "34%", trend: "up", change: "+5%", period: "This Month" },
  { metric: "Documentation Completeness", value: "96%", trend: "up", change: "+3%", period: "This Month" },
  { metric: "Avg Wait Time", value: "4.2 min", trend: "down", change: "-1.1 min", period: "This Month" },
];

export interface ConnectivityLog {
  id: string; patientName: string; timestamp: string;
  downloadSpeed: number; uploadSpeed: number; latency: number;
  packetLoss: number; status: ConnectivityStatus;
  device: string; browser: string;
}

export const CONNECTIVITY_LOGS: ConnectivityLog[] = [
  { id: "CL-001", patientName: "Amit Joshi", timestamp: "2026-07-25T08:52:00", downloadSpeed: 45.2, uploadSpeed: 12.8, latency: 18, packetLoss: 0.1, status: "Excellent", device: "Desktop", browser: "Chrome 125" },
  { id: "CL-002", patientName: "Ravi Teja", timestamp: "2026-07-25T09:48:00", downloadSpeed: 22.5, uploadSpeed: 8.3, latency: 35, packetLoss: 0.5, status: "Good", device: "Mobile", browser: "Safari 17" },
  { id: "CL-003", patientName: "Sunita Devi", timestamp: "2026-07-25T10:10:00", downloadSpeed: 8.1, uploadSpeed: 3.2, latency: 85, packetLoss: 2.1, status: "Fair", device: "Tablet", browser: "Chrome 125" },
];

export interface AuditEntry {
  id: string; timestamp: string; user: string; action: string;
  resource: string; details: string; ipAddress: string;
  severity: "Info" | "Warning" | "Critical";
}

export const AUDIT_LOGS: AuditEntry[] = [
  { id: "AUD-001", timestamp: "2026-07-25T12:10:00", user: "Dr. Priya Sharma", action: "Consultation Completed", resource: "VAP-007", details: "Chat consultation with Lakshmi Iyer — Prescription issued", ipAddress: "192.168.1.100", severity: "Info" },
  { id: "AUD-002", timestamp: "2026-07-25T10:32:00", user: "Dr. Anjali Nair", action: "Consultation Started", resource: "VAP-004", details: "Audio consultation with Sunita Devi — Pediatric emergency", ipAddress: "192.168.1.105", severity: "Info" },
  { id: "AUD-003", timestamp: "2026-07-25T08:50:00", user: "System", action: "Consent Signed", resource: "CON-001", details: "Amit Joshi — Telemedicine consent signed via OTP", ipAddress: "192.168.1.100", severity: "Info" },
  { id: "AUD-004", timestamp: "2026-07-25T09:00:00", user: "System", action: "Payment Received", resource: "INV-001", details: "Amit Joshi — Rs.1,003 via UPI — Transaction UPI-TXN-20260725-001", ipAddress: "System", severity: "Info" },
  { id: "AUD-005", timestamp: "2026-07-25T10:15:00", user: "System", action: "Connectivity Warning", resource: "VAP-004", details: "Sunita Devi — Download speed dropped to 8.1 Mbps. Audio fallback recommended.", ipAddress: "System", severity: "Warning" },
  { id: "AUD-006", timestamp: "2026-07-24T16:00:00", user: "Dr. Priya Sharma", action: "Prescription Signed", resource: "RX-001", details: "Lakshmi Iyer — Digital prescription signed and sent to pharmacy", ipAddress: "192.168.1.100", severity: "Info" },
];

export interface QualityMetric {
  metric: string; target: string; actual: string;
  status: "Pass" | "Warning" | "Fail"; period: string;
}

export const QUALITY_METRICS: QualityMetric[] = [
  { metric: "Documentation Completeness", target: "≥95%", actual: "96%", status: "Pass", period: "July 2026" },
  { metric: "Prescription Safety Score", target: "≥98%", actual: "99.2%", status: "Pass", period: "July 2026" },
  { metric: "Consent Compliance", target: "100%", actual: "100%", status: "Pass", period: "July 2026" },
  { metric: "Patient Satisfaction", target: "≥4.5/5", actual: "4.7/5", status: "Pass", period: "July 2026" },
  { metric: "Avg Response Time", target: "≤5 min", actual: "4.2 min", status: "Pass", period: "July 2026" },
  { metric: "Follow-up Completion", target: "≥90%", actual: "87%", status: "Warning", period: "July 2026" },
  { metric: "No-show Rate", target: "≤10%", actual: "8.2%", status: "Pass", period: "July 2026" },
  { metric: "Record Access Audit", target: "100%", actual: "100%", status: "Pass", period: "July 2026" },
];

export interface MedicalCertificate {
  id: string; patientId: string; patientName: string;
  providerId: string; providerName: string;
  certificateType: string; issueDate: string;
  validFrom: string; validTo: string;
  reason: string; digitallySigned: boolean;
}

export const MEDICAL_CERTIFICATES: MedicalCertificate[] = [
  { id: "MC-001", patientId: "P-2007", patientName: "Lakshmi Iyer", providerId: "DR-001", providerName: "Dr. Priya Sharma", certificateType: "Sick Leave Certificate", issueDate: "2026-07-25", validFrom: "2026-07-25", validTo: "2026-07-27", reason: "Tension-type headache — rest recommended", digitallySigned: true },
];

/* ── KPIs ─────────────────────────────────────────────────────────────────── */
export const TELEMEDICINE_KPI = {
  todayConsultations: 14,
  waitingPatients: 2,
  completedVisits: 6,
  missedAppointments: 1,
  unreadMessages: 3,
  revenue: 118400,
  pendingDocumentation: 2,
  avgWaitTime: 4.2,
  patientSatisfaction: 4.7,
  noShowRate: 8.2,
  connectivityIssues: 1,
  activeSessions: 2,
};

/* ── Helpers ──────────────────────────────────────────────────────────────── */
export function apptStatusTone(s: ApptStatus): "success" | "warning" | "danger" | "info" {
  switch (s) { case "Completed": return "success"; case "In Progress": return "info"; case "Waiting": case "Checked In": return "warning"; case "Cancelled": case "No Show": return "danger"; case "Scheduled": return "info"; default: return "info"; }
}
export function consentStatusTone(s: ConsentStatus): "success" | "warning" | "danger" | "info" {
  switch (s) { case "Signed": return "success"; case "Pending": return "warning"; case "Declined": case "Expired": return "danger"; default: return "info"; }
}
export function paymentStatusTone(s: PaymentStatus): "success" | "warning" | "danger" | "info" {
  switch (s) { case "Paid": return "success"; case "Pending": return "warning"; case "Refunded": return "info"; case "Insurance": return "info"; case "Partial": return "warning"; default: return "info"; }
}
export function connectivityTone(s: ConnectivityStatus): "success" | "warning" | "danger" | "info" {
  switch (s) { case "Excellent": return "success"; case "Good": return "info"; case "Fair": return "warning"; case "Poor": case "Disconnected": return "danger"; default: return "info"; }
}
export function messageStatusTone(s: MessageStatus): "success" | "warning" | "danger" | "info" {
  switch (s) { case "Read": return "success"; case "Delivered": return "info"; case "Sent": return "info"; case "Unread": return "warning"; default: "info"; }
}
export function sessionStatusTone(s: SessionStatus): "success" | "warning" | "danger" | "info" {
  switch (s) { case "Connected": return "success"; case "Connecting": return "warning"; case "On Hold": return "warning"; case "Ended": return "danger"; case "Not Started": return "info"; default: return "info"; }
}
export function formatCurrency(n: number): string { return `Rs.${n.toLocaleString("en-IN")}`; }
