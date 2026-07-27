import Appointment from "../models/Appointment.js";
import Doctor from "../models/Doctor.js";
import { sendSuccess, sendError, sendPaginated } from "../utils/apiResponse.js";
import { getPaginationParams } from "../utils/pagination.js";

export const listAppointments = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationParams(req.query);
    const { date, doctorId, status, patientId } = req.query;

    const filter = {};
    if (date) {
      const d = new Date(date);
      const nextDay = new Date(d);
      nextDay.setDate(nextDay.getDate() + 1);
      filter.date = { $gte: d, $lt: nextDay };
    }
    if (doctorId) filter.doctorId = doctorId;
    if (patientId) filter.patientId = patientId;
    if (status) filter.status = status;

    const [appointments, total] = await Promise.all([
      Appointment.find(filter)
        .populate("patientId", "uhid name phone")
        .populate("doctorId", "name dept room")
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
    const { doctorId, date, time, patientId } = req.body;

    const doctor = await Doctor.findById(doctorId).lean();
    if (!doctor) return sendError(res, "Doctor not found", 404);
    if (!doctor.available) return sendError(res, "Doctor is not available", 400);

    const appointmentDate = new Date(date);
    const dayName = appointmentDate.toLocaleDateString("en-US", { weekday: "long" });
    const daySchedule = doctor.schedule?.find((s) => s.day === dayName);
    if (!daySchedule) {
      return sendError(res, `Doctor does not work on ${dayName}`, 400);
    }

    const conflict = await Appointment.findOne({
      doctorId,
      date: appointmentDate,
      time,
      status: { $nin: ["cancelled", "no-show"] },
    });
    if (conflict) return sendError(res, "Slot already booked", 409);

    const appointment = await Appointment.create({
      patientId,
      doctorId,
      date: appointmentDate,
      time,
      type: req.body.type || "In-Person",
      notes: req.body.notes,
      reason: req.body.reason,
    });

    const populated = await appointment.populate([
      { path: "patientId", select: "uhid name phone" },
      { path: "doctorId", select: "name dept room" },
    ]);

    sendSuccess(res, populated, "Appointment booked", 201);
  } catch (error) {
    next(error);
  }
};

export const getAvailableSlots = async (req, res, next) => {
  try {
    const { doctorId, date } = req.query;
    if (!doctorId || !date) {
      return sendError(res, "doctorId and date are required", 400);
    }

    const doctor = await Doctor.findById(doctorId).lean();
    if (!doctor) return sendError(res, "Doctor not found", 404);

    const targetDate = new Date(date);
    const dayName = targetDate.toLocaleDateString("en-US", { weekday: "long" });
    const daySchedule = doctor.schedule?.find((s) => s.day === dayName);
    if (!daySchedule) {
      return sendSuccess(res, { slots: [], message: "Doctor does not work on this day" });
    }

    const booked = await Appointment.find({
      doctorId,
      date: targetDate,
      status: { $nin: ["cancelled", "no-show"] },
    })
      .select("time")
      .lean();

    const bookedTimes = new Set(booked.map((a) => a.time));

    const slots = [];
    const [startH, startM] = daySchedule.startTime.split(":").map(Number);
    const [endH, endM] = daySchedule.endTime.split(":").map(Number);
    const slotDuration = 30;

    let current = startH * 60 + startM;
    const end = endH * 60 + endM;

    while (current + slotDuration <= end) {
      const h = Math.floor(current / 60);
      const m = current % 60;
      const timeStr = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
      slots.push({
        time: timeStr,
        available: !bookedTimes.has(timeStr),
      });
      current += slotDuration;
    }

    sendSuccess(res, { slots, totalSlots: slots.length, bookedCount: bookedTimes.size });
  } catch (error) {
    next(error);
  }
};

export const updateAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return sendError(res, "Appointment not found", 404);

    if (req.body.status === "cancelled") {
      appointment.status = "cancelled";
    } else if (req.body.date || req.body.time) {
      const newDate = req.body.date ? new Date(req.body.date) : appointment.date;
      const newTime = req.body.time || appointment.time;

      const conflict = await Appointment.findOne({
        _id: { $ne: req.params.id },
        doctorId: appointment.doctorId,
        date: newDate,
        time: newTime,
        status: { $nin: ["cancelled", "no-show"] },
      });
      if (conflict) return sendError(res, "New slot already booked", 409);

      if (req.body.date) appointment.date = newDate;
      if (req.body.time) appointment.time = newTime;
      appointment.status = "scheduled";
    }

    if (req.body.notes) appointment.notes = req.body.notes;
    if (req.body.reason) appointment.reason = req.body.reason;
    if (req.body.status && req.body.status !== "cancelled") {
      appointment.status = req.body.status;
    }

    await appointment.save();
    const populated = await appointment.populate([
      { path: "patientId", select: "uhid name phone" },
      { path: "doctorId", select: "name dept room" },
    ]);

    sendSuccess(res, populated, "Appointment updated");
  } catch (error) {
    next(error);
  }
};

export const getAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate("patientId", "uhid name phone age gender")
      .populate("doctorId", "name dept room")
      .lean();
    if (!appointment) return sendError(res, "Appointment not found", 404);
    sendSuccess(res, appointment);
  } catch (error) {
    next(error);
  }
};

export const getTodayAppointments = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const { doctorId, status } = req.query;
    const filter = { date: { $gte: today, $lt: tomorrow } };
    if (doctorId) filter.doctorId = doctorId;
    if (status) filter.status = status;

    const appointments = await Appointment.find(filter)
      .populate("patientId", "uhid name phone")
      .populate("doctorId", "name dept room")
      .sort({ date: 1, time: 1 })
      .lean();

    sendSuccess(res, appointments);
  } catch (error) {
    next(error);
  }
};
