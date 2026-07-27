import mongoose from "mongoose";
import Patient from "../models/Patient.js";
import Appointment from "../models/Appointment.js";
import Encounter from "../models/Encounter.js";
import Prescription from "../models/Prescription.js";
import Invoice from "../models/Invoice.js";
import Payment from "../models/Payment.js";
import LabOrder from "../models/LabOrder.js";
import ImagingOrder from "../models/ImagingOrder.js";
import AuditLog from "../models/AuditLog.js";
import { sendSuccess, sendError, sendPaginated } from "../utils/apiResponse.js";
import { getPaginationParams } from "../utils/pagination.js";

const notificationSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    type: {
      type: String,
      enum: ["appointment", "prescription", "lab-result", "billing", "general"],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    readAt: { type: Date },
  },
  { timestamps: true }
);
notificationSchema.index({ patientId: 1 });
notificationSchema.index({ read: 1 });

const insuranceClaimSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    invoiceId: { type: mongoose.Schema.Types.ObjectId, ref: "Invoice" },
    insuranceProvider: { type: String, required: true },
    policyNumber: { type: String },
    claimedAmount: { type: Number, required: true },
    approvedAmount: { type: Number },
    diagnosis: { type: String },
    status: {
      type: String,
      enum: ["submitted", "under-review", "approved", "rejected", "paid"],
      default: "submitted",
    },
    submittedDate: { type: Date, default: Date.now },
    resolvedDate: { type: Date },
  },
  { timestamps: true }
);
insuranceClaimSchema.index({ patientId: 1 });

const familyMemberSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    name: { type: String, required: true },
    relation: { type: String, required: true },
    gender: { type: String },
    dob: { type: Date },
    phone: { type: String },
    uhid: { type: String },
    isPrimary: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Notification = mongoose.models.Notification || mongoose.model("Notification", notificationSchema);
const InsuranceClaim = mongoose.models.InsuranceClaim || mongoose.model("InsuranceClaim", insuranceClaimSchema);
const FamilyMember = mongoose.models.FamilyMember || mongoose.model("FamilyMember", familyMemberSchema);

export const getProfile = async (req, res, next) => {
  try {
    const patient = await Patient.findOne({ uhid: req.params.uhid })
      .select("-__v")
      .lean();

    if (!patient) return sendError(res, "Patient not found", 404);
    sendSuccess(res, patient);
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const allowed = ["name", "phone", "email", "address", "city", "state", "emergencyContact", "emergencyRelation"];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    const patient = await Patient.findOneAndUpdate(
      { uhid: req.params.uhid },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!patient) return sendError(res, "Patient not found", 404);

    await AuditLog.create({
      userId: req.user.id,
      action: "update_portal_profile",
      entityType: "Patient",
      entityId: patient._id,
      details: { uhid: patient.uhid, updatedFields: Object.keys(updates) },
    });

    sendSuccess(res, patient, "Profile updated");
  } catch (error) {
    next(error);
  }
};

export const getAppointments = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationParams(req.query);
    const { status } = req.query;

    const patient = await Patient.findOne({ uhid: req.params.uhid }).lean();
    if (!patient) return sendError(res, "Patient not found", 404);

    const filter = { patientId: patient._id };
    if (status) filter.status = status;

    const [appointments, total] = await Promise.all([
      Appointment.find(filter)
        .populate("doctorId", "name dept")
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Appointment.countDocuments(filter),
    ]);

    sendPaginated(res, appointments, total, page, limit);
  } catch (error) {
    next(error);
  }
};

export const bookAppointment = async (req, res, next) => {
  try {
    const { uhid, doctorId, date, time, type, reason } = req.body;
    if (!uhid || !doctorId || !date || !time) {
      return sendError(res, "uhid, doctorId, date, and time are required", 400);
    }

    const patient = await Patient.findOne({ uhid }).lean();
    if (!patient) return sendError(res, "Patient not found", 404);

    const appointment = await Appointment.create({
      patientId: patient._id,
      doctorId,
      date: new Date(date),
      time,
      type: type || "In-Person",
      reason,
      status: "scheduled",
    });

    const populated = await appointment.populate([
      { path: "patientId", select: "uhid name" },
      { path: "doctorId", select: "name dept" },
    ]);

    await Notification.create({
      patientId: patient._id,
      type: "appointment",
      title: "Appointment Booked",
      message: `Appointment scheduled on ${date} at ${time}`,
    });

    sendSuccess(res, populated, "Appointment booked", 201);
  } catch (error) {
    next(error);
  }
};

export const getConsultations = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationParams(req.query);

    const patient = await Patient.findOne({ uhid: req.params.uhid }).lean();
    if (!patient) return sendError(res, "Patient not found", 404);

    const filter = { patientId: patient._id };

    const [encounters, total] = await Promise.all([
      Encounter.find(filter)
        .populate("doctorId", "name dept")
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Encounter.countDocuments(filter),
    ]);

    sendPaginated(res, encounters, total, page, limit);
  } catch (error) {
    next(error);
  }
};

export const getReports = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationParams(req.query);
    const { type } = req.query;

    const patient = await Patient.findOne({ uhid: req.params.uhid }).lean();
    if (!patient) return sendError(res, "Patient not found", 404);

    let reports = [];
    let total = 0;

    if (!type || type === "lab") {
      const [labOrders, labTotal] = await Promise.all([
        LabOrder.find({ patientId: patient._id, status: { $in: ["reported", "delivered"] } })
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .lean(),
        LabOrder.countDocuments({ patientId: patient._id, status: { $in: ["reported", "delivered"] } }),
      ]);
      reports = [...reports, ...labOrders.map((l) => ({ ...l, reportType: "lab" }))];
      total += labTotal;
    }

    if (!type || type === "imaging") {
      const imagingOrders = await ImagingOrder.find({ patientId: patient._id, status: { $in: ["signed", "delivered"] } })
        .sort(sort)
        .lean();
      reports = [...reports, ...imagingOrders.map((i) => ({ ...i, reportType: "imaging" }))];
      total += imagingOrders.length;
    }

    sendSuccess(res, { reports, total });
  } catch (error) {
    next(error);
  }
};

export const getPrescriptions = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationParams(req.query);

    const patient = await Patient.findOne({ uhid: req.params.uhid }).lean();
    if (!patient) return sendError(res, "Patient not found", 404);

    const filter = { patientId: patient._id };

    const [prescriptions, total] = await Promise.all([
      Prescription.find(filter)
        .populate("doctorId", "name dept")
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Prescription.countDocuments(filter),
    ]);

    sendPaginated(res, prescriptions, total, page, limit);
  } catch (error) {
    next(error);
  }
};

export const getBills = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationParams(req.query);

    const patient = await Patient.findOne({ uhid: req.params.uhid }).lean();
    if (!patient) return sendError(res, "Patient not found", 404);

    const [invoices, total, payments] = await Promise.all([
      Invoice.find({ patientId: patient._id })
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Invoice.countDocuments({ patientId: patient._id }),
      Payment.find({
        invoiceId: { $in: (await Invoice.find({ patientId: patient._id }).select("_id").lean()).map((i) => i._id) },
      })
        .sort({ date: -1 })
        .lean(),
    ]);

    const totalBilled = invoices.reduce((sum, inv) => sum + inv.total, 0);
    const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);

    sendPaginated(res, { invoices, payments, totalBilled, totalPaid, pending: totalBilled - totalPaid }, total, page, limit);
  } catch (error) {
    next(error);
  }
};

export const getNotifications = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationParams(req.query);
    const { read } = req.query;

    const patient = await Patient.findOne({ uhid: req.params.uhid }).lean();
    if (!patient) return sendError(res, "Patient not found", 404);

    const filter = { patientId: patient._id };
    if (read !== undefined) filter.read = read === "true";

    const [notifications, total] = await Promise.all([
      Notification.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      Notification.countDocuments(filter),
    ]);

    sendPaginated(res, notifications, total, page, limit);
  } catch (error) {
    next(error);
  }
};

export const submitClaim = async (req, res, next) => {
  try {
    const { uhid, invoiceId, insuranceProvider, policyNumber, claimedAmount, diagnosis } = req.body;
    if (!uhid || !insuranceProvider || !claimedAmount) {
      return sendError(res, "uhid, insuranceProvider, and claimedAmount are required", 400);
    }

    const patient = await Patient.findOne({ uhid }).lean();
    if (!patient) return sendError(res, "Patient not found", 404);

    const claim = await InsuranceClaim.create({
      patientId: patient._id,
      invoiceId,
      insuranceProvider,
      policyNumber,
      claimedAmount,
      diagnosis,
    });

    await AuditLog.create({
      userId: req.user.id,
      action: "submit_insurance_claim",
      entityType: "InsuranceClaim",
      entityId: claim._id,
      details: { uhid, insuranceProvider, claimedAmount },
    });

    sendSuccess(res, claim, "Insurance claim submitted", 201);
  } catch (error) {
    next(error);
  }
};

export const getFamilyMembers = async (req, res, next) => {
  try {
    const patient = await Patient.findOne({ uhid: req.params.uhid }).lean();
    if (!patient) return sendError(res, "Patient not found", 404);

    const members = await FamilyMember.find({ patientId: patient._id }).lean();
    sendSuccess(res, members);
  } catch (error) {
    next(error);
  }
};
