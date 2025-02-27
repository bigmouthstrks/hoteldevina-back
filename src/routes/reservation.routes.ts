import { Router } from 'express';
import reservationController from '../controllers/reservation.controller';

const router = Router();

router.get('/reservations/:id', reservationController.getReservationById);
router.post('/reservations/simulate', reservationController.getSimulation);
router.post('/reservations/create', reservationController.createReservation);
router.post('/reservations/commit', reservationController.commitSimulation);
router.get('/reservations/status/:id', reservationController.getReservationsByStatusId);
router.put('/reservations/:id', reservationController.updateReservationById);
router.post('/reservations/check-in/:id', reservationController.checkIn);
router.post('/reservations/check-out/:id', reservationController.checkOut);

export default router;
