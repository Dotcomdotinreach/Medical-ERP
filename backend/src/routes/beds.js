import { Router } from "express";
import {
  listBeds,
  getBedStatus,
  assignBed,
  releaseBed,
  markForCleaning,
  inspectBed,
  getBed,
} from "../controllers/bedController.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = Router();

/**
 * @swagger
 * /beds/status:
 *   get:
 *     summary: Get bed status summary (available, occupied by ward)
 *     tags: [Beds]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: ward
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Bed status summary
 */
router.get("/status", authenticate, authorize("receptionist", "nurse", "admin", "super_admin"), getBedStatus);

/**
 * @swagger
 * /beds:
 *   get:
 *     summary: List all beds
 *     tags: [Beds]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: ward
 *         schema:
 *           type: string
 *       - in: query
 *         name: state
 *         schema:
 *           type: string
 *           enum: [available, occupied, reserved, cleaning, maintenance]
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [ICU, General, Semi-Private, Private, Deluxe]
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
 *         description: Paginated list of beds
 */
router.get("/", authenticate, authorize("receptionist", "nurse", "admin", "super_admin"), listBeds);

/**
 * @swagger
 * /beds/{id}/assign:
 *   put:
 *     summary: Assign bed to a patient
 *     tags: [Beds]
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
 *             required: [patientId]
 *             properties:
 *               patientId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Bed assigned
 *       400:
 *         description: Bed not available
 */
router.put("/:id/assign", authenticate, authorize("receptionist", "nurse", "admin", "super_admin"), assignBed);

/**
 * @swagger
 * /beds/{id}/release:
 *   put:
 *     summary: Release bed (occupied → cleaning)
 *     tags: [Beds]
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
 *         description: Bed released
 */
router.put("/:id/release", authenticate, authorize("receptionist", "nurse", "admin", "super_admin"), releaseBed);

/**
 * @swagger
 * /beds/{id}/cleaning:
 *   put:
 *     summary: Mark bed for cleaning
 *     tags: [Beds]
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
 *         description: Bed marked for cleaning
 */
router.put("/:id/cleaning", authenticate, authorize("receptionist", "nurse", "admin", "super_admin"), markForCleaning);

/**
 * @swagger
 * /beds/{id}/inspect:
 *   put:
 *     summary: Inspect bed and make available (cleaning → available)
 *     tags: [Beds]
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
 *         description: Bed inspected and available
 */
router.put("/:id/inspect", authenticate, authorize("receptionist", "nurse", "admin", "super_admin"), inspectBed);

// Frontend compatible REST aliases
router.get("/stats", authenticate, authorize("receptionist", "nurse", "admin", "super_admin"), getBedStatus);
router.get("/:id", authenticate, authorize("receptionist", "nurse", "admin", "super_admin"), getBed);
router.patch("/:id/assign", authenticate, authorize("receptionist", "nurse", "admin", "super_admin"), assignBed);
router.patch("/:id/discharge", authenticate, authorize("receptionist", "nurse", "admin", "super_admin"), releaseBed);
router.patch("/:id/cleaning", authenticate, authorize("receptionist", "nurse", "admin", "super_admin"), markForCleaning);
router.patch("/:id/inspect", authenticate, authorize("receptionist", "nurse", "admin", "super_admin"), inspectBed);

export default router;
