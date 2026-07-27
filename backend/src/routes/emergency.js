import { Router } from "express";
import {
  getDashboard,
  listCases,
  emergencyCheckin,
  updateTriage,
  dischargeFromED,
  admitFromED,
  getCase,
} from "../controllers/emergencyController.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = Router();

/**
 * @swagger
 * /emergency/dashboard:
 *   get:
 *     summary: Get ED dashboard (triage counts, waiting, in-treatment)
 *     tags: [Emergency]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: ED dashboard data
 */
router.get("/dashboard", authenticate, authorize("receptionist", "doctor", "nurse", "admin", "super_admin"), getDashboard);

/**
 * @swagger
 * /emergency/cases:
 *   get:
 *     summary: List ED cases
 *     tags: [Emergency]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Waiting, Called, In Consultation, Completed, Skipped]
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [Normal, High, Urgent]
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Paginated list of ED cases
 */
router.get("/cases", authenticate, authorize("receptionist", "doctor", "nurse", "admin", "super_admin"), listCases);

/**
 * @swagger
 * /emergency/checkin:
 *   post:
 *     summary: Emergency check-in (create patient + queue entry)
 *     tags: [Emergency]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               gender:
 *                 type: string
 *               age:
 *                 type: number
 *               priority:
 *                 type: string
 *                 enum: [Normal, High, Urgent]
 *               symptoms:
 *                 type: string
 *     responses:
 *       201:
 *         description: Emergency check-in complete
 */
router.post("/checkin", authenticate, authorize("receptionist", "doctor", "nurse", "admin", "super_admin"), emergencyCheckin);

/**
 * @swagger
 * /emergency/{id}/triage:
 *   put:
 *     summary: Update triage level
 *     tags: [Emergency]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [priority]
 *             properties:
 *               priority:
 *                 type: string
 *                 enum: [Normal, High, Urgent]
 *     responses:
 *       200:
 *         description: Triage updated
 */
router.put("/:id/triage", authenticate, authorize("receptionist", "doctor", "nurse", "admin", "super_admin"), updateTriage);

/**
 * @swagger
 * /emergency/{id}/discharge:
 *   put:
 *     summary: Discharge from ED
 *     tags: [Emergency]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Patient discharged from ED
 */
router.put("/:id/discharge", authenticate, authorize("receptionist", "doctor", "nurse", "admin", "super_admin"), dischargeFromED);

/**
 * @swagger
 * /emergency/{id}/admit:
 *   put:
 *     summary: Admit from ED to IPD
 *     tags: [Emergency]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [dept]
 *             properties:
 *               dept:
 *                 type: string
 *               diagnosis:
 *                 type: string
 *               doctorId:
 *                 type: string
 *               bedId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Patient admitted to IPD
 */
router.put("/:id/admit", authenticate, authorize("receptionist", "doctor", "nurse", "admin", "super_admin"), admitFromED);

// Frontend compatible REST aliases
router.get("/stats", authenticate, authorize("receptionist", "doctor", "nurse", "admin", "super_admin"), getDashboard);
router.get("/", authenticate, authorize("receptionist", "doctor", "nurse", "admin", "super_admin"), listCases);
router.post("/", authenticate, authorize("receptionist", "doctor", "nurse", "admin", "super_admin"), emergencyCheckin);
router.patch("/:id/triage", authenticate, authorize("receptionist", "doctor", "nurse", "admin", "super_admin"), updateTriage);
router.patch("/:id/discharge", authenticate, authorize("receptionist", "doctor", "nurse", "admin", "super_admin"), dischargeFromED);
router.patch("/:id/admit", authenticate, authorize("receptionist", "doctor", "nurse", "admin", "super_admin"), admitFromED);
router.get("/:id", authenticate, authorize("receptionist", "doctor", "nurse", "admin", "super_admin"), getCase);

export default router;
