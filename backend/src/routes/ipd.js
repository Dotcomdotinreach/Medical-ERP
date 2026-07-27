import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import {
  getDashboard,
  getWards,
  getRooms,
  getBeds,
  getAdmissionRequests,
  admitPatient,
  approveAdmissionRequest,
  getAdmission,
  getInpatients,
  transferPatient,
  approveTransfer,
  getIsolationPatients,
  getBedsideStatus,
  getDischargePlanning,
  getDischargeChecklist,
  dischargePatient,
  getCleaningBeds,
  completeCleaning,
  inspectBed,
  getOccupancy,
  getReport,
} from '../controllers/ipdController.js';
import {
  listAdmissions,
  admitPatient as admitPatientMain,
  getAdmission as getAdmissionMain,
  transferPatient as transferPatientMain,
  dischargePatient as dischargePatientMain,
} from '../controllers/admissionController.js';

const router = Router();

router.use(authenticate);

router.get('/dashboard', getDashboard);
router.get('/wards', getWards);
router.get('/rooms', getRooms);
router.get('/beds', getBeds);
router.get('/admission-requests', getAdmissionRequests);
router.post('/', admitPatient);
router.post('/admission-requests/:id/approve', approveAdmissionRequest);
router.get('/inpatients', getInpatients);
router.get('/isolation', getIsolationPatients);
router.get('/bedside', getBedsideStatus);
router.get('/discharge-planning', getDischargePlanning);
router.get('/discharge-checklist/:uhid', getDischargeChecklist);
router.post('/discharge/:uhid', dischargePatient);
router.get('/cleaning', getCleaningBeds);
router.post('/cleaning/:id/complete', completeCleaning);
router.post('/cleaning/:id/inspect', inspectBed);
router.get('/occupancy', getOccupancy);
router.get('/transfers/:id', approveTransfer);
router.post('/transfers/:id/approve', approveTransfer);
router.post('/:id/transfer', transferPatient);
router.get('/:id', getAdmission);
router.get('/reports/:type', getReport);

// Frontend compatible REST aliases for IPD admissions and stats
router.get('/admissions', listAdmissions);
router.post('/admissions', admitPatientMain);
router.get('/admissions/:id', getAdmissionMain);
router.put('/admissions/:id', transferPatientMain);
router.patch('/admissions/:id/discharge', dischargePatientMain);
router.put('/admissions/:id/discharge', dischargePatientMain);
router.patch('/admissions/:id/transfer', transferPatientMain);
router.put('/admissions/:id/transfer', transferPatientMain);
router.get('/stats', getDashboard);

export default router;
