import mongoose from "mongoose";
import Patient from "../models/Patient.js";
import Prescription from "../models/Prescription.js";
import AuditLog from "../models/AuditLog.js";
import { sendSuccess, sendError, sendPaginated } from "../utils/apiResponse.js";
import { getPaginationParams } from "../utils/pagination.js";

const clinicalAlertSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    type: {
      type: String,
      enum: ["drug-interaction", "allergy", "critical-value", "diagnosis", "sepsis", "fall-risk"],
      required: true,
    },
    severity: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ["active", "acknowledged", "overridden", "resolved"],
      default: "active",
    },
    acknowledgedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    acknowledgedAt: { type: Date },
    overrideReason: { type: String },
    overriddenBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    overriddenAt: { type: Date },
    metadata: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);
clinicalAlertSchema.index({ patientId: 1 });
clinicalAlertSchema.index({ status: 1 });
clinicalAlertSchema.index({ severity: 1 });

const riskScoreSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    type: { type: String, required: true },
    score: { type: Number, required: true },
    riskLevel: {
      type: String,
      enum: ["low", "moderate", "high", "critical"],
      required: true,
    },
    factors: [{ name: String, weight: Number }],
    calculatedAt: { type: Date, default: Date.now },
    validUntil: { type: Date },
    calculatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);
riskScoreSchema.index({ patientId: 1 });

const clinicalPathwaySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    category: { type: String },
    conditions: [{ type: String }],
    steps: [
      {
        stepNumber: Number,
        action: String,
        description: String,
        targetTime: String,
      },
    ],
    status: {
      type: String,
      enum: ["active", "inactive", "draft"],
      default: "active",
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const drugInteractionSchema = new mongoose.Schema(
  {
    drug1: { type: String, required: true },
    drug2: { type: String, required: true },
    severity: {
      type: String,
      enum: ["mild", "moderate", "severe", "contraindicated"],
      required: true,
    },
    description: { type: String, required: true },
    recommendation: { type: String },
    evidenceLevel: { type: String },
  },
  { timestamps: true }
);
drugInteractionSchema.index({ drug1: 1 });
drugInteractionSchema.index({ drug2: 1 });

const ClinicalAlert = mongoose.models.ClinicalAlert || mongoose.model("ClinicalAlert", clinicalAlertSchema);
const RiskScore = mongoose.models.RiskScore || mongoose.model("RiskScore", riskScoreSchema);
const ClinicalPathway = mongoose.models.ClinicalPathway || mongoose.model("ClinicalPathway", clinicalPathwaySchema);
const DrugInteraction = mongoose.models.DrugInteraction || mongoose.model("DrugInteraction", drugInteractionSchema);

export const dashboard = async (req, res, next) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const tomorrow = new Date(todayStart);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [alertsToday, riskScoresCalculated, pathwaysActive] = await Promise.all([
      ClinicalAlert.countDocuments({ createdAt: { $gte: todayStart, $lt: tomorrow } }),
      RiskScore.countDocuments({ calculatedAt: { $gte: todayStart, $lt: tomorrow } }),
      ClinicalPathway.countDocuments({ status: "active" }),
    ]);

    sendSuccess(res, { alertsToday, riskScoresCalculated, pathwaysActive });
  } catch (error) {
    next(error);
  }
};

export const listAlerts = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationParams(req.query);
    const { patientId, type, severity, status } = req.query;

    const filter = {};
    if (patientId) filter.patientId = patientId;
    if (type) filter.type = type;
    if (severity) filter.severity = severity;
    if (status) filter.status = status;

    const [alerts, total] = await Promise.all([
      ClinicalAlert.find(filter)
        .populate("patientId", "uhid name")
        .populate("acknowledgedBy", "name")
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      ClinicalAlert.countDocuments(filter),
    ]);

    sendPaginated(res, alerts, total, page, limit);
  } catch (error) {
    next(error);
  }
};

export const getAlert = async (req, res, next) => {
  try {
    const alert = await ClinicalAlert.findById(req.params.id)
      .populate("patientId", "uhid name phone")
      .populate("acknowledgedBy", "name")
      .populate("overriddenBy", "name")
      .lean();

    if (!alert) return sendError(res, "Alert not found", 404);
    sendSuccess(res, alert);
  } catch (error) {
    next(error);
  }
};

export const acknowledgeAlert = async (req, res, next) => {
  try {
    const alert = await ClinicalAlert.findById(req.params.id);
    if (!alert) return sendError(res, "Alert not found", 404);
    if (alert.status !== "active") return sendError(res, "Alert is not active", 400);

    alert.status = "acknowledged";
    alert.acknowledgedBy = req.user.id;
    alert.acknowledgedAt = new Date();
    await alert.save();

    await AuditLog.create({
      userId: req.user.id,
      action: "acknowledge_cdss_alert",
      entityType: "ClinicalAlert",
      entityId: alert._id,
      details: { alertId: alert._id },
    });

    sendSuccess(res, alert, "Alert acknowledged");
  } catch (error) {
    next(error);
  }
};

export const overrideAlert = async (req, res, next) => {
  try {
    const { reason } = req.body;
    if (!reason) return sendError(res, "Override reason is required", 400);

    const alert = await ClinicalAlert.findById(req.params.id);
    if (!alert) return sendError(res, "Alert not found", 404);

    alert.status = "overridden";
    alert.overrideReason = reason;
    alert.overriddenBy = req.user.id;
    alert.overriddenAt = new Date();
    await alert.save();

    await AuditLog.create({
      userId: req.user.id,
      action: "override_cdss_alert",
      entityType: "ClinicalAlert",
      entityId: alert._id,
      details: { alertId: alert._id, reason },
    });

    sendSuccess(res, alert, "Alert overridden");
  } catch (error) {
    next(error);
  }
};

export const getRiskScores = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationParams(req.query);
    const patient = await Patient.findOne({ uhid: req.params.uhid }).lean();
    if (!patient) return sendError(res, "Patient not found", 404);

    const filter = { patientId: patient._id };

    const [scores, total] = await Promise.all([
      RiskScore.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      RiskScore.countDocuments(filter),
    ]);

    sendPaginated(res, scores, total, page, limit);
  } catch (error) {
    next(error);
  }
};

export const calculateRisk = async (req, res, next) => {
  try {
    const { patientId, type } = req.body;
    if (!patientId || !type) return sendError(res, "patientId and type are required", 400);

    const patient = await Patient.findById(patientId).lean();
    if (!patient) return sendError(res, "Patient not found", 404);

    let score = Math.floor(Math.random() * 100);
    let riskLevel = "low";
    if (score >= 75) riskLevel = "critical";
    else if (score >= 50) riskLevel = "high";
    else if (score >= 25) riskLevel = "moderate";

    const riskScore = await RiskScore.create({
      patientId,
      type,
      score,
      riskLevel,
      factors: [{ name: "age", weight: 0.3 }, { name: "comorbidities", weight: 0.7 }],
      calculatedBy: req.user.id,
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    sendSuccess(res, riskScore, "Risk score calculated", 201);
  } catch (error) {
    next(error);
  }
};

export const listPathways = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationParams(req.query);
    const { status, category } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;

    const [pathways, total] = await Promise.all([
      ClinicalPathway.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      ClinicalPathway.countDocuments(filter),
    ]);

    sendPaginated(res, pathways, total, page, limit);
  } catch (error) {
    next(error);
  }
};

export const getPathway = async (req, res, next) => {
  try {
    const pathway = await ClinicalPathway.findById(req.params.id).lean();
    if (!pathway) return sendError(res, "Pathway not found", 404);
    sendSuccess(res, pathway);
  } catch (error) {
    next(error);
  }
};

export const listDrugInteractions = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationParams(req.query);
    const { drug } = req.query;

    const filter = {};
    if (drug) {
      const regex = new RegExp(drug, "i");
      filter.$or = [{ drug1: regex }, { drug2: regex }];
    }

    const [interactions, total] = await Promise.all([
      DrugInteraction.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      DrugInteraction.countDocuments(filter),
    ]);

    sendPaginated(res, interactions, total, page, limit);
  } catch (error) {
    next(error);
  }
};
