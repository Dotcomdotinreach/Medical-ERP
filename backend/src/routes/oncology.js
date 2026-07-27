import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import {
  dashboard,
  listPatients,
  getPatient,
  getStaging,
  getTreatmentPlan,
  createTreatmentPlan,
  listTumorBoards,
  scheduleTumorBoard,
  getChemoProtocols,
  listInfusionSessions,
  startInfusion,
  getToxicity,
  getResponse,
  listScreening,
  getPalliative,
  getAnalytics,
} from "../controllers/oncologyController.js";

const router = Router();

router.use(authenticate);

router.get("/", dashboard);
router.get("/stats", dashboard);
router.get("/patients", listPatients);
router.get("/patients/:id", getPatient);
router.get("/staging/:uhid", getStaging);
router.get("/treatment-plans/:uhid", getTreatmentPlan);
router.post("/treatment-plans", createTreatmentPlan);
router.get("/tumor-boards", listTumorBoards);
router.post("/tumor-boards", scheduleTumorBoard);
router.get("/chemo-protocols", getChemoProtocols);
router.get("/infusion-sessions", listInfusionSessions);
router.post("/infusion-sessions", startInfusion);
router.get("/toxicity/:uhid", getToxicity);
router.get("/response/:uhid", getResponse);
router.get("/screening", listScreening);
router.get("/palliative/:uhid", getPalliative);
router.get("/analytics", getAnalytics);

export default router;
