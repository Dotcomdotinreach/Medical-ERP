import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.js";
import {
  dashboard,
  listOrders,
  createOrder,
  scheduleStudy,
  checkinPatient,
  getWorklist,
  startAcquisition,
  uploadToPACS,
  getAIFindings,
  acceptAIFinding,
  rejectAIFinding,
  saveDraftReport,
  getCriticalFindings,
  acknowledgeCritical,
  signReport,
  getFinalReport,
  deliverReport,
  getEquipment,
  getAnalytics,
  getOrder,
  updateOrder,
} from "../controllers/radiologyController.js";

const router = Router();
router.use(authenticate);

router.get("/dashboard", dashboard);
router.get("/worklist", getWorklist);
router.get("/critical", getCriticalFindings);
router.get("/equipment", getEquipment);
router.get("/analytics", getAnalytics);
router.get("/ai-findings/:studyId", getAIFindings);
router.get("/reports/:orderId/final", getFinalReport);
router.post("/", createOrder);
router.post("/orders/:id/schedule", scheduleStudy);
router.post("/checkin/:orderId", checkinPatient);
router.post("/acquisition/:orderId/start", startAcquisition);
router.post("/pacs/upload/:orderId", uploadToPACS);
router.post("/ai-findings/:id/accept", acceptAIFinding);
router.post("/ai-findings/:id/reject", rejectAIFinding);
router.post("/reports/:orderId/draft", saveDraftReport);
router.post("/critical/:id/acknowledge", acknowledgeCritical);
router.post("/sign/:orderId", signReport);
router.post("/reports/:orderId/deliver", deliverReport);
router.get("/", listOrders);

// Frontend compatible REST aliases
router.get("/orders", listOrders);
router.post("/orders", createOrder);
router.get("/orders/:id", getOrder);
router.patch("/orders/:id/status", updateOrder);
router.get("/stats", dashboard);

export default router;
