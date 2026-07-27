import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import {
  getDashboard,
  getSurgeries,
  getCalendar,
  scheduleSurgery,
  getSurgery,
  updateSurgeryStatus,
  getPreOpAssessments,
  completePreOpAssessment,
  getConsents,
  signConsent,
  getRooms,
  updateRoomStatus,
  getTeams,
  assignTeam,
  getEquipment,
  getWHOChecklist,
  completeWHOChecklist,
  getAnesthesia,
  recordAnesthesia,
  recordIntraOp,
  completeSurgery,
  getPACUPatients,
  dischargeFromPACU,
  transferToWard,
  getTurnovers,
  completeTurnover,
  getAnalytics,
} from '../controllers/otController.js';

const router = Router();

router.use(authenticate);

router.get('/dashboard', getDashboard);
router.get('/stats', getDashboard);
router.get('/surgeries', getSurgeries);
router.get('/calendar', getCalendar);
router.post('/', scheduleSurgery);
router.get('/pre-op', getPreOpAssessments);
router.get('/consents', getConsents);
router.get('/rooms', getRooms);
router.get('/teams', getTeams);
router.get('/equipment', getEquipment);
router.get('/pacu', getPACUPatients);
router.get('/turnover', getTurnovers);
router.get('/analytics', getAnalytics);

router.post('/pre-op/:surgeryId', completePreOpAssessment);
router.post('/consents/:id/sign', signConsent);
router.put('/rooms/:id', updateRoomStatus);
router.post('/teams/:surgeryId', assignTeam);
router.get('/who-checklist/:surgeryId', getWHOChecklist);
router.post('/who-checklist/:surgeryId/complete', completeWHOChecklist);
router.get('/anesthesia/:surgeryId', getAnesthesia);
router.post('/anesthesia/:surgeryId', recordAnesthesia);
router.post('/surgery/:surgeryId/intraop', recordIntraOp);
router.post('/surgery/:surgeryId/complete', completeSurgery);
router.post('/pacu/:surgeryId/discharge', dischargeFromPACU);
router.post('/transfer/:surgeryId', transferToWard);
router.post('/turnover/:id/complete', completeTurnover);

router.get('/:id', getSurgery);
router.put('/:id/status', updateSurgeryStatus);

export default router;
