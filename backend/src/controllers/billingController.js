import mongoose from "mongoose";
import Invoice from "../models/Invoice.js";
import Payment from "../models/Payment.js";
import Patient from "../models/Patient.js";
import AuditLog from "../models/AuditLog.js";
import { sendSuccess, sendError, sendPaginated } from "../utils/apiResponse.js";
import { getPaginationParams } from "../utils/pagination.js";

async function getNextInvoiceNumber() {
  const year = new Date().getFullYear();
  const prefix = `INV-${year}-`;
  const last = await Invoice.findOne({ invoiceNumber: new RegExp(`^${prefix}`) })
    .sort({ invoiceNumber: -1 })
    .lean();
  if (!last) return `${prefix}0001`;
  const num = parseInt(last.invoiceNumber.split("-").pop(), 10) + 1;
  return `${prefix}${String(num).padStart(4, "0")}`;
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
export const getDashboard = async (req, res, next) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const tomorrow = new Date(todayStart);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [revenueTodayAgg, pendingAgg, insurancePending, totalRevenueAgg, paymentModeBreakdown, deptRevenue] =
      await Promise.all([
        Invoice.aggregate([
          { $match: { date: { $gte: todayStart, $lt: tomorrow } } },
          { $group: { _id: null, total: { $sum: "$total" }, count: { $sum: 1 } } },
        ]),
        Invoice.aggregate([
          { $match: { status: { $in: ["pending", "partial"] } } },
          { $group: { _id: null, total: { $sum: { $subtract: ["$total", "$paid"] } } } },
        ]),
        Invoice.aggregate([
          { $match: { insuranceClaimed: true, status: { $in: ["pending", "partial"] } } },
          { $group: { _id: null, total: { $sum: "$insuranceAmount" }, count: { $sum: 1 } } },
        ]),
        Invoice.aggregate([
          { $match: { status: "paid" } },
          { $group: { _id: null, total: { $sum: "$total" } } },
        ]),
        Payment.aggregate([
          { $match: { status: "completed" } },
          { $group: { _id: "$mode", total: { $sum: "$amount" }, count: { $sum: 1 } } },
        ]),
        Invoice.aggregate([
          { $match: { date: { $gte: todayStart, $lt: tomorrow } } },
          { $group: { _id: "$dept", total: { $sum: "$total" }, count: { $sum: 1 } } },
          { $sort: { total: -1 } },
        ]),
      ]);

    const totalTodayPayments = await Payment.aggregate([
      { $match: { date: { $gte: todayStart, $lt: tomorrow }, status: "completed" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    sendSuccess(res, {
      todayRevenue: revenueTodayAgg[0]?.total || 0,
      todayTransactions: revenueTodayAgg[0]?.count || 0,
      pendingAmount: pendingAgg[0]?.total || 0,
      insuranceClaimsPending: insurancePending[0]?.total || 0,
      insuranceClaimsCount: insurancePending[0]?.count || 0,
      totalRevenue: totalRevenueAgg[0]?.total || 0,
      todayPayments: totalTodayPayments[0]?.total || 0,
      paymentModeBreakdown: paymentModeBreakdown,
      departmentRevenue: deptRevenue,
    });
  } catch (error) {
    next(error);
  }
};

// ─── Invoices ─────────────────────────────────────────────────────────────────
export const listInvoices = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationParams(req.query);
    const { status, date, patientId } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (patientId) filter.patientId = patientId;
    if (date) {
      const d = new Date(date);
      const nextDay = new Date(d);
      nextDay.setDate(nextDay.getDate() + 1);
      filter.date = { $gte: d, $lt: nextDay };
    }

    const [invoices, total] = await Promise.all([
      Invoice.find(filter)
        .populate("patientId", "uhid name phone")
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Invoice.countDocuments(filter),
    ]);

    sendPaginated(res, invoices, total, page, limit);
  } catch (error) {
    next(error);
  }
};

export const createInvoice = async (req, res, next) => {
  try {
    const { patientId, dept, doctor, items, mode } = req.body;
    if (!patientId || !items || !items.length) {
      return sendError(res, "patientId and items array are required", 400);
    }

    const patient = await Patient.findById(patientId).lean();
    if (!patient) return sendError(res, "Patient not found", 404);

    const total = items.reduce((sum, item) => sum + (item.amount || item.quantity * item.rate || 0), 0);

    const invoiceNumber = await getNextInvoiceNumber();

    const invoice = await Invoice.create({
      invoiceNumber,
      patientId,
      dept,
      doctor,
      items,
      total,
      mode,
      status: "pending",
    });

    const populated = await invoice.populate({ path: "patientId", select: "uhid name phone" });

    await AuditLog.create({
      userId: req.user.id,
      action: "create_invoice",
      entityType: "Invoice",
      entityId: invoice._id,
      details: { invoiceNumber, patientId, total },
    });

    sendSuccess(res, populated, "Invoice created", 201);
  } catch (error) {
    next(error);
  }
};

export const getInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate("patientId", "uhid name phone gender dob insurance")
      .lean();

    if (!invoice) return sendError(res, "Invoice not found", 404);

    const payments = await Payment.find({ invoiceId: invoice._id }).sort("-date").lean();

    sendSuccess(res, { ...invoice, payments });
  } catch (error) {
    next(error);
  }
};

export const payInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return sendError(res, "Invoice not found", 404);
    if (invoice.status === "paid") return sendError(res, "Invoice already fully paid", 400);
    if (invoice.status === "cancelled") return sendError(res, "Invoice is cancelled", 400);

    const { amount, mode, reference } = req.body;
    if (!amount || !mode) return sendError(res, "amount and mode are required", 400);

    if (amount > invoice.total - invoice.paid) {
      return sendError(res, "Payment exceeds outstanding amount", 400);
    }

    const payment = await Payment.create({
      invoiceId: invoice._id,
      amount,
      mode,
      reference,
      receivedBy: req.user.id,
      status: "completed",
    });

    invoice.paid += amount;
    if (invoice.paid >= invoice.total) invoice.status = "paid";
    else invoice.status = "partial";
    await invoice.save();

    await AuditLog.create({
      userId: req.user.id,
      action: "invoice_payment",
      entityType: "Invoice",
      entityId: invoice._id,
      details: { invoiceNumber: invoice.invoiceNumber, amount, mode },
    });

    sendSuccess(res, { invoice, payment }, "Payment processed");
  } catch (error) {
    next(error);
  }
};

// ─── Payments ─────────────────────────────────────────────────────────────────
export const listPayments = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationParams(req.query);
    const { invoiceId, date, mode } = req.query;

    const filter = {};
    if (invoiceId) filter.invoiceId = invoiceId;
    if (mode) filter.mode = mode;
    if (date) {
      const d = new Date(date);
      const nextDay = new Date(d);
      nextDay.setDate(nextDay.getDate() + 1);
      filter.date = { $gte: d, $lt: nextDay };
    }

    const [payments, total] = await Promise.all([
      Payment.find(filter)
        .populate("invoiceId", "invoiceNumber total")
        .populate("receivedBy", "name")
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Payment.countDocuments(filter),
    ]);

    sendPaginated(res, payments, total, page, limit);
  } catch (error) {
    next(error);
  }
};

export const recordPayment = async (req, res, next) => {
  try {
    const { invoiceId, amount, mode, reference } = req.body;
    if (!invoiceId || !amount || !mode) {
      return sendError(res, "invoiceId, amount, and mode are required", 400);
    }

    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) return sendError(res, "Invoice not found", 404);

    const payment = await Payment.create({
      invoiceId,
      amount,
      mode,
      reference,
      receivedBy: req.user.id,
      status: "completed",
    });

    invoice.paid += amount;
    if (invoice.paid >= invoice.total) invoice.status = "paid";
    else invoice.status = "partial";
    await invoice.save();

    await AuditLog.create({
      userId: req.user.id,
      action: "record_payment",
      entityType: "Payment",
      entityId: payment._id,
      details: { invoiceId, amount, mode },
    });

    sendSuccess(res, payment, "Payment recorded", 201);
  } catch (error) {
    next(error);
  }
};

// ─── Refunds ──────────────────────────────────────────────────────────────────
export const listRefunds = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationParams(req.query);

    const [refunds, total] = await Promise.all([
      AuditLog.find({ action: "refund" })
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      AuditLog.countDocuments({ action: "refund" }),
    ]);

    sendPaginated(res, refunds, total, page, limit);
  } catch (error) {
    next(error);
  }
};

export const createRefund = async (req, res, next) => {
  try {
    const { paymentId, amount, reason } = req.body;
    if (!paymentId || !amount) {
      return sendError(res, "paymentId and amount are required", 400);
    }

    const payment = await Payment.findById(paymentId).lean();
    if (!payment) return sendError(res, "Payment not found", 404);
    if (amount > payment.amount) return sendError(res, "Refund exceeds payment amount", 400);

    const refundLog = await AuditLog.create({
      userId: req.user.id,
      action: "refund",
      entityType: "Payment",
      entityId: payment._id,
      details: { paymentId, amount, reason, invoiceId: payment.invoiceId, status: "pending_approval" },
    });

    sendSuccess(res, refundLog, "Refund request created", 201);
  } catch (error) {
    next(error);
  }
};

export const approveRefund = async (req, res, next) => {
  try {
    const refundLog = await AuditLog.findById(req.params.id);
    if (!refundLog) return sendError(res, "Refund record not found", 404);
    if (refundLog.action !== "refund") return sendError(res, "Not a refund record", 400);
    if (refundLog.details.status === "approved") return sendError(res, "Refund already approved", 400);

    const { paymentId, amount, invoiceId } = refundLog.details;

    refundLog.details.status = "approved";
    refundLog.details.approvedBy = req.user.id;
    refundLog.details.approvedAt = new Date();
    await refundLog.save();

    if (paymentId) {
      await Payment.findByIdAndUpdate(paymentId, { status: "refunded" });
    }

    if (invoiceId) {
      const invoice = await Invoice.findById(invoiceId);
      if (invoice) {
        invoice.paid = Math.max(0, invoice.paid - amount);
        invoice.status = invoice.paid <= 0 ? "pending" : "partial";
        await invoice.save();
      }
    }

    await AuditLog.create({
      userId: req.user.id,
      action: "approve_refund",
      entityType: "Payment",
      entityId: paymentId,
      details: { amount, approvedBy: req.user.id },
    });

    sendSuccess(res, refundLog, "Refund approved");
  } catch (error) {
    next(error);
  }
};

// ─── Patient Financial Summary ────────────────────────────────────────────────
export const getPatientFinancialSummary = async (req, res, next) => {
  try {
    const patient = await Patient.findOne({ uhid: req.params.uhid }).lean();
    if (!patient) return sendError(res, "Patient not found", 404);

    const [invoiceAgg, paymentAgg] = await Promise.all([
      Invoice.aggregate([
        { $match: { patientId: patient._id } },
        { $group: { _id: null, totalBilled: { $sum: "$total" }, count: { $sum: 1 } } },
      ]),
      Payment.aggregate([
        { $match: { invoiceId: { $in: (await Invoice.find({ patientId: patient._id }).select("_id").lean()).map((i) => i._id) }, status: "completed" } },
        { $group: { _id: null, totalPaid: { $sum: "$amount" } } },
      ]),
    ]);

    const totalBilled = invoiceAgg[0]?.totalBilled || 0;
    const totalPaid = paymentAgg[0]?.totalPaid || 0;
    const pending = totalBilled - totalPaid;

    sendSuccess(res, {
      patient: { uhid: patient.uhid, name: patient.name },
      totalBilled,
      totalPaid,
      pending,
      invoiceCount: invoiceAgg[0]?.count || 0,
    });
  } catch (error) {
    next(error);
  }
};

// ─── Insurance ────────────────────────────────────────────────────────────────
export const getPatientInsurance = async (req, res, next) => {
  try {
    const patient = await Patient.findOne({ uhid: req.params.uhid })
      .select("uhid name insurance")
      .lean();

    if (!patient) return sendError(res, "Patient not found", 404);

    const claims = await AuditLog.find({
      action: "insurance_claim",
      "details.patientId": patient._id?.toString(),
    }).lean();

    sendSuccess(res, { patient, claims });
  } catch (error) {
    next(error);
  }
};

export const submitInsuranceClaim = async (req, res, next) => {
  try {
    const { invoiceId, patientId, insuranceProvider, policyNumber, claimedAmount, diagnosis } = req.body;
    if (!invoiceId || !insuranceProvider || !claimedAmount) {
      return sendError(res, "invoiceId, insuranceProvider, and claimedAmount are required", 400);
    }

    const invoice = await Invoice.findById(invoiceId).lean();
    if (!invoice) return sendError(res, "Invoice not found", 404);

    const claimLog = await AuditLog.create({
      userId: req.user.id,
      action: "insurance_claim",
      entityType: "InsuranceClaim",
      entityId: new mongoose.Types.ObjectId(),
      details: {
        invoiceId,
        patientId: patientId || invoice.patientId,
        insuranceProvider,
        policyNumber,
        claimedAmount,
        diagnosis,
        status: "submitted",
        invoiceNumber: invoice.invoiceNumber,
      },
    });

    await Invoice.findByIdAndUpdate(invoiceId, {
      insuranceClaimed: true,
      insuranceAmount: claimedAmount,
    });

    sendSuccess(res, claimLog, "Insurance claim submitted", 201);
  } catch (error) {
    next(error);
  }
};

export const listInsuranceClaims = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationParams(req.query);
    const { status } = req.query;

    const filter = { action: "insurance_claim" };
    if (status) filter["details.status"] = status;

    const [claims, total] = await Promise.all([
      AuditLog.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      AuditLog.countDocuments(filter),
    ]);

    sendPaginated(res, claims, total, page, limit);
  } catch (error) {
    next(error);
  }
};

export const updateInsuranceClaim = async (req, res, next) => {
  try {
    const claim = await AuditLog.findById(req.params.id);
    if (!claim) return sendError(res, "Claim not found", 404);
    if (claim.action !== "insurance_claim") return sendError(res, "Not an insurance claim", 400);

    const { status, approvedAmount, notes } = req.body;
    if (status) claim.details.status = status;
    if (approvedAmount !== undefined) claim.details.approvedAmount = approvedAmount;
    if (notes) claim.details.notes = notes;
    claim.details.updatedBy = req.user.id;
    claim.details.updatedAt = new Date();
    await claim.save();

    sendSuccess(res, claim, "Claim updated");
  } catch (error) {
    next(error);
  }
};

// ─── Cost Estimate ────────────────────────────────────────────────────────────
export const createCostEstimate = async (req, res, next) => {
  try {
    const { patientId, items, notes } = req.body;
    if (!items || !items.length) {
      return sendError(res, "items array is required", 400);
    }

    const total = items.reduce((sum, item) => sum + (item.amount || item.quantity * item.rate || 0), 0);
    const gst = total * 0.18;
    const estimateNumber = `EST-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;

    sendSuccess(res, {
      estimateNumber,
      patientId,
      items,
      subtotal: total,
      gst,
      totalWithGst: total + gst,
      notes,
      validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    }, "Cost estimate generated", 201);
  } catch (error) {
    next(error);
  }
};

// ─── Advances ─────────────────────────────────────────────────────────────────
export const listAdvances = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationParams(req.query);

    const [advances, total] = await Promise.all([
      AuditLog.find({ action: "advance_payment" })
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      AuditLog.countDocuments({ action: "advance_payment" }),
    ]);

    sendPaginated(res, advances, total, page, limit);
  } catch (error) {
    next(error);
  }
};

export const collectAdvance = async (req, res, next) => {
  try {
    const { patientId, amount, mode, reference } = req.body;
    if (!patientId || !amount || !mode) {
      return sendError(res, "patientId, amount, and mode are required", 400);
    }

    const patient = await Patient.findById(patientId).lean();
    if (!patient) return sendError(res, "Patient not found", 404);

    const advanceLog = await AuditLog.create({
      userId: req.user.id,
      action: "advance_payment",
      entityType: "Patient",
      entityId: patient._id,
      details: { patientId, uhid: patient.uhid, amount, mode, reference },
    });

    sendSuccess(res, advanceLog, "Advance collected", 201);
  } catch (error) {
    next(error);
  }
};

// ─── Corporate ────────────────────────────────────────────────────────────────
export const listCorporate = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationParams(req.query);

    const [accounts, total] = await Promise.all([
      Invoice.find({ mode: "corporate" })
        .populate("patientId", "uhid name")
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Invoice.countDocuments({ mode: "corporate" }),
    ]);

    sendPaginated(res, accounts, total, page, limit);
  } catch (error) {
    next(error);
  }
};

// ─── TPA ──────────────────────────────────────────────────────────────────────
export const listTPA = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationParams(req.query);

    const [records, total] = await Promise.all([
      Invoice.find({ mode: "insurance" })
        .populate("patientId", "uhid name insurance")
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Invoice.countDocuments({ mode: "insurance" }),
    ]);

    sendPaginated(res, records, total, page, limit);
  } catch (error) {
    next(error);
  }
};

// ─── Discharge Clearance ──────────────────────────────────────────────────────
export const getDischargeClearance = async (req, res, next) => {
  try {
    const patient = await Patient.findOne({ uhid: req.params.uhid }).lean();
    if (!patient) return sendError(res, "Patient not found", 404);

    const invoices = await Invoice.find({ patientId: patient._id }).lean();
    const totalBilled = invoices.reduce((sum, inv) => sum + inv.total, 0);
    const totalPaid = invoices.reduce((sum, inv) => sum + inv.paid, 0);
    const pending = totalBilled - totalPaid;
    const cleared = pending <= 0;

    sendSuccess(res, {
      patient: { uhid: patient.uhid, name: patient.name },
      totalBilled,
      totalPaid,
      pending,
      cleared,
      invoiceCount: invoices.length,
    });
  } catch (error) {
    next(error);
  }
};

export const grantDischargeClearance = async (req, res, next) => {
  try {
    const patient = await Patient.findOne({ uhid: req.params.uhid }).lean();
    if (!patient) return sendError(res, "Patient not found", 404);

    const invoices = await Invoice.find({ patientId: patient._id }).lean();
    const totalBilled = invoices.reduce((sum, inv) => sum + inv.total, 0);
    const totalPaid = invoices.reduce((sum, inv) => sum + inv.paid, 0);
    const pending = totalBilled - totalPaid;

    if (pending > 0 && !req.body.force) {
      return sendError(res, `Outstanding balance of ₹${pending} exists. Use force=true to override.`, 400);
    }

    await AuditLog.create({
      userId: req.user.id,
      action: "discharge_clearance",
      entityType: "Patient",
      entityId: patient._id,
      details: { uhid: patient.uhid, totalBilled, totalPaid, pending, forced: !!req.body.force },
    });

    sendSuccess(res, { uhid: patient.uhid, cleared: true, pending }, "Discharge clearance granted");
  } catch (error) {
    next(error);
  }
};

// ─── Charge Captures ──────────────────────────────────────────────────────────
export const listChargeCaptures = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationParams(req.query);

    const [captures, total] = await Promise.all([
      AuditLog.find({ action: "charge_capture" })
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      AuditLog.countDocuments({ action: "charge_capture" }),
    ]);

    sendPaginated(res, captures, total, page, limit);
  } catch (error) {
    next(error);
  }
};

export const reviewCharge = async (req, res, next) => {
  try {
    const capture = await AuditLog.findById(req.params.id);
    if (!capture) return sendError(res, "Charge capture not found", 404);
    if (capture.action !== "charge_capture") return sendError(res, "Not a charge capture", 400);

    const { status, notes } = req.body;
    capture.details.reviewStatus = status || "approved";
    capture.details.reviewedBy = req.user.id;
    capture.details.reviewedAt = new Date();
    if (notes) capture.details.reviewNotes = notes;
    await capture.save();

    sendSuccess(res, capture, "Charge reviewed");
  } catch (error) {
    next(error);
  }
};

// ─── Audit Logs ───────────────────────────────────────────────────────────────
export const getAuditLogs = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationParams(req.query);
    const { action, entityType, userId } = req.query;

    const filter = {};
    if (action) filter.action = action;
    if (entityType) filter.entityType = entityType;
    if (userId) filter.userId = userId;

    const [logs, total] = await Promise.all([
      AuditLog.find(filter)
        .populate("userId", "name email")
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      AuditLog.countDocuments(filter),
    ]);

    sendPaginated(res, logs, total, page, limit);
  } catch (error) {
    next(error);
  }
};

// ─── Analytics ────────────────────────────────────────────────────────────────
export const getAnalytics = async (req, res, next) => {
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [dailyRevenue, weeklyRevenue, monthlyByDept, paymentModeTrend, refundStats] = await Promise.all([
      Invoice.aggregate([
        { $match: { createdAt: { $gte: thirtyDaysAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            revenue: { $sum: "$total" },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      Invoice.aggregate([
        { $match: { createdAt: { $gte: sevenDaysAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            revenue: { $sum: "$total" },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      Invoice.aggregate([
        { $match: { createdAt: { $gte: thirtyDaysAgo } } },
        { $group: { _id: "$dept", revenue: { $sum: "$total" }, count: { $sum: 1 } } },
        { $sort: { revenue: -1 } },
      ]),
      Payment.aggregate([
        { $match: { createdAt: { $gte: thirtyDaysAgo }, status: "completed" } },
        {
          $group: {
            _id: { mode: "$mode", date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } } },
            total: { $sum: "$amount" },
            count: { $sum: 1 },
          },
        },
        { $sort: { "_id.date": 1 } },
      ]),
      AuditLog.aggregate([
        { $match: { action: "refund", createdAt: { $gte: thirtyDaysAgo } } },
        { $group: { _id: "$details.status", count: { $sum: 1 }, totalAmount: { $sum: "$details.amount" } } },
      ]),
    ]);

    sendSuccess(res, {
      dailyRevenue,
      weeklyRevenue,
      monthlyByDepartment: monthlyByDept,
      paymentModeTrend,
      refundStats,
    });
  } catch (error) {
    next(error);
  }
};

export const updateInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!invoice) return sendError(res, "Invoice not found", 404);
    sendSuccess(res, invoice, "Invoice updated");
  } catch (error) {
    next(error);
  }
};
