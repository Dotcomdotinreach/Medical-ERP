import mongoose from "mongoose";
import Patient from "../models/Patient.js";

const getQueryByIdOrUhid = (param) => {
  return mongoose.Types.ObjectId.isValid(param) ? { _id: param } : { uhid: param };
};
import Appointment from "../models/Appointment.js";
import Encounter from "../models/Encounter.js";
import LabOrder from "../models/LabOrder.js";
import { sendSuccess, sendError, sendPaginated } from "../utils/apiResponse.js";
import { getPaginationParams } from "../utils/pagination.js";

const generateUHID = async () => {
  const year = new Date().getFullYear();
  const lastPatient = await Patient.findOne({ uhid: new RegExp(`^UHID-${year}`) })
    .sort({ createdAt: -1 })
    .lean();
  let seq = 1;
  if (lastPatient) {
    const lastSeq = parseInt(lastPatient.uhid.split("-").pop(), 10);
    seq = lastSeq + 1;
  }
  return `UHID-${year}-${String(seq).padStart(5, "0")}`;
};

export const listPatients = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationParams(req.query);
    const { search, status, blood, gender } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (blood) filter.blood = blood;
    if (gender) filter.gender = gender;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { uhid: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
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

export const registerPatient = async (req, res, next) => {
  try {
    const uhid = await generateUHID();
    const patient = await Patient.create({ ...req.body, uhid });
    sendSuccess(res, patient, "Patient registered", 201);
  } catch (error) {
    next(error);
  }
};

export const searchPatients = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) return sendError(res, "Search query required", 400);

    const patients = await Patient.find({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { uhid: { $regex: q, $options: "i" } },
        { phone: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
      ],
      status: "active",
    })
      .limit(20)
      .lean();

    sendSuccess(res, patients);
  } catch (error) {
    next(error);
  }
};

export const getPatientByUHID = async (req, res, next) => {
  try {
    const param = req.params.uhid || req.params.idOrUhid;
    const patient = await Patient.findOne(getQueryByIdOrUhid(param)).lean();
    if (!patient) return sendError(res, "Patient not found", 404);
    sendSuccess(res, patient);
  } catch (error) {
    next(error);
  }
};

export const updatePatient = async (req, res, next) => {
  try {
    const param = req.params.uhid || req.params.idOrUhid;
    const patient = await Patient.findOneAndUpdate(
      getQueryByIdOrUhid(param),
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!patient) return sendError(res, "Patient not found", 404);
    sendSuccess(res, patient, "Patient updated");
  } catch (error) {
    next(error);
  }
};

export const softDeletePatient = async (req, res, next) => {
  try {
    const param = req.params.uhid || req.params.idOrUhid;
    const patient = await Patient.findOneAndUpdate(
      getQueryByIdOrUhid(param),
      { $set: { status: "inactive" } },
      { new: true }
    );
    if (!patient) return sendError(res, "Patient not found", 404);
    sendSuccess(res, patient, "Patient deactivated");
  } catch (error) {
    next(error);
  }
};

export const getPatientHistory = async (req, res, next) => {
  try {
    const param = req.params.uhid || req.params.idOrUhid;
    const patient = await Patient.findOne(getQueryByIdOrUhid(param)).lean();
    if (!patient) return sendError(res, "Patient not found", 404);

    const [appointments, encounters, labOrders] = await Promise.all([
      Appointment.find({ patientId: patient._id })
        .populate("doctorId", "name dept")
        .sort({ date: -1 })
        .lean(),
      Encounter.find({ patientId: patient._id })
        .populate("doctorId", "name dept")
        .sort({ visitDate: -1 })
        .lean(),
      LabOrder.find({ patientId: patient._id })
        .populate("doctorId", "name dept")
        .sort({ orderDate: -1 })
        .lean(),
    ]);

    sendSuccess(res, { patient, appointments, encounters, labOrders });
  } catch (error) {
    next(error);
  }
};
