import Admission from '../models/Admission.js';
import Bed from '../models/Bed.js';
import Patient from '../models/Patient.js';
import Doctor from '../models/Doctor.js';
import Surgery from '../models/Surgery.js';
import Encounter from '../models/Encounter.js';
import { sendSuccess, sendError, sendPaginated } from '../utils/apiResponse.js';
import { getPaginationParams } from '../utils/pagination.js';
import { emitAlert } from '../sockets/index.js';

// Allowed status transitions
const STATUS_TRANSITIONS = {
  scheduled: ['pre-op'],
  'pre-op': ['in-progress'],
  'in-progress': ['completed'],
  completed: ['post-op'],
  'post-op': ['transferred'],
};

const validateStatusTransition = (current, next) => {
  const allowed = STATUS_TRANSITIONS[current];
  if (!allowed || !allowed.includes(next)) {
    return false;
  }
  return true;
};

// GET /dashboard — KPIs
export const getDashboard = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [
      surgeriesToday,
      runningSurgeries,
      emergencySurgeries,
      availableRooms,
      pacuPatients,
    ] = await Promise.all([
      Surgery.countDocuments({
        scheduledDate: { $gte: today, $lt: tomorrow },
      }),
      Surgery.countDocuments({ status: 'in-progress' }),
      Surgery.countDocuments({
        type: 'emergency',
        status: { $in: ['scheduled', 'pre-op', 'in-progress'] },
      }),
      Bed.countDocuments({ module: 'ot', status: 'available' }),
      Surgery.countDocuments({ status: 'post-op' }),
    ]);

    return sendSuccess(res, {
      surgeriesToday,
      runningSurgeries,
      emergencySurgeries,
      availableRooms,
      pacuPatients,
    });
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// GET /surgeries — List surgeries
export const getSurgeries = async (req, res) => {
  try {
    const { date, status, surgeon, type } = req.query;
    const filter = {};

    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      filter.scheduledDate = { $gte: start, $lte: end };
    }
    if (status) filter.status = status;
    if (surgeon) filter.surgeonId = surgeon;
    if (type) filter.type = type;

    const { page, limit, skip } = getPaginationParams(req.query);
    const surgeries = await Surgery.find(filter)
      .populate('patientId', 'uhid name age gender')
      .populate('surgeonId', 'name specialization')
      .populate('otRoom', 'roomNumber')
      .skip(skip)
      .limit(limit)
      .sort({ scheduledDate: 1, scheduledTime: 1 });
    const total = await Surgery.countDocuments(filter);

    return sendPaginated(res, surgeries, total, page, limit);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// GET /calendar — Weekly OT calendar view
export const getCalendar = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const start = startDate ? new Date(startDate) : new Date();
    start.setHours(0, 0, 0, 0);
    const end = endDate ? new Date(endDate) : new Date(start);
    if (!endDate) end.setDate(end.getDate() + 7);
    end.setHours(23, 59, 59, 999);

    const surgeries = await Surgery.find({
      scheduledDate: { $gte: start, $lte: end },
    })
      .populate('patientId', 'uhid name')
      .populate('surgeonId', 'name specialization')
      .populate('otRoom', 'roomNumber')
      .sort({ scheduledDate: 1, scheduledTime: 1 });

    const rooms = await Bed.find({ module: 'ot' }).select('roomNumber status');

    const calendar = {};
    const current = new Date(start);
    while (current <= end) {
      const dateKey = current.toISOString().split('T')[0];
      calendar[dateKey] = {
        date: dateKey,
        surgeries: surgeries.filter(
          (s) => new Date(s.scheduledDate).toISOString().split('T')[0] === dateKey
        ),
        rooms: rooms.map((r) => ({
          roomNumber: r.roomNumber,
          status: r.status,
        })),
      };
      current.setDate(current.getDate() + 1);
    }

    return sendSuccess(res, calendar);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// POST / — Schedule surgery
export const scheduleSurgery = async (req, res) => {
  try {
    const {
      patientId,
      surgeonId,
      otRoomId,
      procedureName,
      type,
      scheduledDate,
      scheduledTime,
      estimatedDuration,
      priority,
      notes,
      anesthesiaType,
    } = req.body;

    const patient = await Patient.findById(patientId);
    if (!patient) return sendError(res, 'Patient not found', 404);

    const surgeon = await Doctor.findById(surgeonId);
    if (!surgeon) return sendError(res, 'Surgeon not found', 404);

    const room = await Bed.findById(otRoomId);
    if (!room) return sendError(res, 'OT room not found', 404);
    if (room.status === 'occupied') return sendError(res, 'OT room is occupied', 400);

    const existing = await Surgery.findOne({
      otRoom: otRoomId,
      scheduledDate: new Date(scheduledDate),
      scheduledTime,
      status: { $nin: ['cancelled', 'completed'] },
    });
    if (existing) return sendError(res, 'Room is already scheduled at this time', 400);

    const surgeryId = `SUR${Date.now().toString(36).toUpperCase()}`;

    const surgery = await Surgery.create({
      surgeryId,
      patientId,
      surgeonId,
      otRoom: otRoomId,
      procedureName,
      type: type || 'elective',
      scheduledDate: new Date(scheduledDate),
      scheduledTime,
      estimatedDuration,
      priority: priority || 'normal',
      notes,
      anesthesiaType,
      status: 'scheduled',
    });

    await Bed.findByIdAndUpdate(otRoomId, { status: 'scheduled' });

    emitAlert({ type: 'surgery', message: `Surgery scheduled: ${surgeryId}`, patientId, surgeonId });

    const populated = await Surgery.findById(surgery._id)
      .populate('patientId', 'uhid name')
      .populate('surgeonId', 'name specialization')
      .populate('otRoom', 'roomNumber');

    return sendSuccess(res, populated, 'Surgery scheduled successfully', 201);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// GET /:id — Get surgery details
export const getSurgery = async (req, res) => {
  try {
    const surgery = await Surgery.findById(req.params.id)
      .populate('patientId', 'uhid name age gender phone')
      .populate('surgeonId', 'name specialization')
      .populate('otRoom', 'roomNumber ward')
      .populate('team.anesthesiologist', 'name')
      .populate('team.nurses', 'name')
      .populate('team.technicians', 'name');

    if (!surgery) return sendError(res, 'Surgery not found', 404);

    return sendSuccess(res, surgery);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// PUT /:id/status — Update surgery status
export const updateSurgeryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const surgery = await Surgery.findById(id);
    if (!surgery) return sendError(res, 'Surgery not found', 404);

    if (!validateStatusTransition(surgery.status, status)) {
      return sendError(
        res,
        `Invalid status transition from ${surgery.status} to ${status}`,
        400
      );
    }

    surgery.status = status;
    surgery.statusHistory.push({
      status,
      timestamp: new Date(),
      notes,
      updatedBy: req.user?._id,
    });

    if (status === 'in-progress') {
      surgery.actualStartTime = new Date();
      await Bed.findByIdAndUpdate(surgery.otRoom, { status: 'occupied' });
    }

    if (status === 'completed') {
      surgery.actualEndTime = new Date();
    }

    if (status === 'post-op') {
      await Bed.findByIdAndUpdate(surgery.otRoom, { status: 'available' });
    }

    if (status === 'transferred') {
      surgery.transferTime = new Date();
    }

    await surgery.save();

    emitAlert({ type: 'surgery', message: `Surgery status updated: ${surgery.surgeryId}`, status });

    return sendSuccess(res, surgery, `Surgery status updated to ${status}`);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// GET /pre-op — List pre-op assessments
export const getPreOpAssessments = async (req, res) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query);

    const surgeries = await Surgery.find({ status: 'pre-op' })
      .populate('patientId', 'uhid name age gender')
      .populate('surgeonId', 'name specialization')
      .populate('otRoom', 'roomNumber')
      .skip(skip)
      .limit(limit)
      .sort({ scheduledDate: 1 });

    const total = await Surgery.countDocuments({ status: 'pre-op' });

    return sendPaginated(res, surgeries, total, page, limit);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// POST /pre-op/:surgeryId — Complete pre-op assessment
export const completePreOpAssessment = async (req, res) => {
  try {
    const { surgeryId } = req.params;
    const {
      airwayAssessment,
      asaGrade,
      allergies,
      medications,
      npoStatus,
      consentObtained,
      siteMarked,
      vitalSigns,
      notes,
    } = req.body;

    const surgery = await Surgery.findById(surgeryId);
    if (!surgery) return sendError(res, 'Surgery not found', 404);
    if (surgery.status !== 'pre-op') return sendError(res, 'Surgery is not in pre-op status', 400);

    surgery.preOpAssessment = {
      airwayAssessment,
      asaGrade,
      allergies,
      medications,
      npoStatus,
      consentObtained,
      siteMarked,
      vitalSigns,
      notes,
      completedAt: new Date(),
      completedBy: req.user?._id,
    };

    await surgery.save();

    emitAlert({ type: 'surgery', message: `Pre-op completed: ${surgery.surgeryId}` });

    return sendSuccess(res, surgery, 'Pre-op assessment completed');
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// GET /consents — List consent records
export const getConsents = async (req, res) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query);
    const { signed } = req.query;

    const filter = {};
    if (signed === 'true') filter['consent.signed'] = true;
    if (signed === 'false') filter['consent.signed'] = false;

    const surgeries = await Surgery.find({
      status: { $in: ['scheduled', 'pre-op'] },
      ...filter,
    })
      .populate('patientId', 'uhid name')
      .populate('surgeonId', 'name')
      .skip(skip)
      .limit(limit)
      .sort({ scheduledDate: 1 });

    const total = await Surgery.countDocuments({
      status: { $in: ['scheduled', 'pre-op'] },
      ...filter,
    });

    return sendPaginated(res, surgeries, total, page, limit);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// POST /consents/:id/sign — Sign consent form
export const signConsent = async (req, res) => {
  try {
    const { id } = req.params;
    const { signedBy, relationship, witnessName, notes } = req.body;

    const surgery = await Surgery.findById(id);
    if (!surgery) return sendError(res, 'Surgery not found', 404);

    surgery.consent = {
      signed: true,
      signedBy,
      relationship,
      witnessName,
      signedAt: new Date(),
      notes,
    };

    await surgery.save();

    return sendSuccess(res, surgery, 'Consent signed successfully');
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// GET /rooms — List OT rooms with status
export const getRooms = async (req, res) => {
  try {
    const rooms = await Bed.find({ module: 'ot' })
      .select('roomNumber status type currentAdmission')
      .populate('currentAdmission', 'surgeryId procedureName');

    return sendSuccess(res, rooms);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// PUT /rooms/:id — Update room status
export const updateRoomStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const room = await Bed.findById(id);
    if (!room) return sendError(res, 'Room not found', 404);

    room.status = status;
    room.statusNotes = notes;
    room.statusUpdatedAt = new Date();
    await room.save();

    emitAlert({ type: 'ot_room', message: `OT room status updated: ${room.roomNumber}`, status });

    return sendSuccess(res, room, 'Room status updated');
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// GET /teams — Get surgical team assignment
export const getTeams = async (req, res) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query);

    const surgeries = await Surgery.find({
      status: { $in: ['scheduled', 'pre-op', 'in-progress'] },
    })
      .populate('surgeonId', 'name specialization')
      .populate('team.anesthesiologist', 'name specialization')
      .populate('team.nurses', 'name role')
      .populate('team.technicians', 'name role')
      .skip(skip)
      .limit(limit)
      .sort({ scheduledDate: 1 });

    const total = await Surgery.countDocuments({
      status: { $in: ['scheduled', 'pre-op', 'in-progress'] },
    });

    return sendPaginated(res, surgeries, total, page, limit);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// POST /teams/:surgeryId — Assign team
export const assignTeam = async (req, res) => {
  try {
    const { surgeryId } = req.params;
    const { anesthesiologist, nurses, technicians, firstAssistant, secondAssistant } = req.body;

    const surgery = await Surgery.findById(surgeryId);
    if (!surgery) return sendError(res, 'Surgery not found', 404);

    surgery.team = {
      anesthesiologist,
      nurses: nurses || [],
      technicians: technicians || [],
      firstAssistant,
      secondAssistant,
    };

    await surgery.save();

    const populated = await Surgery.findById(surgery._id)
      .populate('team.anesthesiologist', 'name specialization')
      .populate('team.nurses', 'name role')
      .populate('team.technicians', 'name role');

    return sendSuccess(res, populated, 'Team assigned successfully');
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// GET /equipment — List OT equipment
export const getEquipment = async (req, res) => {
  try {
    const rooms = await Bed.find({ module: 'ot' })
      .select('roomNumber equipment')
      .populate('equipment.equipmentId', 'name status');

    const allEquipment = rooms.flatMap((room) =>
      (room.equipment || []).map((eq) => ({
        roomNumber: room.roomNumber,
        equipment: eq,
      }))
    );

    return sendSuccess(res, allEquipment);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// GET /who-checklist/:surgeryId — Get WHO checklist
export const getWHOChecklist = async (req, res) => {
  try {
    const surgery = await Surgery.findById(req.params.surgeryId);
    if (!surgery) return sendError(res, 'Surgery not found', 404);

    const checklist = surgery.whoChecklist || {
      signIn: {
        confirmed: false,
        patientIdentity: false,
        procedureSite: false,
        consent: false,
        anesthesiaSafety: false,
        instruments: false,
        criticalEvents: false,
        sterility: false,
        teamIntroduction: false,
      },
      timeOut: {
        confirmed: false,
        procedureName: false,
        incisionTime: false,
        patientPosition: false,
        antibioticsGiven: false,
      },
      signOut: {
        confirmed: false,
        procedureName: false,
        instrumentCount: false,
        specimens: false,
        equipmentIssues: false,
        recoveryConcerns: false,
      },
    };

    return sendSuccess(res, { surgeryId: surgery.surgeryId, checklist });
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// POST /who-checklist/:surgeryId/complete — Complete WHO checklist
export const completeWHOChecklist = async (req, res) => {
  try {
    const { surgeryId } = req.params;
    const { phase, items } = req.body;

    const surgery = await Surgery.findById(surgeryId);
    if (!surgery) return sendError(res, 'Surgery not found', 404);

    if (!surgery.whoChecklist) surgery.whoChecklist = {};

    if (!['signIn', 'timeOut', 'signOut'].includes(phase)) {
      return sendError(res, 'Invalid phase', 400);
    }

    surgery.whoChecklist[phase] = {
      ...items,
      confirmed: true,
      completedAt: new Date(),
      completedBy: req.user?._id,
    };

    await surgery.save();

    return sendSuccess(res, surgery.whoChecklist, `WHO checklist ${phase} completed`);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// GET /anesthesia/:surgeryId — Get anesthesia record
export const getAnesthesia = async (req, res) => {
  try {
    const surgery = await Surgery.findById(req.params.surgeryId)
      .populate('team.anesthesiologist', 'name');

    if (!surgery) return sendError(res, 'Surgery not found', 404);

    const record = surgery.anesthesiaRecord || {
      type: surgery.anesthesiaType,
      induction: {},
      maintenance: {},
      emergence: {},
      fluids: [],
      bloodProducts: [],
      medications: [],
      complications: [],
    };

    return sendSuccess(res, { surgeryId: surgery.surgeryId, anesthesia: record });
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// POST /anesthesia/:surgeryId — Record anesthesia data
export const recordAnesthesia = async (req, res) => {
  try {
    const { surgeryId } = req.params;
    const {
      type,
      induction,
      maintenance,
      emergence,
      fluids,
      bloodProducts,
      medications,
      complications,
      notes,
    } = req.body;

    const surgery = await Surgery.findById(surgeryId);
    if (!surgery) return sendError(res, 'Surgery not found', 404);

    surgery.anesthesiaRecord = {
      type,
      induction,
      maintenance,
      emergence,
      fluids: fluids || [],
      bloodProducts: bloodProducts || [],
      medications: medications || [],
      complications: complications || [],
      notes,
      recordedAt: new Date(),
      recordedBy: req.user?._id,
    };

    await surgery.save();

    return sendSuccess(res, surgery.anesthesiaRecord, 'Anesthesia data recorded');
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// POST /surgery/:surgeryId/intraop — Record intra-op documentation
export const recordIntraOp = async (req, res) => {
  try {
    const { surgeryId } = req.params;
    const {
      findings,
      proceduresPerformed,
      specimens,
      bloodLoss,
      fluidsGiven,
      complications,
      implantUsed,
      notes,
    } = req.body;

    const surgery = await Surgery.findById(surgeryId);
    if (!surgery) return sendError(res, 'Surgery not found', 404);

    surgery.intraOpRecord = {
      findings,
      proceduresPerformed,
      specimens: specimens || [],
      bloodLoss,
      fluidsGiven,
      complications: complications || [],
      implantUsed: implantUsed || [],
      notes,
      recordedAt: new Date(),
      recordedBy: req.user?._id,
    };

    await surgery.save();

    return sendSuccess(res, surgery.intraOpRecord, 'Intra-op data recorded');
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// POST /surgery/:surgeryId/complete — Complete surgery
export const completeSurgery = async (req, res) => {
  try {
    const { surgeryId } = req.params;
    const { complications, duration, outcome, notes } = req.body;

    const surgery = await Surgery.findById(surgeryId);
    if (!surgery) return sendError(res, 'Surgery not found', 404);
    if (surgery.status !== 'in-progress') {
      return sendError(res, 'Surgery is not in-progress', 400);
    }

    surgery.status = 'completed';
    surgery.actualEndTime = new Date();
    surgery.actualDuration = duration;
    surgery.complications = complications || [];
    surgery.outcome = outcome || 'uneventful';
    surgery.completionNotes = notes;

    surgery.statusHistory.push({
      status: 'completed',
      timestamp: new Date(),
      notes: `Surgery completed. Duration: ${duration} mins. Outcome: ${outcome}`,
      updatedBy: req.user?._id,
    });

    await surgery.save();

    await Bed.findByIdAndUpdate(surgery.otRoom, { status: 'available' });

    emitAlert({ type: 'surgery', message: `Surgery completed: ${surgery.surgeryId}`, complications: complications?.length > 0 });

    if (complications?.length > 0) {
      emitAlert({ type: 'surgery_complication', message: `Complication in surgery ${surgery.surgeryId}` });
    }

    return sendSuccess(res, surgery, 'Surgery completed');
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// GET /pacu — List PACU patients
export const getPACUPatients = async (req, res) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query);

    const surgeries = await Surgery.find({ status: 'post-op' })
      .populate('patientId', 'uhid name age gender')
      .populate('surgeonId', 'name specialization')
      .populate('team.anesthesiologist', 'name')
      .skip(skip)
      .limit(limit)
      .sort({ actualEndTime: -1 });

    const total = await Surgery.countDocuments({ status: 'post-op' });

    return sendPaginated(res, surgeries, total, page, limit);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// POST /pacu/:surgeryId/discharge — Discharge from PACU
export const dischargeFromPACU = async (req, res) => {
  try {
    const { surgeryId } = req.params;
    const { aldreteScore, dischargeCriteria, notes } = req.body;

    const surgery = await Surgery.findById(surgeryId);
    if (!surgery) return sendError(res, 'Surgery not found', 404);
    if (surgery.status !== 'post-op') {
      return sendError(res, 'Surgery is not in post-op', 400);
    }

    surgery.pacuDischarge = {
      aldreteScore,
      dischargeCriteria,
      notes,
      dischargedAt: new Date(),
      dischargedBy: req.user?._id,
    };

    surgery.status = 'transferred';
    surgery.transferTime = new Date();

    surgery.statusHistory.push({
      status: 'transferred',
      timestamp: new Date(),
      notes: 'Discharged from PACU',
      updatedBy: req.user?._id,
    });

    await surgery.save();

    emitAlert({ type: 'surgery', message: `PACU discharge: ${surgery.surgeryId}` });

    return sendSuccess(res, surgery, 'Patient discharged from PACU');
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// POST /transfer/:surgeryId — Transfer to ward
export const transferToWard = async (req, res) => {
  try {
    const { surgeryId } = req.params;
    const { wardId, bedId, notes } = req.body;

    const surgery = await Surgery.findById(surgeryId);
    if (!surgery) return sendError(res, 'Surgery not found', 404);

    const bed = await Bed.findById(bedId);
    if (!bed) return sendError(res, 'Bed not found', 404);
    if (bed.status !== 'available') return sendError(res, 'Bed is not available', 400);

    surgery.transferRecord = {
      toWard: wardId,
      toBed: bedId,
      notes,
      transferredAt: new Date(),
      transferredBy: req.user?._id,
    };

    await surgery.save();

    await Bed.findByIdAndUpdate(bedId, {
      status: 'occupied',
      currentAdmission: surgery.patientId,
    });

    const admission = await Admission.findOne({
      patientId: surgery.patientId,
      status: 'active',
    });
    if (admission) {
      admission.bedId = bedId;
      admission.ward = wardId;
      await admission.save();
    }

    emitAlert({ type: 'transfer', message: `Patient transferred to ward: ${surgery.surgeryId}`, wardId, bedId });

    return sendSuccess(res, surgery, 'Patient transferred to ward');
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// GET /turnover — List turnover/cleaning records
export const getTurnovers = async (req, res) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query);

    const rooms = await Bed.find({ module: 'ot' })
      .select('roomNumber status lastSurgery cleanStartTime cleanEndTime')
      .populate('lastSurgery', 'surgeryId procedureName')
      .skip(skip)
      .limit(limit)
      .sort({ cleanStartTime: -1 });

    const total = await Bed.countDocuments({ module: 'ot' });

    return sendPaginated(res, rooms, total, page, limit);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// POST /turnover/:id/complete — Complete turnover
export const completeTurnover = async (req, res) => {
  try {
    const { id } = req.params;
    const { cleaningDone, checkedBy, notes } = req.body;

    const room = await Bed.findById(id);
    if (!room) return sendError(res, 'Room not found', 404);

    room.cleanEndTime = new Date();
    room.status = cleaningDone ? 'available' : 'maintenance';
    room.turnoverNotes = notes;
    room.turnoverCheckedBy = checkedBy;
    await room.save();

    emitAlert({ type: 'ot_room', message: `OT room turnover complete: ${room.roomNumber}`, status: room.status });

    return sendSuccess(res, room, 'Turnover completed');
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// GET /analytics — OT analytics
export const getAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const matchFilter = {};
    if (startDate || endDate) {
      matchFilter.scheduledDate = {};
      if (startDate) matchFilter.scheduledDate.$gte = new Date(startDate);
      if (endDate) matchFilter.scheduledDate.$lte = new Date(endDate);
    }

    const [byStatus, byType, bySurgeon, avgDuration, complications] = await Promise.all([
      Surgery.aggregate([
        { $match: matchFilter },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Surgery.aggregate([
        { $match: matchFilter },
        { $group: { _id: '$type', count: { $sum: 1 } } },
      ]),
      Surgery.aggregate([
        { $match: matchFilter },
        {
          $group: {
            _id: '$surgeonId',
            count: { $sum: 1 },
            avgDuration: { $avg: '$actualDuration' },
          },
        },
        { $lookup: { from: 'doctors', localField: '_id', foreignField: '_id', as: 'surgeon' } },
        { $unwind: '$surgeon' },
        { $project: { name: '$surgeon.name', count: 1, avgDuration: 1 } },
        { $sort: { count: -1 } },
      ]),
      Surgery.aggregate([
        { $match: { ...matchFilter, actualDuration: { $exists: true } } },
        {
          $group: {
            _id: null,
            avg: { $avg: '$actualDuration' },
            min: { $min: '$actualDuration' },
            max: { $max: '$actualDuration' },
          },
        },
      ]),
      Surgery.aggregate([
        { $match: matchFilter },
        { $unwind: { path: '$complications', preserveNullAndEmptyArrays: true } },
        { $match: { complications: { $ne: null } } },
        { $group: { _id: '$complications', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
    ]);

    return sendSuccess(res, {
      byStatus,
      byType,
      bySurgeon,
      avgDuration: avgDuration[0] || { avg: 0, min: 0, max: 0 },
      complications,
    });
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};
