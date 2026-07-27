// ── Research & Clinical Trials Management System Data ──
export type StudyStatus = "draft" | "submitted" | "irb_review" | "irb_approved" | "open" | "enrolling" | "closed_to_enrollment" | "active" | "completed" | "suspended" | "terminated";
export type StudyPhase = "phase_1" | "phase_2" | "phase_3" | "phase_4" | "observational" | "registry";
export type ConsentStatus = "pending" | "signed" | "reconsent_required" | "withdrawn" | "expired";
export type QueryStatus = "open" | "answered" | "closed" | "escalated";
export type SafetySeverity = "mild" | "moderate" | "severe" | "life_threatening" | "fatal";
export type AERelationship = "unrelated" | "unlikely" | "possible" | "probable" | "definite";
export type RegulatoryStatus = "pending" | "submitted" | "approved" | "rejected" | "expired";
export type MonitoringStatus = "scheduled" | "in_progress" | "completed" | "follow_up";
export type DeviationType = "minor" | "major" | "important";
export type CRFStatus = "empty" | "in_progress" | "completed" | "locked" | "queried";
export type LockStatus = "open" | "frozen" | "locked" | "archived";

export interface ClinicalStudy {
  id: string; protocolNumber: string; title: string; sponsor: string; phase: StudyPhase;
  therapeuticArea: string; status: StudyStatus; piName: string; coordinatorName: string;
  sites: number; enrollmentTarget: number; enrollmentCurrent: number;
  startDate: string; estimatedEndDate: string; irbApprovalDate: string | null;
  irbExpiryDate: string | null; protocolVersion: string; amendmentCount: number;
  budget: number; spent: number; description: string;
}

export interface ProtocolVersion {
  id: string; studyId: string; version: string; effectiveDate: string;
  status: "draft" | "submitted" | "approved" | "superseded";
  changes: string; reconsentRequired: boolean; approvedBy: string | null;
}

export interface IRBSubmission {
  id: string; studyId: string; submissionDate: string; committeeName: string;
  meetingDate: string | null; status: RegulatoryStatus; decision: string | null;
  conditions: string[]; approvalExpiry: string | null; documents: string[];
  submittedBy: string; protocolVersion: string;
}

export interface Investigator {
  id: string; name: string; role: "PI" | "Sub-I" | "Research Nurse" | "CRC" | "CRA";
  qualification: string; gcpCertDate: string; gcpExpiry: string;
  experience: number; siteId: string; siteName: string;
  studiesActive: number; delegatedTasks: string[]; trainingComplete: boolean;
  email: string; phone: string;
}

export interface StudyParticipant {
  id: string; subjectId: string; studyId: string; studyName: string;
  initials: string; age: number; gender: "M" | "F";
  consentDate: string; consentVersion: string; consentStatus: ConsentStatus;
  randomizationNumber: string | null; treatmentArm: string | null;
  enrollmentDate: string; status: "screening" | "enrolled" | "active" | "completed" | "withdrawn" | "lost_to_followup";
  lastVisitDate: string | null; nextVisitDate: string | null;
  siteId: string; piName: string;
}

export interface EligibilityScreening {
  id: string; participantId: string; studyId: string;
  inclusionCriteria: { criterion: string; met: boolean; evidence: string }[];
  exclusionCriteria: { criterion: string; met: boolean; evidence: string }[];
  labResults: { test: string; value: string; unit: string; normal: string; status: "normal" | "abnormal" | "critical" }[];
  medicalHistory: string[]; eligibilityDecision: "eligible" | "ineligible" | "pending";
  screenFailureReason: string | null; screenedBy: string; screenedAt: string;
}

export interface ConsentRecord {
  id: string; participantId: string; studyId: string; version: string;
  consentDate: string; consentType: "initial" | "reconsent" | "amendment";
  status: ConsentStatus; participantSignature: string; witnessSignature: string;
  witnessName: string; questionsAsked: string[]; multimediaViewed: boolean;
  withdrawalDate: string | null; withdrawalReason: string | null;
}

export interface StudyVisit {
  id: string; participantId: string; studyId: string; visitNumber: number;
  visitName: string; scheduledDate: string; windowStart: string; windowEnd: string;
  actualDate: string | null; status: "scheduled" | "completed" | "missed" | "rescheduled";
  procedures: string[]; labOrders: string[]; assessments: string[];
  notes: string | null;
}

export interface ECRFForm {
  id: string; participantId: string; studyId: string; visitId: string;
  formName: string; formStatus: CRFStatus; completionDate: string | null;
  completedBy: string | null; data: { field: string; value: string; status: "normal" | "query" | "missing" }[];
  queryCount: number; lockedBy: string | null; lockedAt: string | null;
}

export interface SafetyEvent {
  id: string; participantId: string; studyId: string; studyName: string;
  eventType: "AE" | "SAE" | "SUSAR"; description: string;
  onsetDate: string; resolutionDate: string | null;
  severity: SafetySeverity; expectedness: "expected" | "unexpected";
  causality: AERelationship; outcome: "recovered" | "recovering" | "not_recovered" | "sequelae" | "fatal" | "unknown";
  actionTaken: "none" | "dose_reduced" | "temporarily_discontinued" | "permanently_discontinued" | "dose_not_changed";
  reportedToSponsor: boolean; reportedToRegulatory: boolean;
  reportedDate: string; reportedBy: string; regulatoryReportingDeadline: string | null;
}

export interface IPAccountability {
  id: string; studyId: string; drugName: string; batchNumber: string;
  expiryDate: string; storageCondition: string; temperature: string;
  receivedQuantity: number; dispensedQuantity: number; returnedQuantity: number;
  destroyedQuantity: number; currentInventory: number;
  dispensingLog: { date: string; participantId: string; quantity: number; dispensedBy: string }[];
  temperatureLog: { date: string; temperature: string; status: "normal" | "excursion" }[];
}

export interface MonitoringVisit {
  id: string; studyId: string; visitDate: string; monitorName: string;
  monitorRole: string; visitType: "routine" | "forCause" | "closeOut" | "initiation";
  status: MonitoringStatus; sdvPerformed: number; sdvTotal: number;
  findings: string[]; actionItems: string[];
  riskScore: "low" | "medium" | "high";
  nextVisitDate: string | null; reportSubmitted: boolean;
}

export interface QueryRecord {
  id: string; studyId: string; participantId: string; formId: string;
  queryText: string; queryType: "edit_check" | "validation" | "manual" | "sdv";
  status: QueryStatus; raisedBy: string; raisedDate: string;
  responseText: string | null; responseDate: string | null;
  resolvedBy: string | null; resolvedDate: string | null;
  queryAge: number; priority: "low" | "medium" | "high" | "critical";
}

export interface RegulatoryDocument {
  id: string; studyId: string; documentName: string; documentType: string;
  version: string; uploadDate: string; expiryDate: string | null;
  status: "current" | "pending" | "expired" | "archived";
  uploadedBy: string; fileSize: string; category: "protocol" | "irb" | "regulatory" | "safety" | "monitoring";
}

export interface ProtocolDeviation {
  id: string; studyId: string; participantId: string | null;
  description: string; deviationType: DeviationType; detectedDate: string;
  rootCause: string; correctiveAction: string; preventiveAction: string;
  capaStatus: "open" | "in_progress" | "completed" | "verified";
  reportedBy: string; reportedToIRB: boolean; impactAssessment: string;
}

export interface StudyReport {
  id: string; studyId: string; reportType: string; generatedDate: string;
  generatedBy: string; period: string; summary: string;
  metrics: { label: string; value: string }[];
}

export interface AuditEntry {
  id: string; timestamp: string; userId: string; userName: string;
  userRole: string; action: string; entityType: string; entityName: string;
  details: string; ipAddress: string; protocolVersion: string;
}

export interface DashboardKpis {
  activeStudies: number; totalParticipants: number; openQueries: number;
  safetyEvents: number; upcomingVisits: number; pendingApprovals: number;
  protocolDeviations: number; enrollmentRate: number;
}

// ── Clinical Studies ──
export const CLINICAL_STUDIES: ClinicalStudy[] = [
  { id: "STU-2026-001", protocolNumber: "ONCO-IND-2026-042", title: "Phase III Trial of Pembrolizumab + Chemotherapy vs Chemotherapy Alone in Metastatic NSCLC", sponsor: "Indian Oncology Research Group", phase: "phase_3", therapeuticArea: "Oncology", status: "enrolling", piName: "Dr. Rajesh Kumar", coordinatorName: "Priya Sharma", sites: 8, enrollmentTarget: 240, enrollmentCurrent: 156, startDate: "2026-01-15", estimatedEndDate: "2028-06-30", irbApprovalDate: "2025-12-20", irbExpiryDate: "2026-12-20", protocolVersion: "3.0", amendmentCount: 2, budget: 45000000, spent: 18500000, description: "Multicenter, randomized, double-blind study evaluating pembrolizumab in NSCLC" },
  { id: "STU-2026-002", protocolNumber: "CV-IND-2026-018", title: "Phase II Study of SGLT2 Inhibitor in Heart Failure with Reduced Ejection Fraction", sponsor: "CardioVascular Research Foundation", phase: "phase_2", therapeuticArea: "Cardiology", status: "open", piName: "Dr. Sneha Gupta", coordinatorName: "Amit Verma", sites: 5, enrollmentTarget: 120, enrollmentCurrent: 42, startDate: "2026-03-01", estimatedEndDate: "2027-09-30", irbApprovalDate: "2026-02-10", irbExpiryDate: "2027-02-10", protocolVersion: "2.0", amendmentCount: 1, budget: 18000000, spent: 5200000, description: "Randomized, placebo-controlled trial of empagliflozin in HFrEF" },
  { id: "STU-2026-003", protocolNumber: "NEU-IND-2026-031", title: "Observational Registry of Post-COVID Neurological Sequelae", sponsor: "Indian Council of Medical Research", phase: "observational", therapeuticArea: "Neurology", status: "active", piName: "Dr. Vikram Singh", coordinatorName: "Meera Nair", sites: 12, enrollmentTarget: 500, enrollmentCurrent: 387, startDate: "2025-06-01", estimatedEndDate: "2027-05-31", irbApprovalDate: "2025-05-15", irbExpiryDate: "2026-05-15", protocolVersion: "1.2", amendmentCount: 1, budget: 8500000, spent: 4800000, description: "Prospective registry tracking neurological outcomes post-COVID-19" },
  { id: "STU-2026-004", protocolNumber: "PED-IND-2026-055", title: "Phase I/II Dose-Escalation Study of Novel Tyrosine Kinase Inhibitor in Pediatric AML", sponsor: "Children's Oncology Group India", phase: "phase_1", therapeuticArea: "Pediatric Oncology", status: "irb_review", piName: "Dr. Anita Desai", coordinatorName: "Ravi Kumar", sites: 3, enrollmentTarget: 45, enrollmentCurrent: 0, startDate: "2026-08-01", estimatedEndDate: "2029-07-31", irbApprovalDate: null, irbExpiryDate: null, protocolVersion: "1.0", amendmentCount: 0, budget: 22000000, spent: 1200000, description: "First-in-human study of TKI-2026 in relapsed/refractory pediatric AML" },
  { id: "STU-2026-005", protocolNumber: "END-IND-2026-063", title: "Phase III Non-Inferiority Trial of Biosimilar Insulin Glargine vs Reference Product", sponsor: "Biocon Research Limited", phase: "phase_3", therapeuticArea: "Endocrinology", status: "completed", piName: "Dr. Kavita Reddy", coordinatorName: "Sanjay Patel", sites: 10, enrollmentTarget: 300, enrollmentCurrent: 300, startDate: "2024-09-01", estimatedEndDate: "2026-06-30", irbApprovalDate: "2024-08-15", irbExpiryDate: "2026-08-15", protocolVersion: "4.0", amendmentCount: 3, budget: 35000000, spent: 33200000, description: "Comparative efficacy and safety of biosimilar insulin glargine" },
];

// ── Protocol Versions ──
export const PROTOCOL_VERSIONS: ProtocolVersion[] = [
  { id: "pv-001", studyId: "STU-2026-001", version: "3.0", effectiveDate: "2026-01-10", status: "approved", changes: "Updated dosing schedule, added new secondary endpoint for PFS", reconsentRequired: true, approvedBy: "Dr. Rajesh Kumar" },
  { id: "pv-002", studyId: "STU-2026-001", version: "2.0", effectiveDate: "2025-09-15", status: "superseded", changes: "Modified inclusion criteria to include ECOG PS 2 patients", reconsentRequired: true, approvedBy: "Dr. Rajesh Kumar" },
  { id: "pv-003", studyId: "STU-2026-001", version: "1.0", effectiveDate: "2025-06-01", status: "superseded", changes: "Original protocol", reconsentRequired: false, approvedBy: "Dr. Rajesh Kumar" },
  { id: "pv-004", studyId: "STU-2026-002", version: "2.0", effectiveDate: "2026-05-20", status: "approved", changes: "Added NT-proBNP as exploratory endpoint", reconsentRequired: false, approvedBy: "Dr. Sneha Gupta" },
  { id: "pv-005", studyId: "STU-2026-004", version: "1.0", effectiveDate: "2026-07-01", status: "submitted", changes: "Original protocol for pediatric AML study", reconsentRequired: false, approvedBy: null },
];

// ── IRB Submissions ──
export const IRB_SUBMISSIONS: IRBSubmission[] = [
  { id: "irb-001", studyId: "STU-2026-001", submissionDate: "2025-12-01", committeeName: "AIIMS Ethics Committee", meetingDate: "2025-12-18", status: "approved", decision: "Approved with conditions", conditions: ["Updated informed consent form", "DSMB charter revision"], approvalExpiry: "2026-12-20", documents: ["Protocol v3.0", "IB v5.0", "ICF v3.0", "CRF v2.0"], submittedBy: "Dr. Rajesh Kumar", protocolVersion: "3.0" },
  { id: "irb-002", studyId: "STU-2026-002", submissionDate: "2026-02-01", committeeName: "Fortis Ethics Board", meetingDate: "2026-02-08", status: "approved", decision: "Approved", conditions: [], approvalExpiry: "2027-02-10", documents: ["Protocol v2.0", "IB v3.0", "ICF v2.0"], submittedBy: "Dr. Sneha Gupta", protocolVersion: "2.0" },
  { id: "irb-003", studyId: "STU-2026-004", submissionDate: "2026-07-10", committeeName: "Pediatric Ethics Sub-Committee", meetingDate: "2026-08-05", status: "pending", decision: null, conditions: [], approvalExpiry: null, documents: ["Protocol v1.0", "IB v1.0", "Pediatric ICF v1.0", "Assent form v1.0"], submittedBy: "Dr. Anita Desai", protocolVersion: "1.0" },
  { id: "irb-004", studyId: "STU-2026-003", submissionDate: "2025-05-10", committeeName: "ICMR Ethics Review", meetingDate: "2025-05-14", status: "approved", decision: "Approved", conditions: ["Annual progress report required"], approvalExpiry: "2026-05-15", documents: ["Protocol v1.2", "Consent v1.2"], submittedBy: "Dr. Vikram Singh", protocolVersion: "1.2" },
];

// ── Investigators ──
export const INVESTIGATORS: Investigator[] = [
  { id: "inv-001", name: "Dr. Rajesh Kumar", role: "PI", qualification: "MD, DM Oncology", gcpCertDate: "2025-10-15", gcpExpiry: "2028-10-15", experience: 18, siteId: "SITE-001", siteName: "AIIMS New Delhi", studiesActive: 3, delegatedTasks: ["Protocol oversight", "Informed consent", "SAE reporting", "Study conduct"], trainingComplete: true, email: "rajesh.kumar@aiims.edu", phone: "+91-98765-43210" },
  { id: "inv-002", name: "Dr. Sneha Gupta", role: "PI", qualification: "MD, DM Cardiology", gcpCertDate: "2025-08-20", gcpExpiry: "2028-08-20", experience: 14, siteId: "SITE-002", siteName: "Fortis Hospital Mumbai", studiesActive: 2, delegatedTasks: ["Protocol oversight", "Informed consent", "Data review"], trainingComplete: true, email: "sneha.gupta@fortis.com", phone: "+91-98765-43211" },
  { id: "inv-003", name: "Dr. Vikram Singh", role: "PI", qualification: "MD, DM Neurology", gcpCertDate: "2025-06-10", gcpExpiry: "2028-06-10", experience: 22, siteId: "SITE-003", siteName: "NIMHANS Bangalore", studiesActive: 2, delegatedTasks: ["Protocol oversight", "Informed consent", "SAE reporting"], trainingComplete: true, email: "vikram.singh@nimhans.ac.in", phone: "+91-98765-43212" },
  { id: "inv-004", name: "Dr. Anita Desai", role: "PI", qualification: "MD, DM Pediatric Oncology", gcpCertDate: "2025-12-01", gcpExpiry: "2028-12-01", experience: 12, siteId: "SITE-004", siteName: "Tata Memorial Hospital", studiesActive: 1, delegatedTasks: ["Protocol oversight", "Informed consent", "Pediatric assent"], trainingComplete: true, email: "anita.desai@tmc.gov.in", phone: "+91-98765-43213" },
  { id: "inv-005", name: "Priya Sharma", role: "CRC", qualification: "MSc Clinical Research", gcpCertDate: "2025-11-20", gcpExpiry: "2028-11-20", experience: 6, siteId: "SITE-001", siteName: "AIIMS New Delhi", studiesActive: 3, delegatedTasks: ["eCRF completion", "Query resolution", "Visit scheduling", "Source documentation"], trainingComplete: true, email: "priya.sharma@aiims.edu", phone: "+91-98765-43214" },
  { id: "inv-006", name: "Amit Verma", role: "CRC", qualification: "BPharm, GCP Certified", gcpCertDate: "2026-01-15", gcpExpiry: "2029-01-15", experience: 4, siteId: "SITE-002", siteName: "Fortis Hospital Mumbai", studiesActive: 2, delegatedTasks: ["eCRF completion", "Drug accountability", "Visit scheduling"], trainingComplete: true, email: "amit.verma@fortis.com", phone: "+91-98765-43215" },
];

// ── Study Participants ──
export const STUDY_PARTICIPANTS: StudyParticipant[] = [
  { id: "SUB-001", subjectId: "ONCO-001-012", studyId: "STU-2026-001", studyName: "NSCLC Pembrolizumab Trial", initials: "RK", age: 58, gender: "M", consentDate: "2026-02-15", consentVersion: "3.0", consentStatus: "signed", randomizationNumber: "R-0042", treatmentArm: "Pembrolizumab + Chemotherapy", enrollmentDate: "2026-02-15", status: "active", lastVisitDate: "2026-07-10", nextVisitDate: "2026-08-10", siteId: "SITE-001", piName: "Dr. Rajesh Kumar" },
  { id: "SUB-002", subjectId: "ONCO-001-015", studyId: "STU-2026-001", studyName: "NSCLC Pembrolizumab Trial", initials: "SM", age: 62, gender: "F", consentDate: "2026-03-01", consentVersion: "3.0", consentStatus: "signed", randomizationNumber: "R-0058", treatmentArm: "Placebo + Chemotherapy", enrollmentDate: "2026-03-01", status: "active", lastVisitDate: "2026-07-15", nextVisitDate: "2026-08-15", siteId: "SITE-001", piName: "Dr. Rajesh Kumar" },
  { id: "SUB-003", subjectId: "CV-002-008", studyId: "STU-2026-002", studyName: "SGLT2 HFrEF Trial", initials: "AG", age: 55, gender: "M", consentDate: "2026-04-10", consentVersion: "2.0", consentStatus: "signed", randomizationNumber: "R-0023", treatmentArm: "Empagliflozin", enrollmentDate: "2026-04-10", status: "active", lastVisitDate: "2026-07-05", nextVisitDate: "2026-10-05", siteId: "SITE-002", piName: "Dr. Sneha Gupta" },
  { id: "SUB-004", subjectId: "CV-002-011", studyId: "STU-2026-002", studyName: "SGLT2 HFrEF Trial", initials: "PK", age: 61, gender: "F", consentDate: "2026-04-20", consentVersion: "2.0", consentStatus: "reconsent_required", randomizationNumber: "R-0031", treatmentArm: "Placebo", enrollmentDate: "2026-04-20", status: "active", lastVisitDate: "2026-06-20", nextVisitDate: "2026-09-20", siteId: "SITE-002", piName: "Dr. Sneha Gupta" },
  { id: "SUB-005", subjectId: "NEU-003-042", studyId: "STU-2026-003", studyName: "Post-COVID Neuro Registry", initials: "VR", age: 45, gender: "M", consentDate: "2025-09-15", consentVersion: "1.2", consentStatus: "signed", randomizationNumber: null, treatmentArm: null, enrollmentDate: "2025-09-15", status: "active", lastVisitDate: "2026-06-15", nextVisitDate: "2026-12-15", siteId: "SITE-003", piName: "Dr. Vikram Singh" },
  { id: "SUB-006", subjectId: "ONCO-001-019", studyId: "STU-2026-001", studyName: "NSCLC Pembrolizumab Trial", initials: "LG", age: 67, gender: "M", consentDate: "2026-03-20", consentVersion: "3.0", consentStatus: "withdrawn", randomizationNumber: "R-0071", treatmentArm: "Pembrolizumab + Chemotherapy", enrollmentDate: "2026-03-20", status: "withdrawn", lastVisitDate: "2026-05-20", nextVisitDate: null, siteId: "SITE-001", piName: "Dr. Rajesh Kumar" },
  { id: "SUB-007", subjectId: "PED-004-001", studyId: "STU-2026-004", studyName: "Pediatric AML TKI Study", initials: "AP", age: 8, gender: "F", consentDate: "2026-07-20", consentVersion: "1.0", consentStatus: "signed", randomizationNumber: null, treatmentArm: null, enrollmentDate: "2026-07-20", status: "screening", lastVisitDate: null, nextVisitDate: null, siteId: "SITE-004", piName: "Dr. Anita Desai" },
];

// ── Eligibility Screenings ──
export const ELIGIBILITY_SCREENINGS: EligibilityScreening[] = [
  { id: "elg-001", participantId: "SUB-001", studyId: "STU-2026-001", inclusionCriteria: [{ criterion: "Histologically confirmed NSCLC Stage IIIB/IV", met: true, evidence: "Biopsy report confirmed adenocarcinoma" }, { criterion: "ECOG PS 0-1", met: true, evidence: "ECOG PS 1 documented" }, { criterion: "Adequate organ function", met: true, evidence: "ANC >1500, Platelets >100K, CrCl >45" }, { criterion: "PD-L1 TPS >=1%", met: true, evidence: "PD-L1 TPS 60% by IHC" }], exclusionCriteria: [{ criterion: "Prior systemic therapy for metastatic disease", met: false, evidence: "No prior systemic therapy" }, { criterion: "Active autoimmune disease", met: false, evidence: "No autoimmune disease" }, { criterion: "Known EGFR/ALK mutation", met: false, evidence: "EGFR/ALK negative" }], labResults: [{ test: "Hemoglobin", value: "11.2", unit: "g/dL", normal: "12-16", status: "normal" }, { test: "WBC", value: "8.4", unit: "x10^3/uL", normal: "4-11", status: "normal" }, { test: "Platelets", value: "245", unit: "x10^3/uL", normal: "150-400", status: "normal" }, { test: "Creatinine", value: "0.9", unit: "mg/dL", normal: "0.6-1.2", status: "normal" }, { test: "AST", value: "32", unit: "U/L", normal: "5-40", status: "normal" }], medicalHistory: ["Hypertension controlled on amlodipine", "Type 2 diabetes on metformin"], eligibilityDecision: "eligible", screenFailureReason: null, screenedBy: "Priya Sharma", screenedAt: "2026-02-10" },
  { id: "elg-002", participantId: "SUB-007", studyId: "STU-2026-004", inclusionCriteria: [{ criterion: "Age 1-18 years", met: true, evidence: "Age 8 years" }, { criterion: "Confirmed AML diagnosis", met: true, evidence: "Bone marrow biopsy confirmed AML" }, { criterion: "First relapse or refractory", met: true, evidence: "First relapse after initial CR" }, { criterion: "ECOG PS 0-2", met: true, evidence: "ECOG PS 1" }], exclusionCriteria: [{ criterion: "Prior TKI exposure", met: false, evidence: "No prior TKI" }, { criterion: "Active CNS disease", met: false, evidence: "No CNS involvement" }], labResults: [{ test: "WBC", value: "3.2", unit: "x10^3/uL", normal: "4-11", status: "abnormal" }, { test: "Hemoglobin", value: "8.5", unit: "g/dL", normal: "12-16", status: "abnormal" }, { test: "Platelets", value: "85", unit: "x10^3/uL", normal: "150-400", status: "abnormal" }, { test: "Blasts (bone marrow)", value: "25", unit: "%", normal: "<5", status: "abnormal" }], medicalHistory: ["First-line chemotherapy completed 3 months ago", "Initial CR for 4 months"], eligibilityDecision: "eligible", screenFailureReason: null, screenedBy: "Ravi Kumar", screenedAt: "2026-07-18" },
];

// ── Consent Records ──
export const CONSENT_RECORDS: ConsentRecord[] = [
  { id: "con-001", participantId: "SUB-001", studyId: "STU-2026-001", version: "3.0", consentDate: "2026-02-15", consentType: "initial", status: "signed", participantSignature: "Rajesh Kumar (Digital)", witnessSignature: "Dr. Rajesh Kumar", witnessName: "Dr. Rajesh Kumar", questionsAsked: ["What are the side effects?", "Can I withdraw anytime?"], multimediaViewed: true, withdrawalDate: null, withdrawalReason: null },
  { id: "con-002", participantId: "SUB-002", studyId: "STU-2026-001", version: "3.0", consentDate: "2026-03-01", consentType: "initial", status: "signed", participantSignature: "Sunita Mehta (Digital)", witnessSignature: "Priya Sharma", witnessName: "Priya Sharma", questionsAsked: ["What is the treatment schedule?"], multimediaViewed: true, withdrawalDate: null, withdrawalReason: null },
  { id: "con-003", participantId: "SUB-004", studyId: "STU-2026-002", version: "2.0", consentDate: "2026-04-20", consentType: "reconsent", status: "reconsent_required", participantSignature: "Pradeep Kumar (Digital)", witnessSignature: "Amit Verma", witnessName: "Amit Verma", questionsAsked: ["What is new in this version?"], multimediaViewed: true, withdrawalDate: null, withdrawalReason: null },
  { id: "con-004", participantId: "SUB-006", studyId: "STU-2026-001", version: "3.0", consentDate: "2026-03-20", consentType: "initial", status: "withdrawn", participantSignature: "Lakshmi Gupta (Digital)", witnessSignature: "Priya Sharma", witnessName: "Priya Sharma", questionsAsked: [], multimediaViewed: true, withdrawalDate: "2026-05-18", withdrawalReason: "Personal reasons - relocating to another city" },
];

// ── Study Visits ──
export const STUDY_VISITS: StudyVisit[] = [
  { id: "vis-001", participantId: "SUB-001", studyId: "STU-2026-001", visitNumber: 1, visitName: "Screening", scheduledDate: "2026-02-10", windowStart: "2026-02-03", windowEnd: "2026-02-17", actualDate: "2026-02-10", status: "completed", procedures: ["Informed consent", "Medical history", "Physical examination", "ECOG assessment"], labOrders: ["CBC", "CMP", "LDH", "PD-L1 testing", "Urinalysis"], assessments: ["CT chest/abdomen/pelvis", "ECG", "Echocardiogram"], notes: "All inclusion criteria met" },
  { id: "vis-002", participantId: "SUB-001", studyId: "STU-2026-001", visitNumber: 2, visitName: "Cycle 1 Day 1", scheduledDate: "2026-02-15", windowStart: "2026-02-14", windowEnd: "2026-02-16", actualDate: "2026-02-15", status: "completed", procedures: ["Randomization", "Drug administration", "Vital signs", "AE assessment"], labOrders: ["CBC pre-dose"], assessments: ["Infusion reaction monitoring"], notes: "Treatment initiated without issues" },
  { id: "vis-003", participantId: "SUB-001", studyId: "STU-2026-001", visitNumber: 5, visitName: "Cycle 3 Day 1", scheduledDate: "2026-04-10", windowStart: "2026-04-09", windowEnd: "2026-04-11", actualDate: "2026-04-10", status: "completed", procedures: ["Physical examination", "AE assessment", "Tumor assessment"], labOrders: ["CBC", "CMP", "TSH", "Lipase"], assessments: ["CT chest/abdomen", "RECIST assessment"], notes: "Partial response confirmed" },
  { id: "vis-004", participantId: "SUB-001", studyId: "STU-2026-001", visitNumber: 9, visitName: "Cycle 7 Day 1", scheduledDate: "2026-07-10", windowStart: "2026-07-09", windowEnd: "2026-07-11", actualDate: "2026-07-10", status: "completed", procedures: ["Physical examination", "AE assessment", "Tumor assessment"], labOrders: ["CBC", "CMP", "TSH", "Lipase"], assessments: ["CT chest/abdomen", "RECIST assessment"], notes: "Continued partial response" },
  { id: "vis-005", participantId: "SUB-001", studyId: "STU-2026-001", visitNumber: 11, visitName: "Cycle 9 Day 1", scheduledDate: "2026-08-10", windowStart: "2026-08-09", windowEnd: "2026-08-11", actualDate: null, status: "scheduled", procedures: ["Physical examination", "AE assessment", "Tumor assessment"], labOrders: ["CBC", "CMP", "TSH"], assessments: ["CT chest/abdomen"], notes: null },
  { id: "vis-006", participantId: "SUB-003", studyId: "STU-2026-002", visitNumber: 1, visitName: "Screening", scheduledDate: "2026-04-05", windowStart: "2026-03-29", windowEnd: "2026-04-12", actualDate: "2026-04-05", status: "completed", procedures: ["Informed consent", "Medical history", "Physical examination"], labOrders: ["CBC", "CMP", "NT-proBNP", "HbA1c", "Lipid panel"], assessments: ["Echocardiogram", "6MWT"], notes: "EF 30%, NYHA Class II" },
];

// ── eCRF Forms ──
export const ECRF_FORMS: ECRFForm[] = [
  { id: "ecrf-001", participantId: "SUB-001", studyId: "STU-2026-001", visitId: "vis-003", formName: "Tumor Assessment (RECIST)", formStatus: "completed", completionDate: "2026-04-10", completedBy: "Priya Sharma", data: [{ field: "Best overall response", value: "Partial Response", status: "normal" }, { field: "Target lesion sum (mm)", value: "45", status: "normal" }, { field: "New lesions", value: "No", status: "normal" }, { field: "Progression-free", value: "Yes", status: "normal" }], queryCount: 0, lockedBy: "Dr. Rajesh Kumar", lockedAt: "2026-04-12" },
  { id: "ecrf-002", participantId: "SUB-001", studyId: "STU-2026-001", visitId: "vis-004", formName: "Adverse Event Log", formStatus: "completed", completionDate: "2026-07-10", completedBy: "Priya Sharma", data: [{ field: "AE term", value: "Fatigue Grade 2", status: "normal" }, { field: "Onset date", value: "2026-05-15", status: "normal" }, { field: "Severity", value: "Moderate", status: "normal" }, { field: "Relationship to study drug", value: "Probably related", status: "query" }, { field: "Action taken", value: "Dose not changed", status: "normal" }], queryCount: 1, lockedBy: null, lockedAt: null },
  { id: "ecrf-003", participantId: "SUB-003", studyId: "STU-2026-002", visitId: "vis-006", formName: "Cardiac Assessment", formStatus: "completed", completionDate: "2026-04-05", completedBy: "Amit Verma", data: [{ field: "LVEF (%)", value: "30", status: "normal" }, { field: "NYHA Class", value: "II", status: "normal" }, { field: "NT-proBNP (pg/mL)", value: "1850", status: "normal" }, { field: "6MWT distance (m)", value: "320", status: "normal" }], queryCount: 0, lockedBy: "Dr. Sneha Gupta", lockedAt: "2026-04-08" },
];

// ── Safety Events ──
export const SAFETY_EVENTS: SafetyEvent[] = [
  { id: "ae-001", participantId: "SUB-001", studyId: "STU-2026-001", studyName: "NSCLC Pembrolizumab Trial", eventType: "AE", description: "Grade 2 fatigue starting cycle 3, managed with dose delay", onsetDate: "2026-05-15", resolutionDate: null, severity: "moderate", expectedness: "expected", causality: "possible", outcome: "recovering", actionTaken: "dose_not_changed", reportedToSponsor: true, reportedToRegulatory: false, reportedDate: "2026-05-20", reportedBy: "Priya Sharma", regulatoryReportingDeadline: null },
  { id: "ae-002", participantId: "SUB-001", studyId: "STU-2026-001", studyName: "NSCLC Pembrolizumab Trial", eventType: "SAE", description: "Grade 3 immune-mediated hepatitis detected on routine labs", onsetDate: "2026-06-10", resolutionDate: "2026-06-25", severity: "severe", expectedness: "unexpected", causality: "probable", outcome: "recovered", actionTaken: "temporarily_discontinued", reportedToSponsor: true, reportedToRegulatory: true, reportedDate: "2026-06-10", reportedBy: "Dr. Rajesh Kumar", regulatoryReportingDeadline: "2026-06-17" },
  { id: "ae-003", participantId: "SUB-002", studyId: "STU-2026-001", studyName: "NSCLC Pembrolizumab Trial", eventType: "AE", description: "Grade 1 nausea, managed with ondansetron", onsetDate: "2026-03-15", resolutionDate: "2026-03-18", severity: "mild", expectedness: "expected", causality: "possible", outcome: "recovered", actionTaken: "none", reportedToSponsor: false, reportedToRegulatory: false, reportedDate: "2026-03-20", reportedBy: "Priya Sharma", regulatoryReportingDeadline: null },
  { id: "ae-004", participantId: "SUB-003", studyId: "STU-2026-002", studyName: "SGLT2 HFrEF Trial", eventType: "AE", description: "Symptomatic hypoglycemia episode, BG 52 mg/dL", onsetDate: "2026-05-10", resolutionDate: "2026-05-10", severity: "moderate", expectedness: "expected", causality: "unlikely", outcome: "recovered", actionTaken: "dose_reduced", reportedToSponsor: true, reportedToRegulatory: false, reportedDate: "2026-05-12", reportedBy: "Amit Verma", regulatoryReportingDeadline: null },
];

// ── IP Accountability ──
export const IP_ACCOUNTABILITY: IPAccountability[] = [
  { id: "ip-001", studyId: "STU-2026-001", drugName: "Pembrolizumab 100mg vial", batchNumber: "MK-3475-2026-A", expiryDate: "2027-06-30", storageCondition: "2-8C Refrigerated", temperature: "4.2C", receivedQuantity: 50, dispensedQuantity: 38, returnedQuantity: 2, destroyedQuantity: 0, currentInventory: 10, dispensingLog: [{ date: "2026-02-15", participantId: "SUB-001", quantity: 1, dispensedBy: "Pharmacy" }, { date: "2026-03-01", participantId: "SUB-002", quantity: 1, dispensedBy: "Pharmacy" }, { date: "2026-03-20", participantId: "SUB-006", quantity: 1, dispensedBy: "Pharmacy" }], temperatureLog: [{ date: "2026-07-23", temperature: "4.2C", status: "normal" }, { date: "2026-07-22", temperature: "4.0C", status: "normal" }, { date: "2026-07-21", temperature: "4.5C", status: "normal" }] },
  { id: "ip-002", studyId: "STU-2026-002", drugName: "Empagliflozin 10mg tablet", batchNumber: "EMP-2026-B01", expiryDate: "2028-03-31", storageCondition: "15-30C Room Temperature", temperature: "24.5C", receivedQuantity: 200, dispensedQuantity: 84, returnedQuantity: 0, destroyedQuantity: 0, currentInventory: 116, dispensingLog: [{ date: "2026-04-10", participantId: "SUB-003", quantity: 90, dispensedBy: "Pharmacy" }], temperatureLog: [{ date: "2026-07-23", temperature: "24.5C", status: "normal" }] },
];

// ── Monitoring Visits ──
export const MONITORING_VISITS: MonitoringVisit[] = [
  { id: "mon-001", studyId: "STU-2026-001", visitDate: "2026-06-15", monitorName: "Deepak Mehta", monitorRole: "Clinical Research Associate", visitType: "routine", status: "completed", sdvPerformed: 42, sdvTotal: 48, findings: ["2 eCRFs missing source documentation", "Drug accountability log incomplete for 1 subject", "ICF copies not filed"], actionItems: ["Provide source documents for 2 subjects", "Update IP accountability log", "File ICF copies"], riskScore: "medium", nextVisitDate: "2026-09-15", reportSubmitted: true },
  { id: "mon-002", studyId: "STU-2026-002", visitDate: "2026-07-20", monitorName: "Neha Kapoor", monitorRole: "Senior CRA", visitType: "routine", status: "completed", sdvPerformed: 28, sdvTotal: 30, findings: ["1 query open for >30 days", "Protocol deviation not reported"], actionItems: ["Resolve open query", "Submit protocol deviation form"], riskScore: "low", nextVisitDate: "2026-10-20", reportSubmitted: true },
  { id: "mon-003", studyId: "STU-2026-001", visitDate: "2026-09-15", monitorName: "Deepak Mehta", monitorRole: "Clinical Research Associate", visitType: "routine", status: "scheduled", sdvPerformed: 0, sdvTotal: 52, findings: [], actionItems: [], riskScore: "low", nextVisitDate: null, reportSubmitted: false },
];

// ── Query Records ──
export const QUERY_RECORDS: QueryRecord[] = [
  { id: "qry-001", studyId: "STU-2026-001", participantId: "SUB-001", formId: "ecrf-002", queryText: "Relationship to study drug: 'Probably related' - please clarify based on temporal relationship and dechallenge/rechallenge information", queryType: "manual", status: "open", raisedBy: "Deepak Mehta", raisedDate: "2026-06-15", responseText: null, responseDate: null, resolvedBy: null, resolvedDate: null, queryAge: 38, priority: "medium" },
  { id: "qry-002", studyId: "STU-2026-001", participantId: "SUB-001", formId: "ecrf-001", queryText: "Lab value WBC 3.2 x10^3/uL is below normal range (4-11). Grade 3 neutropenia per CTCAE v5.0. Please confirm and grade.", queryType: "edit_check", status: "answered", raisedBy: "System", raisedDate: "2026-04-10", responseText: "Confirmed Grade 3 neutropenia. Dose delay implemented per protocol.", responseDate: "2026-04-11", resolvedBy: "Priya Sharma", resolvedDate: "2026-04-11", queryAge: 0, priority: "high" },
  { id: "qry-003", studyId: "STU-2026-002", participantId: "SUB-003", formId: "ecrf-003", queryText: "NT-proBNP 1850 pg/mL is significantly elevated. Please confirm cardiac status and whether study drug should continue.", queryType: "validation", status: "escalated", raisedBy: "System", raisedDate: "2026-04-06", responseText: "Elevated NT-proBNP consistent with baseline HFrEF. Continuing study per investigator assessment.", responseDate: "2026-04-08", resolvedBy: "Dr. Sneha Gupta", resolvedDate: "2026-04-08", queryAge: 0, priority: "critical" },
  { id: "qry-004", studyId: "STU-2026-001", participantId: "SUB-002", formId: "ecrf-004", queryText: "Visit 3 window was 2026-04-09 to 2026-04-11. Visit occurred on 2026-04-12 (1 day out of window). Please document.", queryType: "edit_check", status: "closed", raisedBy: "System", raisedDate: "2026-04-12", responseText: "Visit performed 1 day out of window due to patient scheduling. PI assessed no impact on data integrity.", responseDate: "2026-04-13", resolvedBy: "Priya Sharma", resolvedDate: "2026-04-13", queryAge: 0, priority: "low" },
];

// ── Regulatory Documents ──
export const REGULATORY_DOCUMENTS: RegulatoryDocument[] = [
  { id: "reg-001", studyId: "STU-2026-001", documentName: "Protocol v3.0", documentType: "Protocol", version: "3.0", uploadDate: "2026-01-10", expiryDate: null, status: "current", uploadedBy: "Dr. Rajesh Kumar", fileSize: "2.4 MB", category: "protocol" },
  { id: "reg-002", studyId: "STU-2026-001", documentName: "Investigator's Brochure v5.0", documentType: "IB", version: "5.0", uploadDate: "2025-12-01", expiryDate: "2026-12-01", status: "current", uploadedBy: "Dr. Rajesh Kumar", fileSize: "15.8 MB", category: "protocol" },
  { id: "reg-003", studyId: "STU-2026-001", documentName: "IRB Approval Letter", documentType: "IRB", version: "1.0", uploadDate: "2025-12-20", expiryDate: "2026-12-20", status: "current", uploadedBy: "Dr. Rajesh Kumar", fileSize: "0.8 MB", category: "irb" },
  { id: "reg-004", studyId: "STU-2026-001", documentName: "Informed Consent Form v3.0", documentType: "ICF", version: "3.0", uploadDate: "2026-01-10", expiryDate: null, status: "current", uploadedBy: "Priya Sharma", fileSize: "1.2 MB", category: "regulatory" },
  { id: "reg-005", studyId: "STU-2026-001", documentName: "DSMB Charter", documentType: "Charter", version: "2.0", uploadDate: "2026-01-15", expiryDate: null, status: "current", uploadedBy: "Dr. Rajesh Kumar", fileSize: "3.1 MB", category: "regulatory" },
  { id: "reg-006", studyId: "STU-2026-001", documentName: "Monitoring Report - Visit 1", documentType: "Report", version: "1.0", uploadDate: "2026-06-20", expiryDate: null, status: "current", uploadedBy: "Deepak Mehta", fileSize: "4.5 MB", category: "monitoring" },
];

// ── Protocol Deviations ──
export const PROTOCOL_DEVIATIONS: ProtocolDeviation[] = [
  { id: "dev-001", studyId: "STU-2026-001", participantId: "SUB-001", description: "Study visit performed outside protocol-specified window (1 day late)", deviationType: "minor", detectedDate: "2026-04-12", rootCause: "Scheduling oversight", correctiveAction: "Documented deviation, PI assessment completed", preventiveAction: "Implemented automated visit window alerts", capaStatus: "verified", reportedBy: "Priya Sharma", reportedToIRB: false, impactAssessment: "No impact on data integrity or patient safety" },
  { id: "dev-002", studyId: "STU-2026-001", participantId: "SUB-002", description: "Grade 3 AE not reported to sponsor within 24 hours", deviationType: "major", detectedDate: "2026-05-25", rootCause: "Communication delay between site and sponsor", correctiveAction: "Late report submitted, root cause analysis completed", preventiveAction: "Established direct reporting pathway with 24-hour confirmation", capaStatus: "completed", reportedBy: "Dr. Rajesh Kumar", reportedToIRB: true, impactAssessment: "No impact on patient safety, regulatory reporting timeline met" },
];

// ── Audit Log ──
export const RESEARCH_AUDIT_LOGS: AuditEntry[] = [
  { id: "aud-001", timestamp: "2026-07-23 14:30", userId: "USR-001", userName: "Dr. Rajesh Kumar", userRole: "PI", action: "approved", entityType: "eCRF", entityName: "ONCO-001-012 Tumor Assessment Cycle 7", details: "Locked eCRF after review", ipAddress: "192.168.1.101", protocolVersion: "3.0" },
  { id: "aud-002", timestamp: "2026-07-23 10:15", userId: "USR-002", userName: "Priya Sharma", userRole: "CRC", action: "completed", entityType: "eCRF", entityName: "ONCO-001-012 Adverse Event Log", details: "Completed AE log entry for Grade 2 fatigue", ipAddress: "192.168.1.102", protocolVersion: "3.0" },
  { id: "aud-003", timestamp: "2026-07-22 16:45", userId: "USR-003", userName: "Deepak Mehta", userRole: "CRA", action: "raised", entityType: "Query", entityName: "Query for ONCO-001-012 AE relationship", details: "Raised manual query regarding AE causality assessment", ipAddress: "192.168.1.103", protocolVersion: "3.0" },
  { id: "aud-004", timestamp: "2026-07-20 11:00", userId: "USR-004", userName: "Dr. Sneha Gupta", userRole: "PI", action: "reviewed", entityType: "SAE", entityName: "SAE-002 Immune-mediated hepatitis", details: "Reviewed SAE report and confirmed causality as probable", ipAddress: "192.168.1.104", protocolVersion: "2.0" },
  { id: "aud-005", timestamp: "2026-07-18 09:30", userId: "USR-005", userName: "Ravi Kumar", userRole: "CRC", action: "submitted", entityType: "Consent", entityName: "eConsent PED-004-001", details: "Obtained initial informed consent for pediatric AML study", ipAddress: "192.168.1.105", protocolVersion: "1.0" },
  { id: "aud-006", timestamp: "2026-07-15 14:00", userId: "USR-006", userName: "System", userRole: "System", action: "generated", entityType: "Query", entityName: "Auto-query for CV-002-008 NT-proBNP", details: "System generated edit check query for elevated lab value", ipAddress: "10.0.0.1", protocolVersion: "2.0" },
  { id: "aud-007", timestamp: "2026-07-10 08:00", userId: "USR-001", userName: "Dr. Rajesh Kumar", userRole: "PI", action: "approved", entityType: "Protocol", entityName: "Protocol v3.0 Amendment 2", details: "Approved protocol amendment 2 with updated dosing schedule", ipAddress: "192.168.1.101", protocolVersion: "3.0" },
  { id: "aud-008", timestamp: "2026-07-05 16:30", userId: "USR-002", userName: "Priya Sharma", userRole: "CRC", action: "created", entityType: "Visit", entityName: "ONCO-001-012 Cycle 9 Day 1", details: "Scheduled Cycle 9 Day 1 visit for 2026-08-10", ipAddress: "192.168.1.102", protocolVersion: "3.0" },
];

// ── Dashboard KPIs ──
export const DASHBOARD_KPIS: DashboardKpis = {
  activeStudies: 4, totalParticipants: 7, openQueries: 2, safetyEvents: 4,
  upcomingVisits: 3, pendingApprovals: 1, protocolDeviations: 2, enrollmentRate: 73.5,
};

// ── Helpers ──
export function studyStatusColor(status: string): string {
  const m: Record<string, string> = {
    draft: "bg-slate-100 text-slate-600", submitted: "bg-blue-100 text-blue-700",
    irb_review: "bg-yellow-100 text-yellow-700", irb_approved: "bg-emerald-100 text-emerald-700",
    open: "bg-blue-100 text-blue-700", enrolling: "bg-indigo-100 text-indigo-700",
    closed_to_enrollment: "bg-orange-100 text-orange-700", active: "bg-emerald-100 text-emerald-700",
    completed: "bg-slate-100 text-slate-700", suspended: "bg-red-100 text-red-700",
    terminated: "bg-red-100 text-red-700",
  };
  return m[status] || "bg-slate-100 text-slate-600";
}

export function consentStatusColor(status: string): string {
  const m: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700", signed: "bg-emerald-100 text-emerald-700",
    reconsent_required: "bg-orange-100 text-orange-700", withdrawn: "bg-red-100 text-red-700",
    expired: "bg-slate-100 text-slate-600",
  };
  return m[status] || "bg-slate-100 text-slate-600";
}

export function queryStatusColor(status: string): string {
  const m: Record<string, string> = {
    open: "bg-yellow-100 text-yellow-700", answered: "bg-blue-100 text-blue-700",
    closed: "bg-emerald-100 text-emerald-700", escalated: "bg-red-100 text-red-700",
  };
  return m[status] || "bg-slate-100 text-slate-600";
}

export function safetySeverityColor(severity: string): string {
  const m: Record<string, string> = {
    mild: "bg-green-100 text-green-700", moderate: "bg-yellow-100 text-yellow-700",
    severe: "bg-orange-100 text-orange-700", life_threatening: "bg-red-100 text-red-700",
    fatal: "bg-red-200 text-red-800",
  };
  return m[severity] || "bg-slate-100 text-slate-600";
}

export function monitoringStatusColor(status: string): string {
  const m: Record<string, string> = {
    scheduled: "bg-blue-100 text-blue-700", in_progress: "bg-yellow-100 text-yellow-700",
    completed: "bg-emerald-100 text-emerald-700", follow_up: "bg-orange-100 text-orange-700",
  };
  return m[status] || "bg-slate-100 text-slate-600";
}

export function phaseLabel(phase: string): string {
  const m: Record<string, string> = {
    phase_1: "Phase I", phase_2: "Phase II", phase_3: "Phase III", phase_4: "Phase IV",
    observational: "Observational", registry: "Registry",
  };
  return m[phase] || phase;
}

export function enrollmentPercentage(current: number, target: number): number {
  return target > 0 ? Math.round((current / target) * 100) : 0;
}

export function enrollmentColor(pct: number): string {
  if (pct >= 80) return "text-emerald-600";
  if (pct >= 50) return "text-yellow-600";
  return "text-orange-600";
}

export function priorityColor(priority: string): string {
  const m: Record<string, string> = {
    low: "bg-slate-100 text-slate-600", medium: "bg-yellow-100 text-yellow-700",
    high: "bg-orange-100 text-orange-700", critical: "bg-red-100 text-red-700",
  };
  return m[priority] || "bg-slate-100 text-slate-600";
}

export function riskColor(score: string): string {
  const m: Record<string, string> = {
    low: "bg-emerald-100 text-emerald-700", medium: "bg-yellow-100 text-yellow-700",
    high: "bg-red-100 text-red-700",
  };
  return m[score] || "bg-slate-100 text-slate-600";
}
