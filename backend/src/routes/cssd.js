import { Router } from "express";
import {
  dashboard,
  listInstruments,
  listTrays,
  getTray,
  listCycles,
  startCycle,
  completeCycle,
  issueTray,
  returnTray,
  listAutoclaves,
} from "../controllers/cssdController.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = Router();

router.use(authenticate);

router.get("/dashboard", authorize("super_admin", "admin", "nurse"), dashboard);
router.get("/stats", authorize("super_admin", "admin", "nurse"), dashboard);

router.get("/instruments", authorize("super_admin", "admin", "nurse"), listInstruments);

router.get("/trays", authorize("super_admin", "admin", "nurse"), listTrays);
router.get("/trays/:id", authorize("super_admin", "admin", "nurse"), getTray);

router.get("/cycles", authorize("super_admin", "admin", "nurse"), listCycles);
router.post("/cycles", authorize("super_admin", "admin", "nurse"), startCycle);
router.post("/cycles/:id/complete", authorize("super_admin", "admin", "nurse"), completeCycle);

router.post("/issue", authorize("super_admin", "admin", "nurse"), issueTray);
router.post("/return/:trayId", authorize("super_admin", "admin", "nurse"), returnTray);

router.get("/autoclaves", authorize("super_admin", "admin", "nurse"), listAutoclaves);

export default router;
