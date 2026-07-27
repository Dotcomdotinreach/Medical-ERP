import mongoose from "mongoose";
import BloodUnit from "../models/BloodUnit.js";
import Patient from "../models/Patient.js";
import Doctor from "../models/Doctor.js";
import { sendSuccess, sendError, sendPaginated } from "../utils/apiResponse.js";
import { getPaginationParams } from "../utils/pagination.js";

// ── Inline models (no separate model files) ────────────────────────────────

const donorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    age: { type: Number },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      required: true,
    },
    phone: { type: String },
    email: { type: String },
    address: { type: String },
    weight: { type: Number },
    hemoglobin: { type: Number },
    lastDonationDate: { type: Date },
    totalDonations: { type: Number, default: 0 },
    screeningResult: { type: String, enum: ["pass", "fail", "pending"], default: "pending" },
    status: { type: String, enum: ["eligible", "ineligible", "deferred"], default: "eligible" },
  },
  { timestamps: true }
);

const collectionSchema = new mongoose.Schema(
  {
    donorId: { type: mongoose.Schema.Types.ObjectId, ref: "Donor", required: true },
    bloodGroup: { type: String, required: true },
    volume: { type: Number },
    collectionDate: { type: Date, default: Date.now },
    collectedBy: { type: String },
    bagType: { type: String },
    bagLotNumber: { type: String },
    status: { type: String, enum: ["collected", "processing", "completed"], default: "collected" },
  },
  { timestamps: true }
);

const processingSchema = new mongoose.Schema(
  {
    collectionId: { type: mongoose.Schema.Types.ObjectId, ref: "BloodCollection", required: true },
    wholeBloodUnitId: { type: mongoose.Schema.Types.ObjectId, ref: "BloodUnit" },
    components: [
      {
        type: { type: String, enum: ["Packed RBC", "Plasma", "Platelet", "Cryoprecipitate"] },
        unitId: { type: mongoose.Schema.Types.ObjectId, ref: "BloodUnit" },
        volume: { type: Number },
      },
    ],
    processedBy: { type: String },
    processedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const labTestSchema = new mongoose.Schema(
  {
    bloodUnitId: { type: mongoose.Schema.Types.ObjectId, ref: "BloodUnit", required: true },
    hiv: { type: String, enum: ["reactive", "non-reactive", "pending"], default: "pending" },
    hepatitisB: { type: String, enum: ["reactive", "non-reactive", "pending"], default: "pending" },
    hepatitisC: { type: String, enum: ["reactive", "non-reactive", "pending"], default: "pending" },
    syphilis: { type: String, enum: ["reactive", "non-reactive", "pending"], default: "pending" },
    malaria: { type: String, enum: "reactive non-reactive pending".split(" "), default: "pending" },
    bloodGroupConfirmed: { type: String },
    testedBy: { type: String },
    testedAt: { type: Date, default: Date.now },
    result: { type: String, enum: ["pass", "fail", "pending"], default: "pending" },
  },
  { timestamps: true }
);

const bloodRequestSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
    bloodGroup: { type: String, required: true },
    component: { type: String, default: "Whole Blood" },
    unitsRequired: { type: Number, default: 1 },
    urgency: { type: String, enum: ["routine", "urgent", "emergency"], default: "routine" },
    reason: { type: String },
    status: { type: String, enum: ["pending", "approved", "fulfilled", "cancelled"], default: "pending" },
    requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const crossmatchSchema = new mongoose.Schema(
  {
    requestId: { type: mongoose.Schema.Types.ObjectId, ref: "BloodRequest", required: true },
    bloodUnitId: { type: mongoose.Schema.Types.ObjectId, ref: "BloodUnit", required: true },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    crossmatchType: { type: String, enum: ["major", "minor", "compatibility"], default: "major" },
    result: { type: String, enum: ["compatible", "incompatible", "pending"], default: "pending" },
    testedBy: { type: String },
    testedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const reservationSchema = new mongoose.Schema(
  {
    requestId: { type: mongoose.Schema.Types.ObjectId, ref: "BloodRequest" },
    bloodUnitId: { type: mongoose.Schema.Types.ObjectId, ref: "BloodUnit", required: true },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    reservedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reservedUntil: { type: Date },
    status: { type: String, enum: ["active", "released", "converted"], default: "active" },
  },
  { timestamps: true }
);

const issueSchema = new mongoose.Schema(
  {
    requestId: { type: mongoose.Schema.Types.ObjectId, ref: "BloodRequest" },
    bloodUnitId: { type: mongoose.Schema.Types.ObjectId, ref: "BloodUnit", required: true },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    issuedTo: { type: String },
    issuedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    issuedAt: { type: Date, default: Date.now },
    bedsideVerified: { type: Boolean, default: false },
    verifiedBy: { type: String },
    verifiedAt: { type: Date },
    status: { type: String, enum: ["issued", "verified", "returned"], default: "issued" },
  },
  { timestamps: true }
);

const transfusionSchema = new mongoose.Schema(
  {
    issueId: { type: mongoose.Schema.Types.ObjectId, ref: "BloodIssue", required: true },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    bloodUnitId: { type: mongoose.Schema.Types.ObjectId, ref: "BloodUnit", required: true },
    startTime: { type: Date },
    endTime: { type: Date },
    volumeTransfused: { type: Number },
    vitals: [
      {
        heartRate: Number,
        temperature: Number,
        bpSystolic: Number,
        bpDiastolic: Number,
        spo2: Number,
        recordedAt: { type: Date, default: Date.now },
      },
    ],
    status: { type: String, enum: ["started", "completed", "stopped"], default: "started" },
    outcome: { type: String, enum: ["successful", "reaction", "stopped"], default: "successful" },
  },
  { timestamps: true }
);

const adverseReactionSchema = new mongoose.Schema(
  {
    transfusionId: { type: mongoose.Schema.Types.ObjectId, ref: "TransfusionRecord" },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    bloodUnitId: { type: mongoose.Schema.Types.ObjectId, ref: "BloodUnit" },
    reactionType: { type: String, enum: ["febrile", "allergic", "hemolytic", "circulatory", "delayed"], required: true },
    severity: { type: String, enum: ["mild", "moderate", "severe", "fatal"], required: true },
    symptoms: [{ type: String }],
    treatment: { type: String },
    outcome: { type: String },
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reportedAt: { type: Date, default: Date.now },
    investigationStatus: { type: String, enum: ["open", "investigating", "closed"], default: "open" },
  },
  { timestamps: true }
);

const disposalSchema = new mongoose.Schema(
  {
    bloodUnitId: { type: mongoose.Schema.Types.ObjectId, ref: "BloodUnit", required: true },
    reason: { type: String, enum: ["expired", "contaminated", "reactive", "damaged", "other"], required: true },
    disposedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    disposedAt: { type: Date, default: Date.now },
    authorizationBy: { type: String },
    notes: { type: String },
  },
  { timestamps: true }
);

const coldChainSchema = new mongoose.Schema(
  {
    location: { type: String, required: true },
    temperature: { type: Number, required: true },
    unit: { type: String, default: "Celsius" },
    recordedBy: { type: String },
    recordedAt: { type: Date, default: Date.now },
    status: { type: String, enum: ["normal", "alert", "critical"], default: "normal" },
  },
  { timestamps: true }
);

const qualityControlSchema = new mongoose.Schema(
  {
    testType: { type: String, required: true },
    component: { type: String },
    result: { type: String, enum: ["pass", "fail", "pending"], default: "pending" },
    parameters: { type: mongoose.Schema.Types.Mixed },
    testedBy: { type: String },
    testedAt: { type: Date, default: Date.now },
    correctiveAction: { type: String },
  },
  { timestamps: true }
);

const Donor = mongoose.models.Donor || mongoose.model("Donor", donorSchema);
const BloodCollection = mongoose.models.BloodCollection || mongoose.model("BloodCollection", collectionSchema);
const BloodProcessing = mongoose.models.BloodProcessing || mongoose.model("BloodProcessing", processingSchema);
const LabTest = mongoose.models.LabTest || mongoose.model("LabTest", labTestSchema);
const BloodRequest = mongoose.models.BloodRequest || mongoose.model("BloodRequest", bloodRequestSchema);
const Crossmatch = mongoose.models.Crossmatch || mongoose.model("Crossmatch", crossmatchSchema);
const BloodReservation = mongoose.models.BloodReservation || mongoose.model("BloodReservation", reservationSchema);
const BloodIssue = mongoose.models.BloodIssue || mongoose.model("BloodIssue", issueSchema);
const TransfusionRecord = mongoose.models.TransfusionRecord || mongoose.model("TransfusionRecord", transfusionSchema);
const AdverseReaction = mongoose.models.AdverseReaction || mongoose.model("AdverseReaction", adverseReactionSchema);
const BloodDisposal = mongoose.models.BloodDisposal || mongoose.model("BloodDisposal", disposalSchema);
const ColdChainLog = mongoose.models.ColdChainLog || mongoose.model("ColdChainLog", coldChainSchema);
const QualityControl = mongoose.models.QualityControl || mongoose.model("QualityControl", qualityControlSchema);

// ── 1. Dashboard KPIs ──────────────────────────────────────────────────────

export const dashboard = async (req, res) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const [availableByGroup, pendingRequests, adverseToday, totalUnits, expiringSoon] =
      await Promise.all([
        BloodUnit.aggregate([
          { $match: { status: "available" } },
          { $group: { _id: "$bloodGroup", count: { $sum: 1 }, volume: { $sum: "$volume" } } },
          { $sort: { _id: 1 } },
        ]),
        BloodRequest.countDocuments({ status: "pending" }),
        AdverseReaction.countDocuments({
          reportedAt: { $gte: todayStart, $lte: todayEnd },
        }),
        BloodUnit.countDocuments(),
        BloodUnit.countDocuments({
          status: "available",
          expiryDate: { $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
        }),
      ]);

    const bloodGroupStock = {};
    availableByGroup.forEach((g) => {
      bloodGroupStock[g._id] = { units: g.count, volume: g.volume };
    });

    return sendSuccess(res, {
      totalUnits,
      availableByGroup: bloodGroupStock,
      pendingRequests,
      adverseReactionsToday: adverseToday,
      expiringSoon,
    });
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// ── 2. List inventory ──────────────────────────────────────────────────────

export const listInventory = async (req, res) => {
  try {
    const { bloodGroup, status, component } = req.query;
    const filter = {};
    if (bloodGroup) filter.bloodGroup = bloodGroup;
    if (status) filter.status = status;
    if (component) filter.component = component;

    const { page, limit, skip, sort } = getPaginationParams(req.query);
    const [units, total] = await Promise.all([
      BloodUnit.find(filter).skip(skip).limit(limit).sort(sort),
      BloodUnit.countDocuments(filter),
    ]);

    return sendPaginated(res, units, total, page, limit);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// ── 3. Add blood unit ──────────────────────────────────────────────────────

export const addUnit = async (req, res) => {
  try {
    const { bloodGroup, type, volume, collectionDate, expiryDate, donorId, batchNo } =
      req.body;

    const unit = await BloodUnit.create({
      bloodGroup,
      type,
      volume,
      collectionDate: collectionDate || new Date(),
      expiryDate,
      donorId,
      batchNo,
      status: "available",
    });

    return sendSuccess(res, unit, "Blood unit added", 201);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// ── 4. Register donor ──────────────────────────────────────────────────────

export const registerDonor = async (req, res) => {
  try {
    const { name, age, gender, bloodGroup, phone, email, address, weight, hemoglobin } =
      req.body;

    const donor = await Donor.create({
      name,
      age,
      gender,
      bloodGroup,
      phone,
      email,
      address,
      weight,
      hemoglobin,
    });

    return sendSuccess(res, donor, "Donor registered", 201);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// ── 5. List donors ─────────────────────────────────────────────────────────

export const listDonors = async (req, res) => {
  try {
    const { bloodGroup, status, search } = req.query;
    const filter = {};
    if (bloodGroup) filter.bloodGroup = bloodGroup;
    if (status) filter.status = status;

    const { page, limit, skip, sort } = getPaginationParams(req.query);

    let donors = await Donor.find(filter).skip(skip).limit(limit).sort(sort);
    const total = await Donor.countDocuments(filter);

    if (search) {
      const s = search.toLowerCase();
      donors = donors.filter(
        (d) =>
          d.name?.toLowerCase().includes(s) ||
          d.phone?.includes(s) ||
          d.email?.toLowerCase().includes(s)
      );
    }

    return sendPaginated(res, donors, total, page, limit);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// ── 6. Get donor screening ─────────────────────────────────────────────────

export const getDonorScreening = async (req, res) => {
  try {
    const { id } = req.params;
    const donor = await Donor.findById(id);
    if (!donor) return sendError(res, "Donor not found", 404);

    const collections = await BloodCollection.find({ donorId: id })
      .sort({ collectionDate: -1 })
      .limit(5);

    return sendSuccess(res, {
      donor,
      screeningResult: donor.screeningResult,
      collections,
    });
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// ── 7. Record blood collection ─────────────────────────────────────────────

export const collectBlood = async (req, res) => {
  try {
    const { donorId, bloodGroup, volume, collectedBy, bagType, bagLotNumber } = req.body;

    const donor = await Donor.findById(donorId);
    if (!donor) return sendError(res, "Donor not found", 404);

    const collection = await BloodCollection.create({
      donorId,
      bloodGroup: bloodGroup || donor.bloodGroup,
      volume,
      collectedBy,
      bagType,
      bagLotNumber,
    });

    donor.lastDonationDate = new Date();
    donor.totalDonations = (donor.totalDonations || 0) + 1;
    await donor.save();

    return sendSuccess(res, collection, "Blood collection recorded", 201);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// ── 8. Process blood into components ───────────────────────────────────────

export const processComponents = async (req, res) => {
  try {
    const { collectionId, processedBy, components } = req.body;

    const collection = await BloodCollection.findById(collectionId);
    if (!collection) return sendError(res, "Collection not found", 404);

    const createdUnits = [];
    const componentEntries = [];

    for (const comp of components || []) {
      const unit = await BloodUnit.create({
        bloodGroup: collection.bloodGroup,
        type: comp.type,
        volume: comp.volume,
        collectionDate: collection.collectionDate,
        donorId: collection.donorId,
        batchNo: collection.bagLotNumber,
        status: "available",
      });
      createdUnits.push(unit);
      componentEntries.push({ type: comp.type, unitId: unit._id, volume: comp.volume });
    }

    const processing = await BloodProcessing.create({
      collectionId,
      wholeBloodUnitId: createdUnits[0]?._id,
      components: componentEntries,
      processedBy,
    });

    collection.status = "processing";
    await collection.save();

    return sendSuccess(res, { processing, units: createdUnits }, "Blood processed into components", 201);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// ── 9. Run lab test ────────────────────────────────────────────────────────

export const runLabTest = async (req, res) => {
  try {
    const { bloodUnitId, hiv, hepatitisB, hepatitisC, syphilis, malaria, bloodGroupConfirmed, testedBy } =
      req.body;

    const unit = await BloodUnit.findById(bloodUnitId);
    if (!unit) return sendError(res, "Blood unit not found", 404);

    const allNonReactive =
      hiv === "non-reactive" &&
      hepatitisB === "non-reactive" &&
      hepatitisC === "non-reactive" &&
      syphilis === "non-reactive" &&
      malaria === "non-reactive";

    const labTest = await LabTest.create({
      bloodUnitId,
      hiv: hiv || "pending",
      hepatitisB: hepatitisB || "pending",
      hepatitisC: hepatitisC || "pending",
      syphilis: syphilis || "pending",
      malaria: malaria || "pending",
      bloodGroupConfirmed,
      testedBy,
      result: allNonReactive ? "pass" : "fail",
    });

    if (!allNonReactive) {
      unit.status = "discarded";
      await unit.save();
    }

    return sendSuccess(res, labTest, "Lab test completed", 201);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// ── 10. List blood requests ────────────────────────────────────────────────

export const listRequests = async (req, res) => {
  try {
    const { status, urgency, bloodGroup } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (urgency) filter.urgency = urgency;
    if (bloodGroup) filter.bloodGroup = bloodGroup;

    const { page, limit, skip, sort } = getPaginationParams(req.query);
    const [requests, total] = await Promise.all([
      BloodRequest.find(filter)
        .populate("patientId", "uhid name blood")
        .populate("doctorId", "name dept")
        .skip(skip)
        .limit(limit)
        .sort(sort),
      BloodRequest.countDocuments(filter),
    ]);

    return sendPaginated(res, requests, total, page, limit);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// ── 11. Create blood request ───────────────────────────────────────────────

export const createRequest = async (req, res) => {
  try {
    const { patientId, doctorId, bloodGroup, component, unitsRequired, urgency, reason } =
      req.body;

    const request = await BloodRequest.create({
      patientId,
      doctorId,
      bloodGroup,
      component,
      unitsRequired: unitsRequired || 1,
      urgency: urgency || "routine",
      reason,
      requestedBy: req.user?.id,
    });

    return sendSuccess(res, request, "Blood request created", 201);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// ── 12. Crossmatch test ────────────────────────────────────────────────────

export const crossmatch = async (req, res) => {
  try {
    const { requestId, bloodUnitId, patientId, crossmatchType, testedBy } = req.body;

    const unit = await BloodUnit.findById(bloodUnitId);
    if (!unit) return sendError(res, "Blood unit not found", 404);
    if (unit.status !== "available") return sendError(res, "Blood unit is not available", 400);

    const patient = await Patient.findById(patientId);
    if (!patient) return sendError(res, "Patient not found", 404);

    const result = unit.bloodGroup === patient.blood ? "compatible" : "incompatible";

    const test = await Crossmatch.create({
      requestId,
      bloodUnitId,
      patientId,
      crossmatchType: crossmatchType || "major",
      result,
      testedBy,
    });

    return sendSuccess(res, test, `Crossmatch result: ${result}`, 201);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// ── 13. Reserve blood unit ─────────────────────────────────────────────────

export const reserveUnit = async (req, res) => {
  try {
    const { requestId, bloodUnitId, patientId, reservedUntil } = req.body;

    const unit = await BloodUnit.findById(bloodUnitId);
    if (!unit) return sendError(res, "Blood unit not found", 404);
    if (unit.status !== "available") return sendError(res, "Blood unit is not available", 400);

    unit.status = "reserved";
    await unit.save();

    const reservation = await BloodReservation.create({
      requestId,
      bloodUnitId,
      patientId,
      reservedBy: req.user?.id,
      reservedUntil,
    });

    return sendSuccess(res, reservation, "Blood unit reserved", 201);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// ── 14. Issue blood ────────────────────────────────────────────────────────

export const issueBlood = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { bloodUnitId, patientId, issuedTo } = req.body;

    const unit = await BloodUnit.findById(bloodUnitId);
    if (!unit) return sendError(res, "Blood unit not found", 404);
    if (unit.status === "issued") return sendError(res, "Blood unit already issued", 400);

    unit.status = "issued";
    await unit.save();

    const issue = await BloodIssue.create({
      requestId,
      bloodUnitId,
      patientId,
      issuedTo,
      issuedBy: req.user?.id,
    });

    if (requestId) {
      await BloodRequest.findByIdAndUpdate(requestId, { status: "fulfilled" });
    }

    const transfusion = await TransfusionRecord.create({
      issueId: issue._id,
      patientId,
      bloodUnitId,
      status: "started",
    });

    return sendSuccess(res, { issue, transfusion }, "Blood issued", 201);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// ── 15. Bedside verification ───────────────────────────────────────────────

export const bedsideVerify = async (req, res) => {
  try {
    const { issueId } = req.params;
    const { verifiedBy, patientIdentityMatched, bloodGroupMatched, notes } = req.body;

    const issue = await BloodIssue.findById(issueId);
    if (!issue) return sendError(res, "Issue record not found", 404);

    issue.bedsideVerified = true;
    issue.verifiedBy = verifiedBy;
    issue.verifiedAt = new Date();
    issue.status = "verified";
    await issue.save();

    const transfusion = await TransfusionRecord.findOne({ issueId: issue._id });
    if (transfusion) {
      transfusion.startTime = new Date();
      await transfusion.save();
    }

    return sendSuccess(
      res,
      {
        issueId,
        verifiedBy,
        patientIdentityMatched,
        bloodGroupMatched,
        verifiedAt: issue.verifiedAt,
      },
      "Bedside verification completed"
    );
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// ── 16. List transfusions ──────────────────────────────────────────────────

export const listTransfusions = async (req, res) => {
  try {
    const { status, patientId } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (patientId) filter.patientId = patientId;

    const { page, limit, skip, sort } = getPaginationParams(req.query);
    const [records, total] = await Promise.all([
      TransfusionRecord.find(filter)
        .populate("patientId", "uhid name")
        .populate("bloodUnitId", "bloodGroup type batchNo")
        .skip(skip)
        .limit(limit)
        .sort(sort),
      TransfusionRecord.countDocuments(filter),
    ]);

    return sendPaginated(res, records, total, page, limit);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// ── 17. Report adverse reaction ────────────────────────────────────────────

export const reportReaction = async (req, res) => {
  try {
    const {
      transfusionId,
      patientId,
      bloodUnitId,
      reactionType,
      severity,
      symptoms,
      treatment,
      outcome,
    } = req.body;

    const reaction = await AdverseReaction.create({
      transfusionId,
      patientId,
      bloodUnitId,
      reactionType,
      severity,
      symptoms,
      treatment,
      outcome,
      reportedBy: req.user?.id,
    });

    if (transfusionId) {
      await TransfusionRecord.findByIdAndUpdate(transfusionId, {
        status: "stopped",
        outcome: "reaction",
      });
    }

    return sendSuccess(res, reaction, "Adverse reaction reported", 201);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// ── 18. Dispose blood unit ─────────────────────────────────────────────────

export const disposeUnit = async (req, res) => {
  try {
    const { bloodUnitId, reason, authorizationBy, notes } = req.body;

    const unit = await BloodUnit.findById(bloodUnitId);
    if (!unit) return sendError(res, "Blood unit not found", 404);
    if (unit.status === "issued") return sendError(res, "Cannot dispose issued unit", 400);

    unit.status = "discarded";
    await unit.save();

    const disposal = await BloodDisposal.create({
      bloodUnitId,
      reason,
      disposedBy: req.user?.id,
      authorizationBy,
      notes,
    });

    return sendSuccess(res, disposal, "Blood unit disposed");
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// ── 19. Cold chain temperature logs ────────────────────────────────────────

export const getColdChain = async (req, res) => {
  try {
    const { location } = req.query;
    const filter = {};
    if (location) filter.location = location;

    const { page, limit, skip, sort } = getPaginationParams(req.query);
    const [logs, total] = await Promise.all([
      ColdChainLog.find(filter).skip(skip).limit(limit).sort(sort),
      ColdChainLog.countDocuments(filter),
    ]);

    return sendPaginated(res, logs, total, page, limit);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// ── 20. Quality control records ────────────────────────────────────────────

export const getQuality = async (req, res) => {
  try {
    const { testType, component, result } = req.query;
    const filter = {};
    if (testType) filter.testType = testType;
    if (component) filter.component = component;
    if (result) filter.result = result;

    const { page, limit, skip, sort } = getPaginationParams(req.query);
    const [records, total] = await Promise.all([
      QualityControl.find(filter).skip(skip).limit(limit).sort(sort),
      QualityControl.countDocuments(filter),
    ]);

    return sendPaginated(res, records, total, page, limit);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

export const getDonor = async (req, res) => {
  try {
    const donor = await Donor.findById(req.params.id).lean();
    if (!donor) return sendError(res, "Donor not found", 404);
    return sendSuccess(res, donor);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

export const getUnit = async (req, res) => {
  try {
    const unit = await BloodUnit.findById(req.params.id).lean();
    if (!unit) return sendError(res, "Unit not found", 404);
    return sendSuccess(res, unit);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

export const updateRequest = async (req, res) => {
  try {
    const request = await BloodRequest.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!request) return sendError(res, "Request not found", 404);
    return sendSuccess(res, request, "Request updated");
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

export const listCrossmatches = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.result = status;
    const { page, limit, skip, sort } = getPaginationParams(req.query);
    const [records, total] = await Promise.all([
      Crossmatch.find(filter)
        .populate("patientId", "firstName lastName uhid")
        .populate("bloodUnitId")
        .skip(skip)
        .limit(limit)
        .sort(sort || "-createdAt")
        .lean(),
      Crossmatch.countDocuments(filter),
    ]);
    return sendPaginated(res, records, total, page, limit);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

export const updateCrossmatch = async (req, res) => {
  try {
    const record = await Crossmatch.findByIdAndUpdate(
      req.params.id,
      { $set: { result: req.body.result } },
      { new: true }
    );
    if (!record) return sendError(res, "Crossmatch record not found", 404);
    return sendSuccess(res, record, "Crossmatch updated");
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

export const createTransfusion = async (req, res) => {
  try {
    const record = await TransfusionRecord.create(req.body);
    return sendSuccess(res, record, "Transfusion record created", 201);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};
