import { Router } from "express";
import {
  dashboard,
  listStudies,
  createStudy,
  getStudy,
  listSubjects,
  enrollSubject,
  getConsent,
  listAdverseEvents,
  reportAE,
  getAnalytics,
} from "../controllers/researchController.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = Router();

router.use(authenticate);

router.get("/dashboard", authorize("super_admin", "admin", "doctor"), dashboard);

router.get("/studies", authorize("super_admin", "admin", "doctor"), listStudies);
router.post("/studies", authorize("super_admin", "admin", "doctor"), createStudy);
router.get("/studies/:id", authorize("super_admin", "admin", "doctor"), getStudy);
router.get("/studies/:id/subjects", authorize("super_admin", "admin", "doctor"), listSubjects);
router.post("/studies/:id/enroll", authorize("super_admin", "admin", "doctor"), enrollSubject);

router.get("/subjects/:id/consent", authorize("super_admin", "admin", "doctor"), getConsent);

router.get("/adverse-events", authorize("super_admin", "admin", "doctor"), listAdverseEvents);
router.post("/adverse-events", authorize("super_admin", "admin", "doctor"), reportAE);

router.get("/analytics", authorize("super_admin", "admin", "doctor"), getAnalytics);

export default router;
