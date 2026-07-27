import { Router } from "express";
import {
  dashboard,
  listInterfaces,
  getInterface,
  listMessages,
  getFHIRMappings,
  getTerminology,
  matchPatient,
  listCertificates,
  getAuditTrail,
  getDRStatus,
} from "../controllers/interopController.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = Router();

router.use(authenticate);

router.get("/dashboard", authorize("super_admin", "admin", "it"), dashboard);

router.get("/interfaces", authorize("super_admin", "admin", "it"), listInterfaces);
router.get("/interfaces/:id", authorize("super_admin", "admin", "it"), getInterface);

router.get("/messages", authorize("super_admin", "admin", "it"), listMessages);

router.get("/fhir-mappings", authorize("super_admin", "admin", "it"), getFHIRMappings);
router.get("/terminology", authorize("super_admin", "admin", "it"), getTerminology);

router.post("/match", authorize("super_admin", "admin", "it", "receptionist"), matchPatient);

router.get("/certificates", authorize("super_admin", "admin", "it"), listCertificates);

router.get("/audit", authorize("super_admin", "admin", "it"), getAuditTrail);

router.get("/dr-status", authorize("super_admin", "admin", "it"), getDRStatus);

export default router;
