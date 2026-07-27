import { Router } from "express";
import {
  getProfile,
  updateProfile,
  getAppointments,
  bookAppointment,
  getConsultations,
  getReports,
  getPrescriptions,
  getBills,
  getNotifications,
  submitClaim,
  getFamilyMembers,
} from "../controllers/portalController.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.use(authenticate);

router.get("/profile/:uhid", getProfile);
router.put("/profile/:uhid", updateProfile);

router.get("/appointments/:uhid", getAppointments);
router.post("/appointments", bookAppointment);

router.get("/consultations/:uhid", getConsultations);

router.get("/reports/:uhid", getReports);

router.get("/prescriptions/:uhid", getPrescriptions);

router.get("/bills/:uhid", getBills);

router.get("/notifications/:uhid", getNotifications);

router.post("/claims", submitClaim);

router.get("/family/:uhid", getFamilyMembers);

export default router;
