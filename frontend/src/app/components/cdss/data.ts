/* ── Clinical Decision Support System — Data ──────────────────────────────── */

export type AlertSeverity = "Critical" | "High" | "Medium" | "Low";
export type AlertType = "Medication" | "Lab" | "Sepsis" | "AKI" | "VTE" | "Fall" | "Pressure" | "Readmission" | "Deterioration" | "Preventive" | "Guideline" | "Diagnostic";
export type AlertStatus = "Active" | "Acknowledged" | "Accepted" | "Overridden" | "Resolved" | "Escalated";
export type OverrideStatus = "Pending" | "Approved" | "Rejected" | "Under Review";
export type EvidenceLevel = "Level A" | "Level B" | "Level C" | "Expert Opinion";
export type RiskLevel = "Very High" | "High" | "Moderate" | "Low" | "Very Low";
export type RecommendationStatus = "Pending" | "Accepted" | "Overridden" | "Implemented" | "Not Applicable";
export type PathwayStage = "Admission" | "Assessment" | "Treatment" | "Monitoring" | "Discharge" | "Follow-up";

export interface ClinicalAlert {
  id: string; patientId: string; patientName: string;
  severity: AlertSeverity; alertType: AlertType;
  title: string; description: string;
  trigger: string; clinicalContext: string;
  evidenceLevel: EvidenceLevel; evidenceSource: string;
  recommendedAction: string; status: AlertStatus;
  timestamp: string; acknowledgedBy?: string;
  escalationLevel: number; confidence: number;
  linkedMedication?: string; linkedLab?: string;
}

export const CLINICAL_ALERTS: ClinicalAlert[] = [
  { id: "ALT-001", patientId: "P-3001", patientName: "Rajesh Kumar (62M)", severity: "Critical", alertType: "Sepsis", title: "Sepsis Screening Positive — qSOFA ≥ 2", description: "Patient meets SIRS criteria with evidence of organ dysfunction. qSOFA score 3. Lactate 4.2 mmol/L. BP 88/52. RR 28.", trigger: "qSOFA Score ≥ 2 + Lactate > 2 mmol/L", clinicalContext: "Post-operative Day 2 — Abdominal surgery. Rising WBC, CRP. Temp 38.9°C.", evidenceLevel: "Level A", evidenceSource: "Surviving Sepsis Campaign 2021", recommendedAction: "Initiate Sepsis Bundle: Blood cultures × 2, Lactate, 30ml/kg Crystalloid, broad-spectrum antibiotics within 1 hour.", status: "Active", timestamp: "2026-07-25T08:15:00", escalationLevel: 2, confidence: 94, linkedLab: "Lactate: 4.2 mmol/L (Critical)" },
  { id: "ALT-002", patientId: "P-3002", patientName: "Sunita Devi (45F)", severity: "High", alertType: "Medication", title: "Drug Interaction — Warfarin + Amiodarone", description: "Amiodarone significantly increases warfarin levels. INR risk of supratherapeutic values and bleeding.", trigger: "CYP2C9/CYP3A4 Interaction Detected", clinicalContext: "Patient on Warfarin 5mg daily for AF. New Amiodarone 200mg started for rhythm control.", evidenceLevel: "Level A", evidenceSource: "FDA Drug Safety Communication", recommendedAction: "Reduce warfarin dose by 30-50%. Monitor INR within 3-5 days. Consider heparin bridge.", status: "Active", timestamp: "2026-07-25T07:30:00", escalationLevel: 1, confidence: 98, linkedMedication: "Warfarin 5mg + Amiodarone 200mg" },
  { id: "ALT-003", patientId: "P-3003", patientName: "Amit Joshi (35M)", severity: "Medium", alertType: "Preventive", title: "Care Gap — Diabetes Screening Overdue", description: "Patient has BMI 28.5, family history of DM, age > 35. HbA1c screening overdue by 6 months.", trigger: "Preventive Care Rule — DM Screening", clinicalContext: "Routine OPD visit. Multiple risk factors for Type 2 DM.", evidenceLevel: "Level A", evidenceSource: "ADA Standards of Care 2026", recommendedAction: "Order HbA1c + Fasting Glucose. Lifestyle counseling. Consider Metformin if pre-diabetic.", status: "Pending", timestamp: "2026-07-25T09:00:00", escalationLevel: 0, confidence: 85 },
  { id: "ALT-004", patientId: "P-3004", patientName: "Lakshmi Iyer (29F)", severity: "High", alertType: "AKI", title: "AKI Risk — Creatinine Rising Trend", description: "Creatinine increased from 0.8 to 1.4 mg/dL in 48 hours. KDIGO Stage 1 AKI. NSAID use detected.", trigger: "Creatinine Rise > 0.3 mg/dL in 48h", clinicalContext: "Patient on Naproxen for headache. Dehydrated. Oral fluid intake poor.", evidenceLevel: "Level B", evidenceSource: "KDIGO AKI Guidelines 2024", recommendedAction: "Stop NSAIDs immediately. IV fluid resuscitation. Repeat creatinine in 6 hours. Nephrology consult if no improvement.", status: "Active", timestamp: "2026-07-25T10:20:00", escalationLevel: 1, confidence: 92, linkedLab: "Creatinine: 1.4 mg/dL (Rising)" },
  { id: "ALT-005", patientId: "P-3005", patientName: "Deepak Nair (62M)", severity: "Medium", alertType: "VTE", title: "VTE Risk — Caprini Score 6", description: "Post-orthopedic surgery patient. Caprini score 6 (High risk). No VTE prophylaxis started.", trigger: "Caprini Score ≥ 5 — No prophylaxis order", clinicalContext: "Right knee replacement surgery. Immobilized. Age > 60.", evidenceLevel: "Level A", evidenceSource: "ACCP Guidelines 2024", recommendedAction: "Initiate LMWH (Enoxaparin 40mg SC daily) + Mechanical prophylaxis. Continue until mobile.", status: "Pending", timestamp: "2026-07-25T11:00:00", escalationLevel: 0, confidence: 88 },
  { id: "ALT-006", patientId: "P-3006", patientName: "Kavitha Reddy (38F)", severity: "Low", alertType: "Fall", title: "Fall Risk — Morse Score 45", description: "Patient on sedatives (Lorazepam). History of dizziness. Morse Fall Scale score 45 (High risk).", trigger: "Morse Fall Scale ≥ 45", clinicalContext: "Psychiatry admission. Night sedation. Postural instability.", evidenceLevel: "Level B", evidenceSource: "AHRQ Fall Prevention Toolkit", recommendedAction: "Fall precautions: Bed alarm, non-slip footwear, call bell within reach, hourly rounding, consider reducing sedation.", status: "Acknowledged", timestamp: "2026-07-25T06:00:00", acknowledgedBy: "Nurse Priya", escalationLevel: 0, confidence: 80 },
  { id: "ALT-007", patientId: "P-3007", patientName: "Mohammed Ali (55M)", severity: "Critical", alertType: "Deterioration", title: "NEWS2 Score 8 — Clinical Deterioration", description: "NEWS2 score 8 (High clinical risk). SpO2 88% on room air. RR 28. HR 112. BP 92/58. Confused.", trigger: "NEWS2 ≥ 7 — Urgent Response", clinicalContext: "Medical ward. Pneumonia. Not on supplemental O2. Deteriorating over 4 hours.", evidenceLevel: "Level A", evidenceSource: "Royal College of Physicians NEWS2", recommendedAction: "Urgent review by senior clinician. Transfer to HDU. Supplemental O2. IV access. Repeat NEWS2 in 30 min.", status: "Escalated", timestamp: "2026-07-25T09:45:00", escalationLevel: 3, confidence: 96 },
  { id: "ALT-008", patientId: "P-3001", patientName: "Rajesh Kumar (62M)", severity: "High", alertType: "Medication", title: "Renal Dose Adjustment — Levofloxacin", description: "Patient CrCl 28 mL/min. Current Levofloxacin dose 750mg needs reduction. Risk of seizures and QT prolongation.", trigger: "CrCl < 30 — Renal Dose Protocol", clinicalContext: "Septic patient with AKI. Levofloxacin for UTI source.", evidenceLevel: "Level A", evidenceSource: "FDA Renal Dosing Guidelines", recommendedAction: "Reduce Levofloxacin to 250mg daily or switch to alternative. Monitor QTc. Drug level monitoring recommended.", status: "Active", timestamp: "2026-07-25T08:30:00", escalationLevel: 1, confidence: 95, linkedMedication: "Levofloxacin 750mg → 250mg" },
];

export interface RiskScore {
  patientId: string; patientName: string;
  sepsis: { score: number; level: RiskLevel; trend: "rising" | "stable" | "falling"; };
  aki: { score: number; level: RiskLevel; trend: "rising" | "stable" | "falling"; };
  vte: { score: number; level: RiskLevel; trend: "rising" | "stable" | "falling"; };
  fall: { score: number; level: RiskLevel; trend: "rising" | "stable" | "falling"; };
  pressure: { score: number; level: RiskLevel; trend: "rising" | "stable" | "falling"; };
  readmission: { score: number; level: RiskLevel; trend: "rising" | "stable" | "falling"; };
  mortality: { score: number; level: RiskLevel; trend: "rising" | "stable" | "falling"; };
  overallRisk: RiskLevel;
}

export const RISK_SCORES: RiskScore[] = [
  { patientId: "P-3001", patientName: "Rajesh Kumar (62M)", sepsis: { score: 82, level: "Very High", trend: "rising" }, aki: { score: 68, level: "High", trend: "rising" }, vte: { score: 45, level: "Moderate", trend: "stable" }, fall: { score: 30, level: "Moderate", trend: "stable" }, pressure: { score: 55, level: "High", trend: "rising" }, readmission: { score: 35, level: "Moderate", trend: "stable" }, mortality: { score: 28, level: "Moderate", trend: "rising" }, overallRisk: "Very High" },
  { patientId: "P-3002", patientName: "Sunita Devi (45F)", sepsis: { score: 12, level: "Low", trend: "stable" }, aki: { score: 18, level: "Low", trend: "stable" }, vte: { score: 25, level: "Low", trend: "stable" }, fall: { score: 20, level: "Low", trend: "stable" }, pressure: { score: 15, level: "Low", trend: "stable" }, readmission: { score: 22, level: "Low", trend: "stable" }, mortality: { score: 5, level: "Very Low", trend: "stable" }, overallRisk: "Low" },
  { patientId: "P-3005", patientName: "Deepak Nair (62M)", sepsis: { score: 8, level: "Very Low", trend: "stable" }, aki: { score: 15, level: "Low", trend: "stable" }, vte: { score: 72, level: "High", trend: "rising" }, fall: { score: 55, level: "High", trend: "stable" }, pressure: { score: 48, level: "Moderate", trend: "stable" }, readmission: { score: 30, level: "Moderate", trend: "stable" }, mortality: { score: 8, level: "Very Low", trend: "stable" }, overallRisk: "High" },
  { patientId: "P-3007", patientName: "Mohammed Ali (55M)", sepsis: { score: 55, level: "High", trend: "rising" }, aki: { score: 42, level: "Moderate", trend: "rising" }, vte: { score: 35, level: "Moderate", trend: "stable" }, fall: { score: 40, level: "Moderate", trend: "stable" }, pressure: { score: 62, level: "High", trend: "rising" }, readmission: { score: 45, level: "Moderate", trend: "rising" }, mortality: { score: 38, level: "Moderate", trend: "rising" }, overallRisk: "High" },
];

export interface MedicationSafetyAlert {
  id: string; patientId: string; patientName: string;
  alertType: string; severity: AlertSeverity;
  medication1: string; medication2?: string;
  description: string; mechanism: string;
  clinicalSignificance: string; recommendedAction: string;
  evidenceLevel: EvidenceLevel; status: AlertStatus;
  timestamp: string;
}

export const MED_SAFETY_ALERTS: MedicationSafetyAlert[] = [
  { id: "MSA-001", patientId: "P-3002", patientName: "Sunita Devi", alertType: "Drug Interaction", severity: "High", medication1: "Warfarin 5mg", medication2: "Amiodarone 200mg", description: "Major interaction — CYP2C9 inhibition increases warfarin effect", mechanism: "Amiodarone inhibits CYP2C9, reducing warfarin metabolism by 30-50%", clinicalSignificance: "Increased bleeding risk. INR may rise to dangerous levels within 1-2 weeks.", recommendedAction: "Reduce warfarin dose 30-50%. Check INR in 3-5 days. Monitor for bleeding.", evidenceLevel: "Level A", status: "Active", timestamp: "2026-07-25T07:30:00" },
  { id: "MSA-002", patientId: "P-3001", patientName: "Rajesh Kumar", alertType: "Renal Dose", severity: "High", medication1: "Levofloxacin 750mg", description: "Dose adjustment required — CrCl 28 mL/min", mechanism: "Renal elimination. Accumulation risk with CrCl < 30. Seizure and QT prolongation risk.", clinicalSignificance: "Standard dose toxic in renal impairment. CNS toxicity and QTc prolongation.", recommendedAction: "Reduce to 250mg daily or switch to alternative. Monitor QTc. Drug levels.", evidenceLevel: "Level A", status: "Active", timestamp: "2026-07-25T08:30:00" },
  { id: "MSA-003", patientId: "P-3003", patientName: "Amit Joshi", alertType: "Allergy", severity: "Critical", medication1: "Amoxicillin 500mg", description: "Patient allergic to Penicillin — Cross-reactivity risk 10-15%", mechanism: "Beta-lactam cross-reactivity. Anaphylaxis risk.", clinicalSignificance: "Previous Penicillin allergy documented (rash). Cross-reactivity with Amoxicillin.", recommendedAction: "DO NOT ADMINISTER. Use Azithromycin or Fluoroquinolone alternative.", evidenceLevel: "Level A", status: "Resolved", timestamp: "2026-07-25T09:15:00" },
  { id: "MSA-004", patientId: "P-3006", patientName: "Kavitha Reddy", alertType: "Duplicate Therapy", severity: "Medium", medication1: "Lorazepam 1mg", medication2: "Diazepam 5mg", description: "Duplicate benzodiazepine therapy detected", mechanism: "Both are benzodiazepines. Additive CNS depression.", clinicalSignificance: "Excessive sedation, respiratory depression, falls risk.", recommendedAction: "Discontinue one benzodiazepine. Prefer Lorazepam for acute anxiety.", evidenceLevel: "Level B", status: "Acknowledged", timestamp: "2026-07-25T06:30:00" },
];

export interface DiagnosticRecommendation {
  id: string; patientId: string; patientName: string;
  presentingSymptoms: string[]; differentialDiagnoses: {
    diagnosis: string; probability: number; supportingFindings: string[];
    opposingFindings: string[]; icd10: string;
  }[];
  suggestedTests: { test: string; priority: string; rationale: string; }[];
  clinicalConfidence: number; evidenceSource: string;
}

export const DIAGNOSTIC_RECS: DiagnosticRecommendation[] = [
  { id: "DX-001", patientId: "P-3001", patientName: "Rajesh Kumar (62M)", presentingSymptoms: ["Fever 38.9°C", "Tachycardia HR 112", "Hypotension BP 88/52", "Elevated WBC 18,200", "Elevated Lactate 4.2", "Confusion"], differentialDiagnoses: [
    { diagnosis: "Septic Shock (UTI source)", probability: 85, supportingFindings: ["qSOFA 3", "Lactate > 4", "BP < 90/60", "RR > 22", "WBC > 12,000"], opposingFindings: ["No localizing signs on exam"], icd10: "R65.21" },
    { diagnosis: "Pneumonia with Sepsis", probability: 10, supportingFindings: ["Fever", "Tachycardia"], opposingFindings: ["Clear lung fields on exam", "No cough"], icd10: "J18.9" },
    { diagnosis: "Intra-abdominal Abscess", probability: 5, supportingFindings: ["Recent surgery", "Fever"], opposingFindings: ["No peritoneal signs", "Normal CT abdomen"], icd10: "K65.0" },
  ], suggestedTests: [
    { test: "Blood cultures × 2 (before antibiotics)", priority: "STAT", rationale: "Identify causative organism — Essential for targeted therapy" },
    { test: "Procalcitonin", priority: "STAT", rationale: "Distinguish bacterial sepsis from non-infectious inflammation" },
    { test: "ABG with Lactate", priority: "STAT", rationale: "Assess acid-base status and tissue perfusion" },
    { test: "Urine culture + sensitivity", priority: "Urgent", rationale: "UTI is most likely source in post-surgical patient" },
    { test: "CT Abdomen (if no improvement)", priority: "Routine", rationale: "Rule out intra-abdominal collection" },
  ], clinicalConfidence: 85, evidenceSource: "Surviving Sepsis Campaign 2021 + SIRS/qSOFA Criteria" },
];

export interface Guideline {
  id: string; title: string; specialty: string;
  summary: string; evidenceLevel: EvidenceLevel;
  version: string; lastUpdated: string;
  keyRecommendations: string[];
  references: string[];
  complianceRate: number;
}

export const CLINICAL_GUIDELINES: Guideline[] = [
  { id: "GL-001", title: "Sepsis Management — Surviving Sepsis Campaign", specialty: "Critical Care", summary: "Hour-1 bundle: Measure lactate, obtain blood cultures, administer broad-spectrum antibiotics, begin 30ml/kg crystalloid for hypotension or lactate ≥ 4.", evidenceLevel: "Level A", version: "2021", lastUpdated: "2024-06", keyRecommendations: ["Lactate measurement within 1 hour", "Blood cultures before antibiotics", "Broad-spectrum antibiotics within 1 hour", "30ml/kg crystalloid for hypotension", "Vasopressors if fluid-refractory hypotension", "Reassess volume status and tissue perfusion"], references: ["Evans L et al. Intensive Care Med 2021;47:1181-1247"], complianceRate: 78 },
  { id: "GL-002", title: "AKI Management — KDIGO Guidelines", specialty: "Nephrology", summary: "Staging-based approach: prevention, classification, management, and renal replacement therapy timing.", evidenceLevel: "Level A", version: "2024", lastUpdated: "2024-03", keyRecommendations: ["Volume optimization", "Avoid nephrotoxins", "Monitor creatinine and urine output", "Stage by KDIGO criteria", "Early nephrology referral for Stage 3", "RRT indications: refractory hyperkalemia, acidosis, overload"], references: ["KDIGO Clinical Practice Guidelines for AKI 2024"], complianceRate: 82 },
  { id: "GL-003", title: "VTE Prophylaxis — ACCP Guidelines", specialty: "Hematology", summary: "Risk-stratified approach using Caprini or Padua scores. LMWH preferred for medical patients.", evidenceLevel: "Level A", version: "2024", lastUpdated: "2024-01", keyRecommendations: ["Risk assessment on admission", "LMWH for high-risk medical patients", "Mechanical prophylaxis when pharmacological contraindicated", "Extended prophylaxis post-surgery (4 weeks for major ortho)", "Early ambulation"], references: ["Gould MK et al. Chest 2024;153:e1-e198"], complianceRate: 71 },
  { id: "GL-004", title: "Fall Prevention — AHRQ Toolkit", specialty: "Patient Safety", summary: "Multi-factorial intervention: assessment, environmental modification, medication review, exercise, and education.", evidenceLevel: "Level B", version: "2023", lastUpdated: "2023-09", keyRecommendations: ["Universal fall precautions", "Morse Fall Scale assessment", "Medication review (sedatives, antihypertensives)", "Environmental modifications", "Patient and family education", "Post-fall huddle"], references: ["AHRQ Patient Safety Network"], complianceRate: 68 },
];

export interface OrderSet {
  id: string; name: string; condition: string;
  category: string; orders: { name: string; type: string; details: string; }[];
  clinicalJustification: string; evidenceLevel: EvidenceLevel;
  complianceRate: number; usageCount: number;
}

export const ORDER_SETS: OrderSet[] = [
  { id: "OS-001", name: "Sepsis Bundle (Hour-1)", condition: "Sepsis / Septic Shock", category: "Emergency", orders: [
    { name: "Blood cultures × 2 sites", type: "Lab", details: "Before antibiotics. Aerobic + Anaerobic bottles." },
    { name: "Lactate Level", type: "Lab", details: "STAT. Repeat in 4-6 hours if initial > 2." },
    { name: "CBC with Differential", type: "Lab", details: "WBC, platelets, hemoglobin." },
    { name: "CMP + Coagulation", type: "Lab", details: "Creatinine, LFTs, PT/INR, aPTT." },
    { name: "Crystalloid 30ml/kg", type: "Infusion", details: "NS or LR. Administer within first 3 hours." },
    { name: "Broad-spectrum antibiotics", type: "Medication", details: "Meropenem 1g IV + Vancomycin 1g IV (adjust for weight/renal)." },
    { name: "Vasopressor if MAP < 65", type: "Medication", details: "Norepinephrine first-line. Target MAP ≥ 65 mmHg." },
    { name: "Reassess volume status", type: "Assessment", details: "Fluid responsiveness assessment q2h." },
  ], clinicalJustification: "Reduces sepsis mortality by 15-20% when implemented within 1 hour.", evidenceLevel: "Level A", complianceRate: 78, usageCount: 45 },
  { id: "OS-002", name: "Stroke Bundle — Acute Ischemic Stroke", condition: "Acute Ischemic Stroke", category: "Emergency", orders: [
    { name: "CT Head (non-contrast)", type: "Imaging", details: "STAT — Rule out hemorrhage before thrombolysis." },
    { name: "CBC, CMP, Coagulation, Glucose", type: "Lab", details: "STAT labs for tPA eligibility." },
    { name: "tPA (Alteplase) 0.9mg/kg", type: "Medication", details: "If within 4.5 hours and no contraindications. 10% bolus + 90% infusion." },
    { name: "BP Management", type: "Medication", details: "Labetalol if BP > 185/110 (pre-tPA) or > 180/105 (post-tPA)." },
    { name: "NPO until swallow screen", type: "Care", details: "Speech therapy swallow assessment within 24 hours." },
    { name: "DVT prophylaxis", type: "Medication", details: "SCDs + LMWH when safe (24h post-tPA)." },
  ], clinicalJustification: "Time-critical intervention. Door-to-needle < 60 minutes target. Reduces disability.", evidenceLevel: "Level A", complianceRate: 85, usageCount: 22 },
];

export interface PreventiveCare {
  id: string; patientId: string; patientName: string;
  age: number; gender: string;
  recommendations: { item: string; status: string; dueDate: string; priority: string; }[];
  vaccinations: { vaccine: string; status: string; lastDate: string; nextDue: string; }[];
  screenings: { type: string; status: string; lastDate: string; nextDue: string; }[];
}

export const PREVENTIVE_CARE: PreventiveCare[] = [
  { id: "PC-001", patientId: "P-3003", patientName: "Amit Joshi (35M)", age: 35, gender: "Male", recommendations: [
    { item: "HbA1c Screening", status: "Overdue", dueDate: "2026-01-25", priority: "High" },
    { item: "Lipid Profile", status: "Due", dueDate: "2026-07-25", priority: "Medium" },
    { item: "Blood Pressure Check", status: "Completed", dueDate: "2026-07-25", priority: "Routine" },
    { item: "BMI Assessment", status: "Completed", dueDate: "2026-07-25", priority: "Routine" },
  ], vaccinations: [
    { vaccine: "Influenza (Annual)", status: "Due", lastDate: "2025-10-15", nextDue: "2026-10" },
    { vaccine: "Tetanus Booster", status: "Current", lastDate: "2023-05-20", nextDue: "2033-05" },
  ], screenings: [
    { type: "Diabetes (HbA1c)", status: "Overdue", lastDate: "2025-07-25", nextDue: "2026-01-25" },
    { type: "Colorectal Cancer (if risk factors)", status: "Not Yet Due", lastDate: "N/A", nextDue: "2031" },
  ] },
];

export interface CareGap {
  id: string; patientId: string; patientName: string;
  gapType: string; description: string;
  priority: AlertSeverity; dueDate: string;
  linkedRecommendation: string; status: string;
}

export const CARE_GAPS: CareGap[] = [
  { id: "CG-001", patientId: "P-3003", patientName: "Amit Joshi", gapType: "Laboratory", description: "HbA1c not checked in 12 months", priority: "High", dueDate: "2026-01-25", linkedRecommendation: "ADA 2026 — Annual HbA1c for high-risk adults", status: "Pending" },
  { id: "CG-002", patientId: "P-3002", patientName: "Sunita Devi", gapType: "Documentation", description: "INR monitoring documentation incomplete", priority: "Medium", dueDate: "2026-07-25", linkedRecommendation: "Anticoagulation monitoring protocol", status: "Pending" },
  { id: "CG-003", patientId: "P-3005", patientName: "Deepak Nair", gapType: "Medication", description: "VTE prophylaxis not ordered post-surgery", priority: "High", dueDate: "2026-07-25", linkedRecommendation: "ACCP VTE Prophylaxis Guidelines", status: "Pending" },
  { id: "CG-004", patientId: "P-3006", patientName: "Kavitha Reddy", gapType: "Follow-up", description: "Psychiatry follow-up not scheduled after discharge planning", priority: "Medium", dueDate: "2026-08-01", linkedRecommendation: "Psychiatric discharge protocol", status: "Pending" },
];

export interface ClinicalPathway {
  id: string; condition: string; currentStage: PathwayStage;
  recommendedNextStep: string; deviations: string[];
  expectedOutcome: string; complianceRate: number;
  patientCount: number; status: string;
}

export const CLINICAL_PATHWAYS: ClinicalPathway[] = [
  { id: "CP-001", condition: "Sepsis / Septic Shock", currentStage: "Treatment", recommendedNextStep: "Reassess fluid responsiveness. Consider vasopressors if MAP < 65.", deviations: ["Delayed antibiotic administration (> 1 hour)", "Inadequate initial fluid resuscitation"], expectedOutcome: "Mortality < 25% with bundle compliance", complianceRate: 78, patientCount: 12, status: "Active" },
  { id: "CP-002", condition: "Acute Ischemic Stroke", currentStage: "Assessment", recommendedNextStep: "CT Head STAT. Assess tPA eligibility. Door-to-needle < 60 min.", deviations: ["Delayed CT scan", "BP not controlled pre-tPA"], expectedOutcome: "mRS 0-2 at 90 days in > 50%", complianceRate: 85, patientCount: 5, status: "Active" },
  { id: "CP-003", condition: "Acute MI (STEMI)", currentStage: "Treatment", recommendedStep: "Primary PCI within 90 minutes. Dual antiplatelet therapy.", deviations: ["Door-to-balloon time > 90 minutes"], expectedOutcome: "Door-to-balloon < 90 min in > 95%", complianceRate: 92, patientCount: 8, status: "Active" },
];

export interface EarlyWarningScore {
  patientId: string; patientName: string;
  news2: { score: number; level: string; trend: string; };
  mews: { score: number; level: string; };
  sofa: { score: number; level: string; };
  qsofa: { score: number; level: string; };
  pevs: { score: number; level: string; };
  escalation: string; rapidResponse: boolean;
}

export const EARLY_WARNING_SCORES: EarlyWarningScore[] = [
  { patientId: "P-3007", patientName: "Mohammed Ali (55M)", news2: { score: 8, level: "High Clinical Risk", trend: "rising" }, mews: { score: 6, level: "High" }, sofa: { score: 7, level: "Moderate" }, qsofa: { score: 2, level: "Positive" }, pevs: { score: 0, level: "N/A" }, escalation: "Urgent Senior Review", rapidResponse: true },
  { patientId: "P-3001", patientName: "Rajesh Kumar (62M)", news2: { score: 11, level: "High Clinical Risk", trend: "rising" }, mews: { score: 8, level: "Very High" }, sofa: { score: 9, level: "Severe" }, qsofa: { score: 3, level: "Positive" }, pevs: { score: 0, level: "N/A" }, escalation: "ICU Transfer Recommended", rapidResponse: true },
  { patientId: "P-3002", patientName: "Sunita Devi (45F)", news2: { score: 2, level: "Low Clinical Risk", trend: "stable" }, mews: { score: 1, level: "Low" }, sofa: { score: 0, level: "None" }, qsofa: { score: 0, level: "Negative" }, pevs: { score: 0, level: "N/A" }, escalation: "Routine Monitoring", rapidResponse: false },
  { patientId: "P-3005", patientName: "Deepak Nair (62M)", news2: { score: 3, level: "Low Clinical Risk", trend: "stable" }, mews: { score: 2, level: "Low" }, sofa: { score: 0, level: "None" }, qsofa: { score: 0, level: "Negative" }, pevs: { score: 0, level: "N/A" }, escalation: "Routine Monitoring", rapidResponse: false },
];

export interface OverrideRecord {
  id: string; alertId: string; patientName: string;
  alertTitle: string; clinician: string;
  overrideReason: string; timestamp: string;
  supervisorReview?: string; outcome: OverrideStatus;
  documentationNotes: string;
}

export const OVERRIDE_RECORDS: OverrideRecord[] = [
  { id: "OVR-001", alertId: "ALT-003", patientName: "Amit Joshi", alertTitle: "Care Gap — Diabetes Screening Overdue", clinician: "Dr. Priya Sharma", overrideReason: "Patient declining screening today. Will return next month.", timestamp: "2026-07-25T09:10:00", outcome: "Approved", documentationNotes: "Patient counselled on importance. Scheduled for next visit." },
  { id: "OVR-002", alertId: "ALT-005", patientName: "Deepak Nair", alertTitle: "VTE Risk — No prophylaxis", clinician: "Dr. Mohan Reddy", overrideReason: "High bleeding risk — recent surgery. Active oozing from surgical site.", timestamp: "2026-07-25T11:15:00", supervisorReview: "Dr. Rajesh Kumar (Chief)", outcome: "Approved", documentationNotes: "Bleeding risk outweighs VTE risk currently. Mechanical prophylaxis only. Reassess in 24 hours." },
];

export interface OutcomeRecord {
  id: string; recommendationType: string;
  accepted: number; overridden: number; notApplicable: number;
  clinicalOutcome: string; impact: string;
  period: string;
}

export const OUTCOME_RECORDS: OutcomeRecord[] = [
  { id: "OUT-001", recommendationType: "Sepsis Bundle", accepted: 38, overridden: 7, notApplicable: 0, clinicalOutcome: "Sepsis mortality reduced from 28% to 18%", impact: "High", period: "July 2026" },
  { id: "OUT-002", recommendationType: "VTE Prophylaxis", accepted: 52, overridden: 12, notApplicable: 3, clinicalOutcome: "VTE events reduced from 3.2% to 1.8%", impact: "Moderate", period: "July 2026" },
  { id: "OUT-003", recommendationType: "Medication Safety", accepted: 89, overridden: 11, notApplicable: 5, clinicalOutcome: "Medication errors reduced by 42%", impact: "High", period: "July 2026" },
  { id: "OUT-004", recommendationType: "Preventive Care", accepted: 65, overridden: 20, notApplicable: 10, clinicalOutcome: "Care gap closure rate improved from 60% to 72%", impact: "Moderate", period: "July 2026" },
];

export interface AuditEntry {
  id: string; timestamp: string; user: string;
  action: string; resource: string; details: string;
  severity: "Info" | "Warning" | "Critical";
}

export const AUDIT_LOGS: AuditEntry[] = [
  { id: "AUD-001", timestamp: "2026-07-25T08:15:00", user: "CDSS Engine", action: "Alert Generated", resource: "ALT-001", details: "Sepsis screening positive — Rajesh Kumar. qSOFA 3, Lactate 4.2.", severity: "Critical" },
  { id: "AUD-002", timestamp: "2026-07-25T08:20:00", user: "Dr. Rajesh Kumar", action: "Alert Acknowledged", resource: "ALT-001", details: "Sepsis alert acknowledged. Sepsis bundle initiated.", severity: "Info" },
  { id: "AUD-003", timestamp: "2026-07-25T07:30:00", user: "CDSS Engine", action: "Alert Generated", resource: "ALT-002", details: "Drug interaction — Warfarin + Amiodarone. CYP2C9 inhibition.", severity: "High" },
  { id: "AUD-004", timestamp: "2026-07-25T09:10:00", user: "Dr. Priya Sharma", action: "Override", resource: "ALT-003", details: "Diabetes screening override — Patient declined. Rescheduled.", severity: "Info" },
  { id: "AUD-005", timestamp: "2026-07-25T09:45:00", user: "CDSS Engine", action: "Escalation", resource: "ALT-007", details: "NEWS2 score 8 — Mohammed Ali. Urgent senior review triggered.", severity: "Critical" },
  { id: "AUD-006", timestamp: "2026-07-25T06:00:00", user: "Nurse Priya", action: "Acknowledged", resource: "ALT-006", details: "Fall risk precautions implemented for Kavitha Reddy.", severity: "Info" },
];

/* ── KPIs ─────────────────────────────────────────────────────────────────── */
export const CDSS_KPI = {
  activeAlerts: 8, criticalAlerts: 2, highAlerts: 3,
  pendingRecommendations: 12, acceptedToday: 35, overriddenToday: 5,
  overrideRate: 12.5, guidelineCompliance: 82,
  highRiskPatients: 4, sepsisScreens: 15, medSafetyChecks: 48,
  careGapsDetected: 4, careGapsClosed: 18,
  totalRecommendations: 280, acceptanceRate: 87.5,
};

/* ── Helpers ──────────────────────────────────────────────────────────────── */
export function alertSeverityTone(s: AlertSeverity): "success" | "warning" | "danger" | "info" {
  switch (s) { case "Critical": return "danger"; case "High": return "danger"; case "Medium": return "warning"; case "Low": return "info"; default: return "info"; }
}
export function alertStatusTone(s: AlertStatus): "success" | "warning" | "danger" | "info" {
  switch (s) { case "Accepted": case "Resolved": return "success"; case "Acknowledged": return "info"; case "Active": case "Pending": return "warning"; case "Overridden": case "Escalated": return "danger"; default: return "info"; }
}
export function riskLevelTone(r: RiskLevel): "success" | "warning" | "danger" | "info" {
  switch (r) { case "Very Low": return "success"; case "Low": return "success"; case "Moderate": return "warning"; case "High": return "danger"; case "Very High": return "danger"; default: return "info"; }
}
export function evidenceLevelTone(e: EvidenceLevel): "success" | "warning" | "info" {
  switch (e) { case "Level A": return "success"; case "Level B": return "info"; case "Level C": case "Expert Opinion": return "warning"; default: return "info"; }
}
export function overrideStatusTone(o: OverrideStatus): "success" | "warning" | "danger" | "info" {
  switch (o) { case "Approved": return "success"; case "Pending": case "Under Review": return "warning"; case "Rejected": return "danger"; default: return "info"; }
}
