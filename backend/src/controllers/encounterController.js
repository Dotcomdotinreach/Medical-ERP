import Encounter from "../models/Encounter.js";
import Patient from "../models/Patient.js";
import { sendSuccess, sendError, sendPaginated } from "../utils/apiResponse.js";
import { getPaginationParams } from "../utils/pagination.js";

export const listEncounters = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationParams(req.query);
    const { patientId, doctorId, date, status } = req.query;

    const filter = {};
    if (patientId) filter.patientId = patientId;
    if (doctorId) filter.doctorId = doctorId;
    if (status) filter.status = status;
    if (date) {
      const d = new Date(date);
      const nextDay = new Date(d);
      nextDay.setDate(nextDay.getDate() + 1);
      filter.visitDate = { $gte: d, $lt: nextDay };
    }

    const [encounters, total] = await Promise.all([
      Encounter.find(filter)
        .populate("patientId", "uhid name phone")
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

export const createEncounter = async (req, res, next) => {
  try {
    const { patientId, doctorId } = req.body;

    const patient = await Patient.findById(patientId).lean();
    if (!patient) return sendError(res, "Patient not found", 404);

    const encounter = await Encounter.create({
      patientId,
      doctorId,
      visitDate: req.body.visitDate || new Date(),
      vitals: req.body.vitals,
      symptoms: req.body.symptoms,
      diagnosis: req.body.diagnosis,
      notes: req.body.notes,
      prescriptions: req.body.prescriptions,
      orders: req.body.orders,
    });

    await Patient.findByIdAndUpdate(patientId, { lastVisit: new Date() });

    const populated = await encounter.populate([
      { path: "patientId", select: "uhid name phone" },
      { path: "doctorId", select: "name dept" },
    ]);

    sendSuccess(res, populated, "Encounter created", 201);
  } catch (error) {
    next(error);
  }
};

export const getEncounter = async (req, res, next) => {
  try {
    const encounter = await Encounter.findById(req.params.id)
      .populate("patientId", "uhid name phone age gender blood allergies conditions")
      .populate("doctorId", "name dept qualification")
      .lean();
    if (!encounter) return sendError(res, "Encounter not found", 404);
    sendSuccess(res, encounter);
  } catch (error) {
    next(error);
  }
};

export const updateEncounter = async (req, res, next) => {
  try {
    const encounter = await Encounter.findById(req.params.id);
    if (!encounter) return sendError(res, "Encounter not found", 404);

    if (req.body.vitals) {
      encounter.vitals = { ...encounter.vitals, ...req.body.vitals };
    }
    if (req.body.symptoms) encounter.symptoms = req.body.symptoms;
    if (req.body.diagnosis) encounter.diagnosis = req.body.diagnosis;
    if (req.body.notes) encounter.notes = req.body.notes;
    if (req.body.prescriptions) encounter.prescriptions = req.body.prescriptions;
    if (req.body.orders) encounter.orders = req.body.orders;
    if (req.body.status) encounter.status = req.body.status;

    await encounter.save();

    const populated = await encounter.populate([
      { path: "patientId", select: "uhid name phone" },
      { path: "doctorId", select: "name dept" },
    ]);

    sendSuccess(res, populated, "Encounter updated");
  } catch (error) {
    next(error);
  }
};
