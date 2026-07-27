import mongoose from "mongoose";
import AuditLog from "../models/AuditLog.js";
import { sendSuccess, sendError, sendPaginated } from "../utils/apiResponse.js";
import { getPaginationParams } from "../utils/pagination.js";

const instrumentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    status: {
      type: String,
      enum: ["available", "in-use", "sterilization", "maintenance", "retired"],
      default: "available",
    },
    quantity: { type: Number, default: 1 },
    location: { type: String },
    lastSterilized: { type: Date },
    nextMaintenance: { type: Date },
  },
  { timestamps: true }
);
instrumentSchema.index({ status: 1 });

const traySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    instruments: [
      {
        instrumentId: { type: mongoose.Schema.Types.ObjectId, ref: "Instrument" },
        name: String,
        quantity: { type: Number, default: 1 },
      },
    ],
    status: {
      type: String,
      enum: ["available", "issued", "decontaminating", "sterilizing", "maintenance"],
      default: "available",
    },
    issuedTo: { type: String },
    issuedAt: { type: Date },
    expectedReturn: { type: Date },
    returnedAt: { type: Date },
  },
  { timestamps: true }
);
traySchema.index({ status: 1 });

const sterilizationCycleSchema = new mongoose.Schema(
  {
    cycleNumber: { type: String, required: true, unique: true },
    autoclaveId: { type: mongoose.Schema.Types.ObjectId, ref: "Autoclave" },
    trayIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tray" }],
    type: { type: String, enum: ["steam", "ethylene-oxide", "plasma", "dry-heat"], required: true },
    status: {
      type: String,
      enum: ["pending", "running", "completed", "failed", "aborted"],
      default: "pending",
    },
    startTime: { type: Date },
    endTime: { type: Date },
    temperature: { type: Number },
    pressure: { type: Number },
    duration: { type: Number },
    biologicalIndicator: {
      type: String,
      enum: ["pass", "fail", "pending"],
      default: "pending",
    },
    chemicalIndicator: {
      type: String,
      enum: ["pass", "fail", "pending"],
      default: "pending",
    },
    operator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);
sterilizationCycleSchema.index({ status: 1 });

const autoclaveSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    type: { type: String, enum: ["gravity", "pre-vacuum", "steam-flush"], required: true },
    status: {
      type: String,
      enum: ["idle", "running", "maintenance", "error"],
      default: "idle",
    },
    capacity: { type: Number },
    lastMaintenance: { type: Date },
    nextMaintenance: { type: Date },
    currentCycleId: { type: mongoose.Schema.Types.ObjectId, ref: "SterilizationCycle" },
  },
  { timestamps: true }
);

const Instrument = mongoose.models.Instrument || mongoose.model("Instrument", instrumentSchema);
const Tray = mongoose.models.Tray || mongoose.model("Tray", traySchema);
const SterilizationCycle = mongoose.models.SterilizationCycle || mongoose.model("SterilizationCycle", sterilizationCycleSchema);
const Autoclave = mongoose.models.Autoclave || mongoose.model("Autoclave", autoclaveSchema);

export const dashboard = async (req, res, next) => {
  try {
    const [pendingTrays, activeCycles, sterilizationQueue] = await Promise.all([
      Tray.countDocuments({ status: "issued" }),
      SterilizationCycle.countDocuments({ status: "running" }),
      SterilizationCycle.countDocuments({ status: "pending" }),
    ]);

    sendSuccess(res, { pendingTrays, activeCycles, sterilizationQueue });
  } catch (error) {
    next(error);
  }
};

export const listInstruments = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationParams(req.query);
    const { category, status } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;

    const [instruments, total] = await Promise.all([
      Instrument.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      Instrument.countDocuments(filter),
    ]);

    sendPaginated(res, instruments, total, page, limit);
  } catch (error) {
    next(error);
  }
};

export const listTrays = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationParams(req.query);
    const { status } = req.query;

    const filter = {};
    if (status) filter.status = status;

    const [trays, total] = await Promise.all([
      Tray.find(filter)
        .populate("instruments.instrumentId", "name code")
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Tray.countDocuments(filter),
    ]);

    sendPaginated(res, trays, total, page, limit);
  } catch (error) {
    next(error);
  }
};

export const getTray = async (req, res, next) => {
  try {
    const tray = await Tray.findById(req.params.id)
      .populate("instruments.instrumentId", "name code category status")
      .lean();

    if (!tray) return sendError(res, "Tray not found", 404);
    sendSuccess(res, tray);
  } catch (error) {
    next(error);
  }
};

export const listCycles = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationParams(req.query);
    const { status, type } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (type) filter.type = type;

    const [cycles, total] = await Promise.all([
      SterilizationCycle.find(filter)
        .populate("autoclaveId", "name code")
        .populate("operator", "name")
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      SterilizationCycle.countDocuments(filter),
    ]);

    sendPaginated(res, cycles, total, page, limit);
  } catch (error) {
    next(error);
  }
};

export const startCycle = async (req, res, next) => {
  try {
    const { autoclaveId, trayIds, type } = req.body;
    if (!autoclaveId || !trayIds || !type) {
      return sendError(res, "autoclaveId, trayIds, and type are required", 400);
    }

    const autoclave = await Autoclave.findById(autoclaveId);
    if (!autoclave) return sendError(res, "Autoclave not found", 404);
    if (autoclave.status !== "idle") return sendError(res, "Autoclave is not idle", 400);

    const cycleNumber = `SC-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;

    const cycle = await SterilizationCycle.create({
      cycleNumber,
      autoclaveId,
      trayIds,
      type,
      status: "running",
      startTime: new Date(),
      operator: req.user.id,
    });

    autoclave.status = "running";
    autoclave.currentCycleId = cycle._id;
    await autoclave.save();

    for (const trayId of trayIds) {
      await Tray.findByIdAndUpdate(trayId, { status: "sterilizing" });
    }

    sendSuccess(res, cycle, "Cycle started", 201);
  } catch (error) {
    next(error);
  }
};

export const completeCycle = async (req, res, next) => {
  try {
    const { temperature, pressure, duration, biologicalIndicator, chemicalIndicator } = req.body;

    const cycle = await SterilizationCycle.findById(req.params.id);
    if (!cycle) return sendError(res, "Cycle not found", 404);
    if (cycle.status !== "running") return sendError(res, "Cycle is not running", 400);

    cycle.status = "completed";
    cycle.endTime = new Date();
    cycle.temperature = temperature;
    cycle.pressure = pressure;
    cycle.duration = duration;
    cycle.biologicalIndicator = biologicalIndicator || "pending";
    cycle.chemicalIndicator = chemicalIndicator || "pending";
    await cycle.save();

    const autoclave = await Autoclave.findById(cycle.autoclaveId);
    if (autoclave) {
      autoclave.status = "idle";
      autoclave.currentCycleId = null;
      await autoclave.save();
    }

    for (const trayId of cycle.trayIds) {
      await Tray.findByIdAndUpdate(trayId, { status: "available", returnedAt: new Date() });
    }

    await AuditLog.create({
      userId: req.user.id,
      action: "complete_sterilization_cycle",
      entityType: "SterilizationCycle",
      entityId: cycle._id,
      details: { cycleNumber: cycle.cycleNumber },
    });

    sendSuccess(res, cycle, "Cycle completed");
  } catch (error) {
    next(error);
  }
};

export const issueTray = async (req, res, next) => {
  try {
    const { trayId, department, expectedReturn } = req.body;
    if (!trayId || !department) return sendError(res, "trayId and department are required", 400);

    const tray = await Tray.findById(trayId);
    if (!tray) return sendError(res, "Tray not found", 404);
    if (tray.status !== "available") return sendError(res, "Tray is not available", 400);

    tray.status = "issued";
    tray.issuedTo = department;
    tray.issuedAt = new Date();
    tray.expectedReturn = expectedReturn ? new Date(expectedReturn) : null;
    tray.returnedAt = null;
    await tray.save();

    await AuditLog.create({
      userId: req.user.id,
      action: "issue_tray",
      entityType: "Tray",
      entityId: tray._id,
      details: { trayCode: tray.code, department },
    });

    sendSuccess(res, tray, "Tray issued");
  } catch (error) {
    next(error);
  }
};

export const returnTray = async (req, res, next) => {
  try {
    const tray = await Tray.findById(req.params.trayId);
    if (!tray) return sendError(res, "Tray not found", 404);
    if (tray.status !== "issued") return sendError(res, "Tray is not issued", 400);

    tray.status = "decontaminating";
    tray.returnedAt = new Date();
    await tray.save();

    await AuditLog.create({
      userId: req.user.id,
      action: "return_tray",
      entityType: "Tray",
      entityId: tray._id,
      details: { trayCode: tray.code },
    });

    sendSuccess(res, tray, "Tray returned for decontamination");
  } catch (error) {
    next(error);
  }
};

export const listAutoclaves = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationParams(req.query);
    const { status } = req.query;

    const filter = {};
    if (status) filter.status = status;

    const [autoclaves, total] = await Promise.all([
      Autoclave.find(filter)
        .populate("currentCycleId", "cycleNumber status")
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Autoclave.countDocuments(filter),
    ]);

    sendPaginated(res, autoclaves, total, page, limit);
  } catch (error) {
    next(error);
  }
};
