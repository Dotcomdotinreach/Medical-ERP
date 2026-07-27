import ImagingOrder from "../models/ImagingOrder.js";
import Patient from "../models/Patient.js";
import Doctor from "../models/Doctor.js";
import { sendSuccess, sendError, sendPaginated } from "../utils/apiResponse.js";
import { getPaginationParams } from "../utils/pagination.js";
import { getIO } from "../sockets/index.js";

const generateOrderId = async () => {
  const year = new Date().getFullYear();
  const last = await ImagingOrder.findOne({ orderId: new RegExp(`^RAD-${year}`) })
    .sort({ createdAt: -1 })
    .lean();
  let seq = 1;
  if (last) {
    const lastSeq = parseInt(last.orderId.split("-").pop(), 10);
    seq = lastSeq + 1;
  }
  return `RAD-${year}-${String(seq).padStart(4, "0")}`;
};

export const dashboard = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [totalToday, byStatus, byModality, urgentCount] = await Promise.all([
      ImagingOrder.countDocuments({ orderDate: { $gte: today, $lt: tomorrow } }),
      ImagingOrder.aggregate([
        { $match: { orderDate: { $gte: today, $lt: tomorrow } } },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
      ImagingOrder.aggregate([
        { $match: { orderDate: { $gte: today, $lt: tomorrow } } },
        { $group: { _id: "$examType", count: { $sum: 1 } } },
      ]),
      ImagingOrder.countDocuments({
        orderDate: { $gte: today, $lt: tomorrow },
        priority: { $in: ["Urgent", "STAT"] },
      }),
    ]);

    const statusMap = {};
    byStatus.forEach((s) => { statusMap[s._id] = s.count; });

    const modalityMap = {};
    byModality.forEach((m) => { modalityMap[m._id] = m.count; });

    sendSuccess(res, {
      totalToday,
      byStatus: statusMap,
      byModality: modalityMap,
      urgentCount,
    });
  } catch (error) {
    next(error);
  }
};

export const listOrders = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationParams(req.query);
    const { status, priority, search, examType } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (examType) filter.examType = examType;
    if (search) {
      filter.$or = [
        { orderId: { $regex: search, $options: "i" } },
        { bodyPart: { $regex: search, $options: "i" } },
        { clinicalHistory: { $regex: search, $options: "i" } },
      ];
    }

    const [orders, total] = await Promise.all([
      ImagingOrder.find(filter)
        .populate("patientId", "name uhid phone")
        .populate("doctorId", "name dept")
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      ImagingOrder.countDocuments(filter),
    ]);

    sendPaginated(res, orders, total, page, limit);
  } catch (error) {
    next(error);
  }
};

export const createOrder = async (req, res, next) => {
  try {
    const orderId = await generateOrderId();
    const order = await ImagingOrder.create({ ...req.body, orderId });
    const populated = await order.populate([
      { path: "patientId", select: "name uhid phone" },
      { path: "doctorId", select: "name dept" },
    ]);
    sendSuccess(res, populated, "Imaging order created", 201);
  } catch (error) {
    next(error);
  }
};

export const scheduleStudy = async (req, res, next) => {
  try {
    const { scheduledDate, room, radiologist } = req.body;
    const order = await ImagingOrder.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          status: "scheduled",
          scheduledDate,
          room,
          radiologist,
        },
      },
      { new: true, runValidators: true }
    ).populate("patientId", "name uhid phone")
     .populate("doctorId", "name dept");

    if (!order) return sendError(res, "Order not found", 404);
    getIO()?.to("queue:radiology").emit("study:scheduled", { orderId: order.orderId });
    sendSuccess(res, order, "Study scheduled");
  } catch (error) {
    next(error);
  }
};

export const checkinPatient = async (req, res, next) => {
  try {
    const order = await ImagingOrder.findByIdAndUpdate(
      req.params.orderId,
      { $set: { status: "checked-in" } },
      { new: true }
    ).populate("patientId", "name uhid");

    if (!order) return sendError(res, "Order not found", 404);
    getIO()?.to("queue:radiology").emit("patient:checked-in", { orderId: order.orderId });
    sendSuccess(res, order, "Patient checked in");
  } catch (error) {
    next(error);
  }
};

export const getWorklist = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationParams(req.query);
    const { modality } = req.query;

    const filter = { status: { $in: ["scheduled", "checked-in"] } };
    if (modality) filter.examType = modality;

    const [orders, total] = await Promise.all([
      ImagingOrder.find(filter)
        .populate("patientId", "name uhid gender dob")
        .populate("doctorId", "name")
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      ImagingOrder.countDocuments(filter),
    ]);

    sendPaginated(res, orders, total, page, limit);
  } catch (error) {
    next(error);
  }
};

export const startAcquisition = async (req, res, next) => {
  try {
    const order = await ImagingOrder.findByIdAndUpdate(
      req.params.orderId,
      { $set: { status: "acquiring" } },
      { new: true }
    );
    if (!order) return sendError(res, "Order not found", 404);
    getIO()?.to("queue:radiology").emit("acquisition:started", { orderId: order.orderId });
    sendSuccess(res, order, "Image acquisition started");
  } catch (error) {
    next(error);
  }
};

export const uploadToPACS = async (req, res, next) => {
  try {
    const order = await ImagingOrder.findByIdAndUpdate(
      req.params.orderId,
      { $set: { status: "uploaded" } },
      { new: true }
    );
    if (!order) return sendError(res, "Order not found", 404);
    getIO()?.to("queue:radiology").emit("images:uploaded", { orderId: order.orderId });
    sendSuccess(res, order, "Images uploaded to PACS");
  } catch (error) {
    next(error);
  }
};

export const getAIFindings = async (req, res, next) => {
  try {
    const order = await ImagingOrder.findById(req.params.studyId)
      .populate("patientId", "name uhid")
      .lean();
    if (!order) return sendError(res, "Study not found", 404);
    sendSuccess(res, {
      orderId: order.orderId,
      aiFindings: order.aiFindings || [],
    });
  } catch (error) {
    next(error);
  }
};

export const acceptAIFinding = async (req, res, next) => {
  try {
    const order = await ImagingOrder.findById(req.params.id);
    if (!order) return sendError(res, "Order not found", 404);

    order.status = "reporting";
    await order.save();

    sendSuccess(res, order, "AI finding accepted, moved to reporting");
  } catch (error) {
    next(error);
  }
};

export const rejectAIFinding = async (req, res, next) => {
  try {
    const order = await ImagingOrder.findById(req.params.id);
    if (!order) return sendError(res, "Order not found", 404);

    order.status = "reporting";
    await order.save();

    sendSuccess(res, order, "AI finding rejected, moved to reporting");
  } catch (error) {
    next(error);
  }
};

export const saveDraftReport = async (req, res, next) => {
  try {
    const { findings, impression } = req.body;
    const order = await ImagingOrder.findByIdAndUpdate(
      req.params.orderId,
      {
        $set: {
          findings,
          impression,
          status: "reporting",
        },
      },
      { new: true }
    ).populate("patientId", "name uhid")
     .populate("doctorId", "name dept");

    if (!order) return sendError(res, "Order not found", 404);
    sendSuccess(res, order, "Draft report saved");
  } catch (error) {
    next(error);
  }
};

export const getCriticalFindings = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationParams(req.query);

    const filter = {
      status: { $in: ["reporting", "uploaded"] },
      $or: [
        { findings: { $regex: /critical|urgent|emergency/i } },
        { "aiFindings.finding": { $regex: /critical|urgent|emergency/i } },
      ],
    };

    const [orders, total] = await Promise.all([
      ImagingOrder.find(filter)
        .populate("patientId", "name uhid phone")
        .populate("doctorId", "name dept")
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      ImagingOrder.countDocuments(filter),
    ]);

    sendPaginated(res, orders, total, page, limit);
  } catch (error) {
    next(error);
  }
};

export const acknowledgeCritical = async (req, res, next) => {
  try {
    const order = await ImagingOrder.findByIdAndUpdate(
      req.params.id,
      { $set: { notes: `Acknowledged by ${req.user.id} at ${new Date().toISOString()}` } },
      { new: true }
    );
    if (!order) return sendError(res, "Order not found", 404);
    sendSuccess(res, order, "Critical finding acknowledged");
  } catch (error) {
    next(error);
  }
};

export const signReport = async (req, res, next) => {
  try {
    const order = await ImagingOrder.findByIdAndUpdate(
      req.params.orderId,
      {
        $set: {
          status: "signed",
          signedBy: req.user.id,
          signedAt: new Date(),
        },
      },
      { new: true }
    ).populate("patientId", "name uhid")
     .populate("doctorId", "name dept");

    if (!order) return sendError(res, "Order not found", 404);
    getIO()?.to("queue:radiology").emit("report:signed", { orderId: order.orderId });
    sendSuccess(res, order, "Report signed");
  } catch (error) {
    next(error);
  }
};

export const getFinalReport = async (req, res, next) => {
  try {
    const order = await ImagingOrder.findById(req.params.orderId)
      .populate("patientId", "name uhid gender dob phone address")
      .populate("doctorId", "name dept specialization");
    if (!order) return sendError(res, "Order not found", 404);

    const report = {
      orderId: order.orderId,
      patient: order.patientId,
      doctor: order.doctorId,
      examType: order.examType,
      bodyPart: order.bodyPart,
      clinicalHistory: order.clinicalHistory,
      findings: order.findings,
      impression: order.impression,
      aiFindings: order.aiFindings,
      signedBy: order.signedBy,
      signedAt: order.signedAt,
      status: order.status,
      orderDate: order.orderDate,
    };

    sendSuccess(res, report);
  } catch (error) {
    next(error);
  }
};

export const deliverReport = async (req, res, next) => {
  try {
    const order = await ImagingOrder.findByIdAndUpdate(
      req.params.orderId,
      { $set: { status: "delivered" } },
      { new: true }
    );
    if (!order) return sendError(res, "Order not found", 404);
    getIO()?.to("queue:radiology").emit("report:delivered", { orderId: order.orderId });
    sendSuccess(res, order, "Report delivered");
  } catch (error) {
    next(error);
  }
};

export const getEquipment = async (req, res, next) => {
  try {
    const equipment = [
      { name: "CT Scanner 1", modality: "CT", status: "online", currentPatient: null },
      { name: "CT Scanner 2", modality: "CT", status: "maintenance", currentPatient: null },
      { name: "MRI 1", modality: "MRI", status: "online", currentPatient: null },
      { name: "X-Ray 1", modality: "X-Ray", status: "online", currentPatient: null },
      { name: "X-Ray 2", modality: "X-Ray", status: "offline", currentPatient: null },
      { name: "Ultrasound 1", modality: "Ultrasound", status: "online", currentPatient: null },
      { name: "Mammography 1", modality: "Mammography", status: "online", currentPatient: null },
    ];
    sendSuccess(res, equipment);
  } catch (error) {
    next(error);
  }
};

export const getAnalytics = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const match = {};
    if (startDate || endDate) {
      match.orderDate = {};
      if (startDate) match.orderDate.$gte = new Date(startDate);
      if (endDate) match.orderDate.$lte = new Date(endDate);
    }

    const [byModality, byStatus, avgTurnaround] = await Promise.all([
      ImagingOrder.aggregate([
        ...(Object.keys(match).length ? [{ $match: match }] : []),
        { $group: { _id: "$examType", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      ImagingOrder.aggregate([
        ...(Object.keys(match).length ? [{ $match: match }] : []),
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
      ImagingOrder.aggregate([
        ...(Object.keys(match).length ? [{ $match: match }] : []),
        { $match: { status: "signed", signedAt: { $exists: true } } },
        {
          $project: {
            turnaroundMs: { $subtract: ["$signedAt", "$orderDate"] },
          },
        },
        {
          $group: {
            _id: null,
            avgTurnaroundMs: { $avg: "$turnaroundMs" },
          },
        },
      ]),
    ]);

    sendSuccess(res, {
      byModality,
      byStatus,
      avgTurnaroundHours: avgTurnaround[0]
        ? Math.round(avgTurnaround[0].avgTurnaroundMs / (1000 * 60 * 60) * 10) / 10
        : 0,
    });
  } catch (error) {
    next(error);
  }
};

export const getOrder = async (req, res, next) => {
  try {
    const order = await ImagingOrder.findById(req.params.id)
      .populate("patientId", "name uhid phone gender dob")
      .populate("doctorId", "name dept specialization")
      .lean();
    if (!order) return sendError(res, "Order not found", 404);
    sendSuccess(res, order);
  } catch (error) {
    next(error);
  }
};

export const updateOrder = async (req, res, next) => {
  try {
    const order = await ImagingOrder.findByIdAndUpdate(
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
