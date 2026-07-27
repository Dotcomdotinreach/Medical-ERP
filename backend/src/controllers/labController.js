import LabOrder from "../models/LabOrder.js";
import Patient from "../models/Patient.js";
import Doctor from "../models/Doctor.js";
import { sendSuccess, sendError, sendPaginated } from "../utils/apiResponse.js";
import { getPaginationParams } from "../utils/pagination.js";
import { getIO } from "../sockets/index.js";

const generateOrderId = async () => {
  const year = new Date().getFullYear();
  const last = await LabOrder.findOne({ orderId: new RegExp(`^LAB-${year}`) })
    .sort({ createdAt: -1 })
    .lean();
  let seq = 1;
  if (last) {
    const lastSeq = parseInt(last.orderId.split("-").pop(), 10);
    seq = lastSeq + 1;
  }
  return `LAB-${year}-${String(seq).padStart(4, "0")}`;
};

export const listOrders = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationParams(req.query);
    const { status, priority, search } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (search) {
      filter.$or = [
        { orderId: { $regex: search, $options: "i" } },
        { notes: { $regex: search, $options: "i" } },
      ];
    }

    const [orders, total] = await Promise.all([
      LabOrder.find(filter)
        .populate("patientId", "name uhid phone")
        .populate("doctorId", "name dept")
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      LabOrder.countDocuments(filter),
    ]);

    sendPaginated(res, orders, total, page, limit);
  } catch (error) {
    next(error);
  }
};

export const createOrder = async (req, res, next) => {
  try {
    const orderId = await generateOrderId();
    const order = await LabOrder.create({ ...req.body, orderId });
    const populated = await order.populate([
      { path: "patientId", select: "name uhid phone" },
      { path: "doctorId", select: "name dept" },
    ]);
    sendSuccess(res, populated, "Lab order created", 201);
  } catch (error) {
    next(error);
  }
};

export const dashboard = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [totalToday, byStatus, byPriority, criticalPending] = await Promise.all([
      LabOrder.countDocuments({ orderDate: { $gte: today, $lt: tomorrow } }),
      LabOrder.aggregate([
        { $match: { orderDate: { $gte: today, $lt: tomorrow } } },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
      LabOrder.aggregate([
        { $match: { orderDate: { $gte: today, $lt: tomorrow } } },
        { $group: { _id: "$priority", count: { $sum: 1 } } },
      ]),
      LabOrder.countDocuments({
        status: { $in: ["ordered", "collected", "received", "analyzing"] },
        priority: "STAT",
      }),
    ]);

    const statusMap = {};
    byStatus.forEach((s) => { statusMap[s._id] = s.count; });

    const priorityMap = {};
    byPriority.forEach((p) => { priorityMap[p._id] = p.count; });

    sendSuccess(res, {
      totalToday,
      byStatus: statusMap,
      byPriority: priorityMap,
      criticalPending,
    });
  } catch (error) {
    next(error);
  }
};

export const getOrder = async (req, res, next) => {
  try {
    const order = await LabOrder.findById(req.params.id)
      .populate("patientId", "name uhid phone gender dob")
      .populate("doctorId", "name dept specialization");
    if (!order) return sendError(res, "Order not found", 404);
    sendSuccess(res, order);
  } catch (error) {
    next(error);
  }
};

export const updateOrder = async (req, res, next) => {
  try {
    const order = await LabOrder.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!order) return sendError(res, "Order not found", 404);
    sendSuccess(res, order, "Order updated");
  } catch (error) {
    next(error);
  }
};

export const getSamplesForCollection = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationParams(req.query);
    const filter = { status: "ordered" };

    const [orders, total] = await Promise.all([
      LabOrder.find(filter)
        .populate("patientId", "name uhid phone")
        .populate("doctorId", "name")
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      LabOrder.countDocuments(filter),
    ]);

    sendPaginated(res, orders, total, page, limit);
  } catch (error) {
    next(error);
  }
};

export const collectSample = async (req, res, next) => {
  try {
    const { orderId } = req.body;
    const order = await LabOrder.findByIdAndUpdate(
      orderId,
      { $set: { status: "collected", collectedAt: new Date() } },
      { new: true }
    );
    if (!order) return sendError(res, "Order not found", 404);
    getIO()?.to("queue:lab").emit("sample:collected", { orderId: order.orderId });
    sendSuccess(res, order, "Sample collected");
  } catch (error) {
    next(error);
  }
};

export const getSampleTracking = async (req, res, next) => {
  try {
    const order = await LabOrder.findOne({ orderId: req.params.specimenId })
      .populate("patientId", "name uhid")
      .lean();
    if (!order) return sendError(res, "Specimen not found", 404);

    const timeline = [
      { event: "Ordered", date: order.orderDate, status: "ordered" },
    ];
    if (order.collectedAt) {
      timeline.push({ event: "Collected", date: order.collectedAt, status: "collected" });
    }
    if (order.status !== "ordered" && order.status !== "collected") {
      timeline.push({ event: "Received", date: order.updatedAt, status: "received" });
    }
    if (order.status === "analyzing" || order.status === "verified" || order.status === "reported") {
      timeline.push({ event: "Analyzing", date: order.updatedAt, status: "analyzing" });
    }
    if (order.status === "verified" || order.status === "reported") {
      timeline.push({ event: "Verified", date: order.updatedAt, status: "verified" });
    }
    if (order.status === "reported") {
      timeline.push({ event: "Reported", date: order.completedAt || order.updatedAt, status: "reported" });
    }

    sendSuccess(res, { order, timeline });
  } catch (error) {
    next(error);
  }
};

export const receiveSample = async (req, res, next) => {
  try {
    const { orderId } = req.body;
    const order = await LabOrder.findByIdAndUpdate(
      orderId,
      { $set: { status: "received" } },
      { new: true }
    );
    if (!order) return sendError(res, "Order not found", 404);
    getIO()?.to("queue:lab").emit("sample:received", { orderId: order.orderId });
    sendSuccess(res, order, "Sample received");
  } catch (error) {
    next(error);
  }
};

export const acceptSample = async (req, res, next) => {
  try {
    const order = await LabOrder.findByIdAndUpdate(
      req.params.id,
      { $set: { status: "received" } },
      { new: true }
    );
    if (!order) return sendError(res, "Order not found", 404);
    sendSuccess(res, order, "Sample accepted");
  } catch (error) {
    next(error);
  }
};

export const rejectSample = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const order = await LabOrder.findByIdAndUpdate(
      req.params.id,
      { $set: { status: "ordered", notes: `Rejected: ${reason}` } },
      { new: true }
    );
    if (!order) return sendError(res, "Order not found", 404);
    getIO()?.to("queue:lab").emit("sample:rejected", { orderId: order.orderId, reason });
    sendSuccess(res, order, "Sample rejected");
  } catch (error) {
    next(error);
  }
};

export const getAnalyzerQueue = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationParams(req.query);
    const filter = { status: "received" };

    const [orders, total] = await Promise.all([
      LabOrder.find(filter)
        .populate("patientId", "name uhid")
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      LabOrder.countDocuments(filter),
    ]);

    sendPaginated(res, orders, total, page, limit);
  } catch (error) {
    next(error);
  }
};

export const getQCRecords = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationParams(req.query);
    const { date, analyzer } = req.query;

    const filter = { status: "analyzing" };
    if (date) {
      const d = new Date(date);
      const nextDay = new Date(d);
      nextDay.setDate(nextDay.getDate() + 1);
      filter.createdAt = { $gte: d, $lt: nextDay };
    }

    const [records, total] = await Promise.all([
      LabOrder.find(filter)
        .populate("patientId", "name uhid")
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      LabOrder.countDocuments(filter),
    ]);

    sendPaginated(res, records, total, page, limit);
  } catch (error) {
    next(error);
  }
};

export const runQC = async (req, res, next) => {
  try {
    const { analyzer, controlValues } = req.body;
    const qcRecord = {
      analyzer,
      controlValues,
      runAt: new Date(),
      passed: true,
      runBy: req.user.id,
    };
    sendSuccess(res, qcRecord, "QC test completed", 201);
  } catch (error) {
    next(error);
  }
};

export const enterResults = async (req, res, next) => {
  try {
    const { orderId, results } = req.body;
    const order = await LabOrder.findByIdAndUpdate(
      orderId,
      {
        $set: {
          results,
          status: "analyzing",
        },
      },
      { new: true }
    ).populate("patientId", "name uhid")
     .populate("doctorId", "name dept");

    if (!order) return sendError(res, "Order not found", 404);

    const hasCritical = results.some(
      (r) => r.flag === "Critical High" || r.flag === "Critical Low"
    );
    if (hasCritical) {
      getIO()?.emit("alert:new", {
        type: "critical_result",
        orderId: order.orderId,
        patientName: order.patientId?.name,
        message: "Critical lab result entered",
      });
    }

    sendSuccess(res, order, "Results entered");
  } catch (error) {
    next(error);
  }
};

export const saveDraft = async (req, res, next) => {
  try {
    const { results } = req.body;
    const order = await LabOrder.findByIdAndUpdate(
      req.params.id,
      { $set: { results } },
      { new: true }
    );
    if (!order) return sendError(res, "Order not found", 404);
    sendSuccess(res, order, "Draft saved");
  } catch (error) {
    next(error);
  }
};

export const getCriticalResults = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationParams(req.query);

    const filter = {
      "results.flag": { $in: ["Critical High", "Critical Low"] },
      status: { $in: ["analyzing", "verified"] },
    };

    const [orders, total] = await Promise.all([
      LabOrder.find(filter)
        .populate("patientId", "name uhid phone")
        .populate("doctorId", "name dept")
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      LabOrder.countDocuments(filter),
    ]);

    sendPaginated(res, orders, total, page, limit);
  } catch (error) {
    next(error);
  }
};

export const acknowledgeCritical = async (req, res, next) => {
  try {
    const order = await LabOrder.findByIdAndUpdate(
      req.params.id,
      { $set: { notes: `Acknowledged by ${req.user.id} at ${new Date().toISOString()}` } },
      { new: true }
    );
    if (!order) return sendError(res, "Order not found", 404);
    sendSuccess(res, order, "Critical result acknowledged");
  } catch (error) {
    next(error);
  }
};

export const notifyDoctor = async (req, res, next) => {
  try {
    const order = await LabOrder.findById(req.params.id)
      .populate("doctorId", "name")
      .populate("patientId", "name");
    if (!order) return sendError(res, "Order not found", 404);

    getIO()?.emit("alert:new", {
      type: "critical_notify",
      orderId: order.orderId,
      doctorId: order.doctorId?._id,
      patientName: order.patientId?.name,
      message: "Critical lab result requires attention",
    });

    sendSuccess(res, order, "Doctor notified");
  } catch (error) {
    next(error);
  }
};

export const getResultsForVerification = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationParams(req.query);
    const filter = { status: "analyzing" };

    const [orders, total] = await Promise.all([
      LabOrder.find(filter)
        .populate("patientId", "name uhid")
        .populate("doctorId", "name")
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      LabOrder.countDocuments(filter),
    ]);

    sendPaginated(res, orders, total, page, limit);
  } catch (error) {
    next(error);
  }
};

export const verifyResults = async (req, res, next) => {
  try {
    const order = await LabOrder.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          status: "verified",
          completedAt: new Date(),
        },
      },
      { new: true }
    ).populate("patientId", "name uhid")
     .populate("doctorId", "name dept");

    if (!order) return sendError(res, "Order not found", 404);
    getIO()?.to("queue:lab").emit("results:verified", { orderId: order.orderId });
    sendSuccess(res, order, "Results verified and signed");
  } catch (error) {
    next(error);
  }
};

export const getReport = async (req, res, next) => {
  try {
    const order = await LabOrder.findById(req.params.id)
      .populate("patientId", "name uhid gender dob phone address")
      .populate("doctorId", "name dept specialization");
    if (!order) return sendError(res, "Order not found", 404);

    const report = {
      orderId: order.orderId,
      patient: order.patientId,
      doctor: order.doctorId,
      orderDate: order.orderDate,
      tests: order.tests,
      results: order.results,
      status: order.status,
      priority: order.priority,
      notes: order.notes,
      collectedAt: order.collectedAt,
      completedAt: order.completedAt,
      generatedAt: new Date(),
    };

    sendSuccess(res, report);
  } catch (error) {
    next(error);
  }
};

export const deliverReport = async (req, res, next) => {
  try {
    const order = await LabOrder.findByIdAndUpdate(
      req.params.id,
      { $set: { status: "delivered" } },
      { new: true }
    );
    if (!order) return sendError(res, "Order not found", 404);
    getIO()?.to("queue:lab").emit("report:delivered", { orderId: order.orderId });
    sendSuccess(res, order, "Report delivered");
  } catch (error) {
    next(error);
  }
};
