import mongoose from "mongoose";
import StockItem from "../models/StockItem.js";
import AuditLog from "../models/AuditLog.js";
import { sendSuccess, sendError, sendPaginated } from "../utils/apiResponse.js";
import { getPaginationParams } from "../utils/pagination.js";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function generateSKU(category) {
  const prefix = (category || "GEN").slice(0, 3).toUpperCase();
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 5).toUpperCase();
  return `${prefix}-${ts.slice(-4)}${rand}`;
}

function createBarcode() {
  const code = Date.now().toString().slice(-10);
  const check = code.split("").reduce((s, d) => s + parseInt(d), 0) % 10;
  return `${code}${check}`;
}

// ─── 1. Dashboard ─────────────────────────────────────────────────────────────

export const dashboard = async (req, res, next) => {
  try {
    const now = new Date();
    const thirtyDays = new Date(now);
    thirtyDays.setDate(thirtyDays.getDate() + 30);

    const [
      stockValue,
      itemCount,
      lowStock,
      outOfStock,
      pendingPOs,
      nearExpiry,
      expired,
      totalCategories,
      totalSuppliers,
    ] = await Promise.all([
      StockItem.aggregate([
        { $match: { status: { $nin: ["expired", "quarantined"] } } },
        { $group: { _id: null, total: { $sum: { $multiply: ["$mrp", "$stockQty"] } } } },
      ]),
      StockItem.countDocuments({ status: { $ne: "quarantined" } }),
      StockItem.countDocuments({ status: "low-stock" }),
      StockItem.countDocuments({ status: "out-of-stock" }),
      AuditLog.countDocuments({ action: "create_purchase_order", createdAt: { $gte: new Date(now - 30 * 86400000) } }),
      StockItem.countDocuments({ expiry: { $gt: now, $lte: thirtyDays }, status: { $nin: ["expired", "quarantined"] } }),
      StockItem.countDocuments({ status: "expired" }),
      StockItem.distinct("category").then((c) => c.filter(Boolean).length),
      StockItem.distinct("supplier").then((s) => s.filter(Boolean).length),
    ]);

    sendSuccess(res, {
      stockValue: stockValue[0]?.total || 0,
      itemCount,
      lowStock,
      outOfStock,
      pendingPOs,
      nearExpiry,
      expired,
      totalCategories,
      totalSuppliers,
    });
  } catch (error) {
    next(error);
  }
};

// ─── 2. List Stock Items ──────────────────────────────────────────────────────

export const listStockItems = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationParams(req.query);
    const { search, category, status, supplier, location } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (supplier) filter.supplier = new RegExp(supplier, "i");
    if (location) filter.location = new RegExp(location, "i");
    if (search) {
      const regex = new RegExp(search, "i");
      filter.$or = [
        { name: regex },
        { sku: regex },
        { batchNo: regex },
        { manufacturer: regex },
      ];
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

// ─── 3. Add Stock Item ────────────────────────────────────────────────────────

export const addStockItem = async (req, res, next) => {
  try {
    const { name, category, manufacturer, batchNo, expiry, mrp, stockQty, reorderLevel, location, unit, supplier } = req.body;
    if (!name) return sendError(res, "Name is required", 400);

    const sku = generateSKU(category);

    const status =
      stockQty <= 0
        ? "out-of-stock"
        : stockQty <= (reorderLevel || 10)
        ? "low-stock"
        : "active";

    const item = await StockItem.create({
      name,
      category,
      sku,
      manufacturer,
      batchNo,
      expiry,
      mrp,
      stockQty,
      reorderLevel,
      location,
      unit,
      supplier,
      status,
    });

    await AuditLog.create({
      userId: req.user.id,
      action: "add_stock_item",
      entityType: "StockItem",
      entityId: item._id,
      details: { name: item.name, sku: item.sku, stockQty, category },
    });

    sendSuccess(res, item, "Stock item added", 201);
  } catch (error) {
    next(error);
  }
};

// ─── 4. Update Stock Item ─────────────────────────────────────────────────────

export const updateStockItem = async (req, res, next) => {
  try {
    const item = await StockItem.findById(req.params.id);
    if (!item) return sendError(res, "Stock item not found", 404);

    const allowed = ["name", "category", "manufacturer", "batchNo", "expiry", "mrp", "stockQty", "reorderLevel", "location", "unit", "supplier", "status"];
    const changes = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        changes[key] = req.body[key];
        item[key] = req.body[key];
      }
    }

    if (req.body.stockQty !== undefined) {
      if (item.stockQty <= 0) item.status = "out-of-stock";
      else if (item.stockQty <= (item.reorderLevel || 10)) item.status = "low-stock";
      else if (item.status === "out-of-stock" || item.status === "low-stock") item.status = "active";
    }

    item.lastUpdated = new Date();
    await item.save();

    await AuditLog.create({
      userId: req.user.id,
      action: "update_stock_item",
      entityType: "StockItem",
      entityId: item._id,
      details: { name: item.name, sku: item.sku, changes },
    });

    sendSuccess(res, item, "Stock item updated");
  } catch (error) {
    next(error);
  }
};

// ─── 5. Delete Stock Item (Soft) ──────────────────────────────────────────────

export const deleteStockItem = async (req, res, next) => {
  try {
    const item = await StockItem.findById(req.params.id);
    if (!item) return sendError(res, "Stock item not found", 404);

    item.status = "quarantined";
    item.lastUpdated = new Date();
    await item.save();

    await AuditLog.create({
      userId: req.user.id,
      action: "soft_delete_stock_item",
      entityType: "StockItem",
      entityId: item._id,
      details: { name: item.name, sku: item.sku },
    });

    sendSuccess(res, item, "Stock item archived");
  } catch (error) {
    next(error);
  }
};

// ─── 6. Departments ───────────────────────────────────────────────────────────

export const getDepartments = async (req, res, next) => {
  try {
    const departments = await StockItem.aggregate([
      { $match: { location: { $exists: true, $ne: null }, status: { $ne: "quarantined" } } },
      {
        $group: {
          _id: "$location",
          totalItems: { $sum: 1 },
          totalQuantity: { $sum: "$stockQty" },
          totalValue: { $sum: { $multiply: ["$mrp", "$stockQty"] } },
          categories: { $addToSet: "$category" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    sendSuccess(res, departments);
  } catch (error) {
    next(error);
  }
};

// ─── 7. List Requisitions ─────────────────────────────────────────────────────

export const listRequisitions = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationParams(req.query);
    const { status } = req.query;

    const filter = { action: "create_requisition" };
    if (status) filter["details.status"] = status;

    const [items, total] = await Promise.all([
      AuditLog.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      AuditLog.countDocuments(filter),
    ]);

    sendPaginated(res, items, total, page, limit);
  } catch (error) {
    next(error);
  }
};

// ─── 8. Create Requisition ────────────────────────────────────────────────────

export const createRequisition = async (req, res, next) => {
  try {
    const { department, items, justification, priority } = req.body;
    if (!department || !items || !items.length) {
      return sendError(res, "department and items array are required", 400);
    }

    const reqId = `REQ-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;

    await AuditLog.create({
      userId: req.user.id,
      action: "create_requisition",
      entityType: "Requisition",
      entityId: new mongoose.Types.ObjectId(),
      details: { reqId, department, items, justification, priority: priority || "normal", status: "pending" },
    });

    sendSuccess(res, { reqId, department, items, justification, priority, status: "pending" }, "Requisition created", 201);
  } catch (error) {
    next(error);
  }
};

// ─── 9. Approve Requisition ───────────────────────────────────────────────────

export const approveRequisition = async (req, res, next) => {
  try {
    const log = await AuditLog.findById(req.params.id);
    if (!log || log.action !== "create_requisition") {
      return sendError(res, "Requisition not found", 404);
    }

    log.details.status = "approved";
    log.details.approvedBy = req.user.id;
    log.details.approvedAt = new Date();
    await log.save();

    await AuditLog.create({
      userId: req.user.id,
      action: "approve_requisition",
      entityType: "Requisition",
      entityId: log._id,
      details: { reqId: log.details.reqId },
    });

    sendSuccess(res, log, "Requisition approved");
  } catch (error) {
    next(error);
  }
};

// ─── 10. Reject Requisition ───────────────────────────────────────────────────

export const rejectRequisition = async (req, res, next) => {
  try {
    const log = await AuditLog.findById(req.params.id);
    if (!log || log.action !== "create_requisition") {
      return sendError(res, "Requisition not found", 404);
    }

    const { reason } = req.body;
    log.details.status = "rejected";
    log.details.rejectedBy = req.user.id;
    log.details.rejectedAt = new Date();
    log.details.rejectionReason = reason;
    await log.save();

    await AuditLog.create({
      userId: req.user.id,
      action: "reject_requisition",
      entityType: "Requisition",
      entityId: log._id,
      details: { reqId: log.details.reqId, reason },
    });

    sendSuccess(res, log, "Requisition rejected");
  } catch (error) {
    next(error);
  }
};

// ─── 11. List Purchase Orders ─────────────────────────────────────────────────

export const listPOs = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationParams(req.query);
    const { status, supplier } = req.query;

    const filter = { action: { $in: ["create_purchase_order", "receive_purchase_order"] } };
    if (status) filter["details.status"] = status;
    if (supplier) filter["details.supplier"] = new RegExp(supplier, "i");

    const [items, total] = await Promise.all([
      AuditLog.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      AuditLog.countDocuments(filter),
    ]);

    sendPaginated(res, items, total, page, limit);
  } catch (error) {
    next(error);
  }
};

// ─── 12. Create Purchase Order ────────────────────────────────────────────────

export const createPO = async (req, res, next) => {
  try {
    const { supplier, items: orderItems, expectedDelivery, notes } = req.body;
    if (!supplier || !orderItems || !orderItems.length) {
      return sendError(res, "supplier and items array are required", 400);
    }

    const poNumber = `PO-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
    const totalAmount = orderItems.reduce((sum, i) => sum + (i.unitPrice || 0) * (i.quantity || 0), 0);

    await AuditLog.create({
      userId: req.user.id,
      action: "create_purchase_order",
      entityType: "PurchaseOrder",
      entityId: new mongoose.Types.ObjectId(),
      details: { poNumber, supplier, items: orderItems, expectedDelivery, totalAmount, notes, status: "pending" },
    });

    sendSuccess(res, { poNumber, supplier, items: orderItems, expectedDelivery, totalAmount, status: "pending" }, "Purchase order created", 201);
  } catch (error) {
    next(error);
  }
};

// ─── 13. Receive Purchase Order ───────────────────────────────────────────────

export const receivePO = async (req, res, next) => {
  try {
    const log = await AuditLog.findById(req.params.id);
    if (!log || log.action !== "create_purchase_order") {
      return sendError(res, "Purchase order not found", 404);
    }

    const { receivedItems, grnNumber } = req.body;
    if (!receivedItems || !receivedItems.length) {
      return sendError(res, "receivedItems array is required", 400);
    }

    const stockUpdates = [];
    for (const ri of receivedItems) {
      const item = await StockItem.findById(ri.stockItemId);
      if (item) {
        item.stockQty += ri.quantityReceived;
        if (item.status === "out-of-stock") item.status = "active";
        else if (item.status === "low-stock" && item.stockQty > item.reorderLevel) item.status = "active";
        item.lastUpdated = new Date();
        await item.save();
        stockUpdates.push({ name: item.name, sku: item.sku, added: ri.quantityReceived });
      }
    }

    log.details.status = "received";
    log.details.receivedBy = req.user.id;
    log.details.receivedAt = new Date();
    log.details.receivedItems = receivedItems;
    log.details.grnNumber = grnNumber;
    await log.save();

    await AuditLog.create({
      userId: req.user.id,
      action: "receive_purchase_order",
      entityType: "PurchaseOrder",
      entityId: log._id,
      details: { poNumber: log.details.poNumber, grnNumber, stockUpdates },
    });

    sendSuccess(res, { po: log.details, stockUpdates }, "Purchase order received and stock updated");
  } catch (error) {
    next(error);
  }
};

// ─── 14. List Suppliers ───────────────────────────────────────────────────────

export const listSuppliers = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query);
    const { search } = req.query;

    let suppliers = await StockItem.distinct("supplier");
    suppliers = suppliers.filter(Boolean).map((s) => ({ name: s }));

    if (search) {
      const regex = new RegExp(search, "i");
      suppliers = suppliers.filter((s) => regex.test(s.name));
    }

    const total = suppliers.length;
    const paginated = suppliers.slice(skip, skip + limit);

    sendPaginated(res, paginated, total, page, limit);
  } catch (error) {
    next(error);
  }
};

// ─── 15. Add Supplier ─────────────────────────────────────────────────────────

export const addSupplier = async (req, res, next) => {
  try {
    const { name, contact, phone, email, address } = req.body;
    if (!name) return sendError(res, "Supplier name is required", 400);

    await AuditLog.create({
      userId: req.user.id,
      action: "add_supplier",
      entityType: "Supplier",
      entityId: new mongoose.Types.ObjectId(),
      details: { name, contact, phone, email, address },
    });

    sendSuccess(res, { name, contact, phone, email, address }, "Supplier added", 201);
  } catch (error) {
    next(error);
  }
};

// ─── 16. List GRN ─────────────────────────────────────────────────────────────

export const listGRN = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationParams(req.query);

    const [items, total] = await Promise.all([
      AuditLog.find({ action: { $in: ["receive_purchase_order", "accept_grn"] } })
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      AuditLog.countDocuments({ action: { $in: ["receive_purchase_order", "accept_grn"] } }),
    ]);

    sendPaginated(res, items, total, page, limit);
  } catch (error) {
    next(error);
  }
};

// ─── 17. Accept GRN ───────────────────────────────────────────────────────────

export const acceptGRN = async (req, res, next) => {
  try {
    const log = await AuditLog.findById(req.params.id);
    if (!log) return sendError(res, "GRN record not found", 404);

    const { accepted, remarks } = req.body;

    await AuditLog.create({
      userId: req.user.id,
      action: "accept_grn",
      entityType: "GRN",
      entityId: log._id,
      details: { grnId: log._id, accepted: accepted !== false, remarks },
    });

    sendSuccess(res, { grnId: log._id, accepted: accepted !== false, remarks }, "GRN processed");
  } catch (error) {
    next(error);
  }
};

// ─── 18. List Batches ─────────────────────────────────────────────────────────

export const listBatches = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationParams(req.query);
    const { category, expiringWithin } = req.query;

    const filter = { batchNo: { $exists: true, $ne: null } };
    if (category) filter.category = category;

    if (expiringWithin) {
      const days = parseInt(expiringWithin) || 30;
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + days);
      filter.expiry = { $lte: futureDate, $gt: new Date() };
    }

    const [items, total] = await Promise.all([
      StockItem.find(filter)
        .select("name sku batchNo expiry mrp stockQty category supplier status")
        .sort(sort || { expiry: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      StockItem.countDocuments(filter),
    ]);

    sendPaginated(res, items, total, page, limit);
  } catch (error) {
    next(error);
  }
};

// ─── 19. Generate Barcode ─────────────────────────────────────────────────────

export const generateBarcode = async (req, res, next) => {
  try {
    const { stockItemId, count } = req.body;
    if (!stockItemId) return sendError(res, "stockItemId is required", 400);

    const item = await StockItem.findById(stockItemId);
    if (!item) return sendError(res, "Stock item not found", 404);

    const quantity = Math.min(parseInt(count) || 1, 100);
    const barcodes = [];

    for (let i = 0; i < quantity; i++) {
      barcodes.push({
        barcode: createBarcode(),
        sku: item.sku,
        name: item.name,
        batchNo: item.batchNo,
        expiry: item.expiry,
        generatedAt: new Date(),
      });
    }

    sendSuccess(res, { item: { name: item.name, sku: item.sku }, barcodes }, "Barcodes generated");
  } catch (error) {
    next(error);
  }
};

// ─── 20. Scan Barcode ─────────────────────────────────────────────────────────

export const scanBarcode = async (req, res, next) => {
  try {
    const { barcode, batchNo, sku } = req.body;
    if (!barcode && !batchNo && !sku) {
      return sendError(res, "barcode, batchNo, or sku is required", 400);
    }

    let item = null;
    if (batchNo) item = await StockItem.findOne({ batchNo }).lean();
    else if (sku) item = await StockItem.findOne({ sku }).lean();
    else if (barcode) {
      const code = barcode.slice(0, 10);
      item = await StockItem.findOne({ batchNo: new RegExp(code) }).lean();
      if (!item) item = await StockItem.findOne({ sku: new RegExp(barcode, "i") }).lean();
    }

    if (!item) return sendError(res, "No item found for this barcode", 404);

    sendSuccess(res, item);
  } catch (error) {
    next(error);
  }
};

// ─── 21. List Transfers ───────────────────────────────────────────────────────

export const listTransfers = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationParams(req.query);

    const [items, total] = await Promise.all([
      AuditLog.find({ action: "stock_transfer" })
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      AuditLog.countDocuments({ action: "stock_transfer" }),
    ]);

    sendPaginated(res, items, total, page, limit);
  } catch (error) {
    next(error);
  }
};

// ─── 22. Create Transfer ──────────────────────────────────────────────────────

export const createTransfer = async (req, res, next) => {
  try {
    const { stockItemId, fromDepartment, toDepartment, quantity, reason } = req.body;
    if (!stockItemId || !fromDepartment || !toDepartment || !quantity) {
      return sendError(res, "stockItemId, fromDepartment, toDepartment, and quantity are required", 400);
    }

    if (fromDepartment === toDepartment) {
      return sendError(res, "Source and destination departments must differ", 400);
    }

    const item = await StockItem.findById(stockItemId);
    if (!item) return sendError(res, "Stock item not found", 404);
    if (item.stockQty < quantity) {
      return sendError(res, `Insufficient stock. Available: ${item.stockQty}`, 400);
    }

    item.stockQty -= quantity;
    if (item.stockQty <= 0) item.status = "out-of-stock";
    else if (item.stockQty <= (item.reorderLevel || 10)) item.status = "low-stock";
    item.lastUpdated = new Date();
    await item.save();

    const transferId = `TRF-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;

    await AuditLog.create({
      userId: req.user.id,
      action: "stock_transfer",
      entityType: "Transfer",
      entityId: new mongoose.Types.ObjectId(),
      details: { transferId, stockItemId: item._id, itemName: item.name, sku: item.sku, fromDepartment, toDepartment, quantity, reason },
    });

    sendSuccess(res, { transferId, item: { name: item.name, sku: item.sku }, fromDepartment, toDepartment, quantity, reason }, "Stock transfer completed", 201);
  } catch (error) {
    next(error);
  }
};

// ─── 23. List Cycle Counts ────────────────────────────────────────────────────

export const listCycleCounts = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationParams(req.query);

    const [items, total] = await Promise.all([
      AuditLog.find({ action: "cycle_count" })
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      AuditLog.countDocuments({ action: "cycle_count" }),
    ]);

    sendPaginated(res, items, total, page, limit);
  } catch (error) {
    next(error);
  }
};

// ─── 24. List Audit ───────────────────────────────────────────────────────────

export const listAudit = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationParams(req.query);
    const { entityType, action, startDate, endDate } = req.query;

    const filter = {};
    if (entityType) filter.entityType = entityType;
    if (action) filter.action = action;
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const [items, total] = await Promise.all([
      AuditLog.find(filter)
        .populate("userId", "name email")
        .sort(sort || "-createdAt")
        .skip(skip)
        .limit(limit)
        .lean(),
      AuditLog.countDocuments(filter),
    ]);

    sendPaginated(res, items, total, page, limit);
  } catch (error) {
    next(error);
  }
};

// ─── 25. List Assets ──────────────────────────────────────────────────────────

export const listAssets = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationParams(req.query);
    const { category, status, search } = req.query;

    const filter = { category: { $exists: true, $ne: null } };
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (search) {
      const regex = new RegExp(search, "i");
      filter.$or = [{ name: regex }, { sku: regex }, { location: regex }];
    }

    const [items, total] = await Promise.all([
      StockItem.find(filter)
        .select("name sku category location mrp stockQty status lastUpdated")
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      StockItem.countDocuments(filter),
    ]);

    sendPaginated(res, items, total, page, limit);
  } catch (error) {
    next(error);
  }
};

// ─── 26. Get Reports ──────────────────────────────────────────────────────────

export const getReports = async (req, res, next) => {
  try {
    const { type } = req.params;
    const { startDate, endDate, format } = req.query;

    const filter = {};
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    let reportData = {};

    switch (type) {
      case "stock-summary": {
        const summary = await StockItem.aggregate([
          { $match: filter },
          {
            $group: {
              _id: "$category",
              totalItems: { $sum: 1 },
              totalQty: { $sum: "$stockQty" },
              totalValue: { $sum: { $multiply: ["$mrp", "$stockQty"] } },
            },
          },
          { $sort: { _id: 1 } },
        ]);
        reportData = { type: "stock-summary", data: summary };
        break;
      }
      case "low-stock": {
        const lowStockItems = await StockItem.find({
          $expr: { $lte: ["$stockQty", "$reorderLevel"] },
          status: { $ne: "quarantined" },
        }).lean();
        reportData = { type: "low-stock", data: lowStockItems };
        break;
      }
      case "expiry": {
        const now = new Date();
        const thirtyDays = new Date(now);
        thirtyDays.setDate(thirtyDays.getDate() + 30);
        const expiredItems = await StockItem.find({
          expiry: { $lte: thirtyDays },
          status: { $ne: "quarantined" },
        }).sort({ expiry: 1 }).lean();
        reportData = { type: "expiry", data: expiredItems };
        break;
      }
      case "supplier-performance": {
        const supplierData = await StockItem.aggregate([
          { $match: { supplier: { $exists: true, $ne: null } } },
          {
            $group: {
              _id: "$supplier",
              totalItems: { $sum: 1 },
              totalQty: { $sum: "$stockQty" },
              totalValue: { $sum: { $multiply: ["$mrp", "$stockQty"] } },
              categories: { $addToSet: "$category" },
            },
          },
          { $sort: { totalValue: -1 } },
        ]);
        reportData = { type: "supplier-performance", data: supplierData };
        break;
      }
      case "consumption": {
        const logs = await AuditLog.find({
          action: { $in: ["dispense", "stock_transfer", "medication_return"] },
          ...filter,
        }).lean();
        reportData = { type: "consumption", data: logs };
        break;
      }
      case "valuation": {
        const valuation = await StockItem.aggregate([
          { $match: { status: { $ne: "quarantined" } } },
          {
            $group: {
              _id: { category: "$category", status: "$status" },
              totalQty: { $sum: "$stockQty" },
              totalValue: { $sum: { $multiply: ["$mrp", "$stockQty"] } },
            },
          },
        ]);
        reportData = { type: "valuation", data: valuation };
        break;
      }
      default:
        return sendError(res, `Unknown report type: ${type}. Available: stock-summary, low-stock, expiry, supplier-performance, consumption, valuation`, 400);
    }

    await AuditLog.create({
      userId: req.user.id,
      action: "generate_report",
      entityType: "Report",
      entityId: new mongoose.Types.ObjectId(),
      details: { reportType: type, startDate, endDate, format },
    });

    sendSuccess(res, reportData, `${type} report generated`);
  } catch (error) {
    next(error);
  }
};

// ─── 27. Get Analytics ────────────────────────────────────────────────────────

export const getAnalytics = async (req, res, next) => {
  try {
    const [
      stockByCategory,
      stockByStatus,
      valueByCategory,
      topItems,
      lowStockCount,
      outOfStockCount,
      totalStockValue,
      categoryDistribution,
    ] = await Promise.all([
      StockItem.aggregate([
        { $match: { status: { $ne: "quarantined" } } },
        { $group: { _id: "$category", count: { $sum: 1 }, totalQty: { $sum: "$stockQty" } } },
        { $sort: { count: -1 } },
      ]),
      StockItem.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
      StockItem.aggregate([
        { $match: { status: { $ne: "quarantined" } } },
        { $group: { _id: "$category", totalValue: { $sum: { $multiply: ["$mrp", "$stockQty"] } } } },
        { $sort: { totalValue: -1 } },
      ]),
      StockItem.find({ status: { $ne: "quarantined" } })
        .sort({ stockQty: -1 })
        .limit(10)
        .select("name sku stockQty mrp category")
        .lean(),
      StockItem.countDocuments({ status: "low-stock" }),
      StockItem.countDocuments({ status: "out-of-stock" }),
      StockItem.aggregate([
        { $match: { status: { $nin: ["expired", "quarantined"] } } },
        { $group: { _id: null, total: { $sum: { $multiply: ["$mrp", "$stockQty"] } } } },
      ]),
      StockItem.aggregate([
        { $match: { status: { $ne: "quarantined" } } },
        { $group: { _id: "$category", count: { $sum: 1 }, avgMrp: { $avg: "$mrp" } } },
        { $sort: { count: -1 } },
      ]),
    ]);

    sendSuccess(res, {
      stockByCategory,
      stockByStatus,
      valueByCategory,
      topItems,
      lowStockCount,
      outOfStockCount,
      totalStockValue: totalStockValue[0]?.total || 0,
      categoryDistribution,
    });
  } catch (error) {
    next(error);
  }
};

// ─── 28. List Alerts ──────────────────────────────────────────────────────────

export const listAlerts = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationParams(req.query);
    const { type, acknowledged } = req.query;

    const now = new Date();
    const thirtyDays = new Date(now);
    thirtyDays.setDate(thirtyDays.getDate() + 30);

    const alerts = [];

    if (!type || type === "low-stock") {
      const lowStock = await StockItem.find({ status: "low-stock" }).select("name sku stockQty reorderLevel").lean();
      lowStock.forEach((item) =>
        alerts.push({ type: "low-stock", severity: "warning", message: `${item.name} (SKU: ${item.sku}) stock (${item.stockQty}) below reorder level (${item.reorderLevel})`, stockItemId: item._id, createdAt: item.updatedAt })
      );
    }

    if (!type || type === "out-of-stock") {
      const outOfStock = await StockItem.find({ status: "out-of-stock" }).select("name sku").lean();
      outOfStock.forEach((item) =>
        alerts.push({ type: "out-of-stock", severity: "critical", message: `${item.name} (SKU: ${item.sku}) is out of stock`, stockItemId: item._id, createdAt: item.updatedAt })
      );
    }

    if (!type || type === "near-expiry") {
      const nearExpiry = await StockItem.find({ expiry: { $gt: now, $lte: thirtyDays }, status: { $nin: ["expired", "quarantined"] } }).select("name sku expiry").lean();
      nearExpiry.forEach((item) =>
        alerts.push({ type: "near-expiry", severity: "warning", message: `${item.name} (SKU: ${item.sku}) expires on ${item.expiry.toDateString()}`, stockItemId: item._id, createdAt: item.updatedAt })
      );
    }

    if (!type || type === "expired") {
      const expired = await StockItem.find({ status: "expired" }).select("name sku expiry").lean();
      expired.forEach((item) =>
        alerts.push({ type: "expired", severity: "critical", message: `${item.name} (SKU: ${item.sku}) expired on ${item.expiry.toDateString()}`, stockItemId: item._id, createdAt: item.updatedAt })
      );
    }

    alerts.sort((a, b) => {
      const sev = { critical: 0, warning: 1, info: 2 };
      return (sev[a.severity] ?? 3) - (sev[b.severity] ?? 3);
    });

    const total = alerts.length;
    const paginated = alerts.slice(skip, skip + limit);

    sendPaginated(res, paginated, total, page, limit);
  } catch (error) {
    next(error);
  }
};

// ─── 29. Acknowledge Alert ────────────────────────────────────────────────────

export const acknowledgeAlert = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { stockItemId, type } = req.body;

    if (!stockItemId) return sendError(res, "stockItemId is required", 400);

    const item = await StockItem.findById(stockItemId);
    if (!item) return sendError(res, "Stock item not found", 404);

    await AuditLog.create({
      userId: req.user.id,
      action: "acknowledge_alert",
      entityType: "Alert",
      entityId: new mongoose.Types.ObjectId(),
      details: { alertId: id, stockItemId, type, itemName: item.name, acknowledgedBy: req.user.id },
    });

    sendSuccess(res, { alertId: id, stockItemId, type, acknowledged: true }, "Alert acknowledged");
  } catch (error) {
    next(error);
  }
};

export const getStockItem = async (req, res, next) => {
  try {
    const item = await StockItem.findById(req.params.id).lean();
    if (!item) return sendError(res, "Stock item not found", 404);
    sendSuccess(res, item);
  } catch (error) {
    next(error);
  }
};

export const adjustStock = async (req, res, next) => {
  try {
    const { quantity, type, reason } = req.body;
    const item = await StockItem.findById(req.params.id);
    if (!item) return sendError(res, "Stock item not found", 404);

    const change = type === "in" ? quantity : -quantity;
    item.stockQty += change;

    if (item.stockQty <= 0) {
      item.stockQty = 0;
      item.status = "out-of-stock";
    } else if (item.stockQty <= (item.reorderLevel || 10)) {
      item.status = "low-stock";
    } else {
      item.status = "active";
    }

    item.lastUpdated = new Date();
    await item.save();

    await AuditLog.create({
      userId: req.user.id,
      action: "adjust_stock",
      entityType: "StockItem",
      entityId: item._id,
      details: { name: item.name, sku: item.sku, change, reason },
    });

    sendSuccess(res, item, "Stock level adjusted");
  } catch (error) {
    next(error);
  }
};

export const transferStock = async (req, res, next) => {
  try {
    const { toLocation, quantity, reason } = req.body;
    const item = await StockItem.findById(req.params.id);
    if (!item) return sendError(res, "Stock item not found", 404);

    if (item.stockQty < quantity) {
      return sendError(res, `Insufficient quantity to transfer. Available: ${item.stockQty}`, 400);
    }

    item.stockQty -= quantity;
    if (item.stockQty <= 0) {
      item.stockQty = 0;
      item.status = "out-of-stock";
    } else if (item.stockQty <= (item.reorderLevel || 10)) {
      item.status = "low-stock";
    } else {
      item.status = "active";
    }
    item.lastUpdated = new Date();
    await item.save();

    let destItem = await StockItem.findOne({ sku: item.sku, location: toLocation });
    if (destItem) {
      destItem.stockQty += quantity;
      if (destItem.stockQty > (destItem.reorderLevel || 10)) destItem.status = "active";
      destItem.lastUpdated = new Date();
      await destItem.save();
    } else {
      destItem = await StockItem.create({
        name: item.name,
        category: item.category,
        sku: item.sku,
        manufacturer: item.manufacturer,
        batchNo: item.batchNo,
        expiry: item.expiry,
        mrp: item.mrp,
        stockQty: quantity,
        reorderLevel: item.reorderLevel,
        location: toLocation,
        unit: item.unit,
        supplier: item.supplier,
        status: "active",
      });
    }

    await AuditLog.create({
      userId: req.user.id,
      action: "transfer_stock",
      entityType: "StockItem",
      entityId: item._id,
      details: { name: item.name, sku: item.sku, from: item.location, to: toLocation, quantity, reason },
    });

    sendSuccess(res, { fromItem: item, toItem: destItem }, "Stock transferred successfully");
  } catch (error) {
    next(error);
  }
};
