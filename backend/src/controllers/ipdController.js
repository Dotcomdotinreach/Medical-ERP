import Admission from '../models/Admission.js';
import Bed from '../models/Bed.js';
import Patient from '../models/Patient.js';
import Doctor from '../models/Doctor.js';
import Encounter from '../models/Encounter.js';
import { sendSuccess, sendError, sendPaginated } from '../utils/apiResponse.js';
import { getPaginationParams } from '../utils/pagination.js';
import { emitAlert } from '../sockets/index.js';

// Generate unique admission ID
const generateAdmissionId = async () => {
  const count = await Admission.countDocuments();
  return `ADM${String(count + 1).padStart(6, '0')}`;
};

// GET /dashboard — KPIs
export const getDashboard = async (req, res) => {
  try {
    const [
      totalBeds,
      occupiedBeds,
      criticalPatients,
      isolationPatients,
      todayAdmissions,
      todayDischarges,
    ] = await Promise.all([
      Bed.countDocuments(),
      Bed.countDocuments({ status: 'occupied' }),
      Admission.countDocuments({ status: 'active', priority: 'critical' }),
      Admission.countDocuments({ status: 'active', isolation: true }),
      Admission.countDocuments({
        admissionDate: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      }),
      Admission.countDocuments({
        dischargeDate: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      }),
    ]);

    const occupancy = totalBeds > 0 ? ((occupiedBeds / totalBeds) * 100).toFixed(1) : 0;

    return sendSuccess(res, {
      totalBeds,
      occupiedBeds,
      availableBeds: totalBeds - occupiedBeds,
      occupancy: parseFloat(occupancy),
      criticalPatients,
      isolationPatients,
      todayAdmissions,
      todayDischarges,
    });
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// GET /wards — List all wards with bed counts
export const getWards = async (req, res) => {
  try {
    const wards = await Bed.aggregate([
      {
        $group: {
          _id: '$ward',
          totalBeds: { $sum: 1 },
          occupied: {
            $sum: { $cond: [{ $eq: ['$status', 'occupied'] }, 1, 0] },
          },
          available: {
            $sum: { $cond: [{ $eq: ['$status', 'available'] }, 1, 0] },
          },
          cleaning: {
            $sum: { $cond: [{ $eq: ['$status', 'cleaning'] }, 1, 0] },
          },
          maintenance: {
            $sum: { $cond: [{ $eq: ['$status', 'maintenance'] }, 1, 0] },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return sendSuccess(
      res,
      wards.map((w) => ({
        ward: w._id,
        totalBeds: w.totalBeds,
        occupied: w.occupied,
        available: w.available,
        cleaning: w.cleaning,
        maintenance: w.maintenance,
      }))
    );
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// GET /rooms — List rooms (filterable by ward, status)
export const getRooms = async (req, res) => {
  try {
    const { ward, status } = req.query;
    const filter = {};
    if (ward) filter.ward = ward;
    if (status) filter.status = status;

    const rooms = await Bed.distinct('roomNumber', filter);

    const roomDetails = await Promise.all(
      rooms.map(async (room) => {
        const beds = await Bed.find({ roomNumber: room });
        return {
          roomNumber: room,
          ward: beds[0]?.ward,
          bedCount: beds.length,
          occupied: beds.filter((b) => b.status === 'occupied').length,
          beds: beds.map((b) => ({
            bedId: b.bedId,
            bedNumber: b.bedNumber,
            status: b.status,
            type: b.type,
          })),
        };
      })
    );

    return sendSuccess(res, roomDetails);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// GET /beds — List all beds (filterable by ward, type, status)
export const getBeds = async (req, res) => {
  try {
    const { ward, type, status } = req.query;
    const filter = {};
    if (ward) filter.ward = ward;
    if (type) filter.type = type;
    if (status) filter.status = status;

    const { page, limit, skip } = getPaginationParams(req.query);
    const beds = await Bed.find(filter).skip(skip).limit(limit).sort({ ward: 1, bedNumber: 1 });
    const total = await Bed.countDocuments(filter);

    return sendPaginated(res, beds, total, page, limit);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// GET /admission-requests — List pending admission requests
export const getAdmissionRequests = async (req, res) => {
  try {
    const { priority } = req.query;
    const filter = { status: 'pending' };
    if (priority) filter.priority = priority;

    const { page, limit, skip } = getPaginationParams(req.query);
    const requests = await Admission.find(filter)
      .populate('patientId', 'uhid name')
      .populate('doctorId', 'name specialization')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    const total = await Admission.countDocuments(filter);

    return sendPaginated(res, requests, total, page, limit);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// POST / — Admit patient
export const admitPatient = async (req, res) => {
  try {
    const { patientId, bedId, doctorId, diagnosis, priority, isolation, notes } = req.body;

    const bed = await Bed.findById(bedId);
    if (!bed) return sendError(res, 'Bed not found', 404);
    if (bed.status !== 'available') return sendError(res, 'Bed is not available', 400);

    const patient = await Patient.findById(patientId);
    if (!patient) return sendError(res, 'Patient not found', 404);

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return sendError(res, 'Doctor not found', 404);

    const admissionId = await generateAdmissionId();

    const admission = await Admission.create({
      admissionId,
      patientId,
      bedId,
      doctorId,
      diagnosis,
      priority: priority || 'normal',
      isolation: isolation || false,
      notes,
      status: 'active',
      admissionDate: new Date(),
    });

    await Bed.findByIdAndUpdate(bedId, { status: 'occupied', currentAdmission: admission._id });

    await Patient.findByIdAndUpdate(patientId, { $push: { admissionHistory: admission._id } });

    emitAlert({ type: 'admission', message: `New admission: ${admissionId}`, patientId, bedId });
    if (priority === 'critical') {
      emitAlert({ type: 'critical', message: `Critical patient admitted: ${patient.name}` });
    }

    const populated = await Admission.findById(admission._id)
      .populate('patientId', 'uhid name')
      .populate('bedId', 'ward roomNumber bedNumber')
      .populate('doctorId', 'name specialization');

    return sendSuccess(res, populated, 'Patient admitted successfully', 201);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// POST /admission-requests/:id/approve — Approve admission request
export const approveAdmissionRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { bedId } = req.body;

    const admission = await Admission.findById(id);
    if (!admission) return sendError(res, 'Admission request not found', 404);
    if (admission.status !== 'pending') return sendError(res, 'Request is not pending', 400);

    const bed = await Bed.findById(bedId);
    if (!bed) return sendError(res, 'Bed not found', 404);
    if (bed.status !== 'available') return sendError(res, 'Bed is not available', 400);

    admission.bedId = bedId;
    admission.status = 'active';
    admission.admissionDate = new Date();
    await admission.save();

    await Bed.findByIdAndUpdate(bedId, { status: 'occupied', currentAdmission: admission._id });

    emitAlert({ type: 'admission', message: `Admission approved: ${admission.admissionId}`, patientId: admission.patientId });

    return sendSuccess(res, admission, 'Admission request approved');
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// GET /:id — Get admission details
export const getAdmission = async (req, res) => {
  try {
    const admission = await Admission.findById(req.params.id)
      .populate('patientId', 'uhid name age gender phone')
      .populate('bedId', 'ward roomNumber bedNumber type')
      .populate('doctorId', 'name specialization');

    if (!admission) return sendError(res, 'Admission not found', 404);

    return sendSuccess(res, admission);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// GET /inpatients — Current inpatients list
export const getInpatients = async (req, res) => {
  try {
    const { search, ward, status } = req.query;
    const filter = { status: 'active' };
    if (ward) filter.ward = ward;
    if (status) filter.patientStatus = status;

    const { page, limit, skip } = getPaginationParams(req.query);

    let query = Admission.find(filter)
      .populate('patientId', 'uhid name age gender phone')
      .populate('bedId', 'ward roomNumber bedNumber')
      .populate('doctorId', 'name specialization')
      .skip(skip)
      .limit(limit)
      .sort({ admissionDate: -1 });

    if (search) {
      query = query.populate('patientId', 'uhid name age gender phone');
    }

    const admissions = await query.exec();
    let filtered = admissions;

    if (search) {
      const s = search.toLowerCase();
      filtered = admissions.filter(
        (a) =>
          a.patientId?.name?.toLowerCase().includes(s) ||
          a.patientId?.uhid?.toLowerCase().includes(s) ||
          a.admissionId?.toLowerCase().includes(s)
      );
    }

    const total = await Admission.countDocuments(filter);

    return sendPaginated(res, filtered, total, page, limit);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// POST /:id/transfer — Transfer patient
export const transferPatient = async (req, res) => {
  try {
    const { id } = req.params;
    const { newBedId, reason } = req.body;

    const admission = await Admission.findById(id);
    if (!admission) return sendError(res, 'Admission not found', 404);
    if (admission.status !== 'active') return sendError(res, 'Admission is not active', 400);

    const newBed = await Bed.findById(newBedId);
    if (!newBed) return sendError(res, 'New bed not found', 404);
    if (newBed.status !== 'available') return sendError(res, 'New bed is not available', 400);

    const oldBedId = admission.bedId;

    admission.transferHistory.push({
      fromBed: oldBedId,
      toBed: newBedId,
      reason,
      transferredAt: new Date(),
      transferredBy: req.user?._id,
    });

    admission.bedId = newBedId;
    await admission.save();

    await Bed.findByIdAndUpdate(oldBedId, { status: 'cleaning', currentAdmission: null });
    await Bed.findByIdAndUpdate(newBedId, { status: 'occupied', currentAdmission: admission._id });

    emitAlert({ type: 'transfer', message: `Patient transferred: ${admission.admissionId}`, fromBed: oldBedId, toBed: newBedId });

    return sendSuccess(res, admission, 'Patient transferred successfully');
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// POST /transfers/:id/approve — Approve transfer
export const approveTransfer = async (req, res) => {
  try {
    const { id } = req.params;
    const { approved } = req.body;

    const admission = await Admission.findById(id);
    if (!admission) return sendError(res, 'Admission not found', 404);

    const lastTransfer = admission.transferHistory[admission.transferHistory.length - 1];
    if (!lastTransfer) return sendError(res, 'No pending transfer found', 400);

    if (!approved) {
      const revertedBed = lastTransfer.toBed;
      admission.transferHistory.pop();
      await admission.save();

      await Bed.findByIdAndUpdate(revertedBed, { status: 'available' });

      return sendSuccess(res, admission, 'Transfer rejected');
    }

    lastTransfer.approved = true;
    lastTransfer.approvedAt = new Date();
    lastTransfer.approvedBy = req.user?._id;
    await admission.save();

    emitAlert({ type: 'transfer', message: `Transfer approved: ${admission.admissionId}` });

    return sendSuccess(res, admission, 'Transfer approved');
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// GET /isolation — List isolated patients
export const getIsolationPatients = async (req, res) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query);
    const filter = { status: 'active', isolation: true };

    const admissions = await Admission.find(filter)
      .populate('patientId', 'uhid name age gender')
      .populate('bedId', 'ward roomNumber bedNumber')
      .populate('doctorId', 'name specialization')
      .skip(skip)
      .limit(limit)
      .sort({ admissionDate: -1 });

    const total = await Admission.countDocuments(filter);

    return sendPaginated(res, admissions, total, page, limit);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// GET /bedside — Daily bedside status for all inpatients
export const getBedsideStatus = async (req, res) => {
  try {
    const admissions = await Admission.find({ status: 'active' })
      .populate('patientId', 'uhid name age gender')
      .populate('bedId', 'ward roomNumber bedNumber')
      .populate('doctorId', 'name specialization');

    const bedside = admissions.map((a) => ({
      admissionId: a.admissionId,
      patient: a.patientId,
      bed: a.bedId,
      doctor: a.doctorId,
      admissionDate: a.admissionDate,
      diagnosis: a.diagnosis,
      daysAdmitted: Math.ceil(
        (new Date() - new Date(a.admissionDate)) / (1000 * 60 * 60 * 24)
      ),
      isolation: a.isolation,
      priority: a.priority,
    }));

    return sendSuccess(res, bedside);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// GET /discharge-planning — Patients ready for discharge
export const getDischargePlanning = async (req, res) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query);

    const admissions = await Admission.find({
      status: 'active',
      dischargePlanned: true,
    })
      .populate('patientId', 'uhid name age gender phone')
      .populate('bedId', 'ward roomNumber bedNumber')
      .populate('doctorId', 'name specialization')
      .skip(skip)
      .limit(limit)
      .sort({ dischargePlannedDate: 1 });

    const total = await Admission.countDocuments({
      status: 'active',
      dischargePlanned: true,
    });

    return sendPaginated(res, admissions, total, page, limit);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// GET /discharge-checklist/:uhid — Get discharge checklist items
export const getDischargeChecklist = async (req, res) => {
  try {
    const { uhid } = req.params;

    const patient = await Patient.findOne({ uhid });
    if (!patient) return sendError(res, 'Patient not found', 404);

    const admission = await Admission.findOne({
      patientId: patient._id,
      status: 'active',
    });

    if (!admission) return sendError(res, 'No active admission found', 404);

    const checklist = [
      { item: 'Doctor approval for discharge', completed: !!admission.dischargeApproved },
      { item: 'Final medication review', completed: !!admission.medicationReviewDone },
      { item: 'Lab results reviewed', completed: !!admission.labResultsReviewed },
      { item: 'Discharge summary prepared', completed: !!admission.dischargeSummaryPrepared },
      { item: 'Prescriptions written', completed: !!admission.prescriptionsWritten },
      { item: 'Follow-up appointment scheduled', completed: !!admission.followUpScheduled },
      { item: 'Patient/family education completed', completed: !!admission.patientEducationDone },
      { item: 'Outstanding bills cleared', completed: !!admission.billsCleared },
      { item: 'Belongings returned', completed: !!admission.belongingsReturned },
      { item: 'Bed cleared and cleaned', completed: false },
    ];

    return sendSuccess(res, {
      admissionId: admission.admissionId,
      patient: { uhid, name: patient.name },
      checklist,
      completedCount: checklist.filter((c) => c.completed).length,
      totalCount: checklist.length,
    });
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// POST /discharge/:uhid — Discharge patient
export const dischargePatient = async (req, res) => {
  try {
    const { uhid } = req.params;
    const { dischargeType, dischargeSummary, followUpDate, notes } = req.body;

    const patient = await Patient.findOne({ uhid });
    if (!patient) return sendError(res, 'Patient not found', 404);

    const admission = await Admission.findOne({
      patientId: patient._id,
      status: 'active',
    });
    if (!admission) return sendError(res, 'No active admission found', 404);

    admission.status = 'discharged';
    admission.dischargeDate = new Date();
    admission.dischargeType = dischargeType || 'medical';
    admission.dischargeSummary = dischargeSummary;
    admission.followUpDate = followUpDate;
    admission.dischargeNotes = notes;
    await admission.save();

    await Bed.findByIdAndUpdate(admission.bedId, {
      status: 'cleaning',
      currentAdmission: null,
    });

    await Patient.findByIdAndUpdate(patient._id, {
      lastVisit: new Date(),
      $push: { dischargeHistory: admission._id },
    });

    emitAlert({ type: 'discharge', message: `Patient discharged: ${uhid}`, admissionId: admission.admissionId });

    return sendSuccess(res, admission, 'Patient discharged successfully');
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// GET /cleaning — List beds needing cleaning
export const getCleaningBeds = async (req, res) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query);
    const filter = { status: 'cleaning' };

    const beds = await Bed.find(filter).skip(skip).limit(limit).sort({ updatedAt: 1 });
    const total = await Bed.countDocuments(filter);

    return sendPaginated(res, beds, total, page, limit);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// POST /cleaning/:id/complete — Mark cleaning complete
export const completeCleaning = async (req, res) => {
  try {
    const { id } = req.params;

    const bed = await Bed.findById(id);
    if (!bed) return sendError(res, 'Bed not found', 404);
    if (bed.status !== 'cleaning') return sendError(res, 'Bed is not in cleaning status', 400);

    bed.status = 'inspected';
    bed.cleanedAt = new Date();
    bed.cleanedBy = req.user?._id;
    await bed.save();

    return sendSuccess(res, bed, 'Cleaning completed, pending inspection');
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// POST /cleaning/:id/inspect — Inspect and make available
export const inspectBed = async (req, res) => {
  try {
    const { id } = req.params;
    const { approved, notes } = req.body;

    const bed = await Bed.findById(id);
    if (!bed) return sendError(res, 'Bed not found', 404);
    if (bed.status !== 'inspected') return sendError(res, 'Bed is not inspected', 400);

    if (!approved) {
      bed.status = 'cleaning';
      bed.inspectionNotes = notes;
      await bed.save();
      return sendSuccess(res, bed, 'Inspection failed, bed sent back for cleaning');
    }

    bed.status = 'available';
    bed.inspectedAt = new Date();
    bed.inspectedBy = req.user?._id;
    bed.inspectionNotes = notes;
    await bed.save();

    emitAlert({ type: 'bed', message: 'Bed available', bedId: bed._id, ward: bed.ward });

    return sendSuccess(res, bed, 'Bed is now available');
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// GET /occupancy — Occupancy metrics
export const getOccupancy = async (req, res) => {
  try {
    const { period = 'daily' } = req.query;

    const totalBeds = await Bed.countDocuments();

    let groupBy;
    if (period === 'daily') {
      groupBy = {
        year: { $year: '$admissionDate' },
        month: { $month: '$admissionDate' },
        day: { $dayOfMonth: '$admissionDate' },
      };
    } else if (period === 'weekly') {
      groupBy = {
        year: { $year: '$admissionDate' },
        week: { $week: '$admissionDate' },
      }
    } else {
      groupBy = {
        year: { $year: '$admissionDate' },
        month: { $month: '$admissionDate' },
      };
    }

    const admissions = await Admission.aggregate([
      { $match: { admissionDate: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } },
      { $group: { _id: groupBy, count: { $sum: 1 } } },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
    ]);

    const metrics = admissions.map((a) => ({
      period: a._id,
      admissions: a.count,
      occupancyRate: totalBeds > 0 ? ((a.count / totalBeds) * 100).toFixed(1) : 0,
    }));

    return sendSuccess(res, { totalBeds, period, data: metrics });
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// GET /reports/:type — Generate report
export const getReport = async (req, res) => {
  try {
    const { type } = req.params;
    const { startDate, endDate, ward } = req.query;

    const dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);

    const matchFilter = {};
    if (Object.keys(dateFilter).length > 0) {
      matchFilter.admissionDate = dateFilter;
    }

    let report;

    switch (type) {
      case 'admissions': {
        const pipeline = [{ $match: matchFilter }];
        if (ward) {
          pipeline.push({ $lookup: { from: 'beds', localField: 'bedId', foreignField: '_id', as: 'bed' } });
          pipeline.push({ $unwind: '$bed' });
          pipeline.push({ $match: { 'bed.ward': ward } });
        }
        pipeline.push({
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            avgLengthOfStay: {
              $avg: {
                $subtract: [{ $ifNull: ['$dischargeDate', new Date()] }, '$admissionDate'],
              },
            },
          },
        });
        report = await Admission.aggregate(pipeline);
        break;
      }
      case 'discharges': {
        matchFilter.status = 'discharged';
        if (Object.keys(dateFilter).length > 0) {
          matchFilter.dischargeDate = dateFilter;
          delete matchFilter.admissionDate;
        }
        report = await Admission.aggregate([
          { $match: matchFilter },
          {
            $group: {
              _id: '$dischargeType',
              count: { $sum: 1 },
              avgStay: {
                $avg: { $subtract: ['$dischargeDate', '$admissionDate'] },
              },
            },
          },
        ]);
        break;
      }
      case 'bed-occupancy': {
        report = await Bed.aggregate([
          ...(ward ? [{ $match: { ward } }] : []),
          {
            $group: {
              _id: { ward: '$ward', status: '$status' },
              count: { $sum: 1 },
            },
          },
        ]);
        break;
      }
      case 'length-of-stay': {
        report = await Admission.aggregate([
          { $match: { ...matchFilter, status: 'discharged' } },
          {
            $project: {
              duration: { $subtract: ['$dischargeDate', '$admissionDate'] },
              priority: 1,
              ward: 1,
            },
          },
          {
            $group: {
              _id: '$priority',
              avgStay: { $avg: '$duration' },
              minStay: { $min: '$duration' },
              maxStay: { $max: '$duration' },
              count: { $sum: 1 },
            },
          },
        ]);
        break;
      }
      default:
        return sendError(res, 'Invalid report type', 400);
    }

    return sendSuccess(res, { type, filters: { startDate, endDate, ward }, report });
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};
