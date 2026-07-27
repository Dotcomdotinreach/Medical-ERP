import { Router } from "express";
import {
  getDashboard,
  listPrescriptions,
  getPrescription,
  createPrescription,
  verifyPrescription,
  checkDrugInteractionsEndpoint,
  searchMedicines,
  listStock,
  addStock,
  updateStock,
  verifyBarcode,
  dispense,
  emergencyDispense,
  listControlledDrugs,
  issueControlledDrug,
  listReturns,
  processReturn,
  listPurchaseOrders,
  createPurchaseOrder,
  getBillingForPrescription,
  processPayment,
  submitInsuranceClaim,
  listExpiryItems,
  listSuppliers,
  getAnalytics,
} from "../controllers/pharmacyController.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = Router();

router.use(authenticate);

router.get("/dashboard", authorize("super_admin", "admin", "pharmacist"), getDashboard);

router.get("/prescriptions", authorize("super_admin", "admin", "pharmacist", "doctor", "nurse"), listPrescriptions);
router.get("/prescriptions/:rxId", authorize("super_admin", "admin", "pharmacist", "doctor", "nurse"), getPrescription);
router.post("/prescriptions", authorize("super_admin", "admin", "doctor"), createPrescription);
router.put("/prescriptions/:rxId/verify", authorize("super_admin", "admin", "pharmacist"), verifyPrescription);

router.post("/drug-interactions", authorize("super_admin", "admin", "pharmacist", "doctor"), checkDrugInteractionsEndpoint);

router.get("/medicines/search", authorize("super_admin", "admin", "pharmacist", "doctor", "nurse"), searchMedicines);

router.get("/stock", authorize("super_admin", "admin", "pharmacist", "inventory"), listStock);
router.post("/stock", authorize("super_admin", "admin", "pharmacist", "inventory"), addStock);
router.put("/stock/:id", authorize("super_admin", "admin", "pharmacist", "inventory"), updateStock);

router.post("/barcode/verify", authorize("super_admin", "admin", "pharmacist"), verifyBarcode);

router.post("/dispense", authorize("super_admin", "admin", "pharmacist"), dispense);
router.post("/emergency-dispense", authorize("super_admin", "admin", "pharmacist"), emergencyDispense);

router.get("/controlled-drugs", authorize("super_admin", "admin", "pharmacist"), listControlledDrugs);
router.post("/controlled-drugs/issue", authorize("super_admin", "admin", "pharmacist"), issueControlledDrug);

router.get("/returns", authorize("super_admin", "admin", "pharmacist"), listReturns);
router.post("/returns/:id/process", authorize("super_admin", "admin", "pharmacist"), processReturn);

router.get("/po", authorize("super_admin", "admin", "pharmacist", "inventory"), listPurchaseOrders);
router.post("/po", authorize("super_admin", "admin", "pharmacist", "inventory"), createPurchaseOrder);

router.get("/billing/:rxId", authorize("super_admin", "admin", "pharmacist", "billing"), getBillingForPrescription);
router.post("/billing/pay", authorize("super_admin", "admin", "pharmacist", "billing"), processPayment);
router.post("/billing/claim", authorize("super_admin", "admin", "pharmacist", "billing"), submitInsuranceClaim);

router.get("/expiry", authorize("super_admin", "admin", "pharmacist", "inventory"), listExpiryItems);

router.get("/suppliers", authorize("super_admin", "admin", "pharmacist", "inventory"), listSuppliers);

router.get("/analytics", authorize("super_admin", "admin", "pharmacist"), getAnalytics);

// Frontend compatible REST aliases
router.post("/prescriptions/:rxId/dispense", authorize("super_admin", "admin", "pharmacist"), (req, res, next) => {
  req.body.rxId = req.params.rxId;
  req.body.medications = req.body.items;
  dispense(req, res, next);
});
router.get("/stats", authorize("super_admin", "admin", "pharmacist"), getDashboard);

export default router;
