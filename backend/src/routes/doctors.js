import { Router } from "express";
import {
  listDoctors,
  getDoctorProfile,
  updateDoctor,
  getDoctorSchedule,
  getDoctorPatients,
} from "../controllers/doctorController.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = Router();

/**
 * @swagger
 * /doctors:
 *   get:
 *     summary: List all doctors
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: dept
 *         schema:
 *           type: string
 *         description: Filter by department
 *       - in: query
 *         name: available
 *         schema:
 *           type: boolean
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
 *         description: Paginated list of doctors
 */
router.get("/", authenticate, authorize("doctor", "admin", "super_admin"), listDoctors);

/**
 * @swagger
 * /doctors/{id}/schedule:
 *   get:
 *     summary: Get doctor weekly schedule
 *     tags: [Doctors]
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
 *         description: Doctor schedule
 */
router.get("/:id/schedule", authenticate, authorize("doctor", "admin", "super_admin"), getDoctorSchedule);

/**
 * @swagger
 * /doctors/{id}/patients:
 *   get:
 *     summary: Get doctor's today's patients
 *     tags: [Doctors]
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
 *         description: Today's patient list
 */
router.get("/:id/patients", authenticate, authorize("doctor", "admin", "super_admin"), getDoctorPatients);

/**
 * @swagger
 * /doctors/{id}:
 *   get:
 *     summary: Get doctor profile
 *     tags: [Doctors]
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
 *         description: Doctor profile
 *       404:
 *         description: Doctor not found
 */
router.get("/:id", authenticate, authorize("doctor", "admin", "super_admin"), getDoctorProfile);

/**
 * @swagger
 * /doctors/{id}:
 *   put:
 *     summary: Update doctor details
 *     tags: [Doctors]
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
 *               dept:
 *                 type: string
 *               qualification:
 *                 type: string
 *               fee:
 *                 type: number
 *               room:
 *                 type: string
 *               available:
 *                 type: boolean
 *               schedule:
 *                 type: array
 *     responses:
 *       200:
 *         description: Doctor updated
 */
router.put("/:id", authenticate, authorize("doctor", "admin", "super_admin"), updateDoctor);

export default router;
