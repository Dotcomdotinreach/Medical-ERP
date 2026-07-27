import mongoose from "mongoose";
import ClinicalStudy from "../models/ClinicalStudy.js";
import Patient from "../models/Patient.js";
import AuditLog from "../models/AuditLog.js";
import { sendSuccess, sendError, sendPaginated } from "../utils/apiResponse.js";
import { getPaginationParams } from "../utils/pagination.js";

const researchSubjectSchema = new mongoose.Schema(
  {
    studyId: { type: mongoose.Schema.Types.ObjectId, ref: "ClinicalStudy", required: true },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    enrollmentDate: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["enrolled", "active", "completed", "withdrawn", "screen-failed"],
      default: "enrolled",
    },
    consentDate: { type: Date },
    consentVersion: { type: String },
    randomizationGroup: { type: String },
    enrolledBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);
researchSubjectSchema.index({ studyId: 1 });
researchSubjectSchema.index({ patientId: 1 });

const consentRecordSchema = new mongoose.Schema(
  {
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "ResearchSubject", required: true },
    version: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "signed", "withdrawn", "expired"],
      default: "pending",
    },
    signedDate: { type: Date },
    signedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    withdrawnDate: { type: Date },
    notes: { type: String },
  },
  { timestamps: true }
);

const adverseEventSchema = new mongoose.Schema(
  {
    studyId: { type: mongoose.Schema.Types.ObjectId, ref: "ClinicalStudy", required: true },
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "ResearchSubject", required: true },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    description: { type: String, required: true },
    severity: {
      type: String,
      enum: ["mild", "moderate", "severe", "life-threatening", "fatal"],
      required: true,
    },
    seriousness: {
      type: String,
      enum: ["hospitalization", "disability", "congenital", "death", "other"],
    },
    relatedToStudy: { type: Boolean, default: false },
    relatedToDrug: { type: Boolean, default: false },
    outcome: {
      type: String,
      enum: ["recovered", "recovering", "not-recovered", "fatal", "unknown"],
    },
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reportedDate: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["reported", "under-review", "confirmed", "rejected"],
      default: "reported",
    },
  },
  { timestamps: true }
);
adverseEventSchema.index({ studyId: 1 });

const ResearchSubject = mongoose.models.ResearchSubject || mongoose.model("ResearchSubject", researchSubjectSchema);
const ConsentRecord = mongoose.models.ConsentRecord || mongoose.model("ConsentRecord", consentRecordSchema);
const AdverseEvent = mongoose.models.AdverseEvent || mongoose.model("AdverseEvent", adverseEventSchema);

export const dashboard = async (req, res, next) => {
  try {
    const [activeStudies, totalEnrolled, pendingQueries] = await Promise.all([
      ClinicalStudy.countDocuments({ status: { $in: ["recruiting", "active"] } }),
      ResearchSubject.countDocuments({ status: { $in: ["enrolled", "active"] } }),
      AdverseEvent.countDocuments({ status: "reported" }),
    ]);

    sendSuccess(res, { activeStudies, totalEnrolled, pendingQueries });
  } catch (error) {
    next(error);
  }
};

export const listStudies = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationParams(req.query);
    const { status, phase } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (phase) filter.phase = phase;

    const [studies, total] = await Promise.all([
      ClinicalStudy.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      ClinicalStudy.countDocuments(filter),
    ]);

    sendPaginated(res, studies, total, page, limit);
  } catch (error) {
    next(error);
  }
};

export const createStudy = async (req, res, next) => {
  try {
    const { title, protocolNumber, phase, sponsor, principalInvestigator, startDate, targetEnrollment } = req.body;
    if (!title || !protocolNumber) return sendError(res, "title and protocolNumber are required", 400);

    const study = await ClinicalStudy.create({
      title,
      protocolNumber,
      phase,
      sponsor,
      principalInvestigator,
      startDate,
      targetEnrollment,
      status: "recruiting",
    });

    await AuditLog.create({
      userId: req.user.id,
      action: "create_study",
      entityType: "ClinicalStudy",
      entityId: study._id,
      details: { protocolNumber, title },
    });

    sendSuccess(res, study, "Study created", 201);
  } catch (error) {
    next(error);
  }
};

export const getStudy = async (req, res, next) => {
  try {
    const study = await ClinicalStudy.findById(req.params.id).lean();
    if (!study) return sendError(res, "Study not found", 404);

    const subjectCount = await ResearchSubject.countDocuments({ studyId: study._id, status: { $in: ["enrolled", "active"] } });

    sendSuccess(res, { ...study, currentEnrollment: subjectCount });
  } catch (error) {
    next(error);
  }
};

export const listSubjects = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationParams(req.query);
    const { status } = req.query;

    const filter = { studyId: req.params.id };
    if (status) filter.status = status;

    const [subjects, total] = await Promise.all([
      ResearchSubject.find(filter)
        .populate("patientId", "uhid name gender dob")
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      ResearchSubject.countDocuments(filter),
    ]);

    sendPaginated(res, subjects, total, page, limit);
  } catch (error) {
    next(error);
  }
};

export const enrollSubject = async (req, res, next) => {
  try {
    const { patientId, consentVersion } = req.body;
    if (!patientId) return sendError(res, "patientId is required", 400);

    const patient = await Patient.findById(patientId).lean();
    if (!patient) return sendError(res, "Patient not found", 404);

    const existing = await ResearchSubject.findOne({
      studyId: req.params.id,
      patientId,
      status: { $nin: ["screen-failed", "withdrawn"] },
    });
    if (existing) return sendError(res, "Patient already enrolled in this study", 409);

    const subject = await ResearchSubject.create({
      studyId: req.params.id,
      patientId,
      consentDate: new Date(),
      consentVersion: consentVersion || "1.0",
      enrolledBy: req.user.id,
    });

    await ConsentRecord.create({
      subjectId: subject._id,
      version: consentVersion || "1.0",
      status: "signed",
      signedDate: new Date(),
      signedBy: req.user.id,
    });

    await ClinicalStudy.findByIdAndUpdate(req.params.id, { $inc: { enrolled: 1 } });

    sendSuccess(res, subject, "Subject enrolled", 201);
  } catch (error) {
    next(error);
  }
};

export const getConsent = async (req, res, next) => {
  try {
    const records = await ConsentRecord.find({ subjectId: req.params.id })
      .populate("signedBy", "name")
      .sort({ createdAt: -1 })
      .lean();

    sendSuccess(res, records);
  } catch (error) {
    next(error);
  }
};

export const listAdverseEvents = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationParams(req.query);
    const { studyId, severity, status } = req.query;

    const filter = {};
    if (studyId) filter.studyId = studyId;
    if (severity) filter.severity = severity;
    if (status) filter.status = status;

    const [events, total] = await Promise.all([
      AdverseEvent.find(filter)
        .populate("studyId", "title protocolNumber")
        .populate("patientId", "uhid name")
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      AdverseEvent.countDocuments(filter),
    ]);

    sendPaginated(res, events, total, page, limit);
  } catch (error) {
    next(error);
  }
};

export const reportAE = async (req, res, next) => {
  try {
    const { studyId, subjectId, patientId, description, severity, seriousness, relatedToStudy, relatedToDrug } = req.body;
    if (!studyId || !subjectId || !patientId || !description || !severity) {
      return sendError(res, "studyId, subjectId, patientId, description, and severity are required", 400);
    }

    const event = await AdverseEvent.create({
      studyId,
      subjectId,
      patientId,
      description,
      severity,
      seriousness,
      relatedToStudy,
      relatedToDrug,
      reportedBy: req.user.id,
    });

    await AuditLog.create({
      userId: req.user.id,
      action: "report_adverse_event",
      entityType: "AdverseEvent",
      entityId: event._id,
      details: { studyId, severity },
    });

    sendSuccess(res, event, "Adverse event reported", 201);
  } catch (error) {
    next(error);
  }
};

export const getAnalytics = async (req, res, next) => {
  try {
    const [totalStudies, studiesByPhase, studiesByStatus, subjectsByStudy, adverseEventsBySeverity] = await Promise.all([
      ClinicalStudy.countDocuments(),
      ClinicalStudy.aggregate([{ $group: { _id: "$phase", count: { $sum: 1 } } }]),
      ClinicalStudy.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
      ResearchSubject.aggregate([
        { $group: { _id: "$studyId", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
      AdverseEvent.aggregate([{ $group: { _id: "$severity", count: { $sum: 1 } } }]),
    ]);

    sendSuccess(res, {
      totalStudies,
      studiesByPhase,
      studiesByStatus,
      subjectsByStudy,
      adverseEventsBySeverity,
    });
  } catch (error) {
    next(error);
  }
};
