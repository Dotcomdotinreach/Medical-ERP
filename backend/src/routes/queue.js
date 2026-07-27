import { Router } from "express";
import {
  getQueue,
  addToQueue,
  callPatient,
  startConsultation,
  completeConsultation,
  skipPatient,
  getQueueStats,
  updateQueueStatus,
  getQueueEntry,
} from "../controllers/queueController.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = Router();

/**
 * @swagger
 * /queue/stats:
 *   get:
 *     summary: Get queue statistics
 *     tags: [Queue]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: dept
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Queue stats by state
 */
router.get("/stats", authenticate, authorize("receptionist", "admin", "super_admin"), getQueueStats);

/**
 * @swagger
 * /queue/add:
 *   post:
 *     summary: Add a token to the queue
 *     tags: [Queue]
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
 *               priority:
 *                 type: string
 *                 enum: [Normal, High, Urgent]
 *     responses:
 *       201:
 *         description: Token added to queue
 */
router.post("/add", authenticate, authorize("receptionist", "admin", "super_admin"), addToQueue);

/**
 * @swagger
 * /queue:
 *   get:
 *     summary: Get current queue
 *     tags: [Queue]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: dept
 *         schema:
 *           type: string
 *       - in: query
 *         name: state
 *         schema:
 *           type: string
 *           enum: [Waiting, Called, In Consultation, Completed, Skipped]
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
 *         description: Paginated queue entries
 */
router.get("/", authenticate, authorize("receptionist", "admin", "super_admin"), getQueue);

/**
 * @swagger
 * /queue/{id}/call:
 *   put:
 *     summary: Call patient (Waiting → Called)
 *     tags: [Queue]
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
 *         description: Patient called
 *       400:
 *         description: Invalid state transition
 */
router.put("/:id/call", authenticate, authorize("receptionist", "admin", "super_admin"), callPatient);

/**
 * @swagger
 * /queue/{id}/consult:
 *   put:
 *     summary: Start consultation (Called → In Consultation)
 *     tags: [Queue]
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
 *         description: Consultation started
 */
router.put("/:id/consult", authenticate, authorize("receptionist", "admin", "super_admin"), startConsultation);

/**
 * @swagger
 * /queue/{id}/complete:
 *   put:
 *     summary: Complete consultation (In Consultation → Completed)
 *     tags: [Queue]
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
 *         description: Consultation completed
 */
router.put("/:id/complete", authenticate, authorize("receptionist", "admin", "super_admin"), completeConsultation);

/**
 * @swagger
 * /queue/{id}/skip:
 *   put:
 *     summary: Skip patient (Waiting → Skipped)
 *     tags: [Queue]
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
 *         description: Patient skipped
 */
router.put("/:id/skip", authenticate, authorize("receptionist", "admin", "super_admin"), skipPatient);

// Frontend compatible REST aliases
router.post("/", authenticate, authorize("receptionist", "admin", "super_admin"), addToQueue);
router.get("/:id", authenticate, authorize("receptionist", "admin", "super_admin"), getQueueEntry);
router.patch("/:id/status", authenticate, authorize("receptionist", "admin", "super_admin"), updateQueueStatus);
router.put("/:id/status", authenticate, authorize("receptionist", "admin", "super_admin"), updateQueueStatus);

export default router;
