import { Router } from "express";
import {
  listEncounters,
  createEncounter,
  getEncounter,
  updateEncounter,
} from "../controllers/encounterController.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = Router();

/**
 * @swagger
 * /encounters:
 *   get:
 *     summary: List all encounters
 *     tags: [Encounters]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: patientId
 *         schema:
 *           type: string
 *       - in: query
 *         name: doctorId
 *         schema:
 *           type: string
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [in-progress, completed, cancelled]
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
 *         description: Paginated list of encounters
 */
router.get("/", authenticate, authorize("doctor", "nurse", "admin", "super_admin"), listEncounters);

/**
 * @swagger
 * /encounters:
 *   post:
 *     summary: Create a new encounter
 *     tags: [Encounters]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [patientId, doctorId]
 *             properties:
 *               patientId:
 *                 type: string
 *               doctorId:
 *                 type: string
 *               visitDate:
 *                 type: string
 *                 format: date-time
 *               vitals:
 *                 type: object
 *                 properties:
 *                   heartRate:
 *                     type: number
 *                   bpSystolic:
 *                     type: number
 *                   bpDiastolic:
 *                     type: number
 *                   temperature:
 *                     type: number
 *                   respRate:
 *                     type: number
 *                   spo2:
 *                     type: number
 *                   weight:
 *                     type: number
 *                   height:
 *                     type: number
 *               symptoms:
 *                 type: array
 *                 items:
 *                   type: string
 *               diagnosis:
 *                 type: array
 *                 items:
 *                   type: string
 *               notes:
 *                 type: string
 *               prescriptions:
 *                 type: array
 *               orders:
 *                 type: array
 *     responses:
 *       201:
 *         description: Encounter created
 */
router.post("/", authenticate, authorize("doctor", "nurse", "admin", "super_admin"), createEncounter);

/**
 * @swagger
 * /encounters/{id}:
 *   get:
 *     summary: Get encounter details
 *     tags: [Encounters]
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
 *         description: Encounter details
 *       404:
 *         description: Encounter not found
 */
router.get("/:id", authenticate, authorize("doctor", "nurse", "admin", "super_admin"), getEncounter);

/**
 * @swagger
 * /encounters/{id}:
 *   put:
 *     summary: Update encounter (vitals, diagnosis, prescriptions, notes)
 *     tags: [Encounters]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               vitals:
 *                 type: object
 *               symptoms:
 *                 type: array
 *               diagnosis:
 *                 type: array
 *               notes:
 *                 type: string
 *               prescriptions:
 *                 type: array
 *               orders:
 *                 type: array
 *               status:
 *                 type: string
 *                 enum: [in-progress, completed, cancelled]
 *     responses:
 *       200:
 *         description: Encounter updated
 *       404:
 *         description: Encounter not found
 */
router.put("/:id", authenticate, authorize("doctor", "nurse", "admin", "super_admin"), updateEncounter);

// Frontend compatible REST aliases
router.post("/:id/vitals", authenticate, authorize("doctor", "nurse", "admin", "super_admin"), (req, res, next) => {
  req.body = { vitals: req.body };
  updateEncounter(req, res, next);
});
router.post("/:id/diagnosis", authenticate, authorize("doctor", "nurse", "admin", "super_admin"), (req, res, next) => {
  req.body = { diagnosis: Array.isArray(req.body) ? req.body : [req.body] };
  updateEncounter(req, res, next);
});
router.post("/:id/medications", authenticate, authorize("doctor", "nurse", "admin", "super_admin"), (req, res, next) => {
  req.body = { prescriptions: Array.isArray(req.body) ? req.body : [req.body] };
  updateEncounter(req, res, next);
});

export default router;
