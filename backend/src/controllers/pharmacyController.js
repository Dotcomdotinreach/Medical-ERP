import mongoose from "mongoose";
import Prescription from "../models/Prescription.js";
import StockItem from "../models/StockItem.js";
import Patient from "../models/Patient.js";
import AuditLog from "../models/AuditLog.js";
import { sendSuccess, sendError, sendPaginated } from "../utils/apiResponse.js";
import { getPaginationParams } from "../utils/pagination.js";

const KNOWN_INTERACTIONS = [
  { drug1: "heparin", drug2: "aspirin", severity: "severe", description: "Increased risk of bleeding when combined" },
  { drug1: "warfarin", drug2: "ibuprofen", severity: "high", description: "NSAIDs increase anticoagulant effect and GI bleeding risk" },
  { drug1: "metformin", drug2: "alcohol", severity: "moderate", description: "Alcohol increases risk of lactic acidosis" },
  { drug1: "lisinopril", drug2: "potassium", severity: "high", description: "Risk of hyperkalemia" },
  { drug1: "sertraline", drug2: "tramadol", severity: "high", description: "Increased risk of serotonin syndrome" },
  { drug1: "simvastatin", drug2: "amiodarone", severity: "high", description: "Increased risk of rhabdomyolysis" },
  { drug1: "ciprofloxacin", drug2: "warfarin", severity: "high", description: "Enhanced anticoagulant effect" },
  { drug1: "metoprolol", drug2: "verapamil", severity: "high", description: "Risk of severe bradycardia and heart block" },
  { drug1: "lithium", drug2: "ibuprofen", severity: "high", description: "NSAIDs increase lithium levels" },
  { drug1: "digoxin", drug2: "amiodarone", severity: "high", description: "Increased digoxin levels, risk of toxicity" },
  { drug1: "fluoxetine", drug2: "maoi", severity: "severe", description: "Risk of serotonin syndrome, potentially fatal" },
  { drug1: "methotrexate", drug2: "ibuprofen", severity: "high", description: "Reduced renal clearance of methotrexate" },
];

function checkDrugInteractions(medications) {
  const warnings = [];
  const names = (medications || []).map((m) => (m.name || m.genericName || "").toLowerCase().trim());

  for (let i = 0; i < names.length; i++) {
    for (let j = i + 1; j < names.length; j++) {
      for (const interaction of KNOWN_INTERACTIONS) {
        const match =
          (names[i].includes(interaction.drug1) && names[j].includes(interaction.drug2)) ||
          (names[i].includes(interaction.drug2) && names[j].includes(interaction.drug1));
        if (match) {
          warnings.push({
            drug1: medications[i].name || medications[i].genericName,
            drug2: medications[j].name || medications[j].genericName,
            severity: interaction.severity,
            description: interaction.description,
          });
        }
      }
    }
  }
  return warnings;
}

async function getNextRxNumber() {
  const year = new Date().getFullYear();
  const prefix = `RX-${year}-`;
  const last = await Prescription.findOne({ rxNumber: new RegExp(`^${prefix}`) })
    .sort({ rxNumber: -1 })
    .lean();
  if (!last) return `${prefix}0001`;
  const num = parseInt(last.rxNumber.split("-").pop(), 10) + 1;
  return `${prefix}${String(num).padStart(4, "0")}`;
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
export const getDashboard = async (req, res, next) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const tomorrow = new Date(todayStart);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [pendingPrescriptions, dispensingToday, lowStock, expired, controlledAlerts] = await Promise.all([
      Prescription.countDocuments({ status: "pending" }),
      Prescription.countDocuments({ status: "dispensed", updatedAt: { $gte: todayStart, $lt: tomorrow } }),
      StockItem.countDocuments({ status: "low-stock" }),
      StockItem.countDocuments({ status: "expired" }),
      StockItem.countDocuments({ category: "controlled", status: "low-stock" }),
    ]);

    sendSuccess(res, {
      pendingPrescriptions,
      dispensingToday,
      lowStock,
      expired,
      controlledDrugAlerts: controlledAlerts,
    });
  } catch (error) {
    next(error);
  }
};

// ─── Prescriptions ────────────────────────────────────────────────────────────
export const listPrescriptions = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationParams(req.query);
    const { search, status } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (search) {
      const patients = await Patient.find({ name: new RegExp(search, "i") }).select("_id").lean();
      const patientIds = patients.map((p) => p._id);
      filter.$or = [
        { rxNumber: new RegExp(search, "i") },
        { patientId: { $in: patientIds } },
      ];
    }

    const [prescriptions, total] = await Promise.all([
      Prescription.find(filter)
        .populate("patientId", "uhid name phone")
        .populate("doctorId", "name dept")
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Prescription.countDocuments(filter),
    ]);

    sendPaginated(res, prescriptions, total, page, limit);
  } catch (error) {
    next(error);
  }
};

export const getPrescription = async (req, res, next) => {
  try {
    const rx = await Prescription.findById(req.params.rxId)
      .populate("patientId", "uhid name phone gender dob allergies")
      .populate("doctorId", "name dept")
      .lean();

    if (!rx) return sendError(res, "Prescription not found", 404);
    sendSuccess(res, rx);
  } catch (error) {
    next(error);
  }
};

export const createPrescription = async (req, res, next) => {
  try {
    const { patientId, doctorId, encounterId, medications, notes } = req.body;

    const patient = await Patient.findById(patientId).lean();
    if (!patient) return sendError(res, "Patient not found", 404);

    const rxNumber = await getNextRxNumber();

    const warnings = checkDrugInteractions(medications);

    const prescription = await Prescription.create({
      rxNumber,
      patientId,
      doctorId,
      encounterId,
      medications,
      notes,
      status: "pending",
    });

    const populated = await prescription.populate([
      { path: "patientId", select: "uhid name phone" },
      { path: "doctorId", select: "name dept" },
    ]);

    await AuditLog.create({
      userId: req.user.id,
      action: "create_prescription",
      entityType: "Prescription",
      entityId: prescription._id,
      details: { rxNumber, patientId },
    });

    sendSuccess(res, { prescription: populated, warnings }, "Prescription created", 201);
  } catch (error) {
    next(error);
  }
};

export const verifyPrescription = async (req, res, next) => {
  try {
    const rx = await Prescription.findById(req.params.rxId);
    if (!rx) return sendError(res, "Prescription not found", 404);
    if (rx.status !== "pending") return sendError(res, "Prescription is not pending", 400);

    const warnings = checkDrugInteractions(rx.medications);

    rx.status = "verified";
    await rx.save();

    await AuditLog.create({
      userId: req.user.id,
      action: "verify_prescription",
      entityType: "Prescription",
      entityId: rx._id,
      details: { rxNumber: rx.rxNumber, warnings },
    });

    sendSuccess(res, { prescription: rx, warnings }, "Prescription verified");
  } catch (error) {
    next(error);
  }
};

// ─── Drug Interactions ────────────────────────────────────────────────────────
export const checkDrugInteractionsEndpoint = async (req, res, next) => {
  try {
    const { medications } = req.body;
    if (!medications || !Array.isArray(medications)) {
      return sendError(res, "medications array is required", 400);
    }

    const warnings = checkDrugInteractions(medications);
    sendSuccess(res, { warnings, checked: medications.length });
  } catch (error) {
    next(error);
  }
};

// ─── Medicine Search ──────────────────────────────────────────────────────────
export const searchMedicines = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) return sendError(res, "Search query is required", 400);

    const regex = new RegExp(q, "i");
    const items = await StockItem.find({
      $or: [{ name: regex }, { genericName: regex }],
      status: { $nin: ["expired", "quarantined"] },
    })
      .limit(50)
      .lean();

    sendSuccess(res, items);
  } catch (error) {
    next(error);
  }
};

// ─── Stock ────────────────────────────────────────────────────────────────────
export const listStock = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationParams(req.query);
    const { category, status, search } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (search) {
      const regex = new RegExp(search, "i");
      filter.$or = [{ name: regex }, { sku: regex }, { batchNo: regex }];
    }

    const [items, total] = await Promise.all([
      StockItem.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      StockItem.countDocuments(filter),
    ]);

    sendPaginated(res, items, total, page, limit);
  } catch (error) {
    next(error);
  }
};

export const addStock = async (req, res, next) => {
  try {
    const { name, category, sku, manufacturer, batchNo, expiry, mrp, stockQty, reorderLevel, location, unit, supplier } = req.body;

    const existing = await StockItem.findOne({ sku });
    if (existing) return sendError(res, "SKU already exists", 409);

    const item = await StockItem.create({
      name, category, sku, manufacturer, batchNo, expiry, mrp, stockQty, reorderLevel, location, unit, supplier,
      status: stockQty <= 0 ? "out-of-stock" : stockQty <= (reorderLevel || 10) ? "low-stock" : "active",
    });

    sendSuccess(res, item, "Stock item added", 201);
  } catch (error) {
    next(error);
  }
};

export const updateStock = async (req, res, next) => {
  try {
    const item = await StockItem.findById(req.params.id);
    if (!item) return sendError(res, "Stock item not found", 404);

    const allowed = ["name", "category", "manufacturer", "batchNo", "expiry", "mrp", "stockQty", "reorderLevel", "location", "unit", "supplier", "status"];
    for (const key of allowed) {
      if (req.body[key] !== undefined) item[key] = req.body[key];
    }

    if (req.body.stockQty !== undefined) {
      if (item.stockQty <= 0) item.status = "out-of-stock";
      else if (item.stockQty <= (item.reorderLevel || 10)) item.status = "low-stock";
      else if (item.status === "out-of-stock" || item.status === "low-stock") item.status = "active";
    }

    item.lastUpdated = new Date();
    await item.save();

    sendSuccess(res, item, "Stock updated");
  } catch (error) {
    next(error);
  }
};

// ─── Barcode ──────────────────────────────────────────────────────────────────
export const verifyBarcode = async (req, res, next) => {
  try {
    const { batchNumber } = req.body;
    if (!batchNumber) return sendError(res, "batchNumber is required", 400);

    const item = await StockItem.findOne({ batchNo: batchNumber }).lean();
    if (!item) return sendError(res, "No stock item found for this batch", 404);

    sendSuccess(res, item);
  } catch (error) {
    next(error);
  }
};

// ─── Dispense ─────────────────────────────────────────────────────────────────
export const dispense = async (req, res, next) => {
  try {
    const { rxId, medications } = req.body;
    if (!rxId || !medications || !Array.isArray(medications)) {
      return sendError(res, "rxId and medications array are required", 400);
    }

    const rx = await Prescription.findById(rxId);
    if (!rx) return sendError(res, "Prescription not found", 404);
    if (rx.status === "dispensed") return sendError(res, "Prescription already dispensed", 400);

    const dispensingLog = [];
    for (const med of medications) {
      const stockItem = await StockItem.findOne({ name: new RegExp(med.name, "i"), status: { $nin: ["expired", "quarantined"] } });
      if (!stockItem) return sendError(res, `Stock not found for ${med.name}`, 404);
      if (stockItem.stockQty < med.quantity) {
        return sendError(res, `Insufficient stock for ${med.name}. Available: ${stockItem.stockQty}`, 400);
      }
      stockItem.stockQty -= med.quantity;
      if (stockItem.stockQty <= 0) stockItem.status = "out-of-stock";
      else if (stockItem.stockQty <= (stockItem.reorderLevel || 10)) stockItem.status = "low-stock";
      stockItem.lastUpdated = new Date();
      await stockItem.save();

      const rxMed = rx.medications.find((m) => m.name === med.name || (m.genericName && m.genericName === med.name));
      if (rxMed) {
        rxMed.dispensed = true;
        rxMed.dispensedQty = med.quantity;
      }

      dispensingLog.push({ name: med.name, quantity: med.quantity, batchNo: stockItem.batchNo });
    }

    const allDispensed = rx.medications.every((m) => m.dispensed);
    rx.status = allDispensed ? "dispensed" : "partial";
    await rx.save();

    await AuditLog.create({
      userId: req.user.id,
      action: "dispense",
      entityType: "Prescription",
      entityId: rx._id,
      details: { rxNumber: rx.rxNumber, dispensingLog },
    });

    sendSuccess(res, { prescription: rx, dispensingLog }, "Medications dispensed");
  } catch (error) {
    next(error);
  }
};

// ─── Emergency Dispense ───────────────────────────────────────────────────────
export const emergencyDispense = async (req, res, next) => {
  try {
    const { patientId, medications, justification, overriddenBy } = req.body;
    if (!patientId || !medications || !justification) {
      return sendError(res, "patientId, medications, and justification are required", 400);
    }

    const rxNumber = await getNextRxNumber();

    const rx = await Prescription.create({
      rxNumber,
      patientId,
      medications: medications.map((m) => ({ ...m, dispensed: true, dispensedQty: m.quantity })),
      notes: `[EMERGENCY] ${justification}`,
      status: "dispensed",
    });

    for (const med of medications) {
      const stockItem = await StockItem.findOne({ name: new RegExp(med.name, "i") });
      if (stockItem && stockItem.stockQty >= (med.quantity || 0)) {
        stockItem.stockQty -= med.quantity;
        if (stockItem.stockQty <= 0) stockItem.status = "out-of-stock";
        else if (stockItem.stockQty <= (stockItem.reorderLevel || 10)) stockItem.status = "low-stock";
        stockItem.lastUpdated = new Date();
        await stockItem.save();
      }
    }

    await AuditLog.create({
      userId: req.user.id,
      action: "emergency_dispense",
      entityType: "Prescription",
      entityId: rx._id,
      details: { rxNumber, justification, overriddenBy: overriddenBy || req.user.id },
    });

    sendSuccess(res, rx, "Emergency dispensing completed", 201);
  } catch (error) {
    next(error);
  }
};

// ─── Controlled Drugs ─────────────────────────────────────────────────────────
export const listControlledDrugs = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationParams(req.query);
    const filter = { category: "controlled" };

    const [items, total] = await Promise.all([
      StockItem.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      StockItem.countDocuments(filter),
    ]);

    sendPaginated(res, items, total, page, limit);
  } catch (error) {
    next(error);
  }
};

export const issueControlledDrug = async (req, res, next) => {
  try {
    const { stockId, quantity, pharmacistPin, witnessPin, patientId } = req.body;
    if (!stockId || !quantity || !pharmacistPin || !witnessPin) {
      return sendError(res, "stockId, quantity, pharmacistPin, and witnessPin are required", 400);
    }

    if (pharmacistPin !== "PHARM-OK" || witnessPin !== "WIT-OK") {
      return sendError(res, "Invalid PIN credentials", 401);
    }

    const item = await StockItem.findById(stockId);
    if (!item) return sendError(res, "Controlled drug not found", 404);
    if (item.category !== "controlled") return sendError(res, "Item is not a controlled drug", 400);
    if (item.stockQty < quantity) return sendError(res, "Insufficient stock", 400);

    item.stockQty -= quantity;
    if (item.stockQty <= 0) item.status = "out-of-stock";
    item.lastUpdated = new Date();
    await item.save();

    await AuditLog.create({
      userId: req.user.id,
      action: "issue_controlled_drug",
      entityType: "StockItem",
      entityId: item._id,
      details: { name: item.name, quantity, patientId, batchNo: item.batchNo },
    });

    sendSuccess(res, { item, issued: quantity }, "Controlled drug issued");
  } catch (error) {
    next(error);
  }
};

// ─── Returns ──────────────────────────────────────────────────────────────────
export const listReturns = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationParams(req.query);

    const [items, total] = await Promise.all([
      AuditLog.find({ action: "medication_return" })
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      AuditLog.countDocuments({ action: "medication_return" }),
    ]);

    sendPaginated(res, items, total, page, limit);
  } catch (error) {
    next(error);
  }
};

export const processReturn = async (req, res, next) => {
  try {
    const { stockId, quantity, action: returnAction, reason } = req.body;
    if (!stockId || !quantity || !returnAction) {
      return sendError(res, "stockId, quantity, and action (restock/dispose) are required", 400);
    }

    const item = await StockItem.findById(stockId);
    if (!item) return sendError(res, "Stock item not found", 404);

    if (returnAction === "restock") {
      item.stockQty += quantity;
      item.status = "active";
      item.lastUpdated = new Date();
      await item.save();
    }

    await AuditLog.create({
      userId: req.user.id,
      action: "medication_return",
      entityType: "StockItem",
      entityId: item._id,
      details: { name: item.name, quantity, returnAction, reason },
    });

    sendSuccess(res, { item, returnAction }, `Medication ${returnAction === "restock" ? "restocked" : "disposed"}`);
  } catch (error) {
    next(error);
  }
};

// ─── Purchase Orders ──────────────────────────────────────────────────────────
export const listPurchaseOrders = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationParams(req.query);

    const [items, total] = await Promise.all([
      AuditLog.find({ action: "create_purchase_order" })
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      AuditLog.countDocuments({ action: "create_purchase_order" }),
    ]);

    sendPaginated(res, items, total, page, limit);
  } catch (error) {
    next(error);
  }
};

export const createPurchaseOrder = async (req, res, next) => {
  try {
    const { supplier, items: orderItems, expectedDelivery } = req.body;
    if (!supplier || !orderItems || !orderItems.length) {
      return sendError(res, "supplier and items array are required", 400);
    }

    const poNumber = `PO-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;

    await AuditLog.create({
      userId: req.user.id,
      action: "create_purchase_order",
      entityType: "PurchaseOrder",
      entityId: new mongoose.Types.ObjectId(),
      details: { poNumber, supplier, items: orderItems, expectedDelivery },
    });

    sendSuccess(res, { poNumber, supplier, items: orderItems, expectedDelivery }, "Purchase order created", 201);
  } catch (error) {
    next(error);
  }
};

// ─── Pharmacy Billing ─────────────────────────────────────────────────────────
export const getBillingForPrescription = async (req, res, next) => {
  try {
    const rx = await Prescription.findById(req.params.rxId)
      .populate("patientId", "uhid name phone insurance")
      .lean();

    if (!rx) return sendError(res, "Prescription not found", 404);

    const billItems = [];
    for (const med of rx.medications) {
      const stockItem = await StockItem.findOne({ name: new RegExp(med.name, "i") }).lean();
      billItems.push({
        name: med.name,
        genericName: med.genericName,
        dosage: med.dosage,
        quantity: med.dispensedQty || 0,
        unitPrice: stockItem?.mrp || 0,
        total: (med.dispensedQty || 0) * (stockItem?.mrp || 0),
      });
    }

    const totalAmount = billItems.reduce((sum, item) => sum + item.total, 0);

    sendSuccess(res, {
      rxNumber: rx.rxNumber,
      patient: rx.patientId,
      items: billItems,
      totalAmount,
      insurance: rx.patientId?.insurance,
    });
  } catch (error) {
    next(error);
  }
};

export const processPayment = async (req, res, next) => {
  try {
    const { rxId, amount, mode, reference } = req.body;
    if (!rxId || !amount || !mode) {
      return sendError(res, "rxId, amount, and mode are required", 400);
    }

    const rx = await Prescription.findById(rxId).lean();
    if (!rx) return sendError(res, "Prescription not found", 404);

    await AuditLog.create({
      userId: req.user.id,
      action: "pharmacy_payment",
      entityType: "Prescription",
      entityId: rx._id,
      details: { rxNumber: rx.rxNumber, amount, mode, reference },
    });

    sendSuccess(res, { rxId, amount, mode, reference, status: "completed" }, "Payment processed", 201);
  } catch (error) {
    next(error);
  }
};

export const submitInsuranceClaim = async (req, res, next) => {
  try {
    const { rxId, insuranceProvider, policyNumber, claimedAmount } = req.body;
    if (!rxId || !insuranceProvider || !claimedAmount) {
      return sendError(res, "rxId, insuranceProvider, and claimedAmount are required", 400);
    }

    const rx = await Prescription.findById(rxId).lean();
    if (!rx) return sendError(res, "Prescription not found", 404);

    await AuditLog.create({
      userId: req.user.id,
      action: "pharmacy_insurance_claim",
      entityType: "Prescription",
      entityId: rx._id,
      details: { rxNumber: rx.rxNumber, insuranceProvider, policyNumber, claimedAmount },
    });

    sendSuccess(res, { rxId, insuranceProvider, claimedAmount, status: "submitted" }, "Insurance claim submitted", 201);
  } catch (error) {
    next(error);
  }
};

// ─── Expiry ───────────────────────────────────────────────────────────────────
export const listExpiryItems = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationParams(req.query);
    const now = new Date();
    const thirtyDays = new Date(now);
    thirtyDays.setDate(thirtyDays.getDate() + 30);

    const filter = {
      expiry: { $lte: thirtyDays },
    };
    if (req.query.expired === "true") {
      filter.expiry = { $lte: now };
    }

    const [items, total] = await Promise.all([
      StockItem.find(filter).sort({ expiry: 1 }).skip(skip).limit(limit).lean(),
      StockItem.countDocuments(filter),
    ]);

    sendPaginated(res, items, total, page, limit);
  } catch (error) {
    next(error);
  }
};

// ─── Suppliers ────────────────────────────────────────────────────────────────
export const listSuppliers = async (req, res, next) => {
  try {
    const suppliers = await StockItem.distinct("supplier");
    const supplierList = suppliers.filter(Boolean).map((s) => ({ name: s }));
    sendSuccess(res, supplierList);
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

    const [totalPrescriptions, dispensedCount, pendingCount, cancelledCount, stockByCategory, stockByStatus] = await Promise.all([
      Prescription.countDocuments(),
      Prescription.countDocuments({ status: "dispensed" }),
      Prescription.countDocuments({ status: "pending" }),
      Prescription.countDocuments({ status: "cancelled" }),
      StockItem.aggregate([
        { $group: { _id: "$category", count: { $sum: 1 }, totalQty: { $sum: "$stockQty" } } },
      ]),
      StockItem.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
    ]);

    sendSuccess(res, {
      prescriptions: { total: totalPrescriptions, dispensed: dispensedCount, pending: pendingCount, cancelled: cancelledCount },
      stockByCategory,
      stockByStatus,
    });
  } catch (error) {
    next(error);
  }
};
