import { Router } from "express";
import {
  dashboard,
  listModels,
  getModel,
  listPredictions,
  getPrediction,
  overridePrediction,
  getPopulationHealth,
  getForecasting,
  getExecutive,
  getExplainability,
  getMonitoring,
  getDrift,
  getBias,
  getAlerts,
  acknowledgeAlert,
} from "../controllers/aiController.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = Router();

router.use(authenticate);

router.get("/dashboard", authorize("super_admin", "admin", "doctor"), dashboard);

router.get("/models", authorize("super_admin", "admin", "doctor"), listModels);
router.get("/models/:id", authorize("super_admin", "admin", "doctor"), getModel);

router.get("/predictions", authorize("super_admin", "admin", "doctor"), listPredictions);
router.get("/predictions/:id", authorize("super_admin", "admin", "doctor"), getPrediction);
router.post("/predictions/:id/override", authorize("super_admin", "admin", "doctor"), overridePrediction);

router.get("/population-health", authorize("super_admin", "admin", "doctor"), getPopulationHealth);
router.get("/forecasting", authorize("super_admin", "admin", "doctor"), getForecasting);
router.get("/executive", authorize("super_admin", "admin"), getExecutive);

router.get("/xai/:predictionId", authorize("super_admin", "admin", "doctor"), getExplainability);

router.get("/monitoring/:modelId", authorize("super_admin", "admin", "doctor"), getMonitoring);
router.get("/monitoring/drift/:modelId", authorize("super_admin", "admin", "doctor"), getDrift);
router.get("/bias/:modelId", authorize("super_admin", "admin", "doctor"), getBias);

router.get("/alerts", authorize("super_admin", "admin", "doctor"), getAlerts);
router.put("/alerts/:id/acknowledge", authorize("super_admin", "admin", "doctor"), acknowledgeAlert);

export default router;
