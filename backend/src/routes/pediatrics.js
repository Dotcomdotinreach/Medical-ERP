import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import {
  dashboard,
  listPatients,
  getGrowth,
  getVaccinations,
  recordVaccination,
  getMilestones,
  getFeeding,
} from "../controllers/pediatricsController.js";

const router = Router();

router.use(authenticate);

router.get("/", dashboard);
router.get("/stats", dashboard);
router.get("/patients", listPatients);
router.get("/growth/:uhid", getGrowth);
router.get("/vaccinations/:uhid", getVaccinations);
router.post("/vaccinations", recordVaccination);
router.get("/milestones/:uhid", getMilestones);
router.get("/feeding/:uhid", getFeeding);

export default router;
