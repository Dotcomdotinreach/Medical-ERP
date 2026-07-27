// ── AI & Predictive Analytics Platform Data ──
export type ModelStatus = "active" | "inactive" | "training" | "deploying" | "deprecated" | "pending_review";
export type PredictionStatus = "generated" | "reviewed" | "acknowledged" | "accepted" | "disregarded" | "pending";
export type AlertSeverity = "critical" | "high" | "medium" | "low" | "info";
export type DriftStatus = "normal" | "warning" | "drifted" | "critical";
export type BiasStatus = "pass" | "warning" | "fail" | "review";
export type GovernanceStatus = "draft" | "submitted" | "approved" | "rejected" | "revision";
export type AuditAction = "created" | "reviewed" | "approved" | "rejected" | "deployed" | "retrained" | "updated" | "archived";
export type Confidence = "very_high" | "high" | "moderate" | "low" | "very_low";
export type ExplanationType = "lime" | "shap" | "counterfactual" | "rule_based" | "attention";
export type DiseaseCategory = "cardiovascular" | "respiratory" | "metabolic" | "infectious" | "neurological" | "oncological" | "renal" | "maternal" | "pediatric" | "mental_health";
export type OutcomeCategory = "correct_prediction" | "false_positive" | "false_negative" | "partially_correct" | "overridden";

export interface AiModel {
  id: string; name: string; version: string; description: string; type: string; category: string;
  status: ModelStatus; accuracy: number; precision: number; recall: number; f1Score: number; auc: number;
  calibration: number; lastTrained: string; trainingSamples: number; features: number;
  driftStatus: DriftStatus; driftScore: number; biasStatus: BiasStatus; fairnessScore: number;
  deployedAt: string; author: string; department: string; lastRetrained: string; retrainCount: number;
  explanationType: ExplanationType;
}

export interface ClinicalPrediction {
  id: string; patientId: string; patientName: string; age: number; gender: "M" | "F";
  diagnosis: string; admissionDate: string; modelId: string; modelName: string; modelVersion: string;
  predictionType: string; riskScore: number; confidence: number; confidenceLevel: Confidence;
  status: PredictionStatus; predictedAt: string; reviewedAt: string | null; reviewedBy: string | null;
  factors: string[]; evidence: string[]; recommendedAction: string; clinicalRationale: string;
  guidelineReference: string; overrideReason: string | null; outcome: OutcomeCategory | null;
}

export interface PopulationHealthRecord {
  id: string; diseaseName: string; category: DiseaseCategory; population: number; affected: number;
  prevalenceRate: number; incidenceRate: number; trendDirection: "up" | "down" | "stable";
  trendChange: number; vaccinated: number; vaccinationRate: number; preventiveScore: number;
  careGapCount: number; region: string; riskLevel: AlertSeverity; lastUpdated: string;
  forecast: { month: string; predicted: number; actual: number | null }[];
}

export interface OperationalForecast {
  id: string; category: string; department: string; metric: string; currentValue: number;
  predictedValue: number; unit: string; confidence: number; trend: "up" | "down" | "stable";
  forecastPeriod: string; modelUsed: string; accuracy: number; lastUpdated: string;
  breakdown: { label: string; value: number }[];
}

export interface ExecutiveKpi {
  id: string; name: string; value: string; change: number; trend: "up" | "down" | "stable";
  target: string; status: "on_track" | "at_risk" | "behind"; icon: string; category: string; forecast: string;
}

export interface DocumentationAi {
  id: string; patientId: string; patientName: string;
  type: "encounter_summary" | "soap_draft" | "progress_note" | "discharge_summary" | "coding_suggestion";
  content: string; qualityScore: number; status: "draft" | "reviewed" | "approved" | "rejected";
  generatedAt: string; approvedAt: string | null; approvedBy: string | null;
  clinicianNotes: string; wordCount: number; accuracyScore: number;
}

export interface RadiologyAiCase {
  id: string; patientId: string; patientName: string; studyType: string; bodyPart: string;
  urgency: AlertSeverity; aiTriagePriority: number; suggestedFindings: string[]; confidence: number;
  criticalFindings: string[]; status: "pending" | "in_review" | "completed" | "critical";
  radiologistId: string | null; reportedAt: string; aiModelVersion: string;
}

export interface PathologyAiCase {
  id: string; patientId: string; patientName: string; specimenType: string; biopsySite: string;
  aiFlags: string[]; suggestedDiagnosis: string; confidence: number;
  status: "pending" | "in_review" | "completed" | "flagged";
  pathologistId: string | null; reportedAt: string; priority: AlertSeverity;
}

export interface ResourceOptimization {
  id: string; category: "staff" | "bed" | "equipment" | "consumable" | "inventory";
  department: string; resource: string; currentUtilization: number; optimizedUtilization: number;
  savingsPercent: number; recommendation: string; priority: AlertSeverity;
  status: "pending" | "accepted" | "implemented" | "rejected"; potentialSaving: string;
}

export interface PatientFlowRecord {
  id: string; timestamp: string; admissions: number; transfers: number; discharges: number;
  edVisits: number; predictedAdmissions: number; bottleneckDepartment: string;
  bottleneckDescription: string; predictedDelayMinutes: number; recommendation: string;
  capacityUtilization: number;
}

export interface ExplanationRecord {
  id: string; predictionId: string; modelId: string; modelName: string; explanationType: ExplanationType;
  confidence: number;
  keyFactors: { feature: string; importance: number; direction: "positive" | "negative"; description: string }[];
  clinicalContext: string; supportingEvidence: string[]; guidelinesReferenced: string[]; timestamp: string;
}

export interface ModelVersion {
  id: string; modelId: string; version: string; accuracy: number; deployedAt: string;
  deployedBy: string; changes: string; status: "production" | "staging" | "archived";
  trainingSamples: number; performanceDelta: number;
}

export interface ModelMonitorRecord {
  id: string; modelId: string; modelName: string; modelVersion: string; metricDate: string;
  accuracy: number; precision: number; recall: number; f1Score: number; auc: number;
  calibration: number; driftStatus: DriftStatus; driftScore: number; predictionVolume: number;
  errorRate: number;
}

export interface GovernanceRecord {
  id: string; modelId: string; modelName: string; version: string; status: GovernanceStatus;
  committee: string; submittedBy: string; submittedAt: string; reviewedAt: string | null;
  decision: string | null; conditions: string[]; biasStatus: BiasStatus; fairnessScore: number;
  complianceChecklist: { item: string; passed: boolean }[];
}

export interface BiasAssessment {
  id: string; modelId: string; modelName: string; assessmentDate: string;
  overallBiasStatus: BiasStatus; fairnessScore: number;
  metrics: { demographic: string; metric: string; value: number; threshold: number; status: BiasStatus }[];
  recommendations: string[]; assessedBy: string; nextAssessment: string;
}

export interface AlertNotification {
  id: string; type: "critical_prediction" | "capacity_alert" | "inventory_warning" | "operational_risk" | "executive_notification" | "model_health" | "governance";
  title: string; message: string; severity: AlertSeverity; source: string; createdAt: string;
  read: boolean; acknowledged: boolean; actionRequired: boolean;
}

export interface AiConfigItem {
  id: string; category: string; key: string; label: string; value: string;
  type: "number" | "toggle" | "select" | "text"; options?: string[]; description: string;
  lastUpdated: string; updatedBy: string;
}

export interface AuditLogEntry {
  id: string; timestamp: string; userId: string; userName: string; action: AuditAction;
  entityType: string; entityName: string; details: string; ipAddress: string;
}

// ── AI Models ──
export const AI_MODELS: AiModel[] = [
  { id: "mdl-001", name: "Sepsis Prediction XGBoost", version: "3.2.1", description: "Predicts sepsis onset within 6 hours using vitals, labs, demographics", type: "XGBoost Classifier", category: "Clinical", status: "active", accuracy: 0.934, precision: 0.912, recall: 0.956, f1Score: 0.934, auc: 0.971, calibration: 0.023, lastTrained: "2026-07-15", trainingSamples: 48200, features: 47, driftStatus: "normal", driftScore: 0.018, biasStatus: "pass", fairnessScore: 0.967, deployedAt: "2026-07-18", author: "Dr. Priya Mehta", department: "Critical Care", lastRetrained: "2026-07-15", retrainCount: 8, explanationType: "shap" },
  { id: "mdl-002", name: "Readmission Risk LSTM", version: "2.4.0", description: "Predicts 30-day readmission risk using patient history and demographics", type: "LSTM Network", category: "Clinical", status: "active", accuracy: 0.889, precision: 0.871, recall: 0.903, f1Score: 0.887, auc: 0.942, calibration: 0.031, lastTrained: "2026-07-10", trainingSamples: 62400, features: 53, driftStatus: "normal", driftScore: 0.025, biasStatus: "pass", fairnessScore: 0.954, deployedAt: "2026-07-12", author: "Dr. Arjun Sharma", department: "Quality", lastRetrained: "2026-07-10", retrainCount: 5, explanationType: "lime" },
  { id: "mdl-003", name: "ICU Transfer GradientBoost", version: "1.8.3", description: "Predicts ICU transfer need from ward patients within 24 hours", type: "Gradient Boosting", category: "Clinical", status: "active", accuracy: 0.912, precision: 0.898, recall: 0.928, f1Score: 0.913, auc: 0.956, calibration: 0.028, lastTrained: "2026-07-12", trainingSamples: 35600, features: 39, driftStatus: "normal", driftScore: 0.015, biasStatus: "pass", fairnessScore: 0.972, deployedAt: "2026-07-14", author: "Dr. Sneha Gupta", department: "Critical Care", lastRetrained: "2026-07-12", retrainCount: 6, explanationType: "shap" },
  { id: "mdl-004", name: "Mortality Prediction NeuralNet", version: "2.1.0", description: "Predicts in-hospital mortality risk using clinical features", type: "Deep Neural Network", category: "Clinical", status: "active", accuracy: 0.921, precision: 0.908, recall: 0.935, f1Score: 0.921, auc: 0.964, calibration: 0.019, lastTrained: "2026-07-18", trainingSamples: 41200, features: 62, driftStatus: "warning", driftScore: 0.042, biasStatus: "warning", fairnessScore: 0.938, deployedAt: "2026-07-20", author: "Dr. Amit Patel", department: "Quality", lastRetrained: "2026-07-18", retrainCount: 4, explanationType: "shap" },
  { id: "mdl-005", name: "Bed Occupancy ARIMA", version: "4.0.2", description: "Forecasts bed occupancy 72 hours ahead by department", type: "ARIMA Ensemble", category: "Operational", status: "active", accuracy: 0.876, precision: 0.869, recall: 0.883, f1Score: 0.876, auc: 0.921, calibration: 0.035, lastTrained: "2026-07-20", trainingSamples: 128000, features: 28, driftStatus: "normal", driftScore: 0.012, biasStatus: "pass", fairnessScore: 0.981, deployedAt: "2026-07-21", author: "Dr. Kavita Reddy", department: "Operations", lastRetrained: "2026-07-20", retrainCount: 12, explanationType: "rule_based" },
  { id: "mdl-006", name: "Revenue Forecast Prophet", version: "3.1.0", description: "Forecasts revenue by service line and department quarterly", type: "Prophet Model", category: "Financial", status: "active", accuracy: 0.892, precision: 0.885, recall: 0.899, f1Score: 0.892, auc: 0.934, calibration: 0.029, lastTrained: "2026-07-08", trainingSamples: 95000, features: 34, driftStatus: "normal", driftScore: 0.008, biasStatus: "pass", fairnessScore: 0.989, deployedAt: "2026-07-10", author: "Dr. Rajesh Kumar", department: "Finance", lastRetrained: "2026-07-08", retrainCount: 3, explanationType: "rule_based" },
  { id: "mdl-007", name: "Patient Deterioration NEWS2", version: "5.0.1", description: "Early warning score based on National Early Warning Score 2", type: "Scoring Algorithm", category: "Clinical", status: "active", accuracy: 0.908, precision: 0.892, recall: 0.924, f1Score: 0.908, auc: 0.952, calibration: 0.022, lastTrained: "2026-07-22", trainingSamples: 89000, features: 12, driftStatus: "normal", driftScore: 0.011, biasStatus: "pass", fairnessScore: 0.978, deployedAt: "2026-07-22", author: "Dr. Meera Joshi", department: "Nursing", lastRetrained: "2026-07-22", retrainCount: 15, explanationType: "rule_based" },
  { id: "mdl-008", name: "ED Demand Forecast", version: "2.3.1", description: "Forecasts ED visits by hour and acuity level", type: "Temporal Fusion Transformer", category: "Operational", status: "active", accuracy: 0.867, precision: 0.858, recall: 0.876, f1Score: 0.867, auc: 0.918, calibration: 0.038, lastTrained: "2026-07-19", trainingSamples: 215000, features: 41, driftStatus: "warning", driftScore: 0.048, biasStatus: "pass", fairnessScore: 0.974, deployedAt: "2026-07-20", author: "Dr. Suresh Nair", department: "Emergency", lastRetrained: "2026-07-19", retrainCount: 7, explanationType: "attention" },
  { id: "mdl-009", name: "Staff Scheduling Optimizer", version: "1.5.0", description: "Optimizes nurse and physician scheduling based on predicted demand", type: "Constraint Optimization", category: "Operational", status: "active", accuracy: 0.915, precision: 0.908, recall: 0.922, f1Score: 0.915, auc: 0.958, calibration: 0.021, lastTrained: "2026-07-14", trainingSamples: 52000, features: 31, driftStatus: "normal", driftScore: 0.014, biasStatus: "pass", fairnessScore: 0.985, deployedAt: "2026-07-15", author: "Dr. Anita Desai", department: "HRMS", lastRetrained: "2026-07-14", retrainCount: 9, explanationType: "rule_based" },
  { id: "mdl-010", name: "Drug Interaction GNN", version: "1.2.0", description: "Predicts adverse drug interactions using knowledge graph", type: "Graph Neural Network", category: "Clinical", status: "training", accuracy: 0.881, precision: 0.872, recall: 0.890, f1Score: 0.881, auc: 0.928, calibration: 0.033, lastTrained: "2026-07-21", trainingSamples: 73000, features: 86, driftStatus: "drifted", driftScore: 0.072, biasStatus: "review", fairnessScore: 0.921, deployedAt: "2026-06-01", author: "Dr. Vikram Singh", department: "Pharmacy", lastRetrained: "2026-07-21", retrainCount: 11, explanationType: "attention" },
  { id: "mdl-011", name: "Radiology Triage CNN", version: "2.0.3", description: "Triage and prioritize radiology studies based on AI findings", type: "Convolutional Neural Network", category: "Imaging", status: "active", accuracy: 0.942, precision: 0.931, recall: 0.953, f1Score: 0.942, auc: 0.978, calibration: 0.017, lastTrained: "2026-07-16", trainingSamples: 156000, features: 2048, driftStatus: "normal", driftScore: 0.009, biasStatus: "pass", fairnessScore: 0.982, deployedAt: "2026-07-17", author: "Dr. Deepak Verma", department: "Radiology", lastRetrained: "2026-07-16", retrainCount: 6, explanationType: "attention" },
  { id: "mdl-012", name: "Pathology Cancer Detection", version: "3.1.0", description: "Detects malignant cells in digital pathology slides", type: "Vision Transformer", category: "Imaging", status: "active", accuracy: 0.956, precision: 0.948, recall: 0.964, f1Score: 0.956, auc: 0.984, calibration: 0.014, lastTrained: "2026-07-11", trainingSamples: 234000, features: 1024, driftStatus: "normal", driftScore: 0.007, biasStatus: "pass", fairnessScore: 0.988, deployedAt: "2026-07-12", author: "Dr. Sanjay Mehta", department: "Pathology", lastRetrained: "2026-07-11", retrainCount: 4, explanationType: "attention" },
];

// ── Clinical Predictions ──
export const CLINICAL_PREDICTIONS: ClinicalPrediction[] = [
  { id: "pred-001", patientId: "PT-10234", patientName: "Rajesh Kumar Singh", age: 62, gender: "M", diagnosis: "Pneumonia", admissionDate: "2026-07-20", modelId: "mdl-001", modelName: "Sepsis Prediction XGBoost", modelVersion: "3.2.1", predictionType: "Sepsis Risk", riskScore: 0.87, confidence: 0.91, confidenceLevel: "very_high", status: "acknowledged", predictedAt: "2026-07-23 09:15:00", reviewedAt: "2026-07-23 09:45:00", reviewedBy: "Dr. Priya Mehta", factors: ["Elevated WBC 18,200", "Lactate 3.8 mmol/L", "Temperature 39.2 C", "Blood pressure 88/52 mmHg", "Heart rate 118 bpm"], evidence: ["WBC trend increasing over 48h", "Lactate above 3.5 threshold", "Procalcitonin elevated at 4.2 ng/mL"], recommendedAction: "Initiate sepsis bundle: blood cultures, lactate repeat, broad-spectrum antibiotics within 1 hour", clinicalRationale: "Patient meets qSOFA criteria with respiratory rate >22, altered mentation, and systolic BP <100.", guidelineReference: "Surviving Sepsis Campaign 2024", overrideReason: null, outcome: null },
  { id: "pred-002", patientId: "PT-10891", patientName: "Anita Devi Sharma", age: 58, gender: "F", diagnosis: "Heart Failure Exacerbation", admissionDate: "2026-07-21", modelId: "mdl-002", modelName: "Readmission Risk LSTM", modelVersion: "2.4.0", predictionType: "30-Day Readmission Risk", riskScore: 0.74, confidence: 0.83, confidenceLevel: "high", status: "reviewed", predictedAt: "2026-07-23 10:30:00", reviewedAt: null, reviewedBy: null, factors: ["Previous 2 admissions in 6 months", "EF 30%", "Non-compliance with medications", "Lives alone", "CKD stage 3"], evidence: ["Readmission rate for similar profile: 38%", "Medication adherence 62%", "BNP trending upward at discharge"], recommendedAction: "Schedule post-discharge follow-up within 7 days, arrange home health nursing", clinicalRationale: "Multiple risk factors including low ejection fraction, prior readmissions, and social determinants.", guidelineReference: "AHA Heart Failure Guidelines 2025", overrideReason: null, outcome: null },
  { id: "pred-003", patientId: "PT-11205", patientName: "Vikram Patel", age: 71, gender: "M", diagnosis: "Acute Kidney Injury", admissionDate: "2026-07-22", modelId: "mdl-003", modelName: "ICU Transfer GradientBoost", modelVersion: "1.8.3", predictionType: "ICU Transfer Risk", riskScore: 0.68, confidence: 0.79, confidenceLevel: "high", status: "pending", predictedAt: "2026-07-23 14:20:00", reviewedAt: null, reviewedBy: null, factors: ["Creatinine rising 2.1 to 3.8 mg/dL", "Urine output <0.5 mL/kg/hr", "Metabolic acidosis pH 7.28", "Fluid overload 4L positive", "Frailty score 7/10"], evidence: ["KDIGO stage 3 AKI criteria met", "Fluid responsiveness questionable", "Electrolytes trending dangerous"], recommendedAction: "Nephrology consultation, prepare for possible CRRT, monitor hourly urine output", clinicalRationale: "Rapidly worsening renal function with metabolic acidosis and fluid overload.", guidelineReference: "KDIGO AKI Guidelines 2024", overrideReason: null, outcome: null },
  { id: "pred-004", patientId: "PT-10456", patientName: "Sunita Rani Gupta", age: 45, gender: "F", diagnosis: "Breast Carcinoma", admissionDate: "2026-07-18", modelId: "mdl-004", modelName: "Mortality Prediction NeuralNet", modelVersion: "2.1.0", predictionType: "In-Hospital Mortality Risk", riskScore: 0.42, confidence: 0.72, confidenceLevel: "moderate", status: "acknowledged", predictedAt: "2026-07-23 08:00:00", reviewedAt: "2026-07-23 11:30:00", reviewedBy: "Dr. Amit Patel", factors: ["Stage IV metastatic disease", "Albumin 2.4 g/dL", "ECOG performance status 3", "WBC 4,200", "LDH elevated at 520"], evidence: ["Albumin <3.0 is independent mortality predictor", "ECOG 3-4 associated with 6x mortality risk", "Elevated LDH indicates high tumor burden"], recommendedAction: "Palliative care consultation, goals of care discussion", clinicalRationale: "Combined risk score warrants compassionate care planning.", guidelineReference: "NCCN Palliative Care Guidelines 2025", overrideReason: null, outcome: null },
  { id: "pred-005", patientId: "PT-10789", patientName: "Mohammad Irfan Ali", age: 34, gender: "M", diagnosis: "Diabetic Ketoacidosis", admissionDate: "2026-07-23", modelId: "mdl-001", modelName: "Sepsis Prediction XGBoost", modelVersion: "3.2.1", predictionType: "Sepsis Risk", riskScore: 0.35, confidence: 0.68, confidenceLevel: "moderate", status: "disregarded", predictedAt: "2026-07-23 16:45:00", reviewedAt: "2026-07-23 17:15:00", reviewedBy: "Dr. Suresh Nair", factors: ["Mild leukocytosis WBC 12,400", "Temperature 37.8 C", "pH 7.22", "Glucose 485 mg/dL"], evidence: ["Leukocytosis likely stress response from DKA", "Low-grade fever common in DKA", "No source of infection identified"], recommendedAction: "Continue DKA protocol, monitor for infectious precipitant", clinicalRationale: "Elevated WBC and mild temperature are consistent with DKA stress response.", guidelineReference: "ADA DKA Management 2025", overrideReason: "Elevated WBC attributed to DKA stress response", outcome: "overridden" },
  { id: "pred-006", patientId: "PT-10312", patientName: "Lakshmi Narayan Reddy", age: 55, gender: "M", diagnosis: "COPD Exacerbation", admissionDate: "2026-07-19", modelId: "mdl-007", modelName: "Patient Deterioration NEWS2", modelVersion: "5.0.1", predictionType: "Patient Deterioration", riskScore: 0.82, confidence: 0.88, confidenceLevel: "high", status: "accepted", predictedAt: "2026-07-23 07:30:00", reviewedAt: "2026-07-23 08:00:00", reviewedBy: "Dr. Meera Joshi", factors: ["NEWS2 score 9 (high)", "SpO2 88% on 4L NC", "Respiratory rate 28/min", "Heart rate 112 bpm", "Reduced consciousness"], evidence: ["NEWS2 >=7 requires urgent clinical review", "SpO2 below target", "Tachypnea indicates respiratory distress"], recommendedAction: "Urgent medical review, consider ICU transfer, escalate oxygen therapy", clinicalRationale: "NEWS2 score of 9 indicates high clinical risk.", guidelineReference: "Royal College of Physicians NEWS2 2024", overrideReason: null, outcome: "correct_prediction" },
  { id: "pred-007", patientId: "PT-10567", patientName: "Geeta Devi Agarwal", age: 68, gender: "F", diagnosis: "Sepsis - Urinary Tract", admissionDate: "2026-07-22", modelId: "mdl-001", modelName: "Sepsis Prediction XGBoost", modelVersion: "3.2.1", predictionType: "Sepsis Risk", riskScore: 0.93, confidence: 0.96, confidenceLevel: "very_high", status: "accepted", predictedAt: "2026-07-23 06:00:00", reviewedAt: "2026-07-23 06:20:00", reviewedBy: "Dr. Priya Mehta", factors: ["WBC 22,800", "Lactate 5.2 mmol/L", "Procalcitonin 12.4 ng/mL", "Temperature 40.1 C", "Blood pressure 78/45 mmHg"], evidence: ["Lactate >4 strongly predicts septic shock", "Procalcitonin >2 confirms bacterial sepsis", "qSOFA score 3/3"], recommendedAction: "Immediate sepsis bundle: 30mL/kg crystalloid, vasopressors, broad-spectrum antibiotics", clinicalRationale: "Classic presentation of septic shock with hypotension and hyperlactatemia.", guidelineReference: "Surviving Sepsis Campaign 2024", overrideReason: null, outcome: "correct_prediction" },
  { id: "pred-008", patientId: "PT-10998", patientName: "Arun Kumar Verma", age: 40, gender: "M", diagnosis: "Appendicitis - Pre-op", admissionDate: "2026-07-23", modelId: "mdl-002", modelName: "Readmission Risk LSTM", modelVersion: "2.4.0", predictionType: "30-Day Readmission Risk", riskScore: 0.22, confidence: 0.76, confidenceLevel: "moderate", status: "acknowledged", predictedAt: "2026-07-23 12:00:00", reviewedAt: "2026-07-23 13:00:00", reviewedBy: "Dr. Arjun Sharma", factors: ["Age 40, healthy", "No prior admissions", "Simple appendectomy planned", "BMI 24"], evidence: ["Readmission rate for simple appendectomy: 4.2%", "No comorbidities", "Same-day surgery candidate"], recommendedAction: "Standard post-op care, discharge with wound care instructions", clinicalRationale: "Low-risk patient with straightforward surgical case.", guidelineReference: "ACS Surgical Quality Guidelines 2025", overrideReason: null, outcome: null },
];

// ── Population Health ──
export const POPULATION_HEALTH: PopulationHealthRecord[] = [
  { id: "pop-001", diseaseName: "Type 2 Diabetes Mellitus", category: "metabolic", population: 125000, affected: 18750, prevalenceRate: 15.0, incidenceRate: 2.8, trendDirection: "up", trendChange: 1.2, vaccinated: 0, vaccinationRate: 0, preventiveScore: 68, careGapCount: 4200, region: "Mumbai Metropolitan", riskLevel: "high", lastUpdated: "2026-07-23", forecast: [{ month: "Aug", predicted: 19100, actual: null }, { month: "Sep", predicted: 19450, actual: null }, { month: "Oct", predicted: 19800, actual: null }] },
  { id: "pop-002", diseaseName: "Hypertension", category: "cardiovascular", population: 125000, affected: 31250, prevalenceRate: 25.0, incidenceRate: 3.5, trendDirection: "stable", trendChange: 0.3, vaccinated: 0, vaccinationRate: 0, preventiveScore: 72, careGapCount: 6800, region: "Mumbai Metropolitan", riskLevel: "high", lastUpdated: "2026-07-23", forecast: [{ month: "Aug", predicted: 31500, actual: null }, { month: "Sep", predicted: 31700, actual: null }, { month: "Oct", predicted: 31900, actual: null }] },
  { id: "pop-003", diseaseName: "COVID-19 Vaccination", category: "infectious", population: 125000, affected: 0, prevalenceRate: 0, incidenceRate: 0.5, trendDirection: "down", trendChange: -2.1, vaccinated: 106250, vaccinationRate: 85.0, preventiveScore: 85, careGapCount: 18750, region: "Mumbai Metropolitan", riskLevel: "medium", lastUpdated: "2026-07-23", forecast: [{ month: "Aug", predicted: 0.4, actual: null }, { month: "Sep", predicted: 0.3, actual: null }, { month: "Oct", predicted: 0.25, actual: null }] },
  { id: "pop-004", diseaseName: "COPD", category: "respiratory", population: 125000, affected: 6250, prevalenceRate: 5.0, incidenceRate: 1.2, trendDirection: "up", trendChange: 0.8, vaccinated: 0, vaccinationRate: 0, preventiveScore: 58, careGapCount: 2100, region: "Mumbai Metropolitan", riskLevel: "medium", lastUpdated: "2026-07-23", forecast: [{ month: "Aug", predicted: 6400, actual: null }, { month: "Sep", predicted: 6550, actual: null }, { month: "Oct", predicted: 6700, actual: null }] },
  { id: "pop-005", diseaseName: "Breast Cancer Screening", category: "oncological", population: 45000, affected: 0, prevalenceRate: 0, incidenceRate: 0, trendDirection: "up", trendChange: 3.2, vaccinated: 0, vaccinationRate: 0, preventiveScore: 45, careGapCount: 24750, region: "Mumbai Metropolitan", riskLevel: "critical", lastUpdated: "2026-07-23", forecast: [{ month: "Aug", predicted: 42, actual: null }, { month: "Sep", predicted: 44, actual: null }, { month: "Oct", predicted: 46, actual: null }] },
  { id: "pop-006", diseaseName: "Depression", category: "mental_health", population: 125000, affected: 12500, prevalenceRate: 10.0, incidenceRate: 2.2, trendDirection: "up", trendChange: 1.8, vaccinated: 0, vaccinationRate: 0, preventiveScore: 35, careGapCount: 8750, region: "Mumbai Metropolitan", riskLevel: "high", lastUpdated: "2026-07-23", forecast: [{ month: "Aug", predicted: 12800, actual: null }, { month: "Sep", predicted: 13100, actual: null }, { month: "Oct", predicted: 13400, actual: null }] },
];

// ── Operational Forecasts ──
export const OPERATIONAL_FORECASTS: OperationalForecast[] = [
  { id: "fc-001", category: "Bed Occupancy", department: "All Departments", metric: "Bed Occupancy Rate", currentValue: 82, predictedValue: 87, unit: "%", confidence: 0.89, trend: "up", forecastPeriod: "72 hours", modelUsed: "Bed Occupancy ARIMA", accuracy: 0.876, lastUpdated: "2026-07-23 18:00", breakdown: [{ label: "Medical", value: 85 }, { label: "Surgical", value: 78 }, { label: "ICU", value: 92 }, { label: "Pediatric", value: 71 }] },
  { id: "fc-002", category: "Emergency Visits", department: "Emergency", metric: "Daily ED Visits", currentValue: 145, predictedValue: 168, unit: "visits/day", confidence: 0.84, trend: "up", forecastPeriod: "24 hours", modelUsed: "ED Demand Forecast", accuracy: 0.867, lastUpdated: "2026-07-23 16:00", breakdown: [{ label: "Trauma", value: 32 }, { label: "Medical", value: 85 }, { label: "Pediatric", value: 28 }, { label: "Psychiatric", value: 23 }] },
  { id: "fc-003", category: "OPD Volume", department: "Outpatient", metric: "Daily OPD Visits", currentValue: 520, predictedValue: 548, unit: "visits/day", confidence: 0.86, trend: "up", forecastPeriod: "7 days", modelUsed: "ED Demand Forecast", accuracy: 0.867, lastUpdated: "2026-07-23 14:00", breakdown: [{ label: "General Medicine", value: 180 }, { label: "Cardiology", value: 85 }, { label: "Orthopedics", value: 72 }, { label: "Pediatrics", value: 68 }, { label: "Others", value: 143 }] },
  { id: "fc-004", category: "OR Utilization", department: "Operation Theater", metric: "OR Utilization Rate", currentValue: 74, predictedValue: 81, unit: "%", confidence: 0.82, trend: "up", forecastPeriod: "48 hours", modelUsed: "Staff Scheduling Optimizer", accuracy: 0.915, lastUpdated: "2026-07-23 12:00", breakdown: [{ label: "Major Surgery", value: 82 }, { label: "Minor Surgery", value: 76 }, { label: "Emergency", value: 65 }] },
  { id: "fc-005", category: "ICU Capacity", department: "ICU", metric: "ICU Bed Utilization", currentValue: 88, predictedValue: 93, unit: "%", confidence: 0.91, trend: "up", forecastPeriod: "24 hours", modelUsed: "Bed Occupancy ARIMA", accuracy: 0.876, lastUpdated: "2026-07-23 18:00", breakdown: [{ label: "Medical ICU", value: 95 }, { label: "Surgical ICU", value: 88 }, { label: "Cardiac ICU", value: 91 }, { label: "Neuro ICU", value: 82 }] },
  { id: "fc-006", category: "Lab Demand", department: "Laboratory", metric: "Daily Test Volume", currentValue: 2840, predictedValue: 3120, unit: "tests/day", confidence: 0.85, trend: "up", forecastPeriod: "7 days", modelUsed: "Bed Occupancy ARIMA", accuracy: 0.876, lastUpdated: "2026-07-23 10:00", breakdown: [{ label: "Hematology", value: 820 }, { label: "Biochemistry", value: 1240 }, { label: "Microbiology", value: 380 }, { label: "Histopathology", value: 280 }, { label: "Others", value: 400 }] },
  { id: "fc-007", category: "Radiology Demand", department: "Radiology", metric: "Daily Study Volume", currentValue: 185, predictedValue: 210, unit: "studies/day", confidence: 0.83, trend: "up", forecastPeriod: "48 hours", modelUsed: "ED Demand Forecast", accuracy: 0.867, lastUpdated: "2026-07-23 14:00", breakdown: [{ label: "X-Ray", value: 85 }, { label: "CT", value: 52 }, { label: "MRI", value: 38 }, { label: "Ultrasound", value: 35 }] },
  { id: "fc-008", category: "Pharmacy Demand", department: "Pharmacy", metric: "Monthly Medication Spend", currentValue: 4200000, predictedValue: 4580000, unit: "INR", confidence: 0.88, trend: "up", forecastPeriod: "30 days", modelUsed: "Revenue Forecast Prophet", accuracy: 0.892, lastUpdated: "2026-07-23 08:00", breakdown: [{ label: "Antibiotics", value: 1200000 }, { label: "Cardiovascular", value: 980000 }, { label: "Antidiabetics", value: 680000 }, { label: "Analgesics", value: 520000 }, { label: "Others", value: 1200000 }] },
];

// ── Executive KPIs ──
export const EXECUTIVE_KPIS: ExecutiveKpi[] = [
  { id: "kpi-001", name: "Revenue Forecast", value: "Rs 12.8 Cr", change: 8.2, trend: "up", target: "Rs 13.0 Cr", status: "on_track", icon: "IndianRupee", category: "Financial", forecast: "On track for Q3 target" },
  { id: "kpi-002", name: "Bed Occupancy", value: "82%", change: 3.1, trend: "up", target: "80-85%", status: "on_track", icon: "BedDouble", category: "Operational", forecast: "Within optimal range" },
  { id: "kpi-003", name: "Patient Satisfaction", value: "4.6/5", change: 0.2, trend: "up", target: "4.5/5", status: "on_track", icon: "Star", category: "Quality", forecast: "Above benchmark" },
  { id: "kpi-004", name: "Readmission Rate", value: "8.2%", change: -1.3, trend: "down", target: "<10%", status: "on_track", icon: "RefreshCw", category: "Clinical", forecast: "Improving trend" },
  { id: "kpi-005", name: "AI Model Accuracy", value: "92.4%", change: 1.8, trend: "up", target: ">90%", status: "on_track", icon: "Brain", category: "AI", forecast: "All models performing well" },
  { id: "kpi-006", name: "Sepsis Mortality", value: "12.1%", change: -2.4, trend: "down", target: "<15%", status: "on_track", icon: "HeartPulse", category: "Clinical", forecast: "AI early detection improving outcomes" },
  { id: "kpi-007", name: "Average LOS", value: "4.8 days", change: -0.3, trend: "down", target: "<5 days", status: "on_track", icon: "Clock", category: "Operational", forecast: "Optimized discharge planning" },
  { id: "kpi-008", name: "Staff Efficiency", value: "94.2%", change: 2.1, trend: "up", target: ">90%", status: "on_track", icon: "Users", category: "HR", forecast: "AI scheduling optimization working" },
];

// ── Documentation AI ──
export const DOCUMENTATION_AI: DocumentationAi[] = [
  { id: "doc-001", patientId: "PT-10234", patientName: "Rajesh Kumar Singh", type: "encounter_summary", content: "62M admitted with community-acquired pneumonia. Fever 39.2C, productive cough, WBC 18,200. CXR: RLL consolidation. IV ceftriaxone + azithromycin started. CRP 142, procalcitonin 4.2. Sepsis positive: lactate 3.8. On 4L NC SpO2 94%. Monitor q4h.", qualityScore: 92, status: "approved", generatedAt: "2026-07-23 10:00", approvedAt: "2026-07-23 10:30", approvedBy: "Dr. Priya Mehta", clinicianNotes: "Added allergies", wordCount: 52, accuracyScore: 0.94 },
  { id: "doc-002", patientId: "PT-10891", patientName: "Anita Devi Sharma", type: "soap_draft", content: "S: 58F HFrEF EF30% with 3d worsening dyspnea, bilateral pedal edema, orthopnea. 3kg weight gain. Medication non-adherence.\nO: BP 148/92 HR 98 RR 24 SpO2 91%. Bilateral basal crackles. BNP 1240. Cr 1.8.\nA: HF exacerbation NYHA III, precipitated by non-compliance.\nP: IV furosemide 40mg, fluid restrict 1.5L, daily weights, medication reconciliation.", qualityScore: 88, status: "reviewed", generatedAt: "2026-07-23 11:00", approvedAt: null, approvedBy: null, clinicianNotes: "", wordCount: 68, accuracyScore: 0.91 },
  { id: "doc-003", patientId: "PT-11205", patientName: "Vikram Patel", type: "discharge_summary", content: "DISCHARGE SUMMARY\nPt: Vikram Patel 71M\nAdmit: 2026-07-22 DC: 2026-07-23\nDx: AKI KDIGO Stage 3\nCourse: AKI secondary to dehydration + ACEi. Creatinine peaked 3.8, trending down 2.4. Conservative mgmt with IV fluids.\nMeds: Amlodipine 5mg, hold ACEi, paracetamol PRN\nFollow-up: Nephrology 1wk, BMP 3d", qualityScore: 85, status: "draft", generatedAt: "2026-07-23 15:00", approvedAt: null, approvedBy: null, clinicianNotes: "", wordCount: 58, accuracyScore: 0.87 },
  { id: "doc-004", patientId: "PT-10456", patientName: "Sunita Rani Gupta", type: "progress_note", content: "PROGRESS NOTE Day 5\nS: Pain 6/10, fatigue, reduced appetite. Sleep 4-5h.\nO: Vitals stable. Wt 58kg (-2kg). Mild pallor. Surgical site clean.\nA: POD5 lumpectomy. Pain controlled. Nutrition needs attention.\nP: Continue pain mgmt, diet consult high-protein, ambulate TID, wound check 48h.", qualityScore: 90, status: "approved", generatedAt: "2026-07-23 08:00", approvedAt: "2026-07-23 09:00", approvedBy: "Dr. Amit Patel", clinicianNotes: "Minor edits", wordCount: 52, accuracyScore: 0.93 },
  { id: "doc-005", patientId: "PT-10567", patientName: "Geeta Devi Agarwal", type: "coding_suggestion", content: "Suggested ICD-10 Codes:\nN10 - Acute pyelonephritis\nR79.89 - Elevated lactate\nA41.9 - Sepsis unspecified organism\nN17.9 - Acute kidney failure\nDRG: 683 - Renal failure with MCC\nCPT: 99223 - Initial hospital care, high complexity", qualityScore: 87, status: "reviewed", generatedAt: "2026-07-23 07:00", approvedAt: null, approvedBy: null, clinicianNotes: "", wordCount: 35, accuracyScore: 0.89 },
];

// ── Radiology AI Cases ──
export const RADIOLOGY_AI_CASES: RadiologyAiCase[] = [
  { id: "rad-001", patientId: "PT-10234", patientName: "Rajesh Kumar Singh", studyType: "CT Chest", bodyPart: "Chest", urgency: "high", aiTriagePriority: 2, suggestedFindings: ["RLL consolidation", "Air bronchograms", "Small R pleural effusion", "No pneumothorax"], confidence: 0.94, criticalFindings: [], status: "in_review", radiologistId: null, reportedAt: "2026-07-23 09:30", aiModelVersion: "2.0.3" },
  { id: "rad-002", patientId: "PT-10567", patientName: "Geeta Devi Agarwal", studyType: "CT Abdomen", bodyPart: "Abdomen", urgency: "critical", aiTriagePriority: 1, suggestedFindings: ["Bilateral hydronephrosis", "L renal calculus 8mm", "Thickened bladder wall", "Free pelvic fluid"], confidence: 0.91, criticalFindings: ["Possible urinary obstruction"], status: "critical", radiologistId: null, reportedAt: "2026-07-23 06:45", aiModelVersion: "2.0.3" },
  { id: "rad-003", patientId: "PT-10312", patientName: "Lakshmi Narayan Reddy", studyType: "X-Ray Chest", bodyPart: "Chest", urgency: "medium", aiTriagePriority: 3, suggestedFindings: ["Bilateral hyperinflation", "Flattened diaphragms", "Increased AP diameter", "No consolidation"], confidence: 0.88, criticalFindings: [], status: "pending", radiologistId: null, reportedAt: "2026-07-23 08:15", aiModelVersion: "2.0.3" },
  { id: "rad-004", patientId: "PT-10789", patientName: "Mohammad Irfan Ali", studyType: "CT Head", bodyPart: "Brain", urgency: "high", aiTriagePriority: 2, suggestedFindings: ["No ICH", "No midline shift", "Grey-white preserved", "Basal cisterns patent"], confidence: 0.96, criticalFindings: [], status: "completed", radiologistId: "Dr. Deepak Verma", reportedAt: "2026-07-23 17:00", aiModelVersion: "2.0.3" },
  { id: "rad-005", patientId: "PT-10456", patientName: "Sunita Rani Gupta", studyType: "MRI Brain", bodyPart: "Brain", urgency: "medium", aiTriagePriority: 4, suggestedFindings: ["No space-occupying lesion", "No restricted diffusion", "Ventricles normal", "No enhancement"], confidence: 0.93, criticalFindings: [], status: "completed", radiologistId: "Dr. Deepak Verma", reportedAt: "2026-07-23 12:00", aiModelVersion: "2.0.3" },
];

// ── Pathology AI Cases ──
export const PATHOLOGY_AI_CASES: PathologyAiCase[] = [
  { id: "path-001", patientId: "PT-10456", patientName: "Sunita Rani Gupta", specimenType: "Biopsy", biopsySite: "Left Breast", aiFlags: ["Invasive ductal carcinoma", "High mitotic count", "Lymphovascular invasion"], suggestedDiagnosis: "IDC Grade 3 Nottingham", confidence: 0.96, status: "flagged", pathologistId: null, reportedAt: "2026-07-23 14:00", priority: "high" },
  { id: "path-002", patientId: "PT-10998", patientName: "Arun Kumar Verma", specimenType: "Surgical", biopsySite: "Appendix", aiFlags: ["Acute transmural inflammation", "No perforation", "Fecalith present"], suggestedDiagnosis: "Acute Appendicitis", confidence: 0.98, status: "completed", pathologistId: "Dr. Sanjay Mehta", reportedAt: "2026-07-23 16:00", priority: "medium" },
  { id: "path-003", patientId: "PT-10234", patientName: "Rajesh Kumar Singh", specimenType: "Sputum", biopsySite: "Respiratory", aiFlags: ["Gram-positive diplococci", "Heavy growth"], suggestedDiagnosis: "S. pneumoniae infection", confidence: 0.92, status: "completed", pathologistId: "Dr. Sanjay Mehta", reportedAt: "2026-07-23 11:00", priority: "medium" },
  { id: "path-004", patientId: "PT-11205", patientName: "Vikram Patel", specimenType: "Biopsy", biopsySite: "Kidney", aiFlags: ["Acute tubular necrosis", "Tubular epithelial damage"], suggestedDiagnosis: "Acute Tubular Necrosis", confidence: 0.89, status: "in_review", pathologistId: null, reportedAt: "2026-07-23 10:00", priority: "high" },
];

// ── Resource Optimization ──
export const RESOURCE_OPTIMIZATIONS: ResourceOptimization[] = [
  { id: "res-001", category: "staff", department: "ICU", resource: "ICU Nursing Staff", currentUtilization: 95, optimizedUtilization: 88, savingsPercent: 7, recommendation: "Redistribute 2 nurses night to evening based on predicted admissions", priority: "high", status: "accepted", potentialSaving: "Rs 2.4L/month" },
  { id: "res-002", category: "bed", department: "Medical", resource: "General Ward Beds", currentUtilization: 85, optimizedUtilization: 82, savingsPercent: 3, recommendation: "Implement predictive discharge planning to reduce LOS by 0.3 days", priority: "medium", status: "pending", potentialSaving: "Rs 8.5L/month" },
  { id: "res-003", category: "equipment", department: "Radiology", resource: "MRI Scanner", currentUtilization: 78, optimizedUtilization: 91, savingsPercent: 13, recommendation: "Reschedule routine MRI to fill gaps between emergency cases", priority: "high", status: "implemented", potentialSaving: "Rs 15.2L/month" },
  { id: "res-004", category: "consumable", department: "Pharmacy", resource: "Antibiotics Stock", currentUtilization: 72, optimizedUtilization: 68, savingsPercent: 4, recommendation: "Optimize inventory based on predicted infection patterns", priority: "medium", status: "accepted", potentialSaving: "Rs 4.8L/month" },
  { id: "res-005", category: "inventory", department: "Blood Bank", resource: "Blood Units", currentUtilization: 65, optimizedUtilization: 82, savingsPercent: 17, recommendation: "Adjust collection targets based on predicted surgical demand", priority: "high", status: "pending", potentialSaving: "Rs 6.2L/month" },
  { id: "res-006", category: "staff", department: "Emergency", resource: "ER Physician Coverage", currentUtilization: 88, optimizedUtilization: 85, savingsPercent: 3, recommendation: "Align scheduling with predicted ED volume peaks", priority: "medium", status: "accepted", potentialSaving: "Rs 3.1L/month" },
];

// ── Patient Flow Records ──
export const PATIENT_FLOW: PatientFlowRecord[] = [
  { id: "flow-001", timestamp: "2026-07-23 06:00", admissions: 12, transfers: 3, discharges: 5, edVisits: 28, predictedAdmissions: 18, bottleneckDepartment: "Emergency", bottleneckDescription: "Triage backlog due to high acuity patients", predictedDelayMinutes: 45, recommendation: "Open surge area, deploy additional triage nurse", capacityUtilization: 78 },
  { id: "flow-002", timestamp: "2026-07-23 10:00", admissions: 18, transfers: 5, discharges: 8, edVisits: 35, predictedAdmissions: 22, bottleneckDepartment: "Medical Ward", bottleneckDescription: "Discharge delays waiting for lab results", predictedDelayMinutes: 90, recommendation: "Expedite pending labs, activate discharge lounge", capacityUtilization: 82 },
  { id: "flow-003", timestamp: "2026-07-23 14:00", admissions: 15, transfers: 4, discharges: 12, edVisits: 42, predictedAdmissions: 20, bottleneckDepartment: "ICU", bottleneckDescription: "Delayed transfers from ICU to step-down", predictedDelayMinutes: 120, recommendation: "Open step-down unit beds, initiate transfer protocols", capacityUtilization: 88 },
  { id: "flow-004", timestamp: "2026-07-23 18:00", admissions: 10, transfers: 2, discharges: 15, edVisits: 38, predictedAdmissions: 16, bottleneckDepartment: "Radiology", bottleneckDescription: "CT scan delays affecting ED throughput", predictedDelayMinutes: 60, recommendation: "Activate secondary CT scanner, prioritize ED studies", capacityUtilization: 85 },
];

// ── Explanation Records ──
export const EXPLANATION_RECORDS: ExplanationRecord[] = [
  { id: "exp-001", predictionId: "pred-001", modelId: "mdl-001", modelName: "Sepsis Prediction XGBoost", explanationType: "shap", confidence: 0.91, keyFactors: [{ feature: "Lactate Level", importance: 0.28, direction: "positive", description: "Lactate 3.8 mmol/L above threshold" }, { feature: "WBC Count", importance: 0.22, direction: "positive", description: "WBC 18,200 indicating infection" }, { feature: "Blood Pressure", importance: 0.18, direction: "positive", description: "SBP 88 mmHg below 90" }, { feature: "Temperature", importance: 0.15, direction: "positive", description: "Temperature 39.2C fever" }, { feature: "Heart Rate", importance: 0.12, direction: "positive", description: "Tachycardia 118 bpm" }, { feature: "Age", importance: 0.05, direction: "positive", description: "Age 62 increases risk" }], clinicalContext: "Pneumonia patient with systemic inflammatory response", supportingEvidence: ["qSOFA criteria met", "Procalcitonin elevated", "Lactate >2 mmol/L"], guidelinesReferenced: ["Surviving Sepsis Campaign 2024", "NICE Sepsis Guidelines"], timestamp: "2026-07-23 09:15" },
  { id: "exp-002", predictionId: "pred-002", modelId: "mdl-002", modelName: "Readmission Risk LSTM", explanationType: "lime", confidence: 0.83, keyFactors: [{ feature: "Prior Admissions", importance: 0.25, direction: "positive", description: "2 admissions in 6 months" }, { feature: "Ejection Fraction", importance: 0.20, direction: "positive", description: "EF 30% severe LV dysfunction" }, { feature: "Medication Adherence", importance: 0.18, direction: "positive", description: "62% adherence below target" }, { feature: "Living Situation", importance: 0.15, direction: "positive", description: "Lives alone limited support" }, { feature: "CKD Stage", importance: 0.12, direction: "positive", description: "CKD stage 3 complicates HF" }, { feature: "BNP Trend", importance: 0.10, direction: "positive", description: "BNP rising at discharge" }], clinicalContext: "HF patient with multiple readmission risk factors", supportingEvidence: ["Readmission rate 38% for similar profiles", "HOSPITAL score >10"], guidelinesReferenced: ["AHA HF Guidelines 2025"], timestamp: "2026-07-23 10:30" },
];

// ── Model Versions ──
export const MODEL_VERSIONS: ModelVersion[] = [
  { id: "mv-001", modelId: "mdl-001", version: "3.2.1", accuracy: 0.934, deployedAt: "2026-07-18", deployedBy: "Dr. Priya Mehta", changes: "Added procalcitonin feature, recalibrated thresholds", status: "production", trainingSamples: 48200, performanceDelta: 2.3 },
  { id: "mv-002", modelId: "mdl-001", version: "3.2.0", accuracy: 0.911, deployedAt: "2026-06-28", deployedBy: "Dr. Priya Mehta", changes: "Retrained with updated sepsis definitions", status: "archived", trainingSamples: 45800, performanceDelta: 1.8 },
  { id: "mv-003", modelId: "mdl-001", version: "3.1.0", accuracy: 0.893, deployedAt: "2026-05-15", deployedBy: "Dr. Priya Mehta", changes: "Initial deployment with vitals and basic labs", status: "archived", trainingSamples: 42000, performanceDelta: 0 },
  { id: "mv-004", modelId: "mdl-002", version: "2.4.0", accuracy: 0.889, deployedAt: "2026-07-12", deployedBy: "Dr. Arjun Sharma", changes: "Added social determinants features", status: "production", trainingSamples: 62400, performanceDelta: 3.1 },
  { id: "mv-005", modelId: "mdl-003", version: "1.8.3", accuracy: 0.912, deployedAt: "2026-07-14", deployedBy: "Dr. Sneha Gupta", changes: "Improved calibration with Platt scaling", status: "production", trainingSamples: 35600, performanceDelta: 2.8 },
  { id: "mv-006", modelId: "mdl-004", version: "2.1.0", accuracy: 0.921, deployedAt: "2026-07-20", deployedBy: "Dr. Amit Patel", changes: "Deep architecture with attention mechanism", status: "production", trainingSamples: 41200, performanceDelta: 4.2 },
];

// ── Model Monitor Records ──
export const MODEL_MONITOR_RECORDS: ModelMonitorRecord[] = [
  { id: "mon-001", modelId: "mdl-001", modelName: "Sepsis Prediction XGBoost", modelVersion: "3.2.1", metricDate: "2026-07-23", accuracy: 0.934, precision: 0.912, recall: 0.956, f1Score: 0.934, auc: 0.971, calibration: 0.023, driftStatus: "normal", driftScore: 0.018, predictionVolume: 342, errorRate: 0.066 },
  { id: "mon-002", modelId: "mdl-002", modelName: "Readmission Risk LSTM", modelVersion: "2.4.0", metricDate: "2026-07-23", accuracy: 0.889, precision: 0.871, recall: 0.903, f1Score: 0.887, auc: 0.942, calibration: 0.031, driftStatus: "normal", driftScore: 0.025, predictionVolume: 128, errorRate: 0.111 },
  { id: "mon-003", modelId: "mdl-003", modelName: "ICU Transfer GradientBoost", modelVersion: "1.8.3", metricDate: "2026-07-23", accuracy: 0.912, precision: 0.898, recall: 0.928, f1Score: 0.913, auc: 0.956, calibration: 0.028, driftStatus: "normal", driftScore: 0.015, predictionVolume: 89, errorRate: 0.088 },
  { id: "mon-004", modelId: "mdl-004", modelName: "Mortality Prediction NeuralNet", modelVersion: "2.1.0", metricDate: "2026-07-23", accuracy: 0.921, precision: 0.908, recall: 0.935, f1Score: 0.921, auc: 0.964, calibration: 0.019, driftStatus: "warning", driftScore: 0.042, predictionVolume: 156, errorRate: 0.079 },
  { id: "mon-005", modelId: "mdl-010", modelName: "Drug Interaction GNN", modelVersion: "1.2.0", metricDate: "2026-07-23", accuracy: 0.881, precision: 0.872, recall: 0.890, f1Score: 0.881, auc: 0.928, calibration: 0.033, driftStatus: "drifted", driftScore: 0.072, predictionVolume: 245, errorRate: 0.119 },
  { id: "mon-006", modelId: "mdl-008", modelName: "ED Demand Forecast", modelVersion: "2.3.1", metricDate: "2026-07-23", accuracy: 0.867, precision: 0.858, recall: 0.876, f1Score: 0.867, auc: 0.918, calibration: 0.038, driftStatus: "warning", driftScore: 0.048, predictionVolume: 72, errorRate: 0.133 },
];

// ── Governance Records ──
export const GOVERNANCE_RECORDS: GovernanceRecord[] = [
  { id: "gov-001", modelId: "mdl-001", modelName: "Sepsis Prediction XGBoost", version: "3.2.1", status: "approved", committee: "AI Governance Board", submittedBy: "Dr. Priya Mehta", submittedAt: "2026-07-16", reviewedAt: "2026-07-17", decision: "Approved for production", conditions: ["Quarterly bias audit", "Monthly performance review"], biasStatus: "pass", fairnessScore: 0.967, complianceChecklist: [{ item: "IRB approval", passed: true }, { item: "Bias assessment", passed: true }, { item: "Clinical validation", passed: true }, { item: "Security review", passed: true }, { item: "Documentation", passed: true }] },
  { id: "gov-002", modelId: "mdl-004", modelName: "Mortality Prediction NeuralNet", version: "2.1.0", status: "approved", committee: "AI Governance Board", submittedBy: "Dr. Amit Patel", submittedAt: "2026-07-19", reviewedAt: "2026-07-20", decision: "Approved with conditions", conditions: ["Enhanced bias monitoring", "Weekly review first month", "Mandatory human review"], biasStatus: "warning", fairnessScore: 0.938, complianceChecklist: [{ item: "IRB approval", passed: true }, { item: "Bias assessment", passed: true }, { item: "Clinical validation", passed: true }, { item: "Security review", passed: true }, { item: "Documentation", passed: true }] },
  { id: "gov-003", modelId: "mdl-010", modelName: "Drug Interaction GNN", version: "1.2.0", status: "revision", committee: "AI Governance Board", submittedBy: "Dr. Vikram Singh", submittedAt: "2026-07-22", reviewedAt: null, decision: null, conditions: ["Drift retrain required", "Bias review needed"], biasStatus: "review", fairnessScore: 0.921, complianceChecklist: [{ item: "IRB approval", passed: true }, { item: "Bias assessment", passed: false }, { item: "Clinical validation", passed: true }, { item: "Security review", passed: true }, { item: "Documentation", passed: false }] },
];

// ── Bias Assessments ──
export const BIAS_ASSESSMENTS: BiasAssessment[] = [
  { id: "bias-001", modelId: "mdl-001", modelName: "Sepsis Prediction XGBoost", assessmentDate: "2026-07-15", overallBiasStatus: "pass", fairnessScore: 0.967, metrics: [{ demographic: "Gender", metric: "Equalized Odds", value: 0.95, threshold: 0.8, status: "pass" }, { demographic: "Age Group", metric: "Demographic Parity", value: 0.93, threshold: 0.8, status: "pass" }, { demographic: "Ethnicity", metric: "Calibration", value: 0.97, threshold: 0.85, status: "pass" }], recommendations: ["Continue quarterly monitoring"], assessedBy: "Dr. Priya Mehta", nextAssessment: "2026-10-15" },
  { id: "bias-002", modelId: "mdl-004", modelName: "Mortality Prediction NeuralNet", assessmentDate: "2026-07-18", overallBiasStatus: "warning", fairnessScore: 0.938, metrics: [{ demographic: "Gender", metric: "Equalized Odds", value: 0.92, threshold: 0.8, status: "pass" }, { demographic: "Age Group", metric: "Demographic Parity", value: 0.88, threshold: 0.8, status: "pass" }, { demographic: "Ethnicity", metric: "Calibration", value: 0.85, threshold: 0.85, status: "warning" }], recommendations: ["Retrain with balanced data", "Increase monitoring frequency"], assessedBy: "Dr. Amit Patel", nextAssessment: "2026-08-18" },
  { id: "bias-003", modelId: "mdl-010", modelName: "Drug Interaction GNN", assessmentDate: "2026-07-21", overallBiasStatus: "fail", fairnessScore: 0.921, metrics: [{ demographic: "Gender", metric: "Equalized Odds", value: 0.90, threshold: 0.8, status: "pass" }, { demographic: "Age Group", metric: "Demographic Parity", value: 0.82, threshold: 0.8, status: "pass" }, { demographic: "Ethnicity", metric: "Calibration", value: 0.78, threshold: 0.85, status: "fail" }], recommendations: ["Immediate retraining", "Add diverse training data", "Suspend high-risk predictions"], assessedBy: "Dr. Vikram Singh", nextAssessment: "2026-08-01" },
];

// ── Alert Notifications ──
export const ALERT_NOTIFICATIONS: AlertNotification[] = [
  { id: "alert-001", type: "critical_prediction", title: "Critical Sepsis Risk", message: "Geeta Devi Agarwal 93% sepsis risk. Immediate intervention required.", severity: "critical", source: "Sepsis Prediction Model", createdAt: "2026-07-23 06:00", read: true, acknowledged: true, actionRequired: true },
  { id: "alert-002", type: "capacity_alert", title: "ICU Capacity Warning", message: "ICU predicted to reach 93% within 24 hours.", severity: "high", source: "Bed Occupancy ARIMA", createdAt: "2026-07-23 18:00", read: false, acknowledged: false, actionRequired: true },
  { id: "alert-003", type: "model_health", title: "Model Drift Detected", message: "Drug Interaction GNN drift score 0.072. Retraining needed.", severity: "high", source: "Model Monitoring", createdAt: "2026-07-23 12:00", read: true, acknowledged: false, actionRequired: true },
  { id: "alert-004", type: "inventory_warning", title: "Blood Bank Alert", message: "O-negative units below threshold: 12/25.", severity: "medium", source: "Blood Bank Forecast", createdAt: "2026-07-23 14:00", read: false, acknowledged: false, actionRequired: true },
  { id: "alert-005", type: "executive_notification", title: "Revenue Forecast Update", message: "Q3 projected Rs 12.8 Cr on track for Rs 13.0 Cr target.", severity: "info", source: "Revenue Forecast", createdAt: "2026-07-23 08:00", read: true, acknowledged: true, actionRequired: false },
  { id: "alert-006", type: "governance", title: "Governance Review Required", message: "Drug Interaction GNN bias failed. Review before redeployment.", severity: "critical", source: "AI Governance Board", createdAt: "2026-07-22 16:00", read: true, acknowledged: false, actionRequired: true },
  { id: "alert-007", type: "operational_risk", title: "ED Surge Predicted", message: "ED visits predicted to increase 16% in 24 hours.", severity: "medium", source: "ED Demand Forecast", createdAt: "2026-07-23 16:00", read: false, acknowledged: false, actionRequired: true },
  { id: "alert-008", type: "critical_prediction", title: "Patient Deterioration", message: "Lakshmi Narayan Reddy NEWS2 score 9. Urgent review.", severity: "critical", source: "Deterioration NEWS2", createdAt: "2026-07-23 07:30", read: true, acknowledged: true, actionRequired: true },
];

// ── Configuration Items ──
export const AI_CONFIG: AiConfigItem[] = [
  { id: "cfg-001", category: "Prediction Thresholds", key: "sepsis_threshold", label: "Sepsis Risk Threshold", value: "0.75", type: "number", description: "Minimum risk to trigger sepsis alert", lastUpdated: "2026-07-15", updatedBy: "Dr. Priya Mehta" },
  { id: "cfg-002", category: "Prediction Thresholds", key: "readmission_threshold", label: "Readmission Risk Threshold", value: "0.65", type: "number", description: "Minimum risk to trigger intervention", lastUpdated: "2026-07-10", updatedBy: "Dr. Arjun Sharma" },
  { id: "cfg-003", category: "Prediction Thresholds", key: "icu_transfer_threshold", label: "ICU Transfer Threshold", value: "0.60", type: "number", description: "Minimum risk to alert ICU team", lastUpdated: "2026-07-12", updatedBy: "Dr. Sneha Gupta" },
  { id: "cfg-004", category: "Notification Rules", key: "critical_alert_channel", label: "Critical Alert Channel", value: "sms+app", type: "select", options: ["sms", "app", "sms+app", "sms+app+page"], description: "How critical predictions are communicated", lastUpdated: "2026-07-01", updatedBy: "Admin" },
  { id: "cfg-005", category: "Notification Rules", key: "auto_escalate_minutes", label: "Auto-Escalation Time", value: "15", type: "number", description: "Minutes before unacknowledged alerts escalate", lastUpdated: "2026-07-01", updatedBy: "Admin" },
  { id: "cfg-006", category: "AI Features", key: "enable_doc_ai", label: "Documentation AI", value: "true", type: "toggle", description: "Enable AI-assisted clinical documentation", lastUpdated: "2026-07-20", updatedBy: "CMIO" },
  { id: "cfg-007", category: "AI Features", key: "enable_radiology_ai", label: "Radiology AI Triage", value: "true", type: "toggle", description: "Enable AI radiology study triage", lastUpdated: "2026-07-17", updatedBy: "Dr. Deepak Verma" },
  { id: "cfg-008", category: "AI Features", key: "enable_pathology_ai", label: "Pathology AI Detection", value: "true", type: "toggle", description: "Enable AI pathology detection", lastUpdated: "2026-07-12", updatedBy: "Dr. Sanjay Mehta" },
  { id: "cfg-009", category: "Model Configuration", key: "retrain_trigger_drift", label: "Drift Retrain Threshold", value: "0.05", type: "number", description: "Drift score to trigger retraining", lastUpdated: "2026-07-01", updatedBy: "Data Science" },
  { id: "cfg-010", category: "Model Configuration", key: "min_confidence_display", label: "Min Display Confidence", value: "0.50", type: "number", description: "Minimum confidence to display prediction", lastUpdated: "2026-07-01", updatedBy: "Data Science" },
  { id: "cfg-011", category: "Knowledge Sources", key: "clinical_guidelines_db", label: "Guidelines Source", value: "NICE+WHO+IAP", type: "text", description: "Guidelines databases for AI explanations", lastUpdated: "2026-06-15", updatedBy: "Clinical Informatics" },
  { id: "cfg-012", category: "Retraining Rules", key: "retrain_schedule", label: "Scheduled Retraining", value: "weekly", type: "select", options: ["daily", "weekly", "monthly", "quarterly"], description: "How often models are retrained", lastUpdated: "2026-07-01", updatedBy: "Data Science" },
];

// ── Audit Logs ──
export const AI_AUDIT_LOGS: AuditLogEntry[] = [
  { id: "aud-001", timestamp: "2026-07-23 09:45", userId: "USR-001", userName: "Dr. Priya Mehta", action: "reviewed", entityType: "Prediction", entityName: "pred-001 Sepsis Risk - Rajesh Kumar Singh", details: "Reviewed and acknowledged sepsis prediction risk 0.87", ipAddress: "192.168.1.101" },
  { id: "aud-002", timestamp: "2026-07-23 06:20", userId: "USR-001", userName: "Dr. Priya Mehta", action: "approved", entityType: "Prediction", entityName: "pred-007 Sepsis Risk - Geeta Devi Agarwal", details: "Accepted high-risk sepsis prediction. Initiated bundle.", ipAddress: "192.168.1.101" },
  { id: "aud-003", timestamp: "2026-07-23 17:15", userId: "USR-002", userName: "Dr. Suresh Nair", action: "rejected", entityType: "Prediction", entityName: "pred-005 Sepsis Risk - Mohammad Irfan Ali", details: "Disregarded: WBC attributed to DKA stress response", ipAddress: "192.168.1.102" },
  { id: "aud-004", timestamp: "2026-07-23 10:30", userId: "USR-001", userName: "Dr. Priya Mehta", action: "approved", entityType: "DocumentationAI", entityName: "doc-001 Encounter Summary", details: "Approved AI encounter summary with minor additions", ipAddress: "192.168.1.101" },
  { id: "aud-005", timestamp: "2026-07-22 16:00", userId: "USR-003", userName: "Dr. Vikram Singh", action: "updated", entityType: "AiModel", entityName: "mdl-010 Drug Interaction GNN", details: "Initiated retraining v1.2.1 for drift and bias", ipAddress: "192.168.1.103" },
  { id: "aud-006", timestamp: "2026-07-20 12:00", userId: "USR-004", userName: "Dr. Amit Patel", action: "deployed", entityType: "AiModel", entityName: "mdl-004 Mortality NeuralNet v2.1.0", details: "Deployed deep architecture. Governance approved.", ipAddress: "192.168.1.104" },
  { id: "aud-007", timestamp: "2026-07-18 14:00", userId: "USR-005", userName: "AI Governance Board", action: "approved", entityType: "Governance", entityName: "gov-001 Sepsis XGBoost v3.2.1", details: "Approved for production with quarterly audit", ipAddress: "192.168.1.200" },
  { id: "aud-008", timestamp: "2026-07-17 09:00", userId: "USR-006", userName: "Data Science Team", action: "created", entityType: "ModelVersion", entityName: "Sepsis XGBoost v3.2.1", details: "New version. Accuracy 0.911 to 0.934 +2.3%", ipAddress: "192.168.1.110" },
];

// ── Dashboard KPIs ──
export const DASHBOARD_KPIS = {
  activeModels: 10, totalPredictionsToday: 842, highRiskPatients: 23, pendingReviews: 12,
  acknowledgedPredictions: 45, averageConfidence: 87.3, modelAccuracyAvg: 92.4, alertsToday: 8,
  governanceApproved: 9, governancePending: 1, retrainingQueue: 1, driftDetected: 1,
};

// ── Helpers ──
export function riskColor(score: number): string {
  if (score >= 0.8) return "text-red-600 bg-red-50 border-red-200";
  if (score >= 0.6) return "text-orange-600 bg-orange-50 border-orange-200";
  if (score >= 0.4) return "text-yellow-600 bg-yellow-50 border-yellow-200";
  if (score >= 0.2) return "text-blue-600 bg-blue-50 border-blue-200";
  return "text-emerald-600 bg-emerald-50 border-emerald-200";
}

export function confidenceColor(confidence: number): string {
  if (confidence >= 0.9) return "text-emerald-600";
  if (confidence >= 0.8) return "text-green-600";
  if (confidence >= 0.7) return "text-yellow-600";
  if (confidence >= 0.6) return "text-orange-600";
  return "text-red-600";
}

export function confidenceLabel(confidence: number): string {
  if (confidence >= 0.9) return "Very High";
  if (confidence >= 0.8) return "High";
  if (confidence >= 0.7) return "Moderate";
  if (confidence >= 0.6) return "Low";
  return "Very Low";
}

export function statusBadge(status: string): string {
  const m: Record<string, string> = {
    active: "bg-emerald-100 text-emerald-700", inactive: "bg-slate-100 text-slate-600",
    training: "bg-blue-100 text-blue-700", deploying: "bg-yellow-100 text-yellow-700",
    deprecated: "bg-red-100 text-red-700", pending_review: "bg-orange-100 text-orange-700",
    generated: "bg-slate-100 text-slate-700", reviewed: "bg-blue-100 text-blue-700",
    acknowledged: "bg-indigo-100 text-indigo-700", accepted: "bg-emerald-100 text-emerald-700",
    disregarded: "bg-red-100 text-red-700", pending: "bg-yellow-100 text-yellow-700",
    draft: "bg-slate-100 text-slate-600", approved: "bg-emerald-100 text-emerald-700",
    rejected: "bg-red-100 text-red-700", revision: "bg-orange-100 text-orange-700",
    submitted: "bg-blue-100 text-blue-700", production: "bg-emerald-100 text-emerald-700",
    staging: "bg-yellow-100 text-yellow-700", archived: "bg-slate-100 text-slate-500",
    implemented: "bg-emerald-100 text-emerald-700", normal: "bg-emerald-100 text-emerald-700",
    warning: "bg-yellow-100 text-yellow-700", drifted: "bg-red-100 text-red-700",
    critical: "bg-red-100 text-red-700", pass: "bg-emerald-100 text-emerald-700",
    fail: "bg-red-100 text-red-700", review: "bg-orange-100 text-orange-700",
    high: "bg-red-100 text-red-700", medium: "bg-yellow-100 text-yellow-700",
    low: "bg-green-100 text-green-700", info: "bg-blue-100 text-blue-700",
  };
  return m[status] || "bg-slate-100 text-slate-600";
}

export function severityColor(severity: string): string {
  const m: Record<string, string> = {
    critical: "bg-red-500", high: "bg-orange-500", medium: "bg-yellow-500",
    low: "bg-green-500", info: "bg-blue-500",
  };
  return m[severity] || "bg-slate-400";
}

export function trendIcon(trend: string): string {
  if (trend === "up") return "+";
  if (trend === "down") return "-";
  return "~";
}

export function driftColor(status: string): string {
  const m: Record<string, string> = {
    normal: "text-emerald-600", warning: "text-yellow-600",
    drifted: "text-red-600", critical: "text-red-700",
  };
  return m[status] || "text-slate-600";
}
