import { Router } from "express";
import {
  getCensus,
  getDepartmentKPIs,
  getBedStatus,
  getOTStatus,
  getAlerts,
  getIncidents,
  getStaffOnDuty,
  getCompliance,
} from "../controllers/adminController.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = Router();

/**
 * @swagger
 * /admin/census:
 *   get:
 *     summary: Get hospital census (current patients, admissions, discharges today)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Hospital census data
 */
router.get("/census", authenticate, authorize("super_admin", "admin"), getCensus);

/**
 * @swagger
 * /admin/departments:
 *   get:
 *     summary: Get department KPIs
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Department performance metrics
 */
router.get("/departments", authenticate, authorize("super_admin", "admin"), getDepartmentKPIs);

/**
 * @swagger
 * /admin/beds:
 *   get:
 *     summary: Get bed status across hospital
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Bed status summary by ward
 */
router.get("/beds", authenticate, authorize("super_admin", "admin"), getBedStatus);

/**
 * @swagger
 * /admin/ot-status:
 *   get:
 *     summary: Get OT room status
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OT room status and today's surgeries
 */
router.get("/ot-status", authenticate, authorize("super_admin", "admin"), getOTStatus);

/**
 * @swagger
 * /admin/alerts:
 *   get:
 *     summary: Get active alerts
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Active alerts list
 */
router.get("/alerts", authenticate, authorize("super_admin", "admin"), getAlerts);

/**
 * @swagger
 * /admin/incidents:
 *   get:
 *     summary: Get incident list
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Incident records
 */
router.get("/incidents", authenticate, authorize("super_admin", "admin"), getIncidents);

/**
 * @swagger
 * /admin/staff:
 *   get:
 *     summary: Get staff on duty
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: shift
 *         schema:
 *           type: string
 *           enum: [Morning, Evening, Night]
 *       - in: query
 *         name: department
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Staff on duty list
 */
router.get("/staff", authenticate, authorize("super_admin", "admin"), getStaffOnDuty);

/**
 * @swagger
 * /admin/compliance:
 *   get:
 *     summary: Get compliance records
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Compliance records
 */
router.get("/compliance", authenticate, authorize("super_admin", "admin"), getCompliance);

export default router;
