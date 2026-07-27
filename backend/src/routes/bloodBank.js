import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import {
  dashboard,
  listInventory,
  addUnit,
  registerDonor,
  listDonors,
  getDonorScreening,
  collectBlood,
  processComponents,
  runLabTest,
  listRequests,
  createRequest,
  crossmatch,
  reserveUnit,
  issueBlood,
  bedsideVerify,
  listTransfusions,
  reportReaction,
  disposeUnit,
  getColdChain,
  getQuality,
  getDonor,
  getUnit,
  updateRequest,
  listCrossmatches,
  updateCrossmatch,
  createTransfusion,
} from "../controllers/bloodBankController.js";

const router = Router();

router.use(authenticate);

router.get("/", dashboard);

router.get("/inventory", listInventory);
router.post("/inventory", addUnit);

router.post("/donors", registerDonor);
router.get("/donors", listDonors);
router.get("/donors/:id/screening", getDonorScreening);

router.post("/collections", collectBlood);

router.post("/processing", processComponents);

router.post("/lab-tests", runLabTest);

router.get("/requests", listRequests);
router.post("/requests", createRequest);

router.post("/crossmatch", crossmatch);

router.post("/reservations", reserveUnit);

router.post("/issue/:requestId", issueBlood);

router.post("/bedside-verify/:issueId", bedsideVerify);

router.get("/transfusions", listTransfusions);

router.post("/adverse-reaction", reportReaction);

router.post("/disposal", disposeUnit);

router.get("/cold-chain", getColdChain);

router.get("/quality", getQuality);

// Frontend compatible REST aliases
router.get("/stats", dashboard);
router.get("/donors/:id", getDonor);
router.get("/units", listInventory);
router.post("/units", addUnit);
router.get("/units/:id", getUnit);
router.patch("/requests/:id", updateRequest);
router.get("/crossmatches", listCrossmatches);
router.patch("/crossmatches/:id", updateCrossmatch);
router.post("/transfusions", createTransfusion);

export default router;
