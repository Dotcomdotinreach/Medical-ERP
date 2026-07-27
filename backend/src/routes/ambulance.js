import { Router } from "express";
import {
  dashboard,
  listAmbulances,
  getAmbulance,
  listDispatches,
  createDispatch,
  acceptDispatch,
  updateDispatch,
  completeDispatch,
  listDrivers,
  listTrips,
  getDispatch,
} from "../controllers/ambulanceController.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = Router();

router.use(authenticate);

router.get("/dashboard", authorize("super_admin", "admin", "nurse"), dashboard);

router.get("/ambulances", authorize("super_admin", "admin", "nurse"), listAmbulances);
router.get("/ambulances/:id", authorize("super_admin", "admin", "nurse"), getAmbulance);

router.get("/dispatches", authorize("super_admin", "admin", "nurse"), listDispatches);
router.post("/dispatches", authorize("super_admin", "admin", "nurse", "receptionist"), createDispatch);
router.post("/dispatches/:id/accept", authorize("super_admin", "admin", "nurse"), acceptDispatch);
router.put("/dispatches/:id", authorize("super_admin", "admin", "nurse"), updateDispatch);
router.post("/dispatches/:id/complete", authorize("super_admin", "admin", "nurse"), completeDispatch);

router.get("/drivers", authorize("super_admin", "admin", "nurse"), listDrivers);

router.get("/trips", authorize("super_admin", "admin", "nurse"), listTrips);

// Frontend compatible REST aliases
router.get("/stats", authorize("super_admin", "admin", "nurse"), dashboard);
router.get("/dispatches/:id", authorize("super_admin", "admin", "nurse"), getDispatch);
router.patch("/dispatches/:id/status", authorize("super_admin", "admin", "nurse"), updateDispatch);
router.patch("/dispatches/:id", authorize("super_admin", "admin", "nurse"), updateDispatch);

export default router;
