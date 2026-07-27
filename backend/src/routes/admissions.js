import { Router } from "express";
import {
  listAdmissions,
  admitPatient,
  getAdmission,
  transferPatient,
  dischargePatient,
  getCurrentInpatients,
} from "../controllers/admissionController.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = Router();

/**
 * @swagger
 * /admissions/current:
 *   get:
 *     summary: Get current inpatients list
 *     tags: [Admissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: dept
 *         schema:
 *           type: string
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
 *         description: Current inpatients
 */
router.get("/current", authenticate, authorize("receptionist", "doctor", "nurse", "admin", "super_admin"), getCurrentInpatients);

/**
 * @swagger
 * /admissions:
 *   get:
 *     summary: List all admissions
 *     tags: [Admissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, active, discharged, transferred]
 *       - in: query
 *         name: dept
 *         schema:
 *           type: string
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
 *         description: Paginated list of admissions
 */
router.get("/", authenticate, authorize("receptionist", "doctor", "nurse", "admin", "super_admin"), listAdmissions);

/**
 * @swagger
 * /admissions:
 *   post:
 *     summary: Admit a patient (auto-assign bed if available)
 *     tags: [Admissions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [patientId, dept]
 *             properties:
 *               patientId:
 *                 type: string
 *               doctorId:
 *                 type: string
 *               dept:
 *                 type: string
 *               diagnosis:
 *                 type: string
 *               bedId:
 *                 type: string
 *               insurance:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Patient admitted
 */
router.post("/", authenticate, authorize("receptionist", "doctor", "nurse", "admin", "super_admin"), admitPatient);

/**
 * @swagger
 * /admissions/{id}:
 *   get:
 *     summary: Get admission details
 *     tags: [Admissions]
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
 *         description: Admission details
 *       404:
 *         description: Admission not found
 */
router.get("/:id", authenticate, authorize("receptionist", "doctor", "nurse", "admin", "super_admin"), getAdmission);

/**
 * @swagger
 * /admissions/{id}/transfer:
 *   put:
 *     summary: Transfer patient to different bed
 *     tags: [Admissions]
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
 *             required: [bedId]
 *             properties:
 *               bedId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Patient transferred
 *       400:
 *         description: Target bed not available
 */
router.put("/:id/transfer", authenticate, authorize("receptionist", "doctor", "nurse", "admin", "super_admin"), transferPatient);

/**
 * @swagger
 * /admissions/{id}/discharge:
 *   put:
 *     summary: Discharge patient (release bed)
 *     tags: [Admissions]
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
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Patient discharged
 */
router.put("/:id/discharge", authenticate, authorize("receptionist", "doctor", "nurse", "admin", "super_admin"), dischargePatient);

export default router;
