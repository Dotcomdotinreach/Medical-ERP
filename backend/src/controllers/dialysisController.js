import mongoose from "mongoose";
import Patient from "../models/Patient.js";
import Doctor from "../models/Doctor.js";
import DialysisMachine from "../models/DialysisMachine.js";
import { sendSuccess, sendError, sendPaginated } from "../utils/apiResponse.js";
import { getPaginationParams } from "../utils/pagination.js";

// ── Inline models (no separate model files) ────────────────────────────────

const dialysisPatientSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
    diagnosis: { type: String },
    dialysisType: {
      type: String,
      enum: ["hemodialysis", "peritoneal", "hemofiltration", "hemodiafiltration"],
      default: "hemodialysis",
    },
    frequency: { type: String, enum: ["twice-weekly", "thrice-weekly", "weekly", "other"], default: "thrice-weekly" },
    accessType: { type: String, enum: ["AVF", "AVG", "catheter", "peritoneal-catheter"] },
    accessSite: { type: String },
    accessDate: { type: Date },
    comorbidities: [{ type: String }],
    enrolledDate: { type: Date, default: Date.now },
    status: { type: String, enum: ["active", "inactive", "transplanted", "deceased"], default: "active" },
  },
  { timestamps: true }
);

const appointmentSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "DialysisPatient", required: true },
    machineId: { type: mongoose.Schema.Types.ObjectId, ref: "DialysisMachine" },
    scheduledDate: { type: Date, required: true },
    scheduledTime: { type: String },
    slot: { type: String },
    status: { type: String, enum: ["scheduled", "confirmed", "completed", "cancelled", "no-show"], default: "scheduled" },
    notes: { type: String },
  },
  { timestamps: true }
);

const sessionSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "DialysisPatient", required: true },
    machineId: { type: mongoose.Schema.Types.ObjectId, ref: "DialysisMachine", required: true },
    appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment" },
    startTime: { type: Date, required: true },
    endTime: { type: Date },
    duration: { type: Number },
    dryWeight: { type: Number },
    preWeight: { type: Number },
    postWeight: { type: Number },
    ultrafiltration: { type: Number },
    bloodFlowRate: { type: Number },
    dialysateFlowRate: { type: Number },
    heparinDose: { type: String },
    dialyzer: { type: String },
    dialysate: { type: String },
    bicarbonate: { type: Number },
    temp: { type: Number },
    conductivity: { type: Number },
    venousPressure: { type: Number },
    arterialPressure: { type: Number },
    transmembranePressure: { type: Number },
    vitals: [
      {
        heartRate: Number,
        bpSystolic: Number,
        bpDiastolic: Number,
        temperature: Number,
        recordedAt: { type: Date, default: Date.now },
      },
    ],
    complications: [{ type: String }],
    status: { type: String, enum: ["in-progress", "completed", "stopped"], default: "in-progress" },
    notes: { type: String },
    performedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const labResultSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "DialysisPatient", required: true },
    testName: { type: String, required: true },
    value: { type: mongoose.Schema.Types.Mixed },
    unit: { type: String },
    referenceRange: { type: String },
    flag: { type: String, enum: ["normal", "high", "low", "critical"] },
    testDate: { type: Date, default: Date.now },
    orderedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
  },
  { timestamps: true }
);

const vascularAccessSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "DialysisPatient", required: true },
    accessType: { type: String, enum: ["AVF", "AVG", "catheter"], required: true },
    side: { type: String, enum: ["left", "right"] },
    site: { type: String },
    creationDate: { type: Date },
    status: { type: String, enum: ["functioning", "non-functioning", "compromised", "removed"], default: "functioning" },
    lastAssessment: { type: Date },
    flowRate: { type: Number },
    complications: [{ type: String }],
    notes: { type: String },
  },
  { timestamps: true }
);

const waterQualitySchema = new mongoose.Schema(
  {
    testType: { type: String, required: true },
    location: { type: String },
    value: { type: Number },
    unit: { type: String },
    result: { type: String, enum: ["pass", "fail", "pending"], default: "pending" },
    testedBy: { type: String },
    testedAt: { type: Date, default: Date.now },
    correctiveAction: { type: String },
  },
  { timestamps: true }
);

const maintenanceSchema = new mongoose.Schema(
  {
    machineId: { type: mongoose.Schema.Types.ObjectId, ref: "DialysisMachine", required: true },
    type: { type: String, enum: ["preventive", "corrective", "breakdown"], required: true },
    description: { type: String },
    performedBy: { type: String },
    performedAt: { type: Date, default: Date.now },
    cost: { type: Number },
    nextMaintenanceDate: { type: Date },
    status: { type: String, enum: ["scheduled", "in-progress", "completed"], default: "scheduled" },
  },
  { timestamps: true }
);

const consumableSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, enum: ["dialyzer", "tubing", "catheter", "heparin", "dialysate", "other"], required: true },
    stock: { type: Number, default: 0 },
    unit: { type: String, default: "pieces" },
    reorderLevel: { type: Number, default: 10 },
    expiryDate: { type: Date },
    batchNo: { type: String },
    status: { type: String, enum: ["available", "low-stock", "out-of-stock"], default: "available" },
  },
  { timestamps: true }
);

const DialysisPatient = mongoose.models.DialysisPatient || mongoose.model("DialysisPatient", dialysisPatientSchema);
const Appointment = mongoose.models.Appointment || mongoose.model("Appointment", appointmentSchema);
const Session = mongoose.models.DialysisSession || mongoose.model("DialysisSession", sessionSchema);
const LabResult = mongoose.models.DialysisLabResult || mongoose.model("DialysisLabResult", labResultSchema);
const VascularAccess = mongoose.models.VascularAccess || mongoose.model("VascularAccess", vascularAccessSchema);
const WaterQuality = mongoose.models.WaterQuality || mongoose.model("WaterQuality", waterQualitySchema);
const MachineMaintenance = mongoose.models.MachineMaintenance || mongoose.model("MachineMaintenance", maintenanceSchema);
const Consumable = mongoose.models.DialysisConsumable || mongoose.model("DialysisConsumable", consumableSchema);

// ── 1. Dashboard KPIs ──────────────────────────────────────────────────────

export const dashboard = async (req, res) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const [activePatients, machinesOnline, todaySessions, activeSessions, complications] =
      await Promise.all([
        DialysisPatient.countDocuments({ status: "active" }),
        DialysisMachine.countDocuments({ status: "online" }),
        Session.countDocuments({
          startTime: { $gte: todayStart, $lte: todayEnd },
        }),
        Session.countDocuments({ status: "in-progress" }),
        Session.countDocuments({
          complications: { $exists: true, $ne: [] },
          startTime: { $gte: todayStart, $lte: todayEnd },
        }),
      ]);

    return sendSuccess(res, {
      activePatients,
      machinesOnline,
      todaySessions,
      activeSessions,
      complicationsToday: complications,
    });
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// ── 2. List dialysis patients ──────────────────────────────────────────────

export const listPatients = async (req, res) => {
  try {
    const { status, search } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const { page, limit, skip, sort } = getPaginationParams(req.query);
    let patients = await DialysisPatient.find(filter)
      .populate("patientId", "uhid name age gender blood")
      .populate("doctorId", "name dept")
      .skip(skip)
      .limit(limit)
      .sort(sort);
    const total = await DialysisPatient.countDocuments(filter);

    if (search) {
      const s = search.toLowerCase();
      patients = patients.filter(
        (p) =>
          p.patientId?.name?.toLowerCase().includes(s) ||
          p.patientId?.uhid?.toLowerCase().includes(s)
      );
    }

    return sendPaginated(res, patients, total, page, limit);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// ── 3. Enroll new dialysis patient ─────────────────────────────────────────

export const enrollPatient = async (req, res) => {
  try {
    const {
      patientUhid,
      doctorId,
      diagnosis,
      dialysisType,
      frequency,
      accessType,
      accessSite,
      accessDate,
      comorbidities,
    } = req.body;

    const patient = await Patient.findOne({ uhid: patientUhid });
    if (!patient) return sendError(res, "Patient not found", 404);

    const existing = await DialysisPatient.findOne({ patientId: patient._id, status: "active" });
    if (existing) return sendError(res, "Patient already enrolled", 400);

    const dialysisPatient = await DialysisPatient.create({
      patientId: patient._id,
      doctorId,
      diagnosis,
      dialysisType: dialysisType || "hemodialysis",
      frequency,
      accessType,
      accessSite,
      accessDate,
      comorbidities,
    });

    const populated = await DialysisPatient.findById(dialysisPatient._id)
      .populate("patientId", "uhid name age gender")
      .populate("doctorId", "name dept");

    return sendSuccess(res, populated, "Patient enrolled for dialysis", 201);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// ── 4. Get dialysis patient details ────────────────────────────────────────

export const getPatient = async (req, res) => {
  try {
    const { id } = req.params;

    const [dialysisPatient, sessions, accessRecords, labResults] = await Promise.all([
      DialysisPatient.findById(id)
        .populate("patientId", "uhid name age gender blood phone address")
        .populate("doctorId", "name dept"),
      Session.find({ patientId: id }).sort({ startTime: -1 }).limit(10),
      VascularAccess.find({ patientId: id }).sort({ creationDate: -1 }),
      LabResult.find({ patientId: id }).sort({ testDate: -1 }).limit(20),
    ]);

    if (!dialysisPatient) return sendError(res, "Dialysis patient not found", 404);

    return sendSuccess(res, {
      patient: dialysisPatient,
      recentSessions: sessions,
      accessRecords,
      labResults,
    });
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// ── 5. List machines ───────────────────────────────────────────────────────

export const listMachines = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const { page, limit, skip, sort } = getPaginationParams(req.query);
    const [machines, total] = await Promise.all([
      DialysisMachine.find(filter).skip(skip).limit(limit).sort(sort),
      DialysisMachine.countDocuments(filter),
    ]);

    return sendPaginated(res, machines, total, page, limit);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// ── 6. List appointments ───────────────────────────────────────────────────

export const listAppointments = async (req, res) => {
  try {
    const { date, status, patientId } = req.query;
    const filter = {};
    if (date) {
      const target = new Date(date);
      const nextDay = new Date(target);
      nextDay.setDate(nextDay.getDate() + 1);
      filter.scheduledDate = { $gte: target, $lt: nextDay };
    }
    if (status) filter.status = status;
    if (patientId) filter.patientId = patientId;

    const { page, limit, skip, sort } = getPaginationParams(req.query);
    const [appointments, total] = await Promise.all([
      Appointment.find(filter)
        .populate({ path: "patientId", populate: { path: "patientId", select: "uhid name" } })
        .populate("machineId", "serialNumber location")
        .skip(skip)
        .limit(limit)
        .sort(sort),
      Appointment.countDocuments(filter),
    ]);

    return sendPaginated(res, appointments, total, page, limit);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// ── 7. Schedule appointment ────────────────────────────────────────────────

export const scheduleAppointment = async (req, res) => {
  try {
    const { patientId, machineId, scheduledDate, scheduledTime, slot, notes } = req.body;

    const appointment = await Appointment.create({
      patientId,
      machineId,
      scheduledDate,
      scheduledTime,
      slot,
      notes,
    });

    return sendSuccess(res, appointment, "Appointment scheduled", 201);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// ── 8. Start session ───────────────────────────────────────────────────────

export const startSession = async (req, res) => {
  try {
    const {
      patientId,
      machineId,
      appointmentId,
      dryWeight,
      preWeight,
      bloodFlowRate,
      dialysateFlowRate,
      heparinDose,
      dialyzer,
      dialysate,
      bicarbonate,
      temp,
      performedBy,
    } = req.body;

    const machine = await DialysisMachine.findById(machineId);
    if (!machine) return sendError(res, "Machine not found", 404);
    if (machine.status !== "online") return sendError(res, "Machine is not available", 400);

    const session = await Session.create({
      patientId,
      machineId,
      appointmentId,
      startTime: new Date(),
      dryWeight,
      preWeight,
      bloodFlowRate,
      dialysateFlowRate,
      heparinDose,
      dialyzer,
      dialysate,
      bicarbonate,
      temp,
      performedBy,
    });

    if (appointmentId) {
      await Appointment.findByIdAndUpdate(appointmentId, { status: "completed" });
    }

    machine.totalSessions = (machine.totalSessions || 0) + 1;
    await machine.save();

    return sendSuccess(res, session, "Dialysis session started", 201);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// ── 9. Update session ──────────────────────────────────────────────────────

export const updateSession = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      vitals,
      ultrafiltration,
      venousPressure,
      arterialPressure,
      transmembranePressure,
      conductivity,
      complications,
      notes,
    } = req.body;

    const session = await Session.findById(id);
    if (!session) return sendError(res, "Session not found", 404);
    if (session.status !== "in-progress") return sendError(res, "Session is not in progress", 400);

    if (vitals) {
      session.vitals = session.vitals || [];
      session.vitals.push({ ...vitals, recordedAt: new Date() });
    }

    if (ultrafiltration !== undefined) session.ultrafiltration = ultrafiltration;
    if (venousPressure !== undefined) session.venousPressure = venousPressure;
    if (arterialPressure !== undefined) session.arterialPressure = arterialPressure;
    if (transmembranePressure !== undefined) session.transmembranePressure = transmembranePressure;
    if (conductivity !== undefined) session.conductivity = conductivity;
    if (complications) session.complications = complications;
    if (notes) session.notes = notes;

    await session.save();

    return sendSuccess(res, session, "Session updated");
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// ── 10. Complete session ───────────────────────────────────────────────────

export const completeSession = async (req, res) => {
  try {
    const { id } = req.params;
    const { postWeight, ultrafiltrationTotal, outcome, notes } = req.body;

    const session = await Session.findById(id);
    if (!session) return sendError(res, "Session not found", 404);
    if (session.status !== "in-progress") return sendError(res, "Session is not in progress", 400);

    const endTime = new Date();
    const duration = Math.round((endTime - session.startTime) / 60000);

    session.endTime = endTime;
    session.duration = duration;
    session.postWeight = postWeight;
    session.ultrafiltration = ultrafiltrationTotal || session.ultrafiltration;
    session.notes = notes || session.notes;
    session.status = "completed";
    await session.save();

    return sendSuccess(res, session, "Session completed");
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// ── 11. Get lab results ────────────────────────────────────────────────────

export const getLabResults = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { testName } = req.query;
    const filter = { patientId };
    if (testName) filter.testName = testName;

    const { page, limit, skip, sort } = getPaginationParams(req.query);
    const [results, total] = await Promise.all([
      LabResult.find(filter)
        .populate("orderedBy", "name dept")
        .skip(skip)
        .limit(limit)
        .sort(sort),
      LabResult.countDocuments(filter),
    ]);

    return sendPaginated(res, results, total, page, limit);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// ── 12. Get vascular access records ────────────────────────────────────────

export const getVascularAccess = async (req, res) => {
  try {
    const { patientId } = req.params;

    const accessRecords = await VascularAccess.find({ patientId }).sort({ creationDate: -1 });

    return sendSuccess(res, accessRecords);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// ── 13. Water quality tests ────────────────────────────────────────────────

export const getWaterQuality = async (req, res) => {
  try {
    const { testType, result } = req.query;
    const filter = {};
    if (testType) filter.testType = testType;
    if (result) filter.result = result;

    const { page, limit, skip, sort } = getPaginationParams(req.query);
    const [tests, total] = await Promise.all([
      WaterQuality.find(filter).skip(skip).limit(limit).sort(sort),
      WaterQuality.countDocuments(filter),
    ]);

    return sendPaginated(res, tests, total, page, limit);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// ── 14. Machine maintenance ────────────────────────────────────────────────

export const getMaintenance = async (req, res) => {
  try {
    const { machineId, type, status } = req.query;
    const filter = {};
    if (machineId) filter.machineId = machineId;
    if (type) filter.type = type;
    if (status) filter.status = status;

    const { page, limit, skip, sort } = getPaginationParams(req.query);
    const [records, total] = await Promise.all([
      MachineMaintenance.find(filter)
        .populate("machineId", "serialNumber model")
        .skip(skip)
        .limit(limit)
        .sort(sort),
      MachineMaintenance.countDocuments(filter),
    ]);

    return sendPaginated(res, records, total, page, limit);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// ── 15. Consumables inventory ──────────────────────────────────────────────

export const getConsumables = async (req, res) => {
  try {
    const { category, status } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;

    const { page, limit, skip, sort } = getPaginationParams(req.query);
    const [items, total] = await Promise.all([
      Consumable.find(filter).skip(skip).limit(limit).sort(sort),
      Consumable.countDocuments(filter),
    ]);

    return sendPaginated(res, items, total, page, limit);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// ── 16. Dialysis analytics ─────────────────────────────────────────────────

export const getAnalytics = async (req, res) => {
  try {
    const { period = "monthly" } = req.query;

    const [
      totalPatients,
      activePatients,
      totalSessions,
      byAccess,
      byDialysisType,
      avgDuration,
      complicationsByType,
    ] = await Promise.all([
      DialysisPatient.countDocuments(),
      DialysisPatient.countDocuments({ status: "active" }),
      Session.countDocuments(),
      DialysisPatient.aggregate([
        { $match: { status: "active" } },
        { $group: { _id: "$accessType", count: { $sum: 1 } } },
      ]),
      DialysisPatient.aggregate([
        { $match: { status: "active" } },
        { $group: { _id: "$dialysisType", count: { $sum: 1 } } },
      ]),
      Session.aggregate([
        { $match: { status: "completed" } },
        { $group: { _id: null, avgDuration: { $avg: "$duration" } } },
      ]),
      Session.aggregate([
        { $unwind: "$complications" },
        { $group: { _id: "$complications", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
    ]);

    const accessBreakdown = {};
    byAccess.forEach((a) => {
      accessBreakdown[a._id] = a.count;
    });

    const typeBreakdown = {};
    byDialysisType.forEach((t) => {
      typeBreakdown[t._id] = t.count;
    });

    const complicationBreakdown = {};
    complicationsByType.forEach((c) => {
      complicationBreakdown[c._id] = c.count;
    });

    return sendSuccess(res, {
      totalPatients,
      activePatients,
      totalSessions,
      averageDuration: Math.round(avgDuration[0]?.avgDuration || 0),
      byAccess: accessBreakdown,
      byType: typeBreakdown,
      complications: complicationBreakdown,
    });
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};
