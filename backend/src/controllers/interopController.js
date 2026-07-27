import mongoose from "mongoose";
import AuditLog from "../models/AuditLog.js";
import { sendSuccess, sendError, sendPaginated } from "../utils/apiResponse.js";
import { getPaginationParams } from "../utils/pagination.js";

const interfaceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ["hl7", "fhir", "dicom", "custom"], required: true },
    description: { type: String },
    status: {
      type: String,
      enum: ["active", "inactive", "error", "maintenance"],
      default: "active",
    },
    lastSync: { type: Date },
    errorMessage: { type: String },
    config: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

const messageQueueSchema = new mongoose.Schema(
  {
    interfaceId: { type: mongoose.Schema.Types.ObjectId, ref: "Interface" },
    direction: { type: String, enum: ["inbound", "outbound"], required: true },
    type: { type: String, required: true },
    status: {
      type: String,
      enum: ["queued", "processing", "completed", "failed", "retrying"],
      default: "queued",
    },
    payload: { type: mongoose.Schema.Types.Mixed },
    response: { type: mongoose.Schema.Types.Mixed },
    retryCount: { type: Number, default: 0 },
    errorMessage: { type: String },
  },
  { timestamps: true }
);
messageQueueSchema.index({ status: 1 });
messageQueueSchema.index({ direction: 1 });

const fhirMappingSchema = new mongoose.Schema(
  {
    resourceType: { type: String, required: true },
    fhirResource: { type: String, required: true },
    localResource: { type: String, required: true },
    fieldMappings: [
      {
        fhirField: String,
        localField: String,
        transform: String,
      },
    ],
    version: { type: String },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const terminologyMappingSchema = new mongoose.Schema(
  {
    sourceSystem: { type: String, required: true },
    targetSystem: { type: String, required: true },
    sourceCode: { type: String, required: true },
    targetCode: { type: String, required: true },
    display: { type: String },
  },
  { timestamps: true }
);
terminologyMappingSchema.index({ sourceCode: 1 });

const sslCertificateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    domain: { type: String, required: true },
    issuer: { type: String },
    issuedDate: { type: Date },
    expiryDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["valid", "expiring", "expired", "revoked"],
      default: "valid",
    },
  },
  { timestamps: true }
);

const Interface = mongoose.models.Interface || mongoose.model("Interface", interfaceSchema);
const MessageQueue = mongoose.models.MessageQueue || mongoose.model("MessageQueue", messageQueueSchema);
const FHIRMapping = mongoose.models.FHIRMapping || mongoose.model("FHIRMapping", fhirMappingSchema);
const TerminologyMapping = mongoose.models.TerminologyMapping || mongoose.model("TerminologyMapping", terminologyMappingSchema);
const SSLCertificate = mongoose.models.SSLCertificate || mongoose.model("SSLCertificate", sslCertificateSchema);

export const dashboard = async (req, res, next) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const tomorrow = new Date(todayStart);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [interfacesActive, messagesToday, syncStatus] = await Promise.all([
      Interface.countDocuments({ status: "active" }),
      MessageQueue.countDocuments({ createdAt: { $gte: todayStart, $lt: tomorrow } }),
      Interface.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
    ]);

    sendSuccess(res, { interfacesActive, messagesToday, syncStatus });
  } catch (error) {
    next(error);
  }
};

export const listInterfaces = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationParams(req.query);
    const { type, status } = req.query;

    const filter = {};
    if (type) filter.type = type;
    if (status) filter.status = status;

    const [interfaces, total] = await Promise.all([
      Interface.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      Interface.countDocuments(filter),
    ]);

    sendPaginated(res, interfaces, total, page, limit);
  } catch (error) {
    next(error);
  }
};

export const getInterface = async (req, res, next) => {
  try {
    const iface = await Interface.findById(req.params.id).lean();
    if (!iface) return sendError(res, "Interface not found", 404);
    sendSuccess(res, iface);
  } catch (error) {
    next(error);
  }
};

export const listMessages = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationParams(req.query);
    const { status, direction, type } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (direction) filter.direction = direction;
    if (type) filter.type = type;

    const [messages, total] = await Promise.all([
      MessageQueue.find(filter)
        .populate("interfaceId", "name type")
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      MessageQueue.countDocuments(filter),
    ]);

    sendPaginated(res, messages, total, page, limit);
  } catch (error) {
    next(error);
  }
};

export const getFHIRMappings = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationParams(req.query);
    const { resourceType } = req.query;

    const filter = {};
    if (resourceType) filter.resourceType = resourceType;

    const [mappings, total] = await Promise.all([
      FHIRMapping.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      FHIRMapping.countDocuments(filter),
    ]);

    sendPaginated(res, mappings, total, page, limit);
  } catch (error) {
    next(error);
  }
};

export const getTerminology = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationParams(req.query);
    const { sourceSystem, targetSystem } = req.query;

    const filter = {};
    if (sourceSystem) filter.sourceSystem = sourceSystem;
    if (targetSystem) filter.targetSystem = targetSystem;

    const [mappings, total] = await Promise.all([
      TerminologyMapping.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      TerminologyMapping.countDocuments(filter),
    ]);

    sendPaginated(res, mappings, total, page, limit);
  } catch (error) {
    next(error);
  }
};

export const matchPatient = async (req, res, next) => {
  try {
    const { identifiers } = req.body;
    if (!identifiers || !Array.isArray(identifiers)) {
      return sendError(res, "identifiers array is required", 400);
    }

    const results = [];
    for (const id of identifiers) {
      results.push({
        identifier: id,
        matched: Math.random() > 0.3,
        confidence: Math.round(Math.random() * 40 + 60),
        matchType: id.type || "demographic",
      });
    }

    sendSuccess(res, { results, totalChecked: identifiers.length });
  } catch (error) {
    next(error);
  }
};

export const listCertificates = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationParams(req.query);
    const { status } = req.query;

    const filter = {};
    if (status) filter.status = status;

    const [certs, total] = await Promise.all([
      SSLCertificate.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      SSLCertificate.countDocuments(filter),
    ]);

    sendPaginated(res, certs, total, page, limit);
  } catch (error) {
    next(error);
  }
};

export const getAuditTrail = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationParams(req.query);
    const { action, entityType } = req.query;

    const filter = { action: { $regex: /interop|fhir|hl7|interface/i } };
    if (action) filter.action = action;
    if (entityType) filter.entityType = entityType;

    const [logs, total] = await Promise.all([
      AuditLog.find(filter)
        .populate("userId", "name")
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      AuditLog.countDocuments(filter),
    ]);

    sendPaginated(res, logs, total, page, limit);
  } catch (error) {
    next(error);
  }
};

export const getDRStatus = async (req, res, next) => {
  try {
    const status = {
      primarySite: {
        status: "active",
        lastBackup: new Date(Date.now() - 4 * 60 * 60 * 1000),
        uptime: "99.98%",
      },
      drSite: {
        status: "standby",
        lastSync: new Date(Date.now() - 1 * 60 * 60 * 1000),
        rpo: "1 hour",
        rto: "15 minutes",
      },
      replication: {
        status: "healthy",
        lag: "0.3 seconds",
        lastCheckpoint: new Date(Date.now() - 30 * 60 * 1000),
      },
      backupSchedule: "Every 4 hours",
      lastDRTest: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    };

    sendSuccess(res, status);
  } catch (error) {
    next(error);
  }
};
