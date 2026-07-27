import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import {
  dashboard,
  listPatients,
  getANC,
  recordANC,
  getLabor,
  recordDelivery,
  getNeonatal,
  recordPostpartum,
} from "../controllers/maternityController.js";

const router = Router();

router.use(authenticate);

router.get("/", dashboard);
router.get("/stats", dashboard);
router.get("/patients", listPatients);
router.get("/anc/:uhid", getANC);
router.post("/anc", recordANC);
router.get("/labor/:uhid", getLabor);
router.post("/delivery", recordDelivery);
router.get("/neonatal/:uhid", getNeonatal);
router.post("/postpartum", recordPostpartum);

export default router;
