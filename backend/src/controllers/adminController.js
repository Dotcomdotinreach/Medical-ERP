import Patient from "../models/Patient.js";
import Admission from "../models/Admission.js";
import Bed from "../models/Bed.js";
import Surgery from "../models/Surgery.js";
import Employee from "../models/Employee.js";
import QueueEntry from "../models/QueueEntry.js";
import Setting from "../models/Setting.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";

export const getCensus = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [
      totalPatients,
      activePatients,
      admittedToday,
      dischargedToday,
      currentInpatients,
      erPatients,
    ] = await Promise.all([
      Patient.countDocuments({ status: "active" }),
      Patient.countDocuments({ status: "active", lastVisit: { $gte: today, $lt: tomorrow } }),
      Admission.countDocuments({ admitDate: { $gte: today, $lt: tomorrow } }),
      Admission.countDocuments({ dischargeDate: { $gte: today, $lt: tomorrow } }),
      Admission.countDocuments({ status: { $in: ["active", "transferred"] } }),
      QueueEntry.countDocuments({
        dept: "Emergency",
        date: { $gte: today, $lt: tomorrow },
        state: { $nin: ["Completed"] },
      }),
    ]);

    sendSuccess(res, {
      totalActivePatients: totalPatients,
      seenToday: activePatients,
      admittedToday,
      dischargedToday,
      currentInpatients,
      emergencyPatients: erPatients,
    });
  } catch (error) {
    next(error);
  }
};

export const getDepartmentKPIs = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const deptAdmissions = await Admission.aggregate([
      { $match: { admitDate: { $gte: today, $lt: tomorrow } } },
      { $group: { _id: "$dept", count: { $sum: 1 } } },
    ]);

    const deptDischarges = await Admission.aggregate([
      { $match: { dischargeDate: { $gte: today, $lt: tomorrow } } },
      { $group: { _id: "$dept", count: { $sum: 1 } } },
    ]);

    const deptQueue = await QueueEntry.aggregate([
      { $match: { date: { $gte: today, $lt: tomorrow }, dept: { $ne: "Emergency" } } },
      { $group: { _id: "$dept", total: { $sum: 1 }, waiting: { $sum: { $cond: [{ $eq: ["$state", "Waiting"] }, 1, 0] } } } },
    ]);

    const deptSurgeries = await Surgery.aggregate([
      { $match: { date: { $gte: today, $lt: tomorrow } } },
      { $group: { _id: "$department", count: { $sum: 1 } } },
    ]);

    const departments = {};
    deptAdmissions.forEach((d) => {
      if (!departments[d._id]) departments[d._id] = { admissions: 0, discharges: 0, queue: 0, waiting: 0, surgeries: 0 };
      departments[d._id].admissions = d.count;
    });
    deptDischarges.forEach((d) => {
      if (!departments[d._id]) departments[d._id] = { admissions: 0, discharges: 0, queue: 0, waiting: 0, surgeries: 0 };
      departments[d._id].discharges = d.count;
    });
    deptQueue.forEach((d) => {
      if (!departments[d._id]) departments[d._id] = { admissions: 0, discharges: 0, queue: 0, waiting: 0, surgeries: 0 };
      departments[d._id].queue = d.total;
      departments[d._id].waiting = d.waiting;
    });
    deptSurgeries.forEach((d) => {
      if (!departments[d._id]) departments[d._id] = { admissions: 0, discharges: 0, queue: 0, waiting: 0, surgeries: 0 };
      departments[d._id].surgeries = d.count;
    });

    sendSuccess(res, departments);
  } catch (error) {
    next(error);
  }
};

export const getBedStatus = async (req, res, next) => {
  try {
    const summary = await Bed.aggregate([
      {
        $group: {
          _id: { ward: "$ward", state: "$state" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.ward": 1 } },
    ]);

    const byWard = {};
    summary.forEach((item) => {
      if (!byWard[item._id.ward]) {
        byWard[item._id.ward] = { total: 0, available: 0, occupied: 0, reserved: 0, cleaning: 0, maintenance: 0 };
      }
      byWard[item._id.ward][item._id.state] = item.count;
      byWard[item._id.ward].total += item.count;
    });

    const totals = await Bed.aggregate([
      { $group: { _id: "$state", count: { $sum: 1 } } },
    ]);

    const totalSummary = { total: 0, available: 0, occupied: 0, reserved: 0, cleaning: 0, maintenance: 0 };
    totals.forEach((t) => {
      totalSummary[t._id] = t.count;
      totalSummary.total += t.count;
    });

    sendSuccess(res, { byWard, totals: totalSummary });
  } catch (error) {
    next(error);
  }
};

export const getOTStatus = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const surgeries = await Surgery.find({
      date: { $gte: today, $lt: tomorrow },
    })
      .populate("patientId", "uhid name")
      .populate("surgeonId", "name dept")
      .sort({ time: 1 })
      .lean();

    const statusCounts = { scheduled: 0, "pre-op": 0, "in-progress": 0, completed: 0, cancelled: 0 };
    surgeries.forEach((s) => {
      if (statusCounts[s.status] !== undefined) statusCounts[s.status]++;
    });

    sendSuccess(res, { surgeries, statusCounts });
  } catch (error) {
    next(error);
  }
};

export const getAlerts = async (req, res, next) => {
  try {
    const settings = await Setting.findOne({ module: "alerts" }).lean();
    const alerts = settings?.config?.activeAlerts || [];
    sendSuccess(res, alerts);
  } catch (error) {
    next(error);
  }
};

export const getIncidents = async (req, res, next) => {
  try {
    const settings = await Setting.findOne({ module: "incidents" }).lean();
    const incidents = settings?.config?.list || [];
    sendSuccess(res, incidents);
  } catch (error) {
    next(error);
  }
};

export const getStaffOnDuty = async (req, res, next) => {
  try {
    const { shift, department } = req.query;
    const filter = { status: "active" };
    if (shift) filter.shift = shift;
    if (department) filter.department = department;

    const staff = await Employee.find(filter)
      .populate("userId", "name email phone avatar")
      .lean();

    sendSuccess(res, staff);
  } catch (error) {
    next(error);
  }
};

export const getCompliance = async (req, res, next) => {
  try {
    const settings = await Setting.findOne({ module: "compliance" }).lean();
    const compliance = settings?.config?.records || [];
    sendSuccess(res, compliance);
  } catch (error) {
    next(error);
  }
};
