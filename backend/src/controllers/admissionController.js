import Admission from "../models/Admission.js";
import Bed from "../models/Bed.js";
import Patient from "../models/Patient.js";
import Doctor from "../models/Doctor.js";
import { sendSuccess, sendError, sendPaginated } from "../utils/apiResponse.js";
import { getPaginationParams } from "../utils/pagination.js";

export const listAdmissions = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationParams(req.query);
    const { status, dept, date } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (dept) filter.dept = dept;
    if (date) {
      const d = new Date(date);
      const nextDay = new Date(d);
      nextDay.setDate(nextDay.getDate() + 1);
      filter.admitDate = { $gte: d, $lt: nextDay };
    }

    const [admissions, total] = await Promise.all([
      Admission.find(filter)
        .populate("patientId", "uhid name phone")
        .populate("doctorId", "name dept")
        .populate("bedId", "ward number type")
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Admission.countDocuments(filter),
    ]);

    sendPaginated(res, admissions, total, page, limit);
  } catch (error) {
    next(error);
  }
};

export const admitPatient = async (req, res, next) => {
  try {
    const { patientId, doctorId, dept, diagnosis, insurance, notes } = req.body;

    const patient = await Patient.findById(patientId).lean();
    if (!patient) return sendError(res, "Patient not found", 404);

    let bedId = req.body.bedId;
    if (!bedId) {
      const availableBed = await Bed.findOne({ state: "available", ward: dept }).lean();
      if (availableBed) bedId = availableBed._id;
    }

    const admission = await Admission.create({
      patientId,
      doctorId,
      bedId: bedId || undefined,
      dept,
      diagnosis,
      insurance,
      notes,
      status: bedId ? "active" : "pending",
    });

    if (bedId) {
      await Bed.findByIdAndUpdate(bedId, { state: "occupied", patientId });
    }

    const populated = await admission.populate([
      { path: "patientId", select: "uhid name phone" },
      { path: "doctorId", select: "name dept" },
      { path: "bedId", select: "ward number type" },
    ]);

    sendSuccess(res, populated, "Patient admitted", 201);
  } catch (error) {
    next(error);
  }
};

export const getAdmission = async (req, res, next) => {
  try {
    const admission = await Admission.findById(req.params.id)
      .populate("patientId", "uhid name phone age gender blood allergies conditions")
      .populate("doctorId", "name dept qualification")
      .populate("bedId", "ward number type state")
      .lean();
    if (!admission) return sendError(res, "Admission not found", 404);
    sendSuccess(res, admission);
  } catch (error) {
    next(error);
  }
};

export const transferPatient = async (req, res, next) => {
  try {
    const admission = await Admission.findById(req.params.id);
    if (!admission) return sendError(res, "Admission not found", 404);
    if (admission.status !== "active") {
      return sendError(res, "Can only transfer active admissions", 400);
    }

    const { bedId: newBedId } = req.body;
    const newBed = await Bed.findById(newBedId).lean();
    if (!newBed) return sendError(res, "Target bed not found", 404);
    if (newBed.state !== "available") {
      return sendError(res, "Target bed is not available", 400);
    }

    if (admission.bedId) {
      await Bed.findByIdAndUpdate(admission.bedId, {
        state: "available",
        patientId: null,
      });
    }

    await Bed.findByIdAndUpdate(newBedId, {
      state: "occupied",
      patientId: admission.patientId,
    });

    admission.bedId = newBedId;
    admission.status = "transferred";
    await admission.save();

    const populated = await admission.populate([
      { path: "patientId", select: "uhid name phone" },
      { path: "doctorId", select: "name dept" },
      { path: "bedId", select: "ward number type" },
    ]);

    sendSuccess(res, populated, "Patient transferred");
  } catch (error) {
    next(error);
  }
};

export const dischargePatient = async (req, res, next) => {
  try {
    const admission = await Admission.findById(req.params.id);
    if (!admission) return sendError(res, "Admission not found", 404);
    if (!["active", "transferred"].includes(admission.status)) {
      return sendError(res, "Cannot discharge patient in current status", 400);
    }

    if (admission.bedId) {
      await Bed.findByIdAndUpdate(admission.bedId, {
        state: "cleaning",
        patientId: null,
      });
    }

    admission.status = "discharged";
    admission.dischargeDate = new Date();
    if (req.body.notes) admission.notes = req.body.notes;
    await admission.save();

    const populated = await admission.populate([
      { path: "patientId", select: "uhid name phone" },
      { path: "doctorId", select: "name dept" },
      { path: "bedId", select: "ward number type" },
    ]);

    sendSuccess(res, populated, "Patient discharged");
  } catch (error) {
    next(error);
  }
};

export const getCurrentInpatients = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationParams(req.query);
    const { dept } = req.query;

    const filter = { status: { $in: ["active", "transferred"] } };
    if (dept) filter.dept = dept;

    const [admissions, total] = await Promise.all([
      Admission.find(filter)
        .populate("patientId", "uhid name phone age gender")
        .populate("doctorId", "name dept")
        .populate("bedId", "ward number type")
        .sort(sort || "-admitDate")
        .skip(skip)
        .limit(limit)
        .lean(),
      Admission.countDocuments(filter),
    ]);

    sendPaginated(res, admissions, total, page, limit);
  } catch (error) {
    next(error);
  }
};
