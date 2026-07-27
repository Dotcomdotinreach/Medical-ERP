import { Router } from "express";
import {
  dashboard,
  listAlerts,
  getAlert,
  acknowledgeAlert,
  overrideAlert,
  getRiskScores,
  calculateRisk,
  listPathways,
  getPathway,
  listDrugInteractions,
} from "../controllers/cdssController.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = Router();

router.use(authenticate);

router.get("/dashboard", authorize("super_admin", "admin", "doctor", "nurse"), dashboard);
router.get("/stats", authorize("super_admin", "admin", "doctor", "nurse"), dashboard);

router.get("/alerts", authorize("super_admin", "admin", "doctor", "nurse"), listAlerts);
router.get("/alerts/:id", authorize("super_admin", "admin", "doctor", "nurse"), getAlert);
router.post("/alerts/:id/ack", authorize("super_admin", "admin", "doctor", "nurse"), acknowledgeAlert);
router.post("/alerts/:id/override", authorize("super_admin", "admin", "doctor"), overrideAlert);

router.get("/risk-scores/:uhid", authorize("super_admin", "admin", "doctor", "nurse"), getRiskScores);
router.post("/risk-scores", authorize("super_admin", "admin", "doctor"), calculateRisk);

router.get("/pathways", authorize("super_admin", "admin", "doctor", "nurse"), listPathways);
router.get("/pathways/:id", authorize("super_admin", "admin", "doctor", "nurse"), getPathway);

router.get("/drug-interactions", authorize("super_admin", "admin", "doctor", "pharmacist"), listDrugInteractions);

export default router;
