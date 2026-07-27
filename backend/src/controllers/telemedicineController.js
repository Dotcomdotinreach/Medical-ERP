import mongoose from "mongoose";
import Patient from "../models/Patient.js";
import { sendSuccess, sendError, sendPaginated } from "../utils/apiResponse.js";
import { getPaginationParams } from "../utils/pagination.js";

const virtualAppointmentSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    uhid: { type: String, required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
    scheduledDate: { type: Date, required: true },
    reason: { type: String },
    status: {
      type: String,
      enum: ["Scheduled", "Checked In", "In Session", "Completed", "Cancelled", "No Show"],
      default: "Scheduled",
    },
    sessionUrl: { type: String },
    type: { type: String, enum: ["Initial", "Follow-Up", "Urgent"], default: "Initial" },
  },
  { timestamps: true }
);

const intakeSchema = new mongoose.Schema(
  {
    appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: "VirtualAppointment", required: true },
    chiefComplaint: { type: String },
    historyOfPresentIllness: { type: String },
    medications: [{ type: String }],
    allergies: [{ type: String }],
    vitals: {
      temperature: { type: Number },
      heartRate: { type: Number },
      respiratoryRate: { type: Number },
      bloodPressure: { type: String },
      oxygenSaturation: { type: Number },
    },
    recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const consentSchema = new mongoose.Schema(
  {
    appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: "VirtualAppointment", required: true },
    uhid: { type: String, required: true },
    consentText: { type: String },
    signedAt: { type: Date },
    signedBy: { type: String },
    ipAddress: { type: String },
    status: { type: String, enum: ["Pending", "Signed", "Declined"], default: "Pending" },
  },
  { timestamps: true }
);

const clinicalNoteSchema = new mongoose.Schema(
  {
    appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: "VirtualAppointment", required: true },
    uhid: { type: String, required: true },
    subjective: { type: String },
    objective: { type: String },
    assessment: { type: String },
    plan: { type: String },
    recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const ePrescriptionSchema = new mongoose.Schema(
  {
    appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: "VirtualAppointment", required: true },
    uhid: { type: String, required: true },
    medications: [
      {
        name: { type: String },
        dosage: { type: String },
        frequency: { type: String },
        duration: { type: String },
        instructions: { type: String },
      },
    ],
    sentAt: { type: Date, default: Date.now },
    status: { type: String, enum: ["Sent", "Dispensed", "Cancelled"], default: "Sent" },
    prescribedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const labOrderSchema = new mongoose.Schema(
  {
    appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: "VirtualAppointment", required: true },
    uhid: { type: String, required: true },
    tests: [{ name: String, instructions: String }],
    urgency: { type: String, enum: ["Routine", "Urgent", "STAT"], default: "Routine" },
    status: { type: String, enum: ["Ordered", "Collected", "Completed"], default: "Ordered" },
    orderedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const radOrderSchema = new mongoose.Schema(
  {
    appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: "VirtualAppointment", required: true },
    uhid: { type: String, required: true },
    studyType: { type: String },
    bodyPart: { type: String },
    clinicalIndication: { type: String },
    urgency: { type: String, enum: ["Routine", "Urgent"], default: "Routine" },
    status: { type: String, enum: ["Ordered", "Scheduled", "Completed"], default: "Ordered" },
    orderedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const messageSchema = new mongoose.Schema(
  {
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    recipientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    subject: { type: String },
    body: { type: String, required: true },
    read: { type: Boolean, default: false },
    appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: "VirtualAppointment" },
  },
  { timestamps: true }
);

const billingSchema = new mongoose.Schema(
  {
    appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: "VirtualAppointment", required: true },
    uhid: { type: String, required: true },
    consultationFee: { type: Number },
    additionalCharges: [{ description: String, amount: Number }],
    totalAmount: { type: Number },
    paymentStatus: { type: String, enum: ["Pending", "Paid", "Partial", "Refunded"], default: "Pending" },
    paymentMethod: { type: String },
  },
  { timestamps: true }
);

const VirtualAppointment = mongoose.models.VirtualAppointment || mongoose.model("VirtualAppointment", virtualAppointmentSchema);
const Intake = mongoose.models.Intake || mongoose.model("Intake", intakeSchema);
const Consent = mongoose.models.Consent || mongoose.model("Consent", consentSchema);
const ClinicalNote = mongoose.models.ClinicalNote || mongoose.model("ClinicalNote", clinicalNoteSchema);
const EPrescription = mongoose.models.EPrescription || mongoose.model("EPrescription", ePrescriptionSchema);
const LabOrderTele = mongoose.models.LabOrderTele || mongoose.model("LabOrderTele", labOrderSchema);
const RadOrder = mongoose.models.RadOrder || mongoose.model("RadOrder", radOrderSchema);
const Message = mongoose.models.Message || mongoose.model("Message", messageSchema);
const Billing = mongoose.models.Billing || mongoose.model("Billing", billingSchema);

export const dashboard = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [appointments, waitingRoom, unreadMessages] = await Promise.all([
      VirtualAppointment.countDocuments({ scheduledDate: { $gte: today, $lt: tomorrow } }),
      VirtualAppointment.countDocuments({ status: "Checked In" }),
      Message.countDocuments({ recipientId: req.user.id, read: false }),
    ]);

    sendSuccess(res, { appointments, waitingRoom, unreadMessages });
  } catch (error) {
    next(error);
  }
};

export const listAppointments = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationParams(req.query);

    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.date) {
      const d = new Date(req.query.date);
      const nextDay = new Date(d);
      nextDay.setDate(nextDay.getDate() + 1);
      filter.scheduledDate = { $gte: d, $lt: nextDay };
    }
    if (req.query.search) {
      filter.$or = [
        { uhid: { $regex: req.query.search, $options: "i" } },
        { reason: { $regex: req.query.search, $options: "i" } },
      ];
    }

    const [appointments, total] = await Promise.all([
      VirtualAppointment.find(filter)
        .populate("patientId", "uhid name phone")
        .populate("doctorId", "name dept")
        .sort(sort || "-scheduledDate")
        .skip(skip)
        .limit(limit)
        .lean(),
      VirtualAppointment.countDocuments(filter),
    ]);

    sendPaginated(res, appointments, total, page, limit);
  } catch (error) {
    next(error);
  }
};

export const bookAppointment = async (req, res, next) => {
  try {
    const { uhid, doctorId, scheduledDate, reason, type } = req.body;

    if (!uhid || !scheduledDate) return sendError(res, "UHID and scheduled date are required", 400);

    const patient = await Patient.findOne({ uhid }).lean();
    if (!patient) return sendError(res, "Patient not found", 404);

    const appointment = await VirtualAppointment.create({
      patientId: patient._id,
      uhid,
      doctorId,
      scheduledDate,
      reason,
      type,
      status: "Scheduled",
    });

    sendSuccess(res, appointment, "Virtual appointment booked", 201);
  } catch (error) {
    next(error);
  }
};

export const getWaitingRoom = async (req, res, next) => {
  try {
    const patients = await VirtualAppointment.find({ status: "Checked In" })
      .populate("patientId", "uhid name phone age gender")
      .sort("updatedAt")
      .lean();

    sendSuccess(res, patients);
  } catch (error) {
    next(error);
  }
};

export const startSession = async (req, res, next) => {
  try {
    const { appointmentId } = req.params;
    const appointment = await VirtualAppointment.findById(appointmentId);
    if (!appointment) return sendError(res, "Appointment not found", 404);

    appointment.status = "In Session";
    appointment.sessionUrl = `https://meet.medical-erp.com/${appointmentId}`;
    await appointment.save();

    sendSuccess(res, appointment, "Video session started");
  } catch (error) {
    next(error);
  }
};

export const endSession = async (req, res, next) => {
  try {
    const { appointmentId } = req.params;
    const appointment = await VirtualAppointment.findById(appointmentId);
    if (!appointment) return sendError(res, "Appointment not found", 404);

    appointment.status = "Completed";
    await appointment.save();

    sendSuccess(res, appointment, "Video session ended");
  } catch (error) {
    next(error);
  }
};

export const recordIntake = async (req, res, next) => {
  try {
    const { appointmentId } = req.params;
    const {
      chiefComplaint, historyOfPresentIllness, medications, allergies, vitals,
    } = req.body;

    const appointment = await VirtualAppointment.findById(appointmentId).lean();
    if (!appointment) return sendError(res, "Appointment not found", 404);

    const intake = await Intake.create({
      appointmentId,
      chiefComplaint,
      historyOfPresentIllness,
      medications,
      allergies,
      vitals,
      recordedBy: req.user.id,
    });

    await VirtualAppointment.findByIdAndUpdate(appointmentId, { status: "Checked In" });

    sendSuccess(res, intake, "Patient intake recorded", 201);
  } catch (error) {
    next(error);
  }
};

export const getConsent = async (req, res, next) => {
  try {
    const { appointmentId } = req.params;
    const consent = await Consent.findOne({ appointmentId }).lean();
    sendSuccess(res, consent);
  } catch (error) {
    next(error);
  }
};

export const signConsent = async (req, res, next) => {
  try {
    const { appointmentId } = req.params;
    const { signedBy } = req.body;

    const appointment = await VirtualAppointment.findById(appointmentId).lean();
    if (!appointment) return sendError(res, "Appointment not found", 404);

    let consent = await Consent.findOne({ appointmentId });
    if (!consent) {
      consent = await Consent.create({
        appointmentId,
        uhid: appointment.uhid,
        consentText: "I consent to receive telemedicine consultation services.",
        signedAt: new Date(),
        signedBy: signedBy || appointment.uhid,
        ipAddress: req.ip,
        status: "Signed",
      });
    } else {
      consent.signedAt = new Date();
      consent.signedBy = signedBy || appointment.uhid;
      consent.ipAddress = req.ip;
      consent.status = "Signed";
      await consent.save();
    }

    sendSuccess(res, consent, "Consent signed");
  } catch (error) {
    next(error);
  }
};

export const addNotes = async (req, res, next) => {
  try {
    const { appointmentId } = req.params;
    const { subjective, objective, assessment, plan } = req.body;

    const appointment = await VirtualAppointment.findById(appointmentId).lean();
    if (!appointment) return sendError(res, "Appointment not found", 404);

    const note = await ClinicalNote.create({
      appointmentId,
      uhid: appointment.uhid,
      subjective,
      objective,
      assessment,
      plan,
      recordedBy: req.user.id,
    });

    sendSuccess(res, note, "Clinical notes added", 201);
  } catch (error) {
    next(error);
  }
};

export const sendPrescription = async (req, res, next) => {
  try {
    const { appointmentId } = req.params;
    const { medications } = req.body;

    const appointment = await VirtualAppointment.findById(appointmentId).lean();
    if (!appointment) return sendError(res, "Appointment not found", 404);

    const prescription = await EPrescription.create({
      appointmentId,
      uhid: appointment.uhid,
      medications,
      prescribedBy: req.user.id,
    });

    sendSuccess(res, prescription, "E-prescription sent", 201);
  } catch (error) {
    next(error);
  }
};

export const orderLab = async (req, res, next) => {
  try {
    const { appointmentId } = req.params;
    const { tests, urgency } = req.body;

    const appointment = await VirtualAppointment.findById(appointmentId).lean();
    if (!appointment) return sendError(res, "Appointment not found", 404);

    const order = await LabOrderTele.create({
      appointmentId,
      uhid: appointment.uhid,
      tests,
      urgency,
      orderedBy: req.user.id,
    });

    sendSuccess(res, order, "Lab order placed", 201);
  } catch (error) {
    next(error);
  }
};

export const orderRadiology = async (req, res, next) => {
  try {
    const { appointmentId } = req.params;
    const { studyType, bodyPart, clinicalIndication, urgency } = req.body;

    const appointment = await VirtualAppointment.findById(appointmentId).lean();
    if (!appointment) return sendError(res, "Appointment not found", 404);

    const order = await RadOrder.create({
      appointmentId,
      uhid: appointment.uhid,
      studyType,
      bodyPart,
      clinicalIndication,
      urgency,
      orderedBy: req.user.id,
    });

    sendSuccess(res, order, "Radiology order placed", 201);
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationParams(req.query);

    const filter = {
      $or: [{ senderId: req.user.id }, { recipientId: req.user.id }],
    };

    const [messages, total] = await Promise.all([
      Message.find(filter)
        .populate("senderId", "name role")
        .populate("recipientId", "name role")
        .sort(sort || "-createdAt")
        .skip(skip)
        .limit(limit)
        .lean(),
      Message.countDocuments(filter),
    ]);

    sendPaginated(res, messages, total, page, limit);
  } catch (error) {
    next(error);
  }
};

export const sendMessage = async (req, res, next) => {
  try {
    const { recipientId, subject, body, appointmentId } = req.body;

    if (!recipientId || !body) return sendError(res, "Recipient and message body are required", 400);

    const message = await Message.create({
      senderId: req.user.id,
      recipientId,
      subject,
      body,
      appointmentId,
    });

    sendSuccess(res, message, "Message sent", 201);
  } catch (error) {
    next(error);
  }
};

export const getBilling = async (req, res, next) => {
  try {
    const { appointmentId } = req.params;
    const billing = await Billing.findOne({ appointmentId }).lean();
    sendSuccess(res, billing);
  } catch (error) {
    next(error);
  }
};

export const scheduleFollowUp = async (req, res, next) => {
  try {
    const { appointmentId } = req.params;
    const { followUpDate, reason } = req.body;

    const original = await VirtualAppointment.findById(appointmentId).lean();
    if (!original) return sendError(res, "Appointment not found", 404);

    const followUp = await VirtualAppointment.create({
      patientId: original.patientId,
      uhid: original.uhid,
      doctorId: original.doctorId,
      scheduledDate: followUpDate,
      reason: reason || "Follow-Up",
      type: "Follow-Up",
      status: "Scheduled",
    });

    sendSuccess(res, followUp, "Follow-up scheduled", 201);
  } catch (error) {
    next(error);
  }
};

export const getAnalytics = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [statusDistribution, totalThisMonth, avgPerDay] = await Promise.all([
      VirtualAppointment.aggregate([
        { $match: { scheduledDate: { $gte: thirtyDaysAgo } } },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
      VirtualAppointment.countDocuments({ scheduledDate: { $gte: thirtyDaysAgo } }),
      VirtualAppointment.aggregate([
        { $match: { scheduledDate: { $gte: thirtyDaysAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$scheduledDate" } },
            count: { $sum: 1 },
          },
        },
        { $group: { _id: null, avg: { $avg: "$count" } } },
      ]),
    ]);

    sendSuccess(res, {
      statusDistribution,
      totalThisMonth,
      avgPerDay: avgPerDay[0]?.avg || 0,
    });
  } catch (error) {
    next(error);
  }
};
