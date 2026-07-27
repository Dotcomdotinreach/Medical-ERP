import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.js";
import {
  dashboard,
  listStockItems,
  addStockItem,
  updateStockItem,
  deleteStockItem,
  getDepartments,
  listRequisitions,
  createRequisition,
  approveRequisition,
  rejectRequisition,
  listPOs,
  createPO,
  receivePO,
  listSuppliers,
  addSupplier,
  listGRN,
  acceptGRN,
  listBatches,
  generateBarcode,
  scanBarcode,
  listTransfers,
  createTransfer,
  listCycleCounts,
  listAudit,
  listAssets,
  getReports,
  getAnalytics,
  listAlerts,
  acknowledgeAlert,
  getStockItem,
  adjustStock,
  transferStock,
} from "../controllers/inventoryController.js";

const router = Router();
router.use(authenticate);

const INV = ["super_admin", "admin", "inventory"];

// Dashboard
router.get("/dashboard", dashboard);

// Stock Items
router.get("/stock-items", listStockItems);
router.post("/stock-items", addStockItem);
router.put("/stock-items/:id", updateStockItem);
router.delete("/stock-items/:id", deleteStockItem);

// Frontend compatible REST aliases
router.get("/", listStockItems);
router.post("/", addStockItem);
router.get("/stats", dashboard);
router.get("/:id", getStockItem);
router.put("/:id", updateStockItem);
router.patch("/:id/adjust", adjustStock);
router.patch("/:id/transfer", transferStock);

// Departments
router.get("/departments", getDepartments);

// Requisitions
router.get("/requisitions", listRequisitions);
router.post("/requisitions", createRequisition);
router.post("/requisitions/:id/approve", approveRequisition);
router.post("/requisitions/:id/reject", rejectRequisition);

// Purchase Orders
router.get("/purchase-orders", listPOs);
router.post("/purchase-orders", createPO);
router.post("/purchase-orders/:id/receive", receivePO);

// Suppliers
router.get("/suppliers", listSuppliers);
router.post("/suppliers", addSupplier);

// GRN
router.get("/grn", listGRN);
router.post("/grn/:id/accept", acceptGRN);

// Batches
router.get("/batches", listBatches);

// Barcode
router.post("/barcode/generate", generateBarcode);
router.post("/barcode/scan", scanBarcode);

// Transfers
router.get("/transfers", listTransfers);
router.post("/transfers", createTransfer);

// Cycle Counts
router.get("/cycle-counts", listCycleCounts);

// Audit
router.get("/audit", listAudit);

// Assets
router.get("/assets", listAssets);

// Reports
router.get("/reports/:type", getReports);

// Analytics
router.get("/analytics", getAnalytics);

// Alerts
router.get("/alerts", listAlerts);
router.put("/alerts/:id/acknowledge", acknowledgeAlert);

export default router;
