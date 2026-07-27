import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import {
  dashboard,
  listPatients,
  enrollPatient,
  getPatient,
  listMachines,
  listAppointments,
  scheduleAppointment,
  startSession,
  updateSession,
  completeSession,
  getLabResults,
  getVascularAccess,
  getWaterQuality,
  getMaintenance,
  getConsumables,
  getAnalytics,
} from "../controllers/dialysisController.js";

const router = Router();

router.use(authenticate);

router.get("/", dashboard);
router.get("/stats", dashboard);

router.get("/patients", listPatients);
router.post("/patients", enrollPatient);
router.get("/patients/:id", getPatient);

router.get("/machines", listMachines);

router.get("/appointments", listAppointments);
router.post("/appointments", scheduleAppointment);

router.post("/sessions", startSession);
router.put("/sessions/:id", updateSession);
router.post("/sessions/:id/complete", completeSession);

router.get("/lab-results/:patientId", getLabResults);

router.get("/vascular-access/:patientId", getVascularAccess);

router.get("/water-quality", getWaterQuality);

router.get("/maintenance", getMaintenance);

router.get("/consumables", getConsumables);

router.get("/analytics", getAnalytics);

export default router;
