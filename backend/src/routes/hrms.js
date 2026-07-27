import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  dashboard,
  listEmployees,
  addEmployee,
  getEmployee,
  updateEmployee,
  getAttendance,
  checkIn,
  checkOut,
  getPayroll,
  getLeaves,
  applyLeave,
  approveLeave,
  rejectLeave,
  getTraining,
  getPerformance,
  getIncidents,
  submitIncident,
  getCredentials,
  getRecruitment,
  getOnboarding,
} from '../controllers/hrmsController.js';

const router = Router();

router.use(authenticate);

router.get('/dashboard', dashboard);
router.get('/stats', dashboard);

router.get('/employees', listEmployees);
router.post('/employees', addEmployee);
router.get('/employees/:id', getEmployee);
router.put('/employees/:id', updateEmployee);

router.get('/attendance', getAttendance);
router.post('/attendance/check-in', checkIn);
router.post('/attendance/check-out', checkOut);

router.get('/payroll', getPayroll);

router.get('/leaves', getLeaves);
router.post('/leaves', applyLeave);
router.post('/leaves/:id/approve', approveLeave);
router.post('/leaves/:id/reject', rejectLeave);

router.get('/training', getTraining);
router.get('/performance/:employeeId', getPerformance);

router.get('/incidents', getIncidents);
router.post('/incidents', submitIncident);

router.get('/credentials/:employeeId', getCredentials);
router.get('/recruitment', getRecruitment);
router.get('/onboarding/:employeeId', getOnboarding);

export default router;
