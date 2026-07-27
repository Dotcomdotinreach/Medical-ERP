import Patient from "../models/Patient.js";
import QueueEntry from "../models/QueueEntry.js";
import Admission from "../models/Admission.js";
import Bed from "../models/Bed.js";
import { sendSuccess, sendError, sendPaginated } from "../utils/apiResponse.js";
import { getPaginationParams } from "../utils/pagination.js";
import { emitQueueUpdate, emitAlert } from "../sockets/index.js";

export const getDashboard = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [triageCounts, waitingCount, inTreatmentCount, todayDischarged, criticalAlerts] =
      await Promise.all([
        QueueEntry.aggregate([
          {
            $match: {
              dept: "Emergency",
              date: { $gte: today, $lt: tomorrow },
            },
          },
          { $group: { _id: "$priority", count: { $sum: 1 } } },
        ]),
        QueueEntry.countDocuments({
          dept: "Emergency",
          state: "Waiting",
          date: { $gte: today, $lt: tomorrow },
        }),
        QueueEntry.countDocuments({
          dept: "Emergency",
          state: { $in: ["Called", "In Consultation"] },
          date: { $gte: today, $lt: tomorrow },
        }),
        Admission.countDocuments({
          dept: "Emergency",
          dischargeDate: { $gte: today, $lt: tomorrow },
        }),
        QueueEntry.countDocuments({
          dept: "Emergency",
          priority: "Urgent",
          state: "Waiting",
          date: { $gte: today, $lt: tomorrow },
        }),
      ]);

    const triage = { Normal: 0, High: 0, Urgent: 0 };
    triageCounts.forEach((t) => {
      triage[t._id] = t.count;
    });

    sendSuccess(res, {
      triage,
      waiting: waitingCount,
      inTreatment: inTreatmentCount,
      discharged: todayDischarged,
      criticalAlerts,
    });
  } catch (error) {
    next(error);
  }
};

export const listCases = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationParams(req.query);
    const { status, priority, date } = req.query;

    const filter = { dept: "Emergency" };
    if (status) filter.state = status;
    if (priority) filter.priority = priority;
    if (date) {
      const d = new Date(date);
      const nextDay = new Date(d);
      nextDay.setDate(nextDay.getDate() + 1);
      filter.date = { $gte: d, $lt: nextDay };
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      filter.date = { $gte: today, $lt: tomorrow };
    }

    const [cases, total] = await Promise.all([
      QueueEntry.find(filter)
        .populate("patientId", "uhid name phone age gender")
        .populate("doctorId", "name dept")
        .sort(sort || "-createdAt")
        .skip(skip)
        .limit(limit)
        .lean(),
      QueueEntry.countDocuments(filter),
    ]);

    const mappedCases = cases.map((e) => ({
      ...e,
      patient: e.patientId,
      assignedDoctor: e.doctorId,
    }));

    sendPaginated(res, mappedCases, total, page, limit);
  } catch (error) {
    next(error);
  }
};

export const getCase = async (req, res, next) => {
  try {
    const entry = await QueueEntry.findById(req.params.id)
      .populate("patientId", "uhid name phone age gender")
      .populate("doctorId", "name dept")
      .lean();
    if (!entry) return sendError(res, "Case not found", 404);

    const mapped = {
      ...entry,
      patient: entry.patientId,
      assignedDoctor: entry.doctorId,
    };

    sendSuccess(res, mapped);
  } catch (error) {
    next(error);
  }
};

export const emergencyCheckin = async (req, res, next) => {
  try {
    const { name, phone, gender, age, priority, symptoms } = req.body;

    const uhid = `UHID-${new Date().getFullYear()}-${String(Date.now()).slice(-5)}`;
    const patient = await Patient.create({
      uhid,
      name,
      phone,
      gender,
      age,
      status: "active",
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const lastEntry = await QueueEntry.findOne({
      dept: "Emergency",
      date: { $gte: today, $lt: tomorrow },
    })
      .sort({ token: -1 })
      .lean();

    const token = lastEntry ? lastEntry.token + 1 : 1;

    const entry = await QueueEntry.create({
      token,
      patientId: patient._id,
      dept: "Emergency",
      priority: priority || "High",
      state: "Waiting",
    });

    const populated = await entry.populate({ path: "patientId", select: "uhid name phone" });

    emitQueueUpdate("Emergency", { type: "emergency-checkin", entry: populated });
    if (priority === "Urgent") {
      emitAlert({ type: "urgent-arrival", patient: patient.name, token });
    }

    sendSuccess(res, { patient, queueEntry: populated }, "Emergency check-in complete", 201);
  } catch (error) {
    next(error);
  }
};

export const updateTriage = async (req, res, next) => {
  try {
    const entry = await QueueEntry.findById(req.params.id);
    if (!entry) return sendError(res, "Case not found", 404);

    entry.priority = req.body.priority;
    await entry.save();

    const populated = await entry.populate({ path: "patientId", select: "uhid name phone" });

    emitQueueUpdate("Emergency", { type: "triage-updated", entry: populated });

    sendSuccess(res, populated, "Triage updated");
  } catch (error) {
    next(error);
  }
};

export const dischargeFromED = async (req, res, next) => {
  try {
    const entry = await QueueEntry.findById(req.params.id);
    if (!entry) return sendError(res, "Case not found", 404);

    entry.state = "Completed";
    await entry.save();

    const populated = await entry.populate({ path: "patientId", select: "uhid name phone" });

    emitQueueUpdate("Emergency", { type: "discharged", entry: populated });

    sendSuccess(res, populated, "Patient discharged from ED");
  } catch (error) {
    next(error);
  }
};

export const admitFromED = async (req, res, next) => {
  try {
    const entry = await QueueEntry.findById(req.params.id);
    if (!entry) return sendError(res, "Case not found", 404);

    const { dept, diagnosis, doctorId, bedId: requestedBedId } = req.body;

    let bedId = requestedBedId;
    if (!bedId) {
      const availableBed = await Bed.findOne({ state: "available", ward: dept }).lean();
      if (availableBed) bedId = availableBed._id;
    }

    const admission = await Admission.create({
      patientId: entry.patientId,
      doctorId: doctorId || entry.doctorId,
      bedId: bedId || undefined,
      dept,
      diagnosis,
      status: bedId ? "active" : "pending",
    });

    if (bedId) {
      await Bed.findByIdAndUpdate(bedId, { state: "occupied", patientId: entry.patientId });
    }

    entry.state = "Completed";
    await entry.save();

    const populated = await admission.populate([
      { path: "patientId", select: "uhid name phone" },
      { path: "doctorId", select: "name dept" },
      { path: "bedId", select: "ward number type" },
    ]);

    emitQueueUpdate("Emergency", { type: "admitted-to-ipd", entry: { token: entry.token } });

    sendSuccess(res, { admission: populated }, "Patient admitted from ED to IPD", 201);
  } catch (error) {
    next(error);
  }
};
