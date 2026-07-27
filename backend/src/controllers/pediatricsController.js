import mongoose from "mongoose";
import Patient from "../models/Patient.js";
import { sendSuccess, sendError, sendPaginated } from "../utils/apiResponse.js";
import { getPaginationParams } from "../utils/pagination.js";

const growthSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    uhid: { type: String, required: true },
    visitDate: { type: Date, default: Date.now },
    age: { type: String },
    weight: { type: Number },
    height: { type: Number },
    headCircumference: { type: Number },
    bmi: { type: Number },
    weightPercentile: { type: Number },
    heightPercentile: { type: Number },
    recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const vaccinationSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    uhid: { type: String, required: true },
    vaccineName: { type: String, required: true },
    dose: { type: String },
    scheduledDate: { type: Date },
    administeredDate: { type: Date },
    batchNumber: { type: String },
    site: { type: String },
    status: { type: String, enum: ["Scheduled", "Administered", "Overdue", "Skipped"], default: "Scheduled" },
    recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const milestoneSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    uhid: { type: String, required: true },
    category: { type: String },
    milestone: { type: String },
    expectedAge: { type: String },
    achievedDate: { type: Date },
    status: { type: String, enum: ["Achieved", "Pending", "Delayed"], default: "Pending" },
    notes: { type: String },
    recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const feedingSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    uhid: { type: String, required: true },
    date: { type: Date, default: Date.now },
    feedType: { type: String },
    frequency: { type: String },
    duration: { type: String },
    notes: { type: String },
    recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Growth = mongoose.models.Growth || mongoose.model("Growth", growthSchema);
const Vaccination = mongoose.models.Vaccination || mongoose.model("Vaccination", vaccinationSchema);
const Milestone = mongoose.models.Milestone || mongoose.model("Milestone", milestoneSchema);
const Feeding = mongoose.models.Feeding || mongoose.model("Feeding", feedingSchema);

export const dashboard = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [nicuPatients, todayVaccinations, pendingGrowthCharts] = await Promise.all([
      Patient.countDocuments({ conditions: "NICU", status: "active" }),
      Vaccination.countDocuments({ administeredDate: { $gte: today, $lt: tomorrow } }),
      Patient.countDocuments({ conditions: "Pediatric", status: "active" }).then(
        (total) =>
          Growth.aggregate([
            { $group: { _id: "$uhid", lastVisit: { $max: "$visitDate" } } },
            { $match: { lastVisit: { $lt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) } } },
          ]).then((stale) => Math.max(0, total - stale.length))
      ),
    ]);

    sendSuccess(res, { nicuPatients, todayVaccinations, pendingGrowthCharts });
  } catch (error) {
    next(error);
  }
};

export const listPatients = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationParams(req.query);

    const filter = { conditions: "Pediatric" };
    if (req.query.status) filter.status = req.query.status;
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: "i" } },
        { uhid: { $regex: req.query.search, $options: "i" } },
      ];
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

export const getGrowth = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationParams(req.query);
    const { uhid } = req.params;

    const filter = { uhid };
    const [records, total] = await Promise.all([
      Growth.find(filter).sort(sort || "-visitDate").skip(skip).limit(limit).lean(),
      Growth.countDocuments(filter),
    ]);

    sendPaginated(res, records, total, page, limit);
  } catch (error) {
    next(error);
  }
};

export const getVaccinations = async (req, res, next) => {
  try {
    const { uhid } = req.params;
    const vaccinations = await Vaccination.find({ uhid }).sort("-scheduledDate").lean();
    sendSuccess(res, vaccinations);
  } catch (error) {
    next(error);
  }
};

export const recordVaccination = async (req, res, next) => {
  try {
    const {
      uhid, vaccineName, dose, scheduledDate, administeredDate,
      batchNumber, site, status,
    } = req.body;

    if (!uhid || !vaccineName) return sendError(res, "UHID and vaccine name are required", 400);

    const patient = await Patient.findOne({ uhid }).lean();
    if (!patient) return sendError(res, "Patient not found", 404);

    const vaccination = await Vaccination.create({
      patientId: patient._id,
      uhid,
      vaccineName,
      dose,
      scheduledDate,
      administeredDate: administeredDate || new Date(),
      batchNumber,
      site,
      status: status || "Administered",
      recordedBy: req.user.id,
    });

    sendSuccess(res, vaccination, "Vaccination recorded", 201);
  } catch (error) {
    next(error);
  }
};

export const getMilestones = async (req, res, next) => {
  try {
    const { uhid } = req.params;
    const milestones = await Milestone.find({ uhid }).sort("expectedAge").lean();
    sendSuccess(res, milestones);
  } catch (error) {
    next(error);
  }
};

export const getFeeding = async (req, res, next) => {
  try {
    const { uhid } = req.params;
    const records = await Feeding.find({ uhid }).sort("-date").lean();
    sendSuccess(res, records);
  } catch (error) {
    next(error);
  }
};
