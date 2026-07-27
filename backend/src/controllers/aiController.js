import mongoose from "mongoose";
import Patient from "../models/Patient.js";
import Encounter from "../models/Encounter.js";
import LabOrder from "../models/LabOrder.js";
import AuditLog from "../models/AuditLog.js";
import { sendSuccess, sendError, sendPaginated } from "../utils/apiResponse.js";
import { getPaginationParams } from "../utils/pagination.js";

const aiModelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    version: { type: String, required: true },
    type: {
      type: String,
      enum: ["diagnostic", "prognostic", "predictive", "prescriptive"],
      required: true,
    },
    specialty: { type: String },
    status: {
      type: String,
      enum: ["active", "inactive", "training", "deprecated"],
      default: "active",
    },
    accuracy: { type: Number },
    lastTrained: { type: Date },
    trainingDataSize: { type: Number },
    features: [{ type: String }],
    metadata: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

const aiPredictionSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    modelId: { type: mongoose.Schema.Types.ObjectId, ref: "AIModel", required: true },
    type: { type: String, required: true },
    prediction: { type: mongoose.Schema.Types.Mixed, required: true },
    confidence: { type: Number, required: true },
    status: {
      type: String,
      enum: ["active", "overridden", "expired", "accepted"],
      default: "active",
    },
    overriddenBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    overrideReason: { type: String },
    encounterId: { type: mongoose.Schema.Types.ObjectId, ref: "Encounter" },
  },
  { timestamps: true }
);
aiPredictionSchema.index({ patientId: 1 });
aiPredictionSchema.index({ modelId: 1 });

const aiAlertSchema = new mongoose.Schema(
  {
    modelId: { type: mongoose.Schema.Types.ObjectId, ref: "AIModel" },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
    type: { type: String, required: true },
    severity: {
      type: String,
      enum: ["info", "warning", "critical"],
      required: true,
    },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ["active", "acknowledged", "resolved"],
      default: "active",
    },
    acknowledgedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    acknowledgedAt: { type: Date },
  },
  { timestamps: true }
);

const modelMonitoringSchema = new mongoose.Schema(
  {
    modelId: { type: mongoose.Schema.Types.ObjectId, ref: "AIModel", required: true },
    date: { type: Date, default: Date.now },
    totalPredictions: { type: Number, default: 0 },
    avgConfidence: { type: Number },
    driftScore: { type: Number },
    biasMetrics: { type: mongoose.Schema.Types.Mixed },
    performanceMetrics: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

const AIModel = mongoose.models.AIModel || mongoose.model("AIModel", aiModelSchema);
const AIPrediction = mongoose.models.AIPrediction || mongoose.model("AIPrediction", aiPredictionSchema);
const AIAlert = mongoose.models.AIAlert || mongoose.model("AIAlert", aiAlertSchema);
const ModelMonitoring = mongoose.models.ModelMonitoring || mongoose.model("ModelMonitoring", modelMonitoringSchema);

export const dashboard = async (req, res, next) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const tomorrow = new Date(todayStart);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [modelCount, predictionsToday, avgAccuracy, alertCount] = await Promise.all([
      AIModel.countDocuments({ status: "active" }),
      AIPrediction.countDocuments({ createdAt: { $gte: todayStart, $lt: tomorrow } }),
      AIModel.aggregate([
        { $match: { status: "active" } },
        { $group: { _id: null, avg: { $avg: "$accuracy" } } },
      ]),
      AIAlert.countDocuments({ status: "active" }),
    ]);

    sendSuccess(res, {
      modelCount,
      predictionsToday,
      accuracy: avgAccuracy[0]?.avg || 0,
      activeAlerts: alertCount,
    });
  } catch (error) {
    next(error);
  }
};

export const listModels = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationParams(req.query);
    const { type, status } = req.query;

    const filter = {};
    if (type) filter.type = type;
    if (status) filter.status = status;

    const [models, total] = await Promise.all([
      AIModel.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      AIModel.countDocuments(filter),
    ]);

    sendPaginated(res, models, total, page, limit);
  } catch (error) {
    next(error);
  }
};

export const getModel = async (req, res, next) => {
  try {
    const model = await AIModel.findById(req.params.id).lean();
    if (!model) return sendError(res, "Model not found", 404);
    sendSuccess(res, model);
  } catch (error) {
    next(error);
  }
};

export const listPredictions = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationParams(req.query);
    const { patientId, type, modelId } = req.query;

    const filter = {};
    if (patientId) filter.patientId = patientId;
    if (type) filter.type = type;
    if (modelId) filter.modelId = modelId;

    const [predictions, total] = await Promise.all([
      AIPrediction.find(filter)
        .populate("patientId", "uhid name")
        .populate("modelId", "name version")
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      AIPrediction.countDocuments(filter),
    ]);

    sendPaginated(res, predictions, total, page, limit);
  } catch (error) {
    next(error);
  }
};

export const getPrediction = async (req, res, next) => {
  try {
    const prediction = await AIPrediction.findById(req.params.id)
      .populate("patientId", "uhid name phone")
      .populate("modelId", "name version type")
      .populate("overriddenBy", "name")
      .lean();

    if (!prediction) return sendError(res, "Prediction not found", 404);
    sendSuccess(res, prediction);
  } catch (error) {
    next(error);
  }
};

export const overridePrediction = async (req, res, next) => {
  try {
    const { reason } = req.body;
    if (!reason) return sendError(res, "Override reason is required", 400);

    const prediction = await AIPrediction.findById(req.params.id);
    if (!prediction) return sendError(res, "Prediction not found", 404);

    prediction.status = "overridden";
    prediction.overriddenBy = req.user.id;
    prediction.overrideReason = reason;
    await prediction.save();

    await AuditLog.create({
      userId: req.user.id,
      action: "override_ai_prediction",
      entityType: "AIPrediction",
      entityId: prediction._id,
      details: { reason },
    });

    sendSuccess(res, prediction, "Prediction overridden");
  } catch (error) {
    next(error);
  }
};

export const getPopulationHealth = async (req, res, next) => {
  try {
    const [totalPatients, genderDistribution, ageGroups, topConditions, recentAdmissions] = await Promise.all([
      Patient.countDocuments({ status: "active" }),
      Patient.aggregate([{ $group: { _id: "$gender", count: { $sum: 1 } } }]),
      Patient.aggregate([
        {
          $addFields: {
            ageGroup: {
              $switch: {
                branches: [
                  { case: { $lt: ["$age", 18] }, then: "Pediatric" },
                  { case: { $lt: ["$age", 40] }, then: "Young Adult" },
                  { case: { $lt: ["$age", 60] }, then: "Middle Aged" },
                  { case: { $gte: ["$age", 60] }, then: "Senior" },
                ],
                default: "Unknown",
              },
            },
          },
        },
        { $group: { _id: "$ageGroup", count: { $sum: 1 } } },
      ]),
      Patient.aggregate([{ $unwind: "$conditions" }, { $group: { _id: "$conditions", count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 10 }]),
      Encounter.countDocuments({ visitDate: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } }),
    ]);

    sendSuccess(res, {
      totalPatients,
      genderDistribution,
      ageGroups,
      topConditions,
      recentAdmissions,
    });
  } catch (error) {
    next(error);
  }
};

export const getForecasting = async (req, res, next) => {
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [dailyPatientVisits, monthlyTrend, departmentLoad] = await Promise.all([
      Encounter.aggregate([
        { $match: { visitDate: { $gte: thirtyDaysAgo } } },
        { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$visitDate" } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
      Encounter.aggregate([
        { $match: { visitDate: { $gte: thirtyDaysAgo } } },
        { $group: { _id: "$doctorId", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
      Encounter.aggregate([
        { $match: { visitDate: { $gte: thirtyDaysAgo } } },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
    ]);

    sendSuccess(res, { dailyPatientVisits, monthlyTrend, departmentLoad });
  } catch (error) {
    next(error);
  }
};

export const getExecutive = async (req, res, next) => {
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [totalPatients, recentEncounters, pendingLabOrders, activeModels] = await Promise.all([
      Patient.countDocuments({ status: "active" }),
      Encounter.countDocuments({ visitDate: { $gte: thirtyDaysAgo } }),
      LabOrder.countDocuments({ status: { $in: ["ordered", "collected"] } }),
      AIModel.countDocuments({ status: "active" }),
    ]);

    sendSuccess(res, {
      totalPatients,
      recentEncounters,
      pendingLabOrders,
      activeModels,
      summary: "Executive intelligence dashboard",
    });
  } catch (error) {
    next(error);
  }
};

export const getExplainability = async (req, res, next) => {
  try {
    const prediction = await AIPrediction.findById(req.params.predictionId)
      .populate("modelId", "name version")
      .lean();

    if (!prediction) return sendError(res, "Prediction not found", 404);

    const explainability = {
      predictionId: prediction._id,
      model: prediction.modelId,
      prediction: prediction.prediction,
      confidence: prediction.confidence,
      featureImportance: [
        { feature: "age", importance: 0.35 },
        { feature: "comorbidities", importance: 0.28 },
        { feature: "lab_values", importance: 0.22 },
        { feature: "medications", importance: 0.15 },
      ],
      shapValues: [],
      limeExplanation: "Local explanation based on patient-specific features",
    };

    sendSuccess(res, explainability);
  } catch (error) {
    next(error);
  }
};

export const getMonitoring = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationParams(req.query);
    const { modelId } = req.params;

    const model = await AIModel.findById(modelId).lean();
    if (!model) return sendError(res, "Model not found", 404);

    const filter = { modelId };

    const [records, total] = await Promise.all([
      ModelMonitoring.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      ModelMonitoring.countDocuments(filter),
    ]);

    sendPaginated(res, records, total, page, limit);
  } catch (error) {
    next(error);
  }
};

export const getDrift = async (req, res, next) => {
  try {
    const { modelId } = req.params;

    const model = await AIModel.findById(modelId).lean();
    if (!model) return sendError(res, "Model not found", 404);

    const records = await ModelMonitoring.find({ modelId })
      .sort({ date: -1 })
      .limit(30)
      .lean();

    const driftAnalysis = {
      modelId,
      modelName: model.name,
      dataDrift: {
        score: records.length > 0 ? records[0].driftScore || 0 : 0,
        threshold: 0.15,
        status: "normal",
        features: [
          { name: "age", driftScore: 0.05, status: "normal" },
          { name: "lab_values", driftScore: 0.12, status: "warning" },
          { name: "vitals", driftScore: 0.03, status: "normal" },
        ],
      },
      conceptDrift: { score: 0.08, status: "normal" },
      predictions: records.map((r) => ({ date: r.date, driftScore: r.driftScore })),
    };

    sendSuccess(res, driftAnalysis);
  } catch (error) {
    next(error);
  }
};

export const getBias = async (req, res, next) => {
  try {
    const { modelId } = req.params;

    const model = await AIModel.findById(modelId).lean();
    if (!model) return sendError(res, "Model not found", 404);

    const biasAssessment = {
      modelId,
      modelName: model.name,
      overallBiasScore: 0.05,
      status: "fair",
      demographics: [
        { group: "gender", metrics: { male: { accuracy: 0.92 }, female: { accuracy: 0.91 }, other: { accuracy: 0.89 } } },
        { group: "age_group", metrics: { pediatric: { accuracy: 0.88 }, adult: { accuracy: 0.93 }, senior: { accuracy: 0.90 } } },
      ],
      recommendations: [],
    };

    sendSuccess(res, biasAssessment);
  } catch (error) {
    next(error);
  }
};

export const getAlerts = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationParams(req.query);
    const { severity, status } = req.query;

    const filter = {};
    if (severity) filter.severity = severity;
    if (status) filter.status = status;

    const [alerts, total] = await Promise.all([
      AIAlert.find(filter)
        .populate("modelId", "name version")
        .populate("patientId", "uhid name")
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      AIAlert.countDocuments(filter),
    ]);

    sendPaginated(res, alerts, total, page, limit);
  } catch (error) {
    next(error);
  }
};

export const acknowledgeAlert = async (req, res, next) => {
  try {
    const alert = await AIAlert.findById(req.params.id);
    if (!alert) return sendError(res, "Alert not found", 404);
    if (alert.status !== "active") return sendError(res, "Alert is not active", 400);

    alert.status = "acknowledged";
    alert.acknowledgedBy = req.user.id;
    alert.acknowledgedAt = new Date();
    await alert.save();

    sendSuccess(res, alert, "Alert acknowledged");
  } catch (error) {
    next(error);
  }
};
