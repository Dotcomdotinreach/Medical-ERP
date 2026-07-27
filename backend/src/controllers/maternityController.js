import mongoose from "mongoose";
import Patient from "../models/Patient.js";
import { sendSuccess, sendError, sendPaginated } from "../utils/apiResponse.js";
import { getPaginationParams } from "../utils/pagination.js";

const ancVisitSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    uhid: { type: String, required: true },
    visitDate: { type: Date, default: Date.now },
    gestationalAge: { type: String },
    bp: { type: String },
    weight: { type: Number },
    fundalHeight: { type: Number },
    fhr: { type: Number },
    urine: { type: String },
    hemoglobin: { type: Number },
    notes: { type: String },
    recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const deliverySchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    uhid: { type: String, required: true },
    deliveryDate: { type: Date, default: Date.now },
    mode: { type: String, enum: ["Normal", "C-Section", "Assisted", "Vacuum", "Forceps"] },
    presentation: { type: String },
    apgar1Min: { type: Number },
    apgar5Min: { type: Number },
    birthWeight: { type: Number },
    babyGender: { type: String },
    complications: { type: String },
    recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const neonatalSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    uhid: { type: String, required: true },
    birthDate: { type: Date },
    weight: { type: Number },
    apgarScores: { type: String },
    feedingType: { type: String },
    bilirubin: { type: Number },
    status: { type: String, enum: ["Normal", "NICU", "Critical"], default: "Normal" },
    notes: { type: String },
    recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const postpartumSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    uhid: { type: String, required: true },
    visitDate: { type: Date, default: Date.now },
    dayPostpartum: { type: Number },
    bp: { type: String },
    uterusInvolution: { type: String },
    lochia: { type: String },
    breastfeeding: { type: Boolean },
    moodScreening: { type: String },
    contraception: { type: String },
    notes: { type: String },
    recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const ANCVisit = mongoose.models.ANCVisit || mongoose.model("ANCVisit", ancVisitSchema);
const Delivery = mongoose.models.Delivery || mongoose.model("Delivery", deliverySchema);
const Neonatal = mongoose.models.Neonatal || mongoose.model("Neonatal", neonatalSchema);
const PostpartumVisit = mongoose.models.PostpartumVisit || mongoose.model("PostpartumVisit", postpartumSchema);

export const dashboard = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [activeMothers, todayDeliveries, antenatalCount, nicuCount] = await Promise.all([
      Patient.countDocuments({ conditions: "Pregnant", status: "active" }),
      Delivery.countDocuments({ deliveryDate: { $gte: today, $lt: tomorrow } }),
      ANCVisit.countDocuments({ visitDate: { $gte: today, $lt: tomorrow } }),
      Neonatal.countDocuments({ status: "NICU" }),
    ]);

    sendSuccess(res, { activeMothers, todayDeliveries, antenatalCount, nicuCount });
  } catch (error) {
    next(error);
  }
};

export const listPatients = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationParams(req.query);

    const filter = { conditions: "Pregnant" };
    if (req.query.status) filter.status = req.query.status;

    const [patients, total] = await Promise.all([
      Patient.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      Patient.countDocuments(filter),
    ]);

    sendPaginated(res, patients, total, page, limit);
  } catch (error) {
    next(error);
  }
};

export const getANC = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationParams(req.query);
    const { uhid } = req.params;

    const filter = { uhid };
    const [visits, total] = await Promise.all([
      ANCVisit.find(filter).sort(sort || "-visitDate").skip(skip).limit(limit).lean(),
      ANCVisit.countDocuments(filter),
    ]);

    sendPaginated(res, visits, total, page, limit);
  } catch (error) {
    next(error);
  }
};

export const recordANC = async (req, res, next) => {
  try {
    const { uhid, gestationalAge, bp, weight, fundalHeight, fhr, urine, hemoglobin, notes } = req.body;

    if (!uhid) return sendError(res, "UHID is required", 400);

    const patient = await Patient.findOne({ uhid }).lean();
    if (!patient) return sendError(res, "Patient not found", 404);

    const visit = await ANCVisit.create({
      patientId: patient._id,
      uhid,
      gestationalAge,
      bp,
      weight,
      fundalHeight,
      fhr,
      urine,
      hemoglobin,
      notes,
      recordedBy: req.user.id,
    });

    sendSuccess(res, visit, "ANC visit recorded", 201);
  } catch (error) {
    next(error);
  }
};

export const getLabor = async (req, res, next) => {
  try {
    const { uhid } = req.params;
    const deliveries = await Delivery.find({ uhid }).sort("-deliveryDate").lean();
    sendSuccess(res, deliveries);
  } catch (error) {
    next(error);
  }
};

export const recordDelivery = async (req, res, next) => {
  try {
    const {
      uhid, mode, presentation, apgar1Min, apgar5Min,
      birthWeight, babyGender, complications,
    } = req.body;

    if (!uhid) return sendError(res, "UHID is required", 400);

    const patient = await Patient.findOne({ uhid }).lean();
    if (!patient) return sendError(res, "Patient not found", 404);

    const delivery = await Delivery.create({
      patientId: patient._id,
      uhid,
      mode,
      presentation,
      apgar1Min,
      apgar5Min,
      birthWeight,
      babyGender,
      complications,
      recordedBy: req.user.id,
    });

    const neonatal = await Neonatal.create({
      patientId: patient._id,
      uhid,
      birthDate: new Date(),
      weight: birthWeight,
      apgarScores: `${apgar1Min}/${apgar5Min}`,
      feedingType: "Breastfeeding",
      status: complications ? "NICU" : "Normal",
      recordedBy: req.user.id,
    });

    sendSuccess(res, { delivery, neonatal }, "Delivery recorded", 201);
  } catch (error) {
    next(error);
  }
};

export const getNeonatal = async (req, res, next) => {
  try {
    const { uhid } = req.params;
    const records = await Neonatal.find({ uhid }).sort("-birthDate").lean();
    sendSuccess(res, records);
  } catch (error) {
    next(error);
  }
};

export const recordPostpartum = async (req, res, next) => {
  try {
    const {
      uhid, dayPostpartum, bp, uterusInvolution, lochia,
      breastfeeding, moodScreening, contraception, notes,
    } = req.body;

    if (!uhid) return sendError(res, "UHID is required", 400);

    const patient = await Patient.findOne({ uhid }).lean();
    if (!patient) return sendError(res, "Patient not found", 404);

    const visit = await PostpartumVisit.create({
      patientId: patient._id,
      uhid,
      dayPostpartum,
      bp,
      uterusInvolution,
      lochia,
      breastfeeding,
      moodScreening,
      contraception,
      notes,
      recordedBy: req.user.id,
    });

    sendSuccess(res, visit, "Postpartum visit recorded", 201);
  } catch (error) {
    next(error);
  }
};
