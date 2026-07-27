import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import {
  dashboard,
  listBeds,
  listPatients,
  admitPatient,
  getMonitoring,
  updateVitals,
  listVentilators,
  updateVentilator,
  listInfusionPumps,
  getClinicalScores,
  getMedications,
  orderMedication,
  getRounds,
  documentRound,
  codeBlue,
  transferPatient,
  dischargePatient,
  getEquipment,
  getAnalytics,
} from "../controllers/icuController.js";

const router = Router();

router.use(authenticate);

router.get("/", dashboard);
router.get("/stats", dashboard);
router.get("/beds", listBeds);
router.get("/patients", listPatients);
router.post("/admissions", admitPatient);
router.get("/monitoring/:bedId", getMonitoring);
router.put("/monitoring/:bedId/vitals", updateVitals);
router.get("/ventilators", listVentilators);
router.put("/ventilators/:id/settings", updateVentilator);
router.get("/infusion-pumps", listInfusionPumps);
router.get("/scores/:uhid", getClinicalScores);
router.get("/medications/:uhid", getMedications);
router.post("/medications", orderMedication);
router.get("/rounds/:date", getRounds);
router.post("/rounds", documentRound);
router.post("/code-blue", codeBlue);
router.post("/transfer/:uhid", transferPatient);
router.post("/discharge/:uhid", dischargePatient);
router.get("/equipment", getEquipment);
router.get("/analytics", getAnalytics);

export default router;
