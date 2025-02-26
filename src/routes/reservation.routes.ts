import { Router } from 'express';
import reservationController from '../controllers/reservation.controller';

const router = Router();

router.get('/reservations/:id', reservationController.getReservationById);
router.post('/reservations/simulate', reservationController.getSimulation);
router.post('/reservations/create', reservationController.createReservation);
router.post('/reservations/commit', reservationController.commitSimulation);
router.get('/reservations/status/:id', reservationController.getReservationsByStatusId);
router.put('/reservations/', reservationController.updateReservationStatus);

export default router;
