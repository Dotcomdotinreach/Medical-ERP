// ──────────────────────────────────────────────────────────────────────────────
// Enterprise Interoperability Hub — Data & Types
// ──────────────────────────────────────────────────────────────────────────────

export type InterfaceDirection = "inbound" | "outbound";
export type InterfaceStatus = "active" | "warning" | "failed" | "maintenance" | "degraded";
export type MessageStatus = "received" | "processing" | "transformed" | "routed" | "delivered" | "acknowledged" | "failed" | "retrying" | "dead-letter";
export type Environment = "sandbox" | "staging" | "production";
export type Protocol = "hl7v2" | "fhir-r4" | "fhir-r5" | "dicom" | "rest" | "graphql" | "webhook" | "soap";
export type FhirResource = "Patient" | "Encounter" | "Observation" | "Condition" | "Medication" | "MedicationRequest" | "Appointment" | "DiagnosticReport" | "ImagingStudy" | "AllergyIntolerance" | "Procedure" | "Immunization";
export type Hl7MessageType = "ADT" | "ORM" | "ORU" | "SIU" | "DFT" | "MDM" | "ACK" | "NACK";
export type Severity = "info" | "warning" | "error" | "critical";
export type CertificateStatus = "valid" | "expiring" | "expired" | "revoked";
export type AuthMethod = "oauth2" | "openid-connect" | "jwt" | "mtls" | "api-key";
export type TerminologySystem = "ICD-10" | "SNOMED-CT" | "LOINC" | "RxNorm" | "UCUM" | "CPT" | "NDC";
export type MatchConfidence = "high" | "medium" | "low";
export type MergeStatus = "pending" | "approved" | "rejected" | "completed";
export type BackupStatus = "completed" | "in-progress" | "failed" | "scheduled";
export type DrillStatus = "passed" | "failed" | "in-progress" | "scheduled";

export interface Interface {
  id: string; name: string; direction: InterfaceDirection; protocol: Protocol;
  status: InterfaceStatus; sourceSystem: string; destinationSystem: string;
  messageType: string; messagesPerHour: number; avgLatencyMs: number;
  errorRate: number; uptime: number; lastActivity: string; version: string; environment: Environment;
}

export interface Message {
  id: string; interfaceId: string; messageType: string; status: MessageStatus;
  direction: InterfaceDirection; sourceSystem: string; destinationSystem: string;
  correlationId: string; payload: string; timestamp: string; processedAt?: string;
  acknowledgedAt?: string; retryCount: number; maxRetries: number; error?: string; size: number;
}

export interface FhirEndpoint {
  resource: string; endpoint: string; method: string; totalRequests: number;
  avgResponseMs: number; errorRate: number; lastAccessed: string; supported: boolean;
}

export interface DicomStudy {
  id: string; studyInstanceUid: string; patientName: string; patientId: string;
  modality: string; studyDescription: string; institutionName: string; studyDate: string;
  seriesCount: number; imageCount: number; sizeMb: number; status: string;
  pacNode: string; transferSyntax: string; aet: string;
}

export interface SmartApp {
  id: string; name: string; version: string; developer: string; scopes: string[];
  launchContext: string; status: string; installs: number; lastUsed: string;
  authMethod: string; permissions: string[];
}

export interface ApiEndpoint {
  id: string; path: string; method: string; protocol: string; description: string;
  rateLimit: number; authRequired: boolean; totalCalls: number; avgLatencyMs: number;
  errorRate: number; status: string; version: string;
}

export interface OAuthClient {
  id: string; name: string; clientId: string; grantTypes: string[]; scopes: string[];
  status: string; createdAt: string; lastUsed: string; tokenCount: number;
}

export interface MpiRecord {
  id: string; enterpriseId: string; sourceIds: { system: string; id: string }[];
  firstName: string; lastName: string; dateOfBirth: string; gender: string;
  ssn: string; mrn: string; matchConfidence: string; duplicateCount: number;
  mergeStatus?: string; lastUpdated: string; verified: boolean;
}

export interface DuplicatePair {
  id: string; recordA: MpiRecord; recordB: MpiRecord; matchScore: number;
  matchingFields: string[]; status: string; detectedAt: string; reviewedBy?: string;
}

export interface ProviderRecord {
  id: string; npi: string; firstName: string; lastName: string; specialty: string;
  department: string; licenseNumber: string; licenseExpiry: string; privileges: string[];
  status: string; lastUpdated: string; email: string;
}

export interface TerminologyMapping {
  id: string; sourceSystem: string; sourceCode: string; sourceDisplay: string;
  targetSystem: string; targetCode: string; targetDisplay: string; equivalence: string;
  lastUpdated: string; validated: boolean;
}

export interface ExternalSystem {
  id: string; name: string; type: string; status: string; lastSync: string;
  syncFrequency: string; messageCount: number; errorRate: number; version: string; endpoint: string;
}

export interface MonitoringMetric {
  timestamp: string; queueDepth: number; throughput: number; latencyMs: number;
  errorCount: number; cpuUsage: number; memoryUsage: number;
}

export interface SecurityEvent {
  id: string; type: string; severity: string; source: string; description: string;
  timestamp: string; resolved: boolean; user?: string;
}

export interface Certificate {
  id: string; name: string; issuer: string; subject: string; issuedAt: string;
  expiresAt: string; status: string; fingerprint: string; algorithm: string; keySize: number;
}

export interface AuditEntry {
  id: string; timestamp: string; userId: string; userName: string; action: string;
  resource: string; resourceId: string; sourceSystem: string; destinationSystem: string;
  messageType: string; correlationId: string; status: string; ipAddress: string; details: string;
}

export interface TransformationRule {
  id: string; name: string; sourceFormat: string; targetFormat: string; description: string;
  mappings: number; status: string; lastTested: string; version: string;
}

export interface WebhookSubscription {
  id: string; name: string; url: string; events: string[]; secret: string;
  status: string; lastTriggered: string; successRate: number; retryPolicy: string;
}

export interface BackupRecord {
  id: string; name: string; type: string; size: string; timestamp: string;
  status: string; retention: string; verified: boolean;
}

export interface DisasterRecoveryDrill {
  id: string; name: string; lastRun: string; nextRun: string; status: string;
  rto: string; rpo: string; duration: string; successRate: number;
}

export interface DashboardKpis {
  activeInterfaces: number; connectedSystems: number; queuedMessages: number;
  fhirRequests: number; hl7Messages: number; dicomTransfers: number;
  failedTransactions: number; operationalAlerts: number; avgLatency: number;
  throughput: number; uptime: number; errorRate: number;
}

export const interfaces: Interface[] = [
  { id: "IF-001", name: "Epic EMR ADT Feed", direction: "inbound", protocol: "hl7v2", status: "active", sourceSystem: "Epic EMR", destinationSystem: "HMIS Core", messageType: "ADT^A01", messagesPerHour: 142, avgLatencyMs: 45, errorRate: 0.2, uptime: 99.97, lastActivity: "2026-07-24T10:30:00Z", version: "2.5.1", environment: "production" },
  { id: "IF-002", name: "LabCorp LIS Results", direction: "inbound", protocol: "hl7v2", status: "active", sourceSystem: "LabCorp", destinationSystem: "LIS Module", messageType: "ORU^R01", messagesPerHour: 89, avgLatencyMs: 120, errorRate: 0.5, uptime: 99.82, lastActivity: "2026-07-24T10:28:00Z", version: "2.5.1", environment: "production" },
  { id: "IF-003", name: "FHIR Patient API", direction: "outbound", protocol: "fhir-r4", status: "active", sourceSystem: "HMIS Core", destinationSystem: "HIE Gateway", messageType: "Patient", messagesPerHour: 312, avgLatencyMs: 85, errorRate: 0.1, uptime: 99.99, lastActivity: "2026-07-24T10:31:00Z", version: "4.0.1", environment: "production" },
  { id: "IF-004", name: "PACS DICOM Router", direction: "outbound", protocol: "dicom", status: "warning", sourceSystem: "PACS Server", destinationSystem: "Cloud Archive", messageType: "C-STORE", messagesPerHour: 56, avgLatencyMs: 340, errorRate: 2.1, uptime: 98.5, lastActivity: "2026-07-24T10:15:00Z", version: "3.0", environment: "production" },
  { id: "IF-005", name: "RxNorm Drug Catalog", direction: "inbound", protocol: "rest", status: "active", sourceSystem: "NLM RxNorm", destinationSystem: "Pharmacy Module", messageType: "GET", messagesPerHour: 45, avgLatencyMs: 200, errorRate: 0.0, uptime: 100.0, lastActivity: "2026-07-24T10:00:00Z", version: "1.0", environment: "production" },
  { id: "IF-006", name: "CMS Claims Interface", direction: "outbound", protocol: "hl7v2", status: "failed", sourceSystem: "Billing Module", destinationSystem: "CMS Gateway", messageType: "DFT^P03", messagesPerHour: 0, avgLatencyMs: 0, errorRate: 100, uptime: 0, lastActivity: "2026-07-23T18:45:00Z", version: "2.5.1", environment: "production" },
  { id: "IF-007", name: "Surescripts eRx", direction: "outbound", protocol: "rest", status: "active", sourceSystem: "Pharmacy Module", destinationSystem: "Surescripts", messageType: "POST", messagesPerHour: 67, avgLatencyMs: 150, errorRate: 0.3, uptime: 99.95, lastActivity: "2026-07-24T10:25:00Z", version: "2.0", environment: "production" },
  { id: "IF-008", name: "Telehealth Video Bridge", direction: "outbound", protocol: "webhook", status: "active", sourceSystem: "Telemedicine Module", destinationSystem: "Twilio Video", messageType: "webhook", messagesPerHour: 23, avgLatencyMs: 500, errorRate: 0.8, uptime: 99.9, lastActivity: "2026-07-24T10:20:00Z", version: "1.0", environment: "production" },
  { id: "IF-009", name: "HIE Consent Exchange", direction: "inbound", protocol: "fhir-r4", status: "maintenance", sourceSystem: "State HIE", destinationSystem: "Consent Module", messageType: "Consent", messagesPerHour: 5, avgLatencyMs: 0, errorRate: 0, uptime: 95.0, lastActivity: "2026-07-24T08:00:00Z", version: "4.0.1", environment: "staging" },
  { id: "IF-010", name: "Insurance Eligibility", direction: "outbound", protocol: "rest", status: "active", sourceSystem: "Billing Module", destinationSystem: "Availity Gateway", messageType: "GET", messagesPerHour: 134, avgLatencyMs: 320, errorRate: 1.2, uptime: 99.7, lastActivity: "2026-07-24T10:30:00Z", version: "3.0", environment: "production" },
  { id: "IF-011", name: "Blood Bank Interface", direction: "inbound", protocol: "hl7v2", status: "active", sourceSystem: "Blood Bank Vendor", destinationSystem: "Blood Bank Module", messageType: "ORU^R01", messagesPerHour: 12, avgLatencyMs: 90, errorRate: 0.0, uptime: 100.0, lastActivity: "2026-07-24T10:10:00Z", version: "2.5.1", environment: "production" },
  { id: "IF-012", name: "Genomics Lab Feed", direction: "inbound", protocol: "fhir-r5", status: "active", sourceSystem: "Invitae", destinationSystem: "Oncology Module", messageType: "DiagnosticReport", messagesPerHour: 8, avgLatencyMs: 450, errorRate: 0.0, uptime: 99.99, lastActivity: "2026-07-24T09:45:00Z", version: "5.0.0", environment: "production" },
];

export const messages: Message[] = [
  { id: "MSG-001", interfaceId: "IF-001", messageType: "ADT^A01", status: "acknowledged", direction: "inbound", sourceSystem: "Epic EMR", destinationSystem: "HMIS Core", correlationId: "COR-20260724-001", payload: "MSH|^~\\&|EPIC|HOSPITAL|HMIS|HOSPITAL|20260724103000||ADT^A01|MSG00001|P|2.5.1|||AL|NE\rEVN|A01|20260724103000\rPID|1||MRN001^^^HOSP||DOE^JOHN^M||19850315|M", timestamp: "2026-07-24T10:30:00Z", processedAt: "2026-07-24T10:30:00.045Z", acknowledgedAt: "2026-07-24T10:30:00.120Z", retryCount: 0, maxRetries: 3, size: 412 },
  { id: "MSG-002", interfaceId: "IF-002", messageType: "ORU^R01", status: "delivered", direction: "inbound", sourceSystem: "LabCorp", destinationSystem: "LIS Module", correlationId: "COR-20260724-002", payload: "MSH|^~\\&|LABCORP|LAB|HMIS|HOSP|20260724102800||ORU^R01|MSG00002|P|2.5.1", timestamp: "2026-07-24T10:28:00Z", processedAt: "2026-07-24T10:28:00.120Z", retryCount: 0, maxRetries: 3, size: 534 },
  { id: "MSG-003", interfaceId: "IF-003", messageType: "Patient", status: "acknowledged", direction: "outbound", sourceSystem: "HMIS Core", destinationSystem: "HIE Gateway", correlationId: "COR-20260724-003", payload: "{\"resourceType\":\"Patient\",\"id\":\"pat-001\",\"name\":[{\"family\":\"DOE\",\"given\":[\"JOHN\"]}]}", timestamp: "2026-07-24T10:31:00Z", processedAt: "2026-07-24T10:31:00.085Z", acknowledgedAt: "2026-07-24T10:31:00.200Z", retryCount: 0, maxRetries: 3, size: 289 },
  { id: "MSG-004", interfaceId: "IF-006", messageType: "DFT^P03", status: "failed", direction: "outbound", sourceSystem: "Billing Module", destinationSystem: "CMS Gateway", correlationId: "COR-20260723-015", payload: "MSH|^~\\&|HMIS|HOSPITAL|CMS|GOV|20260723184500||DFT^P03|MSG00015|P|2.5.1", timestamp: "2026-07-23T18:45:00Z", retryCount: 3, maxRetries: 3, error: "Connection refused: CMS endpoint unreachable (HTTP 503)", size: 356 },
  { id: "MSG-005", interfaceId: "IF-001", messageType: "ADT^A03", status: "processing", direction: "inbound", sourceSystem: "Epic EMR", destinationSystem: "HMIS Core", correlationId: "COR-20260724-005", payload: "MSH|^~\\&|EPIC|HOSPITAL|HMIS|HOSPITAL|20260724103200||ADT^A03|MSG00005|P|2.5.1", timestamp: "2026-07-24T10:32:00Z", retryCount: 0, maxRetries: 3, size: 198 },
  { id: "MSG-006", interfaceId: "IF-011", messageType: "ORU^R01", status: "received", direction: "inbound", sourceSystem: "Blood Bank Vendor", destinationSystem: "Blood Bank Module", correlationId: "COR-20260724-006", payload: "MSH|^~\\&|BBS|BANK|HMIS|HOSP|20260724101000||ORU^R01|MSG00006|P|2.5.1", timestamp: "2026-07-24T10:10:00Z", retryCount: 0, maxRetries: 3, size: 245 },
  { id: "MSG-007", interfaceId: "IF-004", messageType: "C-STORE", status: "retrying", direction: "outbound", sourceSystem: "PACS Server", destinationSystem: "Cloud Archive", correlationId: "COR-20260724-007", payload: "DICOM Study: CT Chest | Patient: SMITH^JANE", timestamp: "2026-07-24T10:15:00Z", retryCount: 2, maxRetries: 5, error: "Timeout: Cloud archive node response exceeded 30s", size: 52428800 },
  { id: "MSG-008", interfaceId: "IF-010", messageType: "GET", status: "acknowledged", direction: "outbound", sourceSystem: "Billing Module", destinationSystem: "Availity Gateway", correlationId: "COR-20260724-008", payload: "GET /api/v2/eligibility?patientId=MRN001", timestamp: "2026-07-24T10:30:00Z", processedAt: "2026-07-24T10:30:00.320Z", acknowledgedAt: "2026-07-24T10:30:00.640Z", retryCount: 0, maxRetries: 3, size: 128 },
  { id: "MSG-009", interfaceId: "IF-007", messageType: "POST", status: "delivered", direction: "outbound", sourceSystem: "Pharmacy Module", destinationSystem: "Surescripts", correlationId: "COR-20260724-009", payload: "{\"transactionId\":\"RX-4567\",\"patient\":\"MRN001\"}", timestamp: "2026-07-24T10:25:00Z", processedAt: "2026-07-24T10:25:00.150Z", acknowledgedAt: "2026-07-24T10:25:00.380Z", retryCount: 0, maxRetries: 3, size: 178 },
  { id: "MSG-010", interfaceId: "IF-009", messageType: "Consent", status: "dead-letter", direction: "inbound", sourceSystem: "State HIE", destinationSystem: "Consent Module", correlationId: "COR-20260724-010", payload: "{\"resourceType\":\"Consent\",\"status\":\"active\"}", timestamp: "2026-07-24T08:00:00Z", retryCount: 5, maxRetries: 5, error: "Validation failed: Missing consent scope definition", size: 234 },
];

export const fhirEndpoints: FhirEndpoint[] = [
  { resource: "Patient", endpoint: "/api/fhir/r4/Patient", method: "GET/POST", totalRequests: 12450, avgResponseMs: 45, errorRate: 0.1, lastAccessed: "2026-07-24T10:30:00Z", supported: true },
  { resource: "Encounter", endpoint: "/api/fhir/r4/Encounter", method: "GET/POST", totalRequests: 8920, avgResponseMs: 62, errorRate: 0.2, lastAccessed: "2026-07-24T10:29:00Z", supported: true },
  { resource: "Observation", endpoint: "/api/fhir/r4/Observation", method: "GET/POST", totalRequests: 23100, avgResponseMs: 78, errorRate: 0.3, lastAccessed: "2026-07-24T10:31:00Z", supported: true },
  { resource: "Condition", endpoint: "/api/fhir/r4/Condition", method: "GET/POST", totalRequests: 5670, avgResponseMs: 55, errorRate: 0.1, lastAccessed: "2026-07-24T10:28:00Z", supported: true },
  { resource: "Medication", endpoint: "/api/fhir/r4/Medication", method: "GET", totalRequests: 3400, avgResponseMs: 35, errorRate: 0.0, lastAccessed: "2026-07-24T10:25:00Z", supported: true },
  { resource: "MedicationRequest", endpoint: "/api/fhir/r4/MedicationRequest", method: "GET/POST", totalRequests: 7800, avgResponseMs: 68, errorRate: 0.4, lastAccessed: "2026-07-24T10:30:00Z", supported: true },
  { resource: "Appointment", endpoint: "/api/fhir/r4/Appointment", method: "GET/POST", totalRequests: 4500, avgResponseMs: 52, errorRate: 0.1, lastAccessed: "2026-07-24T10:27:00Z", supported: true },
  { resource: "DiagnosticReport", endpoint: "/api/fhir/r4/DiagnosticReport", method: "GET/POST", totalRequests: 9800, avgResponseMs: 92, errorRate: 0.2, lastAccessed: "2026-07-24T10:30:00Z", supported: true },
  { resource: "ImagingStudy", endpoint: "/api/fhir/r4/ImagingStudy", method: "GET", totalRequests: 2100, avgResponseMs: 145, errorRate: 0.5, lastAccessed: "2026-07-24T10:20:00Z", supported: true },
  { resource: "AllergyIntolerance", endpoint: "/api/fhir/r4/AllergyIntolerance", method: "GET/POST", totalRequests: 3200, avgResponseMs: 42, errorRate: 0.0, lastAccessed: "2026-07-24T10:26:00Z", supported: true },
  { resource: "Procedure", endpoint: "/api/fhir/r4/Procedure", method: "GET/POST", totalRequests: 6100, avgResponseMs: 58, errorRate: 0.1, lastAccessed: "2026-07-24T10:29:00Z", supported: true },
  { resource: "Immunization", endpoint: "/api/fhir/r4/Immunization", method: "GET/POST", totalRequests: 2800, avgResponseMs: 38, errorRate: 0.0, lastAccessed: "2026-07-24T10:22:00Z", supported: true },
];

export const dicomStudies: DicomStudy[] = [
  { id: "DCM-001", studyInstanceUid: "1.2.840.113619.2.301.3.1", patientName: "DOE^JOHN", patientId: "MRN001", modality: "CT", studyDescription: "CT Chest with Contrast", institutionName: "City General Hospital", studyDate: "2026-07-24", seriesCount: 4, imageCount: 520, sizeMb: 450, status: "stored", pacNode: "PACS-PRIMARY", transferSyntax: "JPEG 2000", aet: "HIS_CT" },
  { id: "DCM-002", studyInstanceUid: "1.2.840.113619.2.301.3.2", patientName: "SMITH^JANE", patientId: "MRN002", modality: "MRI", studyDescription: "MRI Brain with/without Contrast", institutionName: "City General Hospital", studyDate: "2026-07-24", seriesCount: 8, imageCount: 1200, sizeMb: 890, status: "transferred", pacNode: "PACS-SECONDARY", transferSyntax: "JPEG 2000", aet: "HIS_MRI" },
  { id: "DCM-003", studyInstanceUid: "1.2.840.113619.2.301.3.3", patientName: "JOHNSON^ROBERT", patientId: "MRN003", modality: "XR", studyDescription: "X-Ray Left Knee", institutionName: "City General Hospital", studyDate: "2026-07-23", seriesCount: 2, imageCount: 4, sizeMb: 12, status: "stored", pacNode: "PACS-PRIMARY", transferSyntax: "JPEG Lossless", aet: "HIS_XR" },
  { id: "DCM-004", studyInstanceUid: "1.2.840.113619.2.301.3.4", patientName: "BROWN^SARAH", patientId: "MRN004", modality: "US", studyDescription: "Obstetric Ultrasound", institutionName: "City General Hospital", studyDate: "2026-07-24", seriesCount: 6, imageCount: 85, sizeMb: 120, status: "processing", pacNode: "PACS-PRIMARY", transferSyntax: "JPEG 2000", aet: "HIS_US" },
  { id: "DCM-005", studyInstanceUid: "1.2.840.113619.2.301.3.5", patientName: "WILSON^MICHAEL", patientId: "MRN005", modality: "CT", studyDescription: "CT Abdomen/Pelvis", institutionName: "City General Hospital", studyDate: "2026-07-23", seriesCount: 3, imageCount: 680, sizeMb: 520, status: "failed", pacNode: "CLOUD-ARCHIVE", transferSyntax: "JPEG 2000", aet: "HIS_CT2" },
  { id: "DCM-006", studyInstanceUid: "1.2.840.113619.2.301.3.6", patientName: "GARCIA^MARIA", patientId: "MRN006", modality: "NM", studyDescription: "Nuclear Medicine Bone Scan", institutionName: "City General Hospital", studyDate: "2026-07-24", seriesCount: 5, imageCount: 256, sizeMb: 340, status: "received", pacNode: "PACS-PRIMARY", transferSyntax: "Implicit VR Little Endian", aet: "HIS_NM" },
];

export const smartApps: SmartApp[] = [
  { id: "SMART-001", name: "Clinical Notes Assistant", version: "2.1.0", developer: "HealthTech Solutions", scopes: ["patient/*.read", "user/*.read", "launch"], launchContext: "patient", status: "active", installs: 45, lastUsed: "2026-07-24T10:30:00Z", authMethod: "oauth2", permissions: ["Read Patient", "Read Encounter", "Read Condition", "Write DocumentReference"] },
  { id: "SMART-002", name: "Radiology AI Triage", version: "3.0.1", developer: "AI Imaging Corp", scopes: ["patient/*.read", "imagingstudy/*.read", "launch"], launchContext: "patient", status: "active", installs: 23, lastUsed: "2026-07-24T10:15:00Z", authMethod: "oauth2", permissions: ["Read Patient", "Read ImagingStudy", "Read DiagnosticReport", "Write ServiceRequest"] },
  { id: "SMART-003", name: "Pharmacy Order Entry", version: "1.5.0", developer: "MedConnect Inc", scopes: ["patient/*.read", "medicationrequest/*.write", "launch"], launchContext: "patient", status: "active", installs: 67, lastUsed: "2026-07-24T10:25:00Z", authMethod: "openid-connect", permissions: ["Read Patient", "Read Medication", "Write MedicationRequest"] },
  { id: "SMART-004", name: "Genomics Explorer", version: "1.2.0", developer: "GeneLab Sciences", scopes: ["patient/*.read", "observation/*.read", "launch"], launchContext: "patient", status: "pending", installs: 8, lastUsed: "2026-07-20T14:00:00Z", authMethod: "jwt", permissions: ["Read Patient", "Read Observation", "Read DiagnosticReport"] },
  { id: "SMART-005", name: "Population Health Dashboard", version: "4.0.0", developer: "Public Health Analytics", scopes: ["patient/*.read", "group/*.read", "launch"], launchContext: "system", status: "active", installs: 12, lastUsed: "2026-07-24T09:00:00Z", authMethod: "oauth2", permissions: ["Read Patient", "Read Group", "Read Organization"] },
  { id: "SMART-006", name: "Telehealth Integration", version: "2.3.0", developer: "VideoMed Systems", scopes: ["patient/*.read", "appointment/*.write", "launch"], launchContext: "patient", status: "inactive", installs: 34, lastUsed: "2026-07-15T11:00:00Z", authMethod: "oauth2", permissions: ["Read Patient", "Write Appointment", "Read Schedule"] },
];

export const apiEndpoints: ApiEndpoint[] = [
  { id: "API-001", path: "/api/v2/patients", method: "GET", protocol: "REST", description: "Retrieve patient demographics and identifiers", rateLimit: 1000, authRequired: true, totalCalls: 45200, avgLatencyMs: 32, errorRate: 0.1, status: "active", version: "2.0" },
  { id: "API-002", path: "/api/v2/encounters", method: "GET", protocol: "REST", description: "List patient encounters with filters", rateLimit: 500, authRequired: true, totalCalls: 28900, avgLatencyMs: 45, errorRate: 0.2, status: "active", version: "2.0" },
  { id: "API-003", path: "/api/v2/observations", method: "GET/POST", protocol: "REST", description: "Query and submit clinical observations", rateLimit: 800, authRequired: true, totalCalls: 67300, avgLatencyMs: 55, errorRate: 0.3, status: "active", version: "2.0" },
  { id: "API-004", path: "/graphql", method: "POST", protocol: "GraphQL", description: "GraphQL endpoint for complex clinical queries", rateLimit: 200, authRequired: true, totalCalls: 12400, avgLatencyMs: 120, errorRate: 0.5, status: "active", version: "1.0" },
  { id: "API-005", path: "/api/v2/medications", method: "GET/POST", protocol: "REST", description: "Medication catalog and order management", rateLimit: 600, authRequired: true, totalCalls: 19800, avgLatencyMs: 38, errorRate: 0.1, status: "active", version: "2.0" },
  { id: "API-006", path: "/api/v2/appointments", method: "GET/POST", protocol: "REST", description: "Appointment scheduling and management", rateLimit: 400, authRequired: true, totalCalls: 15600, avgLatencyMs: 42, errorRate: 0.2, status: "active", version: "2.0" },
  { id: "API-007", path: "/api/v1/analytics", method: "GET", protocol: "REST", description: "Clinical analytics and reporting endpoints", rateLimit: 100, authRequired: true, totalCalls: 3400, avgLatencyMs: 250, errorRate: 0.0, status: "active", version: "1.0" },
  { id: "API-008", path: "/api/v1/webhooks", method: "POST", protocol: "REST", description: "Webhook registration and management", rateLimit: 50, authRequired: true, totalCalls: 890, avgLatencyMs: 180, errorRate: 0.4, status: "active", version: "1.0" },
];

export const oauthClients: OAuthClient[] = [
  { id: "OC-001", name: "Clinical Notes App", clientId: "cn-app-prod-2024", grantTypes: ["authorization_code", "refresh_token"], scopes: ["patient/*.read", "user/*.read"], status: "active", createdAt: "2026-01-15T00:00:00Z", lastUsed: "2026-07-24T10:30:00Z", tokenCount: 45 },
  { id: "OC-002", name: "Radiology AI Service", clientId: "rad-ai-svc-2024", grantTypes: ["client_credentials"], scopes: ["patient/*.read", "imagingstudy/*.read"], status: "active", createdAt: "2026-03-01T00:00:00Z", lastUsed: "2026-07-24T10:15:00Z", tokenCount: 12 },
  { id: "OC-003", name: "Patient Portal Mobile", clientId: "portal-mobile-2024", grantTypes: ["authorization_code", "refresh_token"], scopes: ["patient/*.read", "patient/*.write"], status: "active", createdAt: "2026-02-10T00:00:00Z", lastUsed: "2026-07-24T10:25:00Z", tokenCount: 128 },
  { id: "OC-004", name: "Lab Integration Service", clientId: "lab-int-svc-2024", grantTypes: ["client_credentials"], scopes: ["observation/*.read", "observation/*.write"], status: "suspended", createdAt: "2026-04-20T00:00:00Z", lastUsed: "2026-07-20T08:00:00Z", tokenCount: 8 },
  { id: "OC-005", name: "Analytics Dashboard", clientId: "analytics-dash-2024", grantTypes: ["client_credentials"], scopes: ["patient/*.read", "encounter/*.read"], status: "active", createdAt: "2026-05-01T00:00:00Z", lastUsed: "2026-07-24T09:00:00Z", tokenCount: 6 },
  { id: "OC-006", name: "HIE Connector", clientId: "hie-conn-2024", grantTypes: ["client_credentials", "jwt-bearer"], scopes: ["patient/*.read", "patient/*.write", "consent/*.read"], status: "expired", createdAt: "2025-12-01T00:00:00Z", lastUsed: "2026-06-15T14:00:00Z", tokenCount: 3 },
];

export const mpiRecords: MpiRecord[] = [
  { id: "MPI-001", enterpriseId: "ENT-001", sourceIds: [{ system: "Epic EMR", id: "EPIC-001" }, { system: "LabCorp", id: "LC-001" }, { system: "PACS", id: "PAC-001" }], firstName: "JOHN", lastName: "DOE", dateOfBirth: "1985-03-15", gender: "Male", ssn: "***-**-1234", mrn: "MRN001", matchConfidence: "high", duplicateCount: 0, lastUpdated: "2026-07-24T10:00:00Z", verified: true },
  { id: "MPI-002", enterpriseId: "ENT-002", sourceIds: [{ system: "Epic EMR", id: "EPIC-002" }, { system: "LabCorp", id: "LC-002" }], firstName: "JANE", lastName: "SMITH", dateOfBirth: "1990-07-22", gender: "Female", ssn: "***-**-5678", mrn: "MRN002", matchConfidence: "high", duplicateCount: 0, lastUpdated: "2026-07-24T09:30:00Z", verified: true },
  { id: "MPI-003", enterpriseId: "ENT-003", sourceIds: [{ system: "Epic EMR", id: "EPIC-003" }, { system: "Surescripts", id: "RX-003" }, { system: "LabCorp", id: "LC-003" }, { system: "PACS", id: "PAC-003" }], firstName: "ROBERT", lastName: "JOHNSON", dateOfBirth: "1978-11-08", gender: "Male", ssn: "***-**-9012", mrn: "MRN003", matchConfidence: "high", duplicateCount: 1, lastUpdated: "2026-07-24T08:45:00Z", verified: true },
  { id: "MPI-004", enterpriseId: "ENT-004", sourceIds: [{ system: "Epic EMR", id: "EPIC-004A" }, { system: "Epic EMR", id: "EPIC-004B" }], firstName: "SARAH", lastName: "BROWN", dateOfBirth: "1992-05-30", gender: "Female", ssn: "***-**-3456", mrn: "MRN004", matchConfidence: "medium", duplicateCount: 2, mergeStatus: "pending", lastUpdated: "2026-07-24T07:00:00Z", verified: false },
  { id: "MPI-005", enterpriseId: "ENT-005", sourceIds: [{ system: "PACS", id: "PAC-005" }], firstName: "MICHAEL", lastName: "WILSON", dateOfBirth: "1965-01-12", gender: "Male", ssn: "***-**-7890", mrn: "MRN005", matchConfidence: "high", duplicateCount: 0, lastUpdated: "2026-07-23T16:00:00Z", verified: true },
  { id: "MPI-006", enterpriseId: "ENT-006", sourceIds: [{ system: "LabCorp", id: "LC-006" }, { system: "Surescripts", id: "RX-006" }], firstName: "MARIA", lastName: "GARCIA", dateOfBirth: "1988-09-18", gender: "Female", ssn: "***-**-2345", mrn: "MRN006", matchConfidence: "high", duplicateCount: 0, lastUpdated: "2026-07-24T10:15:00Z", verified: true },
];

export const duplicatePairs: DuplicatePair[] = [
  { id: "DUP-001", recordA: mpiRecords[3], recordB: { ...mpiRecords[3], id: "MPI-004B", enterpriseId: "ENT-004B", firstName: "SARA", mrn: "MRN004B" }, matchScore: 87, matchingFields: ["Date of Birth", "Address", "Phone", "Insurance"], status: "pending", detectedAt: "2026-07-24T07:00:00Z" },
  { id: "DUP-002", recordA: mpiRecords[2], recordB: { ...mpiRecords[2], id: "MPI-003B", enterpriseId: "ENT-003B", firstName: "ROBERT", mrn: "MRN003B" }, matchScore: 72, matchingFields: ["Last Name", "Date of Birth", "SSN Partial"], status: "reviewed", detectedAt: "2026-07-23T14:00:00Z", reviewedBy: "Dr. Smith" },
];

export const providerRecords: ProviderRecord[] = [
  { id: "PRV-001", npi: "1234567890", firstName: "SARAH", lastName: "CHEN", specialty: "Internal Medicine", department: "Medicine", licenseNumber: "MD-2024-001", licenseExpiry: "2028-12-31", privileges: ["Inpatient Care", "Emergency Medicine", "Procedure Suite"], status: "active", lastUpdated: "2026-07-24T10:00:00Z", email: "s.chen@hospital.org" },
  { id: "PRV-002", npi: "2345678901", firstName: "JAMES", lastName: "WILSON", specialty: "Cardiology", department: "Cardiology", licenseNumber: "MD-2024-002", licenseExpiry: "2028-12-31", privileges: ["Cardiac Catheterization", "Echocardiography", "Stress Testing"], status: "active", lastUpdated: "2026-07-24T09:30:00Z", email: "j.wilson@hospital.org" },
  { id: "PRV-003", npi: "3456789012", firstName: "MARIA", lastName: "GARCIA", specialty: "Pediatrics", department: "Pediatrics", licenseNumber: "MD-2024-003", licenseExpiry: "2027-06-30", privileges: ["NICU", "General Pediatrics", "Adolescent Medicine"], status: "active", lastUpdated: "2026-07-24T08:45:00Z", email: "m.garcia@hospital.org" },
  { id: "PRV-004", npi: "4567890123", firstName: "ROBERT", lastName: "TAYLOR", specialty: "Radiology", department: "Radiology", licenseNumber: "MD-2024-004", licenseExpiry: "2026-09-30", privileges: ["CT", "MRI", "Interventional Radiology"], status: "active", lastUpdated: "2026-07-23T16:00:00Z", email: "r.taylor@hospital.org" },
  { id: "PRV-005", npi: "5678901234", firstName: "LISA", lastName: "ANDERSON", specialty: "Surgery", department: "Surgery", licenseNumber: "MD-2024-005", licenseExpiry: "2028-12-31", privileges: ["General Surgery", "Laparoscopic", "Trauma"], status: "active", lastUpdated: "2026-07-24T10:15:00Z", email: "l.anderson@hospital.org" },
  { id: "PRV-006", npi: "6789012345", firstName: "DAVID", lastName: "KIM", specialty: "Oncology", department: "Oncology", licenseNumber: "MD-2024-006", licenseExpiry: "2025-12-31", privileges: ["Chemotherapy", "Radiation Therapy", "Clinical Trials"], status: "suspended", lastUpdated: "2026-07-20T11:00:00Z", email: "d.kim@hospital.org" },
];

export const terminologyMappings: TerminologyMapping[] = [
  { id: "TM-001", sourceSystem: "ICD-10", sourceCode: "E11.9", sourceDisplay: "Type 2 diabetes mellitus without complications", targetSystem: "SNOMED-CT", targetCode: "44054006", targetDisplay: "Type 2 diabetes mellitus", equivalence: "equivalent", lastUpdated: "2026-07-24T10:00:00Z", validated: true },
  { id: "TM-002", sourceSystem: "LOINC", sourceCode: "2345-7", sourceDisplay: "Glucose [Mass/volume] in Serum or Plasma", targetSystem: "SNOMED-CT", targetCode: "33747003", targetDisplay: "Blood glucose measurement", equivalence: "equivalent", lastUpdated: "2026-07-24T09:30:00Z", validated: true },
  { id: "TM-003", sourceSystem: "RxNorm", sourceCode: "860975", sourceDisplay: "Metformin 500 MG Oral Tablet", targetSystem: "NDC", targetCode: "00228-2766-11", targetDisplay: "Metformin HCl 500mg Tab", equivalence: "equivalent", lastUpdated: "2026-07-24T08:45:00Z", validated: true },
  { id: "TM-004", sourceSystem: "ICD-10", sourceCode: "I10", sourceDisplay: "Essential (primary) hypertension", targetSystem: "SNOMED-CT", targetCode: "59621000", targetDisplay: "Essential hypertension", equivalence: "equivalent", lastUpdated: "2026-07-24T07:00:00Z", validated: true },
  { id: "TM-005", sourceSystem: "SNOMED-CT", sourceCode: "195967001", sourceDisplay: "Asthma", targetSystem: "ICD-10", targetCode: "J45.909", targetDisplay: "Unspecified asthma, uncomplicated", equivalence: "broader", lastUpdated: "2026-07-23T16:00:00Z", validated: false },
  { id: "TM-006", sourceSystem: "LOINC", sourceCode: "718-7", sourceDisplay: "Hemoglobin [Mass/volume] in Blood", targetSystem: "UCUM", targetCode: "g/dL", targetDisplay: "grams per deciliter", equivalence: "equivalent", lastUpdated: "2026-07-24T10:15:00Z", validated: true },
  { id: "TM-007", sourceSystem: "CPT", sourceCode: "99213", sourceDisplay: "Office visit, established patient", targetSystem: "SNOMED-CT", targetCode: "185349003", targetDisplay: "Encounter for check up", equivalence: "narrower", lastUpdated: "2026-07-24T09:00:00Z", validated: true },
  { id: "TM-008", sourceSystem: "ICD-10", sourceCode: "J20.9", sourceDisplay: "Acute bronchitis, unspecified", targetSystem: "SNOMED-CT", targetCode: "10509002", targetDisplay: "Acute bronchitis", equivalence: "equivalent", lastUpdated: "2026-07-24T10:30:00Z", validated: true },
];

export const externalSystems: ExternalSystem[] = [
  { id: "EXT-001", name: "LabCorp Reference Lab", type: "Reference Laboratory", status: "connected", lastSync: "2026-07-24T10:28:00Z", syncFrequency: "Every 15 minutes", messageCount: 12400, errorRate: 0.5, version: "3.2", endpoint: "https://api.labcorp.com/v2/hl7" },
  { id: "EXT-002", name: "Quest Diagnostics", type: "Reference Laboratory", status: "connected", lastSync: "2026-07-24T10:15:00Z", syncFrequency: "Every 30 minutes", messageCount: 8900, errorRate: 0.3, version: "2.1", endpoint: "https://api.questdiagnostics.com/v1/fhir" },
  { id: "EXT-003", name: "Epic Systems EMR", type: "External EMR", status: "connected", lastSync: "2026-07-24T10:30:00Z", syncFrequency: "Real-time", messageCount: 45200, errorRate: 0.1, version: "2024.1", endpoint: "https://epic.hospital.org/fhir/r4" },
  { id: "EXT-004", name: "BCBS Insurance Gateway", type: "Insurance Provider", status: "connected", lastSync: "2026-07-24T10:00:00Z", syncFrequency: "On-demand", messageCount: 3400, errorRate: 1.2, version: "5.0", endpoint: "https://availity.com/api/v2" },
  { id: "EXT-005", name: "State Health Information Exchange", type: "Government Exchange", status: "maintenance", lastSync: "2026-07-24T08:00:00Z", syncFrequency: "Every 60 minutes", messageCount: 6700, errorRate: 0.0, version: "4.0", endpoint: "https://state-hie.gov/fhir/r4" },
  { id: "EXT-006", name: "Cloud PACS Archive", type: "Cloud Storage", status: "connected", lastSync: "2026-07-24T10:15:00Z", syncFrequency: "Real-time", messageCount: 2300, errorRate: 2.1, version: "2.0", endpoint: "https://archive.cloudpacs.com/dicom-web" },
  { id: "EXT-007", name: "Surescripts Network", type: "E-Prescribing", status: "connected", lastSync: "2026-07-24T10:25:00Z", syncFrequency: "Real-time", messageCount: 15600, errorRate: 0.3, version: "10.7", endpoint: "https://api.surescripts.com/v2" },
  { id: "EXT-008", name: "CMS Claims Portal", type: "Government Exchange", status: "error", lastSync: "2026-07-23T18:45:00Z", syncFrequency: "Daily batch", messageCount: 890, errorRate: 100, version: "3.0", endpoint: "https://cms.gov/api/v3/claims" },
];

export const monitoringMetrics: MonitoringMetric[] = Array.from({ length: 24 }, (_, i) => ({
  timestamp: `2026-07-24T${String(i).padStart(2, "0")}:00:00Z`,
  queueDepth: Math.floor(Math.random() * 50) + 10,
  throughput: Math.floor(Math.random() * 500) + 200,
  latencyMs: Math.floor(Math.random() * 100) + 30,
  errorCount: Math.floor(Math.random() * 5),
  cpuUsage: Math.floor(Math.random() * 30) + 40,
  memoryUsage: Math.floor(Math.random() * 20) + 55,
}));

export const securityEvents: SecurityEvent[] = [
  { id: "SE-001", type: "Failed Authentication", severity: "warning", source: "API Gateway", description: "Multiple failed OAuth token requests from IP 192.168.1.50", timestamp: "2026-07-24T10:15:00Z", resolved: false, user: "integration-svc" },
  { id: "SE-002", type: "Certificate Expiring", severity: "error", source: "DICOM Gateway", description: "TLS certificate for PACS node expires in 14 days", timestamp: "2026-07-24T09:00:00Z", resolved: false },
  { id: "SE-003", type: "Unauthorized Access Attempt", severity: "critical", source: "FHIR API", description: "Attempt to access /Patient endpoint without valid scope", timestamp: "2026-07-24T08:30:00Z", resolved: true, user: "unknown-client" },
  { id: "SE-004", type: "Rate Limit Exceeded", severity: "warning", source: "API Gateway", description: "Client analytics-dash-2024 exceeded 100 req/min limit", timestamp: "2026-07-24T07:45:00Z", resolved: true, user: "analytics-dash-2024" },
  { id: "SE-005", type: "Message Tampering Detected", severity: "critical", source: "HL7 Engine", description: "HL7 message hash mismatch detected on interface IF-001", timestamp: "2026-07-23T22:00:00Z", resolved: true },
  { id: "SE-006", type: "Token Revoked", severity: "info", source: "OAuth Server", description: "Refresh token revoked for client lab-int-svc-2024", timestamp: "2026-07-24T06:00:00Z", resolved: true, user: "lab-int-svc-2024" },
];

export const certificates: Certificate[] = [
  { id: "CERT-001", name: "FHIR API TLS Cert", issuer: "DigiCert SHA2", subject: "fhir.hospital.org", issuedAt: "2025-07-24T00:00:00Z", expiresAt: "2027-07-24T00:00:00Z", status: "valid", fingerprint: "AA:BB:CC:DD:EE:FF:00:11:22:33:44:55:66:77:88:99", algorithm: "RSA-SHA256", keySize: 2048 },
  { id: "CERT-002", name: "DICOM Gateway Cert", issuer: "Lets Encrypt", subject: "pacs.hospital.org", issuedAt: "2026-01-15T00:00:00Z", expiresAt: "2026-08-15T00:00:00Z", status: "expiring", fingerprint: "11:22:33:44:55:66:77:88:99:AA:BB:CC:DD:EE:FF:00", algorithm: "ECDSA-P256", keySize: 256 },
  { id: "CERT-003", name: "HL7 MLLP TLS", issuer: "DigiCert SHA2", subject: "hl7.hospital.org", issuedAt: "2025-03-01T00:00:00Z", expiresAt: "2026-03-01T00:00:00Z", status: "expired", fingerprint: "AA:11:BB:22:CC:33:DD:44:EE:55:FF:66:00:77:11:88", algorithm: "RSA-SHA256", keySize: 4096 },
  { id: "CERT-004", name: "OAuth Server Cert", issuer: "Internal CA", subject: "auth.hospital.org", issuedAt: "2026-06-01T00:00:00Z", expiresAt: "2027-06-01T00:00:00Z", status: "valid", fingerprint: "FF:EE:DD:CC:BB:AA:99:88:77:66:55:44:33:22:11:00", algorithm: "RSA-SHA384", keySize: 4096 },
];

export const auditEntries: AuditEntry[] = [
  { id: "AUD-001", timestamp: "2026-07-24T10:30:00Z", userId: "USR-001", userName: "Integration Admin", action: "MESSAGE_RECEIVED", resource: "Interface", resourceId: "IF-001", sourceSystem: "Epic EMR", destinationSystem: "HMIS Core", messageType: "ADT^A01", correlationId: "COR-20260724-001", status: "success", ipAddress: "192.168.1.10", details: "ADT message received and validated successfully" },
  { id: "AUD-002", timestamp: "2026-07-24T10:30:01Z", userId: "SYSTEM", userName: "Integration Engine", action: "MESSAGE_TRANSFORMED", resource: "Interface", resourceId: "IF-001", sourceSystem: "Epic EMR", destinationSystem: "HMIS Core", messageType: "ADT^A01", correlationId: "COR-20260724-001", status: "success", ipAddress: "10.0.0.1", details: "HL7v2 message transformed to internal format" },
  { id: "AUD-003", timestamp: "2026-07-24T10:30:01Z", userId: "SYSTEM", userName: "Integration Engine", action: "MESSAGE_ROUTED", resource: "Interface", resourceId: "IF-001", sourceSystem: "Epic EMR", destinationSystem: "HMIS Core", messageType: "ADT^A01", correlationId: "COR-20260724-001", status: "success", ipAddress: "10.0.0.1", details: "Message routed to HMIS ADT processor" },
  { id: "AUD-004", timestamp: "2026-07-24T10:30:01Z", userId: "SYSTEM", userName: "Integration Engine", action: "ACKNOWLEDGEMENT_SENT", resource: "Interface", resourceId: "IF-001", sourceSystem: "HMIS Core", destinationSystem: "Epic EMR", messageType: "ACK", correlationId: "COR-20260724-001", status: "success", ipAddress: "10.0.0.1", details: "ACK sent to source system" },
  { id: "AUD-005", timestamp: "2026-07-24T10:15:00Z", userId: "USR-002", userName: "FHIR Admin", action: "API_KEY_GENERATED", resource: "API Gateway", resourceId: "API-004", sourceSystem: "HMIS", destinationSystem: "N/A", messageType: "REST", correlationId: "N/A", status: "success", ipAddress: "192.168.1.20", details: "New API key generated for GraphQL endpoint" },
  { id: "AUD-006", timestamp: "2026-07-24T09:30:00Z", userId: "USR-003", userName: "Security Admin", action: "CERTIFICATE_REVOKED", resource: "Security", resourceId: "CERT-003", sourceSystem: "HMIS", destinationSystem: "N/A", messageType: "N/A", correlationId: "N/A", status: "success", ipAddress: "192.168.1.30", details: "Expired HL7 MLLP TLS certificate revoked" },
  { id: "AUD-007", timestamp: "2026-07-24T08:45:00Z", userId: "USR-001", userName: "Integration Admin", action: "MPI_MERGE_APPROVED", resource: "MPI", resourceId: "MPI-004", sourceSystem: "HMIS", destinationSystem: "N/A", messageType: "N/A", correlationId: "N/A", status: "success", ipAddress: "192.168.1.10", details: "Patient identity merge approved for SARAH BROWN" },
  { id: "AUD-008", timestamp: "2026-07-24T08:00:00Z", userId: "SYSTEM", userName: "Scheduler", action: "BACKUP_COMPLETED", resource: "Disaster Recovery", resourceId: "BKP-001", sourceSystem: "HMIS", destinationSystem: "Cloud Storage", messageType: "N/A", correlationId: "N/A", status: "success", ipAddress: "10.0.0.1", details: "Nightly backup completed: 2.4GB encrypted to cloud storage" },
];

export const transformationRules: TransformationRule[] = [
  { id: "TR-001", name: "ADT to FHIR Patient", sourceFormat: "HL7v2 ADT", targetFormat: "FHIR Patient", description: "Maps HL7v2 ADT messages to FHIR R4 Patient resources", mappings: 24, status: "active", lastTested: "2026-07-24T10:00:00Z", version: "3.2" },
  { id: "TR-002", name: "ORU to FHIR Observation", sourceFormat: "HL7v2 ORU", targetFormat: "FHIR Observation", description: "Transforms lab results to FHIR Observation resources", mappings: 18, status: "active", lastTested: "2026-07-24T09:30:00Z", version: "2.8" },
  { id: "TR-003", name: "DICOM to FHIR ImagingStudy", sourceFormat: "DICOM JSON", targetFormat: "FHIR ImagingStudy", description: "Converts DICOM study metadata to FHIR ImagingStudy", mappings: 15, status: "active", lastTested: "2026-07-24T08:45:00Z", version: "1.5" },
  { id: "TR-004", name: "Custom Insurance Claim", sourceFormat: "X12 837", targetFormat: "FHIR Claim", description: "Maps X12 837P claims to FHIR Claim resources", mappings: 42, status: "draft", lastTested: "2026-07-20T14:00:00Z", version: "0.9" },
  { id: "TR-005", name: "SIU to FHIR Appointment", sourceFormat: "HL7v2 SIU", targetFormat: "FHIR Appointment", description: "Transforms scheduling messages to FHIR Appointments", mappings: 12, status: "active", lastTested: "2026-07-24T10:15:00Z", version: "2.0" },
];

export const webhookSubscriptions: WebhookSubscription[] = [
  { id: "WH-001", name: "Patient Admission Alert", url: "https://notify.hospital.org/webhooks/admissions", events: ["ADT.A01", "ADT.A02", "ADT.A03"], secret: "whsec_*****", status: "active", lastTriggered: "2026-07-24T10:30:00Z", successRate: 99.8, retryPolicy: "3 retries, exponential backoff" },
  { id: "WH-002", name: "Lab Result Notification", url: "https://notify.hospital.org/webhooks/lab-results", events: ["ORU.R01"], secret: "whsec_*****", status: "active", lastTriggered: "2026-07-24T10:28:00Z", successRate: 99.5, retryPolicy: "3 retries, exponential backoff" },
  { id: "WH-003", name: "Critical Alert Forwarding", url: "https://alerts.hospital.org/webhooks/critical", events: ["DFT.P03", "SIU.S12"], secret: "whsec_*****", status: "failed", lastTriggered: "2026-07-23T18:45:00Z", successRate: 85.2, retryPolicy: "5 retries, linear backoff" },
  { id: "WH-004", name: "Insurance Eligibility Callback", url: "https://billing.hospital.org/webhooks/eligibility", events: ["ADT.A08"], secret: "whsec_*****", status: "active", lastTriggered: "2026-07-24T10:00:00Z", successRate: 98.9, retryPolicy: "3 retries, exponential backoff" },
];

export const backupRecords: BackupRecord[] = [
  { id: "BKP-001", name: "Full Integration Config Backup", type: "Configuration", size: "2.4 GB", timestamp: "2026-07-24T08:00:00Z", status: "completed", retention: "90 days", verified: true },
  { id: "BKP-002", name: "HL7 Message Archive", type: "Message Store", size: "156 GB", timestamp: "2026-07-24T06:00:00Z", status: "completed", retention: "365 days", verified: true },
  { id: "BKP-003", name: "Audit Log Archive", type: "Audit Trail", size: "45 GB", timestamp: "2026-07-24T04:00:00Z", status: "completed", retention: "7 years", verified: true },
  { id: "BKP-004", name: "Certificate Store Backup", type: "Security", size: "128 MB", timestamp: "2026-07-24T02:00:00Z", status: "completed", retention: "2 years", verified: true },
  { id: "BKP-005", name: "MPI Database Snapshot", type: "Patient Data", size: "8.7 GB", timestamp: "2026-07-24T00:00:00Z", status: "in-progress", retention: "Indefinite", verified: false },
];

export const drDrills: DisasterRecoveryDrill[] = [
  { id: "DR-001", name: "Full Platform Failover", lastRun: "2026-07-01T02:00:00Z", nextRun: "2026-08-01T02:00:00Z", status: "passed", rto: "15 minutes", rpo: "5 minutes", duration: "12 minutes", successRate: 100 },
  { id: "DR-002", name: "DICOM Gateway Recovery", lastRun: "2026-07-15T03:00:00Z", nextRun: "2026-07-29T03:00:00Z", status: "passed", rto: "10 minutes", rpo: "0 (synchronous)", duration: "8 minutes", successRate: 100 },
  { id: "DR-003", name: "HL7 Engine Recovery", lastRun: "2026-07-10T02:30:00Z", nextRun: "2026-07-24T02:30:00Z", status: "failed", rto: "5 minutes", rpo: "1 minute", duration: "18 minutes", successRate: 66.7 },
  { id: "DR-004", name: "Database Cluster Failover", lastRun: "2026-07-20T01:00:00Z", nextRun: "2026-07-27T01:00:00Z", status: "passed", rto: "3 minutes", rpo: "0 (synchronous)", duration: "2.5 minutes", successRate: 100 },
];

export const dashboardKpis: DashboardKpis = {
  activeInterfaces: 12, connectedSystems: 8, queuedMessages: 47,
  fhirRequests: 93940, hl7Messages: 45600, dicomTransfers: 2300,
  failedTransactions: 3, operationalAlerts: 5, avgLatency: 85,
  throughput: 1240, uptime: 99.87, errorRate: 0.4,
};

export const chartData = {
  messageVolume: [
    { label: "00:00", value: 210 }, { label: "04:00", value: 85 }, { label: "08:00", value: 450 },
    { label: "12:00", value: 680 }, { label: "16:00", value: 520 }, { label: "20:00", value: 310 },
  ],
  protocolDistribution: [
    { label: "HL7v2", value: 42, color: "#3b82f6" }, { label: "FHIR R4", value: 35, color: "#10b981" },
    { label: "DICOM", value: 12, color: "#f59e0b" }, { label: "REST", value: 8, color: "#8b5cf6" },
    { label: "GraphQL", value: 3, color: "#ec4899" },
  ],
  errorTrends: [
    { label: "Mon", value: 5 }, { label: "Tue", value: 3 }, { label: "Wed", value: 8 },
    { label: "Thu", value: 2 }, { label: "Fri", value: 4 }, { label: "Sat", value: 1 }, { label: "Sun", value: 0 },
  ],
  latencyPercentiles: [
    { label: "P50", value: 45 }, { label: "P75", value: 85 }, { label: "P90", value: 150 },
    { label: "P95", value: 280 }, { label: "P99", value: 520 },
  ],
};

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    active: "text-emerald-600 bg-emerald-50", connected: "text-emerald-600 bg-emerald-50",
    success: "text-emerald-600 bg-emerald-50", delivered: "text-emerald-600 bg-emerald-50",
    acknowledged: "text-emerald-600 bg-emerald-50", completed: "text-emerald-600 bg-emerald-50",
    passed: "text-emerald-600 bg-emerald-50", valid: "text-emerald-600 bg-emerald-50",
    verified: "text-emerald-600 bg-emerald-50", resolved: "text-emerald-600 bg-emerald-50",
    equivalent: "text-emerald-600 bg-emerald-50",
    processing: "text-blue-600 bg-blue-50", received: "text-blue-600 bg-blue-50",
    routed: "text-blue-600 bg-blue-50", "in-progress": "text-blue-600 bg-blue-50",
    scheduled: "text-blue-600 bg-blue-50", expiring: "text-orange-600 bg-orange-50",
    warning: "text-orange-600 bg-orange-50", retrying: "text-orange-600 bg-orange-50",
    degraded: "text-orange-600 bg-orange-50", pending: "text-orange-600 bg-orange-50",
    broader: "text-orange-600 bg-orange-50", narrower: "text-orange-600 bg-orange-50",
    failed: "text-red-600 bg-red-50", error: "text-red-600 bg-red-50",
    expired: "text-red-600 bg-red-50", revoked: "text-red-600 bg-red-50",
    "dead-letter": "text-red-600 bg-red-50", critical: "text-red-600 bg-red-50",
    maintenance: "text-violet-600 bg-violet-50", suspended: "text-violet-600 bg-violet-50",
    inactive: "text-slate-500 bg-slate-50", unmatched: "text-slate-500 bg-slate-50",
    disconnected: "text-slate-500 bg-slate-50", deprecated: "text-slate-500 bg-slate-50",
    rejected: "text-slate-500 bg-slate-50", info: "text-blue-600 bg-blue-50",
    draft: "text-blue-600 bg-blue-50", transferred: "text-emerald-600 bg-emerald-50",
  };
  return map[status] || "text-slate-500 bg-slate-50";
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
  if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + " MB";
  return (bytes / 1073741824).toFixed(1) + " GB";
}
