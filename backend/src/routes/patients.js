import { Router } from "express";
import {
  listPatients,
  registerPatient,
  searchPatients,
  getPatientByUHID,
  updatePatient,
  softDeletePatient,
  getPatientHistory,
} from "../controllers/patientController.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = Router();

/**
 * @swagger
 * /patients:
 *   get:
 *     summary: List all patients
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name, UHID, or phone
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive, deceased]
 *       - in: query
 *         name: blood
 *         schema:
 *           type: string
 *       - in: query
 *         name: gender
 *         schema:
 *           type: string
 *           enum: [Male, Female, Other]
 *     responses:
 *       200:
 *         description: Paginated list of patients
 */
router.get("/", authenticate, authorize("receptionist", "doctor", "nurse", "admin", "super_admin"), listPatients);

/**
 * @swagger
 * /patients/search:
 *   get:
 *     summary: Search patients by name, UHID, phone, or email
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Search results
 */
router.get("/search", authenticate, authorize("receptionist", "doctor", "nurse", "admin", "super_admin"), searchPatients);

/**
 * @swagger
 * /patients/{uhid}:
 *   get:
 *     summary: Get patient by UHID
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: uhid
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Patient details
 *       404:
 *         description: Patient not found
 */
router.get("/:uhid", authenticate, authorize("receptionist", "doctor", "nurse", "admin", "super_admin"), getPatientByUHID);

/**
 * @swagger
 * /patients:
 *   post:
 *     summary: Register a new patient
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, gender]
 *             properties:
 *               name:
 *                 type: string
 *               gender:
 *                 type: string
 *                 enum: [Male, Female, Other]
 *               dob:
 *                 type: string
 *                 format: date
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       201:
 *         description: Patient registered
 */
router.post("/", authenticate, authorize("receptionist", "doctor", "nurse", "admin", "super_admin"), registerPatient);

/**
 * @swagger
 * /patients/{uhid}:
 *   put:
 *     summary: Update a patient
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: uhid
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Patient updated
 *       404:
 *         description: Patient not found
 */
router.put("/:uhid", authenticate, authorize("receptionist", "doctor", "nurse", "admin", "super_admin"), updatePatient);

/**
 * @swagger
 * /patients/{uhid}:
 *   delete:
 *     summary: Soft delete a patient (set status=inactive)
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: uhid
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Patient deactivated
 *       404:
 *         description: Patient not found
 */
router.delete("/:uhid", authenticate, authorize("receptionist", "doctor", "nurse", "admin", "super_admin"), softDeletePatient);

/**
 * @swagger
 * /patients/{uhid}/history:
 *   get:
 *     summary: Get patient visit history
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: uhid
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Patient history with appointments, encounters, and lab orders
 */
router.get("/:uhid/history", authenticate, authorize("receptionist", "doctor", "nurse", "admin", "super_admin"), getPatientHistory);

export default router;
