import { Router } from "express";
import {
  listAppointments,
  bookAppointment,
  getAvailableSlots,
  updateAppointment,
  getTodayAppointments,
  getAppointment,
} from "../controllers/appointmentController.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = Router();

/**
 * @swagger
 * /appointments/today:
 *   get:
 *     summary: Get today's appointments
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: doctorId
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Today's appointments
 */
router.get("/today", authenticate, authorize("receptionist", "doctor", "nurse", "admin", "super_admin"), getTodayAppointments);

/**
 * @swagger
 * /appointments/slots:
 *   get:
 *     summary: Get available slots for a doctor on a date
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: doctorId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Available time slots
 */
router.get("/slots", authenticate, authorize("receptionist", "doctor", "nurse", "admin", "super_admin"), getAvailableSlots);

/**
 * @swagger
 * /appointments:
 *   get:
 *     summary: List all appointments
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: doctorId
 *         schema:
 *           type: string
 *       - in: query
 *         name: patientId
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [scheduled, confirmed, checked-in, in-progress, completed, cancelled, no-show]
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
 *         description: Paginated list of appointments
 */
router.get("/", authenticate, authorize("receptionist", "doctor", "nurse", "admin", "super_admin"), listAppointments);

/**
 * @swagger
 * /appointments:
 *   post:
 *     summary: Book a new appointment
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [patientId, doctorId, date, time]
 *             properties:
 *               patientId:
 *                 type: string
 *               doctorId:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               time:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [In-Person, Video, Phone, Chat]
 *               reason:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Appointment booked
 *       409:
 *         description: Slot already booked
 */
router.post("/", authenticate, authorize("receptionist", "doctor", "nurse", "admin", "super_admin"), bookAppointment);

/**
 * @swagger
 * /appointments/{id}:
 *   put:
 *     summary: Update or reschedule an appointment
 *     tags: [Appointments]
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
 *               date:
 *                 type: string
 *                 format: date
 *               time:
 *                 type: string
 *               status:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Appointment updated
 *       409:
 *         description: Slot conflict
 */
router.put("/:id", authenticate, authorize("receptionist", "doctor", "nurse", "admin", "super_admin"), updateAppointment);
router.get("/:id", authenticate, authorize("receptionist", "doctor", "nurse", "admin", "super_admin"), getAppointment);
router.patch("/:id/cancel", authenticate, authorize("receptionist", "doctor", "nurse", "admin", "super_admin"), (req, res, next) => { req.body.status = "cancelled"; updateAppointment(req, res, next); });
router.patch("/:id/check-in", authenticate, authorize("receptionist", "doctor", "nurse", "admin", "super_admin"), (req, res, next) => { req.body.status = "checked-in"; updateAppointment(req, res, next); });

export default router;
