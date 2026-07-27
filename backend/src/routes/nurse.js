import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.js";
import {
  dashboard,
  listPatients,
  patientSummary,
  getOrders,
  acknowledgeOrder,
  getMAR,
  administerMedication,
  recordVitals,
  getInfusions,
  documentPumpCheck,
  recordAssessment,
  addNote,
  getCarePlan,
  listTasks,
  completeTask,
  requestTransfer,
  shiftHandover,
  submitIncident,
  createTask,
  updateTask,
  cancelTask,
  getTask,
  recordVitalsForPatient,
  getVitalsForPatient
} from "../controllers/nurseController.js";

const router = Router();
router.use(authenticate);
router.use(authorize("nurse", "doctor", "admin", "super_admin"));

router.get("/dashboard", dashboard);
router.get("/patients", listPatients);
router.get("/patients/:uhid/summary", patientSummary);
router.get("/orders/:uhid", getOrders);
router.post("/orders/:orderId/acknowledge", acknowledgeOrder);
router.get("/mar/:uhid", getMAR);
router.post("/mar/administer", administerMedication);
router.post("/vitals", recordVitals);
router.get("/infusions/:uhid", getInfusions);
router.post("/infusions/:id/check", documentPumpCheck);
router.post("/assessment", recordAssessment);
router.post("/notes", addNote);
router.get("/care-plan/:uhid", getCarePlan);
router.get("/tasks", listTasks);
router.put("/tasks/:id/complete", completeTask);
router.post("/transfers", requestTransfer);
router.post("/handover", shiftHandover);
router.post("/incidents", submitIncident);

// Frontend compatible REST aliases
router.get("/stats", dashboard);
router.post("/tasks", createTask);
router.get("/tasks/:id", getTask);
router.put("/tasks/:id", updateTask);
router.patch("/tasks/:id/complete", completeTask);
router.patch("/tasks/:id/cancel", cancelTask);
router.post("/patients/:patientId/vitals", recordVitalsForPatient);
router.get("/patients/:patientId/vitals", getVitalsForPatient);

export default router;
