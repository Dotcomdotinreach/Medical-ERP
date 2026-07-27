import { Router } from "express";
import {
  getDashboard,
  listInvoices,
  createInvoice,
  getInvoice,
  payInvoice,
  listPayments,
  recordPayment,
  listRefunds,
  createRefund,
  approveRefund,
  getPatientFinancialSummary,
  getPatientInsurance,
  submitInsuranceClaim,
  listInsuranceClaims,
  updateInsuranceClaim,
  createCostEstimate,
  listAdvances,
  collectAdvance,
  listCorporate,
  listTPA,
  getDischargeClearance,
  grantDischargeClearance,
  listChargeCaptures,
  reviewCharge,
  getAuditLogs,
  getAnalytics,
  updateInvoice,
} from "../controllers/billingController.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = Router();

router.use(authenticate);

router.get("/dashboard", authorize("super_admin", "admin", "billing"), getDashboard);

router.get("/invoices", authorize("super_admin", "admin", "billing", "receptionist"), listInvoices);
router.post("/invoices", authorize("super_admin", "admin", "billing"), createInvoice);
router.get("/invoices/:id", authorize("super_admin", "admin", "billing", "receptionist"), getInvoice);
router.post("/invoices/:id/pay", authorize("super_admin", "admin", "billing"), payInvoice);

router.get("/payments", authorize("super_admin", "admin", "billing"), listPayments);
router.post("/payments", authorize("super_admin", "admin", "billing"), recordPayment);

router.get("/refunds", authorize("super_admin", "admin", "billing"), listRefunds);
router.post("/refunds", authorize("super_admin", "admin", "billing"), createRefund);
router.post("/refunds/:id/approve", authorize("super_admin", "admin"), approveRefund);

router.get("/patients/:uhid/financial-summary", authorize("super_admin", "admin", "billing", "doctor"), getPatientFinancialSummary);

router.get("/insurance/:uhid", authorize("super_admin", "admin", "billing"), getPatientInsurance);
router.post("/insurance/claims", authorize("super_admin", "admin", "billing"), submitInsuranceClaim);
router.get("/insurance/claims", authorize("super_admin", "admin", "billing"), listInsuranceClaims);
router.put("/insurance/claims/:id", authorize("super_admin", "admin", "billing"), updateInsuranceClaim);

router.post("/cost-estimate", authorize("super_admin", "admin", "billing", "doctor"), createCostEstimate);

router.get("/advances", authorize("super_admin", "admin", "billing"), listAdvances);
router.post("/advances", authorize("super_admin", "admin", "billing"), collectAdvance);

router.get("/corporate", authorize("super_admin", "admin", "billing"), listCorporate);

router.get("/tpa", authorize("super_admin", "admin", "billing"), listTPA);

router.get("/discharge-clearance/:uhid", authorize("super_admin", "admin", "billing", "doctor", "nurse"), getDischargeClearance);
router.post("/discharge-clearance/:uhid/grant", authorize("super_admin", "admin"), grantDischargeClearance);

router.get("/charge-captures", authorize("super_admin", "admin", "billing"), listChargeCaptures);
router.post("/charge-captures/:id/review", authorize("super_admin", "admin"), reviewCharge);

router.get("/audit-logs", authorize("super_admin", "admin"), getAuditLogs);

router.get("/analytics", authorize("super_admin", "admin", "billing"), getAnalytics);

// Frontend compatible REST aliases
router.put("/invoices/:id", authorize("super_admin", "admin", "billing"), updateInvoice);
router.post("/invoices/:id/payments", authorize("super_admin", "admin", "billing"), payInvoice);
router.get("/stats", authorize("super_admin", "admin", "billing"), getDashboard);

export default router;
