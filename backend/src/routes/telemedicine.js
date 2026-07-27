import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import {
  dashboard,
  listAppointments,
  bookAppointment,
  getWaitingRoom,
  startSession,
  endSession,
  recordIntake,
  getConsent,
  signConsent,
  addNotes,
  sendPrescription,
  orderLab,
  orderRadiology,
  getMessages,
  sendMessage,
  getBilling,
  scheduleFollowUp,
  getAnalytics,
} from "../controllers/telemedicineController.js";

const router = Router();

router.use(authenticate);

router.get("/", dashboard);
router.get("/stats", dashboard);
router.get("/appointments", listAppointments);
router.post("/appointments", bookAppointment);
router.get("/waiting-room", getWaitingRoom);
router.post("/video/:appointmentId/start", startSession);
router.post("/video/:appointmentId/end", endSession);
router.post("/intake/:appointmentId", recordIntake);
router.get("/consent/:appointmentId", getConsent);
router.post("/consent/:appointmentId/sign", signConsent);
router.post("/notes/:appointmentId", addNotes);
router.post("/prescription/:appointmentId", sendPrescription);
router.post("/lab-orders/:appointmentId", orderLab);
router.post("/rad-orders/:appointmentId", orderRadiology);
router.get("/messages", getMessages);
router.post("/messages", sendMessage);
router.get("/billing/:appointmentId", getBilling);
router.post("/follow-up/:appointmentId", scheduleFollowUp);
router.get("/analytics", getAnalytics);

export default router;
