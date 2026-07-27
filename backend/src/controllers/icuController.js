import ICUBed from "../models/ICUBed.js";
import Patient from "../models/Patient.js";
import Doctor from "../models/Doctor.js";
import Encounter from "../models/Encounter.js";
import { sendSuccess, sendError, sendPaginated } from "../utils/apiResponse.js";
import { getPaginationParams } from "../utils/pagination.js";
import { emitVitalsUpdate, emitAlert } from "../sockets/index.js";

// 1. GET / — ICU Dashboard KPIs
export const dashboard = async (req, res) => {
  try {
    const [totalBeds, occupiedBeds, ventilatorCount, criticalCount] =
      await Promise.all([
        ICUBed.countDocuments(),
        ICUBed.countDocuments({ status: "occupied" }),
        ICUBed.countDocuments({ onVentilator: true }),
        ICUBed.countDocuments({ status: "occupied", "clinicalScores.gcs": { $lte: 8 } }),
      ]);

    const available = totalBeds - occupiedBeds;
    const occupancy = totalBeds > 0 ? ((occupiedBeds / totalBeds) * 100).toFixed(1) : 0;

    return sendSuccess(res, {
      totalBeds,
      occupiedBeds,
      availableBeds: available,
      occupancy: parseFloat(occupancy),
      ventilatorCount,
      criticalCount,
    });
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// 2. GET /beds — List ICU beds
export const listBeds = async (req, res) => {
  try {
    const { status, type } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (type) filter.type = type;

    const { page, limit, skip, sort } = getPaginationParams(req.query);
    const beds = await ICUBed.find(filter)
      .populate("assignedPatient", "uhid name age gender")
      .skip(skip)
      .limit(limit)
      .sort(sort);
    const total = await ICUBed.countDocuments(filter);

    return sendPaginated(res, beds, total, page, limit);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// 3. GET /patients — Current ICU patients with vitals
export const listPatients = async (req, res) => {
  try {
    const { search } = req.query;
    const { page, limit, skip, sort } = getPaginationParams(req.query);

    const filter = { status: "occupied" };
    let beds = await ICUBed.find(filter)
      .populate("assignedPatient", "uhid name age gender phone")
      .skip(skip)
      .limit(limit)
      .sort(sort);
    const total = await ICUBed.countDocuments(filter);

    if (search) {
      const s = search.toLowerCase();
      beds = beds.filter(
        (b) =>
          b.assignedPatient?.name?.toLowerCase().includes(s) ||
          b.assignedPatient?.uhid?.toLowerCase().includes(s)
      );
    }

    const patients = beds.map((b) => ({
      bedNumber: b.number,
      bedType: b.type,
      patient: b.assignedPatient,
      onVentilator: b.onVentilator,
      latestVitals: b.vitalsHistory?.[b.vitalsHistory.length - 1] || null,
    }));

    return sendPaginated(res, patients, total, page, limit);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// 4. POST /admissions — Admit patient to ICU
export const admitPatient = async (req, res) => {
  try {
    const { patientUhid, bedId, doctorId, diagnosis, priority, notes } = req.body;

    const bed = await ICUBed.findById(bedId);
    if (!bed) return sendError(res, "Bed not found", 404);
    if (bed.status !== "available") return sendError(res, "Bed is not available", 400);

    const patient = await Patient.findOne({ uhid: patientUhid });
    if (!patient) return sendError(res, "Patient not found", 404);

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return sendError(res, "Doctor not found", 404);

    const encounter = await Encounter.create({
      patientId: patient._id,
      doctorId: doctor._id,
      visitDate: new Date(),
      diagnosis: diagnosis ? [diagnosis] : [],
      notes,
      status: "in-progress",
    });

    bed.status = "occupied";
    bed.assignedPatient = patient._id;
    bed.admissionDate = new Date();
    bed.admittingDoctor = doctor._id;
    bed.priority = priority || "normal";
    bed.encounterId = encounter._id;
    bed.vitalsHistory = [];
    bed.medications = [];
    bed.rounds = [];
    bed.clinicalScores = [];
    await bed.save();

    const populated = await ICUBed.findById(bed._id)
      .populate("assignedPatient", "uhid name age gender phone")
      .populate("admittingDoctor", "name dept");

    emitAlert({
      type: "icu-admission",
      bedNumber: bed.number,
      patient: patient.name,
      priority,
    });

    return sendSuccess(
      res,
      { bed: populated, encounter },
      "Patient admitted to ICU",
      201
    );
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// 5. GET /monitoring/:bedId — Vital signs history
export const getMonitoring = async (req, res) => {
  try {
    const { bedId } = req.params;
    const { from, to } = req.query;

    const bed = await ICUBed.findById(bedId).populate(
      "assignedPatient",
      "uhid name age gender"
    );
    if (!bed) return sendError(res, "Bed not found", 404);

    let vitals = bed.vitalsHistory || [];
    if (from) vitals = vitals.filter((v) => new Date(v.timestamp) >= new Date(from));
    if (to) vitals = vitals.filter((v) => new Date(v.timestamp) <= new Date(to));

    return sendSuccess(res, {
      bedNumber: bed.number,
      patient: bed.assignedPatient,
      vitals,
    });
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// 6. PUT /monitoring/:bedId/vitals — Update vitals
export const updateVitals = async (req, res) => {
  try {
    const { bedId } = req.params;
    const {
      heartRate,
      bpSystolic,
      bpDiastolic,
      temperature,
      respRate,
      spo2,
      urineOutput,
      fluidBalance,
    } = req.body;

    const bed = await ICUBed.findById(bedId);
    if (!bed) return sendError(res, "Bed not found", 404);
    if (bed.status !== "occupied") return sendError(res, "Bed is not occupied", 400);

    const reading = {
      heartRate,
      bpSystolic,
      bpDiastolic,
      temperature,
      respRate,
      spo2,
      urineOutput,
      fluidBalance,
      recordedBy: req.user?.id,
      timestamp: new Date(),
    };

    bed.vitalsHistory = bed.vitalsHistory || [];
    bed.vitalsHistory.push(reading);
    await bed.save();

    const patientId = bed.assignedPatient?.toString();
    if (patientId) {
      emitVitalsUpdate(patientId, {
        bedNumber: bed.number,
        vitals: reading,
      });
    }

    const isCritical =
      (heartRate && (heartRate < 40 || heartRate > 150)) ||
      (spo2 && spo2 < 88) ||
      (bpSystolic && (bpSystolic < 80 || bpSystolic > 200)) ||
      (temperature && (temperature < 34 || temperature > 41));

    if (isCritical) {
      emitAlert({
        type: "critical-vitals",
        bedNumber: bed.number,
        patientId,
        vitals: reading,
      });
    }

    return sendSuccess(res, reading, "Vitals updated");
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// 7. GET /ventilators — List ventilator status
export const listVentilators = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = { onVentilator: true };
    if (status) filter["ventilator.status"] = status;

    const beds = await ICUBed.find(filter)
      .populate("assignedPatient", "uhid name")
      .sort({ number: 1 });

    const ventilators = beds.map((b) => ({
      bedNumber: b.number,
      patient: b.assignedPatient,
      ventilator: b.ventilator || {},
    }));

    return sendSuccess(res, ventilators);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// 8. PUT /ventilators/:id/settings — Update ventilator parameters
export const updateVentilator = async (req, res) => {
  try {
    const { id } = req.params;
    const { mode, rate, tidalVolume, peep, fio2, pressure, alarms } = req.body;

    const bed = await ICUBed.findById(id);
    if (!bed) return sendError(res, "Bed not found", 404);
    if (!bed.onVentilator) return sendError(res, "Bed is not on ventilator", 400);

    bed.ventilator = {
      ...bed.ventilator,
      mode: mode ?? bed.ventilator?.mode,
      rate: rate ?? bed.ventilator?.rate,
      tidalVolume: tidalVolume ?? bed.ventilator?.tidalVolume,
      peep: peep ?? bed.ventilator?.peep,
      fio2: fio2 ?? bed.ventilator?.fio2,
      pressure: pressure ?? bed.ventilator?.pressure,
      alarms: alarms ?? bed.ventilator?.alarms,
      lastUpdated: new Date(),
      updatedBy: req.user?.id,
    };
    await bed.save();

    return sendSuccess(res, bed.ventilator, "Ventilator settings updated");
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// 9. GET /infusion-pumps — List infusion pump status
export const listInfusionPumps = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = { status: "occupied" };
    if (status) filter["infusionPumps.status"] = status;

    const beds = await ICUBed.find(filter)
      .populate("assignedPatient", "uhid name")
      .sort({ number: 1 });

    const pumps = [];
    beds.forEach((b) => {
      (b.infusionPumps || []).forEach((pump) => {
        pumps.push({
          bedNumber: b.number,
          patient: b.assignedPatient,
          pump,
        });
      });
    });

    return sendSuccess(res, pumps);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// 10. GET /scores/:uhid — Get clinical scores (APACHE/SOFA/GCS)
export const getClinicalScores = async (req, res) => {
  try {
    const { uhid } = req.params;

    const patient = await Patient.findOne({ uhid });
    if (!patient) return sendError(res, "Patient not found", 404);

    const bed = await ICUBed.findOne({
      assignedPatient: patient._id,
      status: "occupied",
    });
    if (!bed) return sendError(res, "Patient not in ICU", 404);

    const scores = bed.clinicalScores || [];
    const latest = scores[scores.length - 1] || null;

    return sendSuccess(res, {
      uhid,
      patientName: patient.name,
      bedNumber: bed.number,
      latest,
      history: scores,
    });
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// 11. GET /medications/:uhid — Get ICU medications
export const getMedications = async (req, res) => {
  try {
    const { uhid } = req.params;

    const patient = await Patient.findOne({ uhid });
    if (!patient) return sendError(res, "Patient not found", 404);

    const bed = await ICUBed.findOne({
      assignedPatient: patient._id,
      status: "occupied",
    });
    if (!bed) return sendError(res, "Patient not in ICU", 404);

    return sendSuccess(res, {
      uhid,
      patientName: patient.name,
      bedNumber: bed.number,
      medications: bed.medications || [],
    });
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// 12. POST /medications — Order medication
export const orderMedication = async (req, res) => {
  try {
    const { bedId, name, dosage, route, frequency, duration, indication, orderedBy } =
      req.body;

    const bed = await ICUBed.findById(bedId);
    if (!bed) return sendError(res, "Bed not found", 404);
    if (bed.status !== "occupied") return sendError(res, "Bed is not occupied", 400);

    const medication = {
      name,
      dosage,
      route,
      frequency,
      duration,
      indication,
      orderedBy: orderedBy || req.user?.id,
      orderedAt: new Date(),
      status: "active",
    };

    bed.medications = bed.medications || [];
    bed.medications.push(medication);
    await bed.save();

    return sendSuccess(res, medication, "Medication ordered", 201);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// 13. GET /rounds/:date — Daily rounds
export const getRounds = async (req, res) => {
  try {
    const { date } = req.params;
    const targetDate = new Date(date);
    const nextDay = new Date(targetDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const beds = await ICUBed.find({ status: "occupied" })
      .populate("assignedPatient", "uhid name age gender")
      .sort({ number: 1 });

    const rounds = [];
    beds.forEach((b) => {
      (b.rounds || []).forEach((r) => {
        const roundDate = new Date(r.date || r.createdAt);
        if (roundDate >= targetDate && roundDate < nextDay) {
          rounds.push({
            bedNumber: b.number,
            patient: b.assignedPatient,
            round: r,
          });
        }
      });
    });

    return sendSuccess(res, { date, rounds });
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// 14. POST /rounds — Document daily round
export const documentRound = async (req, res) => {
  try {
    const {
      bedId,
      vitals,
      clinicalScores,
      assessment,
      plan,
      tasks,
      notes,
      reviewedBy,
    } = req.body;

    const bed = await ICUBed.findById(bedId);
    if (!bed) return sendError(res, "Bed not found", 404);
    if (bed.status !== "occupied") return sendError(res, "Bed is not occupied", 400);

    const round = {
      date: new Date(),
      vitals,
      clinicalScores,
      assessment,
      plan,
      tasks,
      notes,
      reviewedBy: reviewedBy || req.user?.id,
    };

    bed.rounds = bed.rounds || [];
    bed.rounds.push(round);

    if (clinicalScores) {
      bed.clinicalScores = bed.clinicalScores || [];
      bed.clinicalScores.push({
        ...clinicalScores,
        recordedAt: new Date(),
        recordedBy: req.user?.id,
      });
    }

    await bed.save();

    return sendSuccess(res, round, "Daily round documented", 201);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// 15. POST /code-blue — Initiate Code Blue
export const codeBlue = async (req, res) => {
  try {
    const { bedId, location, initiatedBy, notes } = req.body;

    const bed = bedId ? await ICUBed.findById(bedId) : null;

    const alert = {
      type: "code-blue",
      bedNumber: bed?.number || "Unknown",
      bedId,
      location: location || bed?.number || "ICU",
      initiatedBy: initiatedBy || req.user?.id,
      notes,
      timestamp: new Date(),
    };

    emitAlert(alert);

    return sendSuccess(res, alert, "Code Blue initiated", 201);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// 16. POST /transfer/:uhid — Transfer patient from ICU
export const transferPatient = async (req, res) => {
  try {
    const { uhid } = req.params;
    const { toDepartment, toBedNumber, reason, notes } = req.body;

    const patient = await Patient.findOne({ uhid });
    if (!patient) return sendError(res, "Patient not found", 404);

    const bed = await ICUBed.findOne({
      assignedPatient: patient._id,
      status: "occupied",
    });
    if (!bed) return sendError(res, "Patient not found in ICU", 404);

    bed.status = "available";
    bed.assignedPatient = null;
    bed.onVentilator = false;
    bed.ventilator = null;
    bed.infusionPumps = [];
    bed.admissionDate = null;
    bed.admittingDoctor = null;
    bed.priority = null;
    bed.encounterId = null;
    await bed.save();

    emitAlert({
      type: "icu-transfer",
      bedNumber: bed.number,
      patient: patient.name,
      toDepartment,
      reason,
    });

    return sendSuccess(
      res,
      {
        uhid,
        patientName: patient.name,
        fromBed: bed.number,
        toDepartment,
        toBedNumber,
      },
      "Patient transferred from ICU"
    );
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// 17. POST /discharge/:uhid — Discharge patient from ICU
export const dischargePatient = async (req, res) => {
  try {
    const { uhid } = req.params;
    const { dischargeType, dischargeSummary, followUpDate, notes } = req.body;

    const patient = await Patient.findOne({ uhid });
    if (!patient) return sendError(res, "Patient not found", 404);

    const bed = await ICUBed.findOne({
      assignedPatient: patient._id,
      status: "occupied",
    });
    if (!bed) return sendError(res, "Patient not found in ICU", 404);

    if (bed.encounterId) {
      await Encounter.findByIdAndUpdate(bed.encounterId, {
        status: "completed",
        notes: dischargeSummary || notes,
      });
    }

    bed.status = "available";
    bed.assignedPatient = null;
    bed.onVentilator = false;
    bed.ventilator = null;
    bed.infusionPumps = [];
    bed.medications = [];
    bed.clinicalScores = [];
    bed.rounds = [];
    bed.vitalsHistory = [];
    bed.admissionDate = null;
    bed.admittingDoctor = null;
    bed.priority = null;
    bed.encounterId = null;
    bed.dischargeDate = new Date();
    bed.dischargeType = dischargeType || "medical";
    bed.dischargeSummary = dischargeSummary;
    bed.followUpDate = followUpDate;
    bed.dischargeNotes = notes;
    await bed.save();

    await Patient.findByIdAndUpdate(patient._id, { lastVisit: new Date() });

    emitAlert({
      type: "icu-discharge",
      bedNumber: bed.number,
      patient: patient.name,
      dischargeType,
    });

    return sendSuccess(
      res,
      {
        uhid,
        patientName: patient.name,
        bedNumber: bed.number,
        dischargeType,
        followUpDate,
      },
      "Patient discharged from ICU"
    );
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// 18. GET /equipment — List ICU equipment
export const getEquipment = async (req, res) => {
  try {
    const { status, type } = req.query;
    const filter = {};
    if (status) filter["equipment.status"] = status;
    if (type) filter["equipment.type"] = type;

    const beds = await ICUBed.find(filter).sort({ number: 1 });

    const equipment = [];
    beds.forEach((b) => {
      (b.equipment || []).forEach((eq) => {
        equipment.push({
          bedNumber: b.number,
          equipment: eq,
        });
      });
    });

    return sendSuccess(res, equipment);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// 19. GET /analytics — ICU analytics
export const getAnalytics = async (req, res) => {
  try {
    const { period = "daily" } = req.query;

    const [totalBeds, byType, byStatus, ventilatorUsage, criticalCount] =
      await Promise.all([
        ICUBed.countDocuments(),
        ICUBed.aggregate([
          { $group: { _id: "$type", count: { $sum: 1 } } },
          { $sort: { _id: 1 } },
        ]),
        ICUBed.aggregate([
          { $group: { _id: "$status", count: { $sum: 1 } } },
        ]),
        ICUBed.aggregate([
          { $match: { onVentilator: true } },
          { $count: "count" },
        ]),
        ICUBed.aggregate([
          { $match: { status: "occupied" } },
          { $group: { _id: "$priority", count: { $sum: 1 } } },
        ]),
      ]);

    const typeBreakdown = {};
    byType.forEach((t) => {
      typeBreakdown[t._id] = t.count;
    });

    const statusBreakdown = {};
    byStatus.forEach((s) => {
      statusBreakdown[s._id] = s.count;
    });

    const priorityBreakdown = {};
    criticalCount.forEach((c) => {
      priorityBreakdown[c._id] = c.count;
    });

    return sendSuccess(res, {
      totalBeds,
      byType: typeBreakdown,
      byStatus: statusBreakdown,
      ventilatorUsage: ventilatorUsage[0]?.count || 0,
      byPriority: priorityBreakdown,
      occupancyRate:
        totalBeds > 0
          ? (((statusBreakdown.occupied || 0) / totalBeds) * 100).toFixed(1)
          : 0,
    });
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};
