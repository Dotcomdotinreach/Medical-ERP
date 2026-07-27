import mongoose from "mongoose";
import Encounter from "../models/Encounter.js";
import Patient from "../models/Patient.js";
import Doctor from "../models/Doctor.js";
import QueueEntry from "../models/QueueEntry.js";
import Appointment from "../models/Appointment.js";
import { sendSuccess, sendError, sendPaginated } from "../utils/apiResponse.js";
import { getPaginationParams } from "../utils/pagination.js";
import { emitVitalsUpdate, emitNotification } from "../sockets/index.js";

export const dashboard = async (req, res) => {
  try {
    const nurseId = req.user.id;
    const ward = req.user.ward || req.user.department;

    const assignedPatients = await Patient.countDocuments({ assignedNurse: nurseId, ward });
    const pendingTasks = await QueueEntry.countDocuments({ nurseId, status: "pending" });
    const medicationsDue = await Encounter.aggregate([
      { $match: { assignedNurse: nurseId, status: "active" } },
      { $unwind: "$medications" },
      { $match: { "medications.nextDue": { $lte: new Date() }, "medications.administered": false } },
      { $count: "total" }
    ]);
    const vitalsToRecord = await Patient.countDocuments({
      assignedNurse: nurseId,
      ward,
      lastVitalsRecorded: { $lte: new Date(Date.now() - 4 * 60 * 60 * 1000) }
    });

    return sendSuccess(res, {
      assignedPatients,
      tasksPending: pendingTasks,
      medicationsDue: medicationsDue[0]?.total || 0,
      vitalsToRecord
    });
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

export const listPatients = async (req, res) => {
  try {
    const nurseId = req.user.id;
    const ward = req.user.ward || req.user.department;
    const { page, limit, skip } = getPaginationParams(req.query);
    const { search } = req.query;

    const filter = { assignedNurse: nurseId, ward };
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { uhid: { $regex: search, $options: "i" } }
      ];
    }

    const [patients, total] = await Promise.all([
      Patient.find(filter)
        .select({ firstName: 1, lastName: 1, uhid: 1, age: 1, gender: 1, room: 1, bed: 1, diagnosis: 1, lastVitalsRecorded: 1 })
        .skip(skip)
        .limit(limit)
        .sort({ lastName: 1 }),
      Patient.countDocuments(filter),
    ]);

    return sendSuccess(res, { patients, total, totalPages: Math.ceil(total / limit), page });
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

export const patientSummary = async (req, res) => {
  try {
    const { uhid } = req.params;

    const patient = await Patient.findOne({ uhid }).select("-__v");
    if (!patient) return sendError(res, "Patient not found", 404);

    const encounter = await Encounter.findOne({ patientUhid: uhid, status: "active" })
      .sort({ createdAt: -1 })
      .lean();

    const demographics = {
      name: `${patient.firstName} ${patient.lastName}`,
      uhid: patient.uhid,
      age: patient.age,
      gender: patient.gender,
      bloodGroup: patient.bloodGroup,
      allergies: patient.allergies || [],
      room: patient.room,
      bed: patient.bed,
      ward: patient.ward,
      diagnosis: patient.diagnosis
    };

    const currentVitals = encounter?.vitals?.length > 0
      ? encounter.vitals[encounter.vitals.length - 1]
      : null;

    const activeMeds = encounter?.medications?.filter(m => m.active) || [];
    const recentNotes = encounter?.notes?.slice(-5).reverse() || [];

    return sendSuccess(res, {
      demographics,
      currentVitals,
      activeMeds,
      allergies: patient.allergies,
      recentNotes
    });
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

export const getOrders = async (req, res) => {
  try {
    const { uhid } = req.params;

    const encounter = await Encounter.findOne({ patientUhid: uhid, status: "active" })
      .sort({ createdAt: -1 })
      .lean();

    if (!encounter) return sendError(res, "No active encounter found", 404);

    const orders = encounter.orders || [];
    return sendSuccess(res, { orders, patientUhid: uhid });
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

export const acknowledgeOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const nurseId = req.user.id;

    const encounter = await Encounter.findOne({ "orders._id": orderId });
    if (!encounter) return sendError(res, "Order not found", 404);

    const order = encounter.orders.id(orderId);
    if (!order) return sendError(res, "Order not found", 404);

    order.acknowledged = true;
    order.acknowledgedBy = nurseId;
    order.acknowledgedAt = new Date();
    await encounter.save();

    return sendSuccess(res, { message: "Order acknowledged", order });
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

export const getMAR = async (req, res) => {
  try {
    const { uhid } = req.params;

    const encounter = await Encounter.findOne({ patientUhid: uhid, status: "active" })
      .sort({ createdAt: -1 })
      .lean();

    if (!encounter) return sendError(res, "No active encounter found", 404);

    const mar = (encounter.medications || []).map(med => ({
      medId: med._id,
      name: med.name,
      dosage: med.dosage,
      frequency: med.frequency,
      route: med.route,
      scheduledTimes: med.scheduledTimes || [],
      administered: med.administered || false,
      administeredAt: med.administeredAt || null,
      administeredBy: med.administeredBy || null,
      nextDue: med.nextDue || null
    }));

    return sendSuccess(res, { mar, patientUhid: uhid });
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

export const administerMedication = async (req, res) => {
  try {
    const { medId, patientUhid, notes } = req.body;
    const nurseId = req.user.id;

    if (!medId || !patientUhid) {
      return sendError(res, "medId and patientUhid are required", 400);
    }

    const encounter = await Encounter.findOne({ patientUhid, status: "active" });
    if (!encounter) return sendError(res, "No active encounter found", 404);

    const medication = encounter.medications.id(medId);
    if (!medication) return sendError(res, "Medication not found in prescription", 404);

    if (medication.administered && !medication.nextDue) {
      return sendError(res, "All doses already administered", 400);
    }

    medication.administered = true;
    medication.administeredAt = new Date();
    medication.administeredBy = nurseId;
    medication.administrationNotes = notes || "";

    const allDosesGiven = medication.totalDoses
      ? (medication.dosesAdministered || 0) + 1 >= medication.totalDoses
      : true;

    if (allDosesGiven) {
      medication.active = false;
      medication.nextDue = null;
    } else {
      medication.dosesAdministered = (medication.dosesAdministered || 0) + 1;
    }

    await encounter.save();

    emitNotification(patientUhid, {
      type: "medication_administered",
      message: `Medication ${medication.name} administered by nurse`,
      timestamp: new Date()
    });

    return sendSuccess(res, {
      message: "Medication administered",
      medication: {
        medId: medication._id,
        name: medication.name,
        administeredAt: medication.administeredAt,
        allDosesGiven: medication.active === false
      }
    });
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

export const recordVitals = async (req, res) => {
  try {
    const {
      patientUhid,
      heartRate,
      bpSystolic,
      bpDiastolic,
      temperature,
      respRate,
      spo2,
      weight
    } = req.body;

    if (!patientUhid) return sendError(res, "patientUhid is required", 400);

    const encounter = await Encounter.findOne({ patientUhid, status: "active" });
    if (!encounter) return sendError(res, "No active encounter found", 404);

    const vitalsEntry = {
      heartRate,
      bpSystolic,
      bpDiastolic,
      temperature,
      respRate,
      spo2,
      weight,
      recordedBy: req.user.id,
      recordedAt: new Date()
    };

    encounter.vitals.push(vitalsEntry);
    await encounter.save();

    await Patient.findOneAndUpdate(
      { uhid: patientUhid },
      { lastVitalsRecorded: new Date() }
    );

    emitVitalsUpdate(patientUhid, vitalsEntry);

    return sendSuccess(res, { message: "Vitals recorded", vitals: vitalsEntry });
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

export const getInfusions = async (req, res) => {
  try {
    const { uhid } = req.params;

    const encounter = await Encounter.findOne({ patientUhid: uhid, status: "active" })
      .sort({ createdAt: -1 })
      .lean();

    if (!encounter) return sendError(res, "No active encounter found", 404);

    const infusions = encounter.infusions || [];
    return sendSuccess(res, { infusions, patientUhid: uhid });
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

export const documentPumpCheck = async (req, res) => {
  try {
    const { id } = req.params;
    const { time, rate, volumeInfused, observations } = req.body;

    const encounter = await Encounter.findOne({ "infusions._id": id });
    if (!encounter) return sendError(res, "Infusion not found", 404);

    const infusion = encounter.infusions.id(id);
    if (!infusion) return sendError(res, "Infusion not found", 404);

    if (!infusion.pumpChecks) infusion.pumpChecks = [];
    infusion.pumpChecks.push({
      time: time || new Date(),
      rate,
      volumeInfused,
      observations,
      checkedBy: req.user.id,
      checkedAt: new Date()
    });

    await encounter.save();

    return sendSuccess(res, { message: "Pump check documented", infusion });
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

export const recordAssessment = async (req, res) => {
  try {
    const { patientUhid, assessmentItems } = req.body;

    if (!patientUhid || !assessmentItems) {
      return sendError(res, "patientUhid and assessmentItems are required", 400);
    }

    const encounter = await Encounter.findOne({ patientUhid, status: "active" });
    if (!encounter) return sendError(res, "No active encounter found", 404);

    const assessment = {
      items: assessmentItems,
      assessedBy: req.user.id,
      assessedAt: new Date()
    };

    if (!encounter.assessments) encounter.assessments = [];
    encounter.assessments.push(assessment);
    await encounter.save();

    return sendSuccess(res, { message: "Assessment recorded", assessment });
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

export const addNote = async (req, res) => {
  try {
    const { patientUhid, content, type } = req.body;

    if (!patientUhid || !content) {
      return sendError(res, "patientUhid and content are required", 400);
    }

    const encounter = await Encounter.findOne({ patientUhid, status: "active" });
    if (!encounter) return sendError(res, "No active encounter found", 404);

    const note = {
      content,
      type: type || "nursing",
      author: req.user.id,
      authorRole: "nurse",
      createdAt: new Date()
    };

    if (!encounter.notes) encounter.notes = [];
    encounter.notes.push(note);
    await encounter.save();

    emitNotification(patientUhid, {
      type: "nursing_note",
      message: `New ${type || "nursing"} note added`,
      timestamp: new Date()
    });

    return sendSuccess(res, { message: "Note added", note });
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

export const getCarePlan = async (req, res) => {
  try {
    const { uhid } = req.params;

    const encounter = await Encounter.findOne({ patientUhid: uhid, status: "active" })
      .sort({ createdAt: -1 })
      .lean();

    if (!encounter) return sendError(res, "No active encounter found", 404);

    const carePlan = encounter.carePlan || {};
    return sendSuccess(res, { carePlan, patientUhid: uhid });
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

export const listTasks = async (req, res) => {
  try {
    const nurseId = req.user.id;
    const { status, priority, page = 1, limit = 50 } = req.query;

    const filter = { nurseId };
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const tasks = [
      { _id: "task-vitals", title: "Record vitals", category: "vitals", priority: "high", status: "pending", icon: "heartbeat" },
      { _id: "task-med", title: "Administer medication", category: "medication", priority: "high", status: "pending", icon: "pills" },
      { _id: "task-iv", title: "Check IV fluids", category: "infusion", priority: "medium", status: "pending", icon: "tint" },
      { _id: "task-careplan", title: "Update care plan", category: "documentation", priority: "low", status: "pending", icon: "clipboard" },
      { _id: "task-assessment", title: "Patient assessment", category: "assessment", priority: "medium", status: "pending", icon: "stethoscope" }
    ];

    const patients = await Patient.find({ assignedNurse: nurseId }).select("uhid firstName lastName ward room bed").lean();
    const enrichedTasks = [];

    for (const patient of patients) {
      for (const task of tasks) {
        enrichedTasks.push({
          ...task,
          _id: `${task._id}-${patient.uhid}`,
          patientUhid: patient.uhid,
          patientName: `${patient.firstName} ${patient.lastName}`,
          ward: patient.ward,
          room: patient.room,
          bed: patient.bed,
          dueAt: new Date(),
          createdAt: new Date()
        });
      }
    }

    let filtered = enrichedTasks;
    if (status) filtered = filtered.filter(t => t.status === status);
    if (priority) filtered = filtered.filter(t => t.priority === priority);

    const start = (Number(page) - 1) * Number(limit);
    const paged = filtered.slice(start, start + Number(limit));

    return sendSuccess(res, {
      tasks: paged,
      total: filtered.length,
      page: Number(page),
      totalPages: Math.ceil(filtered.length / Number(limit))
    });
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

export const completeTask = async (req, res) => {
  try {
    const { id } = req.params;
    const nurseId = req.user.id;

    return sendSuccess(res, {
      message: "Task marked as complete",
      taskId: id,
      completedBy: nurseId,
      completedAt: new Date()
    });
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

export const requestTransfer = async (req, res) => {
  try {
    const { patientUhid, toWard, transportMethod, notes } = req.body;

    if (!patientUhid || !toWard) {
      return sendError(res, "patientUhid and toWard are required", 400);
    }

    const patient = await Patient.findOne({ uhid: patientUhid });
    if (!patient) return sendError(res, "Patient not found", 404);

    const fromWard = patient.ward;

    const transfer = {
      patientUhid,
      fromWard,
      toWard,
      transportMethod: transportMethod || "wheelchair",
      notes: notes || "",
      requestedBy: req.user.id,
      requestedAt: new Date(),
      status: "pending"
    };

    emitNotification(patientUhid, {
      type: "transfer_request",
      message: `Transfer requested from ${fromWard} to ${toWard}`,
      timestamp: new Date()
    });

    return sendSuccess(res, { message: "Transfer request submitted", transfer });
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

export const shiftHandover = async (req, res) => {
  try {
    const { toNurse, checklistItems, patientNotes } = req.body;
    const fromNurse = req.user.id;

    if (!toNurse) {
      return sendError(res, "toNurse is required", 400);
    }

    const handover = {
      fromNurse,
      toNurse,
      checklistItems: checklistItems || [],
      patientNotes: patientNotes || [],
      handedOverAt: new Date(),
      status: "completed"
    };

    return sendSuccess(res, { message: "Shift handover completed", handover });
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

export const submitIncident = async (req, res) => {
  try {
    const { type, severity, description, patientUhid, witnesses } = req.body;

    if (!type || !description) {
      return sendError(res, "type and description are required", 400);
    }

    const incident = {
      type,
      severity: severity || "low",
      description,
      patientUhid: patientUhid || null,
      witnesses: witnesses || [],
      reportedBy: req.user.id,
      reportedAt: new Date(),
      status: "open"
    };

    if (patientUhid) {
      emitNotification(patientUhid, {
        type: "incident_reported",
        message: `Incident reported: ${type}`,
        timestamp: new Date()
      });
    }

    return sendSuccess(res, { message: "Incident report submitted", incident });
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

export const createTask = async (req, res) => {
  return sendSuccess(res, { ...req.body, _id: `task-${Date.now()}` }, "Task created", 201);
};

export const updateTask = async (req, res) => {
  return sendSuccess(res, { ...req.body, _id: req.params.id }, "Task updated");
};

export const cancelTask = async (req, res) => {
  return sendSuccess(res, { _id: req.params.id, status: "cancelled", reason: req.body.reason }, "Task cancelled");
};

export const getTask = async (req, res) => {
  return sendSuccess(res, { _id: req.params.id, title: "Mock Task", category: "vitals", priority: "medium", status: "pending" });
};

export const recordVitalsForPatient = async (req, res, next) => {
  try {
    const { patientId } = req.params;
    const patient = await Patient.findOne({ $or: [{ _id: mongoose.isValidObjectId(patientId) ? patientId : undefined }, { uhid: patientId }] });
    if (!patient) return sendError(res, "Patient not found", 404);
    req.body.patientUhid = patient.uhid;
    return recordVitals(req, res, next);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

export const getVitalsForPatient = async (req, res, next) => {
  try {
    const { patientId } = req.params;
    const patient = await Patient.findOne({ $or: [{ _id: mongoose.isValidObjectId(patientId) ? patientId : undefined }, { uhid: patientId }] });
    if (!patient) return sendError(res, "Patient not found", 404);
    const encounter = await Encounter.findOne({ patientUhid: patient.uhid, status: "active" });
    const vitals = encounter ? encounter.vitals : [];
    return sendSuccess(res, vitals);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};
