import express from 'express';
import vacation from '../controllers/vacationController.js';

const router = express.Router();

router.get('/vacation', vacation.getAllVacations);
router.get('/vacations', vacation.getAllVacationData);
router.get('/vacation/:vacation_id', vacation.getVacationById);
router.post('/vacation', vacation.createVacation);
router.put('/vacation/:vacation_id', vacation.updateVacation);
router.delete('/vacation/:vacation_id', vacation.deleteVacation);

export default router;