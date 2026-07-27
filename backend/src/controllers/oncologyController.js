import mongoose from "mongoose";
import Patient from "../models/Patient.js";
import { sendSuccess, sendError, sendPaginated } from "../utils/apiResponse.js";
import { getPaginationParams } from "../utils/pagination.js";

const stagingSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    uhid: { type: String, required: true },
    cancerType: { type: String, required: true },
    histology: { type: String },
    site: { type: String },
    tStage: { type: String },
    nStage: { type: String },
    mStage: { type: String },
    overallStage: { type: String },
    diagnosedDate: { type: Date },
    recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const treatmentPlanSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    uhid: { type: String, required: true },
    planName: { type: String, required: true },
    intent: { type: String },
    cycles: { type: Number },
    startDate: { type: Date },
    endDate: { type: Date },
    status: { type: String, enum: ["Active", "Completed", "On Hold", "Cancelled"], default: "Active" },
    notes: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const tumorBoardSchema = new mongoose.Schema(
  {
    meetingDate: { type: Date, required: true },
    agenda: { type: String },
    patientUhids: [{ type: String }],
    participants: [{ type: String }],
    outcome: { type: String },
    status: { type: String, enum: ["Scheduled", "Completed", "Cancelled"], default: "Scheduled" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const chemoProtocolSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    code: { type: String },
    indication: { type: String },
    drugs: [{ name: String, dose: String, route: String, day: String }],
    cycles: { type: Number },
    cycleDuration: { type: String },
    status: { type: String, enum: ["Active", "Deprecated"], default: "Active" },
  },
  { timestamps: true }
);

const infusionSessionSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    uhid: { type: String, required: true },
    protocolName: { type: String },
    cycleNumber: { type: Number },
    startTime: { type: Date },
    endTime: { type: Date },
    status: { type: String, enum: ["Scheduled", "In Progress", "Completed", "Cancelled"], default: "Scheduled" },
    nurseId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    notes: { type: String },
  },
  { timestamps: true }
);

const toxicitySchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    uhid: { type: String, required: true },
    assessmentDate: { type: Date, default: Date.now },
    grade: { type: Number },
    symptom: { type: String },
    system: { type: String },
    management: { type: String },
    recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const responseSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    uhid: { type: String, required: true },
    assessmentDate: { type: Date, default: Date.now },
    criteria: { type: String },
    response: { type: String },
    imagingDate: { type: Date },
    notes: { type: String },
    recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const screeningSchema = new mongoose.Schema(
  {
    programName: { type: String, required: true },
    cancerType: { type: String },
    targetPopulation: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    totalScreened: { type: Number, default: 0 },
    positives: { type: Number, default: 0 },
    status: { type: String, enum: ["Active", "Completed", "Upcoming"], default: "Active" },
  },
  { timestamps: true }
);

const palliativeSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    uhid: { type: String, required: true },
    carePlan: { type: String },
    painScore: { type: Number },
    symptomManagement: { type: String },
    goalsOfCare: { type: String },
    familyMeeting: { type: Date },
    status: { type: String, enum: ["Active", "Discharged", "Deceased"], default: "Active" },
    recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Staging = mongoose.models.Staging || mongoose.model("Staging", stagingSchema);
const TreatmentPlan = mongoose.models.TreatmentPlan || mongoose.model("TreatmentPlan", treatmentPlanSchema);
const TumorBoard = mongoose.models.TumorBoard || mongoose.model("TumorBoard", tumorBoardSchema);
const ChemoProtocol = mongoose.models.ChemoProtocol || mongoose.model("ChemoProtocol", chemoProtocolSchema);
const InfusionSession = mongoose.models.InfusionSession || mongoose.model("InfusionSession", infusionSessionSchema);
const Toxicity = mongoose.models.Toxicity || mongoose.model("Toxicity", toxicitySchema);
const ResponseAssessment = mongoose.models.ResponseAssessment || mongoose.model("ResponseAssessment", responseSchema);
const Screening = mongoose.models.Screening || mongoose.model("Screening", screeningSchema);
const Palliative = mongoose.models.Palliative || mongoose.model("Palliative", palliativeSchema);

export const dashboard = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [activePatients, todayInfusions, pendingBoards] = await Promise.all([
      Patient.countDocuments({ conditions: "Oncology", status: "active" }),
      InfusionSession.countDocuments({ startTime: { $gte: today, $lt: tomorrow } }),
      TumorBoard.countDocuments({ status: "Scheduled" }),
    ]);

    sendSuccess(res, { activePatients, todayInfusions, pendingBoards });
  } catch (error) {
    next(error);
  }
};

export const listPatients = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationParams(req.query);

    const filter = { conditions: "Oncology" };
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: "i" } },
        { uhid: { $regex: req.query.search, $options: "i" } },
      ];
    }

    if (req.query.cancerType) {
      const stagingUhids = await Staging.find({ cancerType: req.query.cancerType }).distinct("uhid");
      filter.uhid = { $in: stagingUhids };
    }

    if (req.query.stage) {
      const stagingUhids = await Staging.find({ overallStage: req.query.stage }).distinct("uhid");
      filter.uhid = filter.uhid
        ? { $in: filter.uhid.$in.filter((u) => stagingUhids.includes(u)) }
        : { $in: stagingUhids };
    }

    const [patients, total] = await Promise.all([
      Patient.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      Patient.countDocuments(filter),
    ]);

    sendPaginated(res, patients, total, page, limit);
  } catch (error) {
    next(error);
  }
};

export const getPatient = async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.params.id).lean();
    if (!patient) return sendError(res, "Patient not found", 404);

    const [staging, treatmentPlan] = await Promise.all([
      Staging.findOne({ uhid: patient.uhid }).sort("-createdAt").lean(),
      TreatmentPlan.findOne({ uhid: patient.uhid, status: "Active" }).lean(),
    ]);

    sendSuccess(res, { patient, staging, treatmentPlan });
  } catch (error) {
    next(error);
  }
};

export const getStaging = async (req, res, next) => {
  try {
    const { uhid } = req.params;
    const records = await Staging.find({ uhid }).sort("-createdAt").lean();
    sendSuccess(res, records);
  } catch (error) {
    next(error);
  }
};

export const getTreatmentPlan = async (req, res, next) => {
  try {
    const { uhid } = req.params;
    const plans = await TreatmentPlan.find({ uhid }).sort("-createdAt").lean();
    sendSuccess(res, plans);
  } catch (error) {
    next(error);
  }
};

export const createTreatmentPlan = async (req, res, next) => {
  try {
    const { uhid, planName, intent, cycles, startDate, endDate, notes } = req.body;

    if (!uhid || !planName) return sendError(res, "UHID and plan name are required", 400);

    const patient = await Patient.findOne({ uhid }).lean();
    if (!patient) return sendError(res, "Patient not found", 404);

    const plan = await TreatmentPlan.create({
      patientId: patient._id,
      uhid,
      planName,
      intent,
      cycles,
      startDate,
      endDate,
      notes,
      createdBy: req.user.id,
    });

    sendSuccess(res, plan, "Treatment plan created", 201);
  } catch (error) {
    next(error);
  }
};

export const listTumorBoards = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationParams(req.query);

    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const [boards, total] = await Promise.all([
      TumorBoard.find(filter).sort(sort || "-meetingDate").skip(skip).limit(limit).lean(),
      TumorBoard.countDocuments(filter),
    ]);

    sendPaginated(res, boards, total, page, limit);
  } catch (error) {
    next(error);
  }
};

export const scheduleTumorBoard = async (req, res, next) => {
  try {
    const { meetingDate, agenda, patientUhids, participants, outcome } = req.body;

    if (!meetingDate) return sendError(res, "Meeting date is required", 400);

    const board = await TumorBoard.create({
      meetingDate,
      agenda,
      patientUhids,
      participants,
      outcome,
      createdBy: req.user.id,
    });

    sendSuccess(res, board, "Tumor board scheduled", 201);
  } catch (error) {
    next(error);
  }
};

export const getChemoProtocols = async (req, res, next) => {
  try {
    const protocols = await ChemoProtocol.find({ status: "Active" }).lean();
    sendSuccess(res, protocols);
  } catch (error) {
    next(error);
  }
};

export const listInfusionSessions = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const filter = { startTime: { $gte: today, $lt: tomorrow } };
    if (req.query.status) filter.status = req.query.status;

    const sessions = await InfusionSession.find(filter)
      .populate("patientId", "uhid name phone")
      .sort("startTime")
      .lean();

    sendSuccess(res, sessions);
  } catch (error) {
    next(error);
  }
};

export const startInfusion = async (req, res, next) => {
  try {
    const { uhid, protocolName, cycleNumber, nurseId } = req.body;

    if (!uhid) return sendError(res, "UHID is required", 400);

    const patient = await Patient.findOne({ uhid }).lean();
    if (!patient) return sendError(res, "Patient not found", 404);

    const session = await InfusionSession.create({
      patientId: patient._id,
      uhid,
      protocolName,
      cycleNumber,
      startTime: new Date(),
      status: "In Progress",
      nurseId,
    });

    sendSuccess(res, session, "Infusion started", 201);
  } catch (error) {
    next(error);
  }
};

export const getToxicity = async (req, res, next) => {
  try {
    const { uhid } = req.params;
    const records = await Toxicity.find({ uhid }).sort("-assessmentDate").lean();
    sendSuccess(res, records);
  } catch (error) {
    next(error);
  }
};

export const getResponse = async (req, res, next) => {
  try {
    const { uhid } = req.params;
    const records = await ResponseAssessment.find({ uhid }).sort("-assessmentDate").lean();
    sendSuccess(res, records);
  } catch (error) {
    next(error);
  }
};

export const listScreening = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationParams(req.query);

    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.cancerType) filter.cancerType = req.query.cancerType;

    const [programs, total] = await Promise.all([
      Screening.find(filter).sort(sort || "-startDate").skip(skip).limit(limit).lean(),
      Screening.countDocuments(filter),
    ]);

    sendPaginated(res, programs, total, page, limit);
  } catch (error) {
    next(error);
  }
};

export const getPalliative = async (req, res, next) => {
  try {
    const { uhid } = req.params;
    const records = await Palliative.find({ uhid }).sort("-createdAt").lean();
    sendSuccess(res, records);
  } catch (error) {
    next(error);
  }
};

export const getAnalytics = async (req, res, next) => {
  try {
    const [cancerTypeDistribution, stageDistribution, treatmentOutcomes] = await Promise.all([
      Staging.aggregate([
        { $group: { _id: "$cancerType", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Staging.aggregate([
        { $group: { _id: "$overallStage", count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
      ResponseAssessment.aggregate([
        { $group: { _id: "$response", count: { $sum: 1 } } },
      ]),
    ]);

    sendSuccess(res, { cancerTypeDistribution, stageDistribution, treatmentOutcomes });
  } catch (error) {
    next(error);
  }
};
