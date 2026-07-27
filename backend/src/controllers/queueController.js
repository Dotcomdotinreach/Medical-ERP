import QueueEntry from "../models/QueueEntry.js";
import Patient from "../models/Patient.js";
import { sendSuccess, sendError, sendPaginated } from "../utils/apiResponse.js";
import { getPaginationParams } from "../utils/pagination.js";
import { emitQueueUpdate } from "../sockets/index.js";

export const getQueue = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationParams(req.query);
    const { dept, state, date } = req.query;

    const filter = {};
    if (dept) filter.dept = dept;
    if (state) filter.state = state;
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

    const [entries, total] = await Promise.all([
      QueueEntry.find(filter)
        .populate("patientId", "uhid name phone")
        .populate("doctorId", "name dept")
        .sort(sort || "token")
        .skip(skip)
        .limit(limit)
        .lean(),
      QueueEntry.countDocuments(filter),
    ]);

    sendPaginated(res, entries, total, page, limit);
  } catch (error) {
    next(error);
  }
};

export const addToQueue = async (req, res, next) => {
  try {
    const { patientId, doctorId, dept, priority } = req.body;

    const patient = await Patient.findById(patientId).lean();
    if (!patient) return sendError(res, "Patient not found", 404);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const lastEntry = await QueueEntry.findOne({
      dept,
      date: { $gte: today, $lt: tomorrow },
    })
      .sort({ token: -1 })
      .lean();

    const token = lastEntry ? lastEntry.token + 1 : 1;

    const entry = await QueueEntry.create({
      token,
      patientId,
      doctorId: doctorId || undefined,
      dept,
      priority: priority || "Normal",
      state: "Waiting",
    });

    const populated = await entry.populate([
      { path: "patientId", select: "uhid name phone" },
      { path: "doctorId", select: "name dept" },
    ]);

    if (dept) emitQueueUpdate(dept, { type: "added", entry: populated });

    sendSuccess(res, populated, "Added to queue", 201);
  } catch (error) {
    next(error);
  }
};

export const callPatient = async (req, res, next) => {
  try {
    const entry = await QueueEntry.findById(req.params.id);
    if (!entry) return sendError(res, "Queue entry not found", 404);
    if (entry.state !== "Waiting") {
      return sendError(res, `Cannot call patient in state: ${entry.state}`, 400);
    }

    entry.state = "Called";
    await entry.save();

    const populated = await entry.populate([
      { path: "patientId", select: "uhid name phone" },
      { path: "doctorId", select: "name dept" },
    ]);

    if (entry.dept) emitQueueUpdate(entry.dept, { type: "called", entry: populated });

    sendSuccess(res, populated, "Patient called");
  } catch (error) {
    next(error);
  }
};

export const startConsultation = async (req, res, next) => {
  try {
    const entry = await QueueEntry.findById(req.params.id);
    if (!entry) return sendError(res, "Queue entry not found", 404);
    if (entry.state !== "Called") {
      return sendError(res, `Cannot start consultation from state: ${entry.state}`, 400);
    }

    entry.state = "In Consultation";
    await entry.save();

    const populated = await entry.populate([
      { path: "patientId", select: "uhid name phone" },
      { path: "doctorId", select: "name dept" },
    ]);

    if (entry.dept) emitQueueUpdate(entry.dept, { type: "consulting", entry: populated });

    sendSuccess(res, populated, "Consultation started");
  } catch (error) {
    next(error);
  }
};

export const completeConsultation = async (req, res, next) => {
  try {
    const entry = await QueueEntry.findById(req.params.id);
    if (!entry) return sendError(res, "Queue entry not found", 404);
    if (entry.state !== "In Consultation") {
      return sendError(res, `Cannot complete from state: ${entry.state}`, 400);
    }

    entry.state = "Completed";
    await entry.save();

    const populated = await entry.populate([
      { path: "patientId", select: "uhid name phone" },
      { path: "doctorId", select: "name dept" },
    ]);

    if (entry.dept) emitQueueUpdate(entry.dept, { type: "completed", entry: populated });

    sendSuccess(res, populated, "Consultation completed");
  } catch (error) {
    next(error);
  }
};

export const skipPatient = async (req, res, next) => {
  try {
    const entry = await QueueEntry.findById(req.params.id);
    if (!entry) return sendError(res, "Queue entry not found", 404);
    if (entry.state !== "Waiting") {
      return sendError(res, `Cannot skip patient in state: ${entry.state}`, 400);
    }

    entry.state = "Skipped";
    await entry.save();

    const populated = await entry.populate([
      { path: "patientId", select: "uhid name phone" },
      { path: "doctorId", select: "name dept" },
    ]);

    if (entry.dept) emitQueueUpdate(entry.dept, { type: "skipped", entry: populated });

    sendSuccess(res, populated, "Patient skipped");
  } catch (error) {
    next(error);
  }
};

export const getQueueStats = async (req, res, next) => {
  try {
    const { dept } = req.query;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const filter = { date: { $gte: today, $lt: tomorrow } };
    if (dept) filter.dept = dept;

    const stats = await QueueEntry.aggregate([
      { $match: filter },
      {
        $group: {
          _id: "$state",
          count: { $sum: 1 },
          avgWait: { $avg: "$waitMins" },
        },
      },
    ]);

    const result = {
      Waiting: 0,
      Called: 0,
      "In Consultation": 0,
      Completed: 0,
      Skipped: 0,
      totalWaiting: 0,
    };

    stats.forEach((s) => {
      result[s._id] = s.count;
    });
    result.totalWaiting = result.Waiting + result.Called;

    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
};

export const updateQueueStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const entry = await QueueEntry.findById(req.params.id);
    if (!entry) return sendError(res, "Queue entry not found", 404);

    entry.state = status;
    await entry.save();

    const populated = await entry.populate([
      { path: "patientId", select: "uhid name phone" },
      { path: "doctorId", select: "name dept" },
    ]);

    if (entry.dept) {
      let eventType = "updated";
      if (status === "Called") eventType = "called";
      else if (status === "In Consultation") eventType = "consulting";
      else if (status === "Completed") eventType = "completed";
      else if (status === "Skipped") eventType = "skipped";
      emitQueueUpdate(entry.dept, { type: eventType, entry: populated });
    }

    sendSuccess(res, populated, `Queue status updated to ${status}`);
  } catch (error) {
    next(error);
  }
};

export const getQueueEntry = async (req, res, next) => {
  try {
    const entry = await QueueEntry.findById(req.params.id)
      .populate("patientId", "uhid name phone age gender")
      .populate("doctorId", "name dept")
      .lean();
    if (!entry) return sendError(res, "Queue entry not found", 404);
    sendSuccess(res, entry);
  } catch (error) {
    next(error);
  }
};
