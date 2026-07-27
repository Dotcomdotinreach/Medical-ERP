import Doctor from "../models/Doctor.js";
import Appointment from "../models/Appointment.js";
import { sendSuccess, sendError, sendPaginated } from "../utils/apiResponse.js";
import { getPaginationParams } from "../utils/pagination.js";

export const listDoctors = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationParams(req.query);
    const { dept, available } = req.query;

    const filter = {};
    if (dept) filter.dept = dept;
    if (available !== undefined) filter.available = available === "true";

    const [doctors, total] = await Promise.all([
      Doctor.find(filter)
        .populate("userId", "name email phone avatar")
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Doctor.countDocuments(filter),
    ]);

    sendPaginated(res, doctors, total, page, limit);
  } catch (error) {
    next(error);
  }
};

export const getDoctorProfile = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .populate("userId", "name email phone avatar department")
      .lean();
    if (!doctor) return sendError(res, "Doctor not found", 404);
    sendSuccess(res, doctor);
  } catch (error) {
    next(error);
  }
};

export const updateDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate("userId", "name email phone avatar");
    if (!doctor) return sendError(res, "Doctor not found", 404);
    sendSuccess(res, doctor, "Doctor updated");
  } catch (error) {
    next(error);
  }
};

export const getDoctorSchedule = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id).lean();
    if (!doctor) return sendError(res, "Doctor not found", 404);
    sendSuccess(res, { schedule: doctor.schedule || [] });
  } catch (error) {
    next(error);
  }
};

export const getDoctorPatients = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const appointments = await Appointment.find({
      doctorId: req.params.id,
      date: { $gte: today, $lt: tomorrow },
      status: { $in: ["scheduled", "confirmed", "checked-in", "in-progress"] },
    })
      .populate("patientId", "uhid name phone age gender")
      .sort({ date: 1 })
      .lean();

    const patients = appointments.map((a) => ({
      appointmentId: a._id,
      patient: a.patientId,
      time: a.time,
      status: a.status,
      type: a.type,
      reason: a.reason,
    }));

    sendSuccess(res, patients);
  } catch (error) {
    next(error);
  }
};
