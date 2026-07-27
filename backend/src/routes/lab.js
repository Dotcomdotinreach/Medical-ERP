import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.js";
import {
  listOrders,
  createOrder,
  dashboard,
  getOrder,
  updateOrder,
  getSamplesForCollection,
  collectSample,
  getSampleTracking,
  receiveSample,
  acceptSample,
  rejectSample,
  getAnalyzerQueue,
  getQCRecords,
  runQC,
  enterResults,
  saveDraft,
  getCriticalResults,
  acknowledgeCritical,
  notifyDoctor,
  getResultsForVerification,
  verifyResults,
  getReport,
  deliverReport,
} from "../controllers/labController.js";

const router = Router();
router.use(authenticate);

router.get("/dashboard", dashboard);
router.get("/samples/collect", getSamplesForCollection);
router.get("/samples/:specimenId/tracking", getSampleTracking);
router.post("/samples/collect", collectSample);
router.post("/samples/receive", receiveSample);
router.post("/samples/:id/accept", acceptSample);
router.post("/samples/:id/reject", rejectSample);
router.get("/analyzers/queue", getAnalyzerQueue);
router.get("/qc", getQCRecords);
router.post("/qc/run", runQC);
router.get("/results/critical", getCriticalResults);
router.get("/results/verify", getResultsForVerification);
router.post("/results/entry", enterResults);
router.put("/results/:id/draft", saveDraft);
router.post("/results/:id/ack", acknowledgeCritical);
router.post("/results/:id/notify", notifyDoctor);
router.post("/results/:id/verify", verifyResults);
router.get("/reports/:id", getReport);
router.post("/reports/:id/deliver", deliverReport);
router.get("/orders/:id", getOrder);
router.put("/orders/:id", updateOrder);
router.post("/", createOrder);
router.get("/", listOrders);

// Frontend compatible REST aliases
router.get("/orders", listOrders);
router.post("/orders", createOrder);
router.patch("/orders/:id/status", updateOrder);
router.get("/stats", dashboard);

export default router;
